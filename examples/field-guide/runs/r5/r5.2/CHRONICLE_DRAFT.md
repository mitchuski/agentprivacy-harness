---
date: 2026-07-13
seat: chronicle
runId: r5.2
verdict: restructure-merge-sections-inline VALIDATED at 453 words (32/32 census, hard constraint held), beating frontier best 472; cut-filler-line-edit MIRAGE at 493, killed structural.
---

# 2026-07-13 — r5.2-restructure-beats-472-line-edit-mirages

## Verdict

One lever advanced the moving ceiling, one was killed.

- **restructure-merge-sections-inline — VALIDATED at 453 words.** Full 32/32
  census (detection 1.0), hard constraint (self-contained instruction
  document) held, and 453 falls below frontier best (472, `frontier.json`).
  A genuine frontier beat, returned to the keystone for fold. Until the
  keystone folds it, `frontier.json` best still reads 472.
- **cut-filler-line-edit — MIRAGE at 493 words.** Full 32/32 census
  (detection 1.0), hard constraint held, no fact dropped — but 493 does not
  beat 472 (493 ≥ 472). A clean-reading candidate that does not move the
  ceiling. Classified structural, killed (K-id below).

Frontier state cited: baseline 730, best 472, open target OT-4 (below 472 at
gate 8/8) — all from `frontier.json`.

## What happened

The round in order:

- **measure** — metric read at 730 (`tr -s '[:space:]' | grep -c .` over the
  unchanged baseline `artifact/GUIDE.md`), stale=false: 730 equals
  frontier.baseline, and the separate `GUIDE.compressed.md` re-counted at the
  frontier best. Both levers were priced against the *current best*, not the
  730 baseline, with the base stated explicitly. Line-editor ceiling estimated
  ~445–455 (one scratch pass, one gate draw, low hard-constraint risk);
  restructurer ceiling estimated ~415–435 (full rewrite, multi-draw exposure,
  elevated hard-constraint risk). Pricing descriptive only — no lever
  recommended.
- **proposals** — two lenses. `cut-filler-line-edit` (line-editor,
  expectedMetric 493). `restructure-merge-sections-inline` (restructurer,
  expectedMetric 453).
- **gap seeds** — Fiat-Shamir seeds re-derived the auditor's way for both
  proposals (proposal-hash match, source-hash match, seed match); neither
  BLOCKED. Candidates written verbatim from each proposal's compressedText.
- **assay** — census gate (N=32, detection 1.0) run on each candidate.md in
  isolation. `cut-filler-line-edit`: 32/32 full pass, hard constraint holds,
  measured 493 → does NOT beat 472 → MIRAGE (expectedMetric 493 hit the
  measurement exactly). `restructure-merge-sections-inline`: 32/32 full pass
  (spot checks F13, F24, F27, F22 all recoverable), hard constraint holds,
  measured 453 < 472, conform.mjs PASS → VALIDATED.
- **critic** — both outcomes classified **structural** (not probe-limited, not
  noise). The MIRAGE is structural because the census is exhaustive and the
  estimate hit exactly: 493 is a true floor for the line-editor lens applied
  to the RAW 730 baseline — a sentence-level edit of an un-composed text cannot
  fall below a text already through three composition passes (730→526→472). The
  VALIDATED win is structural because folding each section's bullets into one
  semicolon-joined paragraph with an inline bold lead strips per-bullet
  scaffolding while preserving all 32 facts — a property that holds under any
  witness draw.

## Reversals

Nothing reversed. No prior fold was undone, no frontier number retracted. The
MIRAGE is not a reversal — it is a lever that never entered the frontier.

## Ledger entries returned

For the keystone to serialise (GR-10):

- **frontier fold (pending keystone):** restructure-merge-sections-inline,
  VALIDATED 453 words, gate 32/32 census (detection 1.0), hard constraint held,
  beats best 472 by 19. Scratch:
  `runs/r5/r5.2/p2-restructure-merge-sections-inline`. Would close/advance
  OT-4 if folded. Only the keystone writes `frontier.json`.

- **KILLED_LEVERS entry — K-id: cut-filler-line-edit (structural kill).**
  WHAT IT WAS: sentence-level line-edit of the 730 baseline — imperative voice,
  cut throat-clearing and redundant connectives, all 32 facts kept;
  expectedMetric 493. WHY IT DIED: MIRAGE at 493. Full 32/32 census
  (detection 1.0) confirms no fact dropped and the hard constraint holds — the
  candidate reads fine but does not beat frontier best 472 (493 ≥ 472).
  Structural, not probe-limited: the census is exhaustive and expectedMetric
  hit measurement exactly, so 493 is a true floor for the line-editor lens on
  the RAW 730 baseline. WHAT EVIDENCE KILLED IT: prover MIRAGE verdict, 493
  measured mechanically (tr/grep), frontier best 472 (`frontier.json`).
  Scratch: `runs/r5/r5.2/p1-cut-filler-line-edit`. DO NOT RE-PROPOSE the
  line-editor against the baseline; the lens is admissible only COMPOSED OVER
  the current best text (a distinct lever — see nextLead), never over 730.

## Handoff

- **Open questions:** does the line-editor's throat-clearing/connective
  population survive on the denser semicolon-joined 453 substrate, or was it
  already harvested by the restructure? OT-4's diminishing-returns expectation
  (730→526→472) applies to any next pass over a thrice-composed text.
- **Blocked items:** the 453 fold awaits the keystone — only it writes
  `frontier.json` and the target artifact (GR-10). No door action taken (T6).
- **Single next action (critic's nextLead):** compose the line-editor lens
  over the newly-validated 453 restructured text (the compose-over-best pattern
  proven at 526→472), NOT over the raw 730 baseline. The cut-filler lens
  floored at 493 only because it edited the baseline; on the denser 453
  substrate its target filler is a different, unharvested population. Proposal
  must name which word class it removes and gate at full 32/32 census.
