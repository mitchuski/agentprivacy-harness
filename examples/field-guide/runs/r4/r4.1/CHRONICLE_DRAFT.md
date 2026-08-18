---
date: 2026-07-11
seat: chronicle
runId: r4.1
verdict: Both composed levers cleared the full gate below the 526 best (line-edit 472, restructure 484, each 8/8) — but the critic held BOTH at probe-limited; frontier best stays 526 (frontier.json) until the keystone's 32-fact census converts or kills them. OT-3 is within reach, not closed.
---

# 2026-07-11 — r4.1 · composing over the folded 526

## Verdict

Two proposals, two prover VALIDATED verdicts, zero frontier movement — yet.

- **r4-compose-line-edit** (line-editor lens over the folded best): full gate
  8/8, metric 472 per verdict evidence, beating the frontier best of 526
  (frontier.json `best.metric`). Hard constraint held (self-contained
  instruction document). conform.mjs CONFORM PASS.
- **r4-compose-restructure** (restructurer lens over the same base): full gate
  8/8, metric 484 per verdict evidence, also below 526. Hard constraint held.

The critic classified **both** as **probe-limited**, not structural. The
prover's verdicts stand on their own terms, but each rests on a single 8-of-32
Fiat-Shamir draw; fact retention on the 24 unprobed facts is conjectured, not
established. Under the harness's own precedent — the 526 base required a
second disjoint draw plus an exhaustive 32/32 census before conversion
(frontier.json `best.evidence`) — neither candidate may fold today.
`frontier.json` therefore still reads best = 526; OT-3 (below 526 at gate 8/8,
frontier.json `openTarget`) remains OPEN pending the census.

## What happened

In round order:

1. **Measure.** Fresh counts by the exact rule: `artifact/GUIDE.md` = 730,
   matching `frontier.json baseline.metric`; `artifact/GUIDE.compressed.md`
   = 526, matching `frontier.json best.metric`. No staleness on either
   artifact. Two lever costs priced descriptively (no recommendation): the
   composed line-edit over the folded best (~3 seat-sessions, projected
   ceiling ~490 per the validated line-editor factor cited in frontier.json
   `openTarget`), and a second independent draw of the frozen 526 candidate
   (~2 seat-sessions, confirmation only — no metric movement possible).
2. **Proposals.** soulbae fielded two levers against the folded 526 base:
   `r4-compose-line-edit` (lens: line-editor, expected 472) and
   `r4-compose-restructure` (lens: restructurer, expected 484).
3. **Gap seeds.** Witnesses Fiat-Shamir-derived per proposal (T2/GR-4).
   Line-edit: sha256 of proposal_canon.json = `ad6680fa…5d16be`, drawing
   F14, F10, F9, F22, F29, F16, F28, F2. Restructure: sha256 =
   `b733dbd…ae10c5`, drawing F24, F21, F10, F13, F29, F11, F7, F2. Both
   seeds independently re-derived at assay; all draw arithmetic re-verified.
4. **Assay.** Both candidates answered all 8 held-out questions from
   candidate.md alone — 8/8 each, gate PASS. Metrics counted by the exact
   rule from the scratch candidates: 472 (line-edit,
   `runs/r4/r4.1/p1-r4-compose-line-edit/`) and 484 (restructure,
   `runs/r4/r4.1/p2-r4-compose-restructure/`). Hard constraint verified on
   both. verdict.json written to each scratch dir. conform.mjs PASS.
5. **Critic.** Both verdicts downgraded to **probe-limited**. Line-edit: the
   zero-fact-drop rationale was evidenced only against the 8 drawn
   questions; a −10.3% claim on already-telegraphic, census-tight text after
   earning −6.8% on r2 prose is the signature of silently shed qualifiers on
   the 24 unprobed facts. Restructure: it MOVES facts, so word savings are
   draw-independent but fact-retention evidence is bounded by one 8-of-32
   probe — stranded facts are invisible to a single draw. Converter for both:
   the keystone's exhaustive F1..F32 census (CR-4 procedure), zero agents,
   subsuming a second draw. Even converted, the 484 is dominated by the
   sibling 472 over the same base — it matters only as fallback.

## Reversals

**Nothing reversed** — no prior VALIDATED claim was withdrawn and no lever
was killed. But record the check with the same prominence as the wins: two
prover VALIDATED verdicts were **held at the door by the critic** in the same
round. Neither 472 nor 484 is frontier-eligible today. A probe pass is not a
pass (GR-5); the harness's own precedent on the 526 base was applied to its
children without flinching.

## Ledger entries returned

For the keystone to serialise (GR-10) — proposed, not written:

- **claims_register (proposed, tier PROVEN, pending census for structural
  conversion):** `r4-compose-line-edit` — composed line-editor lens over the
  folded 526 base; gate 8/8 on Gap-drawn witnesses (seed `ad6680fa…5d16be`
  re-derived); metric 472 by the exact count rule; hard constraint held;
  scratch `runs/r4/r4.1/p1-r4-compose-line-edit/` (verdict.json on record).
  Critic class: probe-limited.
- **claims_register (proposed, tier PROVEN, same caveat):**
  `r4-compose-restructure` — restructurer lens over the same base; gate 8/8
  (seed `b733dbd…ae10c5` re-derived); metric 484; hard constraint held;
  scratch `runs/r4/r4.1/p2-r4-compose-restructure/`. Critic class:
  probe-limited; dominated by the sibling 472 — fallback only.
- **KILLED_LEVERS:** none this round (`killedLeverDrafts` empty).
- **frontier.json:** NO change proposed this round. Update (526 → 472) is
  contingent on the keystone census returning 32/32 and is the keystone's
  write alone (GR-1/GR-10).

## Handoff

- **Open questions:** Does the 472-word line-edit candidate retain all 32
  facts (F1..F32) under exhaustive census, or did the −10.3% shed qualifiers
  on the 24 unprobed facts? If it drops any, does the 484 restructure
  candidate survive the same census as fallback?
- **Blocked items:** OT-3 closure and any frontier fold are blocked on the
  keystone census; both r4.1 candidates are frozen in their scratch dirs
  until then. No new lever proposals before the census resolves (per critic).
- **Single next action:** Keystone runs the exhaustive 32-fact census
  (F1..F32 per the Gap's numbered list, CR-4 procedure) against the 472-word
  line-edit candidate at `runs/r4/r4.1/p1-r4-compose-line-edit/candidate.md`;
  on 32/32 fold it as the new best, update frontier.json (526→472), and close
  OT-3 — the census converts probe-limited to structural at zero token cost
  and subsumes a second draw; if any fact is dropped, run the same census on
  the 484 restructure candidate as fallback before proposing any new lever.
