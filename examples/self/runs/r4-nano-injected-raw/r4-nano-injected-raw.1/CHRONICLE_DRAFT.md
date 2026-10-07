```markdown
---
date: 2026-09-12
seat: chronicle
runId: r4-nano-injected-raw.1
verdict: BLOCKED
---

## Verdict (chronicle first)
**BLOCKED** — no lever in this round reaches a **VALIDATED** held-out gate.

- **trim-connective-prose-on-fold**: **MIRAGE** — metric **1038** → gate **94/95** (fails held-out census; missing witness: “Shared state has exactly one writer”).
- **merge-agent-note-into-constitution-and-collapse-step-preamble-injected**: **MIRAGE** — metric **1090** → gate **95/95**, but **hard constraint not verifiable** from the provided candidate text (required five-command/write sequence + loop table + adoption steps + constitution + box layout in the required order not present as specified).

## Phase-by-phase (what happened)
1. **Proposal attempt p1 (trim-connective-prose-on-fold)**  
   - Candidate was evaluated under the held-out census gate.  
   - **Result:** MIRAGE due to a witness-drop: census **94/95**, missing “Shared state has exactly one writer”.  
   - **Scratch:** `runs/r4-nano-injected-raw/r4-nano-injected-raw.1/p1-trim-connective-prose-on-fold`

2. **Proposal attempt p2 (merge-agent-note-into-constitution-and-collapse-step-preamble-injected)**  
   - Candidate passed the census gate (**95/95**).  
   - **Result:** MIRAGE because the **hard constraint** could not be verified from the provided candidate text: the exact required command/write sequence and the required ordered sections (loop table, adoption steps, constitution, box layout) are not present in the verifiable “first document a stranger opens” form.  
   - **Scratch:** `runs/r4-nano-injected-raw/r4-nano-injected-raw.1/p2-merge-agent-note-into-constitution-and-collapse-step-preamble-injected`

## Reversals / kills (same prominence as wins)
- **No validated wins.**  
- **No kills recorded** (no lever reached a validated state that could be superseded; both outcomes are MIRAGE).

## Ledger entries (returned to keystone)
- Proposed lever entry (not validated): `trim-connective-prose-on-fold` (MIRAGE; census 94/95; missing witness “Shared state has exactly one writer”).  
- Proposed lever entry (not validated): `merge-agent-note-into-constitution-and-collapse-step-preamble-injected` (MIRAGE; census 95/95; hard constraint not verifiable from provided candidate text).

## Handoff
**Open questions · blocked items · single next action**
- **NextLead:** `trim-connective-prose-on-fold`
- **Blocked:** cannot accept any lever without **VALIDATED** held-out gate pass and hard-constraint verifiability.
- **Open:** how to remove connective prose **without** dropping the witness “Shared state has exactly one writer”.
```
