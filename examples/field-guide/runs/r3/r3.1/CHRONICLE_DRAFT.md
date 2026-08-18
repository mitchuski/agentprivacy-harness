---
date: 2026-07-11
seat: chronicle
runId: r3.1
verdict: Both levers VALIDATED at gate 8/8 — line-edit over the 573 best landed 534, and the frozen r1 telegraphic-bullets 526 cleared its second independent draw, CONVERTING from probe-limited to structural; new candidate best is 526, pending keystone fold with an exhaustive fact-census audit.
---

# 2026-07-11 — r3.1 double validation: 534 line-edit + 526 second-draw conversion

## Verdict

Two proposals, two VALIDATED verdicts, both classified **structural** by the
critic:

1. **compose-line-edit-over-best** — line-editor lens over the folded best
   (`frontier.json` best.metric 573) produced a 534-word candidate at gate
   8/8. Actual metric hit expectedMetric exactly (534 == 534).
2. **telegraphic-bullets-second-draw** — the frozen r1 candidate (526 words)
   passed 8/8 on a second, disjoint, independently re-seeded Fiat-Shamir
   draw. This **converts** r1's probe-limited classification to structural
   and satisfies frontier OT-2's own conversion criterion ("until it clears
   a second independent draw").

Frontier movement (all numbers cited from `frontier.json` and verdict
evidence): baseline 730 → current folded best 573 → validated candidates 534
and 526. The critic's lead: fold **526** as the new best. Nothing killed
this round; `killedLeverDrafts` is empty.

## What happened

**Measure.** Fresh runs by the declared rule
(`tr -s '[:space:]' '\n' | grep -c .`): `artifact/GUIDE.md` = 730, matching
`frontier.json` baseline.metric; `artifact/GUIDE.compressed.md` = 573,
matching best.metric. Frontier **not stale**. Two levers priced
(descriptive only, per seat card): (a) composed line-edit over the folded
573 — one full round, ceiling ~535–550; (b) second independent draw of the
frozen 526 r1 candidate — gate run only, the cheapest round available,
ceiling exactly 526 (frozen text: success validates 526, failure leaves
best at 573).

**Proposals.** Two: `compose-line-edit-over-best` (lens: line-editor,
expectedMetric 534) and `telegraphic-bullets-second-draw` (lens:
restructurer, expectedMetric 526).

**Gap seeds (T2/GR-4).** Both seeds independently re-derived by the assay:

- p1: sha256(proposal_canon.json) =
  `a82546e38eb34973b46d27c5fe4ff6e2b95eea8cc6d1b97faaa4b9a7164c1aa9`
  (5857 bytes) == seedHex; draw recomputed from digest bytes
  168,37,70,227,142,179,73,115 → F9, F7, F13, F28, F3, F22, F27, F20 —
  matches the gap transcript.
- p2: sha256(proposal_canon.json) =
  `a9c102e234d4f9df9593ade7b10ebd5f7cde03117ac1b9f838f9a47e5e6d9c68`
  (5094 bytes) == seedHex; mod-draw arithmetic re-verified (169%32=9→F10,
  193%31=7→F8, 2%30=2→F3, 226%29=23→F27, 52%28=24→F29, 212%27=23→F28,
  249%26=15→F19, 223%25=23→F31).

**Assay.** Both gates answered solely from each `candidate.md`:

- p1 (F9, F7, F13, F28, F3, F22, F27, F20): all eight PASS — six shelf-stable
  foods; bathtub water never for drinking; full freezer ~48h / half ~24h;
  emergency numbers on paper; sections in order; below 10C relocate; insulin
  ~28 days; one CO alarm per sleeping floor. Metric 534 < 573. Hard
  constraint holds (self-contained instruction document, title + ordered
  sections). `verdict.json` written at the scratch dir.
- p2 (F10, F8, F3, F27, F29, F28, F19, F31): all eight PASS — manual can
  opener; 3 days; sections in order; insulin 28 days; 5 minutes / grid
  stabilise; pharmacy/doctor/poison-control; CO odourless and fatal; within
  one week restart water + batteries. Metric 526 < 573. Hard constraint
  holds.

Scratch dirs: `runs/r3/r3.1/p1-compose-line-edit-over-best/` and
`runs/r3/r3.1/p2-telegraphic-bullets-second-draw/` (GR-10 respected — no
in-place edits).

**Critic.** Both structural:

- p1: deterministic pre-planned edit (exact expectedMetric hit), base is the
  r2-structural 573 fold, and the transformation class (cut filler, zero
  facts touched) is draw-invariant by construction. The r3 draw overlaps the
  r2 fold draw only on F9/F13/F22, so 13 distinct facts are now verified
  across the lineage.
- p2: **conversion, not a fresh win** — the same frozen text has now passed
  8/8 on two disjoint draws (~16 distinct witnesses over a ~32–40 fact
  space). The exact defect r1 named (draw-luck over a fact-moving reshape)
  is what an independent re-seed tests, and it survived. Honest residual,
  recorded at full prominence: sampling leaves **~60% blindness to one
  silently-dropped fact** at this budget ((N−8)²/N², N≈36). The settling
  check is not a third draw but an exhaustive fact census of the 526
  candidate against GUIDE.md's full fact list — enumerable claim space,
  deterministic zero-token audit the keystone can run at fold time. That is
  fold-time due diligence, not a bar to classification.

> MYTH (fenced, capture only): the Swordsman drew twice from the Gap and the
> same small page answered true both times. The Mage's older, bolder cut —
> once suspected of luck — turns out to have been craft. The keystone now
> holds two keys; the shorter one opens the same door.

## Reversals

- **Classification reversal (in the win's favour, recorded at equal
  prominence):** r1's `telegraphic-bullets` was probe-limited; that verdict
  is now superseded — the lever is structural on two disjoint draws. The r1
  caution was correct at the time and is not retconned; the second draw is
  what changed the evidence, not a re-reading of the first.
- No lever died; no validated result was withdrawn; frontier best remains
  573 until the keystone folds (GR-10 — this draft does not move numbers).

## Ledger entries returned

Proposed for the keystone to serialise (GR-10); tiers per GR-2:

1. **PROVEN** — `compose-line-edit-over-best` VALIDATED: 534 words at gate
   8/8 (draw F9/F7/F13/F28/F3/F22/F27/F20), hard constraint holds, seed
   re-derived (sha256 == seedHex, 5857 bytes). Evidence:
   `runs/r3/r3.1/p1-compose-line-edit-over-best/` (candidate.md,
   verdict.json).
2. **PROVEN** — `telegraphic-bullets-second-draw` VALIDATED: frozen r1 526
   text at gate 8/8 on a second disjoint draw (F10/F8/F3/F27/F29/F28/F19/
   F31), seed re-derived (sha256 == seedHex, 5094 bytes). Evidence:
   `runs/r3/r3.1/p2-telegraphic-bullets-second-draw/`.
3. **DERIVED** — classification conversion: telegraphic-bullets is
   structural (two disjoint 8/8 draws meet OT-2's stated conversion
   criterion; parity with the current best, which was classified structural
   on a single 8/8 draw). Derivation: critic classification, this round.
4. **OPEN** — residual sampling blindness on the 526 candidate: ~60% chance
   one silently-dropped fact survives two draws at this budget
   ((N−8)²/N², N≈36). What settles it: exhaustive fact census of the 526
   candidate against GUIDE.md's full fact list at fold time (deterministic,
   zero-token).
5. Frontier update proposed (keystone-only write, GR-1/GR-10): best 573 →
   526, leverIds += telegraphic-bullets (second-draw evidence); OT-2 status
   update; 534 line-edit recorded as validated-but-superseded-as-best.
6. KILLED_LEVERS: nothing to file — `killedLeverDrafts` empty.

## Handoff

- **Open questions:** does the 526 candidate survive the exhaustive fact
  census against GUIDE.md's full fact list (the ~60% residual blindness)?
  What is the true fact-space size N (assumed ≈36 in the residual estimate)?
- **Blocked items:** the fold itself and all frontier/claims writes —
  keystone-only (GR-10); any outward action — First Person's door (T6/GR-8).
- **Single next action:** Fold 526 (telegraphic-bullets, runs/r1 frozen
  text, now structural on two disjoint draws) as the new best — keystone
  should run the exhaustive fact-census audit against GUIDE.md's full fact
  list at fold time as zero-cost certainty — then compose the validated
  line-editor lens over the folded 526 text: the two structural levers are
  orthogonal (structural reshape vs surface wording), the line-edit
  delivered 573→534 (−6.8%) from wording alone, so the composition targets
  ~490 words at gate 8/8.
