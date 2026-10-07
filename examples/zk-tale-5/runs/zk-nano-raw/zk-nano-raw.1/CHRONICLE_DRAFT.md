```markdown
---
date: "2026-09-13"
seat: "chronicle"
runId: "zk-nano-raw.1"
verdict: "BLOCKED — no validated lever this session (gate not N/N for the only clearly failing attempt; hard-constraint mismatch for the other)."
---

# Verdict (verdict-first)
- **Result:** BLOCKED (no lever validated).
- **Validated levers:** none.
- **Best-known frontier state:** **metric 1056** (citation: `frontier.json`).
- **OpenTarget:** `OT-1` — “below 1056 words with all 85 witnesses and the hard constraint intact” (citation: `frontier.json`).

---

## Phase-by-phase (chronicle)
### Chronicle phase 1 — bootstrap (reads only)
- Loaded: `GROUND_RULES.md`, `TRUSTS.md`, this seat card `seats/chronicle.md`, and `examples/zk-tale-5/frontier.json`.
- Conformance note: no external measurements or filesystem/shell tooling were used in this seat’s drafting.

### Chronicle phase 2 — received round data (proposal outcomes)
Two proposed levers were evaluated, both arriving as **MIRAGE** (not validated results):
1. **lever `tighten-story-prose`**
   - **Proposed metric:** 1035
   - **Gate:** **84/85** (held-out census; missing ≥1 required witness)
   - **Outcome:** MIRAGE → hard constraint cannot be treated as intact when the gate is not N/N.
2. **lever `merge-preamble-and-table-costs`**
   - **Proposed metric:** 1018
   - **Gate:** **85/85** (held-out census passed)
   - **Outcome:** MIRAGE → hard constraint mismatch: the required Tale 5 worked-example structure / story-beat ordering / inscription+proverb+codes bundle was not faithfully preserved.

### Chronicle phase 3 — reversals recorded
- **Reversal:** attempted “story tightening” failed the held-out witness census (**84/85**), so the attempted compression did not satisfy the required forge witness set.
- **Reversal:** attempted “preamble/table merging” passed census (**85/85**) but was killed for violating the hard constraint’s required Tale 5 teaching structure.

---

## Ledger entries returned to the keystone (proposed only; DRAFT)
- Returned ledger candidates for potential keystone recording:
  - `tighten-story-prose` — **MIRAGE**, gateResult **84/85**, evidence: held-out census missing ≥1 witness; failure therefore voids hard-constraint integrity.
  - `merge-preamble-and-table-costs` — **MIRAGE**, gateResult **85/85**, evidence: hard constraint mismatch (worked-example structure / required beat bundle not preserved).

(No validated lever was folded back; therefore no frontier edit performed in this seat.)

---

## Handoff (next session support)
### Open questions
- Can we reduce the word count **below 1056** while still **preserving all hard-constraint Tale 5 structure** and achieving **gate N/N (85/85)**?

### Blocked items
- This seat’s input set did not include explicit, re-derivable lever specs or fresh scratch proposals sufficient to confirm “worked-example structure preservation” under candidate rewrites beyond the provided gate outcomes.
- The provided round data includes verdicts as MIRAGE but does not include validated candidate text evidence that would permit a new, settled NEXT lever without rerun inputs.

### Single next action (critic’s nextLead)
- **NextLead:** `merge-preamble-and-table-costs` (attempt again, but with explicit preservation of the Tale 5 required worked-example structure and the inscription+proverb+codes bundle while maintaining **85/85** gate).
```
