# ERRATA — corrections this survey found

Filed at win-prominence, per GR-6. Each entry names what is wrong, where, what
is right, and what evidence settles it. None of these is fixed by this
document; a correction to a canon document is that document's to make, and a
conjecture's status is the register's alone.

**The governing rule:** *when prose and register disagree, the register wins
and the prose gets an erratum.* This file is the erratum.

---

## E-1 · C82 and C83 are mis-cited in the instances

**Where:** `shor_mage` chronicles and harness prose; propagated informally
into working memory elsewhere.

**The claim as made:** "C82 = the dual-agent ceiling `R(t) = (C_S+C_M)/H(X) < 1`"
and "C83 = non-collusion `I(Y_S;Y_M|X) = 0`."

**Both are wrong.** Per the register:

- The reconstruction ceiling `R_max = (C_S + C_M)/H(X) < 1` is a **theorem,
  proven-conditional** — not a conjecture. Its home is the formal
  specification's ceiling section, together with the Fano error floor
  `P_e ≥ 1 − R_max`.
- Non-collusion `I(Y_S;Y_M|X) = 0` is **Precondition 1** of that theorem, not
  a numbered conjecture. (Precondition 2 is the fixed adversary model.)
- **The real C82** is *The Moving Ceiling*: frontier capability growth raises
  `C_S(t)+C_M(t)` against a fixed archive without raising `H(X)`, so `R(t)`
  drifts upward and **every static reconstruction guarantee has a finite shelf
  life `t*`**. The drift is coupled to frontier capability, not to any action
  of the subject.
- **The real C83** is *Compositional Leakage Amplification*: policy-only
  separation compounds toward `(2^N − 1)ε` with chain depth, while amnesia
  separation breaks the Markov chain and caps at `Nε` — exponential to linear.

**Why it matters beyond pedantry.** Citing the ceiling as a conjecture
understates it (it is proven, conditionally). Citing non-collusion as a
conjecture *overstates* it — it is an assumption the architecture must *earn*,
which is exactly the Gap's job. An instance that thinks non-collusion is a
conjecture may forget it is a precondition it is responsible for maintaining.

**Fix:** re-point ceiling citations to the formal spec's theorem; reserve C82
for the drift claim. This licenses harness #12 in `FLEET.md` — nothing watches
the drift today.

---

## E-2 · `mage.mesh` is absent from canon **on purpose** — and this entry was itself wrong

**Filed as a reversal, at the prominence of a win (GR-6).**

**What I first wrote here:** that a full-corpus search returns zero hits for
`mage.mesh`, therefore the name was drift, therefore my memory of it was an
error to correct.

**The search result was right. Every inference from it was wrong.**

`mage.mesh` is absent from canon because the First Person **refused to
canonise it**, explicitly, at design time:

> *Don't make `mage.mesh` canon; a fixed universal name is the kind of
> "completeness" Gödel warns against.* One good name **per instance, not a
> global canon.** Each shared model names itself; the namespace stays open,
> plural, federated — the myTerms move. `mage.mesh` was only ever the example
> for the first box.

So the zero hits are not an absence. They are **the presence of a decision.**
An unnamed thing and a deliberately-unnamed thing look identical to `grep`,
and only one of them is a gap.

**Why this matters more than the fact it corrects.** The LAN ceremony is not a
vague intent, as I claimed. It is a **worked design of the trust task**, with
the ladder `FLEET.md` reconstructs from first principles already in it:
consent-first offer (the agent *offers* its address; it is never scanned) → a
gateway page → **understanding begins** → the doors open → the seal → and then
graduated, host-scoped write access brokered so the agent never sees the raw
credential. Its governing sentence is the one this repo keeps rediscovering:

> *Access is earned by understanding, not credential.*

Its lintel is the Gatehouse's, and it is Gödel-grounded rather than
decorative: no sufficiently rich system is both complete and consistent, so
**trust always waits on a witness from beyond the system that holds it.** That
is `TRUSTS.md` T2 stated as a limitative theorem, and it is the deepest reason
the Gap cannot be a sentence appended to a prompt.

**The correction to the correction.** The LAN ceremony rite: tier **OPEN**
(design worked, unimplemented), status **SPEC**. `mage.mesh`: not a name at
all — a **deliberately non-canonical example**, and the refusal to fix it is
itself a canonical act.

**What it teaches.** A survey that treats silence as ignorance will overwrite
a decision with a default. Before filing an absence as drift, ask whether
someone chose it. I did not, and the entry above is what that costs.

---

## E-3 · 🪢 VRC mana is not proof, and the fleet must not spend it as such

**Where:** a recurring temptation rather than a single document.

**Canon is explicit.** 🪢 VRC presence mana is **regime 1: non-transferable,
non-attesting, local colour**, and *no surface may describe 🪢 as proof,
stake-weight, or attestation input.* Its implementation is an integer in local
storage, accrued by the City Key charge loop.

**The distinction to hold:** the **mana** is what you play with; the **VRC**
is what you prove with. They share a glyph and nothing else. The regime climbs
only when witness co-signing — and later, elapsed-time proofs — back it.

**Not an erratum against the code, which is correct.** An erratum against
every future plan that would treat accrual as attestation.

---

## E-4 · `SPECIALISATION.md` asserts a seat/wing rule the instance breaks

**Where:** `SPECIALISATION.md` §1: *"propose takes a mage-aligned persona;
assay takes a swordsman-aligned one … the corpus was built so the pair
decomposes this way."*

**Finding:** in the tigzkp registry, propose is dressed with `algebraist`
(swordsman-aligned) and assay with `cipher` (swordsman-aligned). Both algebra
seats wear the same wing; the instance is coherent and its gate passes.

**The correct statement:** a persona's `alignment` is a **skill affinity**,
not a seat constraint. The separation is carried by the Gap and the algebra,
never by the costume. See `SEATS.md` §2 — an instance that trusts the costume
has a wing where it needs a Gap.

**Fix:** amend `SPECIALISATION.md`. Done in this pass.

---

## E-5 · The register head, and a stale README

**Where:** `agentprivacy-docs` root README says the conjecture register head
is **C89**; the register, the pipeline manifest, and the checks all say
**C96 · next free C97**.

**Finding:** the skew is known and was reconciled through the pipeline's own
ledger. The register wins by its own rule. The README is stale prose, not a
competing authority.

**Recorded, not fixed** — this is the docs corpus's erratum to make. It is
noted here because a harness reading the README would boot with a wrong head
and might "helpfully" renumber something. **No seat may invent, renumber, or
promote a conjecture** (GR-1 of that pipeline; §4 of `ADMISSION.md`).

---

## E-6 · The `signDrakeOrbIntoCard` signature is a Phase-1 stub

**Where:** the ceremony library's storage module.

**Finding:** the Drake Orb badge's `signature` is produced by a
non-cryptographic 32-bit content hash (`DRAKE-XXXX`), with an in-code comment
that real ed25519 arrives in a later phase. The private key is deliberately
session-only and burned on tab close.

**Why it belongs here:** the badge reads like an attestation and is not one
yet. Any trust-task design that assumes a signable, persistent identity across
sessions is assuming something the code explicitly does not provide — and
`SEATS.md` §5 shows the co-present RPP rite makes that assumption unnecessary.

**Tier:** IMPLEMENTED (as a hash), SPEC (as a signature). Both labels are
required; either alone misleads.

---

## E-7 · The 64-blades reference sheet prints the pre-lock seating

**Where:** the 64-blades reference sheet in the swordsman-blade repo.

**Finding, two faults in one place:**

1. It seats **Aletheia at Blade 25 and Lethe at Blade 38.** The v10.4.0 lock
   (2026-06-09) **inverted this**: canonically **Aletheia = V38, Lethe = V25**.
   The blades repo's own `blades/README.md` carries the reseat erratum and says
   *the lock governs*; the site's archive page agrees; the tigzkp registry
   anchors Aletheia at V38. The sheet is stale.
2. It labels **V25 as Protection + Connection + Computation.** That is V38's
   bit pattern. `25 = 011001` = **Delegation + Memory + Value**;
   `38 = 100110` = **Protection + Connection + Computation**. The dimensions
   were carried across with the names when the seating flipped.

**Why it matters.** `V38 ⊕ V25 = 63` either way, so the *anchor law survives
the error* — which is exactly how a wrong sheet can sit undetected next to a
passing gate. The XOR check cannot catch a transposition; only the bit-to-axis
reading can. Any harness that reads dimensions off the sheet will attribute
its work to the wrong sovereignty axes.

**Fix:** the sheet is that repo's to correct. Recorded here because
`FLEET.md` §3 derives workshop meaning from bit patterns, and a reader
comparing the two would otherwise trust the wrong one.

**Tier:** the lock is PROVEN (it is the canonical head); the sheet is a stale
REPORTED source.

---

## E-8 · `keys_to`, `synced_with`, and `artefact_class` — vocabulary that does not exist where expected

**Finding:** three symbols used in planning prose do not exist in the code
they describe.

- The City Key does **not** carry `keys_to` / `synced_with` fields. The real
  mechanism is the v1 JSON schema plus same-origin mirroring over a
  `BroadcastChannel`. (Those two names come from **spellweb's edge-type
  vocabulary** — they are graph edges *about* the key, not fields *in* it.)
- `artefact_class` is a **workshop-template frontmatter field**, not a symbol
  in the blades or spellweb code. There, the artefact layer is the
  `forgedBlades` deviation inventory in local storage.

**Why it belongs here:** both are cases of a name being true at one layer and
absent at another — precisely the five-layer confusion `universe/README.md`
warns about. Neither is a bug. Both would become bugs the moment a plan
assumed the field was there to read.

---

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
