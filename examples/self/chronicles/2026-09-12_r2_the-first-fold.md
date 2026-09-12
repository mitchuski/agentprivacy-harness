---
date: 2026-09-12
seat: keystone
runId: r2
verdict: The first fold. Two Claude proposals, both VALIDATED at 95/95 by a local 27B prover, both structural; the restructurer's 1,069-word candidate folded into the artefact and into the default README template (1,115 → 1,069). Seeds verified. A first attempt died of transport and was refused as evidence; the retry stood.
---

# 2026-09-12 — r2: the first fold

## Verdict

**Folded: 1,115 → 1,069 words, census 95/95, hard constraint held.**
`runs/r2/run.json`: COMPLETE, one round, VALIDATED 2 · MIRAGE 0 · BLOCKED 0,
proposer `claude-opus-5 (Claude Code subagents, one per lens)`, prover
gemma3:27b, phiInference 1. Both levers classified structural by the critic.
`node tools/verify_run.mjs examples/self r2`: RUN VERIFIED. The keystone
re-ran `tools/check_path.mjs` on the winning `candidate.md` before folding:
95/95 at 1,069.

| proposal | words | census | verdict | fold |
|---|---|---|---|---|
| line-edit-connective-prose | 1,092 | 95/95 | VALIDATED, structural | dominated; not folded |
| fold-inventory-into-box-and-flags-into-duel | 1,069 | 95/95 | VALIDATED, structural | **folded** |

## What happened

The proposer's seat was handed to two Claude Code subagents, one per lens,
each blind to the other and to the census, each told what the last two
candidates had lost (K-1, K-2) and given the artefact, the frontier and the
kill ledger. Their proposals were committed to `runs/r2/proposals.handed.json`
before the engine derived any seed (`--proposals`); the engine hashed each
proposal's canonical bytes with the run salt, named the whole census as the
draw, and the local 27B took the Gap, the prover's seat, the critic and the
chronicle. The prover judged the hard constraint with the code-side census
beside it and validated both; the critic classed both structural. The
restructurer's lever deleted the prose inventory that the box block already
carries and moved the two-model flags into the rung that introduces the
second model; the line-editor's trimmed connective prose in seven sentences.

## Reversals

- **The first attempt at r2 was refused.** Two seats died of transport
  (`fetch failed` against Ollama while the 27B paged in). The engine marked
  the round INCOMPLETE and refused to count the one VALIDATED verdict that
  had landed (GR-5: an outage is not evidence either way). The attempt is
  kept at `chronicles/evidence/r2-incomplete/` as evidence (outside `runs/`, so `verify_run --all` does not read a refused round as a run). The Ollama driver gained a
  transport retry (four tries, backing off) — a dropped connection is not a
  model answer — and the same hand-off was re-run as `r2`; the seeds are
  fresh (new salt), so nothing carried over but the proposals.
- The line-editor's lever also validated, at 1,092. It is dominated by the
  fold and not applied; its 23 words of cuts compose with the fold and are
  the obvious next lever (OT-2).

## Ledger entries returned

- `frontier.json`: best 1,069 · history row with coverage census 95/95
  detection 1.0 · attempts r2-incomplete and r2 · OT-1 closed · OT-2 opened.
- `artifact/PATH.md` and `templates/README.default.md` replaced by the
  candidate bytes; `node tools/measure.mjs` → 1,069, 95/95.
- No kills this round.

## Handoff

- **The pair that folded:** a frontier-class proposer with a local prover.
  Round one, with a 12B proposer, dropped 13 and 44 witnesses; round two,
  with Claude proposing under the same census and the same local prover,
  dropped none. That is the first row of the fold benchmark worth keeping.
- **nextLead:** apply the line-editor's cuts on top of the fold (OT-2), then
  ask a proposer for a structural lever the census does not forbid: the
  constitution bullets and the loop table are the two witness-dense blocks
  nobody has touched.
