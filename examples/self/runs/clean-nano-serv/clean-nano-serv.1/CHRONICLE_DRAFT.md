## VALIDATED (gate N/N = 95/95); metric 1069 before → after (fold already applied)

### Snapshot (from `frontier.json` / run history)
- **Baseline (1115) → Best (1069)** via lever: `fold-inventory-into-box-and-flags-into-duel` with **gate 95/95**.
- Current round’s target is **openTarget OT-2**: **below 1069 words** while keeping **all 95 witnesses** and the **GR-3 hard door constraint** intact.

---

## Verdict (round `clean-nano-serv.1`)
- **cut-adopt-intro-glue**: **MIRAGE** — gate **95/95**, but **hardConstraint failed** (GR-3 door test: the required stranger-openable five-command loop/table/constitution/box-layout specifics were not satisfied by the candidate text).
- **merge-agent-note-into-constitution-and-collapse-step-preamble**: **MIRAGE** — gate **95/95**, but **hardConstraint failed** (GR-3 door test: document-layout mismatch vs the required five-command/loop/constitution/box-layout specifics).

---

## Phase by phase (chronicle)
### 1) Probe / candidate assembly (utilized held-out witnesses)
- Candidate(s) were produced for word-reduction levers intended to cut plausible connective/restructuring prose while preserving the census witness set.
- **Held-out gate check** ran and returned **95/95** presence for both candidates.

### 2) Conformance / hard constraint (door test) evaluation
- Despite gate success, the **stranger-openable objective.hardConstraint** did not hold for either candidate.
- Therefore, under **GR-3**, both outcomes are treated as **not results** (no “better metric” acceptance without the hard door satisfied).

### 3) Reversals (prominence-matched)
- **No fold was reverted** (the best lever `fold-inventory-into-box-and-flags-into-duel` remains the current validated anchor at **1069**, with **gate 95/95**).
- The proposed reductions were **not adopted**; they were logged as **MIRAGE** under the “door failed” failure mode.

---

## Lever ledger returned to keystone (proposed entries)
1. `clean-nano-serv.1/p1-cut-adopt-intro-glue`
   - Status: **MIRAGE**
   - Metric: **1061**
   - Gate: **95/95**
   - Reason (GR-3): missing required keystone-only stranger-openable five-command loop/table/constitution/box-layout specifics.
2. `clean-nano-serv.1/p2-merge-agent-note-into-constitution-and-collapse-step-preamble`
   - Status: **MIRAGE**
   - Metric: **1046**
   - Gate: **95/95**
   - Reason (GR-3): document mismatch vs required five-command/loop/constitution/box-layout door test.

---

## Failure notes (MYTH, capped)
- The edits reduced prose footprint, but the “what a stranger opens first” document-shape didn’t survive contact with the door.
- The census agreed the witnesses were present; the door disagreed that the artifact guaranteed nothing invented.

```text
OPEN QUESTIONS · BLOCKED ITEMS · single next action

- Open: Can we cut connective/restructuring words *while exactly preserving* the stranger-openable five-command loop/table/adoption steps/constitution/box layout required by objective.hardConstraint?
- Blocked: Both tested cuts passed census (95/95) but failed the GR-3 door layout test.
- single next action (critic’s nextLead): Run an updated candidate that explicitly satisfies objective.hardConstraint’s stranger-first five-command order plus loop table/adoption steps/constitution/box layout, then re-check via tools/check_path.mjs until the door-test passes while keeping census at 95/95.
```
