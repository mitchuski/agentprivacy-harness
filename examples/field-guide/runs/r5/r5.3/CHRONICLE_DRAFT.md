---
date: 2026-07-13
seat: chronicle
runId: r5.3
verdict: Two levers VALIDATED census 32/32; new frontier candidate 440 (line-editor), 461 fallback holds — both beat frontier best 472, neither folded yet.
---

# 2026-07-13 — r5.3 disjoint-word-class double validation

## Verdict

Both proposals passed the full census gate and beat the frontier. Per
frontier.json the standing best is **472** (`r4-compose-line-edit`, census
32/32); this round produced two candidates below it, awaiting the keystone's
fold:

- **strip-markup-dashes-and-filler** (line-editor) — VALIDATED, verdict metric
  **440**, census 32/32, detection 1.0. New frontier candidate. One-shot /
  non-renewable: it removed whitespace-delimited bullet-dash markup tokens
  (counted by the metric, carrying no instruction content) plus two redundant
  words; markup tokens are finite, so the lever cannot be re-run for more.
- **restructure-telegraphic-merge** (restructurer) — VALIDATED, verdict metric
  **461**, census 32/32, detection 1.0. Hit its estimate exactly (461→461).
  DOMINATED by the line-editor (461 > 440) but **not killed**: it removed a
  different word class — prose connectives via telegraphic line-merging — so it
  stays a live fallback lever family.

Hard constraint held on both: each candidate is a self-contained instruction
document (title + all 8 section headers + every imperative retained). No fact
dropped at detection 1.0.

## What happened

- **measure** — Fresh count of `artifact/GUIDE.md` by the exact rule
  (`tr -s '[:space:]' '\n' | grep -c .`) returned metric 730, matching the
  frontier.json baseline exactly; stale=false. Confirmed frontier best (472)
  refers to a different file, `artifact/GUIDE.compressed.md`, independently
  re-counted at 472 — no disagreement. Priced two levers against the 472 best
  per OT-4: line-editor (low cost, ceiling ~445–455) and restructurer (higher
  cost, full 32/32 re-verification required, ceiling ~460–470, near-zero
  headroom). Pricing reflected diminishing returns on a third compression pass.
- **proposals** — line-editor `strip-markup-dashes-and-filler` (expected 440);
  restructurer `restructure-telegraphic-merge` (expected 461).
- **gap seeds** — Both seeds Fiat-Shamir re-derived the auditor's way and
  matched: sha256 of source `GUIDE.md`, of `proposal_canon.json`, and of
  `hSource||hProposal||salt` all verified → neither BLOCKED. Separation held.
- **assay** — Line-editor: candidate.md written verbatim (2840 bytes), metric
  mechanical 440, all 32 Gap questions answered from candidate.md alone →
  32/32 FULL PASS, 440 < 472. Restructurer: all 32 facts probed, each
  recoverable from candidate.md alone → 32/32, metric 461 < 472. Both
  VALIDATED (full gate ∧ hard constraint ∧ frontier beat), verdict.json in
  scratch, nothing written outside scratch dirs.
- **critic** — Both classified **structural** (true properties of the target,
  hold under any witness draw; census leaves no draw variance, so neither is
  lucky nor unlucky). No kills.

## Reversals

Nothing reversed. No prior fold was undone; no lever was killed
(`killedLeverDrafts` empty). The restructurer being dominated is noted as a
dominance ranking, not a reversal — dominated is not killed.

## Ledger entries returned

For the keystone to serialise (GR-10) — proposed, not written by this seat:

- **claims_register (PROVEN)** — `strip-markup-dashes-and-filler`: line-editor,
  verdict metric 440, census 32/32 detection 1.0, hard constraint held,
  candidate at `runs/r5/r5.3/p1-strip-markup-dashes-and-filler/`. Candidate
  new frontier best if folded (440 < 472). Note non-renewable.
- **claims_register (PROVEN)** — `restructure-telegraphic-merge`: restructurer,
  verdict metric 461, census 32/32 detection 1.0, hard constraint held,
  candidate at `runs/r5/r5.3/p2-restructure-telegraphic-merge/`. Dominated by
  p1; retained as fallback lever family (disjoint word class: prose
  connectives).
- **KILLED_LEVERS** — none this round.
- **frontier.json** — keystone-only: fold candidate 440 as new best over 472 if
  the fold gate stays green before and after; OT-4 satisfied (word class named:
  markup tokens). 461 stands as fallback, not a frontier write.

## Handoff

- **Open questions:** Does the connective-stripping mechanism still yield when
  applied over the already-stripped 440 base, or was its headroom measured only
  against the un-stripped text? Estimated sub-440 but diminishing (730→526→472
  →440 candidate).
- **Blocked items:** Fold of the 440 candidate into `frontier.json` /
  `artifact/GUIDE.compressed.md` — keystone-only (GR-10); not this seat's. The
  door (any push/publish) is the First Person's alone (T6/GR-8).
- **Single next action:** Compose the telegraphic single-line merge (lever 2's
  mechanism) over the 440 markup-stripped champion (lever 1's output),
  targeting the prose-connective/article word class. The two winners removed
  DISJOINT word classes — markup tokens vs. prose connectives — and neither
  exhausted the other's target, so composition is the unexploited move and
  directly satisfies OT-4's requirement to name the word class removed.
