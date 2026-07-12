# HOLONS — κ-addressed interoperability, and why it is an auditor

This is the plan and the contract for the holon layer: how the results this
harness produces become **interoperable, verifiable units** that other systems
— the model instruments, the graph, `hologram-technologies` — can each speak,
carry, and check without trusting anyone.

It is written to the repo's own standard. In particular it makes, up front, the
call that `ADOPTION.md` demands: **is this a harness or an auditor?** — and
answers *auditor*, with the reason.

## What a holon is

A **holon** is a whole that is also a part: a self-contained record that can
stand alone *and* compose into a larger mesh. Here, a holon is any object that
carries a **κ-label**:

```
κ = "sha256:" + sha256( canonicalJson( object with the κ field removed ) )
```

where `canonicalJson` is JSON with recursively sorted keys and no whitespace.
This is the City Key / sigil **Law L5** convention, unchanged: *a κ-label is
never trusted, only re-derived.* The label is excluded from its own preimage so
the object can carry its own address.

The harness already mints holons. Every one of these is a κ-addressed holon
today:

- an **artefact** (`artefact.v1`) — a sealed, evidence-bearing result;
- a **runtime feed** (`runtime-feed.v1`) — a workshop's produced math;
- anything else a producer stamps with `kappaOf(...)` from `tools/kappa.mjs`.

`tools/kappa.mjs` is the single reference implementation of the κ law. It is a
**shared primitive**, not a redundant auditor: content-addressing requires that
every producer compute the *identical* κ, so the mint, the feed, the console,
and the auditor all import one function. (This is the opposite of the
independent-copy idiom used for *gate* logic, where divergence is a feature —
there, two auditors catch each other; here, two κ functions would just break
addressing. The independent check for κ lives in the test layer and in the
language-agnostic spec, which has been cross-derived in a second language.)

## Edges: how holons compose

A holon references another **by κ**. Two kinds of edge:

- **Content edges** — a hash reference to bytes. An artefact's
  `evidenceManifest` is exactly this: each entry maps a path to the sha256 of
  its bytes. A content edge is *verified by re-hashing*; it needs no signature,
  because the content is its own witness.
- **Relational edges (VRC)** — a κ→κ reference between holons, possibly across
  parties. Governed by the edge rule already in `universe/`:

  > *A validated round proposes an edge. Only the counterparty's signature mints
  > it.* An unsigned edge is a candidate, not a result — a mirage at the social
  > layer.

A relational edge is verified in two deterministic steps: both κ endpoints
re-derive, and the signature (when present) checks. Both are facts, not
judgements — which is the whole point of the next section.

## The call: this layer is an AUDITOR, not a harness

`ADOPTION.md` step 0: *count your claims.* If everything a thing asserts can be
enumerated and checked exhaustively, write an auditor and stop — you get
certainty for zero adversarial cost. Reach for a harness only when the claim
space is too large to check and generated candidates must survive *adversarial*
scrutiny.

A holon's **interoperability claims are all enumerable**:

- does its κ re-derive from its bytes? — one hash.
- do its content edges resolve and re-hash? — one hash each.
- do its relational edges' endpoints re-derive and signatures check? — bounded.

There is nothing to *tune to*: you cannot craft a holon whose κ re-derives to a
value it does not have. So the mesh verifier is a deterministic, agent-free
**auditor** — `tools/holon_audit.mjs` — exactly as `universe/audit.mjs` is. A
harness here would spend real tokens sampling a space you can check in full for
free; it is the universe-builder mistake, and this document exists partly to not
repeat it.

**Where the harness still lives:** a holon's *substantive* claim — "this
circuit is 40% smaller and still correct", "this guide lost no fact" — is large
and adversarial, and *that* is verified by the harness that **minted** the
holon. So the division is clean and total:

> **the harness mints the holons; the auditor verifies the mesh.**

## `tools/holon_audit.mjs` — the mesh auditor

```
node tools/holon_audit.mjs <dir>
```

Walks a directory for holon records, and for each one deterministically:

1. **κ integrity** — re-derives `kappaOf(holon)` and asserts it equals the
   stored κ. A mismatch is a tampered or mis-addressed holon; the run fails.
2. **content edges** — for every `evidenceManifest` entry, resolves the file
   and re-hashes it, asserting the bytes still carry the recorded hash.
3. **relational edges** — for every κ→κ reference, asserts the target κ is
   present in the mesh (or flagged external) and re-derives; reports signed
   (minted) vs unsigned (proposed) per the edge rule.

It prints `HOLON AUDIT PASS` with a census, or names every corpse and exits
non-zero. Zero dependencies, zero agents. `tools/check.mjs` runs it over every
instance that has minted holons, so the whole shipped mesh is re-verified in one
command.

## The path to `hologram-technologies`

The site is the *application* and a separate property (its door is yours). It
does not need a copy of the harness — it needs the **contract**: this file, plus
`tools/kappa.mjs` and `tools/holon_audit.mjs`, vendored or imported. A holon
minted here re-derives there byte-for-byte, because both compute one κ. That is
the interoperability, and it is why the primitives stay in one repo while the
sites multiply.

## Order of work

**Done — the κ law is baked into the runtime:**

1. `tools/kappa.mjs` — the single κ primitive. The mint, feed, and console all
   import it; the three drifting copies are gone, and the refactor kept every
   existing κ byte-identical.
2. `tools/holon_audit.mjs` — the mesh auditor. Wired into `check.mjs` over every
   instance's minted holons and pinned by a tamper test (flip one evidence byte,
   the mesh no longer re-derives).
3. **κ as state, first cut** — the runtime feed self-addresses: `buildFeed`
   stamps `κ = kappaOf(feed)`, so a state snapshot is a verifiable holon. And
   the universe head carries a `holon_layer` section (`universe/universe.json`),
   so the corpus knows κ is the interoperability substrate.
4. This spec.

**Next — κ as the *whole* runtime state, and across the corpus:**

5. **Every runtime object a holon.** `frontier.json`, each `verdict`, each
   `gap` gains its own κ, so an entire run is a mesh of content-addressed holons
   the auditor verifies end to end. Because `kappa.mjs` lives in the shared core,
   this reaches **every instance — lexon, the pools, hearthold — the moment it
   re-bundles**: one κ, computed the same everywhere, as the state.
6. **Relational edges with real signatures** (the VRC) — so cross-party holon
   interop is verifiable, not just single-party integrity. This is the substrate
   `hologram-technologies` seats on.
7. **Map the layer across the corpus** — a κ / holon node and edges in the
   spellweb graph, a reference in the docs, and the skill, so the corpus speaks
   one content-addressing law. (Cross-repo; the First Person's door.)

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
