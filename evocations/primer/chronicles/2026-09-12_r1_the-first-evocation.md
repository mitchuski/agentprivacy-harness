---
date: 2026-09-12
seat: keystone
runId: r1
verdict: The first evocation folded. The mission document went 1,998 → 1,573 words (21 percent) at a 64/64 census, hard constraint held; two Claude proposals, both VALIDATED by a local 27B prover, both structural; seeds verified. The keystone confirmed every appendix row and the substance of every original bullet survived under the new list form. The fold is in the evocation's artefact; carrying it into the corpus is the keeper's door.
---

# 2026-09-12 — r1: the first evocation

## Verdict

**Folded: 1,998 → 1,573 words, census 64/64, hard constraint held.**
`runs/r1/run.json`: COMPLETE, one round, VALIDATED 2 · MIRAGE 0 · BLOCKED 0,
proposer `claude-opus-5 (Claude Code subagents, one per lens)`, prover
gemma3:27b, phiInference 1. `node tools/verify_run.mjs evocations/primer r1`:
RUN VERIFIED.

| proposal | words | census | verdict | fold |
|---|---|---|---|---|
| line-edit-body-prose | 1,875 | 64/64 | VALIDATED, structural | dominated; not folded |
| restructure-lists-tables-merge | 1,573 | 64/64 | VALIDATED, structural | **folded** |

## What happened

The evocation was drawn on 2026-09-12: the mission document copied from the
corpus, a census of 64 witnesses (its numbers and ratios, every heading, every
emphasised phrase, the named vocabulary, plus five hand-added lines: the 678×
figure the drawer's regex missed, the opening thesis, the separation claim,
the compression-ratio sentence, the two named agents) drawn, pruned and
frozen; baseline 1,998 at 64/64.

Two Claude Code subagents took the proposer's seat, one per lens, blind to
the census, told which categories of string to keep. Their proposals were
committed to `runs/r1/proposals.handed.json` before any seed derived. The
engine hashed each with a fresh salt; the whole census was the draw. The
local 27B held the Gap, the prover, the critic and the chronicle. Both
candidates carried all 64 witnesses on the code-side census before the round
ran; the prover's job was the hard constraint, and it validated both.

The restructurer's lever folded every bulleted list and every appendix table
into inline lists with each item's text kept, removed the ten horizontal rules
and the throat-clearing openers, and stated the confluence once. The
keystone's own check before folding: all 27 appendix table rows present; all
60 original bullet items present in substance under the new phrasing (a
prefix match flagged 20, every one of which was a rewording, not a loss).

## Reversals

- **The census has no witness for form.** A table and an inline list carry
  the same strings, so the census could not see the change; the prover
  accepted it under the hard constraint as written ("the appendix still lists
  every platform…"). The keystone agrees for this artefact. If the corpus
  owner wants the appendix kept as tables, the hard constraint or the census
  needs to say so; OT-2 records the gap.
- The line-editor's lever also validated, at 1,875; dominated by the fold.
- The prover's evidence was again generic ("adheres to the specified
  structure"); the census carried the verdict, and the keystone's row and
  bullet checks did the rest. Same finding as the self-fold: a local 27B is a
  sufficient prover for a census gate and a thin one for judgment.

## Ledger entries returned

- `frontier.json`: best 1,573 · history row, coverage census 64/64 detection
  1.0 · attempt r1 · OT-1 closed · OT-2 open · `corpusFoldBack` PENDING.
- `artifact/PRIMER.md` replaced by the candidate bytes; `node tools/measure.mjs`
  → 1,573, 64/64.
- No kills this round.

## Handoff

- **Door (the keeper's):** carry the fold into
  `agentprivacy-docs/what-agentprivacy-is.md`. The evocation's artefact is the
  working copy; the corpus copy is the canon, and writing to another
  repository is an outward act (T6). Diff: `evocations/primer/artifact/PRIMER.md`
  against the corpus file.
- **nextLead:** OT-2 — the line-editor's cuts compose on top of the fold; a
  form witness if tables are to be kept. Then the whitepaper evocation, where
  the census is 162 and the artefact is seven times longer.
