---
date: 2026-07-13
seat: keystone (soulbae 🧙 ⊥ soulbis ⚔️)
scope: the holon layer — κ as state, the mesh auditor, and the VRC; and the recognition that content-addressed identity is this layer named for people
verdict: The harness gained a content-addressing spine — one κ law, a mesh auditor, self-addressing state, and signed relational edges — and with it the recognition that the House of Archon's identity runtime is not a future build but this layer turned on identity. ALL 7 GATES PASS.
commits: 3dfa322 · 230100f · b07a90e · 0792874 · 1e67d1f
---

# The holon layer, and the edge a signature mints

**Verdict first.** The harness now content-addresses its own work end to end.
A validated result seals into a **κ-addressed holon**; the runtime feed
**self-addresses**; a **mesh auditor** re-derives every κ and re-hashes every
content edge; and a **signed relational edge** (the VRC) crosses parties with a
real ed25519 `did:key`. One κ law, computed identically everywhere, is the
substrate. And the turn that mattered most was not a line of code but a
recognition: **content-addressed identity — `did:cid`, agent identity,
delegation — is this layer, named for people.** The House of Archon's runtime
is not something to build next; it is what was built.

## What was built

- **`tools/kappa.mjs`** — the one κ law: `κ = sha256(canonicalJson(record − κ))`,
  the City Key / sigil Law L5. The mint, the feed, and the console all import it;
  the three drifting copies are gone. Content-addressing needs *one* identical
  function — two would not catch each other, they would break addressing.
- **`tools/holon_audit.mjs`** — the mesh auditor. Re-derive every κ, re-hash
  every content edge, verify every signed relational edge. Enumerable and
  deterministic, so it is an **auditor, not a harness** (`HOLONS.md` makes that
  call in the open — the universe-builder's lesson, paid once, not repeated).
- **κ as state** — the runtime feed stamps its own κ, so a state snapshot is a
  verifiable holon; the universe head carries a `holon_layer` section; every
  minted artefact re-derives under `check.mjs`.
- **`tools/vrc.mjs`** — the relational edge a signature mints. Real ed25519
  (`node:crypto`, still zero dependencies) over the exact tuple *(source κ,
  target κ, relation)*; the signer a proper `did:key:z6Mk…` (multicodec +
  base58btc, interoperable with the DID ecosystem); keys ephemeral by design.
  The auditor **mints** a valid signature, **proposes** an unsigned edge,
  **fails** a forged one.
- **`agentprivacy-docs/specs/KAPPA_HOLON_INTEROP_SPEC_v1.md`** — the contract, in
  the docs register, so `hologram-technologies` and the corpus can vendor one κ.

## The recognition, at win-prominence

Three claims that turned out truer than they were first written:

- **"A harness for interoperability of κ-holons."** No — verifying a
  content-addressed mesh is enumerable, so it is an **auditor**, not a harness.
  Naming that correctly is what kept the layer honest, and it is the
  universe-builder's lesson applied without paying its cost again.
- **"`did:cid` is a nice future application."** No — a `did:cid` CID *is* a
  κ-address; a delegation between agents *is* a signed relational edge; an
  identity document *is* a holon. The identity runtime is not adjacent to the
  holon layer, it **is** the holon layer. The House of Archon slot stopped being
  "a compressor for hearthold's features" and became what it always was.
- **"Edges belong inside the holon."** No — relations are not identity. A
  holon's `edges` field is excluded from its own κ, or signing an edge whose
  source is this holon's κ would change that very κ. Identity is content;
  relation is what accrues around it.

## The seating, clarified

Three things wore the name *hearthold* at colliding addresses; they are now
distinct. The **upstream** (`github.com/Flaxscrip/hearthold`, v0.11.0, shipped)
is real and built. The **Curatrix Vault** at `/vault` V57 burns Value, because a
vault holds. The **hearthold harness** is V60, because it burns Connection — a
`did:cid` resolves outward, a public handle to a private root. Different bit,
different vertex, no collision; both may hold a mage. `hearthold_mage` is now its
own repo (`github.com/mitchuski/hearthold_mage`), LF-clean from the first commit
so the content-addressing survives a clone — the invitation to the House of
Archon is a place they can fork.

## The tell that keeps recurring

Every layer here was proven the same way the loop proves a fold: by trying to
break it. A flipped canon byte reads MISMATCH; a tampered evidence file fails
the content-edge check; a moved edge target or a forged signature fails the VRC.
Eighteen tests, each about a lie the system must not be able to tell. The
architecture's claim — *never trusted, only re-derived* — is not asserted at any
layer; it is re-run.

## Handoff

**Open**
- **Inward:** OT-4 (below 472 on the field-guide spar — diminishing returns, low
  value now). The richer inward move — a first hearthold objective — is not the
  keystone's to make; it awaits the House of Archon's acceptance (T4).
- **The corpus reflection:** a hearthold page already lives in agentprivacy_master's
  keep; the holon/κ layer wants a line there and on `/model` (the First Person's
  door; the harness stays off master).

**Blocked**
- Nothing.

**Single next action**
- None urgent — the layer is complete and gated. When the House of Archon
  accepts, the first `did:cid` resolution-integrity Gap turns this substrate into
  a running identity harness.

*A result seals with the same κ that addresses its state and names its
delegations. One value, one law, and no one can forge their way onto it.*

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
