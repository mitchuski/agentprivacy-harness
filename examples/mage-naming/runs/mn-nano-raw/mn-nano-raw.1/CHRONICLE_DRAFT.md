```markdown
---
date: 2026-09-13
seat: chronicle
runId: mn-nano-raw.1
verdict: BLOCKED
---

## Verdict (chronicle)
BLOCKED — No validated lever achieved N/N in the held-out Naming Ceremony witness census gate (frontier.json best.metric remains 1114; both probe levers failed full-gate).

## What happened (by phase)

### Phase: Chronicle / gating setup
- Loaded round state and the held-out witness constraint: Naming Ceremony V63 with the hard constraint items intact, verified via the held-out census gate logic (census over census.json).
- Used `frontier.json` as the sole authority for numbers (best/metric state unchanged).

### Phase: Probe levers (held-out gate only; no result claimed)
1. **Lever:** `tighten-ceremony-prose`
   - **Outcome:** MIRAGE
   - **Gate:** 56/62
   - **Failure mode:** held-out naming census reported missing operative bilateral/transactional relations (specifically missing witness content including “Reception is bilateral, Registration is transactional …” and related ceremony-witness lines).
   - **Note:** The transformation reduced length/kept some thematic phrasing but did not preserve all held-out witnesses.

2. **Lever:** `merge-ceremony-prose-list-the-three-moves`
   - **Outcome:** MIRAGE
   - **Gate:** 54/62
   - **Failure mode:** additional held-out witnesses missing; the census flagged dropping the explicit confirmation witness set and other enumerated operative witness content.
   - **Note:** The restructure was meaningfully witness-dependent; it could not be treated as a full-gate-preserving revision.

### Reversals (same prominence as wins)
- No wins occurred; both attempted levers are effectively reversible failures under the held-out census gate (recorded as MIRAGE, not folded into a validated submission).

## Ledger / returned entries (to be keystone-folded)
- Returned lever drafts for review and potential re-proposal:
  - `runs/mn-nano-raw/mn-nano-raw.1/p1-tighten-ceremony-prose` — failed full held-out census (56/62).
  - `runs/mn-nano-raw/mn-nano-raw.1/p2-merge-ceremony-prose-list-the-three-moves` — failed full held-out census (54/62).
- No lever was validated; no frontier update requested from this seat.

## Handoff
- **Open questions:** Which exact missing witnesses (the six in p1 and the eight in p2, by census list) must be restored *without* cutting below the hard constraint’s operative lines/structure?
- **Blocked items:** None beyond witness preservation under held-out census gating.
- **Next action (critic’s nextLead):** Reopen on lever at the gate: propose a revision that preserves all 62 Naming Ceremony witnesses (especially the missing bilateral/transactional relations and the explicit confirmation set) and then re-derive witnesses via the held-apart Fiat-Shamir draw before any metric-optimizing line cuts.
```
