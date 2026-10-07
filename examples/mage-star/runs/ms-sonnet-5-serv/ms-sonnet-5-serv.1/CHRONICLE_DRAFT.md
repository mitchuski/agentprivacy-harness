```markdown
---
date: 2026-09-13
seat: chronicle
runId: ms-sonnet-5-serv.1
verdict: NO VALIDATED LEVER — both candidates MIRAGE (gate fail); best.metric holds at 1205 (frontier.json)
---

# Chronicle — ms-sonnet-5-serv.1

## Verdict (first)

No lever validated this round. Two candidates were proposed, both improved the metric, both failed the census gate — per GR-3/T5 a gate fail is a zero at any score, so neither result stands. `best.metric` remains **1205** (frontier.json), gate **57/57** (baseline, unchanged). Both failures are classified **structural**, not probe artifacts: they will fail identically on any rerun.

| Lever | Metric (before→after) | Gate | Status |
|---|---|---|---|
| tighten-narrative-prose | 1205 → 1132 | 56/57 (missing: "the Mage's tetrahedron") | MIRAGE |
| collapse-preamble-merge-mirror-passages | 1205 → 1057 | 55/57 (missing: "eight-pointed star", "the Mage's tetrahedron") | MIRAGE |

## What happened, phase by phase

**Measure.** Starting state confirmed non-stale: metric 1205, census 57/57 (frontier.json `baseline`/`best`). Two lens costs were scoped for this round: `line-editor` (low cost, ~60–120 words removable before witness risk) and `restructurer` (higher cost, ~180–300 words removable, higher MIRAGE risk).

**Propose → Assay, pass 1 (tighten-narrative-prose).** A line-edit pass cut connective prose across Act 3, reaching 1132 words. Code-side gate (`tools/check_star.mjs`) returned 56/57: the exact witness phrase "the Mage's tetrahedron" was gone, replaced by paraphrase ("traced as a second tetrahedron... the Mage's is not two stars but one"). Confirmed by direct read of the candidate, not just the gate summary.

**Propose → Assay, pass 2 (collapse-preamble-merge-mirror-passages).** A restructuring pass merged the preamble with its later mirror passages, reaching 1057 words. Gate returned 55/57: two literal phrases lost — "eight-pointed star" (demoted to an Act header only, not present in body) and "the Mage's tetrahedron" (again paraphrased as "stella octangula" / "the Mage's antipode" / "second tetrahedron"). Confirmed by direct read.

**Critic.** Both levers classified **structural**: the census checks fixed exact phrases (N=57), and in both cases the lens's own mechanism — prose-tightening or merge-and-paraphrase — is what erased the literal phrase, not sampling luck. Same candidate text would fail identically on rerun.

## Reversals (same prominence as wins)

Both attempted metric wins are void under GR-3/T5. 1132 and 1057 are **not** improvements on the frontier — they are killed candidates. No forward motion on `OT-1` this round; `best.metric` stays at 1205.

## Ledger entries proposed to keystone

**KILLED_LEVERS.md additions (K-id: to be assigned by keystone):**

1. **Lever:** tighten-narrative-prose (lens: line-editor).
   **What it was:** line-edit pass on Act 3 cutting connective prose, intending to preserve every witness.
   **Why it died:** census 56/57 — missing "the Mage's tetrahedron"; the edit paraphrased the antipode/second-tetrahedron passage instead of retaining the literal witness phrase.
   **Evidence:** `tools/check_star.mjs` gate output at `runs/ms-sonnet-5-serv/ms-sonnet-5-serv.1/p1-tighten-narrative-prose`; confirmed by direct read.
   **Constraint on re-proposal:** do not re-propose a bare "tighten prose" lever without a mechanism that explicitly protects exact witness phrases from paraphrase.

2. **Lever:** collapse-preamble-merge-mirror-passages (lens: restructurer).
   **What it was:** collapsing the preamble and merging each passage with its later mirror to cut redundancy.
   **Why it died:** census 55/57 — missing "eight-pointed star" (relegated to Act header only) and "the Mage's tetrahedron" (paraphrased).
   **Evidence:** `tools/check_star.mjs` gate output at `runs/ms-sonnet-5-serv/ms-sonnet-5-serv.1/p2-collapse-preamble-merge-mirror-passages`; confirmed by direct read.
   **Constraint on re-proposal:** do not re-propose merging mirror passages without a mechanism that preserves exact witness phrasing in-body, not just in headers.

**frontier.json `attempts` entries proposed (metric moved, both void — for keystone to log, not fold into `best`):**
- `{ metric: 1132, gate: "56/57", lever: "tighten-narrative-prose", status: "MIRAGE", failingCheck: "missing the Mage's tetrahedron" }`
- `{ metric: 1057, gate: "55/57", lever: "collapse-preamble-merge-mirror-passages", status: "MIRAGE", failingCheck: "missing eight-pointed star, the Mage's tetrahedron" }`

No change proposed to `best` or `history` — neither result qualifies.

## MYTH (narrative register, capture not develop)

Two blades were swung at the Star this round, and both cut through the very
points they were sworn to protect — the tetrahedron of the Mage, twice
paraphrased into vanishing. The gate does not bargain with elegant prose;
it asks only whether the star still has eight points, or seven-and-a-shadow.

## Handoff

- **Open questions:** Can a witness-protection mechanism (span-freezing) be layered onto either lens without reintroducing the same paraphrase failure mode?
- **Blocked items:** `OT-1` (below 1205 with 57/57 intact) remains open; no candidate has cleared gate this round.
- **Single next action (critic's nextLead):** Try a witness-protected line-edit — build an allowlist of the sentences/spans containing each of the 57 exact witness phrases, freeze those spans verbatim, and apply prose-tightening or merging only to the connective material outside them, isolating the metric-cutting lens from the phrases the census checks.
```

**Five-line verdict summary (returned as data):**
1. No lever validated this round; `best.metric` holds at 1205, gate 57/57 (frontier.json).
2. `tighten-narrative-prose`: 1205→1132 words, gate 56/57, MIRAGE (missing "the Mage's tetrahedron") — killed.
3. `collapse-preamble-merge-mirror-passages`: 1205→1057 words, gate 55/57, MIRAGE (missing "eight-pointed star", "the Mage's tetrahedron") — killed.
4. Both failures classified structural by the critic — mechanism-caused, not sampling artifacts; would fail identically on rerun.
5. Next action: witness-protected line-edit — freeze exact-phrase spans, tighten only connective prose outside them.
