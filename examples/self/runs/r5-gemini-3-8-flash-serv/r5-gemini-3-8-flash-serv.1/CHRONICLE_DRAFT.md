---
date: 2026-09-12
seat: chronicle
runId: r5-gemini-3-8-flash-serv.1
verdict: VALIDATED (1069 → 1046 words, census 95/95); 1 MIRAGE (1038 words, census 94/95)
---

# Verdict

- **Frontier baseline:** 1069 words (`frontier.json`).
- **Validated lever:** `merge-agent-note-into-constitution-and-collapse-step-preamble` achieved 1046 words (census 95/95, gate passed, hard constraint intact).
- **Mirage lever:** `trim-connective-prose-on-fold` recorded 1038 words but failed census at 94/95 (missing witness: `"Shared state has exactly one writer"`).
- **Net progress:** Validated improvement of 23 words (1069 → 1046) while retaining all 95 census witnesses verbatim.
- **Constitutional outcome:** Under T5 and GR-3, the 1038-word candidate collapses to zero; only the 1046-word candidate qualifies for keystone fold-in.

---

# Phase by Phase

### 1. Measure
- Read `artifact/PATH.md` against `frontier.json`.
- Metric confirmed at 1069 words, non-stale (`stale: false`), census intact at 95/95.
- Lever ceilings identified: line-editor (low risk, ~23 words), restructurer (high risk, 50+ words).

### 2. Propose & Gap
- Scratch copy `p1-trim-connective-prose-on-fold` cut connective phrasing across the folded base.
- Scratch copy `p2-merge-agent-note-into-constitution-and-collapse-step-preamble` merged the agent note into the constitutional section and condensed adoption step preambles.
- Verification witnesses derived independently via Fiat-Shamir hash without proposer foreknowledge (GR-4).

### 3. Assay
- `p1-trim-connective-prose-on-fold`: Evaluated to 1038 words. The code-side census gate returned 94/95. The proposer altered the required witness `"Shared state has exactly one writer"` to `"Shared state has one writer"`. Verdict: **MIRAGE**.
- `p2-merge-agent-note-into-constitution-and-collapse-step-preamble`: Evaluated to 1046 words. Census verified at 95/95. Hard constraint satisfied: five commands in sequence with outputs, full loop table, six adoption steps, constitution trusts/rules, and box layout intact. Verdict: **VALIDATED**.

### 4. Critic
- Classified both levers structurally.
- Noted that `trim-connective-prose-on-fold` failed solely due to a single dropped token in an exact witness string.
- Formulated the next lead to re-target the connective-prose savings on top of the newly validated 1046-word baseline without modifying required strings.

---

# Reversals and Killed Levers

Recorded with equal prominence to validated gains (GR-6):

### K-trim-connective-prose-on-fold
- **What it was:** Proposed cutting connective prose across the folded path artifact to lower word count to 1038.
- **Why it died:** Census gate failure (94/95). Proposer compressed `"Shared state has exactly one writer"` to `"Shared state has one writer"`.
- **Evidence:** `runs/r5-gemini-3-8-flash-serv/r5-gemini-3-8-flash-serv.1/p1-trim-connective-prose-on-fold` census output: missing witness `"Shared state has exactly one writer"`.
- **Status:** Killed. Re-proposal forbidden unless exact witness preservation is guaranteed.

---

# Ledger Entries Returned to Keystone

### Proposed `frontier.json` update
```json
{
  "best": {
    "metric": 1046,
    "leverIds": [
      "fold-inventory-into-box-and-flags-into-duel",
      "merge-agent-note-into-constitution-and-collapse-step-preamble"
    ],
    "evidence": "runs/r5-gemini-3-8-flash-serv/r5-gemini-3-8-flash-serv.1/p2-merge-agent-note-into-constitution-and-collapse-step-preamble — VALIDATED 95/95; tools/check_path.mjs: 95/95 at 1046 words."
  },
  "openTarget": {
    "id": "OT-3",
    "statement": "below 1046 words with all 95 witnesses intact; connective prose line-edits remain unharvested",
    "status": "OPEN"
  },
  "closedTargets": [
    {
      "id": "OT-2",
      "statement": "below 1069 words with all 95 witnesses and the hard constraint intact",
      "closedBy": "merge-agent-note-into-constitution-and-collapse-step-preamble",
      "date": "2026-09-12",
      "from": 1069,
      "to": 1046
    }
  ]
}
```

### Proposed `notes/KILLED_LEVERS.md` entry
```markdown
## K-trim-connective-prose-on-fold (2026-09-12)
- **Lever:** trim-connective-prose-on-fold
- **Run:** r5-gemini-3-8-flash-serv.1
- **Score:** 1038 words (nominal win vs 1069)
- **Gate:** 94/95 (MIRAGE)
- **Failure:** Missing witness "Shared state has exactly one writer" (contracted to "Shared state has one writer").
- **Rule Citation:** GR-3, T5.
```

---

# Myth

```myth
The blade severed a single syllable from the census stone, and the palace of thirty words dissolved into smoke. Soulbis did not blink; a gate with ninety-four pillars is a gate that crushed the traveler. Soulbae gathered the second scroll, where every ancient name was carved unbent, and laid down twenty-three paces of clear road.
```

---

# Handoff

- **Open Questions:** Can the ~23 words targeted by the killed line-editor lever be safely extracted from the remaining connective prose without encroaching on census boundaries?
- **Blocked Items:** None. Scratch fold-in is ready for keystone review and merge (GR-10).
- **Single Next Action:** Apply line-edits to connective prose against the newly validated 1046-word base while strictly preserving all 95 witness strings verbatim, including `"Shared state has exactly one writer"`.
