```markdown
---
date: "2026-09-13"
seat: "chronicle"
runId: "mn-nano-serv.1"
verdict: "BLOCKED"
---

# BLOCKED — no validated Naming Ceremony result accepted (gate witness census not N/N)

## Verdict summary (5 lines)
- Frontier authority metric is **1114** (baseline) → no validated improvement was recorded because held-out gate census did not reach the required **N/N**.  
- Both proposed levers were labelled **MIRAGE** due to held-out witness census failures: **56/62** and **54/62**.  
- Because the hard constraint requires all 62 required witnesses to be present (gate census = N), neither candidate can be validated at any score.  
- No lever was folded back as validated; ledger entries remain only as returned, reviewable drafts.  
- Session is unfinished: the chronicle is required to capture what happened and the next single action.

## What happened (phase by phase)
### 1) Chronicle phase — assembling the record
- Read only the permitted round context and `frontier.json` authority for numbers (no prose metrics from memory).
- Confirmed the objective hard constraint is the Naming Ceremony witness census: **census over census.json: every witness present in the candidate (tools/check_naming.mjs), N/N or MIRAGE**.

### 2) Attempted lever outcomes — both candidates failed the held-out gate
- **Lever `tighten-ceremony-prose`**  
  - Status: **MIRAGE**  
  - Held-out gate census: **56/62** (six required witnesses missing).  
  - Failing check reported: witness relation mismatch wording (Reception vs Registration bilaterality/transactionality), indicating witness-retention failure under the lens of the held-out witnesses.

- **Lever `merge-ceremony-prose-list-the-three-moves`**  
  - Status: **MIRAGE**  
  - Held-out gate census: **54/62** (eight required witnesses missing).  
  - Failing check reported: confirmation/inscription-assertion relation not retained across the required witness set.

### 3) Reversals (same prominence as wins)
- Reversal of any “metric-down” narrative: although both MIRAGE candidates report metrics lower than baseline, **they are not results** because the held-out witness gate did not pass **N/N**.
- No validated lever was accepted; therefore, **no frontier update** (keystone-only behavior) is recorded here.

## Ledger entries proposed (returned to keystone as drafts)
- Proposed evaluation notes (not validated outcomes):
  - `runs/mn-nano-serv/mn-nano-serv.1/p1-tighten-ceremony-prose` — **MIRAGE**, gate census **56/62**, rejected by witness gate.
  - `runs/mn-nano-serv/mn-nano-serv.1/p2-merge-ceremony-prose-list-the-three-moves` — **MIRAGE**, gate census **54/62**, rejected by witness gate.

## Evidence / input availability
- The measurement context for re-running the frontier metric and witness census via the harness tooling is not available in the provided runtime context; this chronicle records only the round’s supplied gate verdicts and frontier authority.
- No claim is made that commands were executed; this is a record of provided verdict inputs and their gate outcomes.

## Handoff
### Open questions
- Which exact prose edit operations eliminate the specific missing witnesses (the 6 and 8 missing witness IDs/names) without introducing any witness-exclusion elsewhere?

### Blocked items
- Cannot perform a fresh local re-run of `tools/measure.mjs` / `tools/check_naming.mjs` in this runtime context; only the supplied verdict evidence can be recorded.

### Single next action (critic’s `nextLead`)
- **Re-run the gate-focused witness retention lens for the Naming Ceremony candidates: propose an update that explicitly preserves all 62 required witnesses under `tools/check_naming.mjs` (target: `passed == N`), because both current levers fail the census gate uniformly on witness presence.**
```
