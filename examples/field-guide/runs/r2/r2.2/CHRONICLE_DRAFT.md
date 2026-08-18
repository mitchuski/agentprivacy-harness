---
date: 2026-07-10
seat: chronicle
runId: r2.2
verdict: Both levers VALIDATED at gate 8/8; restructurer (573) is the new frontier-best candidate, line-editor (642) a weaker but genuine win — nothing killed, nothing reversed.
---

# 2026-07-10 — r2.2 twin validations, restructurer takes the lead

## Verdict

Two lenses proposed, two lenses VALIDATED. Both cleared the held-out
comprehension gate 8/8 and held the self-contained-document hard constraint,
and both beat frontier best (730 words, frontier.json). The restructurer's
merge-and-terse rewrite is the stronger result at 573 words and is the
candidate the critic marks to fold as the new frontier best; the
line-editor's tightening pass is a genuine win at 642 words but is now
dominated. Nothing was killed. Nothing reversed. The frontier best still
reads 730 (frontier.json) until the keystone folds — no seat but the keystone
writes that number (GR-1, GR-10).

## What happened

- **Measure.** Fresh count re-derived 730 by the mandated whitespace-token
  rule, equal to both the frontier baseline and best (frontier.json); not
  stale. conform.mjs PASS. Two levers costed: line-editor (low cost, one
  tightening pass, facts/section-order preserved) and restructurer
  (medium-high cost, prose-to-list/table plus section merges, requiring a
  full gate re-check). Ceilings quoted were rough upper bounds, not
  predictions; measure wrote nothing (GR-10).
- **Proposals.** line-editor-tighten-pass (estimated 627) and
  restructure-merge-terse-prose (estimated 573).
- **Gap seeds.** Two independent Fiat-Shamir draws, each re-derived from the
  proposal artifact hash (T2/GR-4). p1 seed sha256 of proposal_canon.json
  matched seedHex — Gap intact, not tampered; witnesses F8/F24/F23/F5/F2/F28/
  F6/F4. Restructurer seed likewise matched seedHex; witnesses F9/F25/F32/F22/
  F13/F16/F5/F31 — only F5 overlaps the other draw, so the two gates were
  effectively independent samples of the ~32-fact corpus.
- **Assay.** p1 line-editor: candidate written verbatim from compressedText,
  mechanical count 642, gate 8/8 recoverable from candidate.md alone, hard
  constraint held → VALIDATED (642 < 730). Restructurer: candidate verbatim
  from compressedText, mechanical count 573, gate 8/8 from candidate.md alone,
  every quantity and both ordered procedures preserved across the food +
  cold-storage merge, hard constraint held → VALIDATED (573 < 730). verdict.json
  written to each scratch dir in the flat schema shape.
- **Critic.** Both classed **structural**, not draw-luck. line-editor:
  win holds under any witness draw by construction (facts and section order
  preserved), but the proposer was optimistic — predicted 627, delivered 642
  (~2.4% short); calibration, not luck, since sentence-tightening is
  deterministic. restructurer: well-calibrated (573 predicted, 573 delivered),
  and though it mutates structure and 8 witnesses is a ~25% sample, the draw
  was independent and preservation was explicitly verified, so the pass is not
  luck-of-the-draw. Neither classification accuses the config — both levers
  cleared the objective's own 8/8 bar cleanly; this is a proposer lead.

## Reversals

Nothing reversed. No lever was killed this round (KILLED_LEVERS unchanged).
One calibration miss recorded at win-prominence, not hidden: the line-editor
delivered 642 against its own 627 estimate (15 words / ~2.4% short) — the
proposer over-estimated the sentence-level slack available without touching
facts. The win still stands; only the estimate was wrong.

## Ledger entries returned

For the keystone to serialise (GR-10):

- **claims_register (PROVEN):** `restructure-merge-terse-prose` — VALIDATED,
  573 words, gate 8/8 (witnesses F9/F25/F32/F22/F13/F16/F5/F31), hard
  constraint held, frontier beat vs 730. Evidence: verdict.json in
  `runs/r2/r2.2/p2-restructure-merge-terse-prose`.
- **claims_register (PROVEN):** `p1-line-editor-tighten-pass` — VALIDATED,
  642 words, gate 8/8 (witnesses F8/F24/F23/F5/F2/F28/F6/F4), hard constraint
  held, frontier beat vs 730 but dominated by the restructurer. Evidence:
  verdict.json in `runs/r2/r2.2/p1-line-editor-tighten-pass`.
- **frontier.json fold (keystone action):** set best = 573 with leverId
  `restructure-merge-terse-prose`; OT-1 satisfied (first validated
  compression below 730 at gate 8/8).
- **KILLED_LEVERS:** no entries this round.

## Handoff

- **Open questions:** Do the two lenses' gains double-count, or are they
  orthogonal as the critic argues (structural vs sentence-level redundancy)?
  Composing them in series is the test.
- **Blocked items:** The 573 fold and both PROVEN claims await the keystone —
  no other seat writes frontier.json, claims_register, or the artifact (GR-10).
  The door (any outward action) remains the First Person's alone (T6/GR-8).
- **Single next action:** Compose the two validated lenses in series — run the
  line-editor tightening pass over the restructurer's 573-word candidate (NOT
  the 730-word baseline). Fold restructure-merge-terse-prose (573) as the new
  frontier best first, then target below 573 at gate 8/8 with the
  self-contained-document hard constraint intact. Proposer lead; no config
  accusation.
