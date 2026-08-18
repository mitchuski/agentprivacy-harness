# GRAPH — the trust-graph dialect

The harness emits graphs; it never renders them. This document pins the
dialect so any consumer — spellweb.ai, soulbis.com/star, game42, a FedWiki
page, your own interface — can speak it, and so the graph's semantics stay
aligned with the algebra and with the credential specs a trust graph must
eventually meet. Emitters: `tools/spellweb.mjs` (`graph.json`),
`tools/star.mjs` (`star.v1`), `tools/emit_feed.mjs` (`runtime-feed.v1`),
`tools/vrc.mjs` (signed edges).

## Nodes

```
{ id, type, label, domain, layer, desc, ...extra }
```

A node is a reference to something the ledgers hold — and anything sealed
is **κ-addressable**: `κ = sha256(canonicalJson(record − κ))`, one law,
computed identically everywhere (`tools/kappa.mjs`, `HOLONS.md`). `domain`
is the algebra's role, not a topic: `swordsman` (⚔️ neg — proves),
`mage` (🧙 bnot — proposes), `first_person` (😊 — the door), `shared`
(the axioms both may touch). `layer` is ring semantics for any consumer
that wants geometry (`core · knowledge · work · record · constitution ·
seats · machinery · paths`). Types are open; the emitted `nodeTypes` array
enumerates what a given graph uses.

## Edges — proposed vs minted

```
{ source, target, type }
```

The load-bearing distinction, from `HOLONS.md` and FLEET §2:

- **A derived edge is a PROPOSAL.** Everything `spellweb.mjs` emits —
  `validated_in`, `through_lens`, `claims`, `chronicles`, `inherits` — is
  walked from content. It re-derives (re-run = re-true) but asserts only
  what the ledgers already record.
- **A signature MINTS.** A relational edge that crosses parties is a
  **VRC**: ed25519 over the exact tuple *(source κ, target κ, relation)*,
  signer a `did:key`. Only the counterparty's signature makes the edge
  real; an unsigned edge is a candidate, and a graph that renders it must
  render it as one.

That shape is deliberately the shape verifiable-credential and
personhood-credential specs already speak — **issuer** (the signer's DID),
**subject** (the source κ), **claim** (the relation to the target κ) — so
a minted edge can travel as a credential without translation. `did:cid`
identity is the same layer named for people (a CID *is* a κ-address), and
the DTG cred-spec / registry work is the acceptance-flow face of it: a
pinned manifest is a committed artifact, a stranger's byte-matched rebuild
is the prover's seat taken from outside, and the registry row is the
minted record. Known honest gap, filed at win-prominence: the
kappa-registry upstream's `DelegationScope` is *ahead of* the VRC — a
contribution seam, not a parity claim.

## The lattice (`star.v1`)

Pure math, no picture: ℤ/64ℤ = {0,1}⁶ over the six sovereignty axes
(MSB-first Protection 32 · Delegation 16 · Memory 8 · Connection 4 ·
Computation 2 · Value 1). A workshop's **vertex** is declared (config
`star: { vertex: N }`) or provisional (sha256(name) mod 64, labelled so);
its **anchor** is never chosen — `anchor = 63 XOR vertex`, the same law
`conform.mjs` checks. Every validated result seats at **κ mod 64**:
content-addressed geometry. All of it is colour and coordinates, **never
proof** (FLEET §6) — importing a seating into a City Key, /star, or
game42 is the First Person's.

## Rules for any consumer

1. Numbers come from `frontier.json`, cited live — never restated (GR-1).
2. Unsigned edges render as candidates; only VRC-signed edges render as
   relations between parties (FLEET §2).
3. Doors render as doors: show the action, never perform it (T6).
4. Re-derive, don't trust: every κ, seed, and signature in these files is
   checkable offline (`verify_run.mjs`, `holon_audit.mjs`) — a consumer
   that displays a checkmark it did not re-derive is decorating, and
   should say so.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
