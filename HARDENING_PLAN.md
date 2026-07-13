# HARDENING_PLAN.md

```
theme:        the executable punch-list to HARDENING.md's triage
arc position: commit plan, decisions resolved
status:       in progress — build order below
register:     operational
depends on:   HARDENING.md (the triage), the external review OBS-HARNESS-01
```

> a claim is worth what it can be re-run to show. so build the re-run.

---

## What this file is

`HARDENING.md` triaged the review and named the defects. This file is the
**decided** build: the seven-commit spine, re-sequenced, with the two
ground-truth corrections folded in and the open forks resolved. Every commit
is independently revertable, turns the check board green (save the new red
attacks it is meant to fail against), and touches nothing in `universe/`.

**Ground rule, unchanged from the triage:** no fix lands without a red-team
test that was red before it. Debug by running.

**The door (T6):** every commit here is local work. Pushes, PRs, and anything
outward-facing stay the First Person's. Build and report status; do not act.

---

## Decisions resolved (the forks HARDENING.md left open)

| # | fork | decision |
|---|---|---|
| **D1 seed** | code salt (A) vs two-party commit-reveal (B) vs beacon | **Both, tier-split.** `seed = gap.seed({hSource, hProposal, salt})` as one code function. **A** (Gap CSPRNG salt) is the **spar's** Gap, shipped now — it kills proposer grinding immediately. **B** (prover commit-reveal) is the **duel's** Gap, added when the external prover seat lands. Same function; `salt` just changes source. The runtime-tier table already sorts which bout needs which. |
| **Gap locus** | LLM prompt vs code path | **Code.** `engine/gap.mjs` owns canonicalize → hash → seed → draw. The Gap *seat* shrinks to call-the-tool + narrate. This is the substrate D1/D5/D7 all stand on. |
| **Language timing** | interim-honest now vs hold until enforcement | **Hold.** Rewriting the prose before the enforcement exists is exactly the failure the harness names. Post-fix language lands in C7, after C2. (Exception: the GR-1 number bug is a factual error, not an overclaim — fixed in C7 regardless.) |
| **D4b cross-model** | same-model warning / cross-family-in-Claude / external seat | **All three, staged.** conform stamps `Φ_inference=0` on same-model now; **plus** a cross-Claude-family spar run (Opus proposer vs Haiku/Fable prover) as the runnable-now delta; **plus** the external-API prover seat for true cross-provider (which also delivers D3 tier-2). |

## Corrections to HARDENING.md's specifics (verified against the repo)

1. **N = 32, not 40.** The field guide's census authority is 32 facts
   (`claims_register.md` CR-4/CR-9: "all 32 original facts F1..F32"). Detection
   at d=1, n=8 is therefore **0.25**, not 0.20. Every coverage-stanza number
   and the backfill use **N=32**.
2. **The folds are 1-sampled + 2-census, not "two and two."** From
   `frontier.json` / `claims_register.md`: **573 (CR-2) = sampled** (one
   independent draw, no census); **526 (CR-4)** and **472 (CR-9) = census
   32/32**. So C4 backfills **only the 573 fold** to `VALIDATED_SAMPLE(0.25)`.
3. **Live GR-1 bug (the review missed it):** the README and the `holdApart`
   prompt both say "~40 facts"; the authority says 32. A number contradicting
   the source of truth is a GR-1 violation. Fixed in C7.

---

## Build log (what actually landed, verified)

- **C0 ✅** `engine/gap.mjs` — the Gap is code (canonicalize→hash→seed→draw), 19-assertion test, wired into `check.mjs`. **Proven faithful**: reproduces the LLM Gap's recorded r4 draw (`F14 F10 F9 F22 F29 F16 F28 F2`) byte-for-byte.
- **C1 ✅** `engine/attacks/` + `check.mjs --red`. `grind` won in 1 try, `omit_one` escaped 75.8% (vs 75.0% predicted) against the live mechanism; 8 more declared with target commits.
- **C2 ✅** D1 salt (option A), verified at code level:
  - **Runtime finding (affects the whole path):** the Claude Code Workflow sandbox has *no Node.js API access* — no `node:crypto`. Since the seed/draw are derived inside the loop (which runs there), `gap.mjs` now carries a **pure-JS SHA-256**, cross-checked against `node:crypto` over 12+ inputs incl. the FIPS "abc" vector (zero drift, enforced by test). `bundle.mjs` inlines `gap.mjs` + `canonicalJson` so the bundle is import-free and crypto-free.
  - **Mechanism:** run-level `saltSecret` (32 CSPRNG bytes, drawn once outside the sandbox, unseen by any seat) → per-proposal `salt = sha256(saltSecret‖hProposal)` derived *after* commit → `seed = sha256(hSource‖hProposal‖salt)`. Loop code-derives and hands seed+draw to the Gap seat. `loop.salt.test` proves grinding is void (catch rate collapses to the 25% base rate) and the derived values reach the seat.
  - **Board:** `grind` → **BLOCKED** (grinding gains ≈0pp). `render_run` re-derives the salted chain, badges legacy runs, and voids a tampered canon (verified on crafted runs).
  - **Corrections vs HARDENING.md:** (1) N=**32** confirmed from the r4 transcript. (2) **`retry` does NOT close at C2** — under salted *sampling*, resubmission still escapes (~82%); only **census (C4)** kills it (and the ledger at C5 makes it legible). `retry` correctly stays red → C4. So C2 flips **grind** green; `omit_one` + `retry` are C4.
  - **Awaiting the First Person:** a live salted spar run (r5) with real LLM seats validates the config prompts end-to-end — that needs the Workflow multi-agent runtime, which is yours to trigger. Source binding (`hSource`) is plumbed as optional (`runArgs.sourceHash`).
- **C3 ✅** D4 enforced-by axis. `enforced-by` column on the template + field-guide + a new repo-level `claims_register.md` (12 load-bearing claims, honestly tiered post-C2). `tools/check_claims.mjs` hard-fails any PROVEN/DERIVED claim enforced only by prompt/manual/nothing, wired into `check.mjs`. **Gate demonstrated**: flipping CR-H8 (isolation) to DERIVED trips it. **Parser bug found + fixed by running**: an escaped pipe in a claim (`I(Y_S ; Y_M \| X)`) shifted columns and made the checker silently skip that row — now splits on unescaped pipes only.
- **C5 ✅** D5 `verify_run.mjs` — one offline, zero-LLM, fail-closed verifier; re-derives canon→hProposal→seed→draw with the real `gap.mjs`; missing/inconsistent → UNVERIFIABLE (distinct from a pass). `--all` wired into `check.mjs`. **Re-verifies the entire history**: all 4 historic runs pass. **Two bugs found by running**: (1) legacy gap.json lists questions in the LLM's sorted order, not draw order → compare draws as **sets**; (2) coverage-absent on legacy runs must be a *warning*, not UNVERIFIABLE (grandfathered), else check.mjs fails on its own history. `bad_canon`/`bad_draw`/`tamper` attacks now runnable + blocked.
- **C6 ◐ (code done; live/infra pending)** D3/D4b. `conform.mjs` stamps a Φ_inference≈0 advisory on same-model seat pairs; the loop records the `{proposer,prover}` model pair + `phiInference` in the run result; `THREATS.md` labels the three separations (protocol/process/prompt). **Pending (need infra/live):** per-seat process mounts + read logs (D3 tier-2), the external-API prover seat, and the measured cross-model detection delta — the last is produced by the live spar. `peek`/`monoculture`/`corrupt_gap` stay honestly declared.
- **C7 ✅** D6 `THREATS.md` (the full table + the three-separations section + what closes each pending item). Post-fix language patch across README + RESEARCH: dropped "provably" where it was false, recast `I(Y_S;Y_M|X)=0` as a routing **target** (OPEN until process mounts), "Fiat-Shamir" → "Fiat-Shamir-**shaped**". **GR-1 number bug fixed**: "~40 facts" → 32, everywhere (README, RESEARCH, config heldApartRule).
- **C4 ✅** D2 census default + coverage. Field guide → `mode: 'census'` (N=32); `conform.mjs` refuses `sample` at N ≤ censusThreshold (verified). Verdict carries a `coverage {mode,N,detection}` stanza (surgical — no status rename; `VALIDATED_CENSUS`/`VALIDATED_SAMPLE` are render/mint labels, not new statuses); `mint_artefact` + `render_run` print detection next to the verdict. **Board now GREEN**: `omit_one`, `omit_cluster`, `retry` all blocked by census. **Honest backfill**: only the **573** fold → sample (detection 0.25); 526 + 472 → census (1.0), not retroactively upgraded. Template gets the gate block.

## The live spar (r5) — end-to-end validation with real seats

Ran the hardened field-guide config through the Workflow tool (27 agents, 0
errors, ~48 min, ~1.24M subagent tokens). Salt secret drawn in real Node,
passed via args, unseen by any seat.

- **Sandbox finding #2, fixed + pinned:** the first launch died on `TextEncoder
  is not defined` — the Workflow runtime has no `TextEncoder` either. `gap.mjs`
  now hand-rolls UTF-8 encoding (surrogate pairs included), cross-checked
  against `node:crypto` and guarded by a source-scan test so no `node:crypto` /
  `TextEncoder` / `Buffer` can regress back into sandbox code. Resumed from the
  cached run; only `deriveHoldApart` onward re-ran.
- **Result:** 3 rounds, tally **4 VALIDATED / 2 MIRAGE / 0 BLOCKED**. The
  salted-census pipeline held with real seats: every Assay seat re-derived
  `seed = sha256(hSource‖hProposal‖salt)` and confirmed MATCH; every gate was a
  32/32 census (detection 1.0). **`node tools/verify_run.mjs examples/field-guide
  r5` → RUN VERIFIED** — all six proposals re-derive offline, byte-canonical,
  zero LLM calls. No CR-7 serialization drift.
- **New frontier candidates (NOT folded — the keystone's/First Person's call):**
  three VALIDATED beats of the prior 472 under the *harder* census+salt gate —
  **440** (strip-markup-dashes-and-filler), **453**, **461**. Folding into
  `frontier.json` is yours (GR-1/keystone); the loop only returns verdicts.
- **Observation (minor):** two candidates that passed the census 32/32 but did
  not beat the frontier were labelled MIRAGE by the assay seats. Within the
  3-verdict vocabulary that is the only "not-VALIDATED" bucket, but MIRAGE means
  "failed the gate looking fine" — a full-pass-but-no-beat is arguably its own
  case. A candidate follow-up, not a defect (they were correctly not folded).
- Φ_inference = 0 recorded (same model both seats — the reference default). The
  cross-model delta (CR-H10) is the remaining D4b measurement.

## The commit sequence

### C0 · `engine/gap.mjs` — the Gap becomes code *(new; precedes everything)*
Extract into one deterministic, unit-tested module (importing `canonicalJson`
/ `sha256Hex` from `tools/kappa.mjs` so bytes are identical everywhere):
`canonicalize(proposal)` → `hashCanon` → `seed({hSource,hProposal,salt})` →
`draw(seed, N, count)`. Legacy mode (`seed = hProposal`) preserves current run
compatibility; the salt path is dormant until C2. The Gap *seat* shrinks to
call + narrate + write questions.
- **Test:** `engine/gap.test.mjs` — draw is deterministic and
  order-stable; `draw` matches the byte algorithm the prompt described
  (digest bytes L→R, `idx = b_k mod remaining`, no replacement); a
  cross-derivation confirms `hashCanon(canonicalize(p))` equals
  `sha256(bytes written to proposal_canon.json)`.
- **Acceptance:** `node tools/check.mjs` still green; the field-guide spar
  re-renders identically (no behavior change).

### C1 · `engine/attacks/` — the red board *(red first)*
`grind.mjs` (drop fact, 20 canon variants → passes 8/8 today), `omit_one.mjs`,
`retry.mjs`, `bad_canon.mjs`, `bad_draw.mjs`, `peek.mjs`, `tamper.mjs`,
`monoculture.mjs`, **`corrupt_gap.mjs`** (the A-vs-B discriminator), and
`sample_hugger.mjs` kept as the honest can't-stop-it. Each attack is a config +
adversarial seat + a **recorded expected outcome**.
- **Acceptance:** `node tools/check.mjs --red` exits non-zero and prints the
  grind that won.

### C2 · D1 seed — ship A (the spar salt)
Gap draws `salt = crypto.randomBytes(32)` **after** proposal commit;
`seed = sha256(hSource || hProposal || salt)`; retry ledger at
`runs/<id>/proposals.log`; no re-propose after draw (re-proposal opens a new
round); source binding. Run manifest carries `saltS`/`commitS` fields (B-ready,
per D5's manifest schema). `render_run.mjs` branches on
`protocolVersion`: legacy runs keep the `seed = sha256File(proposal_canon)`
check with a `legacy-seed` badge; new runs verify the salted rule.
- **Acceptance:** `grind.mjs`, `retry.mjs` go green; **`corrupt_gap.mjs` stays
  red** (the spar trusts its referee — closing it is B's job at the duel tier);
  `render_run` shows the salt and the check; every historic run re-renders with
  the `legacy-seed` badge rather than silently re-deriving under the new rule.

### C3 · D4 — `enforced-by` column + `check_claims.mjs` *(pulled early)*
Add the `enforced-by` column (`code | protocol | runtime | prompt | manual |
nothing`) to `claims_register.md` and the template. `tools/check_claims.mjs`:
**any PROVEN/DERIVED claim whose enforcement is `prompt`, `manual`, or
`nothing` is a hard failure.** Wire into `tools/check.mjs`.
- **Acceptance:** run it *before* C2 folds and watch it flag D1/D2/D3 —
  that catch is the demonstration. After C2/C4 it goes green because the
  enforcement caught up to the claim.

### C4 · D2 — census default + split verdict *(N=32)*
`harness.config.mjs` gains `gate.mode: 'census' | 'sample'` +
`censusThreshold`; `conform.mjs` refuses a `sample` config where
`N <= censusThreshold`. Verdict split (surgical, not a rename):
`VALIDATED_CENSUS` / `VALIDATED_SAMPLE` / `MIRAGE` / `BLOCKED` / `UNVERIFIABLE`
(the last from D5). Every `VALIDATED_SAMPLE` carries a coverage stanza printing
the detection probability. `mint_artefact.mjs` mints full for census, coverage-
stanza'd for sample.
- **Migration (honest):** backfill **only the 573 fold** →
  `VALIDATED_SAMPLE`, `detection(d=1) = 0.25` at N=32; 526 and 472 →
  `VALIDATED_CENSUS`. Do not retroactively upgrade. A weak fold is a fence.
- **Acceptance:** field-guide N=32 refuses `mode: 'sample'`; the frontier
  backfill reads honestly; `omit_one` / `omit_cluster` caught by census.

### C5 · D5 — `verify_run.mjs` + manifest v2
`node tools/verify_run.mjs <instance> <runId>`: offline, zero LLM calls, exits
non-zero on anything it cannot establish. The 12 checks (canon reproduces,
`h_proposal` correct, commit-before-proposal ordering, salt opens commit, seed
= sha256 of the three parts, indices = `draw(seed,N)`, witnesses map to source
facts, expected answers derive from source, graded answers byte-match produced,
verdict follows the rule, read logs stay in-mount, model pair matches config).
Missing/inconsistent → **`UNVERIFIABLE`**, a distinct verdict, not a pass.
Manifest v2 (`protocolVersion: "2.0.0"`) is the verifier's input. Wire into
`tools/check.mjs` so every run in the repo re-verifies on every check.
- **Acceptance:** `bad_canon`, `bad_draw`, `tamper` all render `UNVERIFIABLE`;
  `verify_run` runs with zero LLM calls.

### C6 · D3 / D4b — mounts, read logs, model-pair gate, cross-model runs
- **Tier 1 (visible):** per-seat scratch `runs/<id>/seats/<seat>/` + a read-log
  manifest of every path each seat touched; `verify_run` fails closed if a
  proposer read log touches `gap/`, `witnesses/`, `expected/`, or the salt.
  Record `model`/`provider`/`contextPolicy` per seat.
- **Model-pair gate:** `conform.mjs` refuses — or loudly stamps
  `Φ_inference = 0` onto the verdict and the minted artefact for — a config
  where proposer and prover name the same model.
- **Cross-model, both:** one **cross-Claude-family** spar run (Opus proposer vs
  Haiku/Fable prover), recorded now; **and** the **external-API prover seat**
  (own process, own credential, egress denied) = D3 tier-2 + true
  cross-provider. Both deltas filed win **or** loss — a null result against C7
  goes to `notes/KILLED_LEVERS.md` at win-prominence.
- **Acceptance:** `peek.mjs` blocked and logged; `conform` refuses/stamps the
  same-model pair; both cross-model deltas recorded.

### C7 · D6 + language — last
Write `THREATS.md` (the review had to reverse-engineer one). Apply the
**post-fix** language patch: drop "provably", recast `I(Y_S;Y_M|X)=0` as a
design target with its assumptions written under it, "Fiat-Shamir" →
"Fiat-Shamir-**shaped**". Fix the **GR-1 number bug** (README + `holdApart`:
"~40 facts" → the authority's 32). Last, because now the claims are true and
you are describing rather than promising.

---

## Ledger candidates (CTR-HAR-01..05, C-numbers the keystone's to assign)

| id | claim | tier trajectory | enforced by | conf |
|---|---|---|---|---|
| CTR-HAR-01 | commit-reveal seed makes the draw unpredictable to both agents | OPEN → PROVEN post-C2/B | protocol | 85% |
| CTR-HAR-02 | census over an enumerable bank is strictly stronger than any sample | DERIVED | code | 99% |
| CTR-HAR-03 | same-model seat pairs measurably reduce defect detection | OPEN → measured post-C6 | code/measurement | 70% |
| CTR-HAR-04 | an enforced-by column detects overclaim before external review | OPEN → PROVEN post-C3 | code | 75% |
| CTR-HAR-05 | sampling gates on small populations are a general anti-pattern | OPEN | none (a paper) | 80% |

---

## What not to change (defended, per the triage)

The verdict lexicon (split VALIDATED, never replace it — MIRAGE is load-
bearing); `universe/` behind the seam, deletable; `conform.mjs` keeping its
own copy of the axioms and refusing to import them; the door (T6) as honestly-
labelled manual discipline; the claim tiers (item 7 was their request for a
second column, not their failure).

> what you can count, count. what you cannot count, do not call proven.

(⚔️⊥⿻⊥🧙)😊
