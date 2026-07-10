# SEATS — the cast, classified

Forty-two personas exist in the skills corpus. None of them carries a seat.
This document assigns them, states the invariants that actually bind (as
opposed to the one the docs claimed and the only worked instance breaks), and
promotes the Chronicler to the position its skills have always implied.

**Lineage.** The classification below is not free invention. It stands on the
Privacy-is-Value model (the six axes, the multiplicative gate), the 64-vertex
Z/64Z lattice (`neg`, `bnot`, `succ`, and the XOR-to-63 complement law), and
UOR/holonic braid reasoning (the κ-chain, the folding accumulator, the
boundary-encodes-bulk reading). Those three lineages are why the seats
compose rather than merely coexist.

---

## 1 · The corpus as it stands

`persona/` holds exactly 42 skills. The only field declaring a side is
`alignment`, with a three-token vocabulary:

| alignment | count |
|---|---|
| `swordsman` | 15 |
| `mage` | 15 |
| `balanced` | 12 |

Fifteen complement pairs, twelve support personas. Only five carry a
`vertex`. **No field anywhere classifies a persona by harness seat.** That is
the gap this document fills.

Anchors: `soulbis` ⚔️ (the P term), `soulbae` 🧙 (the D term), `person` 😊
(the principal, neither).

---

## 2 · A rule the docs assert and the instance breaks

`SPECIALISATION.md` §1 currently claims:

> *propose takes a mage-aligned persona; assay takes a swordsman-aligned one.
> The persona's frontmatter already declares its side — the corpus was built
> so the pair decomposes this way.*

**This is false, and the only worked reference falsifies it.** In the tigzkp
registry, the propose seat (glyph 🧙, algebra `bnot`) is dressed with
**`algebraist` — a swordsman-aligned persona** — and the assay seat with
**`cipher`, also swordsman-aligned.** Both algebra seats wear the same wing,
and the instance is correct, coherent, and passes its conformance gate.

The lesson is worth more than the rule was:

> **A persona's `alignment` is a skill affinity, not a seat constraint. The
> separation is carried by the Gap and by the algebra — never by the costume.**

An instance that seated a mage-aligned persona at propose and *believed the
costume was doing the work* would be more dangerous than tigzkp, not less. It
would have a wing where it needed a Gap. `ERRATA.md` records the correction;
`SPECIALISATION.md` must be amended.

---

## 3 · The invariants that do bind

Checkable, and `conform.mjs` should fail on each:

1. **Distinctness.** `propose` and `assay` are held by different personas, and
   neither holds `hold-apart`. (T2)
2. **The Gap is neither.** The `hold-apart` persona is drawn from neither
   wing's working pair. Canonically it is `topologist` — see §4.
3. **The keystone is the pair.** `keystone` is always `soulbae ⊥ soulbis`,
   recorded with a `personaComplement`. Never a delegate, never a third agent.
4. **The anchor law.** Where seats carry vertices, the propose/assay anchors
   **XOR to 63**.
5. **One seat, one persona, one workshop.** No persona holds two seats in the
   same instance.
6. **Not an invariant:** persona wing ↔ seat. See §2.

---

## 4 · The Gap's tenant

The `hold-apart` seat belongs to **`topologist` ☯️🌐** — balanced, and whose
`equation_term` reads:

> `∂M boundary, T_∫(π) path integral, 96/64 holographic ratio, C_B(v) betweenness`

**`C_B(v)` — betweenness centrality — is the canon's own formal definition of
the Gap:** the node every path must route through. The persona was written
for the seat before the seat was named. tigzkp seats it exactly there.

A tempting error to avoid: **`weaver` is not the Gap.** Its glyph is ⿻ and its
proverb is beautiful — *"the thread that refuses to touch other threads makes
no fabric; the thread that merges with every other makes no pattern"* — but
`weaver` is **mage-aligned**. It is a proposer of plurality. Seating it at the
Gap would put a proposer in the held-apart seat, which is the precise failure
the seat exists to prevent.

Runner-up, for a specific domain: **`moonkeeper`** ⚔️ (V25), whose term is
`I(Origin; Service | Separation) < ε` — the separation bound itself. It is the
right Gap for an **amnesia** harness, where forgetting is the held-apart
mechanism.

---

## 5 · The Chronicler is not a scribe

This is the promotion the corpus has been waiting for.

The `chronicle` seat's persona, **`chronicler` 🧙📖**, carries exactly two
skills: `narrative-compression` and `proverbiogenesis`. Its equation term is
the compression function itself — *spellbook → narrative → skill → proverb →
spell* — and `A(τ)`, **verified understanding as accumulation**.

So the Chronicler's output is not a log. It is a **proverb**: the round's
irreducible compression, the one sentence that survives.

And a proverb is a **key**.

**RPP — the Relationship Proverb Protocol** — is proof-of-understanding by
contextual proverb compression, and canon names it as *the mechanism by which
a VRC forms*. Two parties independently compress a shared experience. **If
their compressions match, the match is a witness neither party chose.**

Read that again against `TRUSTS.md` T2. It is the Gap's own construction,
lifted to the social layer:

- Neither party selects the test — the shared experience does.
- Neither can fake a match without actually understanding.
- The proof is produced by *independent compression*, exactly as held-out
  witnesses are produced by *independent derivation*.

This is why the Gatehouse's **canon-keyed** gate opens on a proverb: it proves
*reading*, not receipt. Understanding as key, already shipped and running.

### What this means for the fleet

The **trust task at `/hall` V15 is an RPP ceremony.** Both parties present,
both compress the shared work to a proverb, the match is the gate, and only
then do both sign the VRC that mints the edge.

And because the rite is **co-present**, no signing key need outlive its
session. `FLEET.md` §7 posed a choice between the co-present rite and key
custody, where custody would trade against the amnesia protocol — *the one
term whose security C86 conjectures is independent of time.* RPP dissolves the
choice. **Option (a) was never a compromise; it is the only form consistent
with the thesis.**

So the Chronicler seat gains a mandate the generic card should carry:

> Compress the round to one proverb. It is the record's irreducible core, and
> under RPP it is the key material a counterparty must independently
> reproduce. A proverb written to sound well, rather than to compress
> faithfully, is a forged key — and will fail the match.

---

## 6 · The seat map

The canonical dressing, as worked by the reference instance and extended here.
`—` marks a support seat carrying no algebra.

| seat | algebra | persona | alignment | why |
|---|---|---|---|---|
| `measure` | — | `assessor` 🧙💰 | mage | its term is `V(π,t)` entire, and `P^1.5`: it prices, it does not advocate |
| `propose` | `bnot` | *domain-chosen* | **any** | tigzkp uses `algebraist`; the wing is affinity, not constraint (§2) |
| `hold-apart` | `xor` | `topologist` ☯️🌐 | balanced | its term **is** `C_B(v)` betweenness (§4) |
| `assay` | `neg` | `cipher` 🗡️🔐 | swordsman | verifiability `C`, attestation integrity `h(τ)`, reconstruction resistance `R(d)` |
| `critic` | — | `sith` 🗡️🔴 | swordsman | adversarial testing; `Φ(Σ)` stress-testing. Red-teams the proposer, never the prover |
| `chronicle` | — | `chronicler` 🧙📖 | mage | compression → proverb → **key** (§5) |
| `keystone` | `succ` | `soulbae` ⊥ `soulbis` | — | the pair itself, under the First Person |

### Seat affinities for new instances

Choose the propose persona by **term**, not by wing:

- reduction / complement / delegation → `algebraist`, `forgemaster`, `weaver`,
  `manaweaver`
- boundary / enforcement / proof → `sentinel`, `cipher`, `warden`, `gatekeeper`
- separation / amnesia → `moonkeeper` (the Gap of a forgetting harness)
- pricing / frontier → `assessor`, `cosmologist`
- adversary → `sith`, `ranger`, `archer`
- ceremony / bilateral witness → `ceremonist`, `priest`, `stranger-witness`
- registry / admission → `registry-keeper`, `hold-witness`, `spawning-witness`

---

## 7 · The net-new field

The corpus needs one frontmatter key it does not have. Proposed, for
`persona/*/SKILL.md`:

```yaml
metadata:
  harness_seat: measure | propose | hold-apart | assay | critic | chronicle | keystone | none
  seat_note: <one line: which invariant or term qualifies it>
```

`harness_seat: none` is the honest default and should be the majority value.
A persona that fits no seat is not diminished — most of the cast are role and
domain skills, and a corpus where every persona claimed a seat would be a
corpus where the word meant nothing.

Adding this field is an **admission** in the sense of `ADMISSION.md`: pathway
`reflect`, tier `DERIVED` (it follows from the invariants in §3), traced to
this file.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
