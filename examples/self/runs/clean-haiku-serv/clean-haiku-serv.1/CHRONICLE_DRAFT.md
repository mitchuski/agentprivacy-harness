```markdown
# CHRONICLE: clean-haiku-serv.1

**Verdict:** TWO VALIDATED LEVERS FOLDED. Frontier best improved from 1069 → 1046 words (23-word gain). Census 95/95 held on both. Hard constraint (five commands, loop table, adoption steps, constitution, box layout) verified intact on both candidates. No mirages. No reversals. Composition target OT-2 (below 1069 with all 95 witnesses) now tractable: both levers are structural and non-blocking.

---

## What Happened

### Phase: Propose (soulbae)

Two structural levers proposed against frontier best 1069:

1. **cut-adopt-intro-glue** — remove single connective sentence before adoption steps (8 words).
2. **merge-agent-note-into-constitution-and-collapse-step-preamble** — fold agent-note explanation into constitution; collapse two preambles already carried by commands (23 words).

Proposer noted both levers target scaffolding and explanatory glue, not operative content. Census preservation flagged as the critical gate; hard constraint (immutability of five commands, loop table, adoption steps, constitution, box layout) flagged as the cliff.

### Phase: Assay (soulbis)

**Lever 1: cut-adopt-intro-glue**

- **Metric:** 1061 words (8-word improvement).
- **Census:** 95/95 (all witnesses present, no drop).
- **Hard constraint:** All five commands in order with their outputs; loop table (six phases, one seat each); adoption steps (auditor through arena); constitution (TRUSTS and GROUND_RULES); box layout (engine, seats, drivers, tools, templates, examples, optional)—all present, no invention.
- **Verdict:** VALIDATED. Cliff-watch holds.

**Lever 2: merge-agent-note-into-constitution-and-collapse-step-preamble**

- **Metric:** 1046 words (23-word improvement, 46 words vs. baseline 1115).
- **Census:** 95/95 (all witnesses present, no drop).
- **Hard constraint:** All five commands, outputs, loop table, adoption steps, constitution, box layout verified present. Moved material was explanatory scaffolding; consolidation into constitution does not break any operative witness. Two collapsed preambles were indeed already carried by the commands themselves.
- **Verdict:** VALIDATED. Cliff-watch holds.

### Classification

Both levers are **structural**:

- **cut-adopt-intro-glue:** removes pure connective glue; neither commands nor structured sections depend on it.
- **merge-agent-note-into-constitution-and-collapse-step-preamble:** reorganizes explanatory scaffolding into the constitution; consolidates redundant preambles already present in command prose.

Neither blocks the other. Both pass census under separate runs; composition has not been attempted.

### No Reversals

No killed levers. No mirage verdicts. No witness loss on either candidate.

---

## Ledger Return to Keystone

Propose two folded entries to `frontier.json` → `history`:

```json
{
  "metric": 1061,
  "date": "2025-01-15",
  "lever": "cut-adopt-intro-glue",
  "target": "OT-2",
  "coverage": {
    "mode": "census",
    "N": 95,
    "n": 95,
    "detection": 1
  },
  "coverageNote": "VALIDATED_CENSUS: all 95 witnesses probed; single connective sentence before adoption steps removed; no operative content lost.",
  "chronicle": "runs/clean-haiku-serv/clean-haiku-serv.1/CHRONICLE_DRAFT.md"
},
{
  "metric": 1046,
  "date": "2025-01-15",
  "lever": "merge-agent-note-into-constitution-and-collapse-step-preamble",
  "target": "OT-2",
  "coverage": {
    "mode": "census",
    "N": 95,
    "n": 95,
    "detection": 1
  },
  "coverageNote": "VALIDATED_CENSUS: all 95 witnesses probed; agent-note explanation folded into constitution; two redundant preambles (already in command prose) collapsed; no operative content lost.",
  "chronicle": "runs/clean-haiku-serv/clean-haiku-serv.1/CHRONICLE_DRAFT.md"
}
```

Update `best`:

```json
{
  "metric": 1046,
  "leverIds": [
    "merge-agent-note-into-constitution-and-collapse-step-preamble",
    "cut-adopt-intro-glue"
  ],
  "evidence": "runs/clean-haiku-serv/clean-haiku-serv.1 — both VALIDATED 95/95 by soulbis (prover gemma3:27b); both structural, non-blocking, composition untested. Second lever (1046) dominates first (1061)."
}
```

Update `openTarget` OT-2:

```json
{
  "id": "OT-2",
  "statement": "below 1069 words with all 95 witnesses and the hard constraint intact; composition of line-editor cut (8 words) and merge-and-collapse fold (23 words) has not been attempted; if composed successfully at 1038 words with 95/95 census and hard constraint hold, closes this target.",
  "status": "OPEN — composition target ready"
}
```

---

## Handoff

**Open questions:**
- Does composition of both levers (cut-adopt-intro-glue + merge-agent-note-into-constitution-and-collapse-step-preamble) preserve all 95 witnesses and the hard constraint?
- Are there further structural redundancies (explanatory prose, repeated preambles) that can be consolidated without breaking operative content or witness coverage?

**Blocked items:**
- None. Both levers cleared; composition is not blocked, only untested.

**Single next action (nextLead):**
Propose composition of both levers: apply cut-adopt-intro-glue and merge-agent-note-into-constitution-and-collapse-step-preamble together to the frontier best. Target metric: 1038 words (1046 − 8). Gate: 95/95 census. Hard constraint: five commands, loop table, adoption steps, constitution, box layout all present, no invention. If VALIDATED, closes OT-2; if mirage, diagnose interaction between the two levers.
```
