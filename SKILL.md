---
name: dual-agent-harness
description: Build or run a soulbis ⚔️ ⊥ soulbae 🧙 dual-agent harness — a proposer and a prover held apart by a Fiat-Shamir Gap, so no result survives that the proposer could have tuned to. Use when setting up a rigorous optimization or autoresearch loop, when an agent keeps grading its own work, when you need held-out validation of AI-proposed changes, or when someone says "dual agent harness", "held-apart agents", "soulbis/soulbae", "autoresearch loop", "the proposer is marking its own homework", or "build my own harness path".
license: Apache-2.0
metadata:
  version: 1.0.0
  origin: 0xagentprivacy
  inscription: "(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ"
  proverb: "The proposer that grades itself builds mirages; only what the Gap could not tune to is a result."
  spell: "measure → propose(held-apart) → hunt → assay(held-out) → critic → accept-only-on-validated-product"
---

# Dual-agent harness

A two-agent loop where the agent that proposes changes and the agent that
validates them are **architecturally held apart**. Between them sits the Gap:
verification witnesses are derived by hashing the proposal itself, so the
proposer cannot have optimised for them and the prover cannot be accused of
choosing them.

Use it whenever a single agent would otherwise propose a change, run its own
check, and declare victory. That loop produces **mirages** — candidates that
pass the author's own probe and fail the real gate. This harness makes the
mirage a named verdict rather than a surprise.

## When to use

- Setting up an optimization loop (make X smaller/faster/cheaper subject to a
  constraint that must not break).
- Setting up an autoresearch loop (produce a claim, then prove it against
  evidence the producer did not select).
- Any time an AI-proposed change needs held-out validation before a human
  signs off.

## Build recipe

1. **Define the Gap first.** If you cannot say how held-out witnesses derive
   from a proposal by hashing, you do not have a harness yet — you have a
   to-do list. Everything else follows from this.
2. **Name the objective, the gate, and the hard constraint.** The gate is a
   factor in a product: any zero collapses the result at any score. The hard
   constraint is validity no score can override.
3. **Give the proposer at least two blind lenses.** For a product objective,
   one lens per factor, plus a cliff-watcher in the prover.
4. **Copy `templates/harness.config.mjs`**, fill every TODO, bundle it with
   `tools/bundle.mjs`, run it.
5. **Fold as the keystone**, in the main session, with `conform.mjs` green
   before and after.

## Hard rules

- A candidate is not a result. Only a full-gate pass, hard constraint intact,
  and a frontier beat is `VALIDATED`.
- Witnesses never come from the proposer. A validation on proposer-suggested
  witnesses is void.
- A probe pass that fails the full gate is a `MIRAGE`. Name it; never soften
  it.
- Negative results are filed as prominently as wins.
- **The door is the First Person's.** Push, submit, publish, send — the
  harness stops in front of these and lists them. It never opens them.

## Map

`TRUSTS.md` (the constitution — six trusts, and where each one bites) ·
`GROUND_RULES.md` (GR-1..GR-10) · `SEAT_CONTRACT.md` (the config interface) ·
`seats/` (seven cards) · `engine/dual_agent_loop.mjs` (the loop) ·
`engine/conform.mjs` (the gate that proves the algebra rather than asserting
it) · `examples/field-guide/` (a runnable toy) · `SPECIALISATION.md`
(personas, spells, and the Game of 42 station pattern) · `HARNESS_PATHS.md`
(eight real instances, grouped by how much of the loop each runs).
