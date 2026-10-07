```markdown
---
date: 2026-09-12
seat: chronicle
runId: clean-sonnet-5-serv.1
verdict: VALIDATED — two levers cleared gate 95/95; best now 1046 (was 1069), pending keystone fold
---

# Chronicle — clean-sonnet-5-serv.1

## Verdict

**VALIDATED.** Two proposals cleared the census gate at 95/95 against the prior frontier best of **1069** words:

| lever | metric before → after | gate |
|---|---|---|
| `cut-adopt-intro-glue` | 1069 → 1061 | 95/95 |
| `merge-agent-note-into-constitution-and-collapse-step-preamble` | 1069 → 1046 | 95/95 |

`merge-agent-note-into-constitution-and-collapse-step-preamble` **dominates** `cut-adopt-intro-glue` (1046 < 1061, same witness set intact). No MIRAGE, no BLOCKED this round. No reversal of a prior lever occurred — this round only extends the fold recorded at 1069.

## What happened, phase by phase

**Measure.** Reproduced frontier state exactly: metric 1069, census 95/95, `stale=false`. Two lever costs were priced without recommendation between them: the line-editor-class cut (low cost, ~23-word ceiling, untried post-fold) and the restructurer class (high cost — killed lever from r1, 49/93 witnesses, cannot be re-proposed without new evidence per GR-6).

**Propose / Assay.** Two scratch candidates were built and independently checked against the hard constraint (five commands in order with writes, six-seat loop table, six-step adoption sequence, constitution bullets, box layout — nothing invented):

- `p1-cut-adopt-intro-glue` — removed a connective-transition sentence; no witness rode on it; 95/95, 1061 words.
- `p2-merge-agent-note-into-constitution-and-collapse-step-preamble` — folded the agent note into the constitution enumeration and collapsed the step preamble; 95/95, 1046 words. Both candidates' residual PATHWAYS.md mention confirmed as the pre-existing origin pointer already counted in the census, not an invented pointer to a longer document.

**Critic.** Classified both as *structural* (real redundancy removed, not witness-dropping shortcuts). Recommended folding the 1046 candidate as new best against OT-2, then re-testing whether the 1061 cut composes *on top of* the folded 1046 candidate (stacked lens, same witnesses) rather than treating the two as independent proposals against the old 1069 baseline.

## Reversals

None this round. (Recorded for completeness per GR-7: the prior dominated-but-validated pattern from r2's `line-edit-connective-prose` at 1092 repeats here with `cut-adopt-intro-glue` at 1061 — dominated by the larger fold, not killed, not reversed.)

## Ledger entries proposed (for keystone serialization only — this seat does not write frontier.json)

- **best.metric**: 1069 → 1046, leverId `merge-agent-note-into-constitution-and-collapse-step-preamble`, evidence: verdict.json at `p2-merge-agent-note-into-constitution-and-collapse-step-preamble`, 95/95.
- **history append**: entry for 1046 (lever above, target OT-2, coverage 95/95, note: constitution/preamble fold).
- **history append (dominated, not folded)**: entry for 1061, lever `cut-adopt-intro-glue`, 95/95, VALIDATED-dominated — same treatment as the r2 line-editor precedent.
- **openTarget OT-2**: remains OPEN, restate threshold as "below 1046" pending the stacked-composition test the critic proposes.

## Handoff

- **Open questions:** Does `cut-adopt-intro-glue`'s transition-sentence deletion still hold (95/95, no invented content) when applied on top of the folded 1046 candidate rather than independently against 1069? Is there further connective-prose margin beyond the ~23-word estimate once composed?
- **Blocked items:** Restructurer lever remains blocked under GR-6 (killed at 49/93 in r1); no new evidence has been offered to lift that block.
- **Single next action:** Fold `merge-agent-note-into-constitution-and-collapse-step-preamble` (1046) as the new best, then re-open OT-2 by testing the `cut-adopt-intro-glue` deletion stacked on top of the folded 1046 candidate, same witness set.
```

**Five-line verdict summary (data):**
1. Verdict: VALIDATED — two levers cleared 95/95 gate this round.
2. Metric: 1069 → 1061 (`cut-adopt-intro-glue`) and 1069 → 1046 (`merge-agent-note-into-constitution-and-collapse-step-preamble`), gate 95/95 both.
3. 1046 dominates 1061; no MIRAGE, no BLOCKED, no reversal.
4. Ledger entries returned to keystone: new best 1046, history append for both candidates, OT-2 kept OPEN.
5. Handoff/nextLead: fold 1046 as new best, then re-test the 1061 cut stacked on top of it (same witnesses) rather than against the old 1069 baseline.
