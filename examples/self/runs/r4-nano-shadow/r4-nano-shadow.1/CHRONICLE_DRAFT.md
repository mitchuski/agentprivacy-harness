```markdown
---
date: 2026-09-12
seat: chronicle
runId: r4-nano-shadow.1
verdict: NO VALIDATED LEVER (both attempts MIRAGE)
---

NO VALIDATED LEVER — both attempts ended as **MIRAGE** under the full held-out gate; no lever was structurally established or folded back.

### Verdict summary (code-side + hard constraint)
1) `trim-connective-prose-on-fold` → **MIRAGE**; code-side census gate **94/95** (missing witness: “Shared state has exactly one writer”); **hard constraint: NOT VERIFIED** (section checked: “Shared state has exactly one writer”).  
2) `merge-agent-note-into-constitution-and-collapse-step-preamble` → **MIRAGE**; code-side census gate **95/95**; **hard constraint: NOT VERIFIED** (section checked: “hard constraint: not the document a stranger opens first”).  
3) Round outcome: **no validated lever**, so frontier/ledger fold-back does not occur this round.

## What happened (phase by phase)
### Phase 1 — p1: `trim-connective-prose-on-fold`
- Status: **MIRAGE**
- Gate: **94/95** (census)
- Failing witness: **“Shared state has exactly one writer”**
- Hard constraint: **not verified** because the hard-constraint section is tied to the missing witness above.

### Phase 2 — p2: `merge-agent-note-into-constitution-and-collapse-step-preamble`
- Status: **MIRAGE**
- Gate: **95/95** (census)
- Failing check: **hard constraint mismatch**
- Hard constraint: **not verified** (section checked: **“hard constraint: not the document a stranger opens first”**).

## Reversals / kills
- No wins; both attempts are recorded as **MIRAGE** (no structural establishment; hard constraint not verified).

## Ledger entries proposed (returned, not committed)
- `runs/r4-nano-shadow/r4-nano-shadow.1/p1-trim-connective-prose-on-fold` — MIRAGE; gate **94/95**; missing witness “Shared state has exactly one writer”; hard constraint section checked: “Shared state has exactly one writer”.  
- `runs/r4-nano-shadow/r4-nano-shadow.1/p2-merge-agent-note-into-constitution-and-collapse-step-preamble` — MIRAGE; gate **95/95**; hard constraint mismatch; section checked: “hard constraint: not the document a stranger opens first”.

## Handoff
**Open questions · blocked items · single next action**
- **Open**: Align the candidate’s “hard constraint” content to match the exact stranger-opened document structure, and ensure the held-out witness “Shared state has exactly one writer” is present when required.
- **Blocked**: p1 fails by missing witness (94/95); p2 fails by hard-constraint content mismatch despite 95/95.
- **Next action (critic’s nextLead)**: Rework the hard-constraint document content to match exactly the required stranger-opened structure, then re-run the full census gate to reach **95/95** with hard constraint verified.
```
