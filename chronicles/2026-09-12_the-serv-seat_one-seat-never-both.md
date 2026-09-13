---
date: 2026-09-12
seat: keystone
runId: none (no round was run)
verdict: A fourth API driver, drivers/serv.mjs, speaks OpenServ's SERV Reasoning API (BRAID as a service) and the runner enforces the one-seat rule mechanically; proven against a local mock only — no key, no live call, no round, C8 still unmeasured.
---

# 2026-09-12 — the SERV seat: one seat, never both

## Verdict

- **Built:** `drivers/serv.mjs` — the SERV Reasoning seat driver over plain
  fetch. Bearer auth, a system message first on every call (SERV rejects a
  call without one), `response_format: json_schema` with `strict: true` for
  a schema seat, the raw-mode header `x-openserv-disable-braid: true` when
  `raw`, the vendor's `serv_shadow_agent` tool when `shadow` is set, and
  every call's token usage kept on `rt.usage` with the seat label and the
  raw/shadow flags. Same rt contract as the other drivers; one repair retry;
  null on hard failure (GR-5).
- **Wired:** `drivers/run.mjs` — `--driver serv` seats the proposer on SERV
  and requires `--assay-model <local model>` for the prover, the Gap, the
  critic and the chronicle (the split shape). Without it the runner exits 2
  with the rule spelled out. `--serv-both` is the deliberate exception and
  records `phiObservers: 0` in `run.json`; the split shape records
  `phiObservers: 1`. `--serv-raw` and `--serv-shadow "<hint>"` pass through.
  SERV usage rows are persisted to `run.json` as `usage`. `serv:` is also a
  provider under `--driver multi`.
- **Proven, mock only:** `node tools/test_serv_driver.mjs` starts a loopback
  emulation of `/v1/chat/completions` and asserts the wire shape the SERV
  docs require. Output: `PASS — 5 mock calls; bearer, system-first, strict
  json_schema, raw header, shadow tool and usage rows all as the SERV docs
  state (mock, not live)`. The mock also answers 400 to a call without a
  system message and 401 without a bearer token, and both paths were hit.
- **Guards exercised without network:** `--driver serv` without
  `--assay-model` exits with the one-seat message; with a prover named but
  no `SERV_API_KEY` the driver refuses before any call.
- **Nothing broke:** the stub smoke on `examples/field-guide` ran to
  COMPLETE and `tools/verify_run.mjs` verified it; `run.json` keeps its
  shape (`phiObservers` and `usage` appear only on SERV runs).
  `tools/check.mjs` was 21/21 before; the after-run is recorded below the
  handoff.

## What is not established

- That SERV honours strict `json_schema` on the models this harness seats,
  that the `serv_shadow_agent` tool is accepted on `/v1/chat/completions`
  as the docs describe, or what a live `usage` row looks like. The docs were
  read on 2026-09-12; the API was not called.
- Any number. The raw-versus-SERV pair (same instance, same seat, same
  model, census as the gate) is the round conjecture C8 has waited on since
  February; its tokens will live in `runs/<id>/run.json` under `usage`, and
  only there.

## Why one seat

SERV generates the reasoning graph on the vendor's side and never returns
it; the audit trail lives in the vendor's console. Two seats behind one
intermediary means one observer reads both prompts, whatever the model ids
say — Φ_inference over model ids would be 1 and over observers 0. The runner
now records which is which. The Shadow Agent is a critic inside the
provider's call, tuned by the caller's own hint; it is not the Gap. The Gap
stays engine-side: the Fiat-Shamir seed is drawn after the proposals commit.

## Handoff

- The live call is the key holder's: `SERV_API_KEY` from console.openserv.ai,
  credits on the account, then
  `node drivers/run.mjs --instance examples/self --driver serv --propose-model gpt-5.4-nano --assay-model <ollama model> --run serv-r1`
  and the same with `--serv-raw` as `serv-raw-r1`; compare `usage` across the
  two `run.json` files before reading either verdict.
- If the API rejects `strict: true` or the tool declaration, the driver has
  no downgrade path on purpose: fix the call, do not silently treat prose as
  a seat answer.
- `universe/SEATS.md` was not touched by this session; its "UOR/holonic
  braid reasoning" line is the lowercase braid (the UOR fold), not this
  driver's BRAID — the three-braids rule lives in the skills library.

## The three braids, for the seats file

The seats file cites "UOR/holonic braid reasoning (the κ-chain, the folding accumulator, the boundary-encodes-bulk reading)" as one of three lineages. That braid is the lowercase one: the UOR fold, non-abelian braid generators, guarded by the ring-algebra skill against being read as the Z/64Z ring. It is a different object from BRAID in capitals (the paper, and since 2026 the SERV API this driver speaks to) and from Holonic BRAID (the corpus's dated synthesis of 2026-02-26, reasoning graphs kept as holons). Nothing is renamed. The clause was first written into `universe/SEATS.md` on 2026-09-12 and reverted the same hour: the universe map is census-gated (`frontier.json` baseline 9059 words) and a lore note is not a fold. It lives here until a fold round carries it.

## First live calls (2026-09-12, later the same day)

The key holder set `SERV_API_KEY` out of band; the driver read it from the environment and nothing was logged. Two findings before the first success. The saved value carried the angle brackets of a placeholder, so the API answered 401 until they were stripped in-process. Then `gpt-5.4-nano` through `/v1/chat/completions` rejected `max_tokens` (400 `unsupported_parameter`, "use `max_completion_tokens`"); the driver now sends `max_completion_tokens` and sends `temperature` only when the caller sets one. The mock test still passes.

Three calls, one trivial prompt ("Reply with answer ok and n = 7"), strict JSON schema, all three schema-valid:

```json
[
  {"label":"plain","model":"gpt-5.4-nano","raw":false,"shadow":false,"prompt_tokens":375,"completion_tokens":15,"total_tokens":390,"ms":1269},
  {"label":"raw","model":"gpt-5.4-nano","raw":true,"shadow":false,"prompt_tokens":78,"completion_tokens":15,"total_tokens":93,"ms":1073},
  {"label":"shadow","model":"gpt-5.4-nano","raw":false,"shadow":true,"prompt_tokens":375,"completion_tokens":15,"total_tokens":390,"ms":2665}
]
```

What the rows say, and no more: on this call the SERV layer added 297 prompt tokens over raw (the generated reasoning prompt is counted upstream as prompt tokens); completion tokens were identical under all three because a strict schema left nothing to compress; the shadow agent doubled the wall time and reported no extra upstream tokens in the usage row. This is a smoke, not the C8 round: C8 is about tokens emitted by a seat that reasons, and the seat prompts of a real round are the test. The billing components behind these rows are in the vendor console, which is REPORTED tier.

## The C8 pair, run (2026-09-12, evening)

The local 27B prover was starved (another lane's round held the single Ollama slot; under 2 GB of RAM free), so the seats were re-cast on the First Person's word: this Claude proposed through the hand-off (two Claude Code subagents, one per lens, blind to the census; `runs/r3-serv/proposals.handed.json`, byte-identical copy under `r3-raw/`), and SERV held the prover side: measure, the Gap, both assays, the critic and the chronicle on `gpt-5.4-nano`, once with the reasoning layer on (`r3-serv`) and once with the raw header (`r3-raw`). Same instance, same proposals, same model; only the layer differed. Two more driver findings on the way: strict `json_schema` requires every object closed and every property listed, so the driver now sends a strict transform of each seat schema (optional fields become nullable) and the runner still validates against the seat's original keys; and the first attempt with the untransformed schemas died at every seat in four seconds and was moved out of the run tree.

Verdicts, identical in class under both modes: the line-editor candidate (1038 words) MIRAGE at 94/95, one witness dropped ("Shared state has exactly one writer"; the seat cut "exactly"); the restructurer candidate (1046 words, 95/95 code-side) MIRAGE on the hard constraint by both provers, the SERV reading phrased as inability to verify, the raw reading as a specific judgement. Nothing folds; `frontier.json` is untouched (keystone-only write); the two attempts are the keystone's to record.

Tokens, from `run.json` `usage` rows (seven seats per arm):

| seat | SERV prompt/completion | raw prompt/completion | prompt delta |
|---|---|---|---|
| measure | 5019/57 | 4722/148 | +297 |
| gap · line-editor | 5461/180 | 5164/213 | +297 |
| gap · restructurer | 5466/205 | 5164/229 | +302 |
| assay · line-editor | 7453/155 | 7157/163 | +296 |
| assay · restructurer | 7467/213 | 7171/282 | +296 |
| critic | 5820/238 | 5600/294 | +220 |
| chronicle | 5629/574 | 5556/608 | +73 |
| total | 42315/1622 | 40534/1937 | +1781 |

Read plainly: the reasoning layer cost about 300 prompt tokens per seat (+4.4% over the arm) and the seats emitted 16% fewer completion tokens under it (1622 against 1937), with the same verdicts. One round, one model, strict-schema outputs, seven calls per arm: a first datum for C8 ("BRAID compression reduces R_max"), not a confirmation, and the emitted-token side is the side C8 is about. Wall time was eleven seconds for the SERV arm and twelve for raw. The billing components behind these rows are in the vendor console, REPORTED tier.

Replay: `tools/verify_run.mjs examples/self r3-serv` → RUN VERIFIED — every proposal re-derives from its own saved bytes: the record is internally consistent. Not established here: that the salt came from an unseen secret, or that gate evidence was executed (C6 pending: read-log + model-pair checks). · `r3-raw` → RUN VERIFIED — every proposal re-derives from its own saved bytes: the record is internally consistent. Not established here: that the salt came from an unseen secret, or that gate evidence was executed (C6 pending: read-log + model-pair checks).
