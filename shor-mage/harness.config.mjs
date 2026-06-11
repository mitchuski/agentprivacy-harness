// harness.config.mjs
// =============================================================================
// INSTANCE #1 — quantum resource estimation on the ecdsa.fail secp256k1 point-add.
// A config for ./core/dual_agent_loop.mjs. Honest framing: durability signal, NOT
// an attack. The runnable self-contained bundle (for the Workflow tool, which has no
// import) lives in the shor_mage kit: shor_mage/harness/swordsman_mage_pqc.mjs.
//
// SEATS (see ../generic/bindings/personas-and-skills.md):
//   🧙 Mage  ← persona agentprivacy-algebraist + skill agentprivacy-separation-enforcement
//   ⚔️ Sword ← persona agentprivacy-quantum-sentinel + skills horizon-gate, cryptographic-durability, quantum-defence
//   ⿻ Gap   ← the Fiat-Shamir 9,024 (the GPU island toolkit) + separation-enforcement
//   design  ← agentprivacy-architect + meta/agentprivacy-dual-agent-harness
// =============================================================================

const CHALLENGE = (globalThis.args && globalThis.args.challenge) || '$CHALLENGE';
const RANGE = (globalThis.args && globalThis.args.searchRange) || 2_000_000;

// ── Mage finders: the complement pair (gate ⊥ qubit) + the disclosure frontier ──
const FINDERS = [
  { lens: 'gate-minimiser', mandate:
      'drive CCX+CCZ down. Re-express paid ANDs as free neg/bnot/xor (X/Z/CX) — the V6 identity ' +
      'neg(bnot(x))=succ(x): subtract = complement, add, complement back. Target the modular inverse ' +
      '(Kaliski/GCD), the Toffoli-dominant heart. Load skill agentprivacy-algebraist.' },
  { lens: 'qubit-minimiser', mandate:
      'drive peak width down at constant Toffoli. Find the phase that sets the peak; borrow/reuse/early-free ' +
      'ancilla. Watch the break-even cliff — a width cut that forces more Toffoli loses the product.' },
  { lens: 'disclosure-frontier', mandate:
      'the classical/quantum boundary. offset_x/offset_y are CLASSICAL. Push every paid quantum AND the ' +
      'classical offset already makes free into a classically-controlled path (cost ∝ control density, not ' +
      'width). C9 holographic sufficiency: bulk Toffoli is bounded by boundary information. Load skill ' +
      'agentprivacy-separation-enforcement.' },
];

const proposal = { type: 'object', required: ['lever','value','rationale','expectedTofDelta','expectedQubitDelta','isStructural','smallestFix'], properties: {
  lever:{type:'string'}, value:{type:'string'}, rationale:{type:'string'},
  expectedTofDelta:{type:'number'}, expectedQubitDelta:{type:'number'}, isStructural:{type:'boolean'}, smallestFix:{type:'string'} } };
const hunt = { type:'object', required:['candidates','measuredTof','peakQubits','note'], properties:{
  candidates:{type:'array',items:{type:'string'}}, measuredTof:{type:'number'}, peakQubits:{type:'number'}, note:{type:'string'} } };
const verdict = { type:'object', required:['nonce','validated','score','beatsFrontier','verdict'], properties:{
  nonce:{type:'string'}, validated:{type:'boolean'}, score:{type:'number'}, beatsFrontier:{type:'boolean'},
  verdict:{type:'string',enum:['validated','mirage','error']} } };
const critic = { type:'object', required:['classification','continueLever','nextLead'], properties:{
  classification:{type:'string',enum:['structural','probe-limited','noise']}, continueLever:{type:'boolean'}, nextLead:{type:'string'} } };

export default {
  name: 'ecdsafail-pqc',
  purpose: 'cheapest reversible secp256k1 point-add (quantum resource estimation / durability signal)',
  finders: FINDERS,
  heldApartRule:
    'Do NOT read or reason about which 9,024 test points will be drawn — they are hashed from your own op ' +
    'stream (Fiat-Shamir), so they cannot be tuned to. Propose the circuit on its merits; the Swordsman ' +
    'draws witnesses you cannot see. Tuning to the test set is collusion → a mirage.',
  measurePrompt: (round) =>
    `You are EOS (measure, don't guess) in the ecdsa.fail challenge at ${CHALLENGE}. ` +
    `\`ecdsafail submissions --all && ecdsafail sync\` for the REAL frontier; \`./island.sh measure <CFG>\` each ` +
    `lever (see ../ecdsafail_gpu_toolkit-main/docs/levers.md); rank by (baseline−CFG)×peak, prefer the biggest ` +
    `plausibly-findable STRUCTURAL win. Round ${round}. Return the frontier score, per-lever costs, top 1–2 levers.`,
  huntPrompt: (p, i) =>
    `You are ⿻ THE GAP (GPU island hunt). For proposal #${i} [${p.lever}=${p.value}] in ${CHALLENGE}: ` +
    `\`./island.sh measure ${p.lever}=${p.value}\` then \`./island.sh hunt ${p.lever}=${p.value} 1 ${RANGE}\` → ` +
    `GCD-clean nonce candidates (candidates, never results). Return candidates, measured Toffoli, peak qubits.`,
  assayPrompt: (p, h, i) =>
    `You are the SWORDSMAN ⚔️ carrying DOKIMÉ's 9,024 (load skills agentprivacy-horizon-gate, ` +
    `agentprivacy-cryptographic-durability). Proposal #${i} [${p.lever}=${p.value}]; candidates ` +
    `${JSON.stringify(h.candidates)} at ~${h.measuredTof}×${h.peakQubits}. (1) CLIFF-WATCHER: score ` +
    `Δ(Toffoli×qubits) vs frontier; reject break-even-cliff moves. (2) \`./island.sh validate "${p.lever}=${p.value}" <nonce>\` ` +
    `— only a full-9024 0/0/0 is validated; a probe-pass-then-fail is a MIRAGE, name and reject it. Return the ` +
    `best candidate's verdict, exact score, and whether it strictly beats the frontier. Never report a mirage as a result.`,
  criticPrompt: (validated, all) =>
    `You are POROS (structure over search). ${validated.length} validated frontier-beating result(s): ` +
    `${JSON.stringify(validated.map(v=>({nonce:v.nonce,score:v.score})))}. All: ` +
    `${JSON.stringify(all.map(v=>({verdict:v.verdict,score:v.score})))}. Classify structural / probe-limited / ` +
    `noise; give ONE source-backed next lead. Meta-lesson: small Toffoli cuts are probe-limited; real gains are a ` +
    `structural qubit-floor change or source-backed convergence relief in the inverse.`,
  schemas: { proposal, hunt, verdict, critic },
  stop: { dryRounds: 2, maxRounds: 12 },
  isValidated: (v) => v && v.validated && v.verdict === 'validated' && v.beatsFrontier,
  isStructural: (c) => c && c.classification === 'structural',
  hasCandidate: (h) => h && Array.isArray(h.candidates) && h.candidates.length > 0,  // PQC: a hunt with no GCD-clean nonces has nothing to assay
};
