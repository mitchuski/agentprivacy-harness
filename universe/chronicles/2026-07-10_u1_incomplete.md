---
date: 2026-07-10
seat: keystone (soulbae 🧙 ⊥ soulbis ⚔️)
runId: u1
verdict: INCOMPLETE — no gate ran. Nothing validated, nothing folded.
frontier_at_close: 7753 words (unchanged; baseline == best)
verdicts: { VALIDATED: 0, MIRAGE: 0, BLOCKED: 0 }
---

# u1 — the round that proved the engine, not the map

**Verdict first.** Round u1 of the universe-builder **did not complete**. The
session hit its token limit mid-run and killed twelve of seventeen agents,
including **all four Gap draws**. No witnesses were derived. No gate ran. The
map is exactly as unvalidated as it was before, and `frontier.json` has not
moved.

The run produced no result. It produced something better: **a defect in the
engine that had been there since the first commit.**

## What the engine did wrong

With every Gap dead, `closed` was empty, so `structural` was empty, so the
loop incremented `dry` and opened a second round. That round also died. `dry`
reached `stop.dryRounds`, the loop exited, and `runHarness` returned:

```
{ rounds: 2, tally: { VALIDATED: 0, MIRAGE: 0, BLOCKED: 0 }, confirmed: [] }
```

Read that return value cold. It says *the search ran two clean rounds and
found nothing structural.* It is indistinguishable from an honest exhaustion.
In fact every seat that could have found something had been dead on arrival.

**The engine reported an outage as exhaustion.** `stop.dryRounds` — the
mechanism that exists so a loop stops rather than grinds — had silently become
a mechanism that converts infrastructure collapse into a tidy negative result.

This is the failure the harness brief's rule 7 names: *checks must fail
loudly.* Our own loop did not.

## The fix

`engine/dual_agent_loop.mjs` now separates **a seat that died** from **a seat
that found nothing**:

- Failure accounting per round: a null `measure`, dead finders, dead
  Gap/assay closings, a dead critic, a dead chronicle — each is named.
- A round with any failure is marked `FAILED`, **does not increment `dry`**,
  and **breaks the loop immediately**. An incomplete round carries no evidence
  either way; grinding a second one only wastes agents.
- `runHarness` returns `status: 'INCOMPLETE' | 'COMPLETE'` and an `aborted`
  block naming the round and the dead seats.
- On INCOMPLETE, `keystoneTodo` reads **FOLD NOTHING**, in as many words.

A genuinely empty search — finders that *return* zero proposals rather than
dying — is still a dry round. Empty is evidence; dead is not.

`engine/loop.test.mjs` is new and pins all of it: the u1 outage itself, a real
dry round, a dead measure, a dead critic after a VALIDATED assay (which must
**not** confirm — structural is unproven without its critic), and the happy
path.

## What else the run found

Two things worth keeping, both from the seats that *did* survive.

**The measure seat was exact.** It re-derived 7,753 words by the counting rule
the frontier declares, matching `baseline` to the word, and flagged
`stale: false`. It also caught something I had not: `notes/KILLED_LEVERS.md`
is a sixth markdown file under `universe/` but sits **outside the
`universe/*.md` glob**, so it is excluded from the metric by the counting rule
as written. That is an ambiguity in the rule, not in the count. It also
declined to sum its own ceiling figures, noting they overlap — a line naming
two corpora counts in both. Numbers only; no advocacy. The seat did its job.

**Four proposals survived and were never assayed.** They are candidates, and
under GR-5 that is all they are. Two are worth naming because they found real
things:

- `five-layers-labelled-topology` (by-container) noticed that the seed map's
  `structure` row comma-joins `cityofmages, game42` and thereby **obscures
  that game42 is a standalone repo with its own head**, `game-of-42.json`. It
  also traced the "mirrors cite, never edit" rule to the mirror's *actual*
  header rather than my paraphrase, and read the live `register_head` there:
  **C96, next free C97** — which is exactly the E-5 staleness the map was
  propagating by omission.
- `seats-registry-by-entity` (by-entity) observed that two-thirds of
  `SEATS.md` is narrative argument rather than traceable entity fact.

**None of this may be folded.** No Gap drew against any of it; no assay graded
it. The proposals are cached against `resumeFromRunId` and can be re-driven
once the limit resets.

A sixth test was added while fixing the fifth: two blind lenses can
independently mint the **same `leverId`**, and the engine will assay each
proposal separately (correct — they are different texts) while the tally counts
the id twice. Documented in `loop.test.mjs` test 6. The keystone must dedupe
before folding. Not a bug; a sharp edge, now with a rail.

## The reversal, recorded

I predicted this run would return `MIRAGE` and expose that several of my seed
claims could not defend their PROVEN tier. **That prediction was not tested.**
It remains an open hypothesis, and I am recording it here so that a later
session cannot mistake my confidence for a result. The defect the run actually
found was in the engine, which I had believed correct because it had passed a
toy.

The toy passed because nothing in it ever died.

## Handoff

**Open questions**
- Does the seed map survive a real 12-question draw? Untested.
- Should `countingRule` include `universe/**/*.md` (and thus KILLED_LEVERS)?

**Blocked**
- Round u1 proper, until the session token limit resets.

**Single next action**
- Re-run u1 with `resumeFromRunId` so the four surviving proposals replay from
  cache and only the Gap onward re-executes. Then read the verdicts, and fold
  only what is VALIDATED **and** structural.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
