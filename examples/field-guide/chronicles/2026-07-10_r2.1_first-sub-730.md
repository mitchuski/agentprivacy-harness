---
date: 2026-07-10
seat: chronicle
runId: r2.1
verdict: Both proposals VALIDATED at gate 8/8 — OT-1 met; fold line-edit (615) as interim frontier, hold restructure (583) pending wider gate.
---

# 2026-07-10 — first sub-730 compressions, one structural one probe-limited

## Verdict

Round r2.1 crossed openTarget OT-1: the first validated compressions below the
frontier best of 730 words (frontier.json). Two levers passed the full held-out
comprehension gate 8/8 with the hard constraint (self-contained instruction
document) intact:

- **line-edit-per-sentence-pass** — 615 words (verdict evidence), classified
  **structural** by the critic. Fact-preserving by construction; safe to fold
  as the interim frontier best now.
- **restructure-lists-and-timing-table** — 583 words (verdict evidence),
  classified **probe-limited**. Deepest win, but completeness is certified only
  at ~8/27 fact coverage; MOVES and MERGES facts, so it should NOT become
  `best` until certified at higher coverage.

Nothing was killed. Frontier best remains 730 in frontier.json until the
keystone folds; the recommended fold is 615, not 583.

## What happened

- **Measure.** Fresh count via the canonical rule
  `tr -s '[:space:]' '\n' | grep -c .` = 730, matching frontier.json baseline
  (730) and best (730); no disagreement, stale=false. best.leverIds empty
  (baseline, no fold). OT-1 still OPEN entering the round. Lever pricing was
  descriptive only: line-editor (low cost, ceiling ~615) and restructurer
  (moderate-high cost, ceiling ~500), both bounded by the need to retain the
  guide's concrete numeric facts for the comprehension gate. Measure seat wrote
  nothing and did not run the conformance gate — that belongs to the keystone.
- **Proposals.** Two levers proposed: line-edit-per-sentence-pass
  (expected 615, line-editor lens) and restructure-lists-and-timing-table
  (expected 583, restructurer lens).
- **Gap seeds.** Fiat-Shamir seeds derived from each proposal_canon.json; both
  reproduced byte-for-byte at assay time (p1 sha256 1a575b6a…, p2 sha256
  80126a02…), confirming the proposer never influenced its own witnesses
  (T2/GR-4).
- **Assay.** Both levers VALIDATED. p1: metric 615, gate 8/8 (Q1–Q8 answered
  from candidate.md alone), constraint holds. p2: metric 583, gate 8/8 (eight
  facts including the F13 timings relocated into the table and F14 folded into
  the fridge/freezer section all survived), constraint holds. Each verdict.json
  written to its own scratch dir in the flat schema shape.
- **Critic.** line-edit → **structural** (the lens tightens wording without
  removing or relocating facts; the gate merely confirms what the lens
  guarantees). restructure → **probe-limited** (deterministic metric win, but
  an aggressive fact-relocating reformat over ~27 facts certified by only 8
  questions ≈ 30% coverage; the sampled risky transforms F13/F14 survived, but
  unsampled facts are not settled). Same 8-question probe, different class:
  a conservative lens converts the probe to certainty, a fact-moving lens does
  not.

## Reversals

Nothing reversed. No lever was killed; both validated. The only restraint is
prudential: the critic withholds `best`-status from the deeper 583 win, so the
recommended frontier move is the shallower-but-certified 615, not the number
that most improves the metric (T5 — the multiplicative gate favours the
certified factor over the larger score).

## Ledger entries returned

For the keystone to serialise (GR-10); numbers cited from verdict evidence:

- **claims_register (PROVEN):** `line-edit-per-sentence-pass` — 615 words,
  gate 8/8, constraint holds, seed sha256 1a575b6a…; scratch at
  `runs/r2/r2.1/p1-line-edit-per-sentence-pass/`. Structural per critic.
- **claims_register (PROVEN):** `restructure-lists-and-timing-table` — 583
  words, gate 8/8, constraint holds, seed sha256 80126a02…; scratch at
  `runs/r2/r2.1/p2-restructure-lists-and-timing-table/`. Probe-limited per
  critic; certified only at ~8/27 fact coverage.
- **frontier.json (proposed fold):** best.metric 730 → 615,
  best.leverIds += `line-edit-per-sentence-pass`, OT-1 status OPEN → MET.
  Do NOT fold 583 as best yet.
- **KILLED_LEVERS:** none this round.

## Handoff

- **Open questions:** Does the restructure candidate (583) preserve facts
  OUTSIDE the r2.1 draws (everything beyond F1,F2,F4,F5,F6,F7,F11,F14,F18,F20,
  F21,F26,F27)? Unsettled at ~30% fact coverage.
- **Blocked items:** Folding 583 as the new frontier best is blocked on
  higher-coverage completeness certification. The 615 line-edit fold is not
  blocked.
- **Single next action (critic's nextLead):** Widen the held-out gate before
  folding 583 — draw comprehension questions covering the full fact set (or a
  large fraction), prioritizing facts NOT sampled in r2.1, then re-run the
  restructure candidate's assay against it. This converts the deepest current
  win from probe-limited to structural. Fold the 615 line-edit lever as the
  interim frontier update now.
