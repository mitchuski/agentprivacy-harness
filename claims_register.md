# Claims register — the harness itself

The load-bearing claims the README and RESEARCH.md rest on, on two axes: a
**tier** (epistemic strength) and an **enforced by** (mechanism). See
`templates/claims_register.md` for the definitions. `tools/check_claims.mjs`
gates this file: **a PROVEN or DERIVED claim enforced only by `prompt`,
`manual`, or `nothing` is a hard failure.** That rule is why several rows below
are tiered OPEN rather than asserted — they are design targets whose
enforcement has not landed yet, and saying so is the point (a claim is worth
what it can be re-run to show).

Enforcement written `now → later, post-Cx` is read by the checker at its
*current* (pre-arrow) value. C-commits refer to `HARDENING_PLAN.md`.

| id | claim | tier | enforced by | evidence | status |
|---|---|---|---|---|---|
| CR-H1 | `neg(bnot(x)) = succ(x)` on all of ℤ/64ℤ | PROVEN | code | `engine/conform.mjs`, every run, all 64 values | accepted |
| CR-H2 | The Gap's seed and draw are a deterministic function re-derivable from saved bytes | PROVEN | code | `engine/gap.mjs` + `gap.test.mjs`; reproduces the recorded r4 draw byte-for-byte | accepted (C0) |
| CR-H3 | A resubmitting proposer cannot tune the draw to a fact it dropped (grinding) | PROVEN | protocol | the salt `seed = sha256(hSource‖hProposal‖salt)`, salt derived from a run secret the proposer never sees; `attacks/grind.mjs` → grinding gains ≈0pp; `loop.salt.test.mjs` | accepted (C2) |
| CR-H4 | The pure-JS SHA-256 in `gap.mjs` equals `node:crypto` (no drift) | PROVEN | code | `gap.test.mjs` cross-check incl. the FIPS "abc" vector + 12 inputs | accepted (C2) |
| CR-H5 | Census over an enumerable witness bank is strictly stronger than any sample of it | DERIVED | code | hypergeometric: `attacks/omit_one.mjs` measures 75.8% escape for a single omission at n=8/N=32 vs 0% under census | accepted; enforced once the field-guide gate is census → post-C4 |
| CR-H6 | A tampered `proposal_canon.json` (edited after the draw) is caught, not trusted | PROVEN | code | `tools/render_run.mjs` re-derives sha256(canon)=hProposal and voids on mismatch; verified on a crafted run | accepted (C2); consolidated into `verify_run` → post-C5 |
| CR-H7 | A VALIDATED result preserves every fact of the source | OPEN | sample → census, post-C4 | today the field-guide gate samples 8/32 (detection at one omission ≈ 0.25); the two census-closed folds (526, 472) do establish it, the sampled fold (573) does not | OPEN — settled per-fold by census (C4) |
| CR-H8 | The proposer's context excludes the witness draw: `I(Y_S ; Y_M \| X) = 0` | OPEN | prompt (design target) | a routing invariant asserted by seat cards; unmeasured, and the runtime shares a filesystem/model | OPEN — settled by process mounts (C6, D3 tier-2) |
| CR-H9 | The pair share only the axioms (seats do not leak across the Gap) | OPEN | prompt → runtime, post-C6 | seat cards restrict reads; not enforced by the runtime yet | OPEN — settled by per-seat mounts + read logs (C6) |
| CR-H10 | Same-model seat pairs reduce defect detection vs cross-model (Φ_inference) | OPEN | nothing | the reference runtime runs both seats as one model (Φ_inference = 0 by the PVM); a testable, pre-registered prediction | OPEN — settled by the cross-model delta run (C6) |
| CR-H11 | No outward action without the First Person (the door, T6) | REPORTED | manual | honest human discipline, labelled as such; `mint_artefact.mjs`'s `DOOR.md` lists what software did not do | accepted — deliberately not dressed as a technical control |
| CR-H12 | An `enforced-by` column detects overclaim before external review does | DERIVED | code | this gate (`check_claims.mjs`); flipping CR-H8/H9 back to DERIVED makes it fail | accepted (C3) |
