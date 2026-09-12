// harness.config.mjs — examples/self: the harness folds its own newcomer path.
//
// Artefact: artifact/PATH.md, the default distribution's README. Objective:
// words, down. Gate: a CENSUS over census.json — every command, file, trust,
// ground rule, seat, phase and term a newcomer must still be able to find; a
// single dropped witness fails. Hard constraint: it must still read as the
// document a stranger opens first — precise on actions, in order.
//
// Seats are pure data (drivers/run.mjs persists everything). The gate itself
// is code (tools/check_path.mjs): the assay prompt carries the code-side census
// result for the candidate, and the prover's job is the part code cannot do —
// judge the hard constraint — then return the verdict the numbers allow.

import { readFileSync } from 'node:fs'
import { checkText, countWords, CENSUS } from './tools/check_path.mjs'

const SOURCE = readFileSync(new URL('./artifact/PATH.md', import.meta.url), 'utf8')

export default {
  name: 'self',
  sourceFile: 'artifact/PATH.md',

  objective: {
    metric: 'words of artifact/PATH.md (whitespace-split tokens; tools/measure.mjs), lower is better',
    gate: `census over census.json (N=${CENSUS.length}): every witness string present in the candidate, whitespace-normalised (tools/check_path.mjs); ${CENSUS.length}/${CENSUS.length} or the lever is MIRAGE (T5)`,
    hardConstraint: 'the candidate is still the document a stranger opens first: the five commands stay in order with what each writes, the loop table, the adoption steps, the constitution list, the box layout; no pointer back to a longer version; nothing invented (GR-3)',
    canary: 'artifact/PATH.md itself: the census was written from it, so it passes N/N by construction; a failing candidate is the candidate\'s fault, never the gate\'s',
  },

  door: 'first-person',

  gate: { N: CENSUS.length, count: 8, mode: 'census', censusThreshold: 200 },

  heldApartRule:
    'You are BLIND to verification witnesses (T2/GR-4). This is a CENSUS gate: every ' +
    'required string is probed, so there is nothing to tune to — the only winning ' +
    'strategy is to keep every command, file name, trust, ground rule, seat, phase ' +
    'and term exactly as written while cutting everything around them. Do not guess ' +
    'at the witness list; preserve all operative content.',

  keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml', 'artifact/PATH.md'],

  finders: [
    { lens: 'line-editor', hint: 'sentence-level compression: cut redundancy, filler and throat-clearing; convert passive to active; never drop a command, a file name, an identifier, a step or a number' },
    { lens: 'restructurer', hint: 'structure-level compression: merge overlapping sections, turn prose into tables or lists where denser, collapse preamble; never drop a command, a file name, an identifier, a step or a number' },
  ],

  prompts: {
    measure: (ctx) =>
      `Seat MEASURE. The counting rule ran code-side: ${JSON.stringify(ctx.args.measured)} (metric = words of artifact/PATH.md; census N = ${CENSUS.length}). Read ${ctx.repo}/frontier.json; stale = true only if best.metric differs from the measured metric. Price the two lenses (line-editor, restructurer) by how many words each could plausibly remove without dropping a witness. Return JSON per the schema: { metric, stale, leverCosts, notes }. Numbers only, no advocacy.`,

    propose: (finder, measure, ctx) =>
      `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
The document to compress is below between the markers. Propose exactly ONE lever: a complete rewrite of the whole document, shorter, in the compressedText field (the full candidate text, markdown, no commentary). Keep every command line, every file and directory name, every T1–T6 and GR-1–GR-10, every seat and phase name, the inscription line, the three verdict words, the adoption steps and the box layout. expectedMetric = your candidate's word count. leverId must be a short descriptive slug naming the lever (for example "merge-loop-and-seats" or "tighten-intro"), never a bare number. Return JSON per the schema: { proposals: [{ leverId, title, lens, rationale, expectedMetric, hardConstraintNote, diffPlan, compressedText }] }. Plan and rewrite only — write no files.
<<STUB-SOURCE>>
${SOURCE}
<</STUB-SOURCE>>`,

    holdApart: (proposal, i, ctx, derived) =>
      `Seat HOLD-APART — the Gap ⿻ (xor)${derived ? ', SALTED mode' : ''}. The engine has ${derived ? 'already derived' : 'not derived'} the seed for proposal ${proposal.leverId}${derived ? `: seedHex = ${derived.seedHex} (hProposal = ${derived.hProposal}, salt = ${derived.salt}, mode = ${derived.mode}, N = ${derived.N})` : ''}.
This is a CENSUS: the witness bank is every entry of census.json, all ${CENSUS.length}, in order. Return JSON per the schema: { seedHex (the engine's, verbatim), draw ("census: all ${CENSUS.length} witnesses of census.json, in order"), transcript (one paragraph: the canonical serialisation rule — recursive sorted keys, no whitespace — and that a third party re-derives hProposal as sha256 of proposal_canon.json and the seed as sha256 of hProposal + salt) }. Do not restate the witnesses; do not read the candidate.`,

    assay: (proposal, gap, i, ctx) => {
      const text = String(proposal.compressedText || '')
      const census = checkText(text)
      const words = countWords(text)
      return `Seat ASSAY — soulbis ⚔️ (neg), the prover.
Gap seed = ${gap.seedHex}. The runner saves the proposal's canonical bytes to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json; a third party re-derives the seed from them (tools/verify_run.mjs).
The code-side gate already ran on the candidate (tools/check_path.mjs): ${JSON.stringify({ N: census.N, passed: census.passed, missing: census.missing })}. Candidate word count: ${words}. Frontier best (read ${ctx.repo}/frontier.json): the number to beat.
Your job is the part code cannot do — the hard constraint. Read the candidate below and decide: is it still the document a stranger opens first (five commands in order with what each writes, the loop table, the adoption steps, the constitution, the box layout, nothing invented, no pointer to a longer version)?
Verdict VALIDATED only if passed == N AND the hard constraint holds AND ${words} < frontier best. If passed < N: MIRAGE, failingCheck = "census: missing " + the missing witnesses. If the hard constraint fails: MIRAGE with the reason. Return JSON per the schema: { leverId: "${proposal.leverId}", status, metric: ${words}, gateResult: "${census.passed}/${census.N}", failingCheck, evidence (what you checked, two or three sentences), scratchDir: "${ctx.runDir}/p${i + 1}-${proposal.leverId}" }.
CANDIDATE:
${text}`
    },

    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals: ${JSON.stringify(proposals.map(p => ({ leverId: p.leverId, lens: p.lens, title: p.title, expectedMetric: p.expectedMetric })))}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural / probe-limited / noise: structural if it VALIDATED by removing redundancy no witness needed; probe-limited if it failed the census on witnesses the lens dropped; noise otherwise. Red-team the proposer's rationale, never the prover's verdict. Draft KILLED_LEVERS entries for structural kills (a lever that dropped a witness is a structural kill: that witness is operative). Name exactly ONE next lead. Return JSON per the schema.`,

    chronicle: (round, ctx) =>
      `Seat CHRONICLE. Draft the round's chronicle in markdown, verdict first (metric before → after per validated lever, gate N/N), what happened phase by phase, reversals at the same prominence as wins, ledger entries proposed, and a handoff ending in the critic's nextLead. Round data: ${JSON.stringify({ roundId: round.roundId, measure: round.measure, verdicts: round.verdicts, critic: round.critic })}.`,
  },

  schemas: {
    measure: { type: 'object', required: ['metric', 'stale', 'leverCosts'], properties: { metric: { type: 'number' }, stale: { type: 'boolean' }, leverCosts: { type: 'array', items: { type: 'object', required: ['lever', 'cost', 'ceiling'], properties: { lever: { type: 'string' }, cost: { type: 'string' }, ceiling: { type: 'string' } } } }, notes: { type: 'string' } } },
    proposal: { type: 'object', required: ['proposals'], properties: { proposals: { type: 'array', minItems: 1, items: { type: 'object', required: ['leverId', 'title', 'lens', 'rationale', 'expectedMetric', 'hardConstraintNote', 'diffPlan', 'compressedText'], properties: { leverId: { type: 'string' }, title: { type: 'string' }, lens: { type: 'string' }, rationale: { type: 'string' }, expectedMetric: { type: 'number' }, hardConstraintNote: { type: 'string' }, diffPlan: { type: 'string' }, compressedText: { type: 'string' } } } } } },
    gap: { type: 'object', required: ['seedHex', 'draw', 'transcript'], properties: { seedHex: { type: 'string' }, draw: { type: 'string' }, transcript: { type: 'string' } } },
    verdict: { type: 'object', required: ['leverId', 'status', 'evidence'], properties: { leverId: { type: 'string' }, status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] }, metric: { type: 'number' }, gateResult: { type: 'string' }, failingCheck: { type: 'string' }, evidence: { type: 'string' }, scratchDir: { type: 'string' } } },
    critic: { type: 'object', required: ['classifications', 'nextLead'], properties: { classifications: { type: 'array', items: { type: 'object', required: ['leverId', 'class', 'why'], properties: { leverId: { type: 'string' }, class: { type: 'string', enum: ['structural', 'probe-limited', 'noise'] }, why: { type: 'string' } } } }, nextLead: { type: 'string' }, killedLeverDrafts: { type: 'array', items: { type: 'string' } } } },
  },

  stop: { dryRounds: 2, maxRounds: 3 },

  // VALIDATED must also beat the frontier and pass the code-side census — the
  // prover is asked to say so, and the keystone re-checks with tools/check_path.mjs
  // on candidate.md before folding.
  isValidated: (v) => v.status === 'VALIDATED',
  isStructural: (critic, leverId) => (critic.classifications || []).some(c => c.leverId === leverId && c.class === 'structural'),

  conformChecks: [
    (f) => (f.gate && f.gate.N === CENSUS.length) ? [] : [`frontier.gate.N must equal the census length ${CENSUS.length}`],
  ],
}
