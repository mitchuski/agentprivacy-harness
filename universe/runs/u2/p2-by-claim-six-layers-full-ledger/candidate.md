# universe/ — the agentprivacy layer

**You can delete this directory and the harness still works.**
`{DERIVED,IMPLEMENTED,protect,TRUSTS.md#T3+repo-root-listing}` Everything
above it — `TRUSTS.md`, `GROUND_RULES.md`, `SEAT_CONTRACT.md`, `engine/`,
`seats/`, `templates/` — is domain-neutral.
`{PROVEN,IMPLEMENTED,reflect,repo-root-listing}` This directory is the
corpus: one universe's specialisation, kept behind a seam so a compression
loop built elsewhere never has to read a word of it.

If you *are* working in this universe, read on — this file is also the boot
file. **The harness is an agentic guide.** An agent that reads `CLAUDE.md`,
its seat card, and this directory knows where the canon lives, what may be
said about it, at what tier, and which doors stay shut.

*Tag legend, read once:* claims below close with one token, fixed order
`{tier,status,pathway,trace}` — tiers `PROVEN|DERIVED|REPORTED|OPEN|MYTH`,
statuses `IMPLEMENTED|SPEC|LORE`, pathways `protect|project|reflect|connect`
(vocabulary per `ADMISSION.md` §2, §6). No internal spaces: one word by
GR-1's counting rule, not four. MYTH never appears past this sentence — this
is a method document (GR-2); myth-tier colour lives in `chronicles/` only.

## What this directory is, and how it stays true

`universe/` is not hand-written prose. It is the artifact of a harness
instance — the universe-builder, `universe/harness.config.mjs` — whose
target is the corpus itself. `{PROVEN,IMPLEMENTED,reflect,harness.config.mjs}`

- **The objective** is a smaller map: fewer words across `universe/*.md`,
  lower-is-better. `{PROVEN,IMPLEMENTED,project,frontier.json#objective}`
- **The Gap** hashes the proposed map and draws comprehension questions from
  the target's own fixed source list, set by the config before the proposer
  runs and never chosen by it.
  `{PROVEN,IMPLEMENTED,reflect,harness.config.mjs#holdApart}`
- **The assay** answers those questions from the map alone and grades
  against the sources; a wrong or unanswerable draw is worth zero (T5).
  `{PROVEN,IMPLEMENTED,reflect,harness.config.mjs#assay}`
- **The hard constraint** is not one label but four: every claim carries a
  `pathway`, a `tier`, a `status`, and a trace that resolves to a concrete
  path, line, or run. `{PROVEN,IMPLEMENTED,protect,ADMISSION.md§6+harness.config.mjs#objective.hardConstraint}`

It is `examples/field-guide` — the toy instance, baselined but not yet
folded — promoted to real work.
`{PROVEN,IMPLEMENTED,reflect,examples/field-guide/frontier.json+claims_register.md}`
**This map is itself unvalidated**: round u1 died to a token limit before
any Gap drew against it, so read every claim below as a candidate the next
round must still earn (GR-5).
`{PROVEN,IMPLEMENTED,protect,frontier.json#runs.u1}`

## The six layers

The universe is not one corpus. It is **six**, and confusing them is the
most common error — a claim true at one layer is false at another.
`{PROVEN,IMPLEMENTED,protect,frontier.json#corpora}` (An earlier draft of
this file said five and silently dropped `cast`; this instance's own
conformance check refuses a frontier enumerating fewer than six.)
`{PROVEN,IMPLEMENTED,protect,harness.config.mjs#conformChecks}`

| layer | holds | authority | where |
|---|---|---|---|
| **canon** | model, maths, conjecture numbers | `papers/v6`; the register for C-ids | `agentprivacy-docs` |
| **substrate** | the shared knowledge graph everything points at | coherence audit, 0 errors | `spellweb` |
| **structure** | vertices, workshops, tomes, an in-lore cast, mana | the grimoire JSON head | `cityofmages`, `game42` |
| **surface** | the rendered sites and their ceremonies | the build; mirrors cite, never edit | `agentprivacy_master`, `agentprivacy.guide`, `soulbis website` |
| **cast** | 42 persona skills and their seat fit | the directory tree, not the stale MAPPING.md counts | `agentprivacy_master/agentprivacy-skills/agentprivacy-skills-v5/persona` |
| **harness** | the loops that produce results | each instance's own `frontier.json` | this repo, and the instances (`tig_zk_loop`, `examples/field-guide`) |

`{PROVEN,IMPLEMENTED,reflect,frontier.json#corpora+six-paths-confirmed-present}`

Two layers use the word **cast** for different things: `structure`'s is the
grimoire's in-lore roster; the `cast` layer's is the 42-skill persona corpus
`SEATS.md` classifies by seat. Same word, two layers — exactly the
confusion this section exists to name.
`{DERIVED,IMPLEMENTED,reflect,cityofmages-grimoire-cast_name-keys+SEATS.md§1}`

**The resolution rule, canon-wide:** when prose and register disagree, the
register wins and the prose gets an erratum; cross-canon disagreements
escalate and are never resolved locally.
`{PROVEN,IMPLEMENTED,protect,ERRATA.md-governing-rule+ADMISSION.md§4.5}`
Mirrors — like the site's conjecture-register mirror — carry the
instruction in their own header: cite, never edit.
`{REPORTED,IMPLEMENTED,protect,agentprivacy_master/src/data/conjecture-register-v6-mirror.json}`

## How work is actually done here

Every working instance in this universe converged on the same shape in
different clothes: the papers pipeline and the ZK workshop independently
earned four of the same rules without borrowing them from each other.
`{REPORTED,IMPLEMENTED,reflect,agentprivacy-docs-pipeline-chronicles/2026-07-09_dual-agent-harness-brief.md}`

1. **One session, one seat, one card.** No agent drifts into another's
   mandate. `{PROVEN,IMPLEMENTED,protect,CLAUDE.md#boot-sequence}`
2. **Shared state has exactly one writer.** Manifests and frontiers are
   single-writer; ledgers are append-only; parallel sessions cannot
   collide. `{PROVEN,IMPLEMENTED,protect,GROUND_RULES.md#GR-10+templates/manifest.yaml}`
3. **A gate ladder ending in a rung no agent may climb.** The papers
   pipeline names it `P4`, `p4_owner: first-person`; the ZK workshop calls
   it `Z4`; this repo calls it **the door** (T6), `g4_owner: first-person`.
   `{REPORTED,IMPLEMENTED,protect,agentprivacy-docs/papers/Programme/pipeline/manifest.yaml+tig_zk_loop/HANDOFF_PRIVACY_POOLS_V2.md:137+templates/manifest.yaml}`
4. **Adversarial review is a seat, and its findings are contracts.** The
   reviewer reads only the artifact — no access to the canon, no goodwill
   toward it — prices findings by severity, rules on what would satisfy it,
   and never edits.
   `{REPORTED,IMPLEMENTED,protect,agentprivacy-docs/papers/Programme/pipeline/roles/A5-adversarial-reviewer.md}`
5. **Interruption means resume, never rebuild.** Verify from disk;
   re-execute a prior verdict rather than trust it.
   `{REPORTED,IMPLEMENTED,reflect,agentprivacy-docs-pipeline-chronicles/2026-07-09_a0-fable-runtime-cycle-four.md}`
6. **Failures are loud, negative results are filed at win-prominence, and a
   floor is only ever asserted by certificate.** A declared floor in the ZK
   workshop was falsified within hours by a further pass, and the
   falsification was filed as prominently as the win it corrected.
   `{PROVEN,IMPLEMENTED,protect,GROUND_RULES.md#GR-6+tig_zk_loop/tigzkp_mage/claims_register.md#CR-10}`

**When it applies:** *the harness transfers to any pipeline where generated
artifacts must survive adversarial scrutiny before a human commits to
them.* Port the rules, rename the roles, keep the hard stop — the gate (T5)
and the door (T6) are what it is *for*.
`{REPORTED,IMPLEMENTED,project,agentprivacy-docs-pipeline-chronicles/2026-07-09_dual-agent-harness-brief.md}`
Promise Theory states the deeper test: the split is warranted when **one
agent would have to promise two things it cannot independently control** —
protection and delegation. One agent that can honestly promise the whole
job needs no pair.
`{REPORTED,SPEC,connect,agentprivacy-docs/archive/canon-backups-2026-07-03/swordsman_mage_whitepaper_v6_3.md}`

## The files here

| file | what it is |
|---|---|
| `universe.json` | machine-readable head — vertices, seats, fleet, admission, provenance, open items |
| `FLEET.md` | which harness lives at which vertex, aligned to `V(π,t)` |
| `SEATS.md` | the 42 personas classified by seat, invariants, one falsified rule |
| `ADMISSION.md` | the rite for adding to the corpus: pathway × tier, and why `det(Σ)` makes it load-bearing |
| `ERRATA.md` | corrections this survey found, filed at win-prominence |
| `harness.config.mjs` | the universe-builder — the loop that produces this directory |

`{PROVEN,IMPLEMENTED,reflect,universe/-directory-listing}`

## What the harness must never do here

- Never invent, renumber, or promote a conjecture; registration is the
  register's, dispositions await the First Person's signature.
  `{PROVEN,IMPLEMENTED,protect,ADMISSION.md§4.4}`
- Never let **MYTH** into a method document — it lives in chronicles (GR-2).
  `{PROVEN,IMPLEMENTED,protect,ADMISSION.md§3}`
- Never treat **🪢 VRC mana as proof.** It is regime-1: non-transferable,
  non-attesting, local colour; the edge is the VRC, and a VRC needs both
  signatures. `{PROVEN,IMPLEMENTED,protect,ERRATA.md#E-3}`
- Never mark, simulate, or summarise the door. Publishing, pinning,
  minting, submitting, and pushing are the First Person's alone (T6).
  `{PROVEN,IMPLEMENTED,protect,GROUND_RULES.md#GR-8}`

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
