```markdown
---
date: 2026-09-13
seat: chronicle
runId: ms-nano-raw.1
verdict: BLOCKED
---

## Verdict (first)
**Verdict: BLOCKED — no validated lever accepted this session.**  
- **Baseline metric:** 1205 (frontier.json) with **gate N/N = 57/57**  
- **Tried lever outcomes (all MIRAGE; gate failed):**
  - `tighten-narrative-prose`: **1132 words**, **gate 56/57**, failingCheck: *census missing the Mage's tetrahedron* (held-out gate did not pass)
  - `collapse-preamble-merge-mirror-passages`: **1057 words**, **gate 55/57**, failingCheck: *census missing eight-pointed star* (held-out gate did not pass)

## What happened (phase by phase)
### 1) Chronicle phase setup
- Read-only: `GROUND_RULES.md`, `TRUSTS.md`, this chronicle card, and `frontier.json` (sole authority for numbers per GR-1).
- Established that this session has an **OPEN target**: reduce below the frontier metric while keeping **all 57 witnesses** and satisfying the **hard constraint** (frontier.json).

### 2) Lever attempt — word reduction with narrative tightening (probe)
- Proposed lever: `tighten-narrative-prose`
- Result classification: **MIRAGE**
- Gate outcome: **56/57**, failingCheck explicitly states the held-out census is missing **“the Mage's tetrahedron”**.
- Because the held-out gate did not pass, the objective’s hard constraint cannot be treated as satisfied, so **no result** is accepted (GR-5, GR-3).

**Reversal (recorded with same prominence as progress):**
- KILLED: `tighten-narrative-prose` — died because held-out census gate failed (56/57) with missing witness explicitly listed as **“the Mage's tetrahedron”**.

### 3) Lever attempt — preamble restructure via passage collapse (probe)
- Proposed lever: `collapse-preamble-merge-mirror-passages`
- Result classification: **MIRAGE**
- Gate outcome: **55/57**, failingCheck explicitly states the held-out census is missing **“eight-pointed star”** (and gate side-notes also indicate missing witness coverage for **“the Mage's tetrahedron”**).
- Because the held-out gate did not pass, **no result** is accepted (GR-5, GR-3).

**Reversal (recorded with same prominence as progress):**
- KILLED: `collapse-preamble-merge-mirror-passages` — died because held-out census gate failed (55/57) with missing witness explicitly listed for **“eight-pointed star”**.

## Ledger entries proposed (to keystone)
- Return (record) killed lever drafts for this session:
  - `KILLED: tighten-narrative-prose`
  - `KILLED: collapse-preamble-merge-mirror-passages`

*(No updates to `frontier.json` requested; no validated lever met the gate requirements.)*

## Handoff (open questions · blocked items · single next action)
### Open questions
- Which exact textual sites correspond to the held-out missing witnesses (**“the Mage's tetrahedron”** and **“eight-pointed star”**) so token-level edits can reduce words without removing witness coverage.

### Blocked items
- Structural edits performed under these levers caused witness coverage loss, yielding **MIRAGE** each time.

### single next action (critic’s nextLead)
- **Run a probe that preserves all 57 witnesses** (no witness-coverage changes; only token-level whitespace/formatting edits), then **re-attempt word reduction** only after the held-out census returns **57/57**; if further structural reductions are attempted, add an explicit witness-preservation check keyed to the missing items.
```
