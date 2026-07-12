# Harness paths — where this skeleton went

Ten instances specialised this harness, and an eleventh seat is held open by invitation. None of their code lives here; this
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
| lexon_pvm | controlled-grammar semantic base (Lexon × PVM) | coverage-debt, ↓ | 5 held-out census terms + 3 regression entries hashed from the proposal | full, **mechanically fitted** |
| MyTerms / IEEE 7012 | consent agreements | Φ product over a bilateral record | registry + unlock lattice + constellation hash | loop built, mock-only |
| FedWiki flow + Gatehouse | publishing | presence/absence gap-count | *(no witness draw)* — integrity gate + human | discovery loop |
| the dream cycle | universe upkeep | *(no metric)* — gap surfacing | *(none)* — the measure seat at fleet scale | measure-only |
| Game of 42 | the structure itself | *(none)* — a visualization | *(none)* — checks structure, not results | structure layer |
| **universe-builder** | a map of a corpus | words, ↓ | a sampled draw it never needed | **RETIRED — read this one** |
| hearthold | household sovereignty stack | *(unfilled — defining it IS accepting the seat)* | *(unfilled)* | **OPEN — invited: the House of Archon** |

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

> **At a glance** —
> **objective:** product — average executed Toffoli × peak qubits, ↓ · **gate:** 9,024 held-out witnesses hashed from the candidate's own op stream; only a full clean run (zero classical / phase / ancilla failures) counts · **hard constraint:** exact secp256k1 point-addition semantics — a wrong circuit is not a smaller win
> **the Gap:** a GPU island search reseeded by Fiat-Shamir from the op-stream hash · **lenses:** gate-minimiser ⊥ qubit-minimiser (the complement pair), with a cliff-watcher scoring the whole product (break-even ≈ 1,184 Toffoli per qubit) · **canary:** the unoptimized reference circuit — passes its own witnesses by construction
> **weight:** full loop · private · **the lesson it carries:** MIRAGE got its name here; killed ≠ impossible — seventeen kill entries, each with a re-open condition.

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

> **At a glance** —
> **objective:** surviving R1CS constraints, ↓ · **gate:** the gate ladder — conformance → equivalence → witness → frontier → **the door**, with held-out evaluation points drawn Fiat-Shamir per round · **hard constraint:** witness-computability by forward propagation — the purest GR-3
> **the Gap:** per-round held-out points from the proposal hash · **specialisation:** the fullest — seven seats dressed with personas on the Game-of-42 compute axis, anchor Aletheia (V38) ⊕ Lethe (V25) = 63 checked by conform · **canary:** the reference circuit at its measured baseline
> **weight:** full + specialised · private; superseded as the live thread by instance 4, which carries its method · **the lesson it carries:** origin of GROUND_RULES.md, conform.mjs, scratch discipline, and the killed-levers bar; a declared floor was falsified within hours and filed at win-prominence.

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

> **At a glance** —
> **objective:** fidelity across audiences — non-numeric; the frontier is a shrinking gap-count against the canon · **gate:** an adversarial reviewer with no goodwill who never sees the canon · **hard constraint:** no drift from canon — additivity only
> **the Gap:** the reviewer's enforced blindness (the Gap in document form — no hash draw, honestly labelled) · **lenses:** fourteen roles rather than seven seats; same topology — one manifest writer, append-only critique ledger, chronicle per session · **canary:** the canon itself
> **weight:** full, non-numeric · private · **the lesson it carries:** origin of the claim tiers (GR-2), trace-or-delete (GR-9), and the non-delegable human completion read that became **the door** (T6).

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

> **At a glance** —
> **objective:** R1CS constraints of a real upstream target (the 0xbow privacy-pools-core v2 suite), ↓ · **gate:** per-rewrite certificates + held-out points, with VOID-gated audits · **hard constraint:** witness-computability plus zero semantic drift from upstream
> **the Gap:** Fiat-Shamir per round, as instance 2 · **lenses:** fold-deeper (exact reduction in an admissible family, census-first, pre-registered VOID check) ⊥ structure (measurement-only probes at ΔK=0) · **canary:** the upstream compiler's own optimized build
> **weight:** full, **mechanically fitted** — the first instance whose config passes `engine/conform.mjs` and whose rounds run through the generic engine via `tools/bundle.mjs` · **the lesson it carries:** priors from a training instance mispredict a new artifact in both directions; the *discipline* transfers exactly.

### 5 · lexon_pvm — the grammar workshop

*(instance of the author — public repo `github.com/mitchuski/lexon_pvm`)*

Drives **coverage-debt**: the count of frozen PVM canon census terms (211 at
fit, drawn deterministically from GLOSSARY_MASTER_v4_0 plus the promise-theory
concept mappings) not yet expressed as gate-passing Lexon controlled-grammar
entries in `artifact/LEXICON.lexon.md`. The gate is a spec-checker (parse →
triple round-trip → role binding → promise typing) built from attested
lexon.org samples; the real compiler is a macOS-only binary with unpublished
source, so the frontier gate string carries the regime label honestly. The Gap
hashes each proposal (a pattern recipe plus worked entries) and draws 5
uncovered terms the assayer must express using only the recipe, plus 3 covered
regression entries: generality is the only winning strategy. Per-term
memorization is this domain's mirage, and the critic carries a cliff-watcher
for it. Finder lenses: **grammar-forward** (attested patterns seeking term
families) ⊥ **canon-forward** (canon concepts seeking minimal phrasings), with
a third lens (spell-grammar: seat cards and skills as promise bundles in
controlled English) staged for when the base lexicon has legs. Origin: the
Lexon × 0xagentprivacy convergence run (5 letters, 8 axes, keystone axis
"grammar to graph"); its chronicles and artefacts live in the instance's
`out/`. The A5 keystone claim — a Lexon text is at once readable contract,
executable code, and lossless triple serialisation — is what the checker's
round-trip stage makes mechanical.

State after two runs (2026-07-11): coverage-debt 211 → 152, nine levers
VALIDATED 8/8 across lexr1 and lexr2, and the instance's first MIRAGE — a
scale-up whose gate arithmetic was perfect and whose hard-constraint
self-certification was false (one em dash copied from the census term; the
critic classed it noise and filed no kill). The register-restricted stress
test (OT-2) closed with the discovery that escrow arithmetic is the subset's
only native quantity carrier: conservation, ordering, and impossibility ride
escrow clause shape.

Same day, the gate hardened and grew a public pole. OT-3 (mutation-probe
falsifiability) closed by construction: held-out T-148 had proved the checker
validates a claim and its structural inverse with direction living only in
Notes prose, so `tools/relation_check.mjs` now takes a machine-readable
relation claim per entry (gate / ordering / conjunction / absence — direction
IS an absence claim), builds the claim's minimal structural negation as a
mutated twin that still passes the base gate, and requires the claim to fail
on the twin. Registered as `objective.canary`; the instance's one standing
conform advisory cleared. On top of it sits `tools/blocks_emit.mjs`: every
folded entry renders to a **structured language block** (lex text + typed
triples + promise edges + emit-time-verified relation claim + provenance),
59 blocks committed with Cypher renderings whose absence claims are
re-runnable zero-row constraints — the deterministic write-path unit for a
shared public knowledge graph (the bonfires connection), with the boundary
held one-way: nothing in the grammar assumes the graph exists
(`notes/BONFIRES_STRUCTURED_BLOCKS.md`). Run lexr3 (OT-4) then proved the
hardened gate in the field: three lenses, three structural VALIDATEDs, zero
mirage, every entry and held-out RELATION PASS — including the first
**spell-grammar** lever (a seat card or skill trigger IS a promise bundle),
whose six authoring conventions (SG-1..SG-6: modal mapping, recital as
shared root, trust gates that forbid self-approval, single-officiant
ceremony chains, stakes as escrow with irreversibility as absence, bilateral
formation as defined-predicate conjunction) folded into SPELL_GRAMMAR.md.
Coverage-debt 152 → 123; two critic-flagged held-outs refused at fold (scope
inflation: invented roles). Then the endgame move: **this skeleton's own
constitution — TRUSTS T1-T6 and all seven seat cards — now exists as thirteen
verified Lexon promise bundles** in the instance's `artifact/SPELLS/`
(13/13 CORPUS PASS: base gate plus every relation claim surviving its
mutated twin; T2's separation bound expressed as pure topology, an absence
claim — no transfer clause routes anything to the Mage; T6's door as a gate
no seat may self-declare). Keystone-authored and honestly labelled: not
census terms, metric unmoved, no Gap draw — a loop round there would have
been mis-gated by construction, the universe-builder's lesson applied in
advance. The operator result, lexon your own dual agents, is a verified
corpus; its projections (skill, SPECIALISATION spell layer, bonfires packet)
wait at the door. lexr4 then ran overnight under a binding claim-type
diversity rule: four complete rounds, **eleven levers VALIDATED 8/8 and the
instance's first structural kill** (K-2: a spell recipe honestly non-general
on zero-party terms — its own cast rule cited a prior fold refusal as
precedent — plus a second em-dash self-certification catch). The critics'
round-level finding: the three lenses have converged on ONE claim-derivation
charter validated eleven times, so the next round merges to a single charter
with round-level disjointness binding. Coverage-debt 123 → 64 (the census 70%
covered, 147 public blocks, 91 carrying verified claims). Instance head
`10dad55`.

> **At a glance** —
> **objective:** coverage-debt — frozen census terms not yet expressed as gate-passing controlled-grammar entries, ↓ · **gate:** the spec-checker — parse → triple round-trip → role binding → promise typing (regime label honest: the real compiler is unpublished) — plus the mutation probe: every entry's relation claim must survive its mutated twin · **hard constraint:** every entry passes the checker built from attested lexon.org samples
> **the Gap:** hash the proposal (recipe + worked entries); draw 5 uncovered terms the assayer must express from the recipe alone, plus 3 covered regressions — generality is the only winning strategy · **lenses:** grammar-forward ⊥ canon-forward ⊥ spell-grammar (promoted at lexr3) · **canary:** the relation fixture authored together with its claims — passes the full pipeline by construction
> **weight:** full, mechanically fitted · public repo · **the lesson it carries:** per-term memorization is this domain's mirage; the first MIRAGE was perfect gate arithmetic wearing a false self-certification, and the T-148 inversion taught the gate to tell a fortress standing from a fortress fallen.

---

## Adjacent embodiments — the same topology, a different (or missing) piece

These wear the architecture without running the full optimization loop. They
are here because each shows a real trust boundary doing real work — and
because naming what they *lack* is how you learn which pieces are load-bearing
for which job.

### 6 · MyTerms / IEEE 7012 — the two agents made literal

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

> **At a glance** —
> **objective:** a Φ product over a bilateral consent record · **gate:** a `beatsFrontier` predicate + cliff-watcher — running end-to-end **only on a mock bus** (GR-5: built prototype, not shipped result) · **hard constraint:** both parties hold identical immutable copies of the record
> **the Gap:** registry + unlock lattice + constellation hash — **not** a Fiat-Shamir draw; Fiat-Shamir appears as lore, not mechanism · **lenses:** the split is literal — two browser extensions that cannot reach into each other · **canary:** the proffered baseline terms
> **weight:** loop built, mock-only · private · **the lesson it carries:** T4 made executable — invitation before proposal; *two mirrors make a door.*

### 7 · FedWiki core flow + the Gatehouse — a publishing loop, human-gated

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

> **At a glance** —
> **objective:** presence/absence gap-count — what canon is not yet federated · **gate:** a deterministic integrity gate (empty pages, broken links, missing JSON siblings, dev-host leaks) — an auditor, not an adversary; **the real gate is a person** · **hard constraint:** nothing sealed crosses; git stays the source of truth
> **the Gap:** none, deliberately — the human gate is the whole of the verification · **separation mechanism:** the cookie broker — an agent receives host-scoped write capability while the owner credential never enters its context; delegation without disclosure · **canary:** a known-good page through the same build
> **weight:** discovery loop · public site · **the lesson it carries:** what the architecture looks like when the prover is pass/fail integrity — and why that is correct for this job.

### 8 · The dream cycle — the measure seat at universe scale

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

> **At a glance** —
> **objective:** none — gap surfacing across a whole corpus · **gate:** the First Person's tick, item by item · **hard constraint:** honest-framing guards held as hard invariants — resource estimation is not an attack; vendored work is not authored
> **the Gap:** none — this is the measure seat grown to fleet scale, and it says so · **lenses:** relevance triage (a version-named directory is not a gap) · **canary:** n/a — nothing is graded
> **weight:** measure-only · **the lesson it carries:** the front of the loop can stand alone when the human is the whole gate; it proposes, never fills without a tick, never pushes without an ask.

---

## The structure layer

### 9 · Game of 42 — the lattice the fleet is seated on

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

> **At a glance** —
> **objective:** none — a visualization of the structure itself · **gate:** the build gate asserts 42 slots, 6 heptads, the class split, per-slot axis vertices, and the anchor sums, with a runtime watchdog against an independent copy · **hard constraint:** the fold scalar is a readout, never a control
> **the Gap:** none — it checks structure, not results · **lenses:** depicted (Sword ⊥ Mage), not executed — there is no solver, and it says so · **canary:** the stated canon identity `neg(bnot(x)) = succ(x)` itself
> **weight:** structure layer · public · **the lesson it carries:** structure you cannot check is decoration; the lattice is structure because a gate can fail on it.

---

---

## The negative result

### 9 · universe-builder — where the harness was applied and should not have been

*(in this repo, at `universe/retired/`. Kept on purpose.)*

The most useful entry in this catalogue, because it is the only one that
failed. Its target was a **map of a corpus**, and it was given the full
apparatus: two blind lenses, a Fiat-Shamir Gap, a held-out gate, an advancing
frontier. Two rounds, roughly **1.4 million subagent tokens, and not one fact
learned about the map.**

- **u1** died of infrastructure — and paid for itself by exposing that the
  engine counted dead agents as *dry rounds*, reporting an outage as an
  exhausted search. Fixed, and pinned by `engine/loop.test.mjs`.
- **u2** ran perfectly: 9/9 agents, seeds re-derived, verdicts on disk. Both
  candidates **beat the metric**, and both scored **0/8** — because the Gap was
  drawing arbitrary facts (a licence string, a JSON `version` field) from
  612 KB of sources that the 7 KB map was never responsible for carrying. The
  objective demanded compression; the gate demanded a transcript. **The
  feasible set was empty.** The verdicts measured the config, not the artifact.

Then a nine-line auditor found, on its first run, in milliseconds, for zero
tokens, the very defect u2's `by-container` lens had found and been unable to
validate: the map described five corpus layers where the frontier enumerates
six.

**Why it failed.** The Gap earns its cost only where the claim space is too
large to check. The map makes ~100 **enumerable** claims. Check them all, and a
mirage becomes impossible — there is nothing to tune to. What that domain
wanted was an **integrity gate, not an adversary**, exactly as this catalogue
already classifies the substrate's audit triad and the publishing loop. The
lesson was on the page the whole time: *the harness transfers to any pipeline
where generated artifacts must survive **adversarial** scrutiny.*

**What it gave the core.** The `mis-gated` critic classification — the only one
that accuses the config rather than the proposer, because `structural`,
`probe-limited`, and `noise` leave a critic nowhere else to look. And
`objective.canary`: name an artifact that passes your gate **by construction**,
or you will not be able to tell a bad candidate from an impossible gate.

*A harness is for adversaries. An auditor is for facts. Knowing which you have
is the first design decision, and the cheapest one to get wrong.*

> **At a glance** —
> **objective (historical):** words of a corpus map, ↓ · **gate:** 8 comprehension claims hashed from the map — drawn from 612 KB of sources a 7 KB map was never responsible for carrying; **the feasible set was empty** · **hard constraint:** every claim traces
> **the Gap:** a sampled draw it never needed — the map makes ~100 claims and every one is enumerable · **lenses:** by-container ⊥ by-content — both refused at 0/8 while both beat the metric · **canary:** MISSING, and that was the diagnosis: without one you cannot tell a bad candidate from an impossible gate. `objective.canary` was born here.
> **weight:** RETIRED — replaced by `universe/audit.mjs`, exhaustive and agent-free, which found on its first run what two rounds and ~1.4M tokens could not · **the lesson it carries:** a harness is for adversaries; an auditor is for facts.

---

## Invited vacancies — a seat held open is a trust doing work

### 11 · hearthold — the House of Archon's slot

*(scaffolded at `../hearthold_mage` — deliberately unfilled)*

The household sovereignty stack — the Warden who guards, Recall who remembers,
the Knowledge Portal that faces outward, the factor-2 step-up ladder — has a
harness seat scaffolded and **held open for the House of Archon**. Nothing in
it conforms, and nothing should: the config wears its TODOs, the frontier has
no baseline, and the gate's refusal is the mechanism that keeps the seat warm.
This is trust T4 made structural — *an invitation establishes the acceptance
relationship before any specific proposal* — and the proposal here is the
acceptor's to make. `SLOT.md` in the instance carries the invitation: three
candidate objective directions (step-up-ladder coverage · Recall fidelity ·
Portal disclosure-minimization), the five answers that constitute acceptance,
and a **proposed** seating at V60 (burning Protection · Delegation · Memory ·
Connection, forcing anchor V3 = Computation + Value — *the hearth burns care,
not compute*), re-derivable from whatever objective is actually accepted.

> **At a glance** —
> **objective:** OPEN — defining it IS accepting the seat (ADOPTION.md Part II, the five answers) · **gate:** OPEN · **hard constraint:** OPEN
> **the Gap:** OPEN — and if the accepted claim space turns out enumerable, an auditor is a valid acceptance too (see #9) · **lenses:** OPEN · **canary:** OPEN
> **weight:** invited vacancy — conform REFUSES the instance today, by design · **the lesson it carries:** a slot the gate holds open cannot be quietly squatted; the seat stays honest until someone signs their name to its objective.

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
