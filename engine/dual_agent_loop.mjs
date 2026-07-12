// dual_agent_loop.mjs — the soulbis ⚔️ ⊥ soulbae 🧙 dual-agent harness engine.
//
//   (⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
//
// Target-agnostic. A concrete harness is a CONFIG (see SEAT_CONTRACT.md)
// passed to runHarness(config, rt). The two invariants the loop exists to
// keep: I(Y_S; Y_M | X) = 0 (the proposer never touches the held-out
// witnesses) and I(S; M | FP) < ε (the pair share only their root in the
// First Person). See TRUSTS.md.
//
// rt = { agent, parallel, pipeline, phase, log } — the Claude Code Workflow
// globals, or your own driver. No imports here: tools/bundle.mjs concatenates
// this file with a config into one self-contained .workflow.mjs.

export function bootPreamble(root, repo, seatCard) {
  return `You are a seat in a soulbis/soulbae dual-agent harness. Instance: ${repo}. Skeleton root: ${root}.
BOOT (mandatory, in order): read ${root}/GROUND_RULES.md, then ${root}/TRUSTS.md, then your seat card ${root}/seats/${seatCard}, then ${repo}/frontier.json. If any of these files is missing, STOP and return an error naming the missing path — do not proceed unbound (T3). GR-1..GR-10 and trusts T1..T6 bind you. Read nothing else shared between seats (T3). Your final message is consumed as data by the orchestrator, not shown to a human.`
}

export function validateConfig(config) {
  const errs = []
  const need = (cond, msg) => { if (!cond) errs.push(msg) }
  need(config && typeof config.name === 'string' && config.name, 'config.name required')
  need(config?.door === 'first-person', "config.door must be the literal 'first-person' (T6: the door is the First Person's)")
  need(typeof config?.heldApartRule === 'string' && config.heldApartRule.trim().length > 0, 'config.heldApartRule required (T2/GR-4: the Gap is held apart)')
  need(config?.objective?.metric, 'config.objective.metric required (GR-1)')
  need(config?.objective?.gate, 'config.objective.gate required (T5: the multiplicative gate)')
  need(config?.objective?.hardConstraint, 'config.objective.hardConstraint required (GR-3)')
  need(Array.isArray(config?.keystoneOnlyWrites) && config.keystoneOnlyWrites.length > 0, 'config.keystoneOnlyWrites required (GR-10)')
  need(Array.isArray(config?.finders) && config.finders.length >= 2, 'config.finders needs >= 2 lenses (blind complements)')
  if (Array.isArray(config?.finders)) {
    const lenses = new Set(config.finders.map(f => f && f.lens))
    need(lenses.size === config.finders.length, 'config.finders lenses must be distinct')
  }
  for (const p of ['measure', 'propose', 'holdApart', 'assay', 'critic', 'chronicle']) {
    need(typeof config?.prompts?.[p] === 'function', `config.prompts.${p} required (T1: the promises must be seated)`)
  }
  for (const s of ['measure', 'proposal', 'gap', 'verdict', 'critic']) {
    need(config?.schemas?.[s] && typeof config.schemas[s] === 'object', `config.schemas.${s} required`)
  }
  need(typeof config?.isValidated === 'function', 'config.isValidated required')
  need(typeof config?.isStructural === 'function', 'config.isStructural required')
  need(Number.isFinite(config?.stop?.dryRounds) && config.stop.dryRounds >= 1, 'config.stop.dryRounds required')
  need(Number.isFinite(config?.stop?.maxRounds) && config.stop.maxRounds >= 1, 'config.stop.maxRounds required')
  return errs
}

export async function runHarness(config, rt, runArgs = {}) {
  const { agent, parallel, pipeline, phase, log } = rt
  const errs = validateConfig(config)
  if (errs.length) throw new Error('config violates the seat contract:\n  - ' + errs.join('\n  - '))

  const repo = String(runArgs.repo || config.repo || '').replace(/\\/g, '/')
  if (!repo) throw new Error('runArgs.repo required (absolute path to the harness instance)')
  // root = where GROUND_RULES.md, TRUSTS.md, and seats/ live (the skeleton
  // clone). Defaults to the instance itself, which is only correct if the
  // instance carries its own copies (T3: every seat boots from the same docs).
  const root = String(runArgs.root || config.root || repo).replace(/\\/g, '/')
  const runId = String(runArgs.runId || 'r0')
  const runRoot = `${repo}/runs/${runId}`
  const BOOT = (card) => bootPreamble(root, repo, card)

  // ctx.args exposes the run's arguments to prompt builders, so a config can
  // scope a run (one section, one module, one file) instead of turning every
  // round loose on the whole target. Scope is declared by the CONFIG and the
  // First Person — never by the proposer (T2).
  //
  // ctx.runDir is ROUND-SCOPED: runs/<runId>/<roundId>/. It must be, and the
  // spar's first real run proved why. Two rounds whose proposers independently
  // mint the same leverId used to land in the SAME directory —
  // runs/<runId>/p<i>-<leverId> — and the later round silently overwrote the
  // earlier round's proposal_canon.json, destroying an audit trail a verdict
  // still claimed. A win an auditor cannot reproduce is not a win (GR-4). With
  // the round in the path, every (round, proposal) scratch dir is unique, and
  // no config prompt needs to change since they all build from ctx.runDir.
  const ctxFor = (roundId) => ({ root, repo, runId, roundId, runDir: `${runRoot}/${roundId}`, runRoot, config, args: runArgs })

  // Per-seat model/effort. A measure that counts words and a Gap that must
  // hash and draw are not the same job; paying frontier prices for both is how
  // a round dies of its own weight. Defaults to the caller's model.
  const seatOpts = (seat) => (config.seatOpts && config.seatOpts[seat]) || {}

  const rounds = []
  const tally = { VALIDATED: 0, MIRAGE: 0, BLOCKED: 0 }
  let confirmed = []
  let dry = 0
  let round = 0
  let aborted = null   // set when a round dies of infrastructure, not of ideas

  while (dry < config.stop.dryRounds && round < config.stop.maxRounds) {
    round += 1
    const roundId = `${runId}.${round}`
    const ctx = ctxFor(roundId)   // round-scoped scratch: runs/<runId>/<roundId>/

    // ---- Measure — numbers only, no advocacy ----
    phase('Measure')
    log(`round ${roundId} opens — measure syncs the frontier`)
    const measure = await agent(`${BOOT('measure.md')}\n${config.prompts.measure(ctx)}`,
      { label: `measure:${roundId}`, phase: 'Measure', schema: config.schemas.measure, ...seatOpts('measure') })

    // ---- Propose — soulbae 🧙, parallel lenses, blind to each other ----
    phase('Propose')
    const proposalSets = await parallel(config.finders.map(f => () => agent(
      `${BOOT('soulbae-propose.md')}\nHELD-APART RULE (T2/GR-4, binding): ${config.heldApartRule}\n${config.prompts.propose(f, measure, ctx)}`,
      { label: `propose:${f.lens}`, phase: 'Propose', schema: config.schemas.proposal, ...seatOpts('propose') })))
    const proposals = proposalSets.filter(Boolean).flatMap(s => s.proposals || [])
    log(`${proposals.length} proposal(s) on the table: ${proposals.map(p => p.leverId).join(', ') || 'none'}`)

    let closed = []
    let critic = null
    if (proposals.length > 0) {
      // ---- per proposal: Hold-apart (the Gap ⿻) then Assay (soulbis ⚔️), no barrier ----
      closed = (await pipeline(
        proposals,
        (p, _item, i) => agent(
          `${BOOT('gap-hold-apart.md')}\n${config.prompts.holdApart(p, i, ctx)}`,
          { label: `gap:${p.leverId}`, phase: 'Hold-apart', schema: config.schemas.gap, ...seatOpts('holdApart') }),
        (gap, p, i) => gap ? agent(
          `${BOOT('soulbis-assay.md')}\n${config.prompts.assay(p, gap, i, ctx)}`,
          { label: `assay:${p.leverId}`, phase: 'Assay', schema: config.schemas.verdict, ...seatOpts('assay') }) : null,
      )).filter(Boolean)
      for (const v of closed) tally[v.status] = (tally[v.status] || 0) + 1
      log(`assay closed: ${closed.length}/${proposals.length} — ${JSON.stringify(tally)}`)

      // ---- Critic — the only barrier: classifies the WHOLE round ----
      phase('Critic')
      critic = await agent(
        `${BOOT('critic.md')}\n${config.prompts.critic(proposals, closed, ctx)}`,
        { label: `critic:${roundId}`, phase: 'Critic', schema: config.schemas.critic, ...seatOpts('critic') })
    }

    // ---- Chronicle — draft only; the keystone reviews and files ----
    phase('Chronicle')
    const roundData = { roundId, measure, proposals, verdicts: closed, critic }
    const chronicle = await agent(
      `${BOOT('chronicle.md')}\n${config.prompts.chronicle(roundData, ctx)}`,
      { label: `chronicle:${roundId}`, phase: 'Chronicle', ...seatOpts('chronicle') })

    // ---- failure accounting (GR-5): a seat that DIED is not a seat that
    // found nothing. A round that lost agents to infrastructure carries no
    // evidence either way, and must never be counted as a dry round —
    // otherwise stop.dryRounds silently converts an outage into "the search
    // is exhausted", and the run reports a clean stop over a pile of corpses.
    const failures = []
    if (measure == null) failures.push('measure')
    const deadFinders = proposalSets.filter(s => s == null).length
    if (deadFinders) failures.push(`propose×${deadFinders}/${config.finders.length}`)
    if (proposals.length > 0) {
      const deadClosings = proposals.length - closed.length
      if (deadClosings) failures.push(`hold-apart|assay×${deadClosings}/${proposals.length}`)
      if (critic == null) failures.push('critic')
    }
    if (chronicle == null) failures.push('chronicle')

    // ---- dry-round accounting: only validated AND structural resets ----
    const validated = closed.filter(v => config.isValidated(v, measure))
    const structural = critic ? validated.filter(v => config.isStructural(critic, v.leverId)) : []

    if (failures.length > 0) {
      aborted = { roundId, failures }
      rounds.push({ ...roundData, roundStatus: 'FAILED', failures, chronicleDraft: chronicle ? String(chronicle).slice(0, 600) : null, validated: [] })
      log(`ROUND ${roundId} FAILED — dead seats: ${failures.join(', ')}. NOT counted as a dry round. Stopping: an incomplete round proves nothing (GR-5).`)
      break
    }

    if (structural.length > 0) { dry = 0; confirmed = confirmed.concat(structural) } else { dry += 1 }
    rounds.push({ ...roundData, roundStatus: 'COMPLETE', chronicleDraft: String(chronicle).slice(0, 600), validated: validated.map(v => v.leverId) })
    log(`round ${roundId} closes — ${structural.length} structural win(s), dry=${dry}/${config.stop.dryRounds}`)
  }

  const status = aborted ? 'INCOMPLETE' : 'COMPLETE'
  return {
    name: config.name, runId, status, rounds: rounds.length, tally, confirmed,
    best: confirmed.length ? confirmed[confirmed.length - 1] : null,
    detail: rounds,
    ...(aborted ? { aborted } : {}),
    keystoneTodo: aborted
      ? `RUN INCOMPLETE — round ${aborted.roundId} lost seats to infrastructure (${aborted.failures.join(', ')}), not to exhausted ideas. FOLD NOTHING: no gate ran on the dead seats, so no verdict here is evidence (GR-5). Re-run the round; the surviving proposals are candidates, not results. Do not move frontier.json.`
      : 'fold VALIDATED levers (frontier.json first, prose second — GR-1); file killedLeverDrafts (GR-6); review + file the chronicle drafts (GR-7); node engine/conform.mjs green before and after (G0); door items listed for the First Person, never opened (G4/T6)',
  }
}
