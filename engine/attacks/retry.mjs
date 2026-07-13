// attacks/retry.mjs — D1. Re-propose after seeing the draw.
//
// A subtler grinder: don't pre-compute variants, just submit, see the draw, and
// if the dropped fact was probed, RESUBMIT a perturbation and hope the next
// draw misses it. Under the legacy rule this is devastating and leaves no trace
// — the seed is public, so "see the draw" is free, and nothing records the
// discarded attempts.
//
// C2 closes it two ways: (1) the salt makes the NEXT draw just as unpredictable
// as the first — a fresh perturbation gets a fresh salt the proposer cannot
// compute, so resubmission does not raise the escape rate above the base rate;
// and (2) the retry ledger records every committed proposal hash, so a round
// with many attempts and one submission is visibly a grinding round even where
// it is not prevented.
//
// We MEASURE (1): resubmitting R times does not beat the base rate, because each
// attempt is an independent salted draw.

import { canonicalize, hashCanon, deriveSeed, draw, perProposalSalt } from '../gap.mjs'

const N = 32, COUNT = 8, DROPPED = 17
const RESUBMITS = 5   // a persistent attacker: submit, then up to 5 resubmissions
const RUNS = 2000

const caughtBy = (seedHex) => draw(seedHex, N, COUNT).includes(DROPPED)

export function run({ legacy = false, census = true } = {}) {  // field guide is census (C4)
  if (census && !legacy) {
    // Census probes every fact, so a dropped fact is caught on EVERY attempt.
    // Resubmitting is futile: there is no draw to dodge. retry dies here.
    return { won: false, detail: `census probes all ${N} facts, so the dropped F17 is caught on every submit — resubmission has nothing to dodge. retry is dead under census (C4); the salt (C2) removed steerability, census removes the target.` }
  }
  if (legacy) {
    // See the public draw; if caught, perturb and look again. Wins almost surely
    // within a few resubmits, and no ledger records the discarded tries.
    for (let r = 0; r <= RESUBMITS; r++) {
      const variant = { leverId: 'retry', compressedText: 'drops 17', _pad: ' '.repeat(r + 1) }
      if (!caughtBy(deriveSeed({ hProposal: hashCanon(canonicalize(variant)) }))) {
        return { won: true, detail: `LEGACY: re-proposed ${r} time(s), then the public draw missed F17. No trace recorded.` }
      }
    }
    return { won: false, detail: 'legacy retry exhausted (unlikely)' }
  }

  // Salted: each resubmission is an independent salted draw the attacker cannot
  // pre-test. Measure the escape rate of an attacker allowed RESUBMITS tries per
  // run — it stays at the base rate compounded only by chance, never by skill.
  let escapedRuns = 0
  for (let s = 0; s < RUNS; s++) {
    const secret = hashCanon('retry-run-' + s)
    let escapedThisRun = false
    for (let r = 0; r <= RESUBMITS; r++) {
      const variant = { leverId: 'retry', compressedText: 'drops 17', _pad: ' '.repeat(r + 1) }
      const hP = hashCanon(canonicalize(variant))
      const salt = perProposalSalt(secret, hP)
      // the retry ledger would show r+1 committed hashes here — grinding is legible
      if (!caughtBy(deriveSeed({ hSource: 'src', hProposal: hP, salt }))) { escapedThisRun = true; break }
    }
    if (escapedThisRun) escapedRuns++
  }
  const rate = escapedRuns / RUNS
  // Honest verdict: the salt removes per-DRAW steerability (no single attempt is
  // pickable), but it does NOT stop RESUBMISSION. With 6 independent 25%-catch
  // tries, ~82% of attackers escape by luck. The salt alone does not close
  // retry. Two things do, and neither is the salt: CENSUS (C4) makes every
  // resubmit futile because the dropped fact is always probed; the LEDGER CHECK
  // (C5) refuses a round with multiple committed hashes so grinding is legible.
  // So retry stays RED until C4 — claiming otherwise would be the overclaim the
  // harness exists to name.
  return {
    won: rate > 0.5,
    detail: `salted removes per-draw steerability, but ${RESUBMITS + 1} blind resubmits still escape ${(rate * 100).toFixed(0)}% by luck (sampling cannot survive resubmission). Closed by CENSUS (C4: every fact probed → the drop is always caught) and made legible by the retry ledger (C5). Not closed by the salt alone.`,
  }
}

export const meta = {
  id: 'retry',
  targets: 'D1',
  summary: 're-propose after seeing the draw',
  expectedNow: 'BLOCKED — census leaves nothing to dodge (C4)',
  expectedAfter: 'blocked by census (C4); made legible by the retry ledger (C5)',
  landsIn: 'C4',
  knownLimit: false,
}
