# WORKFLOW — the operator's loop, and the adventures it opens

This is the harness as an **operational autoresearch instrument**: one loop
you can run end to end on a small local machine, six paths that grow out of
it, and a set of stable read surfaces that let you bring your own interface
— your own UX — without ever touching a ledger. `node tools/adventure.mjs`
prints this map from inside the repo, with your local state filled in.

## One machine, one loop

**Requirements:** Node ≥ 18. Nothing else — zero npm dependencies, no
network, no accounts. The multi-agent rounds need *a* model driver, and any
of these works: Claude Code's Workflow tool (the reference), the Agent SDK,
or an Ollama-class **local model** — hh_workshop ran every seat on a local
12B, air-gapped, hashes computed code-side so the seat physically cannot
see the salt (`HARNESS_PATHS.md` §12). A laptop is enough; a Pi serves the
wiki wall.

The loop, end to end:

```bash
node tools/check.mjs                                   # 1 · prove the axioms — every gate
node tools/adventure.mjs                               # 2 · see your paths
node tools/new_instance.mjs ../my-harness my-harness   # 3 · scaffold (the wizard)
#    fill every TODO in harness.config.mjs — ADOPTION.md, five answers, Gap first
node engine/conform.mjs ../my-harness                  # 4 · the gate accepts your config
node tools/bundle.mjs ../my-harness/harness.config.mjs ../my-harness/harness.workflow.mjs
#    run the workflow (your driver) → runs/<runId>/    # 5 · a round: propose ⊥ prove
node tools/render_run.mjs ../my-harness r1             # 6 · audit — every seed re-derived
#    fold as keystone: frontier first, chronicle, conform green again (README step 5)
node tools/mint_artefact.mjs ../my-harness r1          # 7 · seal what survived (κ)
node tools/wiki_install.mjs ../my-harness --farm ~/.wiki   # 8 · observe — the wall updates
```

Step 8 closes the cycle: the round's story is pages a person can fork, a
graph an agent can fetch, and a star seating on the lattice — all derived
from the ledgers, so none of it can drift. Then the loop goes round again:
what the wall shows becomes the next round's measure.

## Choose your adventure

The corpus this harness came from runs the same model at every register,
from formal papers to narrative myth — and the harness carries that whole
span, because the discipline is register-invariant: **many tellings, one
invariant, and a gate that catches them drifting.**

| register | path | what you run |
|---|---|---|
| most academic 🎓 | **autoresearch** — claims that survive an adversary | the litreview pattern: sweep ⊥ refute ⊥ judge, refuters blind to the prover; absence is never novelty; an all-clear run indicts itself (`HARNESS_PATHS.md` §15, `RESEARCH.md`) |
| operational 🤺 | **the spar → your own instance** | the loop above — the wizard, the Gap, the census |
| interop 🔗 | **acceptance & registries** | the DTG pattern: digest-manifest match, human gates, disclosure (§14); the descendant-lane pattern: inherit the constitution whole (§16) |
| federated 🕸️ | **the Observe lane** | `WIKI.md` — wikis auto-populated per instance, `examples/wiki-farm/` in the box |
| geometric ⭐ | **the lattice** | `star.mjs` (vertex ⊥ anchor, results at κ mod 64) · `spellweb.mjs --workshop` · `emit_feed.mjs` → /star, game42 |
| most myth 📖 | **spells & chronicles** | `SPECIALISATION.md` personas and spells; chronicles read in date order — the same truths as the papers, told as story |

## BYO interface, BYO experience

Every surface below is a **stable, derived, read-only projection**. Build
any UI you like against them — a terminal, a game, a gallery, a voice — and
you inherit the discipline for free, because interfaces read projections and
**never write ledgers**. The write path stays what it always was: seats
write runs, the keystone folds, the First Person opens doors.

| surface | shape | derived by | feeds |
|---|---|---|---|
| `frontier.json` | the numbers — sole authority (GR-1) | the keystone, by hand | anything that shows progress |
| `runs/<id>/` | proposal_canon · gap · verdict, per lever | the loop | audit UIs, replays — every seed re-derivable from bytes |
| `graph.json` | node `{id,type,label,domain,layer,desc}` · edge `{source,target,type}` | `spellweb.mjs` | knowledge-graph UIs, agent memory |
| `star.json` (`star.v1`) | vertex ⊥ anchor + results at κ mod 64 | `star.mjs` | lattice UIs, game42, City-Key work |
| `runtime-feed.v1` | moving ceiling R(t) · lattice · κ artefacts | `emit_feed.mjs` | /star instruments, dashboards |
| wiki pages | FedWiki page JSON, slug-bijective | `wiki_emit.mjs` | any FedWiki client; fork-based federation |
| artefact bundles | κ-addressed, evidence hash-manifest, `DOOR.md` | `mint_artefact.mjs` | anything that carries results across a boundary |
| VRC edges | ed25519-signed κ→κ, signer `did:key` | `vrc.mjs` | cross-party trust graphs |

Two rules keep a BYO UI honest: cite numbers from `frontier.json`, never
restate them (GR-1); and render doors as doors — a UI may show the
publish/serve/submit action, never perform it (T6).

## Interoperability — how the work leaves home

- **κ / UOR** — every sealed result is content-addressed by one κ law
  (`tools/kappa.mjs`, `HOLONS.md`). κ's lineage is *from* UOR, so a
  κ-address meets the UOR/kappa-registry substrate as shared lineage — the
  uor_kappa lane (§16) is that meeting, run as research.
- **VRC / credential specs** — *a reference proposes; a signature mints.*
  A signed κ→κ edge with a `did:key` signer is the shape verifiable-
  credential ecosystems already speak; the DTG cred-spec work maps onto it,
  and `did:cid` identity is this layer named for people (hearthold, §11).
- **FedWiki / OASIS** — federation by forking: every page carries its
  journal, every site can fork any page it can reach, and cross-site links
  are explicit references. The OASIS pattern (consented pages spooling to a
  shared federation) rides the same rails — outward legs at the door.
- **Acceptance flows** — when a counterparty must trust a result they
  didn't watch happen: pin a manifest, re-run, byte-match, human-gate the
  admission and the publication, disclose the agent (§14).

## The small-machine promise

Everything in this table runs offline on modest hardware: the engine and
every gate (`check.mjs`), the data projections (`spellweb`, `star`,
`emit_feed` — data only, views live with the consumer; `render_run` — one
static audit page, no CDN), the wiki farm (one Node process; a Raspberry Pi
serves a federation), and the loop itself under a local model driver. The
only thing that ever needs the network is the door — and that is exactly
where a person is standing.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
