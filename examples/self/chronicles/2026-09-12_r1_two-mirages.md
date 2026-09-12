---
date: 2026-09-12
seat: keystone
runId: r1
verdict: Two proposals, two mirages, no fold. The census caught a 720-word rewrite that dropped 13 witnesses and a 379-word rewrite that dropped 44; every seed re-derives; two different models held the two seats (Φ_inference = 1). The frontier stays at 1,088 words.
---

# 2026-09-12 — r1: two mirages

## Verdict

**Nothing folded.** `runs/r1/run.json`: status COMPLETE, one round, tally
VALIDATED 0 · MIRAGE 2 · BLOCKED 0, proposer gemma3:12b, prover gemma3:27b,
phiInference 1, source sha256 `69e72588…` (the 1,088-word artefact, census
93/93 at measure). `node tools/verify_run.mjs examples/self r1`: RUN
VERIFIED.

| proposal | lens | words | census (code-side) | prover's verdict |
|---|---|---|---|---|
| p1 | line-editor | 720 | 80/93 | MIRAGE — hard constraint |
| p2 | restructurer | 379 | 49/93 | MIRAGE — hard constraint |

The gate did what it is for: both candidates read well and would have passed
a glance; the census found the inscription, two tool names, the API key
variable, the run-file names, Fiat-Shamir, the four rungs and the one-writer
rule gone from the first, and forty-four witnesses gone from the second.

## What happened

Measure counted 1,088 words and 93/93 witnesses. Two proposers, blind to each
other, each rewrote the whole document; the engine hashed each proposal's
canonical bytes with the run salt into a seed and named every census entry as
the draw. The prover re-read each candidate with the code-side census result
in front of it and returned MIRAGE on both, citing the hard constraint; the
critic classified both as structural; the chronicle seat drafted a round
account. The runner persisted the bytes, seeds, candidates and verdicts.

## Reversals

- **Defect #14, in the runner, found by this run.** Both proposals answered
  `leverId: "1"`. `drivers/run.mjs` matched verdicts to proposals by lever id,
  so the second proposal's verdict file was a copy of the first's. Fixed before
  this chronicle was filed: when ids collide the runner matches by position,
  which the engine's pipeline preserves, and records any mismatch on the
  verdict. The verdict files in `runs/r1` are as the old runner wrote them;
  the chronicle draft from the round names p2's census (49/93) independently,
  and `tools/check_path.mjs` re-derives both counts from `candidate.md`.
- The prover's evidence text was generic and identical for both candidates,
  and it omitted `metric` and `gateResult` because the schema does not require
  them. The code-side census is what carried the verdict; the prover's
  contribution was the hard-constraint call. For the fold benchmark this is
  the first declared-model row, and its shape is: a 12B proposer drops
  witnesses under compression, a 27B prover on CPU agrees with the census but
  says little.
- The config now asks for a descriptive `leverId` slug (K-3).

## Ledger entries returned

- `notes/KILLED_LEVERS.md` K-1, K-2 (structural), K-3 (a habit, filed).
- `frontier.json`: no change to best; the run is recorded under `attempts`.

## Handoff

- **nextLead (from the critic, restated):** the line-editor lens is the one
  to re-run — it lost 13 witnesses, not 44; a prompt that lists the census
  categories (commands, file names, identifiers, rungs, the inscription) as
  things to keep verbatim, without listing the witnesses, should close most of
  the gap. A stronger proposer (the Claude API driver, `--driver split` with
  the local prover kept) is the other lever.
- The artefact is about to be re-baselined: the README gained a title and a
  pointer to `PATHWAYS.md` after this run; the census gains two witnesses.
  This run stands against the 1,088-word version, by its recorded source hash.
