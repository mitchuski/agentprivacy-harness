#!/usr/bin/env node
// loop.salt.test.mjs — the D1 salt, verified through the loop at code level.
//
//   node engine/loop.salt.test.mjs
//
// Proves the hardening the field-guide spar will run under, WITHOUT any LLM
// call: the loop code-derives each proposal's seed and draw from a run secret
// the proposer never sees, so grinding the proposal cannot fix the draw, and
// the code-derived values are the ones handed to the Gap seat.

import { runHarness, deriveHoldApart } from './dual_agent_loop.mjs'
import { deriveSeed, draw, hashProposal, perProposalSalt, canonicalize, hashCanon } from './gap.mjs'

let failed = 0
const ok = (cond, msg) => { if (cond) console.log(`  ok   ${msg}`); else { failed++; console.error(`  FAIL ${msg}`) } }

// ---- 1. deriveHoldApart: salted vs legacy --------------------------------
{
  const p = { leverId: 'x', compressedText: 'preserve every fact', expectedMetric: 3 }
  const gate = { N: 32, count: 8, mode: 'sample' }
  const secret = 'a'.repeat(64) // 32-byte hex, the run's, unseen by seats

  const legacy = deriveHoldApart(p, { gate, saltSecret: null, sourceHash: null })
  ok(legacy === null, 'no saltSecret → legacy mode (Gap computes its own seed, back-compat)')

  const noGate = deriveHoldApart(p, { gate: null, saltSecret: secret, sourceHash: null })
  ok(noGate === null, 'no declared gate.N → legacy mode')

  const d = deriveHoldApart(p, { gate, saltSecret: secret, sourceHash: null })
  ok(d && d.salted, 'saltSecret + gate.N → salted mode')
  const hP = hashProposal(p)
  ok(d.hProposal === hP, 'hProposal is the canonical proposal hash')
  ok(d.salt === perProposalSalt(secret, hP), 'salt = sha256(secret || hProposal)')
  ok(d.seedHex === deriveSeed({ hProposal: hP, salt: d.salt }), 'seed folds the salt off the proposal hash')
  ok(d.seedHex !== hP, 'seed is NOT the bare proposal hash (the legacy grindable value)')
  ok(JSON.stringify(d.drawIndices) === JSON.stringify(draw(d.seedHex, 32, 8)), 'draw replays deterministically from the seed')
  ok(d.drawIndices.length === 8 && new Set(d.drawIndices).size === 8, 'sample draw is 8 distinct facts')
}

// ---- 2. census mode probes every fact ------------------------------------
{
  const p = { leverId: 'y', compressedText: 't' }
  const d = deriveHoldApart(p, { gate: { N: 32, count: 8, mode: 'census' }, saltSecret: 'b'.repeat(64) })
  ok(JSON.stringify(d.drawIndices) === JSON.stringify(Array.from({ length: 32 }, (_, i) => i + 1)), 'census mode draws all 32 facts (no omission can hide)')
}

// ---- 3. grind-resistance: the proposer cannot predict the draw -----------
// A grinder perturbs its proposal to move the draw. Under the LEGACY rule this
// works (seed = h_proposal, public). Under the SALT it cannot: without the
// secret, every perturbation gives a draw the grinder cannot compute.
{
  const gate = { N: 32, count: 8, mode: 'sample' }
  const secret = 'c'.repeat(64) // the honest run's secret — the grinder does NOT have it
  const DROPPED = 17

  // The grinder's model of the world is the legacy rule (all it can compute
  // without the secret). It searches for a variant whose LEGACY draw omits 17.
  let grinderPick = null
  for (let pad = 1; pad <= 64; pad++) {
    const variant = { leverId: 'grind', compressedText: 'drops 17', _pad: ' '.repeat(pad) }
    const legacySeed = hashCanon(canonicalize(variant)) // what the grinder can compute
    if (!draw(legacySeed, 32, 8).includes(DROPPED)) { grinderPick = variant; break }
  }
  ok(grinderPick !== null, 'grinder finds a variant that beats the LEGACY rule (the D1 attack, reproduced)')

  // But the real gate salts the seed. The grinder's chosen variant is now
  // graded on the SALTED draw, which it could not see. Over the honest secret,
  // its dropped fact is exposed whenever the salted draw hits 17 — base rate.
  const dSalted = deriveHoldApart(grinderPick, { gate, saltSecret: secret })
  const legacyDraw = draw(hashCanon(canonicalize(grinderPick)), 32, 8)
  ok(!legacyDraw.includes(DROPPED), 'the variant does dodge the draw the grinder optimised against (legacy)')
  ok(JSON.stringify(dSalted.drawIndices) !== JSON.stringify(legacyDraw), 'the SALTED draw differs from the one the grinder optimised — its work is void')

  // The salted draw is unpredictable to the grinder: sweeping every variant it
  // could try, it cannot force 17 out of the SALTED draw without the secret.
  // Show the salt breaks the correlation: the grinder's best legacy variant is
  // caught at (or near) the base rate on the salted draw across secrets.
  let caught = 0, tried = 0
  for (let s = 0; s < 200; s++) {
    const secretS = hashCanon('secret-' + s) // stand-ins for the run CSPRNG
    const dS = deriveHoldApart(grinderPick, { gate, saltSecret: secretS })
    tried++
    if (dS.drawIndices.includes(DROPPED)) caught++
  }
  const rate = caught / tried
  ok(rate > 0.15 && rate < 0.35, `salted catch rate ≈ base rate 8/32=0.25 (measured ${(rate * 100).toFixed(0)}%) — grinding buys nothing`)
}

// ---- 4. the loop hands the CODE-DERIVED seed/draw to the Gap seat ---------
// A stub rt captures the Gap prompt; assert it carries the loop's seed/draw,
// not something the seat was left to compute.
{
  const captured = { holdApart: [] }
  const rt = {
    agent: async (prompt, opts) => {
      if (opts.label?.startsWith('gap:')) captured.holdApart.push(prompt)
      if (opts.label?.startsWith('measure')) return { metric: 1 }
      if (opts.label?.startsWith('propose')) return { proposals: [{ leverId: 'lev-salt', compressedText: 'keeps all facts' }] }
      if (opts.label?.startsWith('gap:')) return { seedHex: 'x', draw: '[]', transcript: 't' }
      if (opts.label?.startsWith('assay:')) return { leverId: 'lev-salt', status: 'MIRAGE', gateResult: '7/8', evidence: 'e' }
      if (opts.label?.startsWith('critic')) return { classifications: [], nextLead: 'n' }
      return 'draft'
    },
    parallel: async (thunks) => Promise.all(thunks.map(t => t().catch(() => null))),
    pipeline: async (items, ...stages) => Promise.all(items.map(async (item, i) => {
      let prev = item
      for (const s of stages) { prev = await s(prev, item, i); if (prev == null) return null }
      return prev
    })),
    phase: () => {}, log: () => {},
  }

  const cfg = {
    name: 'salt-smoke',
    objective: { metric: 'words', gate: 'g', hardConstraint: 'h' },
    door: 'first-person',
    heldApartRule: 'witnesses derive from a salted hash the proposer never sees',
    keystoneOnlyWrites: ['frontier.json'],
    finders: [{ lens: 'a', hint: 'a' }, { lens: 'b', hint: 'b' }],
    gate: { N: 32, count: 8, mode: 'sample' },
    prompts: {
      measure: () => 'm',
      propose: () => 'p',
      // the real signature: (proposal, i, ctx, derived) — the seat is HANDED the seed/draw
      holdApart: (p, i, ctx, derived) => `GAP for ${p.leverId}. seed=${derived?.seedHex} draw=${JSON.stringify(derived?.drawIndices)}`,
      assay: () => 'a', critic: () => 'c', chronicle: () => 'ch',
    },
    schemas: { measure: {}, proposal: {}, gap: {}, verdict: {}, critic: {} },
    stop: { dryRounds: 1, maxRounds: 1 },
    isValidated: (v) => v.status === 'VALIDATED',
    isStructural: () => false,
  }

  const secret = 'd'.repeat(64)
  const r = await runHarness(cfg, rt, { repo: '/tmp/x', runId: 'r', saltSecret: secret })
  ok(captured.holdApart.length === 2, 'both Gap seats ran')
  const expected = deriveHoldApart({ leverId: 'lev-salt', compressedText: 'keeps all facts' }, { gate: cfg.gate, saltSecret: secret })
  ok(captured.holdApart[0].includes(`seed=${expected.seedHex}`), 'the Gap prompt carries the loop-derived seed (not a seat-computed one)')
  ok(captured.holdApart[0].includes(`draw=${JSON.stringify(expected.drawIndices)}`), 'the Gap prompt carries the loop-derived draw')
  ok(Array.isArray(r.detail[0].holdApart) && r.detail[0].holdApart[0]?.salted, 'the round record carries the salted derivation (for the manifest)')
  ok(r.detail[0].proposalsLog[0]?.hProposal === expected.hProposal, 'the retry ledger records the committed proposal hash')
}

console.log('')
if (failed) { console.error(`${failed} salt-mode assertion(s) FAILED.`); process.exit(1) }
console.log('loop.salt.test: the D1 salt holds through the loop.')
