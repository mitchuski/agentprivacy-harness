# dual-agent-harness

A harness for two agents who are not allowed to collude.

**soulbae 🧙** proposes. **soulbis ⚔️** proves. Between them sits **the Gap
⿻**: the held-out tests are derived by hashing soulbae's own proposal, so
soulbae cannot have tuned to them and soulbis cannot be accused of choosing
them. Above them both is **the First Person 😊** — you — who alone opens the
door to anything outward-facing.

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

## Why hold them apart

An agent that proposes a change and then checks its own change will pass. Not
because it cheats, but because the check it invents is the check its change
was built to survive. The output is a **mirage**: it passes the author's
probe and fails the real gate.

This harness makes mirages a named verdict instead of a surprise. Its
operational invariant is `I(Y_S ; Y_M | X) = 0` — given the target, what the
prover produces tells you nothing about what the proposer produces. Not
"promises not to." Cannot, because the information was never routed there.

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

## Run the toy

```bash
node engine/conform.mjs                      # the axioms hold
node engine/conform.mjs examples/field-guide # the instance is coherent
```

Then run the example harness. It compresses a 730-word emergency field guide
while an 8-question comprehension gate, drawn from the *original* by hashing
the *candidate*, must stay 8/8. The proposer cannot know which 8 of ~40 facts
will be probed, so its only winning strategy is to preserve every fact — which
is exactly the pressure you want on a compressor.

In Claude Code, invoke the Workflow tool with:

```
scriptPath: examples/field-guide/harness.workflow.mjs
args: { "repo": "<abs path>/examples/field-guide", "root": "<abs path>", "runId": "r1" }
```

`root` is where `GROUND_RULES.md`, `TRUSTS.md`, and `seats/` live — this
repo's clone. Every seat boots from those documents (T3); an instance that
lives elsewhere and doesn't carry its own copies must always pass it.

All writes land in `examples/field-guide/runs/r1/`. Nothing touches the
frontier until you, as keystone, fold it. See
`examples/field-guide/README.md` for what a round looks like and how to run
the mirage drill.

## Build your own harness path

1. **Define the Gap first.** If you cannot say how held-out witnesses derive
   from a proposal by hashing, you do not have a harness yet.
2. Name the **objective** (what gets smaller), the **gate** (what must fully
   pass), and the **hard constraint** (validity no score can override).
3. Copy `templates/harness.config.mjs`, fill every TODO — see
   `SEAT_CONTRACT.md` for the interface and the complement-pair pattern for
   product objectives.
4. Bundle and run: `node tools/bundle.mjs my/harness.config.mjs my/harness.workflow.mjs`
5. Read `HARNESS_PATHS.md` for eight real instances — quantum circuits, ZK
   constraint systems, research papers, consent agreements, a publishing
   loop — the same skeleton under very different bodies, grouped by how much
   of the loop each one actually runs. The partial ones are labelled as
   partial; they teach the bar better than the complete ones do.
6. When it earns it, dress the seats: `SPECIALISATION.md` covers binding
   personas and spells to seats, and the Game of 42 station pattern for
   growing a fleet without drifting.

The lemma travels; the corpus stays home. Your harness path is a config, not
a fork.

## Layout

```
TRUSTS.md          the constitution — read first
GROUND_RULES.md    GR-1..GR-10, pasted into every seat at boot
SEAT_CONTRACT.md   what a config provides
SPECIALISATION.md  personas, spells, the Game of 42
HARNESS_PATHS.md   eight real instances, and how the fleet syncs
CLAUDE.md          one session, one seat — the boot protocol
SKILL.md           this repo as a Claude Code skill
engine/            the loop, and the gate that proves its algebra
seats/             seven cards: the mandate of each seat
templates/         ledgers + a blank config to copy
tools/bundle.mjs   config + engine → one self-contained workflow file
examples/          the runnable toy
universe/          ONE PROJECT'S CORPUS — delete it and nothing breaks
```

Everything above `universe/` is domain-neutral and always will be. That
directory is the agentprivacy layer: a fleet plan, a cast, an admission rite,
and a harness whose target is the corpus itself. It is kept behind a seam so a
stranger building a compression loop never has to read a word of it.

Apache-2.0. Origin: 0xagentprivacy · the Privacy-is-Value model (PVM V6) ·
agentprivacy.ai
