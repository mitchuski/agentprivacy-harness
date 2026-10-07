---
date: 2026-10-07
seat: maintenance (no research seat; AGENTS.md "Arrival before activation")
runId: evocations/primer r1 (used as the end-to-end fixture only)
verdict: the registry κ axis is wired in — mint, verify, sign, gate — with no change to the Gap, the assay or the critic; 30/30 gates pass; nothing committed
---

# 2026-10-07 — maintenance: the registry κ axis for evidence bundles

## Verdict

Added a second content-addressing axis beside the holon κ law, so a run's
record can be minted into an evidence bundle that a UOR kappa-registry (or
anyone holding its rules) re-derives from one root. `tools/dcbor.mjs`
(canonical dCBOR + sha256, Edge struct, anchor, merkle), `tools/kappa_evidence.mjs`
(`mint | verify | root`, optional `--sign`), `tools/kappa_evidence.test.mjs`
(61 checks). `tools/check.mjs` runs the test and verifies every
`runs/<id>/evidence/` bundle it finds. `evocations/primer/runs/r1/evidence/`
is minted as the fixture: 9 objects, 9 blobs, 17 edges, one root. The engine
is untouched: this is a shape over what the loop already writes. No research
verdict is made here; no frontier moved. Nothing was committed or pushed
(T6/GR-8); the First Person commits.

## What happened

1. Read the task card (agentprivacy-docs/plans/KAPPA_EVIDENCE_HARNESS_TASK_2026-10-07.md)
   and the engine: the Gap's seed derives from hProposal, and hProposal is
   sha256 of the proposal_canon.json bytes, which is exactly the registry's
   blob κ of that file. So "the seed is the proposal κ" held already; the
   tool records it as a `derived-from` edge and `verify` checks it.
2. Wrote the dCBOR encoder as an independent second implementation of
   kappa_evidence_mage/kappa.py. Both pass the upstream library's own
   vectors; both produce identical κ for the struct vector (Edge, anchor,
   call row). The Python verifier accepts the JS-minted primer bundle and the
   JS verifier would accept the Python ones: same layout, same rules.
3. Leak scan tuned on the fixture: the bare user name matched a public
   GitHub handle inside a proposal, and `C:/Users/...` in run.json was not
   matched. Pattern now: drive-letter and POSIX user paths, home dirs, host
   names. run.json is redacted into its blob (its scratchDir is a private
   path); proposal_canon.json is never redacted, since its bytes are the
   seed's preimage.
4. `--sign`: ephemeral ed25519 per `tools/vrc.mjs`; the edges' asserter
   becomes the registry anchor of the key and root.json carries the
   signature over the root κ. A flipped signature fails verify.
5. Docs: HOLONS.md gains "The second axis"; templates/chronicle.md gains an
   `Evidence root:` section; `seats/constants-refuter.md` is a new support
   seat card (re-read the record's constants at the named commit before a
   build), prompted by two stale-constant misses in a challenge lane this
   week and a stale layout file the Python verifier caught the same day.

## Reversals

Nothing reversed. One thing not done on purpose: the loop does not emit κ
during a round. Minting is a post-run tool because the engine runs inside
the Workflow sandbox (hand-rolled sha256, no node:crypto), and because the
record on disk is the thing to address, not the in-flight data.

## Ledger entries returned

None (maintenance; no claims).

## Evidence root

`Evidence root: sha256:ab443cb712ac74c7fd470845aa42439f919328cb9e7ded1bbb70ab8cfecfe65a`
(evocations/primer r1; kappa-compatible (unverified) until the P1 cargo check).

## Handoff

- **Open questions:** whether `dist/default-harness` should carry the new
  tools on the next `make_default` emit (it copies by directory, so it will).
- **Blocked items:** P1 cargo check (WSL busy); until it passes no
  submission note quotes an evidence root.
- **Single next action:** the First Person reviews and commits; then the
  challenge lanes mint their next run with `--sign` and quote the root line.
