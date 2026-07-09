# Harness paths — where this skeleton went

Three working instances specialised this harness. None of their code lives
here; this is the map, so you can see what a filled config looks like at full
weight before building your own. Each began as a skeleton like this one and
diverged only through its config, its seat cards, and its gate.

## 1 · shor_mage — quantum resource estimation

*(private instance of the author — a single-file harness,
`swordsman_mage_pqc.mjs`, against a live competitive benchmark)*

Reduces the cost of the secp256k1 point-addition circuit a Shor-style attack
would run, against the ecdsa.fail benchmark. The objective is a genuine
**product** — average executed Toffoli gates × peak qubits — so soulbae runs
as a complement pair (gate-minimiser ⊥ qubit-minimiser) and soulbis carries a
cliff-watcher that rejects any move winning one factor at the other's
expense. The Gap is a GPU island search reseeded by Fiat-Shamir; the gate is
a held-out set of 9,024 witnesses hashed from the candidate's own operation
stream, so the proposer provably could not have tuned to them. This instance
is where the complement pair and the cliff-watcher were invented, and where
`MIRAGE` got its name: a candidate that passes the cheap probe and fails the
full validation.

## 2 · tigzkp_mage — ZK circuit constraint reduction

*(private instance of the author — a full workshop directory with its own
canon, gate ladder, and chronicles)*

Reduces the surviving R1CS constraint count of a zero-knowledge privacy-pool
withdrawal circuit. The hard constraint is **witness-computability**: a
constraint system whose witness cannot be computed by forward propagation is
not a result at any count — the purest instance of GR-3, and the reason GR-3
exists. This instance is the origin of `GROUND_RULES.md`, of `conform.mjs`
and its independent-axiom-copy idiom, of the gate ladder, of scratch-copy
discipline, and of the killed-levers bar (seven K-ids, filed as prominently
as the wins). It also carries the fullest specialisation: seven seats dressed
with personas and seated on the Game of 42 compute axis — see
`SPECIALISATION.md`.

## 3 · The V6 rehydration pipeline — research autoresearch

*(private instance of the author — a fourteen-role document pipeline inside a
research corpus)*

Takes a formal research corpus and rehydrates it into artifacts for different
audiences (academic, policy, standards, grants, public, developer) without
drifting from the canon. Fourteen roles rather than seven seats, because the
domain is documents and not numbers, but the topology is identical: a
manifest that only the orchestrator writes, an append-only critique ledger,
one chronicle per session, and an adversarial reviewer with no goodwill who
never sees the canon. This instance is the origin of the claim tiers (GR-2),
of trace-or-delete (GR-9), of the "proposer never approves its own proposal"
rule, and of the non-delegable human completion read that became **the
door** (T6).

---

**What travels and what stays.** Read these three and you will notice the
same skeleton under three unrecognisably different bodies: an objective, a
hard constraint, a gate the proposer cannot choose, a ledger only one seat
writes, and a door only a person opens. The lemma travels; the corpus stays
home. Your harness path is a config, not a fork.
