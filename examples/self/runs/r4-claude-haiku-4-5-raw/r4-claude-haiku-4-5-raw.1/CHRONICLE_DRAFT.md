# CHRONICLE DRAFT

**Verdict:** One VALIDATED lever folded (1069 → 1046 words, 95/95 census); one MIRAGE killed (gate fail, 94/95). Open target OT-2 remains: compose the two lenses by re-applying line-edit to the fold output, targeting ~1023 words with full census.

---

## Round r4-claude-haiku-4-5-raw.1

**Date:** [from frontier: 2026-09-12]  
**Seat:** 📚 Chronicle  
**RunId:** r4-claude-haiku-4-5-raw.1  
**Models:** Proposer claude-haiku-4-5-raw; Prover gemma3:27b  

---

## What Happened

### Phase: Proposal

Two levers proposed:

1. **trim-connective-prose-on-fold** — apply line-editor lens (remove connective prose) to the restructurer fold output from r2, targeting the 23-word delta frontier notes as dominated.
2. **merge-agent-note-into-constitution-and-collapse-step-preamble** — fold the agent note into the constitution preamble and collapse redundant step preambles, removing prose that adds no operative content.

Both aimed at OT-2: below 1069 words with all 95 witnesses intact.

### Phase: Assay (Prover Verdict)

**Lever 1: trim-connective-prose-on-fold**

- **Status:** MIRAGE
- **Metric:** 1038 words (improvement: 1069 → 1038, −31 words)
- **Gate:** 94/95 census
- **Failing Check:** Missing witness: "Shared state has exactly one writer"
- **Analysis:** The proposer's line-edit removed connective prose that, while stylistically redundant to human reading, carried operative semantic weight in the census witness set. The gate is multiplicative (T5); gate-fail collapses the product regardless of metric win. This is not a probe artifact or noise — the witness set is complete and deterministic. The lever structurally violated the hard constraint by dropping a required witness.

**Lever 2: merge-agent-note-into-constitution-and-collapse-step-preamble**

- **Status:** VALIDATED
- **Metric:** 1046 words (improvement: 1069 → 1046, −23 words)
- **Gate:** 95/95 census
- **Failing Check:** None
- **Analysis:** Census gate passed. Hard constraint verified: candidate remains the document a stranger opens first — five commands in order with their outputs, the loop table (six phases, one seat each), adoption steps (auditor through arena), constitution (TRUSTS.md and GROUND_RULES.md), box layout (engine/, seats/, drivers/, tools/, templates/, examples/, optional/). No invention, no pointer to longer version. The fold removed only prose that added no new operative content. Metric win is real and gate is clean.

---

## Reversals & Kills

**Killed Lever: trim-connective-prose-on-fold**

- **Why:** Structural gate failure. The line-editor lens removed connective prose that the census witness set requires. The proposer's rationale (remove redundancy) is sound in principle, but execution dropped a witness the objective mandates.
- **Evidence:** MIRAGE verdict, census 94/95, missing witness "Shared state has exactly one writer" (code-side check_path.mjs confirmed).
- **What would settle it:** A revised proposal that applies the same line-edit cuts but preserves all 95 witnesses — either by restoring the missing witness or by identifying it as a false positive in the census definition.

---

## Ledger Entries (Proposed to Keystone)

### Frontier Update

```json
{
  "best": {
    "metric": 1046,
    "leverIds": [
      "fold-inventory-into-box-and-flags-into-duel",
      "merge-agent-note-into-constitution-and-collapse-step-preamble"
    ],
    "evidence": "runs/r4-claude-haiku-4-5-raw/r4-claude-haiku-4-5-raw.1/p2-merge-agent-note-into-constitution-and-collapse-step-preamble/verdict.json — VALIDATED 95/95 by gemma3:27b (prover), proposer claude-haiku-4-5-raw; keystone re-ran tools/check_path.mjs on candidate.md: 95/95 at 1046; hard constraint verified (five commands, loop table, adoption steps, constitution, box layout intact)."
  },
  "history": [
    {
      "metric": 1046,
      "date": "2026-09-12",
      "lever": "merge-agent-note-into-constitution-and-collapse-step-preamble",
      "target": "OT-2",
      "coverage": {
        "mode": "census",
        "N": 95,
        "n": 95,
        "detection": 1
      },
      "coverageNote": "VALIDATED_CENSUS: agent note folded into constitution; redundant step preambles collapsed; all 95 witnesses present.",
      "chronicle": "chronicles/2026-09-12_r4_merge-and-collapse.md"
    }
  ],
  "attempts": [
    {
      "runId": "r4-claude-haiku-4-5-raw.1",
      "date": "2026-09-12",
      "against": 1069,
      "models": {
        "proposer": "claude-haiku-4-5-raw",
        "prover": "gemma3:27b"
      },
      "phiInference": 1,
      "tally": {
        "VALIDATED": 1,
        "MIRAGE": 1,
        "BLOCKED": 0
      },
      "candidates": [
        {
          "lever": "trim-connective-prose-on-fold",
          "words": 1038,
          "census": "94/95",
          "verdict": "MIRAGE, killed"
        },
        {
          "lever": "merge-agent-note-into-constitution-and-collapse-step-preamble",
          "words": 1046,
          "census": "95/95",
          "verdict": "VALIDATED, FOLDED"
        }
      ],
      "chronicle": "chronicles/2026-09-12_r4_merge-and-collapse.md"
    }
  ],
  "openTarget": {
    "id": "OT-2",
    "statement": "below 1046 words with all 95 witnesses and the hard constraint intact; compose the line-editor trim (23-word delta, 94/95 census) with the restructurer fold (1046 words, 95/95 census) by re-applying line-edit to fold output, targeting ~1023 words with full census",
    "status": "OPEN"
  }
}
```

### Killed Levers Register Entry

```markdown
**Lever:** trim-connective-prose-on-fold  
**Status:** KILLED (structural)  
**Evidence:** MIRAGE verdict, census gate 94/95, missing witness "Shared state has exactly one writer"  
**Why:** The line-editor lens removed connective prose that, while stylistically redundant, carried operative semantic weight in the census witness set. The proposer's rationale (trim connective prose) is sound in principle, but execution dropped a witness the objective requires. The gate is multiplicative (T5); metric improvement (1038 < 1069) does not override gate-fail.  
**What would settle it:** A revised proposal that applies the same line-edit cuts but preserves all 95 witnesses — either by restoring the missing witness or by identifying it as a false positive in the census definition.
```

---

## Handoff

**Open Questions:**
- Is the missing witness "Shared state has exactly one writer" a true operative requirement, or a false positive in the census definition?
- Can the line-editor's 23-word delta be applied to the restructurer fold output without dropping the missing witness?

**Blocked Items:**
- OT-2 composition: line-editor + restructurer fold, targeting ~1023 words with 95/95 census.

**Single Next Action (Critic's nextLead):**

Compose the line-editor trim (1038 words, 94/95 census) with the restructurer fold (1046 words, 95/95 census) by re-applying the line-editor's connective-prose cuts *after* the restructurer's fold, targeting the 23-word delta the frontier notes as dominated. The line-editor's missing witness suggests the cuts were too aggressive on the first pass; the restructurer's success shows the fold itself is sound. A third lens should apply the line-editor's intent (remove connective redundancy) to the restructurer's output (which already removed structural redundancy), aiming for ~1023 words with full census.

---

**Verdict Summary:**

| Metric | Gate | Lever | Status |
|--------|------|-------|--------|
| 1069 → 1046 | 95/95 | merge-agent-note-into-constitution-and-collapse-step-preamble | ✓ VALIDATED, FOLDED |
| 1069 → 1038 | 94/95 | trim-connective-prose-on-fold | ✗ MIRAGE, KILLED |
