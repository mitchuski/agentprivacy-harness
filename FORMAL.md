# Formally verified parts of this repository

Sealed in the κ registry: formal_mage evidence bundle `evidence/2026-10-26_75`, root `sha256:d4d42f9e333323b20d5b649525cbe28f8885fa2cb0cdd10943a04cac3793b9da` (75 theorems, 75/75 within the standard axioms).

Engine behaviour that carries a machine-checked receipt in `formal_mage` (Lean 4, core library, kernel-checked, axiom-audited). `node tools/formal_census.mjs <this repo>` in formal_mage fails if a tag names a theorem outside the audited census. Each Lean statement models the code named beside it; the correspondence is stated in the theorem's doc comment, and where a test pins the code to the model it is named.

| Claim | Code | Status | Tag |
|---|---|---|---|
| The Gap draw's picks are pairwise distinct members of 1..N, for any word stream | `engine/gap.mjs` drawV2 | proved | formal: proved formal_mage:Formal.Gap.pick_nodup · formal: proved formal_mage:Formal.Gap.pick_sub |
| Rejection sampling removes modulo bias: below limit = q·rem each residue occurs q times | `engine/gap.mjs` drawV2 | proved | formal: proved formal_mage:Formal.Gap.residues_uniform · formal: proved formal_mage:Formal.Gap.limit_is_multiple |
| The loop never exceeds maxRounds | `engine/dual_agent_loop.mjs` | proved | formal: proved formal_mage:Formal.Loop.run_rounds_le |
| A dead seat stops the run and is never counted as a dry round; confirmed holds only completed rounds' wins (GR-5) | `engine/dual_agent_loop.mjs` | proved | formal: proved formal_mage:Formal.Loop.run_not_aborted · formal: proved formal_mage:Formal.Loop.run_aborted · formal: proved formal_mage:Formal.Loop.run_confirmed |
| The proposer's view is independent of the salt secret (test: `engine/loop.salt.test.mjs`) | `engine/dual_agent_loop.mjs` ctxFor | proved (model + test) | formal: proved formal_mage:Formal.Harness.noninterference |
| Only propose: labels reach the proposer's provider | `drivers/run.mjs` pair | proved | formal: proved formal_mage:Formal.Harness.routing_by_seat |
| The identity the conformance gate checks, neg ∘ bnot = succ on Z/64 | `engine/conform.mjs` | proved | formal: proved formal_mage:Formal.Lattice.neg_bnot_eq_succ |
