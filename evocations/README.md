# evocations — call the harness up against a knowledge base

An evocation is a harness instance whose artefact is a document, or a whole
corpus, whose metric is its length, and whose gate is a census the proposer
cannot tune to: every number, ratio, defined term, named protocol, heading and
emphasised phrase the artefact carries must survive the compression, or the
lever is MIRAGE. The hard constraint is that the result still reads as the
thing it was. What survives is a shorter canon that every later reader, a
person or an agent, pays less to read, with its meaning provably intact and
its provenance re-derivable from bytes.

Run one on your own, on your own documents, with your own models. Or run one
as a mage, in the City, against the *Privacy is Value* corpus below, and bring
the fold back. The same loop serves a private knowledge base, a VPK, or a VTA
data room: a community compresses and rehydrates its own documentation under
a census it agreed, and consensus on what a document says is what survives
the gate, not what anyone declared.

## The board

| evocation | artefact | words | census N | state |
|---|---|---|---|---|
| `primer` | *What Agentprivacy Really Is* — the mission document | 1,998 → **1,573** | 64 — numbers · ratios · headings · emphasised phrases · named terms | **folded r1** (Claude ⊥ gemma3:27b, 64/64); OT-2 open; corpus fold-back = the keeper's door |
| `whitepaper` | *Swordsman ⊥ Mage* whitepaper v6.3 | 13,681 | 162 — numbers and versions · every `##` section · every defined term · named vocabulary · the formal expressions | open · baseline |
| `personas` | the 42 persona skills, bodies under their names | 53,254 | 206 — 42 names · 129 frontmatter invariants (alignment · equation_term · proverb · spell) · 35 distinct `##` headings | open · baseline |

Numbers are cited from each evocation's `frontier.json`; that file is the
authority. Each directory conforms (`node engine/conform.mjs evocations/<name>`),
measures code-side (`node evocations/<name>/tools/measure.mjs`), and gates any
candidate (`node evocations/<name>/tools/check.mjs <candidate>`). The census is
drawn from the artefact by `evocations/_lib/census.mjs` (or
`personas_census.mjs`), pruned by the keeper, and frozen in `census.json`; the
proposer never sees it and may not edit it. The corpus copy of each artefact
is the canon; the evocation's `artifact/` is the working copy, and a validated
fold goes back to the corpus by the keeper's hand.

## Run one

```bash
node engine/conform.mjs evocations/primer
node evocations/primer/tools/measure.mjs
node drivers/run.mjs --instance evocations/primer --driver ollama --propose-model <a> --assay-model <b> --run r1
node tools/verify_run.mjs evocations/primer r1
node evocations/primer/tools/check.mjs evocations/primer/runs/r1/r1.1/p1-<lever>/candidate.md
```

To hand the proposer's seat to an agent that already answered (a Claude Code
subagent, a Workflow seat, a person), write its proposal sets to a JSON file
and pass `--proposals <file> --propose-model "<who>"`; the engine still derives
every seed after the proposals are committed. Two different models in the two
seats is the separation the design wants; `run.json` records the pair.

## Bringing a fold back

A validated candidate, its `run.json`, the verified run directory, and a
chronicle written verdict-first. Open a pull request against this repository,
or bring it to the City's Exchange (`PATHWAYS.md`). Name the method in the
note: *Harness: <your runtime> with the agentprivacy dual-agent harness
(evocations/<name> instance)*. A derived edge proposes; only a signature
mints — the keeper folds.

## What an evocation is not

Not a rewrite for taste. Not a summary. Not a place to add. The census says
what must survive; the hard constraint says what shape it must keep; the
frontier says what number to beat. Everything else is the proposer's, and the
prover's job is the part a script cannot judge.

## Adding one

Copy `primer/`, point `harness.config.mjs` at the new artefact, run
`node evocations/_lib/census.mjs <artefact> > census.draw.json`, read the draw
and prune what is decoration (a date in a header is not a claim; a bold
sentence is emphasis unless it is the document's own thesis), freeze it as
`census.json`, measure, write the frontier baseline, conform. An evocation
that ships without a passing canary is a to-do list, not an evocation.
