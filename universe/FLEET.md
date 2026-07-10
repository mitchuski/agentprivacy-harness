# FLEET — where the harnesses live, and why there

A harness is not a project. It is a **pair, attuned to a workshop, gated by a
task it cannot grade itself**. This document says which pairs exist, which
workshops are vacant, what each harness would be *for* in the terms of the
model, and in what order to build them.

Everything here is checkable. Where it is not, it is labelled
**IMPLEMENTED / SPEC / LORE**, and the label is the most important word in the
sentence.

---

## 1 · The arc the fleet serves

The fleet is not a pile of optimizers. It runs one cycle, and each harness is
a station on it. The thing being cycled is the **7th Capital** — private state
made *spendable as proof without being spilled*.

```
   Reclaim  ──▶  Hold  ──▶  Prove  ──▶  Spend  ──▶  Observe ──┐
   myTerms      Hearthold   the rite    the city    the wiki   │
   ⊥ terms      ⊥ vault     ⊥ gate      ⊥ mana      ⊥ pathways │
        ▲                                                      │
        └──────────────────────────────────────────────────────┘
                    what was observed opens the next round
```

1. **Reclaim.** Terms are proffered before exchange — invitation, not attack
   (T4). The First Person and the counterparty each hold an identical
   immutable copy of the bilateral record. What was taken by default returns
   by agreement.
2. **Hold.** The reclaimed state is sealed. The Warden custodies it and can
   *read its own hold* — private, on-device retrieval over the sealed vault,
   no plaintext exposure — while holding no deciding secret.
3. **Prove.** A claim about the vault must survive a gate its author did not
   choose. This is the harness proper. **A validated round proposes an edge;
   it does not mint one.**
4. **Spend.** The residue of what was proven becomes mana across four
   registers. Mana is colour and cost, never proof — see §6, and read it
   twice.
5. **Observe.** The pathways agents actually took — not the ones we planned —
   are chosen and written down, federated as forkable pages. What is observed
   becomes the next round's measurement.

The cycle closes because Observe *is* the measure seat, grown to fleet scale.

---

## 2 · The rule that makes an edge real

> **A validated round proposes an edge. Only the counterparty's signature
> mints it.**

soulbis proves. The First Person opens the door. And the **counterparty
closes it.** An unsigned edge is a candidate, not a result — a `MIRAGE` at the
social layer, and it must be named one.

This is not a new invention; it is the definition already in canon. A **VRC —
Verifiable Relationship Credential — is a bilateral, dual-signed attestation.**
It is the *edge* of the trust graph, whose nodes are lattice vertices. The
Gatehouse states the reason in nine words:

> *A trust that certifies itself is the one you cannot trust.*

Neither token opens anything alone.

**Status: SPEC.** No implemented system mints trust-graph edges today. §7
names the one engineering decision that blocks it, and it is a decision for
the First Person, not a detail for an agent.

---

## 3 · Vertices are addresses, not names

A vertex is a 6-bit word over the sovereignty axes, most-significant first:

| bit | axis | glyph | weight |
|---|---|---|---|
| d₁ | Protection | 🛡️ | 32 |
| d₂ | Delegation | 🤝 | 16 |
| d₃ | Memory | 📜 | 8 |
| d₄ | Connection | 🔗 | 4 |
| d₅ | Computation | ⚡ | 2 |
| d₆ | Value | 💎 | 1 |

So a workshop's vertex **declares which dimensions its work burns**, and
`V63 = 111111` is full sovereignty, `V0` the null blade.

**The anchor law.** A harness anchors a complement pair whose vertices
**XOR to 63** — `bnot` made structural. This is checked, not asserted:
`conform.mjs` fails on `V38 ⊕ V25 ≠ 63`, and the Game of 42's build gate
checks the same pair from an independent copy of the table.

The consequence is strict and useful: **you do not choose a harness's anchor.
Seating it at a vertex determines the anchor.**

### The seated pairs, verified

| pair | XOR | reading |
|---|---|---|
| **V38 ⊥ V25** | 63 | Aletheia (Protect·Connect·Compute) ⊥ Lethe (Delegate·Memory·Value) — unconcealment against forgetting |
| **V35 ⊥ V28** | 63 | Horizon (Protect·Compute·Value) ⊥ **the canonical Mage vertex** (Delegate·Memory·Connect) |
| **V19 ⊥ V44** | 63 | Forget, the commissioned blade ⊥ Chart Shop, the hold-witness — *forgetting against holding* |
| **V51 ⊥ V12** | 63 | Solchanting/Etherchanting (commitment-cut) ⊥ the Circle (a gathering, vacant) |

That the two optimization harnesses draw their support cast from **Horizon
V35 = Protection + Computation + Value** is not decoration. It is the district
whose burnt dimensions *are* a resource-estimation problem.

### The determined vacancies

| workshop | vertex | burns | forced anchor | anchor is |
|---|---|---|---|---|
| **`/hall`** *(no resident mage)* | **V15** | Memory·Connect·Compute·Value | **V48** | Protection + Delegation, exactly |
| `/covenant` | V55 | all but Memory | V8 | Memory alone |
| `/vault` | V57 | Protect·Delegate·Memory·Value | V6 | Connect + Compute |
| `/holon` | V31 | all but Protection | V32 | Protection alone |
| Threshold (`/familiars`,`/portal`,`/staffs`) | V59 | all but Connection | V4 | Connection alone |

**Read `/hall` again.** Its vertex burns the four public dimensions and burns
neither Protection nor Delegation — exactly what a bilateral witness must not
transfer. Its forced anchor V48 is *Protection + Delegation and nothing else*.
**The complement of the witness vertex is the sovereignty it protects.**

`/hall`'s `ceremony_shape` is already `bilateral-witness`. Its
`resident_mage` is already `null`. The rite has a vacant home waiting at
exactly the right address, and we did not put it there.

---

## 4 · The fleet, aligned to the model

`V(π,t)` is a product. Any zero collapses it (T5). So a harness is best
understood by **which factor it defends** — and a fleet is diverse when it
covers factors, not when it covers topics.

| # | harness | defends | vertex / home | gate | status |
|---|---|---|---|---|---|
| 1 | shor_mage | `R(d)` reconstruction cost | Horizon V35 | 9,024 hashed witnesses | **IMPLEMENTED** |
| 2 | tigzkp_mage | `R(d)`, witness-computability | V38 ⊥ V25 | held-out equivalence points | **IMPLEMENTED** |
| 3 | V6 pipeline | `A_h(τ)` fidelity over time | — (papers) | P0–P3, adversarial reviewer | **IMPLEMENTED** |
| 4 | privacy_pools_v2 | `R(d)` on a live target | V38 ⊥ V25 | as #2, + certificates | **IMPLEMENTED** |
| 5 | MyTerms · **Reclaim** | `Φ_agent(Σ)`, T4 | `/covenant` V55 ⊥ V8 | bilateral record | **SPEC** (loop mock-only) |
| 6 | Hearthold · **Hold** | `P`, `A_h(τ)` | `/vault` V57 ⊥ V6 | factor-2 step-up ladder | **IMPLEMENTED upstream** |
| 7 | the rite · **Prove** | **`C`** credential verifiability | **`/hall` V15 ⊥ V48** | trust task + co-signature | **SPEC — blocked, §7** |
| 8 | the city · **Spend** | `T_∫(π)` edge value | `/etherchanting` V51 | *(none — mana is not proof)* | **IMPLEMENTED, regime-1** |
| 9 | fedwiki · **Observe** | `e^{−λt}` freshness | the guide | integrity gate + human | **IMPLEMENTED** |
| 10 | spellweb · coherence | the substrate itself | `/holon` V31 ⊥ V32 | audit triad, 0 errors | **READY — see §5** |
| 11 | **universe-builder** | the map | this directory | held-out corpus comprehension | **IMPLEMENTED here** |
| 12 | the shelf-life harness | **`R(t)`, the moving ceiling** | *(unclaimed)* | re-run old guarantees vs new capability | **PROPOSED** |

**#12 deserves a sentence.** C82 says frontier capability raises
`C_S(t) + C_M(t)` against a *fixed* archive while `H(X)` stays fixed, so
`R(t)` drifts upward and **every static privacy guarantee has a finite shelf
life `t*`.** No harness currently watches that drift. A loop that periodically
re-runs yesterday's guarantees against today's capability is the one instance
the model *demands* and nobody has built. Its objective is not to make a
number smaller — it is to find out when a promise expired.

---

## 5 · The one that is ready today

**spellweb's coherence harness** needs no new mechanism. It already has:

- a **prover**: an audit triad — graph coherence (dangling edges, type-union
  violations, orphans), template drift against the master corpus, and a
  round-trip interop check — all of which must exit 0 before deploy;
- a **hard constraint** already stated in its own architecture: **no
  artefact/deviation node may ever be promoted into the canonical graph.** The
  Sovereign's private layer stays runtime-derived. That is a GR-3 in the wild;
- a **human door**: the admission filter, *"would a Mage from another forge
  benefit from pointing at this node?"*

What it lacks is the Gap. Its objective is **coherence, not score** — so give
it a Gap that hashes a proposed node-set and draws *existing* nodes it must
not break. Build this one first: it is the cheapest proof that the skeleton
carries into a domain with no metric at all.

---

## 6 · Mana is not proof. Read this twice.

The four registers of the City are **landing** (chain-mana, plural),
**entropy** (✨ Arcane ⊥ 🌌 Celestial), **coordination** (🔭 Resonance), and
**relationship** (🪢 VRC).

**🪢 VRC mana is declared regime-1: non-transferable, non-attesting, local
colour.** The specification is blunt — *no surface may describe 🪢 as proof,
stake-weight, or attestation input.* Today it is an integer in local storage,
accrued by the City Key charge loop.

So: **the mana is what you play with. The VRC is what you prove with.** They
share a glyph and nothing else. A fleet that spends mana as though it were
evidence has silently set a factor to zero and will not notice until the
product collapses.

The regime climbs only when witness co-signing (and later, elapsed-time
proofs) back it. Which returns us to §2, and to §7.

---

## 7 · The blocking decision — the First Person's

The rite at `/hall` cannot be built by wiring up what exists, and it is
important to say why rather than to quietly pick a side.

In the ceremony implementation, **the public key persists but the private key
lives only in session storage and is burned on tab close.** The comment in the
code is not an accident; it is the thesis: *the amnesia is the protocol.*
Signing is possible **only during a live ceremony session**. (Relatedly, the
Drake Orb badge is a Phase-1 stub — a non-cryptographic content hash — with
real ed25519 deferred to a later phase.)

Therefore a counterparty co-signature is reachable in exactly two ways:

- **(a) The co-present rite.** Both parties live, in one session, signing
  together. This *is* what a bilateral witness ceremony means, and it costs
  the amnesia protocol nothing. It cannot be done asynchronously.
- **(b) Key custody.** Persist a signing key beyond the session. This buys
  asynchronous attestation and **trades directly against the amnesia
  protocol** — the one term whose security C86 conjectures is *independent of
  time*.

**(a) preserves the thesis. (b) sells it for convenience.** The harness will
not choose. It stops in front of this door and names it, which is the only
thing a harness is ever allowed to do with a door (T6, GR-8).

---

## 8 · Build order

1. **spellweb coherence harness** (§5) — ready; proves the skeleton in a
   metric-free domain.
2. **The universe-builder** (`universe/harness.config.mjs`) — already here;
   run it, and let this directory be its output rather than my prose.
3. **The shelf-life harness** (#12) — the instance the model demands.
4. **The rite at `/hall` V15** — *after* §7 is decided by the First Person,
   and not before.
5. Fold MyTerms' loop off the mock bus (#5), then Hearthold (#6).

Nothing in this list is a push, a pin, a mint, or a submission. Those are
doors, and they are all yours.

---

## 9 · What the fleet may never do

- Mint an edge without both signatures (§2).
- Spend 🪢 as proof (§6).
- Seat a harness at a vertex without its forced anchor (§3).
- Promote a conjecture, renumber a C-id, or resolve a canon conflict locally.
- Mark, simulate, or summarise a door (T6).

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
