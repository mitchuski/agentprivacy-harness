---
date: 2026-07-10
seat: chronicle
runId: u2.1
verdict: Both proposals MIRAGE (0/8 gate each); frontier.json best.metric unchanged at 7753; structural defect identified — organizing axis doesn't matter, literal-fact preservation does.
---

# 2026-07-10 — u2.1: two lenses, one structural defect

## Verdict

Both levers this round — `by-container-six-layers-and-tagged-topology` and
`by-claim-six-layers-full-ledger` — are **MIRAGE**. Each reproduced its seed,
each beat the frontier metric on the metric axis alone (7514 and 7732
respectively, vs. `frontier.json` best.metric 7753), and each scored **0/8**
on the Gap's held-out draws. Per T5, a zero gate collapses the product
regardless of the metric win. `frontier.json` best.metric is **unchanged** —
no round has validated yet (matches the `frontier.json` baseline note: no
Gap has drawn against the seed map either, so nothing here may be cited as
PROVEN). No fold occurred; the keystone wrote nothing to frontier.json,
claims_register.md, or manifest.yaml this round.

## What happened

**Measure**: metric held at 7753 (ADMISSION 1304 + ERRATA 1646 + FLEET 2204
+ README 1152 + SEATS 1447), matching the frontier.json baseline exactly.
Two levers costed: by-container (structured audit, ceiling 1800 words) and
by-claim (verification per gate claim, ceiling 1200 words) — flagged as
overlapping ceilings, not additive.

**Proposals**: two rewrites drafted, one per lens, each grouping the same
six corpora (docs/spellweb/cityofmages/master/skills/instances) under a
different organizing axis — container/topology vs. claim-tier ledger.

**Gap seeds**: two independent seeds drawn and hashed against
`proposal_canon.json` (sha256 10469f9… for p1, 529f37e… for p2) — both
reproduced, so neither run was BLOCKED. Each seed drew 8 held-out corpus
facts (license strings, version/date pairs, code expressions, axis
bindings, governance dispositions) and required them answerable from
`candidate.md` alone, sources unopened.

**Assay**: both candidates scored 0/8 — every drawn fact was either
literally ABSENT from the map text (direct grep, p1) or unanswerable because
the map cited a fact's *category or existence* without ever stating its
*literal value* (p2, uniform shape across all 8 draws: n1–n8 each "map
cites X, never states the literal detail"). Hard constraint and
`conform.mjs` both held clean in both runs; only the gate failed.

**Critic**: classified both as **structural**, not probe noise — the 8/8
miss rate spread across all six corpora on two independently-seeded,
orthogonal-axis draws is not explainable as one unlucky omission at this
scale. The defect is in what either lens carries into `candidate.md`
(conclusions/citations, never verbatim supporting facts), independent of
which axis arranges the sections. Re-drawing witnesses would not change the
outcome for either lever as currently constructed.

## Reversals

Nothing reversed a prior validated result — no round in this instance has
validated yet (`frontier.json.best` still equals `baseline`, both 7753).
What *did* reverse, with full prominence: two candidates that looked like
wins on the metric axis alone (7514 and 7732, both under 7753) were killed
outright by the gate. Neither the container axis nor the claim-tier axis
survives as a standalone lens — both are now closed leads (K-drafts below),
and no seat may re-propose either alone without pairing it to verbatim
fact-preservation.

## Ledger entries returned

Two `KILLED_LEVERS.md` drafts returned by the critic, ready for keystone
serialisation (GR-6, GR-10 — this seat does not write them):

1. **by-container-six-layers-and-tagged-topology** — MIRAGE, gate 0/8,
   metric 7514 (beat 7753) but zero collapses the product (T5). Evidence:
   full verdict at `runs/u2/p1-by-container-six-layers-and-tagged-topology/verdict.json`;
   direct grep of `candidate.md` for all 8 expected tokens returned ABSENT
   for all eight. Classification: structural — container-grouping does not
   by construction preserve atomic literal facts inside its groups.

2. **by-claim-six-layers-full-ledger** — MIRAGE, gate 0/8, metric 7732 (beat
   7753) but zero collapses the product (T5). Evidence: full verdict at
   `runs/u2/p2-by-claim-six-layers-full-ledger/verdict.json`; all 8 draws
   unanswerable, each in the shape "map cites the fact's category, never its
   literal value." Classification: structural — identical failure shape to
   the by-container lever on an orthogonal axis and independent seed,
   confirming the defect is in what gets carried into `candidate.md`, not
   in which axis arranges it.

## Handoff

- **Open questions:** (1) the `countingRule` glob-scope question from
  `frontier.json.openItems` — does `notes/KILLED_LEVERS.md` count toward
  the metric? Still undecided, do not quietly resolve it. (2) FLEET.md §7
  First-Person decision (co-present rite vs. key custody) remains open per
  `frontier.json.openItems`; SEATS.md §5 argues RPP already settles it, but
  that argument itself is not a verdict.
- **Blocked items:** none — both p1 and p2 runs completed cleanly (seed
  reproduced, gate ran, hard constraint checked); nothing is BLOCKED this
  round, both are simply killed.
- **Single next action:** Design a literal-fact-ledger lens: one line per
  Gap-drawable atomic fact — quoted verbatim (exact command, version/date,
  license string, numeric split, tag value, axis binding) and cross-tagged
  to its corpus and claim-tier — with all narrative demoted to a thin index
  over that ledger, rather than proposing a third top-level organizing axis.
  Both closed levers independently proved (two seeds, two orthogonal
  lenses, 0/8 both times, uniform across all six corpora) that
  organizing-axis choice does not move gate coverage; only verbatim
  preservation of the ~20-30 indexed facts will, and both prior drafts still
  had metric headroom under best (7753) even while failing the gate, so a
  ledger-first draft has room to spend words on verbatim quotes and still
  plausibly beat baseline.
