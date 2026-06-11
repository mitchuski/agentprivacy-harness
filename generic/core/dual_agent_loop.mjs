// core/dual_agent_loop.mjs
// =============================================================================
// THE FOUNDATION — the generic Swordsman ⚔️ ⊥ Mage 🧙 autoresearch loop.
//
// Target-agnostic. Every concrete harness is a CONFIG (the three seats filled in)
// passed to dualAgentHarness(). The PQC/ecdsa.fail harness is the first instance
// (see ../../shor-mage/harness.config.mjs). To build a new sword-mage harness, write a
// new config that satisfies the SEAT CONTRACT (see ./SEAT_CONTRACT.md) — you should NOT
// need to touch this file.
//
// ALGEBRA (agentprivacy-docs/privacy_value_v6_formal_specification.md):
//   (⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ ; proven on Z/64Z: neg(bnot(x)) = succ(x).
//   ⚔️ Swordsman = neg = PROVER.  🧙 Mage = bnot = PROPOSER.
//   ⿻ the Gap = the held-out gate = non-collusion I(Y_S;Y_M|X)=0 (the proposer
//   cannot see/tune the witnesses the prover will draw). succ (a validated result)
//   emerges only from the two held apart.
//
// RUNTIME ADAPTER: pass `rt = { agent, parallel, pipeline, phase, log }`. Under the
// Workflow tool these are globals (and that runtime has NO import — use the bundled
// ../../shor-mage/swordsman_mage_pqc.workflow.mjs there). Under the Claude Agent SDK /
// a node orchestrator, import this module and supply your own rt.
// =============================================================================

/**
 * Run the dual-agent loop. See ./SEAT_CONTRACT.md for the full config shape.
 * @param {object} config  the three seats + objective + stop conditions + schemas
 * @param {object} rt       { agent, parallel, pipeline, phase, log }
 * @returns {Promise<{rounds:number, confirmed:any[], best:any|null, note:string}>}
 */
export async function dualAgentHarness(config, rt) {
  const { agent, parallel, pipeline, phase, log } = rt;
  const {
    name = 'sword-mage',
    heldApartRule,
    finders,                 // 🧙 Mage proposers — the complement pair + lenses
    measurePrompt,           // (round) => string   — Eos
    huntPrompt,              // (proposal, i) => string   — ⿻ the Gap
    assayPrompt,             // (proposal, hunt, i) => string   — ⚔️ Swordsman
    criticPrompt,            // (validated, all) => string   — Poros
    schemas,                 // { proposal, hunt, verdict, critic }
    stop = { dryRounds: 2, maxRounds: 12 },
    isValidated = (v) => v && v.validated && v.verdict === 'validated' && v.beatsFrontier,
    isStructural = (critic) => critic && critic.classification === 'structural',
    hasCandidate = (hunt) => !!hunt,   // does this hunt result carry something to assay? (generic; configs may override)
  } = config;

  if (!heldApartRule) throw new Error('config.heldApartRule is required — it is the non-collusion guard injected into every Mage prompt.');
  if (!Array.isArray(finders) || !finders.length) throw new Error('config.finders must be a non-empty array (the Mage proposers).');

  log(`⚔️⊥⿻⊥🧙 [${name}] — the Gap holds proposer and prover apart. neg ⊕ bnot → succ.`);

  const confirmed = [];
  let dryRounds = 0, round = 0;

  while (dryRounds < stop.dryRounds && round < stop.maxRounds) {
    round += 1;
    log(`── Round ${round} ──`);

    // ── Measure (Eos): sync the real frontier; meter every lever's TRUE cost. ──
    phase('Measure');
    const measure = await agent(measurePrompt(round), { phase: 'Measure', label: `eos:measure:r${round}` });
    log(`Eos: ${String(measure).slice(0, 240)}`);

    // ── Propose (Mage 🧙 = bnot): finders in parallel, each blind to the others ──
    // and HELD APART from the witnesses (non-collusion enforced by heldApartRule).
    phase('Propose');
    const proposals = (await parallel(
      finders.map((f) => () =>
        agent(
          `You are the MAGE 🧙 (bnot · conceal · reduce), lens = ${f.lens}.\nMANDATE: ${f.mandate}\n\nTHIS ROUND'S MEASUREMENT (Eos — ground your proposal in it, do not re-measure):\n${String(measure).slice(0, 1500)}\n\nHELD-APART RULE (non-collusion, I(Y_S;Y_M|X)=0): ${heldApartRule}\n\nPropose ONE bounded change (RCI Before-step): the smallest fix, its source-backed rationale, expected effect on each objective factor, and whether it is structural.`,
          { phase: 'Propose', label: `mage:${f.lens}:r${round}`, schema: schemas.proposal, input: f }
        )
      )
    )).filter(Boolean);

    if (!proposals.length) { log('Mage proposed nothing — dry round.'); dryRounds += 1; continue; }
    log(`Mage proposed ${proposals.length}.`);

    // ── Gap → Swordsman: pipeline each proposal independently (no barrier). ──
    const results = await pipeline(
      proposals,
      // Stage 1 — ⿻ the Gap: reseed the held-out witnesses, screen for candidates.
      (p, _orig, i) => agent(huntPrompt(p, i), { phase: 'Hunt', label: `gap:hunt:r${round}:p${i}`, schema: schemas.hunt, input: p }),
      // Stage 2 — ⚔️ Swordsman: cliff-watcher (the product) then the FULL held-out gate.
      (hunt, p, i) => {
        if (!hasCandidate(hunt)) return null;
        return agent(assayPrompt(p, hunt, i), { phase: 'Assay', label: `sword:assay:r${round}:p${i}`, schema: schemas.verdict, input: { proposal: p, hunt } });
      }
    );

    const validated = results.filter(Boolean).filter(isValidated);
    validated.forEach((v) => confirmed.push({ round, ...v }));

    // ── Critic (Poros): structural or probe-limited? Did the floor move? ──
    phase('Critic');
    const critic = await agent(criticPrompt(validated, results.filter(Boolean)), { phase: 'Critic', label: `poros:critic:r${round}`, schema: schemas.critic });

    if (validated.length && isStructural(critic)) {
      dryRounds = 0;
      log(`✓ Round ${round}: ${validated.length} structural validated win(s).`);
    } else {
      dryRounds += 1;
      log(`· Round ${round}: ${(critic && critic.classification) || 'no gain'} (dry ${dryRounds}/${stop.dryRounds}). Next: ${(critic && critic.nextLead) || '—'}`);
    }
  }

  const best = confirmed.length ? confirmed.reduce((a, b) => (a.score <= b.score ? a : b)) : null;
  log(`Done after ${round} round(s). ${confirmed.length} validated improvement(s) survived the Gap.`);
  return {
    rounds: round,
    confirmed,
    best,
    note: 'neg ⊕ bnot → succ: validated results emerged only from proposer ⊥ prover held apart by the Gap. Nothing is "proven" until the held-out gate says so. Bake/submit are human-triggered.',
  };
}
