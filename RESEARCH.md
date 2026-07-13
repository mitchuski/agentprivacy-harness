# The contribution — verifiable work from AI agents that cannot grade themselves

This document states, as carefully as it can, what the dual-agent harness
contributes to research on AI systems — the problem it addresses, the claim it
makes, what is borrowed and what is assembled here, the evidence on record, and
the limits that evidence does not cross. It is written to the same standard the
harness enforces on its own instances: a claim is worth exactly what it can be
re-run to show, and a limitation filed plainly is worth more than a result
overstated.

## The problem: self-evaluation is a mirage generator

As AI systems increasingly **generate work and also judge it** — reward models
scoring their own policy's rollouts, LLM-as-judge grading model output, an
agent writing code and then writing the tests for that code, self-critique and
self-consistency loops — a structural failure recurs. An agent that proposes a
change and then checks its own change will pass, **not because it cheats, but
because the check it invents is the check its change was built to survive.**

This is Goodhart's law wearing an agent costume, and it is a problem of
**self-reference**, not of any one domain. The output that results is what this
repo names a **mirage**: it passes the author's probe and fails the real gate.
Mirages are the failure mode behind reward hacking, behind an LLM judge's
documented preference for its own style, behind a test suite that is green
because it was written to be green. Wherever a generator can influence the test
that judges it, the test stops measuring the world and starts measuring the
generator's model of the test.

## The claim: route the information away, don't ask for honesty

The harness answers the mirage structurally rather than behaviourally. Two
agents do the work — **soulbae 🧙 proposes, soulbis ⚔️ proves** — and between
them sits **the Gap ⿻**, whose job is to derive the verification witnesses by
hashing the proposal's own canonical bytes **together with a run secret the
proposer never sees** (a *Fiat-Shamir-shaped* construction — hash-derived
challenges, but with a committed nonce supplying the grinding resistance the
bare transform lacks; a proposer that can resubmit cannot grind the draw). The
proposer chooses its own exam without seeing the syllabus, and cannot steer it.
Where the witness bank is small and enumerable, the Gap goes further and takes
a **census** — every fact is a witness — so there is no held-out subset to game
at all. The design's separation **target** is

```
I(Y_S ; Y_M | X) = 0
```

— given the target `X`, what the prover produces should carry no information
about what the proposer produces. This is not a promise the agents make to each
other (under Promise Theory's autonomy axiom, no agent can promise on another's
behalf). Today it is a **routing invariant enforced by prompt topology**: the
proposer's seat is not sent the gate or the witnesses. That is a design target,
not yet a measured result — it is tiered OPEN in `claims_register.md` and
closes only when per-seat process mounts enforce the routing (`THREATS.md`).
What *is* closed by construction is the draw: the seed folds a secret the
proposer never sees, so it could not have tuned to the witnesses.

Three further stances complete the design, each a factor in the same product:

- **The multiplicative gate.** Value is a product; any zero collapses it. 7/8
  on a held-out gate is a zero, not 87.5% — a candidate that improves the score
  while failing the gate is worth nothing at any score. This refuses the
  "good enough" drift that lets a partial pass launder into a claimed result.
- **Honest labels and claim tiers.** Every load-bearing claim carries a tier
  (PROVEN / DERIVED / REPORTED / OPEN / MYTH); a probe pass is never dressed as
  a full pass; negative results are filed as prominently as wins. This is a
  discipline for keeping AI-generated claims from drifting away from their
  evidence over a long autonomous run.
- **The door.** Every outward action — publish, submit, send, commit — belongs
  to a human alone, and no seat performs, marks, or simulates one. The system's
  job is to make the door visible and stop in front of it.

## What is borrowed, and what is assembled here

Intellectual honesty requires separating the two.

**Borrowed, and cited as such:** the Fiat-Shamir heuristic (Fiat & Shamir,
1986 — turning an interactive challenge into a hash of the transcript);
Promise Theory (Burgess — the autonomy axiom); Goodhart's law and its
reward-hacking descendants as the problem framing; and the Privacy-is-Value
model (PVM V6, 0xagentprivacy) from which the six constitutional trusts and the
Swordsman ⊥ Mage architecture are lifted.

**Assembled and tested here** — the actual contribution:

1. The **composition** of those pieces into a runnable, **config-driven,
   domain-neutral** harness for AI-agent work: the same engine that compresses
   a document reduces a quantum circuit or a ZK constraint system, changing only
   a config, never the loop.
2. An **empirical demonstration** that the construction catches real defects
   and holds a real, advancing frontier (below).
3. The explicit **harness-vs-auditor decision boundary** — the finding that the
   held-out Gap earns its cost *only* where the claim space is too large to
   check exhaustively, kept in the repo as a documented negative result.
4. A **reproducibility stance** strong enough to be its own argument: zero
   dependencies, the governing algebra re-proven on all 64 values of ℤ/64ℤ
   every time the gate runs (the gate keeps its own copy of the axioms and
   deliberately does not import them), and every result content-addressed so a
   third party can re-derive it from the shipped bytes.

## The evidence on record

Everything below is in the repository and re-runnable; `node tools/check.mjs`
re-verifies the load-bearing parts in one command.

- **A real advancing frontier.** The runnable example (`examples/field-guide/`)
  compresses a fact-dense emergency guide from a **730-word baseline to a
  472-word best across three audited folds** (730 → 573 → 526 → 472, −35.3%).
  The original has **32** enumerable facts, so the gate is now a **census** —
  every fact probed — because when the claim space is small enough to count, you
  count it rather than sample it. The folds are labelled honestly by what each
  bought: 526 and 472 were census-closed (`VALIDATED_CENSUS`, detection 1.0);
  573 was closed on a single 8/32 sample (`VALIDATED_SAMPLE`, detection 0.25)
  and is **not** retroactively upgraded — a weak fold is a fence, not a
  footnote. Numbers live in `frontier.json`, the sole authority; the per-round
  reasoning lives verdict-first in `chronicles/`.
- **Seven defects, every one found by running.** The engine was debugged not by
  inspection but by execution: an outage silently reported as an exhausted
  search; a gate that passed an unfilled config; a critic with no vocabulary for
  a mis-specified gate; seats whose on-disk record was thinner than their
  return. Each was invisible to reading and obvious on running, and each is now
  pinned by a test or a prompt rule. That execution-driven discovery beats
  review for this class of system is itself a methodological finding, and the
  chronicles record it as one.
- **The separation is tested, not asserted.** A deliberate **tamper drill**
  flips one byte of a proposal's canonical form and confirms the re-derived hash
  no longer matches the recorded seed — the harness detects that its own
  witnesses are of unknown origin and voids the round (GR-4). The static run
  viewer and the live console both re-derive this in front of the reader rather
  than trusting a stored value.
- **Ten embodiments, one skeleton.** `HARNESS_PATHS.md` catalogues ten instances
  wearing the same architecture over topically unrelated bodies — quantum
  resource estimation, ZK constraint reduction, research-document rehydration, a
  controlled grammar, consent agreements, a publishing loop — plus one seat held
  open by invitation. Partial embodiments are labelled partial; an honest
  partial teaches the bar better than a complete one does.

## The limits this evidence does not cross

Stated as plainly as the claims, because the harness would refuse them
otherwise.

- **Prompt-based separation is topology plus discipline, not an
  information-theoretic proof.** In a harness built from prompts, the engine can
  guarantee what it does not put in a seat's prompt, but not what a seat reads
  from disk. `I(Y_S; Y_M | X) = 0` holds by construction for the routed
  information; it is enforced the rest of the way by explicit per-seat Reads
  lists and a chronicle audit trail in which a seat that read past its card is a
  named failure, not a silent one. Where a domain permits harder enforcement —
  separate processes, separate models, separate machines, separate keys — it
  should be used, and the design allows it.
- **The Gap is not always worth its cost.** A held-out adversarial draw earns
  its price only when the claim space is too large to check. Where every claim
  an artifact makes is enumerable, an exhaustive **auditor** gives certainty for
  zero adversarial cost, and a harness is the wrong tool. The repo keeps a
  retired instance — the universe-builder — precisely to record where the
  harness was applied and should not have been: *a harness is for adversaries;
  an auditor is for facts.*
- **This is a runnable demonstration, not a controlled study.** The evidence is
  a reproducible repository and a worked frontier, not a benchmarked comparison
  against baselines under peer review. The strongest current claim is that the
  construction is coherent, checked, and demonstrably catches a class of failure
  on the instances shown — not that it is optimal, nor that it has been measured
  against alternatives.

## Why it reads as a research contribution

The mirage problem is becoming central to AI exactly as agentic and
self-evaluating systems proliferate, and most mitigations are behavioural —
better judge prompts, ensembles, self-consistency — which a sufficiently
capable generator can still route around, because the test still lives where
the generator can reach it. The contribution here is to move the test out of
reach by construction, to make that move **domain-neutral and reproducible**,
and to be honest about the boundary where the move stops paying for itself. The
whole apparatus is a machine for the sentence it keeps proving on itself:

**a proposer that grades its own work builds mirages; only what the Gap could
not tune to is a result.**

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```

Apache-2.0 · origin: 0xagentprivacy · the Privacy-is-Value model (PVM V6) ·
agentprivacy.ai
