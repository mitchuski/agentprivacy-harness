# Experiment 2 of the proven seat — run sheet (PI-H1)

**Status:** written 4 November 2026, nothing run. Companion to `PROVEN_SEAT.md` (design) and its experiment 1
(record shape, done 3 November). Everything below about FlashProve is read from its repository at the pinned
commit `9e2bdd8f` (`integrations/README.md`, `integrations/LIMITS.md`, `integrations/vllm/README.md`,
`integrations/vllm/REFERENCE.md`, `integrations/vllm/integer_model/OPERATING.md`, `examples/maverick/README.md`
and `figures.txt`, `prover/docs/build.md`), not from running it. The repository's own words on its serving
path: "Treat every part of the integration as barely tried."

## 0 · What the run would claim, and what it would not

A VALIDATED run of a harness instance in which every closed proposal's assay reply (and the critic's) carries
a proof under one commitment id c_B that the host fetched before the run, so that the record says:

> the assay seat's replies are the output of the weights committed under c_B; the proposer's seat is elsewhere
> and unproven, and is trusted for nothing.

Φ_inference for that run is *verified relative to a named commitment*. It is not verified that c_B's weights
differ from the proposer's model (zero knowledge hides them: `Formal.ProvenLeaf.ids_differ_weights_equal`),
and no claim about any provider's served model follows. The proof covers the integer model under greedy
decoding; the harness seat runs at temperature 0 for this experiment.

## 1 · A correction to the design note

`PROVEN_SEAT.md` wrote experiment 2 as "both seats under two commitments to two different weight files".
The released programs support one shape (Llama 4 Maverick's, 1,024-token window), so two different weight
files of supported shape are not on offer, and a proven proposer buys nothing (the proposer is trusted for
nothing). The experiment is therefore: **the prover's seats under one owned commitment, the proposer
elsewhere.** A second commitment to the same weights under other settings (a different `policy.txt`) gives a
second id for free and makes the limit a measurement: two ids, one model, both sealed.

## 2 · Two blockers found before any hardware

**The window.** A FlashProve request is at most 1,024 tokens, prompt and reply together. The primer's assay
prompt is the boot text plus the candidate (1,875 words) plus the proposal (1,786 words): on the order of
5,000 tokens before the reply. No windowed proof exists in the released programs. So experiment 2 needs an
instance built for it: a candidate of a few hundred words, a proposal schema that fits, and an assay prompt
measured under the committed model's tokenizer at under about 700 tokens, leaving the reply the rest. Call it
`evocations/proven-primer`. Measure first; the boot texts (`BOOT('soulbis-assay.md')`, `BOOT('critic.md')`)
may themselves need a short form.

**The request shape.** `drivers/openai.mjs` sends chat messages as text with `response_format` and
temperature 0.2. The middleware proves only a `POST /v1/completions` (or chat) with the header
`x-proof-policy`, `temperature: 0`, `return_token_ids: true`, and no field beyond `model`, `prompt`,
`max_tokens` and `stream`; any other field is served without a proof (`not_provable`). And a prompt sent as
text lets the server choose the token ids, which nothing checks (`ask_and_check.py` exits 24 at best). So a
proven seat needs a driver mode, `drivers/proven.mjs` or a flag on the openai driver, that:

1. tokenises the prompt itself with the committed model's tokenizer (FlashProve has tested no real tokenizer
   through the middleware: "prompts go in as token IDs"), keeps the ids;
2. sends `prompt` as ids to `/v1/completions` with the header, `temperature: 0`, `return_token_ids: true`,
   `max_tokens` set so prompt + reply ≤ 1,024, nothing else;
3. asks for JSON by prompt alone (no `response_format`), with the engine's repair retry;
4. reads `x-proof-id`, fetches the proof from `/plugins/proof/jobs/ID`, and writes the request file itself
   from the ids it sent and received (`spool.py make-request`), plus `example.y` (the next token);
5. drops the five host-held things into the proposal's `proof/` (below) and never takes an id or a limit
   from anything the server prints.

The seat's end-token ids come from the model's published `generation_config.json` into the instance config;
`--end-token none` is for the synthetic examples only.

## 3 · Hardware, from the repository's own figures

| need | figure | source |
|---|---|---|
| prover GPU | one H100 80 GB (sm_90a) that nothing else uses; `cp_prove` refuses to start with more than 2 GiB in use | `prover/docs/build.md`, `docs/quickstart.md` |
| toolchain | x86-64 Linux ≥ 4.14 with SHA extensions; CUDA 13.2 Update 2 exactly (nvcc 13.2.86); gcc/g++ 13; Python 3.13; vLLM 0.29.0 pinned | `prover/docs/build.md`, `vllm/README.md` |
| weights | a third party's public 4-bit GGUF conversion of Llama 4 Maverick, 232 GB on local disk | `examples/maverick/README.md` |
| commit | 330 GB host memory available (peak 299–310 GB), 10 GB disk, about 43 min; build about 29 min | `examples/maverick/figures.txt` |
| prove | 290 GB host memory available (peak 268 GB), about 4 min per batch; verify 22 s | `figures.txt` |
| serve the integer model in vLLM | 238 GB free host memory (pinned) + 36 GB GPU at peak; start-up 22–25 min with every tensor verified; decoding 0.60–0.62 s per token | `integer_model/OPERATING.md` |
| one GPU for both | `--stop-vllm-to-prove` (vLLM stopped while `cp_prove` runs), as FlashProve's own full-size runs did | `vllm/README.md`, `LIMITS.md` |

So the box is: one H100, about 350 GB of host memory, 250 GB of local disk, and hours. A rented or shared
GPU is outside FlashProve's serving duties; a box that proves while it serves needs one more GPU than vLLM
uses. For a 300-token assay reply at 0.6 s per token, one reply is about 3 minutes of serving; a primer-sized
round with two proposals (two assay replies, one critic reply) is on the order of ten minutes served, one
batch proved, three checks.

## 4 · Stages, in order; stop at the first that fails

**2a · Toy size, synthetic weights, the harness driver through the middleware.** The repository's demo
(`integrations/vllm/end_to_end/end_to_end.py`, both `--serve float` and `--serve integer`) on its small
synthetic model, then the same server with the harness's proven driver sending the `proven-primer` instance's
prompts. The replies are nonsense (synthetic weights) and the seats will fail their schema; what is tested is
that every reply gets a proof, the driver writes `proof/`, the κ mint seals it and four verifiers recompute
it, and `mint_artefact.mjs` refuses when a proof is removed. One H100, under an hour once built. This is
experiment 1 with a live prover instead of the stored vector.

**2b · Full size, integer serving, exact match.** Commit to the Maverick 4-bit files (`examples/maverick/run.sh`
stages `build`, `fit`, `commit`), publish the id into the instance's `run.json` (`proven: {seat: "assay",
commitment}`), serve the integer model through vLLM with the middleware, run `proven-primer` with the proposer
on the Claude API (`--driver multi --propose-model anthropic:claude-opus-5 --assay-model proven:maverick`),
`--stop-vllm-to-prove`. Expected: every assay and critic reply proved YES under exact match; mint; verify
with `FLASHPROVE_CP_VERIFY` set; artefact minted with the `proven` block. This is the run §0 describes.

**2c · The limit, measured.** A second `cp_commit` on the same weights with a different `policy.txt` gives
c_B′ ≠ c_B. One more round under c_B′. The record then holds two ids over one weight file, which is exactly
what `ids_differ_weights_equal` says nothing can be inferred from; the chronicle says so in the same breath.

**Then** the CR-H10 delta run: the same instance with the assay seat unproven on the proposer's own model
(Φ_inference = 0) against 2b, the metric delta read from `frontier.json` by the keystone.

## 5 · Steps for 2b, with the repository's commands

From the checkout root, as a service account that is not root (two directory steps as root, per Part 2):

```sh
# build (verifier first, then prover; the build checks the compiler by value on the GPU)
verifier/build.sh && prover/build.sh
python3.13 -m venv .venv && . .venv/bin/activate
python -m pip install --require-hashes -r integrations/vllm/requirements.txt
python -m pip install --no-deps --no-build-isolation integrations/vllm/integer_model
python -m pip install ./integrations

# commit (hours; weights on local disk; secret key directory stays where cp_commit made it)
examples/maverick/run.sh build && examples/maverick/run.sh fit && examples/maverick/run.sh commit
#   -> CONFIG_DIR (policy.txt, KL.bin, layout.txt), COMMITMENT_ID, SECRET_KEY_DIR, PUBLIC_KEY_DIR (key.bin, leaf/)

# operator set-up (REFERENCE.md Part 2, steps 2–8): directories as root, config file, then
flashprove-middleware-admin init
cp_prove ...            # the proving service, started by hand, never by a service manager
vllm serve <integer model dir> --middleware proof_middleware.ProofMiddleware ...   # plus the four options LIMITS.md lists for full size

# one client check before the run (five things from the host's side, none from the server)
flashprove-check-proof example.proof example.req --public-key-dir PUBLIC_KEY_DIR \
  --parameter-file CONFIG_DIR/policy.txt --scales-file CONFIG_DIR/KL.bin \
  --commitment-id $COMMITMENT_ID --range a:b --next-token N --end-token <ids from generation_config.json>

# the harness
node drivers/run.mjs --instance evocations/proven-primer --driver multi \
  --propose-model anthropic:claude-opus-5 --assay-model proven:maverick --run r1
FLASHPROVE_CP_VERIFY=/path/to/cp_verify node tools/kappa_evidence.mjs mint evocations/proven-primer r1 --out evidence/<date>_proven_seat2
FLASHPROVE_CP_VERIFY=... node tools/kappa_evidence.mjs verify evidence/<date>_proven_seat2
FLASHPROVE_CP_VERIFY=... python ../kappa_evidence_mage/verify_bundle.py evidence/<date>_proven_seat2
node tools/mint_artefact.mjs evocations/proven-primer r1
```

## 6 · The five host-held things, as files

| what | where it lives in the run | written by |
|---|---|---|
| commitment id | `runs/r1/run.json` → `proven.commitment`; each proposal's `proof/ID.txt` | the host, before the run, from the operator's published id (here: the operator is the host) |
| acceptance policy | `proof/config/policy.txt` (exact match) | the config, copied from `CONFIG_DIR` |
| token ids sent and received | `proof/example.req` (built by the driver from its own ids), `proof/example.y` | the driver |
| end-token ids | instance config, from `generation_config.json` | the config |
| the verifier | `cp_verify` built here; its build digest sealed by the rule | the host |

`proof/` also carries `example.proof`, `expected.txt` (`YES`), `config/KL.bin`, `config/layout.txt`,
`ivk/key.bin` and `ivk/leaf/K.bin`, the shape experiment 1 sealed.

## 7 · Operator duties that bind this run

Never root; a service account of its own for vLLM and `cp_prove`; the secret key directory on a local disk
(never a file system in memory); the server bound to localhost only, no client on another machine (never
tried by the authors); no service manager restarts; after a bad exit of `cp_prove` (exit ≠ 0 or last line ≠
`p258 end 0`) do not restart it, put the policy on hold, read `faults.md`; published advisories cover pinned
packages including vLLM 0.29.0, so the box is not exposed. Set `TMPDIR` to a directory only the account can
write.

## 8 · What would be written when it passes

The V7 note's PI-H1 cell and `PROVEN_SEAT.md`'s status line (experiment 2 run, date, root); a maintenance
chronicle in `chronicles/`; the κ bundle under the harness lane, chained to experiment 1's root
`sha256:0bc527ea…`; a master chronicle if the keeper wants one; THREATS.md's *proposer and prover share
priors* row gains its first verified instance; the register's CR-H10 row is the keystone's to update.

## 9 · What this sheet does not claim

That the box exists. That the released serving path runs end to end (FlashProve's own full-size runs were
on other scripts, with vLLM stopped to prove, and no client on another machine). That a seat's JSON survives
greedy decoding on Maverick without `response_format`. That the chat template is covered (it is not: prompts
go in as ids, plain text). That proving is prevention: it is detection after the fact, and the round closes
before its proofs exist, so the mint waits or seals their absence and a later step adds them, chained.
