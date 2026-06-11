---
name: dual-agent-harness
description: >-
  Build and run interchangeable Swordsman ⚔️ ⊥ Mage 🧙 dual-agent harnesses: an autoresearch loop
  where a proposer (Mage, reduces) and a prover (Swordsman, validates) are held apart by a held-out
  gate the proposer cannot tune to. Use when building a "propose a cheaper artifact, prove it on a
  gate it cannot game" loop for any domain — circuit/gate/qubit reduction, ZKP audit, cost/gas
  optimization — or when assigning personas + skills to harness seats for a purpose. This is the
  framework home; the canonical skill (agentprivacy-skills mirrors it). Triggers: "dual-agent harness",
  "swordsman mage harness", "build a harness", "plug in a harness", "autoresearch loop", "held-apart agents".
license: Apache-2.0
metadata:
  version: "1.0"
  category: "meta"
  origin: "0xagentprivacy"
  status: "working_paper"
  introduced: "2026-06-10"
  algebra: "(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ ; proven on Z/64Z: neg(bnot(x)) = succ(x)"
  proverb: "The proposer that grades itself builds mirages; only what the Gap could not tune to is a result."
  spell: "measure → propose(held-apart) → hunt → assay(held-out) → critic → accept-only-on-validated-product"
  home: "C:/Users/mitch/agentprivacy-dual-agent-harness (the framework: core/ engine · bindings/ · harnesses/)"
  related_skills:
    - role/agentprivacy-separation-enforcement
    - meta/agentprivacy-horizon-gate
    - persona/agentprivacy-architect
    - persona/agentprivacy-algebraist
    - role/agentprivacy-cryptographic-durability
---

# The Dual-Agent Harness (framework)

One engine, many purposes, swappable crews. A harness pairs a **proposer** (Mage 🧙 — reduces /
conceals) with a **prover** (Swordsman ⚔️ — signs only what survives an un-tuneable gate), held
apart by **the Gap** (a held-out test derived from the proposer's own output, so it cannot be
tuned to). The result `succ` emerges only from the two held apart: `neg(bnot(x)) = succ(x)`.

> "The proposer that grades itself builds mirages; only what the Gap could not tune to is a result."

## To build a harness

1. **Copy** `harnesses/_TEMPLATE/` → `harnesses/<purpose>/`.
2. **Define the Gap first** — the held-out gate the proposer cannot tune to. No real Gap ⇒ mirage
   generator, not a harness. Write how witnesses derive from the proposal into `heldApartRule`.
3. **Assign personas + skills to the seats** (`bindings/personas-and-skills.md`): Mage persona +
   reduction skills; Swordsman persona + `meta/agentprivacy-horizon-gate` + domain skills.
4. **Fill** the finders, prompt builders, and schemas per `core/SEAT_CONTRACT.md`.
5. **Run** the config through `core/dual_agent_loop.mjs` with `{ agent, parallel, pipeline, phase, log }`.
   For the Workflow tool (no `import`), ship a self-contained bundle (see `../shor-mage/`).

## The complement pair (product objectives)

If cost is a product of factors, split the Mage into **Factor-A-Min ⊥ Factor-B-Min** finders and
let the Swordsman run a **cliff-watcher** on `Δ(product)`. The reduction comes from the team
structure, not one agent trying harder. (`R(t) = (C_S(t)+C_M(t))/H(X)` — two capacities, two agents.)

## Hard rules

- A pre-screen result is a **candidate**; only the full held-out gate validates.
- The proposer **never** tunes to the test set — that is collusion (`det(Σ)→0`), and it yields mirages.
- Outward-facing submit/ship steps are **human-triggered**. Nothing is "proven" until the gate says so.

*Canonical home: this directory. First instance: `../shor-mage/` (quantum resource
estimation — durability signal, not an attack). Verify:* [agentprivacy.ai](https://agentprivacy.ai)
