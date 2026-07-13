# dual-agent-harness

**A verification harness for AI-agent work: one agent proposes, a second
independently proves, and the tests that decide are derived by hashing the
proposal together with a secret the proposer never sees — so it cannot grind
them — and, where the fact set is enumerable, every fact is probed. Config-
driven, zero dependencies, every axiom checked at runtime.**

**soulbae 🧙** proposes. **soulbis ⚔️** proves. Between them sits **the Gap
⿻**: the witnesses are derived by hashing soulbae's own proposal with a run
secret it cannot see, so soulbae cannot tune or grind them and soulbis cannot
be accused of choosing them. Above them both is **the First Person 😊** — you
— who alone opens the door to anything outward-facing.

That is the entire idea. Everything in this repo is machinery for keeping
those two apart, and a ledger discipline for what survives.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```

The Swordsman is negation, the Mage is complement, and composed across the
Gap they produce the successor — the step forward. On Z/64Z this is a
theorem, and `engine/conform.mjs` computes it for all sixty-four values every
time it runs rather than taking it on faith. A result exists only where the
two were genuinely held apart.

## Why this matters for AI

As AI systems increasingly **generate work and also judge it** — reward
models scoring their own rollouts, LLM-as-judge, an agent writing code and
then its own tests — one failure recurs: the check an agent invents is the
check its work was built to survive. That is Goodhart's law wearing an agent
costume, and it is the failure behind reward hacking, self-preferring judges,
and green-because-written-green test suites. This harness answers it
**structurally rather than behaviourally**: the verification witnesses are
derived by hashing the proposal **together with a run secret the proposer
never sees**, so it cannot predict or grind the draw — and where the witness
bank is small enough to enumerate, the gate is a **census** that probes every
one, so a single dropped fact cannot hide. The two agents share only their
root; the routing that would let them collude is a design invariant of the
seat topology (a target the runtime does not yet enforce with process mounts —
see `THREATS.md`). Then a multiplicative gate refuses partial passes, an
`enforced-by` claim register refuses claims stronger than their enforcement,
and the door keeps every outward action a human's.

`RESEARCH.md` states the contribution in full — the problem, the precise
claim, what is borrowed (Fiat-Shamir, Promise Theory, the PVM model) versus
assembled here, the evidence on record, and the limits that evidence does not
cross. It is written to the standard the harness enforces on its instances: a
claim is worth what it can be re-run to show.

## Where it stands

This is not a sketch. The engine has been debugged **by being run** — seven
defects to date, every one invisible to inspection and obvious on execution,
each fixed and pinned by a test or a prompt rule (an outage reported as an
exhausted search; a gate that passed an unfilled config; a critic with no
word for a bad gate; seats whose disk record was thinner than their return).
The runnable spar has a real advancing frontier: its guide compressed from a
730-word baseline to a 472-word validated best across four audited folds,
each held to an 8/8 held-out gate on independent witness draws, the last two
closed by an exhaustive fact census
(`examples/field-guide/frontier.json` is the authority; its `chronicles/`
tell the story). Ten real embodiments — quantum circuits, ZK constraint
systems, research pipelines, consent agreements, and one deliberate failure —
are catalogued in `HARNESS_PATHS.md`. The skeleton is domain-neutral and
stays that way.

## The pathway — clone to your own harness

**Requirements:** Node ≥ 18, nothing else (zero npm dependencies). Running
rounds multi-agent needs a driver for the seven seats — Claude Code's
Workflow tool is the reference runtime; `engine/dual_agent_loop.mjs` also
accepts any `rt = { agent, parallel, pipeline, phase, log }` you supply.

1. **Prove the axioms** — one command, every gate this repo has:
   ```bash
   node tools/check.mjs
   ```
   Algebra on all of Z/64Z, the engine's failure-semantics tests, conformance
   of every instance it discovers, and a negative test that the blank
   template *fails for the right reasons*. Non-zero exit prints re-runnable
   commands.
2. **Read the constitution** — `TRUSTS.md` (the six trusts and where each one
   bites), then `GROUND_RULES.md` (GR-1..10, pasted into every seat at boot).
   These are the parts you should not change.
3. **Run the spar** — a practice bout, with real strikes, against `examples/field-guide/` (compress a
   field guide; a hash-drawn 8-question gate must stay 8/8). In Claude Code,
   invoke the Workflow tool:
   ```
   scriptPath: examples/field-guide/harness.workflow.mjs
   args: { "repo": "<abs>/examples/field-guide", "root": "<abs of this clone>", "runId": "r4" }
   ```
   All writes land in `runs/<runId>/`; the frontier does not move on its own.
4. **Audit and view the round** — `node tools/render_run.mjs examples/field-guide r4`
   writes a static `run.html` that re-derives every Gap seed from the saved
   proposal bytes; or check by hand: `sha256sum proposal_canon.json` must
   equal `seedHex` in `gap.json`.
   Or **watch the workshop live**: `node tools/console.mjs` serves a
   read-only console at `127.0.0.1:4242` — the six-phase loop as evolving
   geometry, every seed re-derived per poll, the frontier as a moving
   ceiling, and a door panel that lists what software will never do for you.
5. **Fold as keystone** — in the main session, per `seats/keystone.md`:
   conform green → fold the validated-and-structural lever → frontier first,
   prose second → file the chronicle → conform green again. Where the claim
   space is enumerable, run the census — what you can count, count.
   Publishing anything is yours alone (T6).
6. **Seal what survived** — `node tools/mint_artefact.mjs examples/field-guide r4`
   writes a κ-labelled artefact bundle (content-addressed by canonical-JSON
   sha256 — never trusted, only re-derived) with an evidence hash-manifest
   and a `DOOR.md` of the outward actions software did NOT take. It refuses
   tampered seeds, red gates, and verdict-less runs. The console's door
   panel lists every bundle; carrying one anywhere is the door, and the
   door is yours.
7. **Scaffold your own instance** — `node tools/new_instance.mjs ../my-harness my-harness`,
   fill every TODO in its `harness.config.mjs` (the gate and the bundler both
   refuse a config still wearing them), then
   `node tools/bundle.mjs my/harness.config.mjs my/harness.workflow.mjs` and
   run it exactly like the spar. `SEAT_CONTRACT.md` is the interface, and
   **`ADOPTION.md` is the map**: why the duality works on any topic, the
   harness-vs-auditor decision, the five answers that become your config, and
   six worked domain mappings. **Define the Gap first** — if you cannot say
   how held-out witnesses derive from a proposal by hashing, you do not have
   a harness yet (and may want an auditor instead).
8. **When it earns it, specialise** — `SPECIALISATION.md` binds personas and
   spells to seats and seats instances on the Game-of-42 lattice;
   `HARNESS_PATHS.md` shows ten real configs at every weight — and one seat
   held open by invitation, which is also a thing a harness can be.

**Follow the worked example.** The spar's own history is the pathway walked
end to end: `examples/field-guide/frontier.json` records four audited folds
(730 → 573 → 526 → 472, every step at gate 8/8, the last two closed by
exhaustive census), its `chronicles/` tell each round verdict-first, and the
repo's `chronicles/` tell the system's story — including the seven defects
found by running and the one round that was watched live. Reading them in
date order is the fastest way to learn what the discipline feels like in
practice.

## Why hold them apart

An agent that proposes a change and then checks its own change will pass. Not
because it cheats, but because the check it invents is the check its change
was built to survive. The output is a **mirage**: it passes the author's
probe and fails the real gate.

This harness makes mirages a named verdict instead of a surprise. Its
operational **target** is `I(Y_S ; Y_M | X) = 0` — given the target, what the
prover produces should tell you nothing about what the proposer produces.
Today that is a **routing invariant enforced by prompt topology**: a design
target, not a measured result, and tiered OPEN in `claims_register.md` until
per-seat process mounts enforce it (`THREATS.md`). What *is* closed by
construction is the draw: the proposer cannot grind it, because the seed folds
a secret it never sees.

## The loop

```
  Measure  ──▶  Propose  ──▶  Hold-apart  ──▶  Assay  ──▶  Critic  ──▶  Chronicle
   frontier      soulbae 🧙      the Gap ⿻      soulbis ⚔️    classify      draft
   numbers       N blind          hash the        full gate    structural /   the
   only          lenses           proposal        VALIDATED    probe-limited  record
                 in parallel      → witnesses     MIRAGE       / noise
                                                  BLOCKED
```

Propose → Hold-apart → Assay runs as a pipeline with no barrier: a fast
proposal reaches the gate while a slow one is still being written. The Critic
is the only barrier, because classifying the round needs the whole round.
After **K consecutive dry rounds** (nothing validated *and* structural), the
loop stops rather than grinding.

What the loop does **not** do is fold its own wins. It returns verdicts and
drafts. Folding into the ledgers is the **keystone's** job — soulbae ⊥
soulbis operating as a pair in the main session, with the conformance gate
green before and after. And publishing anything is yours alone.

## Why the corpus stays home

Two agents from different projects share no vocabulary. Different domains,
different ledgers, different lore. They cannot meet inside either corpus,
because each corpus is the private state of its own First Person.

They meet in **the Gap** — and what is in the Gap is not content. It is the
**axioms**: the algebra, the six trusts, the ten ground rules, the seven
seats. Notice that this is already the file layout. `engine/conform.mjs` keeps
its own copy of the axioms and *deliberately does not import them* from the
engine; the source says that is the point. They belong to neither the loop nor
the config, and both are checked against them.

```
Origin(A) ∩ Origin(B) = {the axioms}
```

That is trust T3 — the pair share only their root — lifted one scale. **The
universe expands the mind; the harness is the boundary that lets agents find
each other regardless of universe.** Which is why `universe/` in this repo is
one project's corpus, kept behind a seam, and deletable without breaking a
thing.

## The trusts

The harness carries six constitutional trusts from the Privacy-is-Value model
(PVM V6): the four promises, the separation bound, the shared root,
consent-first invitation semantics, the multiplicative gate, and **the door**.
`TRUSTS.md` states each one and — more usefully — maps each to the exact
place it bites: a required config field, a conformance check, a prompt
topology, or an honestly-labelled manual discipline. Read it before you
change anything. It is the part of this repo you should keep.

## The ledgers

| file | what it is |
|---|---|
| `frontier.json` | the sole authority for numbers. Prose cites it; prose never restates it. |
| `claims_register.md` | every load-bearing claim, with a tier: PROVEN / DERIVED / REPORTED / OPEN / MYTH. |
| `notes/KILLED_LEVERS.md` | negative results, filed as prominently as wins. A killed lever is a fence, not a footnote. |
| `chronicles/` | one file per session, verdict first, ending in a handoff block. A session without a chronicle is unfinished. |
| `SOURCES.md` | trace or delete: nothing is citable unless it resolves to a concrete path. |

Only the keystone writes the first three. Other seats *return* proposed
entries — append-only ledgers do not survive concurrent writers.

## The spar, in detail

A **spar** is a practice bout between the Swordsman and the Mage — every
strike real, nothing at stake but the frontier. It is the first rung of the
**runtime tiers**, each a wider descriptive space for what a bout can be:

| tier | the bout | stakes | existing instance |
|---|---|---|---|
| **the spar** 🤺 | practice, one workshop | its own frontier only | `examples/field-guide/` |
| **the duel** | the formal bout — *reserved* | a result a counterparty will rely on: signed verdicts, minted artefacts exchanged | the formal runtime to come |
| **the arena** 🏟️ | against a live external benchmark, other fighters on the board | a public leaderboard the workshop does not control | shor_mage vs ecdsa.fail |
| **the open world** 🌍 | against a real upstream, in the wild | consequences beyond any ledger | privacy_pools_v2 vs the 0xbow suite; hearthold, when its seat is taken |

The trusts do not change between tiers — the door is the First Person's at
every rung. What changes is who is watching, and what a VALIDATED costs.

(Steps 1, 3, and 4 of the pathway, expanded.) Start with one command. It runs
every gate this repo has, in the order you should trust them:

```bash
node tools/check.mjs
```

It proves the algebra on all of Z/64Z, runs the engine's own tests (an outage
must never be reported as an exhausted search), conforms **every** instance it
discovers rather than the ones it remembers, asserts that the blank template
**fails** — and fails *for the right reasons* — and, if `universe/` is present,
audits it exhaustively. Zero dependencies. If it exits non-zero, every line it
printed is a command you can re-run yourself.

The individual gates, if you want them:

```bash
node engine/conform.mjs                      # the axioms hold
node engine/conform.mjs examples/field-guide # the instance is coherent
node engine/loop.test.mjs                    # the loop fails loudly
```

Then run the example harness. It compresses a 730-word emergency field guide
while a comprehension gate, drawn from the *original*, must stay a full pass.
The original has **32** enumerable facts (F1..F32), so the gate is a **census**
— every one is probed — and the proposer's only winning strategy is to preserve
every fact, which is exactly the pressure you want on a compressor. (A *sample*
of 8/32 would miss a single omission 75% of the time; census is why this
instance refuses `mode: 'sample'`. See `THREATS.md` and D2 in
`HARDENING.md`.)

In Claude Code, invoke the Workflow tool with:

```
scriptPath: examples/field-guide/harness.workflow.mjs
args: { "repo": "<abs path>/examples/field-guide", "root": "<abs path>", "runId": "r4" }
```

`root` is where `GROUND_RULES.md`, `TRUSTS.md`, and `seats/` live — this
repo's clone. Every seat boots from those documents (T3); an instance that
lives elsewhere and doesn't carry its own copies must always pass it.

All writes land in `examples/field-guide/runs/r4/`. Nothing touches the
frontier until you, as keystone, fold it. See
`examples/field-guide/README.md` for what a round looks like and how to run
the mirage drill.

## View a run

```bash
node tools/render_run.mjs examples/field-guide r4     # one run
node tools/render_run.mjs examples/field-guide --all  # every run
```

Writes `runs/<runId>/run.html` — a single static page, no dependencies, no
network — and writes nothing else. The page lays the round out as the
six-phase loop and, per proposal, **re-derives** the sha256 of
`proposal_canon.json` from the file bytes at render time and shows it next to
the seed the Gap recorded (salted runs re-derive `sha256(hSource‖hProposal‖
salt)`; pre-salt runs wear a `legacy-seed` badge). Match means the witnesses
re-derive from the proposal's own saved bytes; mismatch renders as a loud
warning, because witnesses of unknown origin validate nothing (GR-4). The same
audit, fail-closed and offline, is `node tools/verify_run.mjs <instance>
<runId>` — the page just refuses to skip it.

The page is a generated projection, never the record: the run directory is
the record, and a phase that left no artifact renders as "not reached / not
recorded" rather than being papered over (GR-5). Verdicts wear their color —
VALIDATED green, MIRAGE amber, BLOCKED red — and the frontier does not move
here any more than it moves in the loop.

## Build your own harness path

(Steps 6 and 7 of the pathway, expanded.)

1. **Define the Gap first.** If you cannot say how held-out witnesses derive
   from a proposal by hashing, you do not have a harness yet.
2. Name the **objective** (what gets smaller), the **gate** (what must fully
   pass), and the **hard constraint** (validity no score can override).
3. Scaffold it — `node tools/new_instance.mjs ../my-harness my-harness` —
   then fill every TODO in its `harness.config.mjs`. See `SEAT_CONTRACT.md`
   for the interface and the complement-pair pattern for product objectives.
   **The gate and the bundler both refuse a config still wearing its TODOs**,
   and they refuse it in the same words: an unfilled harness runs, grades
   nothing, and reports `VALIDATED`. Measure your baseline before you claim a
   best — the template ships both `null` on purpose.
4. Bundle and run: `node tools/bundle.mjs my/harness.config.mjs my/harness.workflow.mjs`
5. Read `HARNESS_PATHS.md` for ten real instances — quantum circuits, ZK
   constraint systems, research papers, consent agreements, a publishing
   loop — the same skeleton under very different bodies, grouped by how much
   of the loop each one actually runs, plus one seat held open by invitation.
   The partial ones are labelled as partial; they teach the bar better than
   the complete ones do.
6. When it earns it, dress the seats: `SPECIALISATION.md` covers binding
   personas and spells to seats, and the Game of 42 station pattern for
   growing a fleet without drifting.

The lemma travels; the corpus stays home. Your harness path is a config, not
a fork.

## Layout

```
RESEARCH.md        the contribution — the problem, the claim, the evidence, the limits
HOLONS.md          κ-addressed interoperability — the holon contract, and why it is an auditor
TRUSTS.md          the constitution — read first
GROUND_RULES.md    GR-1..GR-10, pasted into every seat at boot
ADOPTION.md        why the duality is topic-free + the mapping procedure
SEAT_CONTRACT.md   what a config provides
SPECIALISATION.md  personas, spells, the Game of 42
HARNESS_PATHS.md   ten real instances + one open seat, and how the fleet syncs
CLAUDE.md          one session, one seat — the boot protocol
SKILL.md           this repo as a Claude Code skill
engine/            the loop, its gate, and loop.test.mjs
seats/             seven cards: the mandate of each seat
templates/         ledgers + a blank config to copy
tools/new_instance.mjs scaffold an instance, and say what is still missing
tools/bundle.mjs   config + engine → one self-contained workflow file
tools/render_run.mjs   one run directory → one static run.html projection
tools/console.mjs  the workshop console — a live, GET-only localhost window
tools/workshop.html    the workshop's front page — the contribution, one static instrument (served at /workshop)
tools/emit_feed.mjs    the runtime feed — a run's produced math (moving ceiling R(t) · ℤ/64ℤ lattice) for /star, game42, spellweb
tools/frontier.html    the frontier widget — an interactive, per-workshop descent, embeddable in the districts
tools/mint_artefact.mjs  seal a validated run into a κ-labelled artefact, at the door
tools/kappa.mjs    the one κ law — content-addressing shared by every producer and verifier
tools/vrc.mjs      relational edges — ed25519 signed κ→κ, signer as did:key (a reference proposes, a signature mints)
tools/holon_audit.mjs  the mesh auditor — re-derive every κ, re-hash every edge, verify every signature (HOLONS.md)
examples/          the runnable spar
universe/          ONE PROJECT'S CORPUS — delete it and nothing breaks
```

That last line is tested, not asserted. Clone the repo, `rm -rf universe`, and
`node engine/conform.mjs`, the spar's gate, and `node engine/loop.test.mjs` all
still pass.

Everything above `universe/` is domain-neutral and always will be. That
directory is the agentprivacy layer: a fleet plan, a cast, an admission rite,
and a harness whose target is the corpus itself. It is kept behind a seam so a
stranger building a compression loop never has to read a word of it.

Apache-2.0. Origin: 0xagentprivacy · the Privacy-is-Value model (PVM V6) ·
agentprivacy.ai
