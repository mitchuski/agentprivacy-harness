# Maintenance: lever-tally parity in the JS verifier (2026-10-22)

Kind: maintenance (no research verdict). Seat: none; operator-directed Claude Code session working the falcon_mage lane.

## Change

`tools/kappa_evidence.mjs` gains the rule `hashsmash/lever-tally/1`, which mirrors `rule_lever_tally` in `kappa_evidence_mage/verify_bundle.py`. It computes n, the sorted statuses, by_status counts and cpu_s_total rounded to 2 places. Until now the JS verifier failed every lever-ledger bundle with "unknown rule", while the Python verifier recomputed it.

## Verification

- falcon_mage r005 dry bundle (35 levers): Python OK and JS OK, with identical recomputed facts.
- Existing bundles `kappa_evidence_mage/out/ecrank_v0_dry` (7 levers) and `out/pareto_sha256_r64d_w1` (18 levers): JS RESULT OK.
- `node tools/kappa_evidence.test.mjs`: with the edit, 5 of 5 runs pass. Without it, 2 of 5 runs fail.

## Open: pre-existing flaky test

The tamper test at line 91–94 flips one base64 character of the signature, the second-to-last. The test key is fresh on every run, so sometimes that flip lands on bits that don't change the signature, and the "bad signature detected" assertion fails. This happens with or without this change, and the same failure was noted on 2026-10-08. Fix it by flipping a byte of the decoded signature instead. That is left for the repo owner; the test was not edited.
