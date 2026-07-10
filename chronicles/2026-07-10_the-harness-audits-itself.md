---
date: 2026-07-10
seat: keystone (soulbae 🧙 ⊥ soulbis ⚔️)
scope: the core repo — engine, gate, bundler, cold start, and the universe layer
verdict: Three rounds run. Nothing validated. Six defects found, all by running.
commits: fe31743 · 3d8808f · 433ae4d · b7f1898
---

# The harness audits itself

**Verdict first.** Across this session the harness ran three rounds against a
real target, **validated nothing**, folded nothing, moved no frontier — and
found six defects, every one of them by being run rather than by being read.
Two were in the engine. Two were in the gate that guards the engine. One was in
the vocabulary the critic thinks with. And one was in the premise of the
instance itself.

That is not a disappointing session. It is the only kind of session this repo's
own rules would let me call a good one, because **a candidate is not a result**
and nothing here became a result.

## What was actually built

- `engine/loop.test.mjs` — six tests, pinning the failure semantics.
- `tools/new_instance.mjs` — the on-ramp that tells you what is still missing.
- `tools/check.mjs` — one command, every gate.
- `universe/audit.mjs` — the exhaustive auditor that replaced a harness.
- `objective.canary` — advised by `conform.mjs`, documented in the contract.
- `mis-gated` — the critic's fourth classification.
- `HARNESS_PATHS.md` #9 — the negative result, kept on purpose.

## The six defects, in the order they surfaced

**1 · An outage was reported as an exhausted search.** Round `u1` lost twelve
of seventeen agents to a session limit, including every Gap. With `closed`
empty, `structural` was empty, so the loop incremented `dry`, ran a second
round that also died, hit `stop.dryRounds`, and returned
`{rounds: 2, tally: 0/0/0}` — indistinguishable from an honest exhaustion.
`stop.dryRounds`, which exists so a loop stops rather than grinds, had become a
mechanism that laundered infrastructure collapse into a tidy negative result.
Fixed: a round that loses a seat is `FAILED`, does not count as dry, breaks the
loop, and returns `status: INCOMPLETE` with `keystoneTodo: FOLD NOTHING`.
**Empty is evidence; dead is not.**

**2 · The gate passed a config that grades nothing.** `conform.mjs` accepted a
config whose objective read, literally, `"TODO — what frontier.json tracks"`.
A newcomer could copy the template, put one number in the frontier, see
`CONFORM PASS`, bundle, and run a harness that grades nothing and reports
`VALIDATED`. **A gate that passes an unfilled config is worth less than no gate,
because it is believed.** Both `conform.mjs` and `bundle.mjs` now refuse, in the
same words — two refusals that disagree means only the softer one exists.

**3 · The error blamed the user for the template's own placeholder.**
`frontier: baseline.metric missing` — it was not missing. The template ships it
`null` on purpose, because you cannot have a baseline until you measure one.
The gate was right to fail and wrong about why. It now teaches instead.

**4 · The gate demanded a transcript while the objective demanded compression.**
Round `u2` ran perfectly — 9/9 agents, seeds re-derived by the auditor's own
`sha256sum`, verdicts on disk — and returned `MIRAGE ×2` at `0/8`. Both
candidates **beat the metric**. Both were refused, because a zero in the gate
collapses the product (T5). And both refusals were *correct and useless*: the
Gap had been drawing arbitrary facts — a licence string, a JSON `version`
field, a `process.exitCode` expression — from **612 KB of sources** that the
**7 KB map** was never responsible for carrying. The feasible set was empty.
**A gate no candidate can pass is not a gate; it is a wall.**

**5 · The critic had no word for a bad gate.** It classified both levers
`structural`, and argued it well: two seeds, two orthogonal lenses, identical
`0/8`. Every sentence true, the conclusion wrong — that evidence is exactly
what a mis-specified gate produces. But `structural`, `probe-limited`, and
`noise` **all blame the proposal**. Its own `nextLead` proves the cost: it told
the map to become a verbatim transcript, i.e. to satisfy the gate by abandoning
the objective. It was not confused. It was **cornered**. Added `mis-gated`, the
only classification that accuses the config — and the rule that it files no
killed lever, because *a kill recorded against a gate the lever could not pass
is a fence around good ground* (GR-6).

**6 · The instance was never a harness.** The Fiat-Shamir Gap costs real money
and buys exactly one thing: an honest sample of a claim space too large to
check. shor_mage samples 9,024 witnesses because you cannot run every input.
The universe map makes ~100 claims and **every one is enumerable**. Check them
all, and a mirage becomes impossible — *there is nothing to tune to.* The
repo's own applicability test said so on the page I was quoting from: the
harness transfers where artifacts must survive **adversarial** scrutiny. An
auditor that reads every claim is not an adversary. It is an integrity gate.

Two rounds, ~1.4M subagent tokens, zero evidence about the map. Then
`universe/audit.mjs`, on its **first run**, in milliseconds, for zero tokens,
found the dropped `cast` layer — the very defect `u2`'s `by-container` lens had
found and been unable to validate. Then it caught a stale frontier and two
dangling traces that the *retirement itself* introduced. It chains. That is the
relationship you want with a gate.

## The reversals, at win-prominence

Three claims of mine died this session, and each death was worth more than the
claim.

- **`mage.mesh` is drift.** It is not. The name was *deliberately never
  canonised* — a fixed universal name is the completeness Gödel warns against.
  The grep was right; every inference from it was wrong. **An unnamed thing and
  a deliberately-unnamed thing look identical to `grep`, and only one is a gap.**
- **`SPECIALISATION.md`'s wing rule.** "Propose takes a mage-aligned persona."
  The only worked instance seats swordsman-aligned personas at *both* algebra
  seats and is correct to. **The separation is carried by the Gap and the
  algebra, never by the costume.** An instance that trusts the costume has a
  wing where it needs a Gap.
- **"`universe/` is the artifact of a harness whose target is the corpus."**
  It reads well. It was aesthetic work wearing engineering clothes.

## The thing that keeps happening

Every defect above was invisible to inspection and obvious on execution. The
toy passed for months because **nothing in it ever died**. The gate passed
unfilled configs because nobody ever handed it one. The critic's taxonomy was
complete until a gate was wrong.

And it happened once more, inside this very chronicle's session: I wrote a
negative test asserting *"the blank template must fail conform"*, and it passed
happily while I had TODO detection completely disabled — because the template
also fails on its null baseline. **A check that can pass for the wrong reason
is worse than no check: it reports health it never measured.** The test now
asserts *which* gates fired, and I proved it by mutation — kill either check
and `check.mjs` names the corpse.

That is the whole discipline in one sentence. Not *"be careful"* — careful
people wrote all six defects. **Run it, and let it tell you.**

## Handoff

**Open questions**
- Should `objective.canary` become a hard `conform.mjs` failure? It would break
  sibling instances until they adopt it. First Person's call.
- The `countingRule` glob excludes `notes/KILLED_LEVERS.md`. Decide the rule;
  do not quietly change the number.

**Blocked**
- Nothing.

**Single next action**
- Run the toy end-to-end (`examples/field-guide`, `runId: r1`) and confirm a
  stranger's first go produces a real verdict and a re-derivable seed. Then, and
  only then, decide the remote.

**Proverb.** *Sample only what you cannot count. What you can count, count —
and no mirage will survive the counting.*

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
