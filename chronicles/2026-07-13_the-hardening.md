---
date: 2026-07-13
seat: keystone
runId: r5
verdict: the review's four load-bearing defects are closed in code, verified, and validated on a live salted-census spar — best 440 (candidate, not folded)
---

# 2026-07-13 — the hardening (response to OBS-HARNESS-01)

## Verdict

An external review (OBS-HARNESS-01), triaged in `HARDENING.md`, found that the
harness claimed more than it enforced — most sharply the README's word
**provably**, which a grinding proposer falsifies. Over one session the seven
commits of `HARDENING_PLAN.md` (C0–C7) closed every load-bearing defect,
turned the false claims true or honestly OPEN, and were **validated end-to-end
on a live run**: r5 ran the hardened salted-census pipeline through 27 real
agents, returned 4 VALIDATED / 2 MIRAGE / 0 BLOCKED, and every proposal
re-derives offline (`node tools/verify_run.mjs examples/field-guide r5` → RUN
VERIFIED). `node tools/check.mjs` → 11 gates; `--red` → GREEN.

The frontier did **not** move. The runtime returned candidates; folding is the
keystone's. Best candidate: **440** words (`strip-markup-dashes-and-filler`),
below the standing best of 472 in `frontier.json`, at a full 32/32 census.

## What happened

- **C0 — the Gap became code.** `engine/gap.mjs` (canonicalize→hash→seed→draw),
  proven faithful: it reproduces the recorded r4 draw byte-for-byte.
- **C1 — a red-team board.** `engine/attacks/` + `check.mjs --red`. `grind` won
  in one try against the live mechanism; `omit_one` escaped 75.8% (≈ the 75.0%
  hypergeometric prediction at N=32).
- **C2 — D1 salt.** The seed folds a run secret the proposer never sees, so
  grinding is void. Because the Workflow sandbox has neither `node:crypto` nor
  `TextEncoder` (both learned by a live crash), `gap.mjs` carries a hand-rolled
  SHA-256 + UTF-8 encoder, cross-checked against `node:crypto` and guarded by a
  test. `grind` → blocked.
- **C3 — the enforced-by axis.** A second column on the claims register and
  `check_claims.mjs`: a PROVEN/DERIVED claim enforced only by prompt/manual/
  nothing hard-fails. It catches the isolation overclaim on demand.
- **C4 — census.** The field guide's N=32 bank is enumerable, so the gate probes
  every fact; `conform.mjs` refuses `sample` at N ≤ threshold. Verdicts carry a
  coverage stanza (detection printed next to the verdict).
- **C5 — one verifier.** `verify_run.mjs`: offline, zero-LLM, fail-closed;
  re-derives the whole chain and re-verifies the entire history. Wired into
  `check.mjs`.
- **C6 — Φ_inference.** `conform.mjs` stamps same-model seat pairs; the loop
  records the model pair. (Process mounts and the measured cross-model delta
  remain OPEN — the honest tier-2 work.)
- **C7 — the language.** `THREATS.md`; "provably" dropped; `I(Y_S;Y_M|X)=0`
  recast as a routing target, OPEN until mounts enforce it; the GR-1 "~40" →
  32 number bug fixed.
- **The live spar (r5).** Salt secret drawn in real Node, unseen by any seat.
  The salted-census pipeline held with real agents: every Assay re-derived
  `sha256(hSource‖hProposal‖salt)` = seedHex; every gate 32/32; no serialization
  drift; 0 BLOCKED. Three VALIDATED beats of 472: 440, 453, 461.

## Reversals

- `retry` was expected (per HARDENING.md) to close at C2. It does **not** — under
  salted *sampling*, resubmission still escapes; only **census (C4)** kills it.
  Corrected in the board and the plan. A weak claim un-made.
- Four defects were found by running the new code, not inspecting it: the
  sandbox's missing `node:crypto` then `TextEncoder`; a `check_claims` parser
  that silently skipped a row whose claim contained an escaped pipe; a
  `verify_run` draw-order false-negative; a `grind` criterion that conflated
  grinding with the sampling residual. Each is now pinned by a test.

## Ledger entries returned

For the keystone to serialise (GR-10) — repo-level `claims_register.md` already
carries CR-H1..H12; the field-guide additions on a fold:

- **frontier candidates (not folded):** 440 / 453 / 461, all VALIDATED at census
  32/32, seeds re-derived. Folding is the First Person's.
- **KILLED_LEVERS:** none this session; the two MIRAGEs (488, 493) passed the
  census but did not beat the frontier — a labelling ambiguity, not a kill.

## Handoff

- **Open questions:** should a full-census pass that does not beat the frontier
  be VALIDATED-but-unfolded rather than MIRAGE? (assay labelling nuance)
- **Blocked items:** the measured cross-model Φ_inference delta (CR-H10) needs a
  cross-family/cross-provider spar; process mounts (D3 tier-2) need runtime
  support; the duel's commit-reveal (option B) closes `corrupt_gap`.
- **Single next action:** the First Person folds 440 into `frontier.json` (or
  runs the cross-model spar), then the door — commit, push, propagate.
