# PRACTICES — the field surveyed, and where this harness stands

*2026-08-18 · a research cycle run in the harness's own shape: three sweep
lanes in parallel — harness construction · agent pathing files ·
verification and evals — fetching the 2024–2026 first-party and
peer-reviewed guidance blind to this repo's claims, then judged and folded
by the keystone. Every external claim below is REPORTED tier (GR-2) and
resolves through `SOURCES.md` (GR-9). Nothing in this file moves a number.*

## Verdict first

Between 2024 and 2026 the field's published guidance converged,
independently, on most of what this repo's constitution already binds: a
fresh-context verifier separate from the producer, deterministic gates over
prompt advice, structured ledgers over prose state, a human gate before
irreversible actions, and instruction files grown from observed failures.
Where the mainstream stops is exactly where this harness begins: **none of
the surveyed guidance derives the verifier's tests in a way the producer
cannot influence.** The reviewer is fresh, but the exam is still written
where the author can reach it — and the verification literature (graders
gamed, tests overwritten, judges preferring their own style) reads as the
case file for why that is not enough. The Gap remains the distinguishing
move.

The survey also found the places the field is ahead, and they are named
below as open items rather than absorbed silently: process-level enforcement
of the separation (this repo's CR-H8/H9, already tiered OPEN), verifier
aggregation, and deterministic hooks. One practice was adopted outright this
cycle: **`AGENTS.md` as the tool-neutral boot file**, with `CLAUDE.md`
importing it so there is one source of truth.

## Lane 1 — building the harness

| the field's practice | sources | where this repo stands |
|---|---|---|
| Simplest architecture that works; deterministic orchestration where the flow is known; frameworks only understood | anthropic-building-effective-agents · openai-practical-guide · google-adk-patterns | **HOLDS** — the six-phase loop is a deterministic script; only the seats are model-driven; zero dependencies |
| The loop is gather → act → **verify**; give the agent a check it can run; require evidence, not claims of success | anthropic-agent-sdk · claude-code-best-practices | **HOLDS** — `check.mjs` is the check; a VALIDATED requires the full gate, the hard constraint, and a frontier beat (GR-5); the claims register's `enforced-by` axis is "evidence, not claims" as a gate |
| Externalize state into structured durable artifacts; models keep JSON status honest better than prose | anthropic-long-running · openai-harness-engineering | **HOLDS** — GR-1 predates the advice and is stricter: `frontier.json` is the sole authority and prose may only cite it |
| The repo is the single source of truth; docs mechanically enforced by CI, not trusted | openai-harness-engineering | **HOLDS** — `check_claims.mjs` fails a claim stronger than its enforcement; `universe/audit.mjs` fails a dangling citation; the wiki wall derives from ledgers so it cannot drift |
| Enforce invariants deterministically — hooks, structural tests — never prompt advice alone | claude-code-best-practices · openai-harness-engineering | **HOLDS at the gates, OPEN at the separation** — conform/claims/audit are mechanical; T2/T3 routing is still prompt topology (CR-H8/H9), settled by per-seat process mounts (`THREATS.md` C6). The survey raises C6's priority |
| Split into multiple agents only for context isolation, parallel reads, or specialization; never split one work item into phase handoffs (the "telephone game") | anthropic-when-multi-agent · langchain-multi-agent | **DIVERGES, deliberately** — the harness splits propose from assay by phase, which the guidance warns against for *collaborative* work. Here the handoff is adversarial: the second agent's job is to fail the first's, and information loss across it is the design target (`I(Y_S;Y_M\|X)=0`), not a defect. The guidance's own exception — the fresh-context verification subagent — concedes the case |
| Delegation needs complete task specs: objective, output format, boundaries, effort | anthropic-multi-agent-research | **HOLDS** — `SEAT_CONTRACT.md` plus seat cards with explicit Reads/Writes lists |
| Minimal high-signal context; boot small, disclose progressively | anthropic-context-engineering · anthropic-code-exec-mcp | **HOLDS** — T3 is context minimality as law: every seat boots from the same three documents and its own card, nothing more |
| Checkpoint and resume; human-in-the-loop before irreversible actions | anthropic-multi-agent-research · openai-practical-guide · google-adk-patterns | **HOLDS on the human gate**, stricter — the door (T6) is non-delegable and never simulated. Partial on resume: the driver layer resumes; a failed round folds nothing by design (defect #4) |

## Lane 2 — the agent pathing files

| the field's practice | sources | where this repo stands |
|---|---|---|
| One neutral `AGENTS.md` as the cross-tool boot file (60k+ repos, Linux Foundation stewarded); tool files as thin pointers | agents-md · github-copilot-agents-md · cursor-rules · gemini-md | **ADOPTED this cycle** — `AGENTS.md` is now the canonical boot file; `CLAUDE.md` imports it (`@AGENTS.md`), the exact bridge claude-code-memory prescribes |
| Keep the boot file short (~150–200 lines), exact commands early, prune ruthlessly | claude-code-best-practices · claude-code-memory · augment-agents-md · osmani-agents-md | **HOLDS / ADOPTED** — the boot file is under 80 lines; a Commands section was added this cycle |
| Tiered boundaries: ✅ always / ⚠️ ask first / 🚫 never; "never commit secrets"-class rules explicit | augment-agents-md · osmani-agents-md | **ADOPTED** — the Boundaries section restates GR-4/GR-8/GR-10 in the tiered form the field converged on |
| Point at authoritative state; never restate what drifts | cursor-rules · augment-agents-md | **HOLDS** — GR-1 is this practice as constitution: the boot file cites `frontier.json` and carries no number of its own |
| Grow the file from observed failures, by hand; auto-generated instruction files measurably hurt | augment-agents-md · osmani-agents-md · claude-code-best-practices | **HOLDS** — `GROUND_RULES.md` opens with it: "each rule earned its place by an actual failure." Eleven defects, each pinned by a test or a prompt rule |
| Progressive disclosure: always-loaded core small, procedural knowledge in skills loaded on demand | anthropic-agent-skills · skill-authoring | **HOLDS** — `SKILL.md` with trigger-term description; reference files one level deep (its Map section) |
| Hooks for must-happen rules — prose is advisory, hooks are deterministic | claude-code-best-practices | **OPEN** — conform-before-ending is discipline, not machinery; a Stop-hook running `engine/conform.mjs` is a candidate hardening, filed below |

## Lane 3 — verification and the gate

| the field's practice | sources | where this repo stands |
|---|---|---|
| Never let the optimizer see the grader; keep the monitor out of the reward loop or it teaches obfuscation | openai-cot-monitoring · metr-reward-hacking | **HOLDS** — the founding rule (GR-4); the salted seed makes grinding measured, not assumed: ≈0pp gain (CR-H3, `attacks/grind.mjs`) |
| Treat the grader as an attack surface: agents edit tests, patch scorers, read answers | metr-reward-hacking · anthropic-emergent-misalignment | **HOLDS in design, OPEN in runtime** — the tamper drill catches edited bytes (CR-H6); a seat that reads past its card is a named failure, not yet a blocked one (CR-H9, settled by C6) |
| The generator is never sole judge: self-correction fails by correlated error; self-preference is perplexity-driven and survives judge-swaps within a family | huang-self-correct · wataoka-self-preference | **HOLDS as thesis** — and it sharpens CR-H10: same-model seat pairs share exactly the correlated blind spots these papers measure. The cross-model delta run is now externally motivated, not only PVM-internal |
| Deterministic outcome checks first; model judges only where code can't reach, calibrated, with an "Unknown" escape | anthropic-demystifying-evals · anthropic-agent-sdk | **HOLDS** — the harness-vs-auditor boundary is this rule stated harder: an enumerable claim space gets an exhaustive auditor and zero agents. The critic's `mis-gated` verdict is the escape hatch's cousin — a word for "the gate is broken, not the work" |
| Verify the verifier: weak tests pass wrong patches (~31%); over-specific tests reject right ones; "verified" decays | swebench-plus · openai-swebench-verified · openai-swebench-retired | **HOLDS** — the census exists because a sample misses a single omission 75.8% of the time (`attacks/omit_one.mjs`, D2/C4); the canary exists because without one a bad candidate and an impossible gate are indistinguishable (the u2 lesson) |
| Debug the harness before believing the score, in both directions: 0% means a broken task, "impossible" scores mean a gamed grader | anthropic-demystifying-evals · metr-elicitation | **HOLDS** — an outage can no longer masquerade as exhaustion (defect #4, `loop.test.mjs`); the `mis-gated` class was added when the critic convicted a proposer against an infeasible gate (defect #5) |
| Hidden held-out sets; watch the public/private divergence as an overfit alarm | arc-policy · metr-elicitation | **KIN** — the salted draw plays the private set's role while staying re-derivable after the round: secret before, provenance after. What ARC does with storage, the Gap does with construction |
| Aggregate weak verifiers; adversarial debate; trained critics (which hallucinate — keep humans in the loop) | weaver · khan-debate · criticgpt | **OPEN** — the assay bench is one prover per proposal; a multi-lens assay mirroring the propose side's blind lenses is a candidate lever, filed below |
| Reliability is pass^k, not pass@k: for gating, every trial must pass | anthropic-demystifying-evals | **HOLDS** — the multiplicative gate is pass^k as constitution: 7/8 is a zero, not 87.5% (T5) |
| Content-address and attest: bind verdicts to exact digests, signed, gated before consumption | slsa-in-toto | **HOLDS** — κ holons, evidence hash-manifests, and VRC-signed κ→κ edges independently converge on the in-toto shape (a signed statement over a content digest); `GRAPH.md` names the credential alignment |
| Grader weakness is a training-safety issue: unpatched reward hacks generalize into broad misalignment | anthropic-emergent-misalignment | **REPORTED context** — the strongest external motivation on record for gates the proposer cannot reach |

## The translation table — this harness, in the field's vocabulary

For a reader arriving from the mainstream guidance, the pieces map directly.
`WORKFLOW.md` is the operator's loop; `ADOPTION.md` maps a new domain;
`AGENTS.md` boots a session. This table is only the bridge:

| the field says (2024–26) | this repo has |
|---|---|
| agent harness | the engine, the seats, and the gates |
| evaluator-optimizer loop | Measure → Propose → Assay, evaluator held apart |
| verification subagent / Writer–Reviewer split | soulbis ⚔️ — with witnesses it did not choose |
| eval harness · grader | the Gap's draw + `objective.gate` |
| hidden test set | the salted draw — secret before, re-derivable after |
| reward hacking · specification gaming | the mirage, a named verdict |
| test-set contamination / grinding | measured ≈0pp under the salt (CR-H3) |
| durable structured state | `frontier.json` · `runs/` · the chronicles |
| human-in-the-loop | the door (T6) — non-delegable, never simulated |
| attestation (in-toto / SLSA) | κ holon + evidence manifest + VRC signature |
| AGENTS.md / boot file | `AGENTS.md` → one seat card |
| skills / progressive disclosure | `SKILL.md` |

## Adopted this cycle

- `AGENTS.md` canonical; `CLAUDE.md` reduced to the `@AGENTS.md` import plus
  Claude-specific runtime notes — one source of truth, both conventions
  served (agents-md · claude-code-memory).
- Exact commands and tiered ✅/⚠️/🚫 boundaries in the boot file
  (augment-agents-md · osmani-agents-md).
- This file and the root `SOURCES.md` — the survey held to GR-2/GR-9.

## Open items the survey filed (candidates, not commitments)

1. **C6 process mounts** (`THREATS.md`, already planned) — the survey's most
   repeated shared gap: prompt advice is advisory, machinery is not.
2. **The cross-model delta run** (CR-H10) — now backed from outside: judge
   self-preference is perplexity-driven, so same-model seats share blind
   spots by mechanism, not just by conjecture.
3. **Multi-lens assay** — aggregate independent provers the way the propose
   side already runs blind lenses (weaver · khan-debate).
4. **A Stop-hook running `conform.mjs`** — turn the boot protocol's step 6
   from discipline into machinery (claude-code-best-practices).

None of these move without a round that earns them; this file only names the
doors the literature points at.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
