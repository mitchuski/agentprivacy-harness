# universe/ — the agentprivacy layer

**You can delete this directory and the harness still works.** Everything
above it — `TRUSTS.md`, `GROUND_RULES.md`, `SEAT_CONTRACT.md`, `engine/`,
`seats/`, `templates/` — is domain-neutral and always will be. The lemma
travels; the corpus stays home. This directory is the corpus: one universe's
worth of specialisation, kept behind a seam so a stranger building a
compression loop never has to read a word of it.

If you *are* working in this universe, read on. This is the map, and it is
also the boot file: **the harness is an agentic guide.** An agent that reads
`CLAUDE.md`, its seat card, and this directory knows where the canon lives,
what may be said about it, at what tier, and which doors it must not open.

## What this directory is, and how it stays true

`universe/` is not hand-written prose. It is the **artifact of a harness
auditor** — `universe/audit.mjs` — and of the discovery passes that feed it.
It is *not* the output of a harness, and the story of why is worth more than
the map.

The corpus is too large to hold. Its detail is not secret; it is *hidden by
volume*. A hand-written map of it would drift, flatter, and quietly invent —
so it must be checked. The question is **how**.

**The Gap earns its cost only where the claim space is too large to check.**
shor_mage draws 9,024 witnesses because you cannot run every input; tigzkp
draws held-out points because you cannot enumerate R1CS equivalence. Sampling
is a *necessity*, and hashing the proposal is what makes the sample honest.

This map makes on the order of a hundred claims, and every one is enumerable.
So `audit.mjs` checks **all** of them. Against an exhaustive check a mirage is
impossible — there is nothing to tune to. A cartographer cannot flatter a
script that reads every line.

We learned this the expensive way. Rounds `u1` and `u2` ran the corpus through
a real dual-agent harness, cost about 1.4M tokens, and produced **no evidence
about the map at all**: `u1` died of infrastructure, `u2` of a gate no
candidate could pass. Both failures were symptoms of forcing the shape. The
repo's own applicability test had said so all along — *the harness transfers to
any pipeline where generated artifacts must survive **adversarial** scrutiny* —
and an auditor that reads every claim is not an adversary. It is an **integrity
gate**, exactly as `HARNESS_PATHS.md` classifies the substrate and the
publishing loop.

So the universe layer has three jobs, and only the first two are ours:

- **Discovery** — what is in the corpus that the map does not know about? No
  gate; it proposes, and the First Person ticks. (The dream cycle's shape.)
- **Audit** — does every claim resolve, at the tier it declares? Deterministic,
  exhaustive, seconds, `node universe/audit.mjs`. It catches the anchor law, a
  dropped corpus layer, an unfenced myth, a stale frontier, an unresolved
  trace, a killed lever with no re-open condition.
- **A harness** — only if a real metric appears under a constraint you genuinely
  cannot check exhaustively, facing a proposer who could tune to your check.
  The map has none. `retired/` holds the loop that assumed otherwise.

`audit.mjs` is the hard constraint made runnable: every claim carries an honest
**IMPLEMENTED / SPEC / LORE** label and traces to a concrete path. A beautiful
sentence with no path is deleted, not softened (GR-9).

## The six layers

The universe is not one corpus. It is six, and confusing them is the most
common error — a claim true at one layer is false at another. The count is not
decorative: `frontier.json` enumerates the corpora, and `audit.mjs` fails if
this table drops one. It did, once — `cast` was missing, and the loop that was
supposed to find it scored zero while a nine-line check found it instantly.

| layer | what it holds | authority | where |
|---|---|---|---|
| **canon** | the model, the maths, the conjecture numbers | `papers/v6/` for maths; the **register** for C-ids | `agentprivacy-docs` |
| **substrate** | the shared knowledge graph everything points at | coherence audit (0 errors) | `spellweb` |
| **structure** | vertices, workshops, tomes, cast, mana | the grimoire JSONs | `cityofmages`, `game42` |
| **surface** | the rendered sites and their ceremonies | the build; mirrors never edit | `agentprivacy_master`, the guide, soulbis |
| **cast** | the 42 personas, their spells and proverbs | the directory tree, not the stale mapping counts | `agentprivacy-skills` |
| **harness** | the loops that produce results | `conform.mjs` + the gate ladder | this repo, and the instances |

**The resolution rule, canon-wide:** *when prose and register disagree, the
register wins and the prose gets an erratum.* Cross-canon disagreements are
escalated, never resolved locally. Mirrors — like the site's
`conjecture-register-v6-mirror.json` — carry the instruction in their own
header: *cite, never edit.*

## How work is actually done here

Every working instance in this universe converged on the same shape, in
different clothes. That convergence is the evidence the template carries, and
it is stated plainly in the canon: **two domains, one discipline, convergent
rules.** The papers pipeline and the circuit workshop independently earned
four of the same rules without borrowing them from each other.

The shape:

1. **One session, one seat, one card.** No agent drifts into another's
   mandate. The separation is the design.
2. **Shared state has exactly one writer.** Manifests and frontiers are
   single-writer; ledgers are append-only. Parallel sessions cannot collide.
3. **A gate ladder ending in a rung no agent may climb.** The papers pipeline
   names it `P4` and marks it `p4_owner: first-person`. The ZK workshop calls
   it `Z4`. This repo calls it **the door** (T6). *"The manifest is the map.
   The ledger is the memory. The gates are the walls. P4 is the door only you
   hold."*
4. **Adversarial review is a seat, and its findings are contracts.** The
   reviewer reads only the artifact — *no access to the canon, and no goodwill
   towards it* — prices findings by severity, and rules on what would satisfy
   it. It never edits.
5. **Interruption means resume, never rebuild.** Verify from disk; re-execute
   a prior verdict rather than trusting it.
6. **Failures are loud, negative results are filed at win-prominence,** and a
   floor is only ever asserted by certificate. A declared floor in the ZK
   workshop was falsified within hours by a further pass — and the
   falsification was filed as prominently as a win. That is the discipline
   working, not failing.

**When does this architecture apply?** The canon's answer is the sharpest
sentence in the corpus: *the harness transfers to any pipeline where generated
artifacts must survive adversarial scrutiny before a human commits to them.*
Port the rules, rename the roles, **keep the hard stop.** A domain with no
adversarial gate and no non-delegable outward action gains little — the gate
(T5) and the door (T6) are what the architecture is *for*.

The deeper test, from Promise Theory: the split is warranted when **a single
agent would have to promise two things it cannot independently control** —
protection *and* delegation. If one agent can honestly promise the whole job,
you do not need the pair.

## The files here

| file | what it is |
|---|---|
| `universe.json` | the machine-readable head — vertices, seats, fleet, admission conditions, provenance, open items |
| `FLEET.md` | the plan: which harness lives at which vertex, aligned to the terms of V(π,t) |
| `SEATS.md` | all 42 personas classified by seat, with the real invariants (and one falsified rule) |
| `ADMISSION.md` | the rite for adding to the corpus: pathway × tier, and why `det(Σ)` makes it load-bearing |
| `ERRATA.md` | corrections this survey found in the canon and in the instances |
| `harness.config.mjs` | the universe-builder — the loop that produces this directory |

## What the harness must never do here

- Never invent, renumber, or promote a conjecture. Registration is the
  register's, and its dispositions await the First Person's signature.
- Never let **MYTH** into a method document. It lives in chronicles (GR-2).
  `ADMISSION.md` explains why this is a mathematical constraint and not a
  matter of taste.
- Never treat **🪢 VRC mana as proof.** It is regime-1: non-transferable,
  non-attesting, local colour — an integer in local storage. The edge is the
  VRC, and a VRC needs both signatures.
- Never mark, simulate, or summarise the door. Publishing, pinning, minting,
  submitting, and pushing are the First Person's alone (T6).

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
