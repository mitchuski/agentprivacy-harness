---
date: 2026-09-12
seat: keystone
runId: pqc-calibration smoke (external instance)
verdict: Two engine defects found by the first external instance with a large witness bank — the draw took one byte per pick and so never left the low end of a 65,536-bank (D-1), and the seed expansion counter was one byte and repeated after 8,192 bytes (D-2). Fixed as draw v2 (32-bit words, rejection-sampled, 4-byte counter); v1 kept for replay of existing records; records now carry drawVersion. All 21 gates pass, every saved run still re-derives.
---

# 2026-09-12 — the draw that stayed in the shallows

## Verdict

- **D-1, `engine/gap.mjs` `draw()`.** `idx = bytes[k] % remaining.length` with one byte per
  pick. Exact while the remaining population fits a byte; for N > 256 a pick can never reach
  past the first 256 of the remaining list. Found by running, not by reading: the
  pqc-calibration instance (a testbed calibration harness in `bgin-global/pqc-agility-competition`,
  N = 65,536, count = 10,000, sample mode) drew a max index of **10,230**. A bank drawn from its
  low end is tunable — the one property the Gap exists to deny.
- **D-2, `seedBytes()`.** The expansion block was `sha256(head ‖ counter & 0xff)`: after 256 blocks
  the stream repeats. Invisible below 8,192 bytes; every prior instance was below it.
- **Fix.** `draw(seedHex, N, count, version = DRAW_VERSION)`; `DRAW_VERSION = 2`. v2 reads a
  32-bit big-endian word per pick from `sha256(head ‖ be32(counter))` blocks and rejects any
  word ≥ 2³² − (2³² mod rem) before the modulus — unbiased for any N up to 2³², every index
  reachable, still a pure function of the seed, rejections deterministic and rare. v1 is kept as
  the legacy hand procedure so pre-existing records re-derive; `deriveHoldApart` and
  `holdApart` now return `drawVersion`, `drivers/run.mjs` writes it into `gap.json`, and
  `verify_run` replays `gap.drawVersion || 1`.
- **Evidence.** `engine/gap.test.mjs` §4b: v1 max 10,231 of 65,536 (the defect, pinned as a
  test); v2 max 65,535, min under 2 % of N, 10,000 distinct, 16-bin spread
  679/608/601/610/603/643/635/640/605/617/622/621/632/663/598/623; a 20,000-pick draw from 2²⁰
  stays distinct (the stream does not repeat). `node tools/check.mjs`: **all 21 gates pass**,
  including replay of every saved run in `examples/` and `evocations/`.

## What happened

The competition repository vendored `dist/default-harness` at `790a3b7`, scaffolded an
instance with `new_instance.mjs`, filled it for a track whose witness bank is 2¹⁶ transaction
digests, and ran the stub driver. The first `gap.json` had ten thousand indices and none above
ten thousand two hundred and thirty. The number was the finding; the read of `draw()` was the
explanation. Both defects are the same shape as the eleven before them — invisible to
inspection, obvious on execution — and both were invisible only because no earlier instance had a
bank larger than a byte.

## Reversals

Nothing reversed. One narrowing: the no-salt (LEGACY) Gap prompt in `examples/field-guide`
still describes the byte procedure, which is now v1. That is correct for a hand-computed legacy
draw and wrong as a description of the engine; the prompt text is the other seat's to edit and
is left alone here.

## Ledger entries returned

- claims_register (proposed): *the engine's sample draw is unbiased for any N up to 2³²* — tier
  **PROVEN**, enforced by **code** (`gap.test.mjs` §4b).
- HARNESS_PATHS / README: the defect count moves from fifteen to seventeen; the count lines are
  the origin operator's to update.

## Handoff

- **Open questions:** whether `DRAW_VERSION` should be recorded in `frontier.json` per instance
  so a fold names the draw it was validated under.
- **Blocked items:** none. The dist regenerates from this commit; the competition repository
  re-vendors it with `scripts/sync-harness.sh`.
- **Single next action:** regenerate `dist/default-harness` and re-run the pqc-calibration
  stub round — the max drawn index should sit within a few hundred of 65,536.
