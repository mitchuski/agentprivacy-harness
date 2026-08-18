---
date: 2026-07-13
seat: chronicle
runId: r5.1
verdict: One VALIDATED win and one named MIRAGE — the restructurer beat frontier best; the baseline line-edit was dominated.
---

# 2026-07-13 — r5.1 restructurer beats, baseline line-edit mirages

## Verdict

**VALIDATED:** `p2-restructure-labelled-dense-sections` (restructurer lens) —
full census 32/32, detection 1.0, hard constraint held, metric 461 words,
below the frontier best of 472 (GR-1, frontier.json) by 11. Awaiting keystone
fold; not yet written to frontier.json.

**MIRAGE:** `line-edit-baseline-terse-pass` (line-editor lens) — census 32/32
and the hard constraint held (no fact dropped), but it died on the frontier
beat at 488 words, above the frontier best of 472. Dominated by
r4-compose-line-edit; classified STRUCTURAL, filed as a kill.

Frontier best remains 472 (frontier.json) until the keystone folds the 461
result. Baseline stands at 730; both frontier numbers were re-verified fresh
this round (stale=false).

## What happened

- **Measure.** Re-ran the frontier rule (`tr -s '[:space:]' '\n' | grep -c .`)
  on both target files: `artifact/GUIDE.md` = 730 (baseline, unchanged) and
  `artifact/GUIDE.compressed.md` = 472 (frontier best, r4-compose-line-edit).
  Both matched frontier.json; stale=false. Lever pricing over the current best
  toward OT-4 flagged thin headroom on both families (history 730→573→526→472,
  diminishing returns); no recommendation implied.
- **Proposals.** Two lenses: line-editor `line-edit-baseline-terse-pass`
  (expected 488, self-declared DOMINATED) and restructurer
  `restructure-labelled-dense-sections` (expected 461).
- **Gap seeds.** Both seeds re-derived the auditor's way (Fiat-Shamir over
  proposal_canon.json): both matched the given seedHex — neither BLOCKED.
- **Assay.** Line-edit: metric 488 mechanical, census 32/32, hard constraint
  held, conform.mjs PASS — but 488 > 472, so MIRAGE (metric fails the beat, not
  comprehension). Restructure: metric 461 mechanical, census 32/32 detection
  1.0, hard constraint held (title + 8 labelled dense sections, every directive
  preserved), 461 < 472 — VALIDATED.
- **Critic.** Both classified STRUCTURAL. The line-edit kill reflects a true
  fact about the target: single-pass line-edit over the unreduced 730 baseline
  is draw-independently dominated by composing line-edits over the compressed
  substrate — the word-slack was largely spent upstream. The restructure win
  found compression orthogonal to the line-editing axis; full census forecloses
  a hidden dropped fact, so the win is not a probe artifact.

## Reversals

Nothing reversed. Both frontier numbers (730 baseline, 472 best) were
re-derived fresh and agreed with frontier.json; no prior claim was overturned
and no earlier fold was disturbed. The MIRAGE is a new negative result, not a
reversal of a standing win.

## Ledger entries returned

For the keystone to serialise (GR-10) — this seat writes only this draft:

- **claims_register (PROVEN, pending fold):** `p2-restructure-labelled-dense-sections`
  VALIDATED at 461 words — census 32/32 detection 1.0, hard constraint held,
  beats frontier best 472 by 11. Scratch:
  `runs/r5/r5.1/p2-restructure-labelled-dense-sections`. Keystone to update
  `frontier.json` best (472 → 461, lever id + target OT-4) on fold.
- **KILLED_LEVERS (K-id to assign):** `line-edit-baseline-terse-pass` —
  "single-pass telegraphic line-edit of the 730 baseline" (line-editor lens).
  WHY IT DIED: MIRAGE at 488 words; census 32/32 and hard constraint held
  (conform.mjs PASS), died solely on the frontier beat (488 > 472). STRUCTURAL,
  not probe-limited — dominated by r4-compose-line-edit (472), which composed
  line-edits over the compressed 526 substrate. EVIDENCE: verdict MIRAGE,
  metric 488 (tr/grep), census 32/32 detection 1.0, frontier best 472;
  proposer self-declared 488/DOMINATED and the run confirmed. DO NOT
  RE-PROPOSE: any bare single-pass line-edit aimed at the 730 baseline. Re-open
  only with a materially different lens, or a compose of the line-editor over
  the current frontier-best text rather than the baseline.

## Handoff

- **Open questions:** does line-editing the fresh 461 restructured substrate
  find the new adjacencies the re-layout opened, or is the word-slack already
  spent (both families showed thin headroom this round)?
- **Blocked items:** the 461 VALIDATED result is unfolded — frontier.json still
  reads best 472 until the keystone folds (GR-1/GR-10, keystone-only writes).
- **Single next action (critic's nextLead):** compose the validated
  line-editor lens over the newly-validated 461 restructured text — the exact
  r4-compose-line-edit move (526→472) re-applied to the labelled-dense-sections
  substrate; the proposal must name which word class it removes (OT-4). Do NOT
  re-run a bare line-edit over the 730 baseline (killed above).
