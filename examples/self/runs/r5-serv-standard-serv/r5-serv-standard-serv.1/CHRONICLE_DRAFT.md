```markdown
---
date: 2026-09-12
seat: chronicle 📚
runId: r5-serv-standard-serv.1
verdict: PARTIAL WIN — one VALIDATED (1069 → 1046, 95/95), one MIRAGE (94/95, gate fail)
---

# Chronicle: r5-serv-standard-serv.1

## Verdict

**PARTIAL WIN.** Round r5-serv-standard-serv.1 returns one validated lever and one mirage.

- `merge-agent-note-into-constitution-and-collapse-step-preamble` — **VALIDATED** · metric 1069 → **1046** · gate **95/95** · frontier best moves.
- `trim-connective-prose-on-fold` — **MIRAGE** · metric would have been 1038 · gate **94/95** · one operative witness dropped; result is void at any metric.

The new frontier best is **1046** (from frontier.json `best.metric` 1069, now superseded by this round's VALIDATED result). OT-2 remains open.

---

## What Happened — Phase by Phase

### Measure phase

Stale check returned false. Metric confirmed at 1069, matching `frontier.json best.metric`. Two levers were costed:

- **line-editor** — cost: low; ceiling: ~1046 (DERIVED from r2 VALIDATED evidence; composability with current best not yet PROVEN on current artifact).
- **restructurer** — cost: high; ceiling: OPEN (r1 restructurer result was MIRAGE at 49/93; no witness-safe restructure result exists).

### Propose phase — two lenses

**Lens 1 · line-editor → `trim-connective-prose-on-fold`**
The proposer targeted connective prose on top of the 1069 folded document, aiming for ~31 words of saving. The rationale assumed connective-prose trims were safe because they touched only glue text. This assumption was wrong: the exact census witness `Shared state has exactly one writer` lived in that glue text. The candidate rendered it as `Shared state has one writer` — dropping `exactly`.

**Lens 2 · restructurer → `merge-agent-note-into-constitution-and-collapse-step-preamble`**
The proposer identified genuine structural redundancy: the agent note repeated content already carried by the constitution section; two framing sentences duplicated load the commands already bore. These were merged and collapsed without touching any witness string.

### Assay phase

**`trim-connective-prose-on-fold`** — prover returned MIRAGE. Gate 94/95. Failing check: `census: missing ["Shared state has exactly one writer"]`. The metric (1038) is not recorded as a result. The result is void.

**`merge-agent-note-into-constitution-and-collapse-step-preamble`** — prover returned VALIDATED. Gate 95/95. Hard constraint checked and intact: five commands in order with what each writes; loop table with all six phases; adoption steps 1–6; constitution section; box layout; no invented content. Metric 1046 beats frontier best 1069.

### Critic phase

`trim-connective-prose-on-fold` classified **structural kill**: the lever's approach (trim connective prose freely) conflicts with an operative witness that lives in connective prose. Not a probe-coverage failure; not a tooling failure. The exact string is immutable.

`merge-agent-note-into-constitution-and-collapse-step-preamble` classified **structural win**: redundancy was real and removable; no witness displaced; the win will hold under any witness draw from this census.

---

## Reversals (same prominence as wins)

**`trim-connective-prose-on-fold` is a killed lever.** The 1038 metric is not a result. The drop from 94/95 to 95/95 is not a rounding matter — one witness was paraphrased out of existence by the lens. The lever's core assumption (connective prose is witness-free) is falsified by evidence. It goes to `KILLED_LEVERS.md`.

---

## Ledger Entries — Proposed to Keystone

### frontier.json update (proposed)

```json
{
  "best": {
    "metric": 1046,
    "leverIds": [
      "fold-inventory-into-box-and-flags-into-duel",
      "merge-agent-note-into-constitution-and-collapse-step-preamble"
    ],
    "evidence": "runs/r5-serv-standard-serv/r5-serv-standard-serv.1/p2-merge-agent-note-into-constitution-and-collapse-step-preamble — VALIDATED 95/95; metric 1046; prover confirmed hard constraint intact."
  },
  "history": [
    {
      "metric": 1046,
      "date": "2026-09-12",
      "lever": "merge-agent-note-into-constitution-and-collapse-step-preamble",
      "target": "OT-2",
      "coverage": { "mode": "census", "N": 95, "n": 95, "detection": 1 },
      "coverageNote": "VALIDATED_CENSUS: agent note merged into constitution; step-preamble framing collapsed; no witness displaced.",
      "chronicle": "chronicles/2026-09-12_r5-serv-standard-serv.1_partial-win.md"
    }
  ],
  "attempts": [
    {
      "runId": "r5-serv-standard-serv.1",
      "date": "2026-09-12",
      "against": 1069,
      "phiInference": 1,
      "tally": { "VALIDATED": 1, "MIRAGE": 1, "BLOCKED": 0 },
      "candidates": [
        {
          "lever": "trim-connective-prose-on-fold",
          "words": 1038,
          "census": "94/95",
          "verdict": "MIRAGE — operative witness paraphrased out"
        },
        {
          "lever": "merge-agent-note-into-constitution-and-collapse-step-preamble",
          "words": 1046,
          "census": "95/95",
          "verdict": "VALIDATED, FOLDED"
        }
      ],
      "chronicle": "chronicles/2026-09-12_r5-serv-standard-serv.1_partial-win.md"
    }
  ],
  "openTarget": {
    "id": "OT-2",
    "statement": "below 1046 words with all 95 witnesses and the hard constraint intact; line-editor cuts (treating every exact witness string as immutable) not yet applied on top of the 1046 merged document",
    "status": "OPEN"
  }
}
```

### KILLED_LEVERS.md entry (proposed)

```markdown
## K-id: trim-connective-prose-on-fold

**Lever:** Line-edit the connective prose on top of the folded 1069 document  
**Run:** r5-serv-standard-serv · lens: line-editor  
**Verdict:** MIRAGE · gate 94/95 · metric 1038 (void — gate fail)

**What it was:** Apply connective-prose trims on top of the 1069-word folded document, targeting ~31 words of saving.

**Why it died:** The census witness `Shared state has exactly one writer` was embedded in the connective prose the lens trimmed. The candidate rendered it as `Shared state has one writer` — dropping `exactly`. Census is exhaustive at N=95 and checks are string-exact. Gate reported 94/95. The witness is operative and cannot be paraphrased or softened.

**Evidence that killed it:** prover verdict MIRAGE, gateResult 94/95, failingCheck `census: missing ["Shared state has exactly one writer"]`; scratch at `runs/r5-serv-standard-serv/r5-serv-standard-serv.1/p1-trim-connective-prose-on-fold`.

**What would be required to re-propose:** A line-editor lens that treats every exact census-witness string as immutable and trims only prose confirmed to contain no witness verbatim. The 23-word gain from r2's line-editor run has not been applied to the 1046 document; that application, so constrained, is the legitimate successor — cite this K-id.
```

---

## Myth register (capture, not develop)

> Two blades offered. One glanced off an exact string hiding in the mortar — not the bricks, the mortar. The other found a room that had been drawn on two walls at once, and erased the copy. The document is shorter; the exact words remain.

---

## Handoff

**Open questions**
- Does the 1046 document carry any other operative witnesses in connective prose that a line-editor lens might inadvertently paraphrase? Unknown until a witness-immutable pass is run.
- Is there structural redundancy remaining after the constitution/agent-note merge, or has that class of saving been exhausted?

**Blocked items**
- `trim-connective-prose-on-fold` re-proposal is blocked unless the new lens explicitly treats every exact census-witness string as immutable (K-id on record; new evidence required to lift).
- `restructurer` class remains high-risk and ceiling-unknown; no VALIDATED restructure result exists; r1 MIRAGE evidence cannot bound a witness-safe ceiling.

**Single next action — critic's nextLead**
Apply line-editor cuts to the **1046 frontier** (the `merge-agent-note` candidate), treating every exact census-witness string as immutable — including `Shared state has exactly one writer` — and targeting only prose confirmed to contain no census witness verbatim. This is the composition OT-2 named as open. It has not been attempted on top of the merged document. Estimated ceiling ~1023 (DERIVED; not PROVEN on current artifact).
```

---

**Five-line verdict summary (data return):**

```
runId: r5-serv-standard-serv.1
VALIDATED: merge-agent-note-into-constitution-and-collapse-step-preamble — 1069 → 1046, gate 95/95, frontier best moves
MIRAGE: trim-connective-prose-on-fold — metric 1038 void, gate 94/95, operative witness "Shared state has exactly one writer" paraphrased out; lever killed
openTarget: OT-2 open, margin from 1046 not yet exploited by witness-immutable line-editor pass
nextLead: apply witness-immutable line-editor to 1046 document; cite K-id trim-connective-prose-on-fold
```
