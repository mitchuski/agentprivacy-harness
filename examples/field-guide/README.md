# Toy harness: field-guide

Compress a fact-dense document without losing any facts — a domain anyone can
inspect by eye, with a gate that is genuinely un-tunable.

## The setup

- **Artifact:** `artifact/GUIDE.md` — a 730-word guide to preparing a home
  for a 72-hour power outage, deliberately thick with checkable specifics (4
  litres of water per person per day; fridge safe 4 hours; freezer 48 hours
  full but 24 hours half-full; wait 5 minutes before restarting appliances).
- **Objective:** minimize word count, by exactly this rule —
  `tr -s '[:space:]' '\n' < file | grep -c .`
- **Gate (T5):** 8 held-out comprehension questions must all be answered
  correctly *from the compressed text alone*. 7/8 is a zero, not a 87.5%.
- **Hard constraint (GR-3):** the result is still a self-contained
  instruction document — no "see full version".

## Why the gate cannot be gamed

The Gap numbers the facts in the **original** guide (~40 of them), then
hashes the **proposal** — including its full compressed text — to draw 8 of
those facts as questions. soulbae writes the compression without knowing
which 8 will be drawn, and any edit to the text re-seeds the draw. There is
no strategy that beats "keep every fact." That is `I(Y_S ; Y_M | X) = 0` in
a domain you can check with your own eyes.

Then soulbis answers the 8 questions using only the candidate — never opening
the original while answering — and grades against the expected answers the
Gap quoted from the original.

## Run it

```bash
node ../../engine/conform.mjs .   # G0, from this directory
```

Then, in Claude Code, invoke the Workflow tool:

```
scriptPath: examples/field-guide/harness.workflow.mjs
args: { "repo": "<abs path>/examples/field-guide", "root": "<abs path to the skeleton clone>", "runId": "r1" }
```

## What a round looks like

`measure` recounts GUIDE.md and prices the two lenses. `soulbae` runs twice
in parallel — a `line-editor` (sentence-level) and a `restructurer`
(structure-level), blind to each other. For each proposal the `Gap` writes
`runs/r1/p<i>-<leverId>/gap.json` with a seed, a draw, and a transcript that
lets you re-derive both by hand. `soulbis` writes `candidate.md`, answers,
grades, counts, and returns a verdict. `critic` classifies the round.
`chronicle` drafts the record.

Everything lands under `runs/<runId>/`. The frontier does not move.

## Audit the Gap yourself

The separation is only worth what you can check. Each proposal's scratch dir
holds `proposal_canon.json` — the exact bytes the Gap hashed — so anyone, at
any later date, can verify the witnesses were not chosen:

```bash
cd runs/r1/p1-<leverId>
sha256sum proposal_canon.json          # must equal seedHex in gap.json
```

If the digest matches, the 8 questions provably derive from the proposal's own
content, and soulbae could not have known them while writing it. If the file
is missing or the digest differs, the round is void and soulbis returns
`BLOCKED` — which is exactly what happened the first time this toy was run,
before the Gap was required to persist those bytes.

## The fold (keystone, in the main session)

Per `seats/keystone.md`: conform green → write the winning candidate to
`artifact/GUIDE.compressed.md` → update `frontier.json` (numbers first, prose
second) → file the killed-lever drafts and the chronicle → conform green
again.

Note what the fold does **not** do: it never overwrites `GUIDE.md`. The
original stays as the Gap's fact source. That is not an accident of the toy —
it is the PVM shape showing through. The original is the private ledger `X`
that soulbis alone reads in full; the compressed guide is the authorized
disclosure that soulbae projects outward. Publishing it anywhere is G4, and
G4 is yours.

## The mirage drill

Hand-write a proposal that drops exactly one quantified fact — say, the
"24 hours for a half-full freezer" — and feed it through. In expectation the
draw catches it (8 of ~40 facts, so roughly one round in five slips through a
single omission), and when it does, the verdict is `MIRAGE` with the dropped
fact named. The drill teaches the two lessons the harness exists for: a
candidate is not a result, and a probe that passes is not a gate that passes.

Because the draw is probabilistic, a single omission can survive one round.
That is honest, not a bug: it is why `stop.dryRounds` exists, why the critic
distinguishes `structural` from `probe-limited`, and why a real instance
raises the witness count when a proposal claims to beat the frontier.
