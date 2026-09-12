```markdown
---
date: 2026-09-12
seat: chronicle
runId: r3-raw.1
verdict: BLOCKED
---

# VERDICT (r3-raw.1): BLOCKED

No lever is VALIDATED in this session; both proposed levers are MIRAGE (gate not fully satisfied or hard-constraint contract not held). The round is therefore unfinished (no chronicle-complete validated progress to fold back).

## Phase 1 — Probe / candidate assessment (honest labels)

### Lever: `trim-connective-prose-on-fold`
- Status: **MIRAGE**
- Metric: **1038** (from 1069 → 1038)
- Gate: **94/95** (fails held-out census)
- What happened:
  - The held-out gate census reports a missing/incorrect witness match under the hard-constraint door content.
  - Evidence indicates the candidate does not fully satisfy the witness set, so it cannot be treated as a result.

### Lever: `merge-agent-note-into-constitution-and-collapse-step-preamble`
- Status: **MIRAGE**
- Metric: **1046** (from 1069 → 1046)
- Gate: **95/95**, but hard constraint fails
- What happened:
  - The candidate fails the objective’s hard constraint: it is not the exact “document a stranger opens first” contract (five commands in order with what each writes, loop table, adoption steps, constitution, box layout; nothing invented; no pointer to a longer version).
  - The verdict remains MIRAGE (not a full kill/validated rejection), but it is not eligible for folding back.

## Phase 2 — Reversals / kills
- No VALIDATED lever exists to fold back.
- No KILLED_LEVERS entry is produced in this chronicle draft (killedLeverDrafts is null in the provided round data).

## Ledger entries proposed (returned to keystone)
- Proposed ledger entries: **none** (no lever is eligible for folding back because no lever is VALIDATED).

## Handoff (critic → next session)
- Open questions / blocked items:
  - OT-2 requires: below 1069 words **and** all **95/95** witnesses **and** the hard constraint “first document” contract intact.
  - The MIRAGE failures show (a) witness-set mismatch under the held-out census for connective trimming, and (b) hard-constraint contract drift when merging constitution/step preambles.
- Single next action (critic’s nextLead):
  - **Re-propose a candidate for OT-2** that applies only the line-editor trimming on top of the already-validated fold, while preserving the exact hard-constraint “first document” contract (five commands in order with what each writes, loop table, adoption steps, constitution, box layout; nothing invented; no pointer to a longer version).
```
