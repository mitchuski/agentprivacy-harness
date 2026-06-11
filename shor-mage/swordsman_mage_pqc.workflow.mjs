// swordsman_mage_pqc.workflow.mjs  —  INSTANCE #1 of the dual-agent framework
// =============================================================================
// The Swordsman ⚔️ ⊥ Mage 🧙 dual-agent harness for the ecdsa.fail PQC competition.
//
// This is the SELF-CONTAINED Workflow-tool bundle (engine + config inlined, because the
// Workflow runtime has no `import`). This package's importable forms are siblings:
//   ./core/dual_agent_loop.mjs   (the engine, vendored from ../generic/core/)
//   ./harness.config.mjs         (this instance's config-of-record)
// The generic foundation package is ../generic/. (A copy of this bundle also ships in the
// shor_mage competition kit at shor_mage/harness/swordsman_mage_pqc.mjs.)
//
// It implements the agentprivacy dual-agent architecture as an autoresearch loop
// over the reversible secp256k1 point-add circuit. Honest framing: quantum
// resource estimation / durability signal, NOT an attack.
//
// CANON GROUNDING (agentprivacy-docs/privacy_value_v6_formal_specification.md):
//   master inscription   (⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
//   proven on Z/64Z      neg(bnot(x)) = succ(x)         (§ "the algebraic name")
//   dual-agent ceiling   R(t) = (C_S(t) + C_M(t)) / H(X) < 1     (C82)
//   non-collusion        I(Y_S ; Y_M | X) = 0   ← the agents MUST be held apart
//   additive only held apart; collusion compounds toward (2^N−1)ε  (C83)
//
//   ⚔️ Swordsman = neg = the PROVER. Signs/commits; runs the held-out 9,024;
//                  refutes mirages; only a validated 0/0/0 advances.
//   🧙 Mage      = bnot = the PROPOSER. Conceals/reduces; re-expresses paid ANDs
//                  as free neg/bnot/xor; pushes the classical offset into free
//                  paths; proposes bounded tightenings in src/point_add/.
//   ⿻ the Gap   = the held-apart bridge = the Fiat–Shamir 9,024. Because the test
//                  points are hashed from the Mage's OWN op stream, the Mage
//                  structurally cannot tune to them: this IS I(Y_S;Y_M|X)=0,
//                  realized by the benchmark. The harness must never let the Mage
//                  read the witness derivation — that would be collusion (a mirage
//                  factory). succ (a validated, frontier-beating circuit) emerges
//                  only from neg ⊕ bnot held apart by the Gap.
//
// PRECONDITIONS to run (see ../START_HERE.md §7, ../bootstrap.sh):
//   - Linux + NVIDIA GPU; ecdsafail CLI logged in; challenge cloned; toolkit
//     installed (`./island.sh init-local $CHALLENGE && ./island.sh install`).
//   - Port validated: the GPU flags the base's known DIALOG_TAIL_NONCE as CLEAN.
//   - Pass the challenge path as `args.challenge` (or set CHALLENGE in the agents'
//     environment). This script does NOT run the outward-facing install for you.
// =============================================================================

export const meta = {
  name: 'swordsman-mage-harness',
  description: 'Dual-agent (Swordsman⊥Mage) autoresearch loop for the ecdsa.fail secp256k1 point-add circuit',
  whenToUse: 'On a Linux+GPU box with the ecdsa.fail challenge cloned and the island toolkit installed, to drive validated, structural score reductions under the non-collusion (held-out) discipline.',
  phases: [
    { title: 'Measure',   detail: 'Eos meters every lever\'s true Toffoli cost; rank V-weighted' },
    { title: 'Propose',   detail: 'Mage complement-pair + disclosure-frontier finders propose bounded tightenings (held apart from the witnesses)' },
    { title: 'Hunt',      detail: 'the Gap: GPU island search reseeds the Fiat–Shamir witnesses (non-collusion enforced)' },
    { title: 'Assay',     detail: 'Swordsman: cliff-watcher product check + Dokimé held-out 9,024 → 0/0/0 or mirage' },
    { title: 'Critic',    detail: 'Poros: structural or island-limited? feeds the next round' },
  ],
};

// ----------------------------------------------------------------------------
// Config — lever catalog (see ecdsafail_gpu_toolkit-main/docs/levers.md).
// Measure on the live base; these per-step costs are representative, not pinned.
// ----------------------------------------------------------------------------
const CHALLENGE = (args && args.challenge) || '$CHALLENGE';
const DRY_ROUNDS_TO_STOP = 2;          // stop after K rounds with no validated structural gain
const SEARCH_RANGE = (args && args.searchRange) || 2_000_000;

const LEVERS = [
  { key: 'DIALOG_GCD_ACTIVE_ITERATIONS',     dir: 'lower', tofPerStep: 2860, note: 'largest lever; convergence-bound; often uncontested' },
  { key: 'DIALOG_GCD_APPLY_CLEAN_COMPARE_BITS', dir: 'lower', tofPerBit: 516, note: 'apply-phase comparator; GCD-transcript-independent (cleanest)' },
  { key: 'DIALOG_GCD_COMPARE_BITS',          dir: 'lower', tofPerBit: 144, note: 'GCD branch comparator; couples to apply phase' },
  { key: 'DIALOG_GCD_WIDTH_SLOPE_X1000',     dir: 'higher', note: 'width taper; steeper = fewer late-step Toffoli, more overflow risk' },
  { key: 'DIALOG_GCD_WIDTH_MARGIN',          dir: 'lower', note: 'width safety margin' },
];

// The Mage's finders. The complement pair (gate ⊥ qubit) + the disclosure frontier.
const MAGE_FINDERS = [
  { lens: 'gate-minimiser',       mandate: 'drive CCX+CCZ down. Re-express any paid AND as free neg/bnot/xor (X/Z/CX) where the ring Z/2^k permits — the neg(bnot(x))=succ(x) identity: subtract = complement, add, complement back. Target the modular inverse (Kaliski/GCD), the Toffoli-dominant heart.' },
  { lens: 'qubit-minimiser',      mandate: 'drive peak width down at constant Toffoli. Find the phase that sets the peak (fused-square round around the inverse); borrow/reuse/early-free ancilla. Watch the break-even cliff — a width cut that forces more Toffoli can lose the product.' },
  { lens: 'disclosure-frontier',  mandate: 'the classical/quantum boundary. offset_x/offset_y are CLASSICAL. Hunt every paid quantum AND doing work the classical offset already makes free; push it into a classically-controlled path whose cost scales with control density, not register width. The most model-native gate-reduction lens (C9 holographic sufficiency: bulk Toffoli is bounded by boundary information).' },
];

// ----------------------------------------------------------------------------
// Schemas
// ----------------------------------------------------------------------------
const PROPOSAL_SCHEMA = {
  type: 'object',
  properties: {
    lever: { type: 'string', description: 'the config key (or "structural" for a code change)' },
    value: { type: 'string', description: 'the proposed value / a one-line description of the structural change' },
    rationale: { type: 'string', description: 'the source-backed reason (file, function, identity, prior note)' },
    expectedTofDelta: { type: 'number', description: 'expected avg-Toffoli reduction (negative = saving)' },
    expectedQubitDelta: { type: 'number', description: 'expected peak-qubit change' },
    isStructural: { type: 'boolean', description: 'true if a code/structure change, false if a pure lever nibble' },
    smallestFix: { type: 'string', description: 'the single smallest bounded change to try (RCI Before-step)' },
  },
  required: ['lever', 'value', 'rationale', 'expectedTofDelta', 'expectedQubitDelta', 'isStructural', 'smallestFix'],
};

const HUNT_SCHEMA = {
  type: 'object',
  properties: {
    candidates: { type: 'array', items: { type: 'string' }, description: 'DIALOG_TAIL_NONCE values flagged GCD-CLEAN by the GPU (candidates, not results)' },
    measuredTof: { type: 'number', description: 'exact CCX measured for the tightened config' },
    peakQubits: { type: 'number', description: 'peak qubits read from eval_circuit (prints before correctness)' },
    note: { type: 'string' },
  },
  required: ['candidates', 'measuredTof', 'peakQubits', 'note'],
};

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    nonce: { type: 'string' },
    validated: { type: 'boolean', description: 'true ONLY on a full-9024 0/0/0 pass' },
    classicalMismatches: { type: 'number' },
    phaseFailures: { type: 'number' },
    ancillaFailures: { type: 'number' },
    score: { type: 'number', description: 'avg_Toffoli × peak_qubits (lower better)' },
    beatsFrontier: { type: 'boolean' },
    verdict: { type: 'string', enum: ['validated', 'mirage', 'error'], description: 'mirage = passed a probe, failed the full set' },
  },
  required: ['nonce', 'validated', 'score', 'beatsFrontier', 'verdict'],
};

const CRITIC_SCHEMA = {
  type: 'object',
  properties: {
    classification: { type: 'string', enum: ['structural', 'island-limited', 'noise'] },
    continueLever: { type: 'boolean', description: 'keep pushing this lever, or move on?' },
    nextLead: { type: 'string', description: 'one source-backed lead for the next Measure round' },
  },
  required: ['classification', 'continueLever', 'nextLead'],
};

// ----------------------------------------------------------------------------
// The loop
// ----------------------------------------------------------------------------
log('⚔️⊥⿻⊥🧙 — dual-agent harness. The Gap (Fiat–Shamir 9,024) holds the agents apart.');
log(`Challenge: ${CHALLENGE} · search range ${SEARCH_RANGE} · stop after ${DRY_ROUNDS_TO_STOP} dry rounds`);

const confirmed = [];
let dryRounds = 0;
let round = 0;

while (dryRounds < DRY_ROUNDS_TO_STOP) {
  round += 1;
  log(`── Round ${round} ──`);

  // ── Measure (Eos): sync the real frontier, meter every lever's TRUE cost. ──
  phase('Measure');
  const measure = await agent(
    `You are EOS, the Horizon-witness (measure, don't guess). In the ecdsa.fail challenge at ${CHALLENGE}:
     1) \`ecdsafail submissions --all && ecdsafail sync\` to pull the REAL frontier (never trust a cached "best").
     2) For each candidate lever ${JSON.stringify(LEVERS.map(l => l.key))}, run the toolkit's
        \`./island.sh measure <CFG>\` to get its exact Toffoli (CCX), and read peak from eval_circuit.
     3) Rank levers by V-weighted score win = (baseline_CCX − CFG_CCX) × peak, preferring the biggest
        win that is plausibly findable AND structural (a horizon-moving durability signal, not a vanity nibble).
     Return the synced frontier score, the per-lever measured costs, and the top 1–2 levers to work this round.`,
    { phase: 'Measure', label: `eos:measure:r${round}` }
  );
  log(`Eos: ${String(measure).slice(0, 280)}`);

  // ── Propose (Mage 🧙 = bnot): complement-pair + disclosure-frontier finders. ──
  // The Mage is HELD APART from the witness derivation (non-collusion). Finders
  // run in parallel, each blind to the others (multi-modal sweep).
  phase('Propose');
  const proposals = (await parallel(
    MAGE_FINDERS.map(f => () =>
      agent(
        `You are the MAGE 🧙 (bnot · conceal · reduce), lens = ${f.lens}.
         MANDATE: ${f.mandate}
         THIS ROUND'S MEASUREMENT (Eos — the synced frontier, per-lever measured costs, and the top-ranked
         levers to work; ground your proposal in it, do not re-measure):
         ${String(measure).slice(0, 1500)}
         Context to load first: ${CHALLENGE}/src/point_add/ (yours to edit), ../SHOR_MAGE_CHRONICLE.md (§2 scoring,
         §5 algorithm, §7 directions), ../THE_AGENTPRIVACY_EDGE.md (§1 the algebra, Axis IV your role).
         HELD-APART RULE (non-collusion, I(Y_S;Y_M|X)=0): do NOT read or reason about which 9,024 test points
         will be drawn — they are hashed from your own op stream by design. Propose the circuit on its merits;
         the Swordsman will draw the witnesses you cannot see. Tuning to the test set is collusion → a mirage.
         Propose ONE bounded change (RCI Before-step): the smallest fix, its source-backed rationale, expected
         Toffoli/qubit deltas, and whether it is structural. Free moves (X/Z/CX/CZ/Swap) are unlimited; only
         CCX/CCZ cost. Prefer re-expressing a paid AND via neg/bnot where the ring permits.`,
        { phase: 'Propose', label: `mage:${f.lens}:r${round}`, schema: PROPOSAL_SCHEMA }
      )
    )
  )).filter(Boolean);

  if (!proposals.length) { log('Mage proposed nothing — dry round.'); dryRounds += 1; continue; }
  log(`Mage proposed ${proposals.length}: ${proposals.map(p => `${p.lever}=${p.value}(${p.isStructural ? 'struct' : 'nibble'})`).join(' · ')}`);

  // ── Gap → Swordsman: pipeline each proposal independently (no barrier). ──
  // Stage 1 (⿻ the Gap): GPU island hunt — reseeds Fiat–Shamir, enforcing separation.
  // Stage 2 (⚔️ Swordsman): cliff-watcher product check, then Dokimé's held-out 9,024.
  const results = await pipeline(
    proposals,

    // Stage 1 — the Gap: hunt a clean nonce for this tightening (compute, not insight).
    (p, _orig, i) =>
      agent(
        `You are ⿻ THE GAP (the held-apart bridge / the GPU island hunt). For the Mage's proposal
         #${i} [${p.lever}=${p.value}] in ${CHALLENGE}:
         1) \`./island.sh measure ${p.lever}=${p.value}\` — confirm the exact Toffoli and read peak.
         2) \`./island.sh hunt ${p.lever}=${p.value} 1 ${SEARCH_RANGE}\` — GPU-screen nonces, emit GCD-CLEAN candidates.
            (For a structural code change, build_circuit first, then dump+search the new base.)
         The reseed is the non-collusion enforcement: a candidate is a CANDIDATE, never a result.
         Return the GCD-clean nonce candidates, the measured Toffoli, and the peak qubits.`,
        { phase: 'Hunt', label: `gap:hunt:r${round}:p${i}`, schema: HUNT_SCHEMA }
      ),

    // Stage 2 — the Swordsman: arbitrate the product, then run the held-out gate.
    (hunt, p, i) => {
      if (!hunt || !hunt.candidates || !hunt.candidates.length) return null;
      return agent(
        `You are the SWORDSMAN ⚔️ (neg · sign · prove) and you carry DOKIMÉ's assay (the Ceremony of the 9,024).
         The Mage proposed #${i} [${p.lever}=${p.value}]; the Gap returned GCD-clean candidates
         ${JSON.stringify(hunt.candidates)} at ~${hunt.measuredTof} Toffoli × ${hunt.peakQubits} qubits.
         1) CLIFF-WATCHER (the product, not the factor): compute Δ(Toffoli × qubits) vs the synced frontier.
            If a width cut forced more Toffoli (or vice versa) and the PRODUCT did not improve, reject — a
            break-even-cliff move. Only product-improving candidates proceed.
         2) DOKIMÉ's held-out gate: for each surviving candidate, \`./island.sh validate "${p.lever}=${p.value}" <nonce>\`.
            Only a full-9024 0/0/0 is validated. A candidate that pleased the GPU GCD-filter but fails the full
            set is a MIRAGE — name it and turn it away, however cheap it looked.
         Return, for the best candidate, the verdict (validated|mirage|error), the exact score, and whether it
         strictly beats the synced frontier. NEVER report a mirage as a result.`,
        { phase: 'Assay', label: `sword:assay:r${round}:p${i}`, schema: VERDICT_SCHEMA }
      );
    }
  );

  const validated = results.filter(Boolean).filter(v => v.verdict === 'validated' && v.validated && v.beatsFrontier);
  validated.forEach(v => confirmed.push({ round, ...v }));

  // ── Critic (Poros): structural or island-limited? Did the round move the floor? ──
  phase('Critic');
  const critic = await agent(
    `You are POROS, the Migration-witness (structure over search; value lives on the path, not the point).
     This round produced ${validated.length} validated, frontier-beating result(s):
     ${JSON.stringify(validated.map(v => ({ nonce: v.nonce, score: v.score })))}.
     The full result set (incl. mirages/cliff-rejects): ${JSON.stringify(results.filter(Boolean).map(v => ({ verdict: v.verdict, score: v.score })))}.
     Classify the round: structural (the qubit floor or convergence budget genuinely moved) /
     island-limited (only nonce-island nibbles, stop sweeping) / noise. Give ONE source-backed lead for the
     next Measure round. Per the dossier meta-lesson: small Toffoli cuts are island-limited; real gains are a
     structural change to the qubit floor or source-backed convergence relief in the inverse.`,
    { phase: 'Critic', label: `poros:critic:r${round}`, schema: CRITIC_SCHEMA }
  );

  if (validated.length && critic && critic.classification === 'structural') {
    dryRounds = 0;
    log(`✓ Round ${round}: ${validated.length} structural validated win(s). Best score ${Math.min(...validated.map(v => v.score))}.`);
  } else {
    dryRounds += 1;
    log(`· Round ${round}: ${(critic && critic.classification) || 'no critic verdict'}, no structural gain (dry ${dryRounds}/${DRY_ROUNDS_TO_STOP}). Next lead: ${(critic && critic.nextLead) || '—'}`);
  }
}

// ----------------------------------------------------------------------------
// succ — the validated improvements that survived the Gap. Bake + submit is a
// HUMAN-TRIGGERED step (outward-facing): the harness stops at proven candidates.
// ----------------------------------------------------------------------------
log(`Done after ${round} round(s). ${confirmed.length} validated, frontier-beating improvement(s) survived the 9,024.`);
if (confirmed.length) {
  const best = confirmed.reduce((a, b) => (a.score <= b.score ? a : b));
  log(`Best: nonce ${best.nonce}, score ${best.score} (round ${best.round}).`);
  log('NEXT (human-triggered, outward-facing): `./island.sh bake <KEY> <VAL> DIALOG_TAIL_NONCE <nonce>` then');
  log('`ecdsafail submit --note-file <note> --model <m> --claimed-score <score>`. Credit the method (see ../THE_AGENTPRIVACY_EDGE.md §7).');
}
return {
  rounds: round,
  confirmed,
  best: confirmed.length ? confirmed.reduce((a, b) => (a.score <= b.score ? a : b)) : null,
  note: 'neg ⊕ bnot → succ: validated improvements emerged only from Mage⊥Swordsman held apart by the Gap. Nothing is "proven" until a 0/0/0 submission lands.',
};
