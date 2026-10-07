# dual-agent harness

One agent proposes; a second, held apart, proves. Tests decide, hashing the proposal with a secret the proposer never sees, preventing self-validation.

This copy is yours; it contains the engine, seats, tools, constitution, three examples, and drivers for stub, local model, or Claude API runs. It carries no results or fleet; the record starts with you. Apache-2.0. Node 18+, zero dependencies, network optional.

## Run it: five commands

```bash
node tools/check.mjs  # 1 · gate algebra, engine tests, instances, template failure
node drivers/run.mjs --instance examples/field-guide --driver stub --run smoke  # 2 · one round, no model
node tools/verify_run.mjs examples/field-guide smoke  # 3 · re-derive seeds offline
node tools/render_run.mjs examples/field-guide smoke  # 4 · runs/smoke/run.html
node drivers/run.mjs --instance examples/field-guide --driver ollama --model <m> --run r1  # 5 · round on local model (or --driver anthropic)
```

Command 2 writes `runs/smoke/<round>/p<i>-<lever>/` and `runs/smoke/run.json`. A stub round folds nothing. Command 5 enables folding. For separate models in each seat, use `--propose-model <a> --assay-model <b>`; `--driver split` puts the proposer on Claude, the rest on Ollama.

## The loop

Each round runs six phases, one seat per phase with a permitted write set (`SEAT_CONTRACT.md`).

| seat | phase | does | writes |
|---|---|---|---|
| measure | Measure | counts artefact by `frontier.json` rule | nothing |
| propose 🧙 | Propose | one lever per lens, blind to other lenses and witnesses | proposal (canonical bytes) |
| hold-apart ⿻ | Hold-apart | Gap: seed = sha256(proposal bytes + run salt), witnesses from it | `gap.json` |
| assay ⚔️ | Assay | re-derives seed, runs gate on candidate, returns VALIDATED, MIRAGE or BLOCKED | `verdict.json` |
| critic | Critic | classifies levers (structural, probe-limited, noise), names next lead | proposed ledger entries |
| chronicle | Chronicle | drafts round, verdict first, reversals prominent | `CHRONICLE_DRAFT.md` |
| keystone 😊 | the fold | person: folds VALIDATED lever into `frontier.json`, kills in `notes/KILLED_LEVERS.md`, opens/keeps door | ledgers |

Shared state has one writer. Proposer and prover read `frontier.json`, `claims_register.md`, `notes/KILLED_LEVERS.md`; neither writes them.

## Adopt it in steps

1. **Auditor:** Your documents, census of claims, no model: `examples/corpus`. Enumerable claims = tool complete (`ADOPTION.md`, step 0).
2. **Spar:** `examples/field-guide`: compress 730 words while gate stays 8/8. Run with stub, then model.
3. **Your instance:** `node tools/new_instance.mjs ../my-harness my-harness`, answer five questions in `harness.config.mjs`: artefact, moving number, gate, limit, door. `node engine/conform.mjs` refuses until answers are real.
4. **Second model in prover's seat:** `--assay-model`. Φ_inference = 0 with same model; duel begins with different models.
5. **Arena:** Referee you cannot tune: public board, test suite, rebuilds artefact. Open world = results public.
6. **Optional layers:** seats with personas (`SPECIALISATION.md`), graph dialect (`GRAPH.md`, `HOLONS.md`), wiki federation (`WIKI.md`).

`WORKFLOW.md` is the operator's loop, including bundling for Claude Code Workflow (`node tools/bundle.mjs`).

## The constitution

Do not change these.

- `TRUSTS.md` — T1 four promises (protection, delegation, authorization, separation) · T2 separation (proposer blind to witnesses) · T3 shared root (same three files) · T4 consent first, terms before exchange · T5 multiplicative gate (one zero collapses) · T6 the door (First Person action).
- `GROUND_RULES.md` — GR-1 numbers in frontier · GR-2 claims carry tier · GR-3 validity overrides nothing · GR-4 re-derive, never trust · GR-5 outage ≠ exhaustion · GR-6 kills filed, re-open condition · GR-7 every session ends in chronicle · GR-8 door named, not walked · GR-9 trace or delete · GR-10 keystone-only writes.

## For an agent working here

`AGENTS.md` is the boot file (`CLAUDE.md` imports it): one session, one seat, read card, nothing past it. Instance belongs to the cloner. Documents naming origin sites/lanes/people are upstream context, not mandate.

## What is in the box

```
engine/      dual_agent_loop.mjs · gap.mjs · conform.mjs · attacks/ · tests
seats/       seven cards
drivers/     stub.mjs · ollama.mjs · anthropic.mjs · run.mjs
tools/       check · verify_run · render_run · mint_artefact · kappa · vrc · holon_audit · check_claims · new_instance · bundle · adventure · console · emitters
templates/   what new_instance.mjs copies
examples/    examples/field-guide · examples/corpus · examples/self
optional/    SPECIALISATION · GRAPH · HOLONS · WIKI
TRUSTS.md · GROUND_RULES.md · SEAT_CONTRACT.md · ADOPTION.md · WORKFLOW.md · THREATS.md · PRACTICES.md · AGENTS.md · CLAUDE.md · SKILL.md
```

Absent by design: chronicles, fleet catalogue, research statement, universe. `node tools/check.mjs` passes without them.