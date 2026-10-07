# Dual-Agent Harness

**Purpose:** Executes a dual-agent loop with a proposer and a held-apart prover.

**Core Components:** Engine, seats, tools, constitution, examples, drivers.

**Dependencies:** Apache-2.0, Node 18+ (no external network).

## Workflow

The loop consists of six phases, each with a dedicated seat and write permissions defined in `SEAT_CONTRACT.md`.

| Seat | Phase | Action | Writes |
|---|---|---|---|
| Measure | Measure | Counts artefact (rule in `frontier.json`) | None |
| Propose 🧙 | Propose | Generates one lever per lens (blind to witnesses) | Proposal (canonical bytes) |
| Hold-apart ⿻ | Hold-apart | Creates the Gap: seed = sha256(proposal bytes + run salt); witnesses derived from seed. | `gap.json` |
| Assay ⚔️ | Assay | Re-derives seed; runs gate on candidate; returns VALIDATED, MIRAGE, or BLOCKED | `verdict.json` |
| Critic | Critic | Classifies levers (structural, probe-limited, noise); names next lead | Proposed ledger entries |
| Chronicle | Chronicle | Drafts round (verdict first, reversals prominent) | `CHRONICLE_DRAFT.md` |
| Keystone 😊 | Keystone | Person: folds VALIDATED lever into `frontier.json`; files kills in `notes/KILLED_LEVERS.md`; controls the door | Ledgers |

**Shared State:** Single writer; proposer & prover read `frontier.json`, `claims_register.md`, `notes/KILLED_LEVERS.md` (no writes).

## Execution Steps

1. **Auditor:** Census of claims in `examples/corpus` (no model).  `ADOPTION.md` (step 0) if claims are enumerable.
2. **Spar:** Compress `examples/field-guide` (730 words) with a held-out gate (8/8). Run with stub, then a model.
3. **Custom Instance:** `node tools/new_instance.mjs ../my-harness my-harness`. Answer five questions in `harness.config.mjs`: artefact, movement number, gate, limit, door. `node engine/conform.mjs` enforces validity.
4. **Dual Models:** `--assay-model <b>` enables the duel. Φ_inference = 0 with same model.
5. **Arena:** Public board, test suite, rebuild by a stranger (`tools/mint_artefact.mjs`, `tools/vrc.mjs`).
6. **Optional Layers:** `SPECIALISATION.md`, `GRAPH.md`, `HOLONS.md`, `WIKI.md` (persona seats, graph dialect, federation).

## Key Files

* `engine/dual_agent_loop.mjs`: Main loop.
* `drivers/`: `stub.mjs`, `ollama.mjs`, `anthropic.mjs`, `run.mjs` (drivers).
* `seats/`: Seven seat cards.
* `tools/`: Various utilities (check, verify_run, render_run, etc.).
* `TRUSTS.md`: T1-T6 (promises, separation, consent, gate, door).
* `GROUND_RULES.md`: GR1-GR10 (numbers, claims, validity, derivation, outages, kills, chronicles, door, trace/delete, keystone-only).
* `AGENTS.md`: Boot file for agents (one session, one seat).

## Adoption Steps

1. Auditor
2. Spar
3. Custom Instance
4. Dual Models
5. Arena
6. Optional Layers

`WORKFLOW.md` details the complete operator loop.