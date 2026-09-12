# examples/self — the harness folds its own newcomer path

The artefact is `artifact/PATH.md`: the README the default distribution ships.
The objective is its word count, down. The gate is a census over
`census.json` — every command, file, trust, ground rule, seat, phase and term
a newcomer must still be able to find — and one dropped witness fails the
lever. The hard constraint is that the result is still the document a
stranger opens first.

This is the spar's shape turned on the repository itself, and it is why the
README reads the way it does: a validated fold here becomes
`templates/README.default.md`, and the run that produced it stays in `runs/`
as the first sample of what a fold looks like.

```bash
node tools/measure.mjs                       # words · census N · passed (the counting rule, code-side)
node tools/check_path.mjs [candidate.md]     # the gate on any candidate; exit 1 on a miss
node ../../drivers/run.mjs --instance . --driver stub --run smoke              # the loop, no model
node ../../drivers/run.mjs --instance . --driver ollama --propose-model <a> --assay-model <b> --run r1
node ../../tools/verify_run.mjs . r1         # re-derive every seed
node ../../tools/render_run.mjs . r1         # runs/r1/run.html
```

**The first sample is in `runs/r1`** (2026-09-12): proposer gemma3:12b, prover
gemma3:27b, two proposals, two mirages — a 720-word rewrite that dropped 13
witnesses and a 379-word one that dropped 44 — every seed re-deriving, no
fold. `chronicles/2026-09-12_r1_two-mirages.md` tells it verdict first,
including the runner defect the run found. That is what a round looks like
when the gate holds.

Fold as keystone: `node tools/check_path.mjs runs/r1/r1.1/p<i>-<lever>/candidate.md`
must print `pass: true` and a word count below `frontier.json` best; then copy
the candidate over `artifact/PATH.md`, write the new number into
`frontier.json` with the run as evidence, and file the chronicle. The census
is not the proposer's to edit.
