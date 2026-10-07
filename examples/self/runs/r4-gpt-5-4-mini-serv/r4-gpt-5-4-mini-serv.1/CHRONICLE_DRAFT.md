---
date: 2026-09-12
seat: chronicle
runId: r4-gpt-5-4-mini-serv.1
verdict: MIRAGE
---

# Verdict

MIRAGE: no validated lever landed in this round. One candidate was probe-limited at 94/95, and one candidate preserved 95/95 but failed the hard constraint on document shape.

# What happened

## Phase 1 — trim-connective-prose-on-fold
- Status: MIRAGE
- Metric: 1038
- Gate: 94/95
- Failure: missing witness, named in the gate output as `Shared state has exactly one writer`
- Read on the result: this was a probe-limited miss. The edit may still be viable under full coverage, but this run did not validate it.

## Phase 2 — merge-agent-note-into-constitution-and-collapse-step-preamble
- Status: MIRAGE
- Metric: 1046
- Gate: 95/95
- Failure: hard constraint violation
- Read on the result: coverage was complete, but the candidate was no longer the required stranger-first document. It added extra explanatory preamble and pointer text, so it failed the constitutional shape requirement.

# Reversals and kills

- The 95/95 census did not rescue the second candidate: gate pass was necessary but not sufficient.
- The first candidate’s miss is not a disproof of the lever; it is a coverage failure that must be retried with the missing witness restored.
- No lever was validated, so nothing was folded back.

# Ledger entries proposed

- `trim-connective-prose-on-fold` — retain as a probe-limited candidate; rerun only after restoring the missing witness.
- `merge-agent-note-into-constitution-and-collapse-step-preamble` — file as a failed shape edit; do not treat as a validated path.

# Handoff

Open questions:
- Does `trim-connective-prose-on-fold` still hold at 95/95 once the missing witness is restored?
- Is there any smaller edit that preserves the stranger-first document shape while reducing connective prose?

Blocked items:
- No validated lever to fold.
- No basis to claim improvement over the current frontier best.

Single next action:
- Re-run the line-editor lens with the missing witness restored, then test whether the connective-prose trim still holds at 95/95 before considering any further restructuring.
