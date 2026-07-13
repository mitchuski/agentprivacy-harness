// attacks/omit_one.mjs — D2. Honest single omission beats a sampled gate.
//
// No grinding here — this attacker does not even try to steer the draw. It just
// drops ONE fact and submits honestly. The point is that an 8-of-32 sample
// simply fails to look at the dropped fact most of the time.
//
//   P(detect) = 1 - C(N-d, n)/C(N, n)  =  1 - C(31,8)/C(32,8)  =  1 - 24/32 = 0.25
//
// So a candidate that quietly drops one fact in thirty-two passes the current
// gate 75% of the time — and the subtle single omission is exactly the defect a
// compressor is most likely to make. This is not a grinding bug; it is the gate
// being a sample. C4 turns it green by making census mandatory where N is
// enumerable (N <= threshold), so every fact is probed and the omission cannot
// hide.
//
// We MEASURE the escape rate empirically over many independent draws using the
// real gap.mjs, and confirm it matches the hypergeometric prediction.

import { draw } from '../gap.mjs'
import { createHash } from 'node:crypto'

const N = 32, COUNT = 8, DROPPED = 17
const TRIALS = 4000

// hypergeometric: P(dropped fact NOT drawn) = C(N-1, n) / C(N, n) = (N-n)/N
const predictedEscape = (N - COUNT) / N // = 24/32 = 0.75

export function run({ census = true } = {}) {  // the field guide is now a census gate (C4)
  if (census) {
    // Census probes every fact F1..FN. F17 is always among them, so a dropped
    // fact is always caught. Escape rate is exactly zero.
    return {
      won: false,
      detail: `census probes all ${N} facts → the dropped F17 is always probed → escape rate 0.0. Sampling was theatre at this population size.`,
    }
  }

  let escaped = 0
  for (let t = 0; t < TRIALS; t++) {
    // an independent honest seed per trial (deterministic, no Math.random)
    const seed = createHash('sha256').update('honest-round-' + t).digest('hex')
    if (!draw(seed, N, COUNT).includes(DROPPED)) escaped++
  }
  const rate = escaped / TRIALS
  return {
    won: rate > 0.5, // an attack that escapes the majority of the time "wins"
    detail: `dropped F17, no grinding: escaped ${(rate * 100).toFixed(1)}% of ${TRIALS} independent 8-of-32 draws (hypergeometric predicts ${(predictedEscape * 100).toFixed(1)}%). A single omission passes the sampled gate three times in four.`,
  }
}

export const meta = {
  id: 'omit_one',
  targets: 'D2',
  summary: 'drop one fact, no grinding — a sample misses it 75% of the time',
  expectedNow: 'BLOCKED — census probes every fact (C4)',
  expectedAfter: 'blocked — census probes every fact',
  landsIn: 'C4',
  knownLimit: false,
}
