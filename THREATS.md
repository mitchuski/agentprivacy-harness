# THREATS.md — what this harness does and does not defend

A stranger deciding whether to trust the harness for their problem needs to
know its threat model. Its absence is why an external reviewer (OBS-HARNESS-01)
had to reverse-engineer one. This is that document, kept honest against what
the code actually enforces. `claims_register.md` grades each defence; the
red-team board (`node tools/check.mjs --red`) exercises it.

## The one-line scope

The harness establishes that **a candidate preserves its source under a check
the proposer could not have tuned**. It does **not** establish that the source
is correct. Garbage in, faithfully-preserved garbage out — see the last row.

## The table

| threat | defended? | mechanism | tier / enforced by |
|---|---|---|---|
| Honest proposer, honest mistake | **yes** | the gate — and for an enumerable bank, a **census** that probes every fact | code (C4) |
| Proposer grinds hash variants to dodge the draw | **yes** | the **salt**: `seed = sha256(hSource‖hProposal‖salt)`, salt derived from a run secret the proposer never sees — grinding gains ≈0pp (`attacks/grind.mjs`) | protocol (C2) |
| Proposer drops one fact, no grinding | **yes** (small bank) | **census** probes every fact; a sample would miss it 75% of the time at n=8/N=32 | code (C4) |
| Proposer re-proposes after seeing a draw | **yes** (census) | census leaves nothing to dodge; a sample gate would not survive resubmission | code (C4) + retry ledger (partial) |
| Gap writes a canon that is not the proposal | **yes** | `verify_run` re-hashes the saved canon; sha256(canon) ≠ hProposal → UNVERIFIABLE | code (C5) |
| Gap reports a valid hash but the wrong draw | **yes** | `verify_run` replays `draw(seed,N)` and demands a match | code (C5) |
| An artefact/canon edited after the assay | **yes** | `verify_run` + `render_run` re-derivation void it (one byte moves the hash) | code (C5) |
| Operator overclaims a verdict | **yes** | the `enforced-by` column + `check_claims.mjs`: a PROVEN/DERIVED claim enforced only by prompt/manual/nothing hard-fails | code (C3) |
| Proposer and prover share priors (same model) | **legible, not closed** | Φ_inference = 0 is recorded and warned (`conform.mjs`); the measured detection delta needs a cross-model run | measured — pending (C6, CR-H10) |
| Proposer seat reads the witness bank | **not closed** | seat cards ask it not to (prompt only); the runtime shares a filesystem. Real fix = per-seat process mounts + read logs | runtime — pending (C6, D3 tier-2) |
| A malicious referee (Gap) grinds the salt | **not closed at the spar** | option A trusts the referee. Closed only by the duel's commit-reveal (B): no single party draws the seed | protocol — the duel tier |
| Answer the probed questions, be globally wrong (`sample_hugger`) | **no — known limit** | a gate on any finite check has this residue; documented, not hidden | — |
| The source itself is wrong | **out of scope** | the harness preserves the source; it does not verify it | — say so |

## The three separations, not conflated (D3)

- **protocol separation** — influence impossible by construction. The D1 salt
  is this: breaking it means breaking sha256. The strongest thing in the repo.
- **process separation** — access denied by the runtime (a mount, a sandbox).
  **Not yet built.** The proposer/prover isolation is currently prompt-level.
- **prompt separation** — information omitted from a context window. What the
  seat cards do. A jailbreak, an accidental paste, or a shared model defeats it.

`I(Y_S ; Y_M | X) = 0` is a claim about a **channel**. Today it is a routing
invariant enforced by prompt topology — a design target, not a measured result.
It is tiered OPEN in `claims_register.md` until process mounts (C6) close it.

## What would change each "pending" to "yes"

- **same-model priors** → run the spar with a cross-model (and then
  cross-provider) prover and record the detection delta. Pre-registered
  prediction: the cross-model prover catches defects the same-model one missed
  (CR-H10). If it does not, that is a real result and gets filed at
  win-prominence in `notes/KILLED_LEVERS.md`.
- **witness-bank peek** → per-seat process with a role-specific read-only
  mount; the proposer's mount excludes `witnesses/`, `gap/`, and the salt;
  `verify_run` fails closed on a read-log touching a path outside the mount.
- **malicious referee** → the duel tier's two-party commit-reveal seed.
