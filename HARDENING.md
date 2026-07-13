# HARDENING.md

```
theme:        closing the gap between what the harness claims and what it enforces
arc position: response to external review (OBS-HARNESS-01)
status:       working plan, not yet folded
register:     formal
word count:   4,713 (incl. tables and code blocks)
reading time: ~19 min
pipeline:     review packet -> triage -> defect register -> commit plan -> claims patch
```

> a claim is worth what it can be re-run to show. so re-run it.

---

## Verdict

The review is mostly right, and the parts it is right about are the parts that matter. Four defects are load-bearing; six of its ten items are either cosmetic or already half-solved in the repo. One of its central recommendations should be **rejected in the form given** and accepted in a better form, because the reviewer reached for an external randomness beacon when the harness already has a second party sitting right there.

The single sentence that should change first is this one, from the README:

> "the verification witnesses are derived by hashing the proposal itself, so the proposer provably could not have tuned to them"

That word is **provably**, and it is currently false. A proposer that can resubmit can grind. Everything else in this document is downstream of that.

Confidence that the grinding attack is real and exploitable against the current field-guide spar: **95%**.
Confidence that the fix below closes it without external dependencies: **85%**.

---

## How to use this file

Work top to bottom. Each defect has: the claim, the enforcement, the attack, the fix, the files to touch, and the test that fails before and passes after. Do not start a defect until you can write the failing test.

Ground rule for the whole exercise: **no fix lands without a red-team test that was red before it.** The repo already earned seven defects by running rather than inspecting. Keep that method.

---

## Triage of the review

| # | Review item | Verdict | Severity | Notes |
|---|---|---|---|---|
| 1 | Proposal-hash grinding | **Lands** | Critical | Breaks the central claim. See D1. |
| 2 | Security ops inside the LLM | **Lands partly** | High | `tools/kappa.mjs` is already the one κ law and `render_run.mjs` re-derives seeds. The gap is whether the **Gap seat** is a prompt or a code path. See D3. |
| 3 | Prompt isolation is not isolation | **Lands** | High | `I(Y_S ; Y_M \| X) = 0` is a routing property, and routing is enforced by a prompt. See D3. |
| 4 | Provenance chain not fully reproducible | **Lands partly** | Medium | `render_run.mjs`, `mint_artefact.mjs` and `holon_audit.mjs` already do pieces of this. They need consolidating into one fail-closed `verify_run.mjs`. See D5. |
| 5 | `VALIDATED` overclaims | **Lands** | High | The maths is worse than the reviewer says. See D2. |
| 6 | No statistical guarantees | **Lands**, same defect as 5 | High | Folded into D2. |
| 7 | Formal guarantees vs metaphor | **Lands partly** | Medium | `claims_register.md` already tiers claims PROVEN/DERIVED/REPORTED/OPEN/MYTH. It lacks an **enforced-by** column, which is the actual missing dimension. See D4. |
| 8 | No threat model | **Lands** | Medium | Genuinely absent. See D6. |
| 9 | No adversarial tests | **Lands** | High | This is the highest-value item after D1, because it converts every other item into evidence. See D7. |
| 10 | Restrained positioning | **Lands** | Low | Do it last, once the claims are true again. |

The review **misses** one defect that the harness's own model catches, and it is arguably worse than anything on its list. See **D4b**.

---

# The defects

## D1. The Gap is not binding (proposal grinding)

**Claimed:** witnesses derive from the proposal, so the proposer provably could not have tuned to them.

**Enforced:** witnesses derive from the proposal, so the proposer can compute them before submitting.

**The attack.** Determinism cuts both ways. `seed = sha256(proposal_canon)` is a public function of a value the proposer chooses. The proposer reorders a clause, adds a space, swaps a synonym, recomputes the seed, and reads off which 8 of ~40 facts will be probed. If the draw covers a fact it dropped, it perturbs and redraws. Cost per attempt: one hash. Expected attempts to find a draw that misses a single dropped fact: **1.25**. A grinding proposer beats the spar's central gate on its first or second try, and the run transcript looks identical to an honest one.

This is not a defence-in-depth problem. It is the whole thesis.

**Why the reviewer's fix is the wrong shape.** The review says: add verifier randomness after commitment. That works, and it imports a trusted third party into a two-party protocol whose entire selling point is that neither party chose the tests. An orchestrator beacon means the tests were chosen by the orchestrator. You have moved the trust, not removed it.

**The fix that fits the architecture: make the Gap a two-party coin toss.**

The harness already has a party that is held apart from the proposer and is not permitted to see its content: soulbis. Use it.

```
  1. soulbis draws salt_S (32 bytes), publishes c = sha256(salt_S)   [commit]
  2. soulbae writes the proposal, blind to salt_S                    [propose]
  3. Gap canonicalises and pins  h = sha256(proposal_canon)          [commit]
  4. soulbis reveals salt_S; Gap checks sha256(salt_S) == c          [reveal]
  5. seed = sha256(h || salt_S)                                      [draw]
  6. witnesses = draw(seed, witness_bank)
```

Neither agent controls the seed. soulbae cannot grind because it cannot see `salt_S`. soulbis cannot steer because it committed to `salt_S` before `h` existed and cannot see the proposal. This is Blum's coin-flipping protocol, and it is the *same shape as the harness's own axiom*: neg ⊕ bnot → succ. The Swordsman contributes one input, the Mage the other, and the step forward belongs to neither.

You do not need a beacon. You need to notice you already have two hands.

**Belt and braces, all cheap:**

- **Retry ledger.** Every `proposal_canon` hash ever computed in a run is appended to `runs/<id>/proposals.log`, including abandoned ones. A run with 47 proposal hashes and one submitted proposal is visibly a grinding run. Grinding becomes evident even where it is not prevented.
- **No re-propose after reveal.** Once `salt_S` is revealed, the round's proposal hash is frozen. Re-proposal opens a **new round** with a **new commit**, and the retry ledger carries across.
- **Source binding.** Fold the source hash in: `seed = sha256(h_source || h_proposal || salt_S)`. Stops a candidate silently changing the population it is graded against.

**Files:** `engine/dual_agent_loop.mjs` (phase order), `seats/gap.md`, `seats/soulbis.md` (commit duty), `engine/conform.mjs` (new axiom: seed must be a function of both parties' contributions), `tools/render_run.mjs` (render the commit, the reveal, the check), `tools/verify_run.mjs` (see D5).

**Test that must fail first:** `engine/attacks/grind.test.mjs`. A proposer that drops fact #17 and is allowed 20 canonicalisation variants must reach 8/8 under the current Gap (expected: it does, roughly 5 attempts or fewer) and must fail under the committed Gap (expected: it fails, at the base rate).

**Claim after the fix:** *"the proposer cannot predict the witnesses, because the seed depends on a value committed by the prover before the proposal existed."* That sentence is true, and it is stronger than the one it replaces.

---

## D2. Sampling does not support a verdict called VALIDATED

**Claimed:** an 8/8 held-out gate on a hash-drawn sample validates the candidate.

**Enforced:** an 8/8 held-out gate on a hash-drawn sample.

**The maths.** For a witness bank of N facts, a candidate with d omitted facts, and a draw of n:

```
P(detect) = 1 - C(N-d, n) / C(N, n)
```

At N = 40 (the field guide's fact census), this is what the gate actually buys:

| defects d | n=8 | n=12 | n=16 | n=20 | n=24 | n=32 | n=38 | n=40 |
|---|---|---|---|---|---|---|---|---|
| 1 | **0.200** | 0.300 | 0.400 | 0.500 | 0.600 | 0.800 | 0.950 | 1.000 |
| 2 | 0.364 | 0.515 | 0.646 | 0.756 | 0.846 | 0.964 | 0.999 | 1.000 |
| 3 | 0.498 | 0.668 | 0.795 | 0.885 | 0.943 | 0.994 | 1.000 | 1.000 |
| 5 | 0.694 | 0.851 | 0.935 | 0.976 | 0.993 | 1.000 | 1.000 | 1.000 |
| 8 | 0.863 | 0.960 | 0.990 | 0.998 | 1.000 | 1.000 | 1.000 | 1.000 |

Read the top-left cell. **A candidate that quietly drops one fact in forty passes the current gate 80% of the time.** And the defect the harness most wants to catch, the subtle single omission from a compressor, is precisely the one it is worst at catching.

Rounds do not save you. Four independent 8-draws against the same candidate reach 0.590 detection for d=1. The repo's four folds are not four draws against one candidate anyway, they are one draw each against four different candidates, so the compounding does not even apply.

The minimum sample for 95% detection at N=40: **n=38 for d=1**, n=31 for d=2, n=25 for d=3, n=18 for d=5. At this population size, **sampling is theatre and census is cheap**. The repo already knows this: the last two folds were closed by an exhaustive fact census. That instinct was right. Promote it from instinct to rule.

**The fix.**

1. **Census where the population is enumerable.** Add to `harness.config.mjs`:

   ```js
   gate: {
     mode: 'census',          // 'census' | 'sample'
     censusThreshold: 200,    // N <= this => census is mandatory, sample is refused
     sample: {                // only reachable when N > censusThreshold
       defectRateOfInterest: 0.025,   // "one fact in forty"
       detectionConfidence: 0.95,
       independentRounds: 1
     }
   }
   ```

   The gate computes `n` from the defect model rather than taking `n = 8` on faith. `conform.mjs` refuses a config that requests `sample` where `N <= censusThreshold`.

2. **Split the verdict, do not rename the lexicon.** The reviewer wants `SAMPLE_PASSED` and friends. Do not do that: VALIDATED / MIRAGE / BLOCKED is load-bearing vocabulary wired into the tier checks, the render colours, and `mint_artefact.mjs`'s refusal rules. A wholesale rename is a large diff for a small truth. Take the surgical version:

   ```
   VALIDATED_CENSUS    every witness in the bank was probed, all passed
   VALIDATED_SAMPLE    n of N probed at stated confidence, no failures
   MIRAGE              a probe failed
   BLOCKED             infrastructure, not evidence
   UNVERIFIABLE        artifacts missing or inconsistent (new; see D5)
   ```

   `mint_artefact.mjs` mints a full artefact for `VALIDATED_CENSUS`. For `VALIDATED_SAMPLE` it mints an artefact **carrying its own coverage stanza**, and the κ label records the sample parameters, so a downstream verifier can see exactly what it is relying on.

3. **Every VALIDATED_SAMPLE carries a coverage stanza, in the artefact and in the render:**

   ```
   VALIDATED_SAMPLE
   8 of 40 witnesses probed · 1 round · 0 failures
   detection at d=1: 0.200   detection at d=3: 0.498
   this does not establish complete fact preservation
   ```

   Print the detection probability next to the verdict. Nobody who reads `0.200` will mistake it for a proof.

**Files:** `engine/*` gate, `templates/harness.config.mjs`, `engine/conform.mjs`, `tools/render_run.mjs`, `tools/mint_artefact.mjs`, `examples/field-guide/harness.config.mjs`, `frontier.json` schema (add `gate.mode`, `gate.n`, `gate.N`, `gate.detection`).

**Migration note:** the existing frontier records four folds at "gate 8/8". Two were census-closed and two were not. Backfill honestly: the two sampled folds become `VALIDATED_SAMPLE` with `detection(d=1) = 0.200`. Do not retroactively upgrade them. **A killed lever is a fence, not a footnote**, and so is a weak fold.

---

## D3. Isolation is asserted, not enforced

**Claimed:** `I(Y_S ; Y_M | X) = 0`. Not "promises not to". Cannot, because the information was never routed there.

**Enforced:** a prompt that tells each seat which files to read, and a runtime in which all seats share a filesystem, a working directory, an environment, and quite possibly a model.

**The problem.** The claim is information-theoretic. The enforcement is a sentence in a system prompt. Between those two things sits everything the review is worried about, and it is right to worry. A conditional-independence claim is a claim about a **channel**, and you cannot make a claim about a channel you have not closed.

To be precise about what is true today: the routing is a **design invariant**, and it holds under the assumption that seats obey their cards and that the runtime does not leak. That is a real property. It is just not the one the README names.

**The fix, in three tiers. Ship tier 1 now; tier 2 is the real answer; tier 3 is honest labelling of what remains.**

**Tier 1: make the leak visible.**
- One scratch directory per seat, `runs/<id>/seats/<seat>/`, and a manifest of every path each seat read.
- `verify_run.mjs` fails closed if a proposer-seat read log touches `gap/`, `witnesses/`, `expected/`, or the prover's salt.
- Record `model`, `provider`, and `contextPolicy` per seat in the run manifest. If you cannot say which model sat in which seat, you cannot make an independence claim about them.

**Tier 2: make the leak impossible.**
- Each seat runs as a separate process with a role-specific, read-only mount and its own credential.
- The proposer's mount contains: source, its own scratch, `GROUND_RULES.md`, `TRUSTS.md`, its seat card. Nothing else. Not the witness bank, not `salt_S`, not the expected answers, not the assessor's card.
- Network egress denied by default per seat.
- The orchestrator is the only writer of `gap.json`.

**Tier 3: label the three kinds of separation, everywhere, and stop conflating them.**

| kind | what it means | what it costs to break |
|---|---|---|
| **prompt separation** | information omitted from a context window | a jailbreak, an accidental paste, a tool call |
| **process separation** | access denied by the runtime | a sandbox escape |
| **protocol separation** | influence impossible by construction (the D1 commit) | a break in sha256 |

The seed commit from D1 is **protocol separation**, and it is the strongest thing in the repo once it lands. The seat cards are prompt separation. Say so.

**Claim after the fix (tier 2):** *"the proposer's context provably excludes the witness draw, because the runtime never mounted it."* Keep `I(Y_S ; Y_M | X) = 0` as a **design target** in `RESEARCH.md`, with the assumptions written under it, until it is measured. It is a good target. It is not yet a result.

---

## D4. Claim tiers say how strong a claim is, not who enforces it

The `claims_register.md` tiers (PROVEN / DERIVED / REPORTED / OPEN / MYTH) are good and rare. They grade the **epistemic strength** of a claim. They do not record the **enforcement locus**, and the review's item 7 is really a complaint about the missing second axis.

**The fix: add one column and one check script.**

| claim | tier | enforced by |
|---|---|---|
| `neg ⊕ bnot → succ` on ℤ/64ℤ | PROVEN | **code** (`conform.mjs`, all 64 values, every run) |
| witnesses derive from the proposal | PROVEN | **code** (seed re-derivation in `render_run.mjs`) |
| the proposer cannot tune to the witnesses | ~~PROVEN~~ **OPEN** | **nothing** (D1) -> **protocol**, post-fix |
| the seats share only the axioms | DERIVED | **prompt** (seat cards) -> **runtime**, post-D3 |
| `I(Y_S ; Y_M \| X) = 0` | ~~DERIVED~~ **OPEN** | **prompt** (design target, unmeasured) |
| a VALIDATED artefact preserves every fact | ~~DERIVED~~ **OPEN** | **sampling** at p=0.2 (D2) -> **census**, post-fix |
| the door: no outward action without the First Person | REPORTED | **manual discipline**, honestly labelled |

Enforcement values: `code` | `protocol` | `runtime` | `prompt` | `manual` | `nothing`.

Then add `tools/check_claims.mjs` to `tools/check.mjs`: **any claim tiered PROVEN or DERIVED whose enforcement is `prompt`, `manual`, or `nothing` is a hard failure.** That one rule would have caught D1, D2 and D3 before an external reviewer did, and it will catch the next one.

This is the highest-leverage item in the whole document. It is twelve lines of code and it makes the register self-policing.

---

## D4b. The defect the review missed: Φ_inference ≈ 0

The harness is built on the PVM. The PVM says:

```
Φ_v5 = Φ_agent(Σ) · Φ_data(Δ) · Φ_inference(Γ)
```

and it says the product is multiplicative, so a zero on any axis zeroes the whole. It says explicitly: **same model for both roles means Φ_inference = 0.**

soulbae and soulbis are, in the reference runtime, the same model in two seats with two prompts.

By the harness's own model, the harness's separation term is currently **zero**. Not weak. Zero. Two instances of one model share weights, share priors, share failure modes, and share the exact blind spots that make a proposer's omission invisible to a prover. A prover that fails to notice a missing fact for the same reason the proposer failed to preserve it is not an independent check. It is the same check, twice, wearing a different hat.

This is not a rhetorical point. It is the model's own C7 prediction applied to the tool that carries the model.

**The fix:**

- `harness.config.mjs` gains a required `seats.models` block: provider and model per seat. **`conform.mjs` refuses a config where the proposer seat and the prover seat name the same model**, or emits a loud `Φ_inference = 0` warning that propagates to the verdict and into the minted artefact.
- The run manifest and the κ artefact record the model pair. A verdict produced by one model in two hats should be legible as such forever.
- Report `Φ_inference` per run: `0` same model, `(0,1)` same family or shared weights, `→1` genuinely independent.
- Run the spar once with a cross-provider prover and record the delta. **Prediction: the cross-provider prover catches defects the same-model prover missed.** If it does not, that is a real result against C7 and should be filed in `notes/KILLED_LEVERS.md` with as much prominence as a win.

Confidence that same-model seats measurably reduce defect detection versus cross-provider seats: **70%**. This is a testable, pre-registered prediction, and running it is worth more than any of the documentation fixes.

---

## D5. One verifier, offline, fail-closed

The pieces exist and are scattered: `render_run.mjs` re-derives the seed, `mint_artefact.mjs` refuses tampered seeds, `holon_audit.mjs` re-derives every κ. What does not exist is a single command that takes a run directory and an unfriendly reader, and returns a bit.

**`node tools/verify_run.mjs <instance> <runId>`**, no LLM calls, no network, exit non-zero on anything it cannot establish:

1. `proposal_canon.json` canonicalises to the bytes on disk
2. `h_proposal` is correct
3. `commit_S` was recorded before `proposal_canon.json` was written (ordering, from the manifest)
4. `salt_S` opens `commit_S`
5. `seed == sha256(h_source || h_proposal || salt_S)`
6. selected witness indices are exactly `draw(seed, N)`
7. selected witnesses map to the source facts they claim
8. expected answers derive from the source, mechanically where the data is structured
9. the answers the prover graded are byte-identical to the answers the proposer produced
10. the verdict follows from the scoring rule and the gate config
11. no seat read log touches a path outside its mount
12. the model pair recorded matches the config

Anything missing renders `UNVERIFIABLE`, which is a **distinct verdict, not a pass**. The current render already refuses to paper over an unreached phase (GR-5). Extend that discipline from projection to judgment.

Then wire `verify_run.mjs` into `tools/check.mjs`, so every run in the repo is re-verified on every check. If the harness cannot verify its own history, it cannot ask anyone to trust its future.

**Run manifest** (`runs/<id>/manifest.json`), versioned, and the input to the verifier:

```json
{
  "protocolVersion": "2.0.0",
  "instance": "examples/field-guide",
  "runId": "r5",
  "sourceHash": "sha256:...",
  "commitS": "sha256:...",
  "proposalHash": "sha256:...",
  "saltS": "hex:...",
  "seed": "sha256:...",
  "drawAlgorithm": "draw/v2",
  "gate": { "mode": "census", "N": 40, "n": 40, "rounds": 1, "detection": 1.0 },
  "witnessIds": ["f01", "..."],
  "seats": {
    "soulbae": { "provider": "...", "model": "...", "mount": "ro:/source,/scratch/soulbae" },
    "soulbis": { "provider": "...", "model": "...", "mount": "ro:/source,/witnesses,/scratch/soulbis" }
  },
  "phiInference": 1.0,
  "verdict": "VALIDATED_CENSUS",
  "humanApproval": null
}
```

---

## D6. Threat model

Write `THREATS.md`. It is the document that lets a stranger decide whether to trust the harness for their problem, and its absence is why the reviewer had to reverse-engineer one.

| threat | addressed today | mechanism today | after this plan |
|---|---|---|---|
| Honest proposer, honest mistake | Partly | independent assay | census gate (D2) |
| Proposer grinds hash variants | **No** | none | commit-reveal seed (D1) |
| Proposer reads the witness bank | Prompt only | seat card | process mount (D3 t2) |
| Proposer and prover share priors | **No** | none | model-pair gate (D4b) |
| Gap miscomputes canon or draw | Partly | render re-derivation | deterministic code + verifier (D5) |
| Artefacts edited after the run | Partly | κ hashes | full manifest verification (D5) |
| Prover is contaminated by proposer output | Prompt only | seat card | mount + read log (D3) |
| Operator overclaims a verdict | Partly | claim tiers | enforced-by column + check (D4) |
| Source itself is wrong | **No** | none | out of scope, say so |

The last row matters. State plainly what the harness does **not** do: it does not establish that the source is correct, it establishes that the candidate preserves the source. Garbage in, faithfully preserved garbage out.

---

## D7. Red-team mode

Build `engine/attacks/`, and make `node tools/check.mjs --red` run it. Every attack is a config plus an adversarial seat, and every attack has a **recorded expected outcome**. Publish which succeed. An attack that succeeds and is documented is worth more than a green board.

| attack | expected before | expected after |
|---|---|---|
| `grind.mjs` (20 canon variants, 1 dropped fact) | **passes 8/8** | fails at base rate |
| `omit_one.mjs` (drop one fact, no grinding) | passes 80% | caught by census |
| `omit_cluster.mjs` (drop 3 adjacent facts) | passes ~50% | caught by census |
| `sample_hugger.mjs` (answer probes correctly, be globally wrong) | passes | still passes; **this is a known limit, document it** |
| `bad_canon.mjs` (Gap writes a canon that is not the proposal) | passes | UNVERIFIABLE |
| `bad_draw.mjs` (Gap reports a valid hash, selects wrong indices) | passes | UNVERIFIABLE |
| `peek.mjs` (proposer seat opens the witness bank) | undetected | blocked by mount, logged |
| `tamper.mjs` (edit an artefact post-assay) | caught by mint | caught by verifier |
| `monoculture.mjs` (both seats, one model, subtle omission) | passes | Φ_inference = 0 warning; measure the delta |
| `retry.mjs` (re-propose after reveal) | n/a | refused, retry ledger shows the attempt |

`sample_hugger` is the honest one to keep in the table even after it still passes. A harness that publishes the attack it cannot stop is more trustworthy than one that publishes ten it can.

---

## Commit plan

Seven commits. Each is independently revertable, each turns the check board green, none of them touches `universe/`.

**C1. `red: attacks/grind, attacks/omit_one` (red board)**
Land the attacks first, failing. This is the repo's own method: debug by running.
Acceptance: `node tools/check.mjs --red` exits non-zero and prints the grind that won.

**C2. `gap: commit-reveal seed (D1)`**
Blum coin toss, retry ledger, source binding, no re-propose after reveal.
Acceptance: `grind.mjs` and `retry.mjs` go green in the attack board; `render_run.mjs` shows commit, reveal, and check; every historic run re-renders with a `legacy-seed` badge rather than silently re-deriving under the new rule.

**C3. `gate: census default, split verdict, coverage stanza (D2)`**
Acceptance: field-guide `N=40` refuses `mode: 'sample'`; the two sampled folds in `frontier.json` are backfilled to `VALIDATED_SAMPLE` with `detection(d=1)=0.200`; the two census folds become `VALIDATED_CENSUS`.

**C4. `claims: enforced-by column + check_claims.mjs (D4)`**
Acceptance: `tools/check.mjs` fails on any PROVEN/DERIVED claim enforced by prompt/manual/nothing. Run it before C2 and C3 land, and watch it catch them. That is the demonstration.

**C5. `verify: tools/verify_run.mjs, run manifest v2 (D5)`**
Acceptance: `bad_canon`, `bad_draw` and `tamper` all render `UNVERIFIABLE`; `verify_run` runs offline with zero LLM calls; it is wired into `check.mjs`.

**C6. `seats: process mounts, read logs, model pair gate (D3, D4b)`**
Acceptance: `peek.mjs` blocked and logged; `conform.mjs` refuses a same-model seat pair or stamps `Φ_inference = 0` onto the verdict; one cross-provider spar run recorded with the detection delta, win or lose.

**C7. `docs: THREATS.md, README and RESEARCH.md language patch (D6, item 10)`**
Last, because now the claims are true and you are describing rather than promising.

---

## Language patch

Do this only after C1 through C6. Rewriting the prose first would be exactly the failure the harness exists to name.

| currently says | should say (pre-fix) | can say (post-fix) |
|---|---|---|
| "the proposer provably could not have tuned to them" | "the witnesses derive from the proposal by hashing; a proposer able to resubmit can grind the draw, and this is being closed" | "the seed binds a prover commitment made before the proposal existed; neither agent could have chosen the witnesses" |
| "information-theoretic" / `I(Y_S;Y_M\|X)=0` | "a routing invariant, enforced by prompt topology; a design target, not a measured result" | "a routing invariant, enforced by runtime mounts; measured as [ ]" |
| "VALIDATED" | "VALIDATED_SAMPLE, 8 of 40, detection at one omitted fact: 0.200" | "VALIDATED_CENSUS, 40 of 40" |
| "Fiat-Shamir" | "Fiat-Shamir *shaped*: hash-derived challenges, without the grinding resistance the transform assumes" | "Fiat-Shamir with a committed prover nonce" |
| "every axiom checked at runtime" | true, keep it, it is one of the honest ones | unchanged |

Words that are earned today and should be used more, because they are stronger than the ones being overreached for: **auditable, reproducible, tamper-evident, re-derivable, human-gated, verdict-honest**.

---

## What not to change

The reviewer would improve this repo. It would also, if followed literally, sand off the four things that make it worth reviewing. Defend these:

1. **The verdict lexicon.** VALIDATED / MIRAGE / BLOCKED. Split it, do not replace it. MIRAGE is the best-named concept in the project and it is doing real conceptual work that `SAMPLE_FAILED` does not do.
2. **`universe/` behind the seam, deletable.** The reviewer did not mention it because it did not get in the way. That is the point, and it is a design achievement.
3. **`conform.mjs` keeping its own copy of the axioms and refusing to import them.** That looks like duplication and is actually the separation. Nobody who has not built this would leave it in.
4. **The door (T6).** Human-only outward action, honestly labelled as manual discipline rather than dressed as a technical control. The reviewer praised this. It is the model of what all the other claims should look like once patched.
5. **The claim tiers.** The critique's item 7 is the tiers' own request for a second column, not evidence that they failed.

---

## The register after this lands

Proposed `claims_register.md` deltas. C-numbers are yours to assign; these are CTR candidates only.

| id | claim | tier | enforced by | confidence |
|---|---|---|---|---|
| CTR-HAR-01 | Commit-reveal seed makes the draw unpredictable to both agents | OPEN -> PROVEN post-C2 | protocol | 85% |
| CTR-HAR-02 | Census over an enumerable witness bank is strictly stronger than any sample | DERIVED | code | 99% |
| CTR-HAR-03 | Same-model seat pairs measurably reduce defect detection (Φ_inference = 0 in the harness itself) | OPEN | none | 70% |
| CTR-HAR-04 | A claims register with an enforced-by column detects overclaim before external review does | OPEN | code, post-C4 | 75% |
| CTR-HAR-05 | Sampling gates on small populations are a general anti-pattern in agent evaluation harnesses | OPEN | none | 80% |

CTR-HAR-03 and CTR-HAR-05 are the two that travel beyond this repo. CTR-HAR-05 in particular is a paper: every LLM-as-judge harness in the field grades a sample and reports a pass, and almost none of them print the detection probability next to the verdict.

---

## The one-line summary for the reviewer

You are right that the gap between the claims and the enforcement is the project's main weakness. The fix is not to weaken the claims. It is to build the enforcement the claims already described, and the architecture was one commit away from it the whole time: the harness has two agents, and a coin flip only needs two hands.

> what you can count, count. what you cannot count, do not call proven.

(⚔️⊥⿻⊥🧙)😊
