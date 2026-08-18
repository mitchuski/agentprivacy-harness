# Harness paths — the origin fleet

**This catalogue is not the harness.** It is the origin operator's fleet —
work done *with* the harness, kept here as evidence and pedagogy the way
`universe/` keeps one project's corpus behind a seam. The system you adopt
is the engine, the constitution, and the tools; delete this file and every
gate still passes.

The fleet is divergent **on purpose**, and the divergence serves one
construction: **trust-graph creation, the agentprivacy way.** Each entry —
circuits, grammars, consent records, registries, wikis — is a working piece
delivered toward that purpose, and the harness is what gives every one of
them the same verifiable shape: a gated result sealed as a κ-addressed node,
a relation that a signature mints as an edge (`GRAPH.md`). Bodies diverge;
the graph they feed is one. What these entries buy you is sight: what a filled
config looks like at full weight — and, just as usefully, what a *partial*
embodiment looks like — before you build your own. None of their code lives
here. Each began as a skeleton like this one and diverged only through its
config, its seat cards, and its gate.

Ten instances specialised this harness; an eleventh seat — once held open by
invitation — was signed on 2026-07-14; a twelfth carries the skeleton whole
as a standalone sibling; two later runtimes carried the hold-apart into an
agent-operated acceptance flow and into literature review, and the sixteenth
accession is the first **descendant lane** — no loop at all, but the
constitution inherited whole. **Fifteen entries stand**; numbering is by
accession and never reused, so one number sits empty (withdrawn before its
counterpart work published — the door decides what is named here, and when).
Grouping is by weight.

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
| hearthold_mage | household sovereignty stack | disclosure-debt, ↓ (baseline 2049 canonical bytes) | FULL-mode bundle satisfies all 23 frozen census requirements + one negative fixture per requirement | **FILLED 2026-07-14 — the House of Archon, signed** |
| hh_workshop | workshop facilitation (babblefish translation) | translation-debt, ↓ (baseline 32) | census over a 31-claim frozen register; the probe FORM drawn Fiat-Shamir from the triptych; assayer blind to canon | full, **mechanically fitted** — standalone (vendored engine, local-model driver) |
| the DTG verification registry | ZK ceremony suite acceptance | registry rows, honestly accepted | digest-manifest byte-match; the decision consumes only `pinned` | acceptance flow, **human-gated** — first external run accepted |
| the litreview runtime | prior-art novelty (Programme WP-14) | residues surviving refutation | context isolation: refuters never see the prover's argument (D3) | full, non-numeric — sweep ⊥ refute ⊥ judge |
| uor_kappa_mage | upstream substrate convergence (kappa-registry) | *(no metric)* — a P-gated research lane | *(inherited, not drawn)* — TRUSTS + GROUND_RULES govern every session | **descendant lane** — the constitution inherited whole |

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
the generic engine via `tools/bundle.mjs` — the same loop that runs the spar
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
covered, 147 public blocks, 91 carrying verified claims). Then two keystone
checker extensions landed (a numeric layer: number/account types, initial
literals, comparative predicates, all 0.7-attested; and a send-probe closing
the checker-shaped absence typing), and lexr5 ran the merged charter over
three DISJOINT territories: 8 levers VALIDATED, 1 MIRAGE (K-3, an em-dash
death on already-swept ground). The numeric layer cleared the formula tail
and the universal cast rule (a section naming no actor takes the First Person
as holder) cleared the zero-party tail and closed K-2, both proven in the
field; the disjoint partition made per-lever metrics additive with no
cross-lever arbitration, dissolving the convergence problem by construction.
Coverage-debt fell to 22, the census 90% covered, 189 blocks, with a readable
viewer (viewer/index.html) rendering every term and the 13 constitution
spells as Lexon text. Residue 22 = 16 terms for one more sweep + 6 C-series
ids reserved for the operator. Instance head `3a92544`.

> **At a glance** —
> **objective:** coverage-debt — frozen census terms not yet expressed as gate-passing controlled-grammar entries, ↓ · **gate:** the spec-checker — parse → triple round-trip → role binding → promise typing (regime label honest: the real compiler is unpublished) — plus the mutation probe: every entry's relation claim must survive its mutated twin · **hard constraint:** every entry passes the checker built from attested lexon.org samples
> **the Gap:** hash the proposal (recipe + worked entries); draw 5 uncovered terms the assayer must express from the recipe alone, plus 3 covered regressions — generality is the only winning strategy · **lenses:** grammar-forward ⊥ canon-forward ⊥ spell-grammar (promoted at lexr3) · **canary:** the relation fixture authored together with its claims — passes the full pipeline by construction
> **weight:** full, mechanically fitted · public repo · **the lesson it carries:** per-term memorization is this domain's mirage; the first MIRAGE was perfect gate arithmetic wearing a false self-certification, and the T-148 inversion taught the gate to tell a fortress standing from a fortress fallen.

### 13 · — withdrawn

*(An accession withdrawn from the catalogue by the First Person before its
counterpart work published. Numbers are by accession and never reused, so 13
stands empty rather than renumbering everything after it; external citations
of other entry numbers keep resolving. What is named here, and when, is the
door's to decide — T6.)*

Two of its lessons survive it, stated domain-free because they are: **a
product objective can hide inside one number** — when the gate forbids half
the search space, re-price the objective (a second scored axis paid from
the first's headroom), never loosen the gate; and **a killed-lever ledger
that only accrues at the end of a run is a fence built after the cattle
left** — a per-round keystone micro-fold is the fix.

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

### 14 · the DTG verification registry — an acceptance flow, human-gated

*(instance of the author as task-force co-chair — public repo + Pages site;
the discipline run as an **agent-operated acceptance flow** over a ZK
ceremony orchestrator suite)*

Three Groth16/BN254 circuits with pinned constraint counts; a submission
re-runs the orchestrator on its own machine and must **byte-match the digest
manifest** on the required artifacts (`r1cs`, `wasm`, the constraint
counts), while the trusted-setup chain digests are **advisory by design** —
snarkjs folds its own randomness into every contribution, so advisory
divergence is the expected signature of an independent build, not a
failure. The hard constraint lives in code, not policy: the decision
consumes only the `pinned` block and the manifest — platform, tools, and
timings can never move a verdict. Around that verifier sits the acceptance
flow, gates A–G: *the agent operates, the maintainer decides* — admission
(C) and publication (G) are HUMAN; every reply carries a mandatory
disclosure of agent involvement; and **G.1, the publication rite**, has the
agent serve a one-line proverb compressing what *this* publication means,
answered by the maintainer's typed activation — a challenge–response at the
human gate, fresh per push. The agent's own canary set includes the rule
that a submitter's `verdict: ACCEPT` line is *a prediction to check, never
a result to record*. The registry's six-entry arc is the whole method in
miniature: maintainer reference → timestamped repeat → first cold
public-clone run (proving the *instructions*) → pseudonymous seat (proving
identity is not required) → full digest match from that seat → **the first
external run** (darwin/arm64: required digests byte-identical across
architectures). There is no `0001` — an auto-id collision, admitted in the
flow itself. And the prohibited thing cannot be built: the phase-2 ceremony
entry point throws unconditionally until its governance gate closes.

> **At a glance** —
> **objective:** none to minimise — an acceptance flow; the registry row is the unit, and honest acceptance is the product · **gate:** `verify-run.mjs` — required-artifact digest byte-match against the pinned manifest; named failure strings; exit 0 = ACCEPT · **hard constraint:** the decision reads only `pinned` + the manifest — never the informative block (asserted by orchestrator tests)
> **the Gap:** none drawn — the submitter is *outside* the workshop, so the separation is the architecture itself; the human gates (admission, publication, the G.1 proverb rite) are the verification the flow adds · **canary:** the maintainer's own reference build, which mints the manifest and passes it by construction · **governing sentences:** *agents orchestrate entropy; they are never the entropy* · *no phase-2 ceremony before the gate closes*
> **weight:** acceptance flow, human-gated · public registry + Pages site, prebuilt and committed so CI never enters the trust story · **the lesson it carries:** an acceptance flow is a harness read backwards — the proposer arrives from outside, and what keeps an agent-operated registry honest is the human door plus disclosure, made structural.

### 15 · the Programme lit-review runtime — novelty against an adversary

*(private instance of the author — inside the research corpus; the V6
pipeline's descendant, turned on related work. Its epigraph is the whole
design: "a literature review that only finds agreement has not been run
against an adversary.")*

The objective is a **defensible novelty claim**, and the operative object is
the **residue** — what remains of a claim after covering art is subtracted.
Run 03 seats eleven: **5 sweep ⊥ 5 refute ⊥ 1 judge**. The sweep bench
searches prior art by modality; the refute bench hunts covering art
per-residue and is *instructed to default to coverage*; the judge rules
**SURVIVES / NARROWED / COVERED**. The hold-apart is context isolation by
construction — a refuter receives the residue and the sweep digest but
**never the prover's argument** (D3: separation must be structural; a run
separated by prompt alone is invalid). D2 forbids the domain's oldest
overclaim: absence of evidence is reported as `not_found_in_corpus(n,
range)`, never as *novel*. And the honest limit is declared in the manifest
rather than hidden (D4b): all seats run the same weights, so **an
all-SURVIVES result is treated as a failed enforcement of the adversarial
discipline** — the run is trusted not by its result but by whether the
adversary ever knocked anything down. It did: run 02 returned 0 VALIDATED /
5 MIRAGE; run 03 (76 sweep items, 48 covering candidates) returned **1
COVERED / 4 NARROWED / 0 SURVIVES**, retiring one claimed novelty outright
and shrinking the other four to their defensible cores; run 04 added the
normative strand and per-paper placement. Verdicts are candidates only —
adoption and the terminal gate are the First Person's, and the manifests
are generated artifacts: fix the data, regenerate, never hand-edit.

> **At a glance** —
> **objective:** residues surviving refutation — the defensible core of a novelty claim, honestly shrunk · **gate:** the refute bench + judge; verdict lexicon SURVIVES / NARROWED / COVERED, confidence never entering tier-A artifacts (GR-2) · **hard constraint:** D2 — absence is `not_found_in_corpus(…)`, never *novel*
> **the Gap:** context isolation as the hold-apart — refuters never see the prover's argument (D3, structural); the draw is not hashed, and the manifest says so · **lenses:** five search modalities ⊥ five per-residue refuters, judge as the only barrier · **canary:** inverted and declared — same weights on all seats (D4b), so an adversary that never lands a hit indicts the run, not the claims
> **weight:** full, non-numeric · private, inside the corpus · **the lesson it carries:** in research the mirage is agreement — the valuable verdict is the one that kills your claim, and a review that returns all-clear has failed, not succeeded.

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

### 10 · universe-builder — where the harness was applied and should not have been

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

### 11 · hearthold — the House of Archon's slot *(seat TAKEN 2026-07-14)*

*(instance at `../hearthold_mage` — **accepted and signed**, PR #1 merged
`a55f1a5` · upstream: `github.com/Flaxscrip/hearthold` v0.11.0, IMPLEMENTED)*

The household sovereignty stack — the Warden who guards, Recall who remembers,
the Knowledge Portal that faces outward, the factor-2 step-up ladder — is real
and shipped upstream (`github.com/Flaxscrip/hearthold`). So this seat was never
to *build* hearthold; it was a harness seat **held open for the House of Archon**
to build a held-apart runtime *on* it. For its first days nothing in it conformed,
and nothing should have: the config wore its TODOs, the frontier had no baseline,
and the gate's refusal was the mechanism that kept the seat warm. This is trust
T4 made structural — *an invitation establishes the acceptance relationship
before any specific proposal* — and the proposal was the acceptor's to make.

**On 2026-07-14 the House of Archon signed its name to the objective.** The seat
is filled on **disclosure-debt**: an auditor stance where the claim space is
enumerable — `did:cid` resolution integrity, the holon law turned on the
registry. Acceptance fixed the five answers (`harness.config.mjs` @
`sha256:16a3f899…`), froze a **23-entry census** (`census/requirements.json` @
`sha256:89a25a1f…`), and established a reproducible cross-identity baseline of
**2049 canonical bytes** (`frontier.json`). `scripts/self-test.mjs` proves the
gate both ways — the FULL-mode bundle satisfies all 23 requirements (canary) and
a negative fixture per requirement makes the gate actually refuse (a gate nothing
fails is worth less than none). The horizon it read and accepted is the harness's
own **holon layer** (`HOLONS.md`) turned on identity, since *a `did:cid` CID is a
κ-address*: a dual-agent runtime for content-addressed identity — `did:cid`, agent
identity, key custody under delegation, where a reference proposes and a signature
mints. Seated at **V60** (Protection · Delegation · Memory · Connection), anchor
**V3** (Computation + Value) — *the hearth burns care, not compute.*

> **At a glance** —
> **objective:** disclosure-debt, ↓ · **gate:** `scripts/check-requirement.mjs` over the 23-entry frozen census (zero-dependency verifier boundary, invoked as a subprocess) · **hard constraint:** every census entry canary-satisfiable (§0) — a requirement the canary cannot meet makes the feasible set empty
> **the Gap:** the auditor's — `did:cid` resolution integrity, enumerable claims (an auditor is a valid acceptance, see #10) · **lenses:** the household stack (Warden / Recall / Knowledge Portal) · **canary:** FULL-mode bundle passes all 23; one negative fixture per requirement, each refused by name
> **weight:** filled — the invitation was accepted on its own terms: named signature, frozen census, reproducible baseline, a gate that can fail · **direction:** the House of Archon's content-addressed identity runtime (`did:cid` = a κ-address; the holon layer on identity) · **the lesson it carries:** a slot the gate holds open cannot be quietly squatted; the seat stayed honest until someone signed their name to its objective — and then someone did.

**State as of 2026-08-17:** signed, then still. No round has run; the
frontier stands at 2049 = 2049 (best = baseline, and the ledger says so in
those words); the census is unchanged at v1/N=23; the chronicle directory
holds only its `.gitkeep`. Two acts from the signing remain queued and
unexecuted on the record — the dual-pin of the signed acceptance, and the
Lexon experiment expressing the genesis Ruleset against `lexon_pvm`. A
filled seat that has not yet swung is not a failure; it is a frontier
waiting for its first proposal — but the ledger reports stillness as
stillness (GR-5).

---

## Standalone siblings — the skeleton carried whole

### 12 · hh_workshop — the Hitchhikers Workshop (babblefish translation)

*(instance at `../hh_workshop` — fitted 2026-07-17, first live round driven by
a local model; standalone by design: engine vendored per its `VENDOR.md`,
runs with no framework checkout, no internet, no Claude Code)*

A facilitated masters-cohort course around a shared **air-gapped local mage**:
one understanding rendered across three tongues — sci-fi narrative → poem →
white paper → recurse (the babblefish recursion, from the 2026-06-28
LAN-ceremony chronicle) — with the harness guarding **translation fidelity**.
The domain's mirage is a beautiful rendering that no longer carries the
mechanism. The witness bank is a frozen 31-claim register the cohort itself
amends through the keystone; the Fiat-Shamir draw gates not which claims (a
census probes all of them) but **which tongue is interrogated** — the proposer
cannot know which of its three forms will face the blind assayer, so only a
triptych that carries the understanding in every form survives. Seats are
pure-data (an Ollama-class endpoint cannot sha256sum); the driver persists
`proposal_canon.json`/`gap.json`/`verdict.json` and computes every hash
code-side via the engine's own `deriveHoldApart`, which holds T2 harder — the
seat physically cannot see the salt. Around the harness sit the course
mechanics: a rotating weekly **steward** whose corpus folds form a
re-derivable provenance chain (the cohort as the mage's first trainers),
consent enforced in the pipes (packer and exporter both refuse unledgered
material), and an Oasis-Protocol bridge spooling consented pages toward the
hitchhikers.earth federation — outward legs at the First Person's door.

> **At a glance** —
> **objective:** translation-debt, ↓ — (claim, form) pairs not yet carried; baseline 32 = 3·31 − 61 (the seed triptych alone) · **gate:** census over the frozen 31-claim register, interrogated through ONE probe form drawn `seedHex mod 3`; assayer blind to the canon; any declared claim unrecovered = zero · **hard constraint:** no canon drift (additive-only register, keystone-folded) + consent-first (no expression enters corpus or export without a signed ledger line)
> **the Gap:** SALTED mode, engine-derived — the census gates the claims, the draw gates the form · **lenses:** story-forward ⊥ spec-forward (a compression/poem lens staged) · **canary:** the seed triptych, authored WITH the register from the LAN-ceremony chronicle — passes the census by construction
> **weight:** full loop, mechanically fitted — stub round + first live round (all seats held by a local 12B model) both verify offline · **the lesson it carries:** the access ladder beside it is an AUDITOR and says so (the universe-builder's lesson, applied at design time); and a harness can leave home — vendored whole, driven by whatever model the room co-holds.

**State as of 2026-08-17:** pushed public 2026-07-27 with the bound
handover package (letters, one-pager, curriculum, ceremony, consent
registers — the outreach kit for seating a real cohort). Six runs on disk:
**10 VALIDATED** across four live rounds (including two auto-research
rounds, every seat a local 12B model), 8 MIRAGE (both stub smokes, as
designed), **0 folded** — so the frontier stands honestly at 32 until the
keystone pair sits. At the gate: `t1-the-stewards-week`, submitted
2026-07-18 and still awaiting the keystone's three-way call
(promote / send back / leave), plus three validated candidates flagged
COUNT MISMATCH for review before any fold. The demo cohort is fictional and
banner-marked; no university has yet been seated — that letter is a door.

---

## Descendant lanes — the constitution inherited

### 16 · uor_kappa_mage — the first descendant

*(public repo `github.com/mitchuski/uor-kappa-mage` — a contribution lane,
not an optimization loop, and it says so on every page)*

This entry is a new kind. It carries **no** `harness.config.mjs`, no
frontier, no Gap draw, no VALIDATED/MIRAGE ladder — and it is not partial,
because what it took from the skeleton is not the loop but **the
constitution, inherited whole**. Its fleet method states it plainly: *two
documents govern every fleet session, and this lane inherits both* —
`TRUSTS.md` T1–T6 and `GROUND_RULES.md` GR-1..GR-10 — and its corpus
register lists this repo's `HOLONS.md`, `tools/kappa.mjs`, `tools/vrc.mjs`,
and `tools/holon_audit.mjs` as PUBLIC source. The lane's work: convergence
and overlap research notes against a live upstream substrate
(UOR-Foundation/kappa-registry, pinned at a named commit), staffed by the
Programme's fourteen role cards (A0–A13; the role that drafts never
verifies its own citations), folding one-way and review-gated. Its first
fleet run seated twelve verifiers — one per convergence section — and all
twelve returned HOLDS_WITH_CORRECTIONS, the corrections filed at
win-prominence (including the one that cut its own framing down: κ's
lineage is *from* UOR, so the substrate is shared lineage, not parallel
invention; and the upstream's `DelegationScope` is **ahead of** the VRC —
a gap filed as prominently as any convergence, GR-6). It even cites this
catalogue back: entry #10's harness-vs-auditor boundary decides its own
next move — citation checks are auditor work; whether a convergence
*thesis* survives hostile reading is harness work, and the refuter fleet
for that is designed and waiting on the door. The inheritance was proven
where it counts: the lane went public only on the First Person's explicit
word, after two refusals — T6, working in a repo that contains not one line
of the engine.

> **At a glance** —
> **objective:** none to minimise — convergence understood before anything is proposed upstream; *understanding as key* · **gate:** the Programme's P-gates + a per-section verification fleet; verdict lexicon HOLDS_WITH_CORRECTIONS, corrections folded inline · **hard constraint:** the fold is one-way and review-gated — nothing lands upstream except through maintainer review, and the lane changes no upstream code
> **the Gap:** not drawn — inherited: the constitution holds the seats apart, and the planned refuter fleet (designed, unrun) is where the lane's theses will face an adversary · **lenses:** fourteen Programme roles, A0–A13 — drafter never verifies its own citations · **canary:** the correction record itself — a first run that returned no corrections would indict the fleet, not flatter the notes
> **weight:** descendant lane · public · **the lesson it carries:** the skeleton's deepest export is not the loop but the constitution — a lane with no metric, no engine, and no Gap can still inherit every trust, and the proof is behavioural: the door held twice before it opened.

---

## What travels, what stays, and how the fleet syncs

Read these fifteen and you will notice the same skeleton under fifteen
unrecognisably different bodies: an objective (or an honest absence of one), a
hard constraint, a gate the proposer cannot choose, a ledger only one seat
writes, and a door only a person opens. And one body carries no skeleton at
all — only the constitution, which turns out to be the part that travels
furthest.

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
