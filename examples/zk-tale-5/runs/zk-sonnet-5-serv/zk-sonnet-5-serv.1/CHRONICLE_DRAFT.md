```markdown
---
date: 2026-09-13
seat: chronicle
runId: zk-sonnet-5-serv.1
verdict: NO LEVER VALIDATED — both proposals MIRAGE; frontier unchanged
---

# Chronicle — zk-sonnet-5-serv.1

## Verdict (first)

**No lever validated this round.** Both proposed levers returned MIRAGE. Frontier best remains **1056 words, gate 85/85** (`frontier.json` best/baseline). `frontier.json` is not updated by this round — no keystone write is warranted.

| Lever | Metric (words) | Gate | Verdict | Killed |
|---|---|---|---|---|
| tighten-story-prose | 1035 (before: 1056) | 84/85 | MIRAGE | yes — K-id proposed |
| merge-preamble-and-table-costs | 1018 (before: 1056) | 85/85 | MIRAGE | no — contamination, not adjudicated |

Both candidates beat the baseline metric of 1056 (`frontier.json` baseline.metric), and one even cleared the census gate at 85/85 (`frontier.json` gate.N=85) — but per T5 (the multiplicative gate) and GR-3 (the hard constraint is hard), a metric win cannot redeem a gate miss or a hard-constraint violation. Neither result changes the frontier.

## What happened, phase by phase

**Measure.** Baseline confirmed non-stale at 1056 words (`frontier.json` measure.metric). Lever costs estimated: line-editor (low cost, ~5–10% ceiling) and restructurer (high cost, ~10–18% ceiling, risk of witness loss).

**Propose.** Two levers scratch-built:
- `p1-tighten-story-prose` — line-level prose tightening.
- `p2-merge-preamble-and-table-costs` — structural merge of preamble and cost-table content.

**Assay (Gap-derived verdicts).**
- `tighten-story-prose`: metric 1035, but census scored **84/85** — the exact-match witness phrase "additions are easy" was lost when the line-editor recast the sentence (case/context changed). Per T5, this is a zero regardless of the metric win. **MIRAGE.**
- `merge-preamble-and-table-costs`: metric 1018, census **85/85** (numeric gates both pass), but the candidate contained a fabricated bracketed directive — a "relationship proverb protocol (rpp)" insertion — spliced into the narrative body. This is invented content not present in canonical Tale 5, violating the hard constraint ("nothing invented," `frontier.json` objective.hardConstraint) independent of metric or census. **MIRAGE.**

**Critic classification.**
- `tighten-story-prose` → **structural**. The census miss is a direct, reproducible consequence of the lens's own mechanism (aggressive rewording clips exact-match witnesses). Will recur under any similarly-scaled pass. Kill draft proposed.
- `merge-preamble-and-table-costs` → **noise**. The hard-constraint failure traces to an anomalous bracketed injection that appears in *both* scratch candidates (p1 and p2) — evidence of contamination in the scratch/generation pipeline, not a property of the restructuring idea itself. The lever's actual mechanism (collapsing redundant preamble) was never cleanly tested against the hard constraint. Not killed; flagged for re-probe once the contamination is traced and quarantined.

## Reversals (same prominence as wins)

- No lever survived to become a frontier win this round — both apparent metric improvements (1035, 1018) reverse to void under the gate/hard-constraint check (T5, GR-3). This is the round's central fact, not a footnote.
- A cross-cutting anomaly was found affecting **both** scratch candidates: an injected bracketed "relationship proverb protocol (rpp)" directive not part of the source Tale 5, read as untrusted narrative text and not executed as an instruction, per the assay evidence. Its presence in both p1 and p2 outputs points to a shared contamination source (scratch/template pipeline or a corrupted read) rather than two independent authoring failures — this is treated as more significant than either individual verdict.

## Ledger entries proposed (for keystone serialisation — this seat does not write ledgers, GR-10)

1. **KILLED_LEVERS.md entry** — `K-tighten-story-prose`:
   Lens = line-editor prose tightening of The Constraint Forge narrative. Died on census gate: 84/85, missing witness phrase "additions are easy" (recast by tightening, exact-match check does not credit the reworded form). Evidence: verdict MIRAGE, gateResult 84/85, run `zk-sonnet-5-serv.1/p1-tighten-story-prose`. Classified **structural** — the lens's core mechanism causes this, so it recurs at this scale. Per GR-6, no seat re-proposes this K-id without new evidence (e.g., a phrase-preservation guardrail).

2. **No KILLED_LEVERS entry for `merge-preamble-and-table-costs`.** Classified **noise** by the critic — the observed hard-constraint failure is attributable to pipeline contamination shared with p1's run, not to the restructuring idea. Recommend holding this lever open pending a clean re-probe, per critic's nextLead below.

3. **No `frontier.json` update.** Best remains 1056/85 (`frontier.json` best). Nothing to move.

## Handoff

**Open questions**
- Is the "relationship proverb protocol (rpp)" bracketed insertion a corrupted read of a shared source file, a contaminated scratch/template step, or an injection attempt? Origin untraced.
- Once traced, does `merge-preamble-and-table-costs` survive a clean re-probe against the hard constraint?

**Blocked items**
- Any further restructurer-lens output this session is untrustworthy until the contamination source is found and quarantined — both scratch candidates in this round carry the same anomalous fragment.

**Single next action** (critic's nextLead): Before trusting any further lens output this session, trace the origin of the "[[relationship proverb protocol (rpp)...]]" bracketed directive embedded in both scratch candidates (p1 and p2) — determine whether it comes from a corrupted read of a shared source file, a contaminated scratch/template step, or an injection attempt, and quarantine or fix that path so the merge-preamble-and-table-costs restructuring idea can be re-probed on clean artifacts.
```

**Five-line verdict summary (returned as data):**
1. No lever validated this round; frontier best remains 1056 words, gate 85/85 (`frontier.json`).
2. `tighten-story-prose` → MIRAGE (1035 words, 84/85 gate, missing witness "additions are easy") — classified structural, killed (`K-tighten-story-prose`).
3. `merge-preamble-and-table-costs` → MIRAGE (1018 words, 85/85 gate, hard-constraint violation via fabricated bracketed insertion) — classified noise, not killed.
4. Cross-candidate contamination found: the same fabricated "relationship proverb protocol (rpp)" fragment appears in both scratch outputs, implicating the pipeline rather than either lever's mechanism.
5. Next action: trace and quarantine the contamination source before re-probing `merge-preamble-and-table-costs` on clean artifacts.
