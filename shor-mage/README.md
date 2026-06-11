# shor-mage — the PQC dual-agent harness (instance #1)

**Purpose:** the cheapest reversible secp256k1 point-addition for the
[ecdsa.fail](https://www.ecdsa.fail/) benchmark — quantum resource estimation, a **durability
signal, not an attack**. Score = `avg_Toffoli × peak_qubits` (lower better), validated on
**9,024 = 141×64** Fiat-Shamir witnesses.

This is **instance #1** of the dual-agent framework, the reference every other harness is cloned
from, and a **fork-ready package**: it vendors its own engine (`./core/dual_agent_loop.mjs`), so
`git init` here and it works standalone.

## Seating

| Seat | Persona | Skills | Domain pieces |
|---|---|---|---|
| 🧙 Mage (proposer) | `agentprivacy-algebraist` | `separation-enforcement` + V6 `neg(bnot)=succ` | `shor_mage/SHOR_MAGE_CHRONICLE.md`, the GPU toolkit lever catalog |
| ⚔️ Swordsman (prover) | `agentprivacy-quantum-sentinel` | `horizon-gate`, `cryptographic-durability`, `quantum-defence` | the `validate` 0/0/0 gate |
| ⿻ Gap (held-out) | — | `separation-enforcement` | the Fiat-Shamir 9,024 + the GPU island toolkit |
| design | `agentprivacy-architect` | `meta/agentprivacy-dual-agent-harness` | — |

## Files

- `core/dual_agent_loop.mjs` — the engine (vendored from `../generic/core/`).
- `harness.config.mjs` — the config (finders, prompts, schemas, seat bindings) for the engine.
  Use this with an orchestrator that supports `import` (the Claude Agent SDK, a node runner).
- `swordsman_mage_pqc.workflow.mjs` — the **self-contained Workflow-tool bundle** (engine + config
  inlined, because the Workflow runtime has no `import`). A copy also ships in the broader shor_mage
  competition kit at `shor_mage/harness/swordsman_mage_pqc.mjs`.

## Run

On a Linux + NVIDIA-GPU box with the ecdsa.fail challenge cloned and the GPU island toolkit
installed and port-validated (see the shor_mage kit's `START_HERE.md` §7):

```
Workflow({ scriptPath: '<this-package>/swordsman_mage_pqc.workflow.mjs',
           args: { challenge: '/abs/path/to/ecdsafail-challenge', searchRange: 2000000 } })
```

The harness stops at proven candidates; **bake + `ecdsafail submit` are human-triggered,
outward-facing.** Credit the method in the public note (`shor_mage/THE_AGENTPRIVACY_EDGE.md` §7).

## Toolchain (the right items from the collection)

- **GPU island toolkit** (`shor_mage/ecdsafail_gpu_toolkit-main/`) — the Gap's pre-screen
  (`island.sh measure/hunt/validate/bake`) + its own `SKILL.md`.
- **trailmix** (`shor_mage/trailmix-main/`) — the in-house reversible-circuit toolchain + 5 EC-add
  circuits (Schrottenloher / Proos-Zalka) the Mage reasons over.
- **V6 algebra** (`agentprivacy-docs/privacy_value_v6_formal_specification.md`) — `neg(bnot(x))=succ(x)`.
- **Conjectures** C67–C71 (Horizon District), C82/C83 (moving ceiling + non-collusion), C9
  (holographic sufficiency — the precompute lead).
