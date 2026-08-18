---
date: 2026-07-10
seat: chronicle
runId: r1.3
verdict: Two levers VALIDATED at 8/8 — line-editor structural (619), restructurer probe-limited (526); frontier not yet folded, best still baseline 730.
---

# 2026-07-10 — r1.3 field-guide, biggest beat held behind a second draw

## Verdict

Round r1.3 produced **two VALIDATED candidates**, both clearing the held-out
8/8 comprehension gate and the self-contained-instruction hard constraint, both
below the frontier best (730 words, `frontier.json`):

- **line-editor-tighten-pass** — VALIDATED, gate 8/8, measured **619** words
  (verdict evidence). Critic class **structural**: content-preserving by
  construction, so the 8/8 is not draw-dependent — the win holds under any draw.
- **restructure-to-telegraphic-bullets** — VALIDATED, gate 8/8, measured **526**
  words (verdict evidence). Critic class **probe-limited**: the round's biggest
  beat and a real candidate, but the prose→bullet reshape is only *bounded* by
  its single 8-witness draw, not certified draw-invariant.

The frontier is **unmoved**: `frontier.json` best is still the baseline
(730 words), `best.leverIds` empty, OT-1 still OPEN. No fold happened — the
critic gated the larger beat behind a second draw, and the fold is the
keystone's step, not this round's.

## What happened

- **Measure.** Fresh mechanical count confirmed the frontier baseline
  (730 words, `frontier.json`), not stale. Two levers priced descriptively (no
  recommendation): line-editor (content-preserving prose tightening, low gate
  risk, ceiling ~20-25% off) and restructurer (prose→structured directives,
  higher gate/hard-constraint risk, ceiling ~40-45% off). The two ceilings were
  flagged non-additive — the restructurer subsumes much of the line-editor's
  redundancy removal.
- **Proposals.** One per lens: line-editor-tighten-pass (proposer expected 618)
  and restructure-to-telegraphic-bullets (proposer expected 521).
- **Gap seeds.** Witnesses Fiat-Shamir-derived from each proposal's
  `proposal_canon.json`; both seed hashes re-derived by the prover to equal
  `seedHex` — neither BLOCKED. The two 8-witness draws overlapped on only one
  witness (F27), giving near-disjoint section coverage.
- **Assay.** Both VALIDATED, each answered from candidate.md alone.
  line-editor on F30,F28,F1,F18,F27,F25,F7,F8 → 8/8, measured 619.
  restructurer on F31,F15,F27,F21,F14,F20,F9,F12 → 8/8, measured 526.
  `conform.mjs` PASS on both (Z/64Z algebra proven).
- **Critic.** line-editor → **structural** (padding/restatement removal, no fact
  altered, draw-invariant). restructurer → **probe-limited**: passed its draw,
  but seven of eight sections were probed by a single witness each, so the
  reshape is bounded not proven — the ~93 words it saves over line-editor could
  be pure framing (structural) or could hide an unprobed dropped fact. Eight
  witnesses cannot tell which. No levers killed (`killedLeverDrafts` empty).

## Reversals

Recorded at win-prominence:

- **Proposer metrics ran optimistic; measured governs (GR-1).** line-editor
  claimed 618, measured 619 (off by one, benign). restructurer claimed 521,
  measured 526 (off by five). The prover recorded the measured values as
  authoritative and did not trust the proposer's numbers.
- **A stale verdict was overwritten.** The line-editor scratch dir held a
  verdict from an earlier session encoding a *different* proposal artifact — a
  different seed, a different metric, a different 8-witness draw. The prover
  overwrote it with the verdict for the artifact actually assayed this round.
- **The numerically better candidate is deliberately NOT folded.** 526 beats
  619, but the critic held 526 back as probe-limited; the frontier does not
  advance on it this round.

## Ledger entries returned

For the keystone to serialise (GR-10 — this seat writes only this draft):

- **claims_register (PROVEN candidate).** line-editor-tighten-pass compresses
  730→619 words at held-out gate 8/8, self-contained constraint intact, conform
  PASS. Classified structural (draw-invariant); safe to fold as frontier best.
  Evidence: `runs/r1/p1-line-editor-tighten-pass/` (candidate.md,
  proposal_canon.json sha256 = seedHex, verdict.json).
- **claims_register (PROVEN candidate, qualified).**
  restructure-to-telegraphic-bullets compresses 730→526 words at gate 8/8,
  self-contained, conform PASS — classified probe-limited, NOT yet draw-
  invariant; must not be folded as authoritative frontier on one draw.
  Evidence: `runs/r1/p2-restructure-to-telegraphic-bullets/`.
- **KILLED_LEVERS.** None this round.

## Handoff

- **Open questions:** Does the 28% prose→bullet reshape (526) drop any undrawn
  quantity/list under a second, disjoint Fiat-Shamir draw, or is the extra ~93
  words over line-editor pure framing? If it converts to structural, do the two
  lenses compose orthogonally below 526?
- **Blocked items:** The frontier fold is blocked pending the second-draw
  result — the keystone should not fold 526 as authoritative best on a single
  8-witness draw. The fold itself is the keystone's door, not this seat's
  (T6/GR-8).
- **Single next action:** Re-assay restructure-to-telegraphic-bullets (526)
  under a second, independent Fiat-Shamir draw before any fold (GR-4 — a fresh
  seed is a new draw). Target witnesses covering the sections its first draw
  under-probed (the F30/F28/F1/F18/F25/F7/F8 territory line-editor hit, plus any
  unhit sections). If it clears the disjoint draw at 8/8 it converts to
  structural and becomes the new best; THEN stack line-editor-tighten-pass on
  top (orthogonal word classes — intra-sentence padding vs inter-section
  framing — should compose below 526). If it fails the second draw, fold the
  safe structural win at line-editor's 619 as the frontier instead.
