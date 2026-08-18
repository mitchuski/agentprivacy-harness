# EVOLUTION — the plan for agentprivacy-harness

*2026-08-17 · the First Person's direction, folded into one plan. Status
labels are honest: DONE is on disk and gated; IN PROGRESS is this working
tree; PROPOSED awaits a ruling or a door.*

## The thesis

The harness becomes a **clear, operational autoresearch engine** with a
strict boundary: **it emits data; it never owns a view.** Every instrument
that renders that data — spellweb.ai, soulbis.com/star, game42, a FedWiki
farm, anyone's BYO interface — is a *consumer*, including the First
Person's own sites. What the harness owns is the math and the contracts:
the algebra, the ledgers, the graph dialect, the lattice seating, and the
trust-graph semantics that let results travel as credentials. Three
invitations sit on top, in order: **run this yourself → improve this
frontier → stand up the same system for your own research.**

## Phase 1 — the data spine *(IN PROGRESS, this tree)*

The harness sheds its renderers. `spellweb.mjs` emits `graph.json` only
(instance mode and `--workshop` mode); `star.mjs` emits `star.v1` only
(vertex ⊥ anchor by the XOR-63 law, results seated at κ mod 64);
`emit_feed.mjs` continues to emit `runtime-feed.v1`. The in-page web.html /
star.html renderers are **deleted, not debugged** — views live with the
consumer. One new document, **`GRAPH.md`**, pins the dialect:

- a **node** is a κ-addressable holon reference `{id, type, label, domain,
  layer, desc}` — domains are the algebra's roles (⚔️ neg · 🧙 bnot · 😊
  door · shared);
- an **edge** `{source, target, type}` is **proposed** by derivation and
  **minted** only by signature — the VRC (`vrc.mjs`: ed25519 over
  (source κ, target κ, relation), signer a `did:key`) is the minted form,
  and its shape is deliberately the shape verifiable-credential /
  personhood-credential specs already speak: issuer, subject, claim;
- the lattice is pure math: ℤ/64ℤ, six axes, anchor = 63 XOR vertex,
  seating = κ mod 64 — geometry and colour, never proof.

The only in-repo viewer that remains is the **console** (`console.mjs` +
`workshop.html` + `frontier.html`) — because its job is not display but
*re-derivation in front of the reader*: run-it-yourself is the interface.
Its salted-seed defect is fixed in this tree (it cried MISMATCH on honest
post-C4 runs; `verify_run.mjs` was always right).

## Phase 2 — the Observe lane *(DONE, this tree)*

Research auto-populates wikis: `wiki_emit` → pages (people) + `graph.json`
/ `star.json` (agents), `wiki_install` → a local farm host, idempotent and
additive; `wiki_proxy` + `WIKI.md` document the tailnet pattern with
hardening first; `examples/wiki-farm/` ships a servable sample federation
(the agentprivacy hub space + the spar's projection). Serving beyond
localhost is the door, every tool says so.

## Phase 3 — the registry pattern *(PROPOSED — the DTG iteration, generalised)*

The DTG ZKP verification registry is the most interesting iteration of the
harness to date, and the plan is to name it as a first-class pattern: **the
harness creates the artifact; a registry distributes the prover's seat.**
Inside the workshop, soulbae proposes and soulbis assays. The registry
turns that dual role *inside-out across organisations*: the workshop's
build mints a pinned digest manifest (the proposer's committed artifact),
and then **anyone** can take the Swordsman's seat — rebuild from the
published path, byte-match the required digests, file a verification run —
with human gates (admission, publication), mandatory agent disclosure, and
the position protocol (ratify / refine / refute) as the contribution
grammar. Runtime verification via the dual roles, at internet scale.

Deliverable: a `registry/` recipe (doc first, scaffold later) any instance
can adopt — pinned manifest + `verify-run` + seats file + gates A–G +
the G.1 proverb rite — so a harness that produces circuits, lexicons, or
documents can open its result to strangers the way the cred-spec lane did.
Entry #14 in `HARNESS_PATHS.md` is the worked proof.

## Phase 4 — contribute or clone *(IN PROGRESS)*

The front of the repo carries the three invitations explicitly:

1. **Run it** — `tools/check.mjs` (every gate), the spar, the console:
   every number re-derives on your machine or it doesn't count.
2. **Improve this frontier** — open targets are published per instance
   (`frontier.json` openTarget); a stranger's VALIDATED round, folded
   through the keystone discipline, moves the work itself. The position
   protocol from Phase 3 is the contribution grammar.
3. **Clone the system** — `new_instance.mjs` (the wizard), `ADOPTION.md`
   (five answers, Gap first), `WORKFLOW.md` (the operator loop, the BYO
   contracts, the small-machine promise), `adventure.mjs` (the front door,
   local state filled in), across the whole register span — most academic
   (the litreview pattern) to most myth (spells and chronicles), many
   tellings, one invariant.

## Phase 5 — trust-graph formation *(PROPOSED, rides the kappa lane)*

Where this points: registries of **verifiable trust community
credentials**, on a path to trust-graph formations — the uor_kappa lane's
stated mission. The harness's contribution is the edge semantics (proposed
vs minted), the κ lineage it shares with UOR, and the honest gaps already
filed (the upstream's DelegationScope is *ahead of* the VRC — a
contribution seam, not a claim). Nothing here moves without maintainer
review upstream and the First Person's door here.

## What leaves, what stays

| leaves the harness | stays in the harness |
|---|---|
| web.html / star.html renderers | the walkers and the emitted **data** (graph.json · star.v1 · runtime-feed.v1 · wiki pages · κ artefacts · VRC edges) |
| visual identity (theme, glyph styling) — lives at spellweb.ai, /star, game42 | `GRAPH.md` — the dialect those instruments consume |
| any claim that geometry is proof | the algebra, the anchor law, the census, the door |

## Doors (named, not performed)

- Commit/push this tree.
- Publishing any registry, serving any farm beyond localhost, City Key
  imports, upstream PRs on the kappa lane.
- Whether the sample federation's hub prose ships as written.

## Success criteria

A stranger with a laptop and Node — no corpus, no accounts, no GPU — can:
(1) re-derive every number this repo claims; (2) file a frontier
improvement that survives a gate they could not choose; (3) stand up the
same system, including its wiki wall and its registry, for their own
research. When all three are one-command true, this plan is done.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
