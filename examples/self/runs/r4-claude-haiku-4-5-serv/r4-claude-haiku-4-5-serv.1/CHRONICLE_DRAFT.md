# CHRONICLE DRAFT

**Verdict:** VALIDATED 1 of 2 candidates. Metric 1069 → **1046** (23-word improvement). Gate 95/95 passes. Hard constraint intact. Fold composition ready.

---

## Phase: Proposal & Assay (r4-claude-haiku-4-5-serv.1)

Two levers proposed against frontier best (1069 words, 95/95 census):

1. **trim-connective-prose-on-fold** — Attempt to compose line-editor cuts (23 words) atop the r2 fold. **MIRAGE** (94/95 census). Missing witness: *Shared state has exactly one writer*. The proposer deleted this constraint from the adoption steps during prose trimming, violating GR-10 (keystone-only writes to constraint ledgers). Structural failure, not probe-limited.

2. **merge-agent-note-into-constitution-and-collapse-step-preamble** — Fold the agent note into TRUSTS.md and remove redundant framing. **VALIDATED** (95/95 census, 1046 words). Hard constraint verified: document remains the stranger's entry point with five commands in order, their outputs, loop table, adoption steps, constitution, and box layout. No invented content. Clean structural win.

---

## What Happened

**Proposer (Claude Haiku 4.5)** generated two distinct structural edits:

- Lever 1 exposed a gap: trimming connective prose without re-anchoring hard constraints leaves witnesses orphaned. The line-editor lens is sound; the implementation was incomplete.
- Lever 2 succeeded by collapsing redundancy (agent note merged into constitution preamble) while preserving all 95 witnesses. The fold is tight and the constraint coverage is explicit.

**Prover (gemma3:27b)** ran census gate on both candidates. Lever 1 failed at the gate (94/95); lever 2 passed (95/95).

**Keystone** re-ran `tools/check_path.mjs` on the VALIDATED candidate and confirmed 95/95 and metric 1046.

---

## Reversals & Kills

**K-1: trim-connective-prose-on-fold** — Structural kill. The line-editor lens correctly identified 23 words of connective prose to cut, but the proposer did not re-anchor the witness *Shared state has exactly one writer* in the adoption steps before trimming. GR-10 binds: the keystone alone writes constraint ledgers, and this constraint must be explicit in the hard constraint's coverage. Do not re-propose without adding the constraint back to adoption steps or box layout before trimming.

---

## Ledger Entries (Proposed to Keystone)

**frontier.json updates:**

- `best.metric`: 1069 → **1046**
- `best.leverIds`: `["fold-inventory-into-box-and-flags-into-duel"]` → `["fold-inventory-into-box-and-flags-into-duel", "merge-agent-note-into-constitution-and-collapse-step-preamble"]`
- `best.evidence`: Add run r4 VALIDATED verdict and keystone re-run confirmation.
- `history`: Append r4 attempt record (2 candidates, 1 VALIDATED, 1 MIRAGE, tally 1/2).
- `openTarget.statement`: Update to "below 1046 words with all 95 witnesses and hard constraint intact; line-editor trim (23 words) composes on top of merge-and-collapse fold."

**KILLED_LEVERS.md entry:**

- **K-1: trim-connective-prose-on-fold** — Structural kill. Proposer trimmed connective prose without re-anchoring hard constraint witness. Evidence: r4 verdict.json, census 94/95, missing witness *Shared state has exactly one writer*. Line-editor lens sound; implementation incomplete. Do not re-propose without constraint re-anchored.

---

## Handoff

**Open questions:**
- Can the line-editor trim (23 words) be re-anchored and composed on top of the merge-and-collapse fold (1046 words, 95/95)?
- Are there other redundancies in the constitution or adoption steps that can be collapsed without dropping witnesses?

**Blocked items:**
- Line-editor composition blocked until K-1 is resolved (constraint re-anchoring required).

**Next action (critic's nextLead):**
Compose the line-editor trim on top of the merge-and-collapse fold. The proposer must re-anchor *Shared state has exactly one writer* in the adoption steps before trimming connective prose. Target: below 1046 with all 95 witnesses intact.
