# Ecosystems — what's missing, and how this is given out

*The dual-agent harness is meant to be handed to many ecosystems. This is the gap review
(what exists, what's missing) and the propagation map (where each piece lives / should go).*

## What exists now (2026-06-10)

Layout: the framework dir holds **`generic/`** (engine + contract + bindings + template + skill) and
**`shor-mage/`** (instance #1). Instance #2 was moved to **`myterms/harness/`** so the MyTerms project
owns its harness next to its two extensions (`myswordsman/` + `mymage/`). Each vendors its own copy of
the engine so it forks cleanly. See `../README.md`.

| Piece | Where | State |
|---|---|---|
| The engine (generic loop) | `generic/core/dual_agent_loop.mjs` (vendored into each instance) | ✅ built |
| The seat contract | `generic/core/SEAT_CONTRACT.md` | ✅ |
| Persona/skill bindings | `generic/bindings/personas-and-skills.md` | ✅ |
| Instance #1 (shor-mage) | `shor-mage/` (config + Workflow bundle) | ✅ |
| Instance #1 runnable bundle | `shor-mage/swordsman_mage_pqc.workflow.mjs` (copy also in the shor_mage kit) | ✅ |
| Instance #2 (myterms) | `myterms/` (config + extension adapter + runner; mock passes) | ✅ |
| The skill | `generic/SKILL.md` + `agentprivacy-skills/.../meta/agentprivacy-dual-agent-harness` | ✅ |
| The algebra/law it rests on | `agentprivacy-docs` (V6 spec, C82/C83) | ✅ exists |

## What's still missing (the build-out backlog)

1. ~~**A second instance.**~~ ✅ Done — `harnesses/myterms/` is built. Building it forced the engine
   to drop a PQC-specific assumption (`hunt.candidates`) for a config-provided `hasCandidate(hunt)`
   predicate, and to thread each stage's structured object on `opts.input` — the engine is now
   genuinely generic. *This is exactly the value of #2: the seams moved to the right place.* Next
   candidates: a ZKP-circuit-audit harness, a contract-gas harness.
2. **A runtime adapter for the Claude Agent SDK / node** (so configs run without the Workflow
   bundle step). The engine takes `rt = {agent,parallel,pipeline,phase,log}`; the myterms
   `runtime-extension.mjs` is the first concrete adapter (extension bus) — generalise the pattern
   for the SDK.
3. **A bundler** — generate the self-contained Workflow bundle from `core/` + a config, instead of
   hand-inlining. Small script; removes the one duplication the no-import constraint forces.
4. **Tests for the engine** (mock `rt`) — assert the loop's control flow, the held-apart guard, the
   complement-pair/cliff-watcher acceptance logic, without needing a live target.
5. **Submission-note template** for instances that publish results (the honest-claim envelope).

## Propagation map (give it to the ecosystems)

The full scope with file paths is in the spec: **`agentprivacy-docs/specs/DUAL_AGENT_HARNESS_SPEC_v1.md`** §4.

| Ecosystem | What goes there | Status |
|---|---|---|
| **agentprivacy-docs** | the spec `specs/DUAL_AGENT_HARNESS_SPEC_v1.md` (integration map + myterms scope) | ✅ written |
| **agentprivacy-skills** | the method skill `meta/agentprivacy-dual-agent-harness` (registered mirror; points here as home) + chronicle | ✅ written |
| **star** | result attestation via the **κ-label** (`sha256:` UOR, Law L5) + the Swordsman's Key; same `neg/bnot/succ` algebra (BroadcastChannel `agentprivacy-succ`). κ-chain = result lineage | ✅ scoped (spec §4.3) — wire when an instance emits results |
| **agentprivacy_master** | site surface — recommended new route `/guide/dual-agent` (codex), or a `/model` §, or under `/guide/agentic-deployments` | ⬜ scoped (spec §4.4) — choose + build |
| **spellweb** | graph vocab — new `harness` NodeType; reuse `proves`, add `proposes` + `gates` edges; seats as cast/concept nodes (`src/types/graph.ts`, `src/data/{nodes,edges,theme}.ts`) | ⬜ scoped (spec §4.5) — apply additions |
| **shor_mage** | the runnable PQC instance (self-contained, PQC-only); links here for the generic method | ✅ instance #1 |
| **myterms** | **instance #2** — config + extension-runtime adapter + runner built; mock loop passes end-to-end. Real-bus wiring over the ceremony channel + the `checkCanForge` gate pending | ✅ built (mock) / ⬜ real bus |

## Coherence rules for the framework

1. **The engine is generic; never special-case a target in `core/`.** Targets live in `harnesses/`.
2. **Link out, don't duplicate.** The V6 corpus stays in `agentprivacy-docs`; personas stay in
   `agentprivacy-skills`; the PQC toolchain stays in `shor_mage`. This framework references them.
3. **Every harness declares its Gap.** A config without a real `heldApartRule` is rejected by review.
4. **Honest framing travels.** A harness produces validated improvements; only the Gate makes a
   claim true. State the domain's honest framing in each instance.
