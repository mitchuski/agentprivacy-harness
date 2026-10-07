```markdown
---
date: 2026-09-12
seat: chronicle
runId: r5-claude-sonnet-5-serv.1
verdict: VALIDATED — new best 1046 words (was 1069), gate 95/95; one reversal (MIRAGE) filed alongside the win
---

# r5-claude-sonnet-5-serv.1 — the second fold, with a near-miss beside it

## Verdict (first)

**VALIDATED.** Metric moves **1069 → 1046** words (frontier.json `best.metric`), gate **95/95** (census, `tools/check_path.mjs`), via lever `merge-agent-note-into-constitution-and-collapse-step-preamble`. This closes `OT-2` (target: below 1069 with all 95 witnesses). All five hard-constraint elements confirmed intact end-to-end: five numbered commands with what each writes, the six-phase loop table plus keystone row, the six-step adoption path, the two-item constitution (TRUSTS.md/GROUND_RULES.md, AGENTS.md note folded in), and the full box layout (engine/seats/drivers/tools/templates/examples/optional).

Beside the win, one proposal died at the gate — recorded with equal prominence (GR-6): `trim-connective-prose-on-fold` reached 1038 words but scored **94/95**, having silently rewritten the witness phrase "Shared state has exactly one writer" to "Shared state has one writer." Per GR-3/T5 the gate is hard and multiplicative: 1038 < 1069 is irrelevant once the census fails. **MIRAGE**, not a lesser result — zero.

## What happened, phase by phase

1. **Measure.** Starting metric confirmed at 1069 (frontier `best`), not stale. Two candidate levers costed: line-editor (low cost, ceiling ≈1046 by composability note) and restructurer (high cost, no valid ceiling — killed at 49/93 in r1, GR-6 bars re-proposal without new evidence).
2. **Propose → Assay.** Two proposals ran against the 1069 fold:
   - `trim-connective-prose-on-fold` — connective-prose line edit projecting 1038 words. **MIRAGE**: gate 94/95, missing witness "Shared state has exactly one writer" (exact phrasing altered).
   - `merge-agent-note-into-constitution-and-collapse-step-preamble` — folds the AGENTS.md note into the two-item constitution and collapses redundant step-preamble framing. **VALIDATED**: gate 95/95 at 1046 words.
3. **Critic classification.** Both verdicts classified **structural** (not probe artifacts): the census runs in full mode (N=95, no sampling), so the MIRAGE's missing witness is a deterministic fact reproducible on any re-run, and the VALIDATED win's redundancy removal left no witness phrasing disturbed. Neither verdict is provisional on re-verification.
4. **Chronicle (this phase).** Draft filed; ledger entries below returned to the keystone for serialization (T3 — only the keystone writes `frontier.json`, `claims_register.md`, `manifest.yaml`).

## Reversal, at full prominence

`trim-connective-prose-on-fold` is **killed**, not merely set aside:

- **K-id (proposed, keystone to assign):** trim-connective-prose-on-fold
- **What:** line-editor pass on the 1069 fold, targeting connective prose, projected 1038 words.
- **Why it died:** rewrote the load-bearing witness sentence "Shared state has exactly one writer" → "Shared state has one writer," dropping the exact phrase `check_path.mjs` requires. Census: 94/95.
- **Evidence:** `runs/r5-claude-sonnet-5-serv/r5-claude-sonnet-5-serv.1/p1-trim-connective-prose-on-fold/verdict.json`, gateResult 94/95, failingCheck "census: missing Shared state has exactly one writer."
- **Status:** killed per GR-6. No re-proposal without new evidence that connective-prose line-editing can preserve exact witness phrasing.

## Ledger entries proposed to the keystone

- `best.metric`: 1069 → **1046**
- `best.leverIds`: append `merge-agent-note-into-constitution-and-collapse-step-preamble`
- `best.evidence`: `runs/r5-claude-sonnet-5-serv/r5-claude-sonnet-5-serv.1/p2-merge-agent-note-into-constitution-and-collapse-step-preamble/verdict.json` — VALIDATED 95/95, metric 1046
- `history[]`: new entry, metric 1046, lever `merge-agent-note-into-constitution-and-collapse-step-preamble`, target OT-2, coverage 95/95 census, chronicle path (this file, once keystone files it)
- `attempts[]`: new entry `r5-claude-sonnet-5-serv.1`, against 1069, tally `{VALIDATED:1, MIRAGE:1, BLOCKED:0}`, candidates as above
- `closedTargets[]`: append OT-2, closedBy `merge-agent-note-into-constitution-and-collapse-step-preamble`, from 1069 to 1046
- `openTarget`: new OT-3 — "below 1046 words with all 95 witnesses and the hard constraint intact; the connective-prose cut is only available with witness-exact phrasing preserved, starting from 'Shared state has exactly one writer'" — status OPEN
- `notes/KILLED_LEVERS.md`: append the K-id entry above (draft text supplied; keystone assigns final numbering)

## Handoff

**Open questions**
- Whether the connective-prose cut (~23 words) can be re-derived without touching any exact witness phrase — untested with that explicit constraint.
- Whether further redundancy exists elsewhere in the constitution/AGENTS-note merge beyond what this round folded.

**Blocked items**
- None. Both proposals in this round ran to completion (no transport failures, unlike r2-incomplete).

**Single next action (critic's nextLead)**
> Re-attempt the line-editor connective-prose cut, but seeded on top of the newly VALIDATED 1046 `merge-agent-note-into-constitution-and-collapse-step-preamble` candidate rather than the 1069 fold, and with an explicit constraint that no witness's exact phrasing (starting with "Shared state has exactly one writer") may be altered — only surrounding connective prose is eligible for the cut.
```

---

**Five-line verdict summary (returned as data):**

1. VALIDATED — metric 1069 → 1046 words, gate 95/95, lever `merge-agent-note-into-constitution-and-collapse-step-preamble`; closes OT-2.
2. Reversal filed at equal prominence: `trim-connective-prose-on-fold` MIRAGE at 1038 words / 94/95 — dropped exact witness phrase "Shared state has exactly one writer"; killed per GR-6.
3. Both verdicts classified structural by the critic (full census, N=95 — not probe artifacts); no re-verification caveat.
4. Ledger entries returned to keystone: best metric/leverIds/evidence update, history + attempts entries, OT-2 closed, OT-3 opened, KILLED_LEVERS.md draft entry.
5. Next action: re-attempt the connective-prose cut seeded on the 1046 candidate, with hard constraint to preserve exact witness phrasing.
