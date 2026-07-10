#!/usr/bin/env node
// loop.test.mjs — regression tests for the failure accounting in runHarness.
//
// The bug this file exists to prevent (found by running universe-builder u1,
// 2026-07-10): every Gap agent died of a session limit, the engine counted the
// wreckage as a "dry round", ran a second round that also died, hit
// stop.dryRounds, and returned a clean-looking result with tally 0/0/0 — as
// though the search had simply run out of ideas. An outage must never be
// reported as exhaustion.
//
//   node engine/loop.test.mjs

import { runHarness } from './dual_agent_loop.mjs'

let failed = 0
const ok = (cond, msg) => { if (cond) { console.log(`  ok   ${msg}`) } else { failed++; console.error(`  FAIL ${msg}`) } }

// A config that satisfies the seat contract and nothing more.
const cfg = (over = {}) => ({
  name: 'test',
  objective: { metric: 'm', gate: 'g', hardConstraint: 'h' },
  door: 'first-person',
  heldApartRule: 'witnesses derive from the proposal by hashing',
  keystoneOnlyWrites: ['frontier.json'],
  finders: [{ lens: 'a', hint: 'a' }, { lens: 'b', hint: 'b' }],
  prompts: { measure: () => 'm', propose: () => 'p', holdApart: () => 'h', assay: () => 'a', critic: () => 'c', chronicle: () => 'ch' },
  schemas: { measure: {}, proposal: {}, gap: {}, verdict: {}, critic: {} },
  stop: { dryRounds: 2, maxRounds: 4 },
  isValidated: (v) => v.status === 'VALIDATED',
  isStructural: (critic, id) => (critic?.classifications || []).some(c => c.leverId === id && c.class === 'structural'),
  ...over,
})

// rt whose `agent` is driven by a label->handler table. A handler returning
// null models the runtime's own failure semantics (parallel/pipeline resolve
// dead agents to null).
const makeRt = (handler) => {
  const seen = []
  return {
    seen,
    agent: async (_prompt, opts) => { seen.push(opts.label); return handler(opts.label) },
    parallel: async (thunks) => Promise.all(thunks.map(t => t().catch(() => null))),
    pipeline: async (items, ...stages) => Promise.all(items.map(async (item, i) => {
      let prev = item
      for (const s of stages) { prev = await s(prev, item, i); if (prev == null) return null }
      return prev
    })),
    phase: () => {}, log: () => {},
  }
}

const A = { repo: '/tmp/x', runId: 'r' }
const proposalSet = { proposals: [{ leverId: 'lev-1' }] }

// ---- 1. the u1 bug: every Gap dies ----------------------------------------
{
  const rt = makeRt(l =>
    l.startsWith('gap:') ? null
    : l.startsWith('measure') ? { metric: 1 }
    : l.startsWith('propose') ? proposalSet
    : l.startsWith('chronicle') ? 'draft'
    : { classifications: [] })
  const r = await runHarness(cfg(), rt, A)

  console.log('1. all Gap agents die (the u1 outage)')
  ok(r.status === 'INCOMPLETE', 'status is INCOMPLETE, not a clean stop')
  ok(!!r.aborted, 'aborted block is present and names the round')
  ok(r.aborted.failures.some(f => f.includes('hold-apart')), 'the dead seat is named in failures')
  ok(r.rounds === 1, 'stops on the first failed round; does not grind a second')
  ok(r.detail[0].roundStatus === 'FAILED', 'the round is marked FAILED, not dry')
  ok(r.confirmed.length === 0 && r.best === null, 'nothing confirmed, nothing best')
  ok(/FOLD NOTHING/.test(r.keystoneTodo), 'keystoneTodo forbids folding')
  ok(!rt.seen.some(l => l.startsWith('assay:')), 'assay never ran on a dead Gap')
}

// ---- 2. a genuinely dry round is still a dry round -------------------------
{
  const rt = makeRt(l =>
    l.startsWith('measure') ? { metric: 1 }
    : l.startsWith('propose') ? { proposals: [] }   // returned, not died
    : l.startsWith('chronicle') ? 'draft'
    : null)
  const r = await runHarness(cfg(), rt, A)

  console.log('2. finders return zero proposals (real exhaustion)')
  ok(r.status === 'COMPLETE', 'status is COMPLETE — an empty search is evidence')
  ok(r.rounds === 2, 'runs until stop.dryRounds, as designed')
  ok(r.detail.every(d => d.roundStatus === 'COMPLETE'), 'rounds are COMPLETE, not FAILED')
}

// ---- 3. a dead measure aborts before anything downstream is believed -------
{
  const rt = makeRt(l => l.startsWith('measure') ? null : l.startsWith('chronicle') ? 'd' : proposalSet)
  const r = await runHarness(cfg(), rt, A)

  console.log('3. measure dies')
  ok(r.status === 'INCOMPLETE', 'status is INCOMPLETE')
  ok(r.aborted.failures.includes('measure'), 'measure named as the dead seat')
}

// ---- 4. a dead critic is a failure, not a silent zero ----------------------
{
  const rt = makeRt(l =>
    l.startsWith('measure') ? { metric: 1 }
    : l.startsWith('propose') ? proposalSet
    : l.startsWith('gap:') ? { seedHex: 'ab' }
    : l.startsWith('assay:') ? { leverId: 'lev-1', status: 'VALIDATED' }
    : l.startsWith('critic') ? null
    : 'draft')
  const r = await runHarness(cfg(), rt, A)

  console.log('4. critic dies after a VALIDATED assay')
  ok(r.status === 'INCOMPLETE', 'status is INCOMPLETE')
  ok(r.aborted.failures.includes('critic'), 'critic named')
  ok(r.confirmed.length === 0, 'a VALIDATED lever is NOT confirmed without its critic — structural is unproven')
}

// ---- 5. the happy path still works ----------------------------------------
// Each blind lens proposes its OWN lever, as distinct lenses should. (When two
// lenses collide on the same leverId the engine assays it once per proposal
// and tallies it twice — see test 6.)
{
  const rt = makeRt(l =>
    l.startsWith('measure') ? { metric: 1 }
    : l === 'propose:a' ? { proposals: [{ leverId: 'lev-a' }] }
    : l === 'propose:b' ? { proposals: [{ leverId: 'lev-b' }] }
    : l.startsWith('gap:') ? { seedHex: 'ab' }
    : l.startsWith('assay:') ? { leverId: l.slice('assay:'.length), status: 'VALIDATED' }
    : l.startsWith('critic') ? { classifications: [{ leverId: 'lev-a', class: 'structural' }, { leverId: 'lev-b', class: 'probe-limited' }] }
    : 'draft')
  const r = await runHarness(cfg({ stop: { dryRounds: 1, maxRounds: 1 } }), rt, A)

  console.log('5. two lenses, one structural win')
  ok(r.status === 'COMPLETE', 'status is COMPLETE')
  ok(r.tally.VALIDATED === 2, 'both levers assayed VALIDATED')
  ok(r.confirmed.length === 1 && r.best?.leverId === 'lev-a', 'only the STRUCTURAL lever is confirmed; probe-limited is not')
  ok(!/FOLD NOTHING/.test(r.keystoneTodo), 'keystoneTodo invites the fold')
}

// ---- 6. colliding leverIds across blind lenses (documented, not fixed) -----
// Two lenses that are blind to each other can independently mint the same
// kebab id. The engine assays each proposal separately (correct: they are
// different texts) but the tally double-counts the id. Recorded so the
// behaviour is a known one rather than a surprise in a chronicle.
{
  const rt = makeRt(l =>
    l.startsWith('measure') ? { metric: 1 }
    : l.startsWith('propose') ? { proposals: [{ leverId: 'same-id' }] }
    : l.startsWith('gap:') ? { seedHex: 'ab' }
    : l.startsWith('assay:') ? { leverId: 'same-id', status: 'VALIDATED' }
    : l.startsWith('critic') ? { classifications: [{ leverId: 'same-id', class: 'structural' }] }
    : 'draft')
  const r = await runHarness(cfg({ stop: { dryRounds: 1, maxRounds: 1 } }), rt, A)

  console.log('6. two blind lenses collide on one leverId')
  ok(r.tally.VALIDATED === 2, 'tally counts the id twice — one per proposal')
  ok(r.confirmed.length === 2, 'and confirms it twice; the keystone must dedupe before folding')
}

console.log(failed ? `\nLOOP TESTS FAIL (${failed})` : '\nLOOP TESTS PASS — an outage is reported as an outage, not as exhaustion.')
process.exit(failed ? 1 : 0)
