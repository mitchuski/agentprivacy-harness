// harnesses/_TEMPLATE/harness.config.mjs
// Copy this directory to harnesses/<your-purpose>/ and fill in the seats.
// Contract: ../../core/SEAT_CONTRACT.md   Seating guide: ../../bindings/personas-and-skills.md
// Honest framing: a harness produces VALIDATED improvements; only the Gap makes a claim true.

// 🧙 Mage finders — each a distinct lens, run in parallel, blind to one another.
// For a product objective (cost × size), make a complement pair: Factor-A-Min ⊥ Factor-B-Min.
const FINDERS = [
  { lens: 'factor-a-minimiser', mandate: 'drive factor A down. Re-express paid work as free ops where the structure permits. Load your Mage persona + reduction skill.' },
  { lens: 'factor-b-minimiser', mandate: 'drive factor B down at constant A. Watch the break-even cliff.' },
  // add domain-specific lenses…
];

const proposal = { type:'object', required:['change','rationale','isStructural','smallestFix'], properties:{
  change:{type:'string'}, rationale:{type:'string'}, isStructural:{type:'boolean'}, smallestFix:{type:'string'} } };
const hunt    = { type:'object', required:['candidates','note'], properties:{ candidates:{type:'array',items:{type:'string'}}, note:{type:'string'} } };
const verdict = { type:'object', required:['validated','verdict','score','beatsFrontier'], properties:{
  validated:{type:'boolean'}, verdict:{type:'string',enum:['validated','mirage','error']}, score:{type:'number'}, beatsFrontier:{type:'boolean'} } };
const critic  = { type:'object', required:['classification','nextLead'], properties:{
  classification:{type:'string',enum:['structural','probe-limited','noise']}, nextLead:{type:'string'} } };

export default {
  name: 'TODO-your-purpose',
  purpose: 'TODO state the objective (often a product of factors)',
  finders: FINDERS,
  // REQUIRED — the non-collusion guard. The proposer must NOT see/tune the held-out witnesses.
  heldApartRule: 'TODO: the proposer must not read or reason about the held-out test set. Spell out how it is derived from the proposal so it cannot be tuned to.',
  measurePrompt: (round) => `TODO Eos: sync the real frontier; meter each lever's TRUE cost; rank by the objective. Round ${round}.`,
  huntPrompt:   (p, i) => `TODO Gap: reseed the held-out witnesses for proposal #${i}; screen → candidates (never results).`,
  assayPrompt:  (p, h, i) => `TODO Swordsman (load agentprivacy-horizon-gate): cliff-watcher Δ(objective), then the FULL held-out gate. Only a clean full pass is validated; a probe-pass-then-fail is a mirage — reject it.`,
  criticPrompt: (validated, all) => `TODO Poros: classify structural / probe-limited / noise; give one source-backed next lead.`,
  schemas: { proposal, hunt, verdict, critic },
  stop: { dryRounds: 2, maxRounds: 12 },
  isValidated: (v) => v && v.validated && v.verdict === 'validated' && v.beatsFrontier,
  isStructural: (c) => c && c.classification === 'structural',
};
