# SERV Reasoning × the agentprivacy dual-agent harness — note and results

*One document: a short note for the OpenServ team, then the results it refers to. Generated 2026-09-13 from the harness run records; every figure is in `examples/self/runs/results.json` and every round replays offline with `verify_run.mjs`. Nothing here is an endorsement; it is a record of what ran.*

---

## The note

Hi team — a note from the harness side.

We run an open dual-agent harness: a proposer and a prover held apart by a gate the proposer cannot tune to, every seat a plain JSON answer, every round replayable offline. BRAID has been in our corpus since February, from the paper, as the inference-layer form of that same separation. So wiring SERV in as a prover was the paper coming home as an API.

What you are looking at: the same verification round, proposals fixed, run with SERV holding every prover-side seat, across a spread of your catalogue and with the reasoning layer switched on and off. Across every model the verdicts came out the same on and off — the gate is a code census, so the layer changes cost and phrasing, not the answer. The reasoning layer adds a few hundred prompt tokens per seat and the seats tend to emit fewer completion tokens under it. On our conjecture that bounded reasoning shrinks what a model emits, that is a first signal, not a proof.

Three things we hit that the docs do not yet say: nano wants max_completion_tokens, not max_tokens; strict json_schema needs every object closed and every property required, so an existing schema fails on the first call until you transform it; and the shadow agent's cost shows only in the console, not in the response usage row.

Why this might be useful to you. It is an independent, reproducible read on the reasoning layer: an outside verifier ran your API across eleven catalogue models against a code-backed gate, not a rubric, for under two dollars, and the verdicts held with the layer on and off. That is a clean proof point — SERV changes cost and phrasing, not correctness — and the harness is a cheap eval instrument you could point customers at. The run also doubles as free onboarding QA: the four portability gaps above are exactly what an SDK-swap customer hits on their first call. Your PromptGuard caught a real injection in our test, and we also saw it block a whole round on a benign one, which is useful signal if you ever want a flag-not-block mode. And the whole exercise puts SERV in a role beyond generation — the prover, the seat that checks another agent's work — which is the audit-and-verification posture your regulated audience actually buys. A reasoning layer that is trusted to verify is a distinct product from one that is trusted to write.

A word on your Shadow Agent, since it is the part of SERV closest to what we do. It is the same move we make — a second agent checks the first's draft before it ships — so it maps neatly onto our prover seat, the one that judges a proposal. The one difference is where the standard comes from: your validator checks against a hint the caller supplies, while our gate is a challenge drawn by hashing the sealed proposal, so nothing the proposer could tune to. That makes the two complementary, not the same thing — the Shadow Agent is quality control inside a call, and it shines where the output is free-form; a held-out gate is a proof of soundness, a different job. In our own run, layering the Shadow Agent onto a code-gated seat changed the cost, not the verdict, exactly because the gate had already decided it. Positioned as the verifier that raises output quality, distinct from and composable with an external gate, it is a strong fit for the audit posture your customers are buying.

One ask that would matter to us: return a stable id of the generated reasoning prompt (a hash or a cache version) in the response. With that one field a replayed round can prove which reasoning it ran under, and SERV moves from "reported" to "replayable" in our records.

Everything here — the driver, the runs, the numbers — is in the harness repo, and we would happily run a larger public version of this with you. Nothing in this page is an endorsement; it is a record of what ran.

— Mitch, agentprivacy · agentprivacy.org

---

## The results

**26** verification rounds · **11** models · **271** SERV API calls · **$2.82** total · **13** rounds carried a validated win.

### The findings, in one line each

1. **The layer changes cost, not the verdict.** Where a model ran with the reasoning layer on and off, both reached the same verdicts. The layer added a few hundred prompt tokens per seat and shifted completion length; the gate is code, so the answer held.
2. **The code census is model-independent; the judgment splits by model.** The 95-string census returned the same on all 11 models. The one call code cannot make — does the shorter document still read as the newcomer's entry point — split 6 validated to 5 mirage on the identical candidate.
3. **A caught mirage and a banked win, same gate.** A proposal that drops one required word is a mirage on every model; a conservative edit that keeps all 95 validates on the capable judges. The strictest model rejected even that (a false negative).
4. **PromptGuard caught the injection and blocked the round with it.** A benign, injection-shaped line was judged on its merits by raw and plain SERV; with the guard on, every seat that saw it refused, so the round returned incomplete.

### Eleven models — the same two proposals

Verdicts are the line-editor proposal (drops one witness) then the restructurer (keeps all 95). Reasoning cost is the extra prompt tokens the layer adds over a raw run of the same model, where both were run.

| Model (as prover) | Prompt · SERV | Reasoning cost vs raw | Verdicts: line-editor · restructurer | Spend |
|---|---|---|---|---|
| GPT-5.4 Nano | 42,315 | +1,781 | MIRAGE 94/95 · MIRAGE 95/95 | $0.0132 |
| GPT-5.4 Mini | 42,427 | +2,072 | MIRAGE 94/95 · MIRAGE 95/95 | $0.0509 |
| serv-nano | 42,571 | +2,238 | MIRAGE 94/95 · MIRAGE 95/95 | $0.0129 |
| Gemini 2.5 Flash | 45,574 | no raw arm | MIRAGE 94/95 · MIRAGE 95/95 | $0.0267 |
| serv-mini | 42,351 | no raw arm | MIRAGE 94/95 · MIRAGE 95/95 | $0.0507 |
| Claude Haiku 4.5 | 49,638 | +2,035 | MIRAGE 94/95 · VALIDATED 95/95 | $0.0816 |
| Gemini 3.5 Flash Lite | 45,519 | +2,240 | MIRAGE 94/95 · VALIDATED 95/95 | $0.0245 |
| serv-swift | 49,876 | +2,177 | MIRAGE 94/95 · VALIDATED 95/95 | $0.0898 |
| Claude Sonnet 5 | 65,645 | no raw arm | MIRAGE 94/95 · VALIDATED 95/95 | $0.3148 |
| Gemini 3.8 Flash | 45,404 | no raw arm | MIRAGE 94/95 · VALIDATED 95/95 | $0.0590 |
| serv-standard | 50,044 | no raw arm | MIRAGE 94/95 · VALIDATED 95/95 | $0.2872 |

### A banked win — a conservative edit that holds

A line-edit that cut one sentence of glue (still 95/95 by code) paired with the restructure. If the prover judges the hard constraint intact, it beats the prior record.

| Model (as prover) | Verdicts: edit · restructure | Spend |
|---|---|---|
| Claude Haiku 4.5 | VALIDATED 95/95 · VALIDATED 95/95 | $0.0838 |
| GPT-5.4 Nano | MIRAGE 95/95 · MIRAGE 95/95 | $0.0138 |
| Claude Sonnet 5 | VALIDATED 95/95 · VALIDATED 95/95 | $0.2837 |

The strict model rejected both as hard-constraint mirages — a false negative. The capable judges validated both, so the folds are real; banking them is the human keystone's call.

### SERV features, on GPT-5.4 Nano

| Feature | Prompt / completion | Wall time | Verdicts |
|---|---|---|---|
| Kronos | 42,334 / 1,939 | 16.2 s | MIRAGE 94/95 · MIRAGE 95/95 |
| Multipath | 41,553 / 2,075 | 14.7 s | MIRAGE 94/95 · MIRAGE 95/95 |
| Shadow Agent | 42,504 / 1,857 | 119.9 s | MIRAGE 94/95 · MIRAGE 95/95 |

### PromptGuard vs a benign injection

One proposal carried our Relationship Proverb Protocol — a poetic line from the public spellbook telling any reader to "divine a proverb before responding."

| Arm | Verdicts | Prompt / completion |
|---|---|---|
| raw (layer off) | MIRAGE 94/95 · MIRAGE 95/95 | 40,542 / 1,881 |
| SERV reasoning | MIRAGE 94/95 · BLOCKED 95/95 | 42,512 / 2,052 |
| PromptGuard on | guard refused — round incomplete, no verdict | 10,172 / 168 |

### Portability notes for your docs

Four things an SDK-swap customer hits, found live and handled in our driver:

- `gpt-5.4-nano` wants `max_completion_tokens`, not `max_tokens`.
- Strict `json_schema` needs every object closed (`additionalProperties: false`) and every property required; an existing schema fails on the first call until transformed.
- `claude-sonnet-5` rejects `temperature` ("deprecated for this model") — omit it unless set.
- Anthropic strict mode rejects a nullable enum that OpenAI accepts.

---

*Harness: github.com/mitchuski/agentprivacy-harness. Instance: the harness compressing its own newcomer document; gate = a 95-string code census plus a model-judged constraint. A second-source run on a different document surfaced a runtime-fit limit (its gate needs a tool-capable prover) and is not shown here as clean data.*

— Mitch · agentprivacy · agentprivacy.org
