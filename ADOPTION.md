# ADOPTION — why the duality works on any topic, and how to map it onto yours

The skeleton in this repo was forged in one specific fight — taking back the
**seventh capital**, privacy as value (PVM V6, C55: foundational, not
additive). But nothing in the mechanism mentions privacy, and nothing in it
mentions your domain either. This document makes that claim carefully — first
*why* the fundamentals are topic-free, then *how* to adopt them — because a
generality claim that is merely asserted is exactly the kind of statement
this harness exists to refuse.

## Part I — why the duality works regardless of topic

### 1. The failure it prevents is domain-general

An agent that proposes a change and then checks its own change will pass —
not by cheating, but because the check it invents is the check its change was
built to survive. That is Goodhart's law wearing an agent costume, and it
appears wherever a generator can influence its own test: code that passes the
tests its author wrote, a summary graded by its summarizer, a circuit probed
only where its designer worried. The **mirage** — passes the author's probe,
fails the real gate — is not a privacy problem or a compression problem. It
is a *self-reference* problem, and every domain that evaluates generated
artifacts has it.

### 2. The separation is information-theoretic, not semantic

The operational invariant is `I(Y_S ; Y_M | X) = 0` — given the target, the
prover's output carries no information about the proposer's output. Notice
what that sentence does **not** mention: the topic. Mutual information is a
statement about *routing*, not about *content*. The two agents never need to
share vocabulary, expertise, or even a domain — the guarantee is that
information was never sent, which is why the same bound holds for qubits,
constraint systems, prose, and consent terms without modification. You do not
adapt the invariant to your field. You route your field through the
invariant.

### 3. Fiat-Shamir removes the chooser — in any domain

The oldest attack on any verification scheme is to bribe whoever picks the
test. The Gap's answer is that **nobody picks it**: witnesses are a function
of the hash of the proposal's own canonical bytes. The proposal chooses its
own exam without ever seeing the syllabus, and any revision re-seeds the
draw. This construction needs exactly two things from a domain:

- a **canonical serialization** of proposals (JSON with sorted keys is enough), and
- a **witness space derived from the reference** — the original document's
  facts, the circuit's input space, the spec's test points — that the
  candidate is answerable to.

Every domain that can state what a candidate is *answerable to* has both.
When the proposer cannot know which witnesses will be drawn, the only winning
strategy is to be **genuinely general** — preserve every fact, satisfy every
constraint — which is precisely the property you wanted and could not
directly ask for.

### 4. The gate is multiplicative, and multiplication is unit-free

T5: value is a product of factors and any zero collapses it. 7/8 on the
comprehension gate is a zero, not 87.5%; a constraint system whose witness
cannot be computed is not a smaller win, it is not a result. The
cliff-watcher that rejects a move winning one factor at the product's expense
does not care whether the factors are questions, qubits, or clauses —
multiplication doesn't ask for units.

### 5. The promises are about behaviour, not subject matter

Promise Theory's autonomy axiom — an agent can only promise its own
behaviour — is what makes the topology honest. The Swordsman promises
protection, the Mage promises delegation, the First Person promises
authorization, and the pair promise *nothing to each other* — the separation
lives in the promises they don't make, held open by a seat (the Gap) whose
only job is to derive what neither may choose. None of these four promises
mentions a domain. That is why `TRUSTS.md` transfers whole: it constrains
*who may do what*, never *what the work is about*.

### 6. The algebra is the shape, not the subject

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```

On Z/64Z: `neg(bnot(x)) = succ(x)` — two *different* inversions, composed,
produce the step forward. Neither alone does; `neg(neg(x)) = x` gets you
nowhere, and that is the theorem's teaching: **a proposer checked by a copy
of itself is an identity operation.** Progress requires the second agent to
be a genuinely different transformation, held apart. The theorem never asks
what `x` encodes. Your domain enters through the config — objective, gate,
hard constraint, Gap recipe — and only there. The skeleton is invariant;
`engine/conform.mjs` re-proves it on all sixty-four values every run.

### 7. The evidence, and the honest boundary

Ten embodiments in `HARNESS_PATHS.md` wear this skeleton over bodies that
share nothing topically: quantum resource estimation, ZK constraint
reduction, research-document rehydration, a controlled grammar, consent
agreements, a publishing loop, a fleet-scale measure seat, a checked lattice
— and the spar in this repo, whose frontier moved under two independent draws
and an exhaustive census. Same trusts, same ground rules, same verdict
vocabulary, different configs.

And one of the ten is a **failure, kept on purpose**: the universe-builder
spent ~1.4M tokens learning that a map making ~100 *enumerable* claims never
needed a harness — an auditor checks them all for free, and against an
exhaustive check a mirage is impossible. So the generality claim gates
itself: **the duality works on any topic; it is *worth its cost* only where
the claim space is too large to check.** A harness is for adversaries; an
auditor is for facts. Deciding which you have is the first design decision
(Part II, step 0).

### The seventh capital, and other outcomes

In the origin fight, the artifact is your behavioural residue, the metric is
disclosure, the hard constraint is consent, and the door is sovereignty —
that mapping is the Privacy-is-Value model, and the harness is its
architecture made operational: the Swordsman guards the seventh capital, the
Mage spends only what is authorized, and nothing outward moves without the
First Person. Taking back the seventh capital *is* a harness instance — the
first one.

But "take back the seventh capital" has the same shape as any outcome you
could bring: **a thing that must get better by a number, a gate it must fully
pass, a line it must never cross, and a door only you open.** Cheaper
circuits, denser lexicons, faithful rehydrations, honest agreements — the
fundamentals hold because they were never about privacy; privacy was the
first place they were needed badly enough to be found. The lemma travels; the
corpus stays home.

## Part II — how to adopt it: the mapping procedure

### Step 0 · Decide harness vs auditor

Count your claims. If everything the artifact asserts can be **enumerated and
checked exhaustively** at tolerable cost, write an auditor (a deterministic
script like `universe/audit.mjs`) and stop — you will get certainty for zero
tokens. Reach for the harness when the claim space is **too large to check**
— you can only sample it — and generated candidates must survive
**adversarial** scrutiny before a human commits to them.

### Step 1 · The five answers

Fill these in one sitting, in writing. They become `harness.config.mjs`.

| # | question | becomes | test of a good answer |
|---|---|---|---|
| 1 | What artifact gets better? | the target | one file/system, scratch-copyable (GR-10) |
| 2 | By what single number? | `objective.metric` + a counting rule | two strangers get the same count (GR-1) |
| 3 | What must FULLY pass? | `objective.gate` | a partial pass is worth zero (T5) |
| 4 | What may no score override? | `objective.hardConstraint` | violating it makes the result *not exist* (GR-3) |
| 5 | What passes by construction? | `objective.canary` | proves the gate satisfiable — without it you cannot tell a bad candidate from an impossible gate |

### Step 2 · Define the Gap (do this before anything else works)

State, in one paragraph: *witnesses are drawn from ⟨the reference⟩ by
⟨canonically serializing the proposal, sha256, then this draw rule⟩.* The
witness space comes from the **reference** (the original document, the spec,
the input domain) — never from the candidate, never from the proposer. If you
cannot write this paragraph, you do not have a harness yet; go back to
step 0. The spar's version: number the original's ~40 facts, hash the
proposal, draw 8 without replacement, demand 8/8.

### Step 3 · Pick two lenses that cannot be each other

`finders` needs ≥ 2 genuinely different angles on the same objective —
line-editor ⊥ restructurer, gate-minimiser ⊥ qubit-minimiser, grammar-forward
⊥ canon-forward. Blind to each other by construction (the engine routes them
nothing of each other). One lens is a proposer; two lenses are the beginning
of a search.

### Step 4 · Scaffold, fill, refuse-until-filled

```bash
node tools/new_instance.mjs ../my-harness my-harness
```

Fill every TODO — the conformance gate and the bundler both refuse a config
still wearing them, in the same words, because an unfilled harness runs,
grades nothing, and reports VALIDATED. Measure your baseline before you claim
a best; the templates ship both `null` on purpose.

### Step 5 · Run, audit, fold, repeat

Bundle (`tools/bundle.mjs`), run a round (the Workflow tool or your own
`rt` driver), audit the round by hash (`tools/render_run.mjs`, or
`sha256sum proposal_canon.json` = `seedHex` by hand), and fold **only** what
is validated *and* structural, as keystone, conform-green before and after.
Nothing outward moves without you (T6) — the door is the one seat that never
delegates, whatever the topic.

### Worked mappings — six domains, one config shape

| domain | artifact | metric ↓ | the Gap draws from | hard constraint | canary |
|---|---|---|---|---|---|
| document compression (the spar) | the guide | words | the ORIGINAL's numbered facts | self-contained instructions | the original itself |
| quantum circuits (shor_mage) | point-add circuit | qubits × Toffoli | witnesses hashed from the op stream | full clean run, zero failures | the unoptimized circuit |
| ZK systems (tigzkp / pools_v2) | R1CS system | constraints | held-out evaluation points per round | witness-computability | the reference circuit |
| research docs (V6 pipeline) | audience artifacts | fidelity gaps | an adversarial reviewer who never sees the canon | no drift from canon | the canon itself |
| controlled grammar (lexon_pvm) | the lexicon | coverage-debt | 5 unseen census terms + 3 regressions, hashed from the recipe | spec-checker round-trip | an already-covered term |
| consent agreements (MyTerms) | the bilateral record | Φ product | registry + unlock lattice + constellation hash | identical immutable copies | the proffered baseline terms |

Read a row, then read your own domain across the same columns. If every cell
fills, you have a harness path. If the "draws from" cell keeps coming up
empty, you have an auditor — build that instead, and be glad you found out in
a table instead of in tokens.

---

*The duality is the constant; the config is the variable. Whatever capital
you are taking back, the shape is the same: a number that must fall, a gate
that must not, a line that cannot move, and a door that is yours.*

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
