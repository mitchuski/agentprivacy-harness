# The proven seat — a design note (PI-H1)

**Status:** design; experiment 1 run 2026-11-03; the rule and the limit as theorems 2026-11-04 (formal_mage O19). From the provable-inference strand of the V7 research intake
(`agentprivacy-docs/research/2026-11-03_v7_provable_inference_and_the_proven_seat.md`), after
FlashProve (Anthropic, 2 November 2026, Apache-2.0). Answers the THREATS.md row *proposer and
prover share priors* and claims-register CR-H10. The record shape below is already built and
sealed once (PI-H6, `~/flashprove_mage/evidence/2026-11-03_proven`); what is not built is a seat
that produces such rows for its own replies.

## What a seat declares today

A seat's model is a driver flag: `--propose-model anthropic:claude-opus-5 --assay-model
ollama:gemma3:27b`. `conform.mjs` records Φ_inference = 0 when the proposer and the prover share a
model and warns; the chronicle names the models; nothing a reader holds can check that the
prover's replies came from the model the flag names, or from any model other than the proposer's.
The separation is **declared**.

## What a proven seat would add

A seat whose every reply carries two things beside the reply: a **commitment id** (64 hex digits
naming one commitment to weights and settings, published by the provider before the request) and a
**proof** that, under the integer model committed under that id, the checked reply tokens are the
model's choice given the tokens before them. The harness host checks each proof with a verifier it
built itself. The claim a VALIDATED run then carries is:

> the assay seat's replies are the output of the weights committed under c_B, and c_B is not c_A.

Two limits travel with it, and the record must say them. First, a commitment pins weights without
naming them: that c_B is "the Ollama model" or "Sonnet" is a signed statement by whoever committed,
and the harness seals that signature beside the id, as a separate leaf. Second, zero knowledge hides
the weights, so two distinct commitment ids do **not** prove two distinct models: a provider can
commit twice to one set of weights. A proven seat therefore moves Φ_inference from *declared* to
*verified relative to named commitments*, no further. What would move it further is a proof of
inequality between commitments, which no released system offers.

## Two ways to deploy it

**A · provider-side, post-hoc.** The provider publishes the commitment and serves proofs after the
fact (FlashProve's own posture: inference is served at once, proving happens on separate hardware
and the proof arrives later). The harness is the client of `integrations/ask_and_check.py`'s shape:
it sends the prompt, keeps the token ids it sent and received, fetches the proof, and checks it.
This needs a provider that runs a prover. None does today for a model a seat would use.

**B · operator-side, the local seat.** The seat that runs on the operator's own hardware (the
Ollama seats of `--driver split` and `--driver multi`) is served instead through vLLM with
FlashProve's `integrations/proof_middleware.py` and `vllm/integer_model/`, with `cp_prove` on the
same machine. The operator is the provider; the commitment is the operator's. What this buys is not
trust in a third party but a sealed, recomputable statement that the two seats ran under two
commitments, one of them the operator's own. It needs one H100 80 GB that nothing else uses, never
rented or shared (FlashProve's serving duties), 330 GB of host memory for a Maverick-shaped model,
and a model whose shape the released programs support (today: that one shape, 1,024-token window).

B is the one the harness can do on owned hardware; A is the one that would matter for a seat on a
frontier model.

## Five things the host must bring, and which party holds them

FlashProve's client rule is that five things never come from the server being checked. Mapped onto
the harness's parties (SEAT_CONTRACT.md, Paper I §2.1):

| what | held by | never by |
|---|---|---|
| the commitment id, from a source independent of the server | the host, fetched before the run and sealed in `run.json` | the seat, the server |
| the acceptance limits (exact match, or clipped-gap bounds) | the config, as code | the proposer |
| the token ids of prompt and reply, as sent and received | the driver, which builds the request file itself | the server's own transcript |
| the model's end-token ids | the config, from the model's published generation settings | the server |
| the verifier, built from source | the host (`verifier/build.sh`, build digest sealed) | anyone else |

The host already holds the run secret the proposer never sees (Formal.Harness, O6); these five sit
on the same side of that boundary.

## Where it lands in the record

Per proposal directory, beside `verdict.json`: `proof/` holding the request file the driver built,
the reply token, the proof bytes and the provider's public files (`key.bin`, `leaf/K.bin`), each
sealed as a blob. The verdict gains a row of kind `proven-reply` (files by κ, commitment id,
expected verdict) under the check rule `flashprove/verify-rerun/1`, which the κ verifiers already
implement: at verification the sealed bytes are written out and `cp_verify` is run on them. The
rule needs the verifier binary (`FLASHPROVE_CP_VERIFY`) and fails without it, as an unknown rule
would. `mint_artefact.mjs` refuses (since 4 November) a run whose `run.json` declares a proven seat
(`proven: {seat, commitment}`, the id fetched by the host before the run) when a closed proposal has no
`proof/example.proof` or its `proof/ID.txt` names another commitment, the way it refuses a run with no
verdict (GR-5); a run that declares no proven seat is untouched and its artefact id does not move. The
proof travels with the seal by sha256; its truth is the κ mint's to re-run.

Which replies get proofs is a cost decision: proving runs at 70 to 95 times the inference it
certifies on the provider's GPU, so the assay and critic replies, the ones a VALIDATED rests on,
come first; the proposer's replies need no proof at all (the proposer is trusted for nothing).

## Conditions the seat must meet

- **Decoding.** The proof covers the integer model's greedy choice (exact match) or, under a
  clipped-gap policy, tokens within declared score bounds. A seat sampling at temperature is covered
  only under clipped gap, and a served floating-point reply can diverge from the integer model
  without tampering; the statistical reconciliation (DiFR) is the provider's, not the proof's.
- **Window.** 1,024 tokens per request in the released programs. Seat prompts that exceed it need a
  windowed proof design the released programs do not have.
- **Architecture.** Not hidden; the commitment reveals the model's shape.
- **Timing.** Post-hoc proving means the round closes before its proofs exist. The mint waits, or
  seals the round with the proofs' absence recorded and a later step adds them, chained.

## Smallest experiments, in order

1. **Record shape, no GPU.** Run the `stub` driver with a fake proven seat whose replies carry the
   released example vector (synthetic weights) as their proof; mint; verify with the rule. Proves
   the plumbing from `verdict.json` to a recomputed check. One session.
   **Done 2026-11-03.** `tools/kappa_evidence.mjs mint` seals a proposal's `proof/` (the request,
   the next token, the proof, `config/`, `ivk/`, `ID.txt`, `expected.txt`) as a `proven-reply` row
   under `flashprove/verify-rerun/1`, and refuses without the verifier (`kappa_evidence.test.mjs`,
   62 checks). A copy of the primer's run r1 with the released small vector as p1's proof and the
   same vector with one bit flipped as p2's minted to `~/flashprove_mage/evidence/2026-11-03_proven_seat1`
   (root `sha256:0bc527ea346697465e9891e53b4b3b3b1e0ff565b5e62f2463bcd0fdb1289c86`): all four κ verifiers recompute
   {yes 1, refused 1, one build digest}, and refuse without the binary. The proofs are the
   repository's synthetic-weight example, not a seat's reply: the shape is proven, no seat is.
2. **The prover's seats under an owned commitment.** Route B on an owned H100 with the one supported
   shape: the assay and critic seats through the middleware under the operator's commitment, the proposer
   on another provider, unproven (it is trusted for nothing). The first run whose Φ_inference is verified
   relative to a named commitment. A second commitment to the same weights under other settings then shows
   the limit as a measurement. Then the CR-H10 delta run on that pair. Run sheet: `PROVEN_SEAT_RUN2.md`
   (4 November), which found two blockers before hardware: the 1,024-token window and the driver's request shape.
3. **Provider-side.** Wait for a provider that serves proofs for a seat-grade model.

## What the receipts say

formal_mage obligation O19 (`Formal/ProvenLeaf.lean`, core Lean, in the axiom audit). The rule: a passing
`flashprove/verify-rerun/1` check means each row's verdict is the verifier's on that row's sealed bytes under
that row's id (formal: proved formal_mage:Formal.ProvenLeaf.rerun_sound); without the verifier it fails (formal: proved formal_mage:Formal.ProvenLeaf.rerun_refuses_without_verifier); a
changed proof keeping the old verdict is refused (formal: proved formal_mage:Formal.ProvenLeaf.rerun_detects_change). The limit above, stated as a
theorem: from c_A ≠ c_B nothing follows about the weights (formal: proved formal_mage:Formal.ProvenLeaf.ids_differ_weights_equal, witnessed over Bool
by formal: proved formal_mage:Formal.ProvenLeaf.ids_differ_weights_equal_witness); it would follow only for an id that is a function of the weights
alone (formal: proved formal_mage:Formal.ProvenLeaf.ids_differ_weights_differ_of_weights_only), which no released system offers. What the model
abstracts: `cp_verify` itself, which is FlashProve's program under FlashProve's Lean statement.

## What this note does not claim

That any provider serves proofs today. That a proven seat proves two models differ. That any seat
has produced a proven reply (experiment 1 used the released example vector as a stand-in). That FlashProve's authors have reviewed it.
