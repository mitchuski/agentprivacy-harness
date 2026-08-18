# dual-agent-harness — the default distribution

**A verification harness for AI-agent work: one agent proposes, a second
independently proves, and the tests that decide are derived by hashing the
proposal together with a secret the proposer never sees — so it cannot grind
them — and, where the fact set is enumerable, every fact is probed. Config-
driven, zero dependencies, every axiom checked at runtime.**

**soulbae 🧙** proposes. **soulbis ⚔️** proves. Between them sits **the Gap
⿻**: witnesses derived from soulbae's own proposal plus a run secret it
cannot see. Above them both is **the First Person 😊** — you — who alone
opens the door to anything outward-facing.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```

The Swordsman is negation, the Mage is complement, and composed across the
Gap they produce the successor — the step forward. On Z/64Z this is a
theorem, and `engine/conform.mjs` computes it for all sixty-four values
every time it runs.

**This is the DEFAULT distribution: the system alone.** No results, no
chronicles, no fleet — a clean skeleton whose every gate still passes. The
origin repository (github.com/mitchuski/agentprivacy-harness) carries the
worked evidence: an advancing frontier, the defect history, the origin
operator's fleet catalogue (`HARNESS_PATHS.md` there — any reference to it
in these documents resolves upstream), and the chronicles. Here, the first
chronicle is yours to write.

## What you can use it for

The system is a shape, not a topic. Anywhere an agent proposes work and the
check must not be the author's, the same loop fits:

- **Optimization under a hard constraint** — make X smaller, faster, cheaper
  while a gate the proposer cannot tune to stays green.
- **Autoresearch** — claims that survive an adversary: sweep ⊥ refute ⊥
  judge, with absence never reported as novelty.
- **Eval gating for agent work** — a held-out, hash-derived exam for
  AI-proposed changes before a human signs off.
- **Acceptance across organisations** — pin a digest manifest, let strangers
  take the prover's seat, human-gate the admission.
- **Content pipelines** — compress, translate, or re-express under a census
  gate so no fact silently drops.
- **Trust-graph construction** — the design horizon: every sealed result is
  a κ-addressed node, every signed verification or delegation a VRC edge
  (*a derived edge proposes; only a signature mints* — `GRAPH.md`), so a
  running harness accretes a verifiable trust graph as a by-product.

## The pathway

**Requirements:** Node ≥ 18, nothing else. Multi-agent rounds need a seat
driver — Claude Code's Workflow tool is the reference; the engine also
accepts any `rt = { agent, parallel, pipeline, phase, log }` you supply.

1. **Prove the axioms** — `node tools/check.mjs` (every gate; non-zero exit
   prints re-runnable commands).
2. **Read the constitution** — `TRUSTS.md`, then `GROUND_RULES.md`. These
   are the parts you should not change.
3. **Run the spar** — `examples/field-guide/` ships at its measured baseline
   with no folds: a 730-word guide, a 32-fact census gate, and an open
   first target. Your first round is the repo's first result. In Claude
   Code: Workflow tool, `scriptPath: examples/field-guide/harness.workflow.mjs`,
   `args: {repo, root, runId: "r1"}`.
4. **Audit it** — `node tools/verify_run.mjs examples/field-guide r1`
   re-derives every Gap seed from the saved proposal bytes;
   `node tools/render_run.mjs` writes the static audit page;
   `node tools/console.mjs` watches live at `127.0.0.1:4242`.
5. **Fold as keystone** — per `seats/keystone.md`: conform green → fold the
   validated-and-structural lever → frontier first, prose second → file
   your first chronicle → conform green again.
6. **Seal what survived** — `node tools/mint_artefact.mjs` writes a
   κ-labelled artefact bundle with an evidence hash-manifest and a
   `DOOR.md` of the actions software did NOT take.
7. **Scaffold your own** — `node tools/new_instance.mjs ../my-harness
   my-harness`, fill every TODO (the gate and the bundler both refuse a
   config still wearing them). `ADOPTION.md` is the map; **define the Gap
   first**.
8. **Put it on a wall** — `node tools/wiki_install.mjs <instance> --farm
   <dir>` projects your ledgers into forkable wiki pages plus a
   `graph.json` any agent can read (`WIKI.md`).

## The loop

```
  Measure  ──▶  Propose  ──▶  Hold-apart  ──▶  Assay  ──▶  Critic  ──▶  Chronicle
   frontier      soulbae 🧙      the Gap ⿻      soulbis ⚔️    classify      draft
```

The loop returns verdicts and drafts; it never folds its own wins. Folding
is the **keystone's** job, and publishing anything is yours alone (T6).

## The ledgers

| file | what it is |
|---|---|
| `frontier.json` | the sole authority for numbers (GR-1). Prose cites it, never restates it. |
| `claims_register.md` | every load-bearing claim, tiered PROVEN / DERIVED / REPORTED / OPEN / MYTH. |
| `notes/KILLED_LEVERS.md` | negative results, filed as prominently as wins. |
| `chronicles/` | one file per session, verdict first. Empty here — the first entry is yours. |
| `SOURCES.md` | trace or delete: nothing is citable unless it resolves. |

## Layout

```
TRUSTS.md          the constitution — read first
GROUND_RULES.md    GR-1..GR-10, pasted into every seat at boot
AGENTS.md          one session, one seat — the boot protocol (tool-neutral; CLAUDE.md imports it)
ADOPTION.md        why the duality is topic-free + the mapping procedure
SEAT_CONTRACT.md   what a config provides
PRACTICES.md       the 2024–26 field surveyed against this design (receipts in SOURCES.md)
WORKFLOW.md        the operator's loop · BYO-interface contracts
GRAPH.md           the trust-graph dialect — proposed vs minted edges
HOLONS.md          κ-addressed interoperability
THREATS.md         the threat model, honestly tiered
engine/            the loop, its gates, its tests (attacks/ included — run them)
seats/             seven cards: the mandate of each seat
templates/         blank ledgers + a blank config that the gate refuses until filled
tools/             check · conform · bundle · scaffold · verify · console · mint · wiki · κ · VRC
examples/field-guide/   the spar, reset to its baseline — your arena
```

Apache-2.0. Origin: 0xagentprivacy · the Privacy-is-Value model (PVM V6) ·
agentprivacy.ai — the model's mathematics this harness produces live.
