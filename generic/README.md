# agentprivacy-dual-agent-harness

**A framework for building Swordsman ⚔️ ⊥ Mage 🧙 dual-agent harnesses — interchangeable
autoresearch loops you plug a purpose into, then assign personas and skills to the seats.**

One engine. A catalog of pluggable harnesses. Each harness pairs a **proposer** (Mage — who
reduces/conceals) with a **prover** (Swordsman — who signs only what survives an un-tuneable
gate), held apart by **the Gap** (a held-out test the proposer cannot tune to). Built to be
given to many ecosystems.

> **Honest framing, carried into every harness:** these loops produce *validated* improvements
> to a stated objective. They do not, by themselves, make any claim true — only the held-out
> gate does. For the first instance (quantum resource estimation) this is a durability signal,
> not an attack.

---

## The idea in one figure

The agentprivacy V6 master inscription **is** the architecture, proven on Z/64Z:

```
(⚔️ ⊥ ⿻ ⊥ 🧙) 😊  =  neg ⊕ bnot → succ            neg(bnot(x)) = succ(x)
```

- **⚔️ Swordsman = `neg` = the prover.** Signs/commits only what survives the full held-out gate.
- **🧙 Mage = `bnot` = the proposer.** Conceals/reduces; re-expresses paid work as free operations.
- **⿻ the Gap = the held-out gate.** The non-collusion precondition `I(Y_S;Y_M|X)=0`, made real:
  the proposer structurally cannot tune to the witnesses the prover will draw.
- **→ succ = the result.** A validated step forward — it emerges *only* from the two held apart.

The ceiling the loop pushes against is `R(t) = (C_S(t) + C_M(t)) / H(X)` (two capacities, two
agents). The discipline that keeps it honest is that **a proposer that grades itself builds
mirages** — so the Gap is not optional, it is the whole point.

## What's in here (the `generic` package — fork-ready on its own)

```
core/
  dual_agent_loop.mjs   THE ENGINE — generic, target-agnostic. You do not edit this per harness.
  SEAT_CONTRACT.md      what a harness config must provide (the three seats, objective, schemas).
bindings/
  personas-and-skills.md   how to assign agentprivacy-skills personas + role-skills to each seat.
harnesses/
  _TEMPLATE/            copy this to start a new harness for a new purpose.
SKILL.md                the Claude Code skill (canonical home; mirrored into agentprivacy-skills).
LICENSE                 Apache-2.0.
```

The concrete instances are **sibling packages** (each vendors its own copy of this engine, so it
forks cleanly): `../shor-mage/` (instance #1 — quantum resource estimation) and `../myterms/`
(instance #2 — IEEE-7012 agreement optimisation). The umbrella `../README.md` and `../ECOSYSTEMS.md`
hold the cross-package and cross-ecosystem maps.

## How to build a harness (plug-in, assign, run)

1. **Copy** `harnesses/_TEMPLATE/` → `harnesses/<your-purpose>/`.
2. **Plug in the purpose:** state the objective (often a product of factors — e.g. cost × size),
   how to *measure* it, how to *hunt* candidates, and the *held-out gate* that validates them.
3. **Assign personas + skills to the seats** (see `bindings/personas-and-skills.md`):
   - **Mage seat** ← a proposer persona (e.g. `agentprivacy-algebraist`) + reduction skills.
   - **Swordsman seat** ← a prover persona (e.g. `agentprivacy-quantum-sentinel`) + gate skills
     (`agentprivacy-horizon-gate`, domain durability skills).
   - **Gap** ← the held-out gate mechanism for your domain (the harder it is to tune to, the better).
4. **Run** the config through `core/dual_agent_loop.mjs` with your orchestrator's runtime adapter
   (`{ agent, parallel, pipeline, phase, log }`). For the Workflow tool (which has no `import`),
   ship a self-contained bundle — see `../shor-mage/` for the worked example.

## The seats are interchangeable on purpose

The same engine drives a circuit-optimisation harness, a ZKP-audit harness, a gas-optimisation
harness — anything shaped like *propose a cheaper artifact, prove it on a gate it cannot game*.
What changes between them is only the **config**: the objective, the gate, and which **personas
and skills** you seat. That is the framework: one loop, many purposes, swappable crews.

## Provenance

Algebra and the dual-agent law: `agentprivacy-docs/privacy_value_v6_formal_specification.md`
(the inscription, `neg(bnot(x))=succ(x)`, `R(t)`, non-collusion), `dualprivacy_researchpaper_v6.md`.
Personas and skills: `agentprivacy-skills/` (8 swordsman / 7 mage / 7 balanced personas, role
skills, and the `meta/agentprivacy-dual-agent-harness` method skill). First instance and its
worked toolchain: the `shor_mage` PQC kit (ecdsa.fail · trailmix · the GPU island toolkit).
