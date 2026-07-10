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
instance** — the universe-builder (`universe/harness.config.mjs`) — whose
target is the corpus itself.

That matters because the corpus is too large to hold. Its detail is not
secret; it is *hidden by volume*. A hand-written map of it would drift,
flatter, and quietly invent. So the map is produced under the same discipline
as every other result here:

- **The objective** is to make the map *smaller*. A map nobody can hold is not
  a map.
- **The Gap** hashes the proposed map and uses the digest to draw facts from
  the **original corpus** as comprehension questions. The cartographer cannot
  know which facts will be probed, so the only winning strategy is to preserve
  every load-bearing one.
- **The assay** answers those questions *from the map alone* and grades
  against the corpus. A fabricated claim fails a question drawn from the real
  thing. This is why `universe/` cannot hallucinate lore: the gate is drawn
  from what exists, not from what reads well.
- **The hard constraint** is that every claim carries an honest
  **IMPLEMENTED / SPEC / LORE** label and traces to a concrete path. A
  beautiful sentence with no path is deleted, not softened (GR-9).

**It is not the field-guide toy promoted to real work**, and saying so cost a
round. The toy compresses a document *into itself*: every fact the Gap can
draw lives in the original, so `candidate ⊆ facts(original)` and 8/8 is
reachable. This map is ~1% the size of its sources. Draw an arbitrary fact
from them — a licence string, a JSON `version` field — and no compression can
answer it; only a transcript can, and the objective forbids one.

So the Gap here is bounded by a **scope contract** (`mustAnswer` in
`harness.config.mjs`): the config declares which *classes* of fact the map is
responsible for, the Gap still chooses *which ones* by hashing the proposal,
and the proposer sees neither. Round u2 is why. See
`chronicles/2026-07-10_u2_mis-gated.md`.

## The five layers

The universe is not one corpus. It is five, and confusing them is the most
common error — a claim true at one layer is false at another.

| layer | what it holds | authority | where |
|---|---|---|---|
| **canon** | the model, the maths, the conjecture numbers | `papers/v6/` for maths; the **register** for C-ids | `agentprivacy-docs` |
| **substrate** | the shared knowledge graph everything points at | coherence audit (0 errors) | `spellweb` |
| **structure** | vertices, workshops, tomes, cast, mana | the grimoire JSONs | `cityofmages`, `game42` |
| **surface** | the rendered sites and their ceremonies | the build; mirrors never edit | `agentprivacy_master`, the guide, soulbis |
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
