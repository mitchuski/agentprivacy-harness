```markdown
---
date: 2026-09-12
seat: chronicle
runId: r4-serv-nano-raw.1
verdict: BLOCKED
---

## Verdict (chronicle-first)
- **trim-connective-prose-on-fold**: **MIRAGE** — metric **1069 → 1038**, gate **94/95** (fails held-out census; missing witness: “Shared state has exactly one writer”).
- **merge-agent-note-into-constitution-and-collapse-step-preamble**: **MIRAGE** — metric **1069 → 1046**, gate **95/95** (fails **objective.hardConstraint**: hardConstraint template mismatch vs required stranger-first five-command sequence / loop table / adoption steps / constitution / box layout).

## What happened (phase by phase)
### Phase: Chronicle
- Loaded required boot set: `GROUND_RULES.md`, `TRUSTS.md`, this chronicle card, and `frontier.json` (sole numeric authority).
- Entered round `r4-serv-nano-raw.1` with current best metric matching fresh measure (**frontier.json** best.metric = **1069**; staleness check reported as fresh).

### Phase: Probe / lens-limited attempts
1. **Lever draft:** `trim-connective-prose-on-fold`  
   - **Gate census:** **94/95**  
   - **Failure witness:** “Shared state has exactly one writer”  
   - **Outcome:** MIRAGE (not a candidate result; held-out gate not fully satisfied).

2. **Lever draft:** `merge-agent-note-into-constitution-and-collapse-step-preamble`  
   - **Gate census:** **95/95**  
   - **Hard constraint check:** **fails objective.hardConstraint** (candidate does not match the exact stranger-first template: required five commands in order with what each writes, loop table, adoption steps, constitution, box layout; nothing invented).  
   - **Outcome:** MIRAGE (hard constraint violation makes it non-result at any score).

## Reversals / kills
- No validated wins to fold back.
- No lever is recorded as **KILLED** in this chronicle (both drafts are MIRAGE due to gate/hard-constraint failures, not a new evidence-backed kill).

## Ledger entries (proposed)
- Proposed ledger updates (to be handled by the keystone review step):
  - Record both lever drafts as **MIRAGE** with their gate outcomes and the specific failing checks above.
  - Do **not** update `frontier.json` (no validated lever).

## Handoff
- **Open questions · blocked items · single next action:**  
  **NextLead:** **OT-2** — apply a change that preserves the full held-out census (**95/95**) *and* keeps the **objective.hardConstraint** stranger-first five-command template / loop table / adoption steps / constitution / box layout intact, aiming below **1069** without stacking on top of the already-closed fold.
```
