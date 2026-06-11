# Binding personas and skills to the seats

*The harness engine is generic; the **crew** is what you swap. This maps the
`agentprivacy-skills/` catalog onto the three seats so you can plug a purpose-fit team in.*

The skills plugin ships **8 swordsman / 7 mage / 7 balanced** personas plus role skills. A harness
seats one proposer (Mage), one prover (Swordsman), and a Gap mechanism — and attaches role skills
that load the domain knowledge each seat needs.

## 🧙 Mage seat — the proposer (conceal / reduce)

Pick a persona whose discipline is *reduction / concealment / construction*, and attach the
reduction skills for your domain.

| Use when the reduction is… | Persona | Attach role skills |
|---|---|---|
| algebraic (re-express paid ops as free) | `persona/agentprivacy-algebraist` | `role/agentprivacy-separation-enforcement` |
| cryptographic concealment | `persona/agentprivacy-cipher` | `role/agentprivacy-selective-disclosure`, `role/agentprivacy-metadata-resistance` |
| structural / topological | `persona/agentprivacy-topologist` | domain skill |
| weaving many sub-parts | `persona/agentprivacy-weaver` | domain skill |

The Mage is always bound by the **held-apart rule** (`I(Y_S;Y_M|X)=0`): it must never see or tune
to the witnesses. State this in the config's `heldApartRule`.

## ⚔️ Swordsman seat — the prover (sign / commit / refute)

Pick a persona whose discipline is *verification / adversarial proof / signing*, and attach the
gate + domain-durability skills.

| Use when the proof is… | Persona | Attach role skills |
|---|---|---|
| an un-tuneable held-out gate | `persona/agentprivacy-witness` or `agentprivacy-quantum-sentinel` | `meta/agentprivacy-horizon-gate` (always) |
| adversarial red-team | `persona/agentprivacy-sith` | `role/agentprivacy-threat-adversarial` |
| boundary / separation defence | `persona/agentprivacy-sentinel`, `agentprivacy-gatekeeper` | `role/agentprivacy-separation-enforcement` |
| cryptographic durability | `persona/agentprivacy-quantum-sentinel` | `role/agentprivacy-cryptographic-durability`, `role/agentprivacy-quantum-defence` |

The Swordsman **always** loads `meta/agentprivacy-horizon-gate` — the held-out-gate discipline is
its core competency.

## ⿻ the Gap — the held-out mechanism

Not a persona; a *mechanism*. Bind it to the strongest un-tuneable gate your domain offers, and the
skill that governs separation:

- always: `role/agentprivacy-separation-enforcement` (keeps `det(Σ) ≠ 0`).
- the gate itself: domain-specific (for circuits, the Fiat-Shamir 9,024; for proofs, a held-out
  property set hashed from the artifact; for systems, an adversarial test the proposer never sees).

## The method skill ties it together

Every harness loads `meta/agentprivacy-dual-agent-harness` (the operational loop) and
`persona/agentprivacy-architect` (the harness designer ☯️🤖 — *"the system that trusts its agents to
behave has already delegated sovereignty to hope"*, the argument for the gate over trust).

## Worked seating — `ecdsafail-pqc`

| Seat | Persona | Skills |
|---|---|---|
| 🧙 Mage | `agentprivacy-algebraist` | `separation-enforcement`, the V6 `neg(bnot)=succ` algebra |
| ⚔️ Swordsman | `agentprivacy-quantum-sentinel` | `horizon-gate`, `cryptographic-durability`, `quantum-defence` |
| ⿻ Gap | (mechanism) | `separation-enforcement` + the Fiat-Shamir 9,024 |
| design | `agentprivacy-architect` | `meta/agentprivacy-dual-agent-harness` |

See `../../shor-mage/`.
