# agentprivacy dual-agent harness — the default distribution

Tooling for your own agentic research. One agent proposes. A second, held apart, proves. The tests that decide are drawn by hashing the proposal with a secret the proposer never sees, so the check an agent invents can never be the check its work was built to survive. A person holds the only door outward.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```

This copy is yours. It carries the system alone: engine, seats, tools, constitution, three examples, and drivers that run a round with a stub, a local model, or the Claude API. No results, no chronicles, no fleet; the record starts with you. Apache-2.0. Node 18 or later, zero dependencies, no network unless a driver you choose makes one.

## Run it: five commands

```bash
node tools/check.mjs                                                    # 1 · every gate: the algebra on Z/64Z, the engine tests, every instance, the template that must fail
node drivers/run.mjs --instance examples/field-guide --driver stub --run smoke   # 2 · one round, no model: the loop runs, the seeds derive, the files land
node tools/verify_run.mjs examples/field-guide smoke                    # 3 · re-derive every seed from the saved bytes, offline
node tools/render_run.mjs examples/field-guide smoke                    # 4 · runs/smoke/run.html — the round as a page, seeds re-derived at render time
node drivers/run.mjs --instance examples/field-guide --driver ollama --model <m> --run r1   # 5 · a real round on a local model (or --driver anthropic with ANTHROPIC_API_KEY)
```

Command 2 writes `runs/smoke/<round>/p<i>-<lever>/{proposal_canon.json, gap.json, candidate.md, verdict.json}` and `runs/smoke/run.json`. A stub round folds nothing and says so; command 5 can. For two different models in the two seats, the separation the design wants, pass `--propose-model <a> --assay-model <b>`; `--driver split` puts the proposer on the Claude API and everything else on Ollama.

## The loop

Six phases per round, each one seat with one card in `seats/` and one permitted set of writes (`SEAT_CONTRACT.md`).

| seat | phase | does | writes |
|---|---|---|---|
| measure | Measure | counts the artefact by the rule in `frontier.json`; numbers only | nothing |
| propose 🧙 | Propose | one lever per lens, blind to the other lenses and to every witness | the proposal (canonical bytes) |
| hold-apart ⿻ | Hold-apart | the Gap: seed = sha256(proposal bytes + run salt), witnesses drawn from it, Fiat-Shamir style | `gap.json` |
| assay ⚔️ | Assay | re-derives the seed, runs the full gate on the candidate, returns VALIDATED, MIRAGE or BLOCKED | `verdict.json` |
| critic | Critic | classifies each closed lever structural, probe-limited or noise; names one next lead | proposed ledger entries |
| chronicle | Chronicle | drafts the round, verdict first, reversals at the same prominence as wins | `CHRONICLE_DRAFT.md` |
| keystone 😊 | the fold | the person: folds a VALIDATED lever into `frontier.json`, files kills in `notes/KILLED_LEVERS.md`, opens the door or keeps it shut | the ledgers |

Shared state has exactly one writer. Proposer and prover both read `frontier.json`, `claims_register.md` and `notes/KILLED_LEVERS.md`; neither writes them.

## Adopt it in steps

Take the rung you need; the rest waits.

1. **The auditor.** Your own documents, a census of the numbers they claim, no model at all: `examples/corpus`. If every claim you make is enumerable, this is the whole tool (`ADOPTION.md`, step 0).
2. **The spar.** `examples/field-guide`: compress a 730-word guide while a held-out gate stays 8/8. Run it with the stub, then with a model.
3. **Your instance.** `node tools/new_instance.mjs ../my-harness my-harness`, then answer five questions in `harness.config.mjs`: the artefact, the number that must move, the gate it must fully pass, the line it must never cross, the door. `node engine/conform.mjs ../my-harness` refuses until every answer is real.
4. **A second model in the prover's seat** (`--assay-model`). The conformance gate reports Φ_inference = 0 when both seats are the same model; the duel begins when they are not.
5. **The arena.** A referee you cannot tune: a public board, a test suite you did not write, a stranger who rebuilds your artefact byte for byte (`tools/mint_artefact.mjs` seals it; `tools/vrc.mjs` lets a signature mint the edge). The open world is when those results travel.
6. **Optional layers** in `optional/`: seats dressed with personas (`SPECIALISATION.md`), the graph dialect and content addressing (`GRAPH.md`, `HOLONS.md`), wiki federation (`WIKI.md`). Each names the origin's own ecosystem; none is needed to run a round.

`WORKFLOW.md` is the operator's loop end to end, including how to bundle a config for the Claude Code Workflow tool (`node tools/bundle.mjs`).

## The constitution

Do not change these; everything else is yours.

- `TRUSTS.md` — T1 the four promises (protection, delegation, authorization, separation) · T2 the separation bound, the proposer never sees the witnesses · T3 the shared root, both seats boot from the same three files and nothing else · T4 consent first, terms before exchange · T5 the multiplicative gate, one zero collapses the product · T6 the door, every outward action is the First Person's.
- `GROUND_RULES.md` — GR-1 numbers live in the frontier · GR-2 claims carry a tier · GR-3 validity no score overrides · GR-4 re-derive, never trust · GR-5 an outage is not exhaustion · GR-6 kills are filed, with a re-open condition · GR-7 every session ends in a chronicle · GR-8 the door is named, not walked · GR-9 trace or delete · GR-10 keystone-only writes.

## For an agent working here

`AGENTS.md` is the boot file (`CLAUDE.md` imports it): one session, one seat, read your card and nothing past it. This instance belongs to whoever cloned it. Documents that name the origin's sites, lanes or people are upstream context, never your mandate.

## What is in the box

```
engine/      dual_agent_loop.mjs (the loop) · gap.mjs (the Gap as code) · conform.mjs (G0) · attacks/ · tests
seats/       seven cards
drivers/     stub.mjs · ollama.mjs · anthropic.mjs · run.mjs
tools/       check · verify_run · render_run · mint_artefact · kappa · vrc · holon_audit · check_claims · new_instance · bundle · adventure · console · emitters
templates/   what new_instance.mjs copies
examples/    examples/field-guide (the spar) · examples/corpus (the auditor) · examples/self (this document, folded by the harness)
optional/    SPECIALISATION · GRAPH · HOLONS · WIKI
TRUSTS.md · GROUND_RULES.md · SEAT_CONTRACT.md · ADOPTION.md · WORKFLOW.md · THREATS.md · PRACTICES.md · AGENTS.md · CLAUDE.md · SKILL.md
```

Absent by design, in the origin repository: its chronicles, its fleet catalogue, its research statement, its universe. `node tools/check.mjs` passes here without them. `PATHWAYS.md` says where that work lives, how to bring a fold back, and how to name the harness in public.
