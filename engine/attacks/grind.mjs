// attacks/grind.mjs — D1. The proposal-hash grinding attack.
//
// The central claim: "witnesses derive from the proposal, so the proposer
// provably could not have tuned to them." Under the legacy seed rule
// (seed = sha256(proposal_canon)), that word "provably" is false. The seed is a
// public, deterministic function of a value the proposer chooses. So a proposer
// that drops a fact can perturb its own text, recompute the seed with the SAME
// gap.mjs the honest Gap uses, read off the draw, and resubmit until the draw
// misses the fact it dropped. Cost per attempt: one hash.
//
// This attack exercises the real draw. It WON before C2 (legacy rule) and C2
// turns it green: once the seed folds a salt derived from a run secret the
// proposer never sees, the proposer cannot compute the draw before submitting,
// so grinding buys nothing and the omission is caught at the base rate (8/32 =
// 25%). run() now models the spar's CURRENT (salted) default; pass {legacy:true}
// to reproduce the historical break.

import { canonicalize, hashCanon, deriveSeed, draw, perProposalSalt } from '../gap.mjs'

const N = 32          // the field guide's fact census (F1..F32)
const COUNT = 8       // the gate draws 8
const DROPPED = 17    // the fact the dishonest proposer silently omits
const MAX_TRIES = 64  // a patient grinder; expected success in ~1.3
const SECRET = 'e'.repeat(64) // the run's salt secret — the grinder does NOT have it

// A candidate that dropped fact DROPPED "passes" the gate iff DROPPED is not
// among the 8 facts the draw probes (the compressed text answers the other 7
// because it kept them).
function passesGate(seedHex) {
  return !draw(seedHex, N, COUNT).includes(DROPPED)
}

const baseProposal = {
  leverId: 'grind-drop-17',
  lens: 'line-editor',
  // pretend this text preserves every fact EXCEPT F17.
  compressedText: 'A dishonest compression that silently drops fact 17.',
  expectedMetric: 8,
}

export function run({ legacy = false } = {}) {
  if (legacy) {
    // The historical break: seed == h_proposal, public. Grind it.
    for (let tries = 1; tries <= MAX_TRIES; tries++) {
      const variant = { ...baseProposal, _pad: ' '.repeat(tries) }
      const seedHex = deriveSeed({ hProposal: hashCanon(canonicalize(variant)) })
      if (passesGate(seedHex)) {
        return { won: true, detail: `GRIND WON in ${tries} attempt(s) under the legacy rule → draw omits F17.` }
      }
    }
    return { won: false, detail: `no winning variant in ${MAX_TRIES} legacy tries` }
  }

  // The spar's CURRENT rule: the seed folds salt = sha256(secret || hProposal),
  // and the grinder does NOT have `secret`. It optimises against the only thing
  // it CAN compute — the legacy draw — then the real gate grades it on the
  // salted draw it never saw. Because the salt is independent of the grinder's
  // choice, the dropped fact is exposed at the base rate (COUNT/N = 25%),
  // regardless of how hard it grinds. We MEASURE that across many run secrets to
  // keep the board deterministic: grinding does not lower the catch rate.
  let bestLegacyVariant = { ...baseProposal, _pad: ' ' }
  for (let tries = 1; tries <= MAX_TRIES; tries++) {
    const variant = { ...baseProposal, _pad: ' '.repeat(tries) }
    if (passesGate(deriveSeed({ hProposal: hashCanon(canonicalize(variant)) }))) { bestLegacyVariant = variant; break }
  }
  // The grind attack succeeds iff grinding raises the escape rate ABOVE the
  // honest base rate. Under sampling, ANY 1-fact drop escapes ~75% (that is the
  // D2 sampling weakness, omit_one's territory — not grinding). So compare the
  // grinder's chosen variant against an un-grinded honest candidate over the
  // same run secrets: if grinding buys no extra escape, D1 is closed.
  const hGrind = hashCanon(canonicalize(bestLegacyVariant))
  const hHonest = hashCanon(canonicalize({ ...baseProposal, _pad: '' }))
  let grindEsc = 0, honestEsc = 0
  const SWEEP = 2000
  for (let s = 0; s < SWEEP; s++) {
    const secret = hashCanon('run-secret-' + s) // stand-in for each run's CSPRNG
    if (passesGate(deriveSeed({ hSource: 'src', hProposal: hGrind, salt: perProposalSalt(secret, hGrind) }))) grindEsc++
    if (passesGate(deriveSeed({ hSource: 'src', hProposal: hHonest, salt: perProposalSalt(secret, hHonest) }))) honestEsc++
  }
  const grindRate = grindEsc / SWEEP, honestRate = honestEsc / SWEEP
  const advantage = grindRate - honestRate // grinding's marginal escape gain
  return {
    // won only if grinding beats the honest base rate by a real margin
    won: advantage > 0.05,
    detail: `grinding gains ${(advantage * 100).toFixed(1)}pp of escape over an un-grinded drop (${(grindRate * 100).toFixed(1)}% vs ${(honestRate * 100).toFixed(1)}%): the salt makes the draw independent of the proposal, so grinding is void. The residual ~75% is the D2 sampling weakness (omit_one), closed by census (C4) — not grinding.`,
  }
}

export const meta = {
  id: 'grind',
  targets: 'D1',
  summary: 'proposer grinds canon variants to dodge the draw for a dropped fact',
  expectedNow: 'BLOCKED — grinding void under the salt (C2)',
  expectedAfter: 'blocked — caught at base rate; grinding impossible after the salt',
  landsIn: 'C2',
  knownLimit: false,
}
