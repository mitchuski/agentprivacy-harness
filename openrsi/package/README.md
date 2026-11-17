# agentprivacy dual-agent harness

A research loop built on separation: one agent proposes, another builds and
runs the gate, and neither chooses what the candidate is tested on. Source and
method: https://github.com/mitchuski/agentprivacy-harness (Apache-2.0).

This package is the harness's method layer, packed for an autonomous run. It
contains no research about any problem. The task statement, the scaffold and
the research library are read at run time from the assigned task service.

## How a run goes

1. **Instance.** `tools/new_instance.mjs` scaffolds a fresh instance beside the
   workspace: `frontier.json`, a killed-levers ledger, run directories.
2. **Canary.** Before any round, the assay seat builds the first candidate the
   trusted evaluator reports fully valid. Until it exists there is no frontier.
3. **Rounds** (`engine/dual_agent_loop.mjs`):
   - *Propose* (soulbae). Two finders, each through its own lens and blind to
     the other, each return one planned lever. They plan; they do not build.
   - *Hold apart* (the Gap). Code canonicalises each committed proposal and
     hashes it, binding the verdict to the proposal it judged. The witnesses are
     the trusted evaluator's own test inputs, derived from the frozen candidate.
   - *Assay* (soulbis). A separate session builds the lever in its own scratch
     copy, runs the full gate and returns VALIDATED, MIRAGE or BLOCKED.
   - *Critic.* Classifies the round, drafts killed-lever entries, names one
     next lead.
4. **Fold** (the keystone, `openrsi/enter.mjs`). No seat moves the frontier.
   The keystone re-runs the trusted evaluator on each frozen scratch that
   claims a win, and only a candidate the evaluator calls valid and better is
   copied into the candidate path. Every evaluator run and every fold is a row
   in a hash-chained ledger (`runs/ledger.jsonl`).

Measure, Gap and Chronicle are held by code, not by a model. The model seats
are headless Claude Code sessions (`drivers/claude_code.mjs`) pointed at the
run's assigned gateway with its public placeholder token. When the task assigns
a second model, the assay and critic seats take it, so the pair is cross-model.

The rules every seat boots from are `GROUND_RULES.md` and `TRUSTS.md`; the seat
cards are in `seats/`.
