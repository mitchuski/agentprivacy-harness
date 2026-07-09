# Harness paths — where this skeleton went

Eight instances specialised this harness. None of their code lives here; this
is the map, so you can see what a filled config looks like at full weight —
and, just as usefully, what a *partial* embodiment looks like — before you
build your own. Each began as a skeleton like this one and diverged only
through its config, its seat cards, and its gate.

They are grouped by **how much of the loop they run**, because that is the
most useful thing to see. A harness is not all-or-nothing: the minimum that
earns the name is a proposer, a prover, and a Gap the proposer cannot tune to.
Everything above that is weight you add when the domain earns it. The
instances that *lack* a Fiat-Shamir Gap or an advancing frontier are marked as
such, deliberately — reading an honest partial teaches the bar better than
reading a complete one.

| instance | domain | objective | the Gap | weight |
|---|---|---|---|---|
| shor_mage | quantum circuits | product: qubits × Toffoli, ↓ | 9,024 witnesses hashed from the circuit's own op stream | full |
| tigzkp_mage | ZK constraint count | R1CS constraints, ↓ | held-out points, Fiat-Shamir per round | full + specialised |
| V6 rehydration | research documents | fidelity across audiences | adversarial reviewer who never sees the canon | full, non-numeric |
| privacy_pools_v2_mage | ZK, real upstream target | R1CS constraints, ↓ | as above, per-rewrite certificates | full, **mechanically fitted** |
| MyTerms / IEEE 7012 | consent agreements | Φ product over a bilateral record | registry + unlock lattice + constellation hash | loop built, mock-only |
| FedWiki flow + Gatehouse | publishing | presence/absence gap-count | *(no witness draw)* — integrity gate + human | discovery loop |
| the dream cycle | universe upkeep | *(no metric)* — gap surfacing | *(none)* — the measure seat at fleet scale | measure-only |
| Game of 42 | the structure itself | *(none)* — a visualization | *(none)* — checks structure, not results | structure layer |

---

## Full loops — objective · Fiat-Shamir Gap · advancing frontier

### 1 · shor_mage — quantum resource estimation

*(private instance of the author — a single-file harness,
`swordsman_mage_pqc.mjs`, against a live competitive benchmark)*

Reduces the cost of the secp256k1 point-addition circuit a Shor-style attack
would run, against the ecdsa.fail benchmark. The objective is a genuine
**product** — average executed Toffoli gates × peak qubits — so soulbae runs
as a complement pair (gate-minimiser ⊥ qubit-minimiser, blind to each other)
and soulbis carries a cliff-watcher that scores the whole product and rejects
any move winning one factor at the other's expense past break-even (measured
there at ≈1,184 Toffoli per qubit). The Gap is a GPU island search reseeded by
Fiat-Shamir; the gate is a held-out set of 9,024 witnesses hashed from the
candidate's own operation stream, so the proposer provably could not have
tuned to them, and only a full clean run — zero classical, phase, and ancilla
failures — counts. This instance is where the complement pair and the
cliff-watcher were invented, and where `MIRAGE` got its name: a candidate that
passes the cheap probe and fails the full validation. Its governing sentence
is *"cheaper-but-unvalidated is not progress"*; its kill ledger runs to
seventeen entries, each carrying a re-open condition, because killed ≠
impossible.

### 2 · tigzkp_mage — ZK circuit constraint reduction

*(private instance of the author — a full workshop directory with its own
canon, gate ladder, and chronicles)*

Reduces the surviving R1CS constraint count of a zero-knowledge privacy-pool
withdrawal circuit. The hard constraint is **witness-computability**: a
constraint system whose witness cannot be computed by forward propagation is
not a result at any count — the purest instance of GR-3, and the reason GR-3
exists. This instance is the origin of `GROUND_RULES.md`, of `conform.mjs`
and its independent-axiom-copy idiom, of the gate ladder (conformance →
equivalence → witness → frontier → **the door**), of scratch-copy discipline,
and of the killed-levers bar (filed as prominently as the wins). It also
carries the fullest specialisation: seven seats dressed with personas and
seated on the Game of 42 compute axis, with the anchor pair Aletheia (V38) ⊕
Lethe (V25) = 63 checked by conform — see `SPECIALISATION.md`. Its
self-correction is the tell worth copying: a declared "floor" was falsified
within hours by a further pass, and the falsification filed at win-prominence
rather than quietly amended.

### 3 · The V6 rehydration pipeline — research autoresearch

*(private instance of the author — a fourteen-role document pipeline inside a
research corpus)*

Takes a formal research corpus and rehydrates it into artifacts for different
audiences (academic, policy, standards, grants, public, developer) without
drifting from the canon. Fourteen roles rather than seven seats, because the
domain is documents and not numbers, but the topology is identical: a
manifest that only the orchestrator writes, an append-only critique ledger,
one chronicle per session, and an adversarial reviewer with no goodwill who
never sees the canon — the Gap in document form. This instance is the origin
of the claim tiers (GR-2), of trace-or-delete (GR-9), of the "proposer never
approves its own proposal" rule, and of the non-delegable human completion
read that became **the door** (T6).

### 4 · privacy_pools_v2_mage — the fitted successor

*(private instance of the author — the tigzkp_mage method turned on the real
upstream target: the 0xbow privacy-pools-core v2 circuit suite)*

The direct successor of instance 2, and the first instance to be **mechanically
fitted**: it carries a `harness.config.mjs` satisfying `SEAT_CONTRACT.md`, its
frontier exposes the `baseline`/`best` compat view pinned to its native ledger
shape by `conformChecks` (so the two views cannot drift silently), and
`node engine/conform.mjs <instance>` passes against it. Its rounds run through
the generic engine via `tools/bundle.mjs` — the same loop that runs the toy
compresses a production ZK withdraw circuit with per-rewrite certificates.
The two finder lenses are the pattern that emerged in practice: **fold-deeper**
(exact reduction in an admissible family, census-first with a pre-registered
VOID check) ⊥ **structure** (measurement-only probes at ΔK=0, pre-registered
— attribution, closure certificates, emission models). Its round v2r1 proved
the transfer lesson worth writing down: the *priors* from the training
instance mispredicted the new artifact in both directions; the *discipline*
(census-first, pre-registration, certificates, kills at win-prominence)
transferred exactly. Standing intent: the optimized, certificate-audited
artifact feeds a future deployment's trusted-setup ceremony — the door for
all of that is the First Person's (T6).

---

## Adjacent embodiments — the same topology, a different (or missing) piece

These wear the architecture without running the full optimization loop. They
are here because each shows a real trust boundary doing real work — and
because naming what they *lack* is how you learn which pieces are load-bearing
for which job.

### 5 · MyTerms / IEEE 7012 — the two agents made literal

*(private instance of the author — a docs package plus two browser extensions)*

The soulbis ⊥ soulbae split is not a metaphor here: it is **two separate
browser extensions**. The Swordsman (⚔️, the agreement and boundary layer) and
the Mage (🧙, the delegation layer) are distinct code that cannot reach into
each other — the Mage can neither render nor lower the gate; the Swordsman
owns the canvas and the record. The consent flow is the **invitation pattern**
(T4): the First Person proffers terms, and the entity accepts, counter-offers
once, or declines, with both parties holding identical immutable copies of the
bilateral record. There *is* a Measure → Propose → Assay loop with a
`beatsFrontier` predicate and a cliff-watcher over a Φ product — but it
currently runs end-to-end **only on a mock bus**; the live wiring is pending,
so it is a built prototype, not a shipped result (GR-5). And its Gap is a
registry plus unlock-lattice plus constellation-hash, **not** a Fiat-Shamir
draw — Fiat-Shamir appears there as lore, not as mechanism. Its image of the
door is the one worth stealing: *two mirrors make a door — the Swordsman
reflects, the Mage reflects, and where the reflections meet, the First Person
walks through.*

### 6 · FedWiki core flow + the Gatehouse — a publishing loop, human-gated

*(public site; the loop and Gatehouse are the author's tooling)*

The loop is RESEARCH → **GATE (human)** → BUILD → SNAPSHOT → verify → push,
and its shape instructs precisely because two pieces are deliberately not the
optimization kind:

- **The verifier is an integrity gate, not an adversary.** It fails the deploy
  on empty pages, broken links, a missing machine-forkable JSON sibling, or a
  dev-host leak — checking the *whole* emitted artifact deterministically
  rather than sampling held-out inputs. No frontier metric, no witness draw.
  This is what a harness looks like when the prover is pass/fail integrity and
  the real gate is a person.
- **The cookie broker is the separation mechanism in miniature.** An agent
  receives a scoped capability — a list of host globs it may write — while the
  owner credential that could write the whole farm never enters its context.
  Delegation without disclosure. The broker itself notes it is a hand-rolled
  stand-in for a MyTerms-signed scope, and keeps the seam clean so one can be
  swapped for the other.
- **The Gatehouse** hides documents encrypted inside the public static site
  behind a two-token ceremony (a sigil and a proverb, stretched to a key,
  decrypted client-side — nothing is sent anywhere). Two gate classes:
  **letter-keyed**, where the tokens travel only inside a sent letter, so
  opening it proves receipt; and **canon-keyed**, where both tokens are
  already public, so opening it proves only that you *read the canon* — a rite
  with zero secrecy by design. Its door voice is the harness cast made visible
  to a visitor: the Swordsman guards, the Mage casts. Its seal: *a trust that
  certifies itself is the one you cannot trust.* Neither token opens anything
  alone.

### 7 · The dream cycle — the measure seat at universe scale

*(public tooling; the dreams are the author's working ledgers)*

A standing discovery loop that scans the whole corpus, diffs it against what
has been published, and surfaces the gaps into a checklist the First Person
ticks — the **measure seat grown to cover a fleet**. It proposes what to fill;
it never fills without a tick and never pushes without an ask. It has no
prover, no score, and no Gap, and that is the honest point: on its own it is
the *front* of the loop, and the human gate is the *whole* of its
verification. It carries honest-framing guards as hard invariants (resource
estimation is not an attack; vendored work is not authored) and a relevance
triage that refuses to treat a version-named directory as a gap. Its headline
— *every current repo dreams about itself overnight* — describes a chronicle
that travels with the code and is read each morning to resume.

---

## The structure layer

### 8 · Game of 42 — the lattice the fleet is seated on

*(public: `github.com/mitchuski/game42`)*

Not an optimization loop at all, and it says so. It is a visualization of the
**6 axes × 7 faculty-stations = 42** pattern that `SPECIALISATION.md`
describes in the abstract — here made concrete and, more importantly,
*checked*. The lattice is ℤ/64ℤ = {0,1}⁶; each axis is a basis vertex
(protection 32, delegation 16, … value 1); the faculty cube is {head 1, heart
2, hands 4} and its seven non-empty subsets are the seven stations. The three
operators — `neg(x) = (64−x) mod 64` (the Swordsman), `bnot(x) = 63−x` (the
Mage), and `succ(x) = (x+1) mod 64` — satisfy **`neg(bnot(x)) = succ(x)`** as
stated canon: the same identity `engine/conform.mjs` proves here. Its build
gate asserts the structure rather than trusting it — 42 slots, 6 heptads, the
class split, the per-slot axis vertices, the anchor sums — with a watchdog
that fails if the runtime table drifts from the gate's independent copy. What
it does **not** have is a solver: the fold scalar is a readout, never a
control, and the dual agents are *depicted* (Sword ⊥ Mage) rather than
executed. It is the picture of the structure the other seven are seated in.

---

## What travels, what stays, and how the fleet syncs

Read these eight and you will notice the same skeleton under eight
unrecognisably different bodies: an objective (or an honest absence of one), a
hard constraint, a gate the proposer cannot choose, a ledger only one seat
writes, and a door only a person opens.

They also **sync into one universe**, and that is not decoration — it is the
fractal claim of `SPECIALISATION.md` §2 made real:

- **One inscription, in all of them.** `(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ` is
  stamped on shor_mage's chronicles, tigzkp's harness algebra, MyTerms'
  boundary code, the Gatehouse door, and every Game-of-42 seal. Proving that
  identity rather than asserting it is the same gate idiom everywhere.
- **One cast.** Personas are role classes from a shared skills corpus, bound
  per seat. The support seats of shor_mage and tigzkp are literally the *same*
  City-of-Mages keepers. A new instance claims a vertex on an axis rather than
  inventing a new shape — tigzkp holds the compute axis.
- **One anchor law.** The complement pair whose vertices XOR to 63 — Aletheia
  (V38) ⊕ Lethe (V25) — is the same pair in the Game of 42's lattice and in
  tigzkp's conformance gate: `bnot` made structural, checked in two places
  that never import each other.
- **One sharing surface.** When an instance has something to send, it goes
  through the Gatehouse — and sending is always the door, the First Person's
  alone.

So the fleet is held apart exactly the way the seats are: each instance
publishes a frontier, none writes another's ledgers, and what travels between
them passes a gate it did not choose. **The First Person is the keystone of
the fleet, exactly as the keystone is the pair of the workshop.**

The lemma travels; the corpus stays home. Your harness path is a config, not a
fork — and when it earns a persona and a vertex, it joins the lattice without
drifting, because the structure is checked, not asserted.
