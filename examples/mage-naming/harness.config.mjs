// harness.config.mjs — examples/mage-naming: compress a City of Mages tome act
// without losing what it teaches.
//
// Artefact: artifact/NAMING.md — Tome IV Act IV, "The Naming Ceremony" (the
// City of Mages tome act where a Sovereign arrives at V63 by a bilateral rite).
// Objective: words, down. Gate: a CENSUS over census.json — the cast, the
// vertex, the verb patterns, flaxscrip's Bitcoin block, the closing line, the
// lineage notes and the headings; a single dropped witness fails. Hard
// constraint: it must still tell the ceremony — the three moves, the contrast,
// the arrival at V63. Same self-style mechanism; a text-only prover can run it.

import { readFileSync } from 'node:fs'
import { checkText, countWords, CENSUS } from './tools/check_naming.mjs'

const SOURCE = readFileSync(new URL('./artifact/NAMING.md', import.meta.url), 'utf8')

export default {
  name: 'mage-naming',
  sourceFile: 'artifact/NAMING.md',

  objective: {
    metric: 'words of artifact/NAMING.md (whitespace-split tokens; tools/measure.mjs), lower is better',
    gate: `census over census.json (N=${CENSUS.length}): every witness string present in the candidate, whitespace-normalised (tools/check_naming.mjs); ${CENSUS.length}/${CENSUS.length} or the lever is MIRAGE (T5)`,
    hardConstraint: 'the candidate still tells the Naming Ceremony: the arrival at V63 / the Sovereign Anchor; the three bilateral moves claim → inscribe → confirm and their contrast with the transactional register → assert → verify; flaxscrip\'s witnesses and his Bitcoin block 945508 inscription; the closing line "I am because we were"; the cast (Soulbis, Soulbae, GenitriX, flaxscrip); the proverb and the V6 lineage notes; nothing invented (GR-3)',
    canary: 'artifact/NAMING.md itself: the census was written from it, so it passes N/N by construction; a failing candidate is the candidate\'s fault, never the gate\'s',
  },

  door: 'first-person',

  gate: { N: CENSUS.length, count: 8, mode: 'census', censusThreshold: 200 },

  heldApartRule:
    'You are BLIND to verification witnesses (T2/GR-4). This is a CENSUS gate: every ' +
    'required string is probed, so there is nothing to tune to — the only winning ' +
    'strategy is to keep every cast name, the vertex V63 and Sovereign Anchor, the ' +
    'two verb patterns verbatim, flaxscrip\'s Bitcoin block, the closing line, the ' +
    'proverb, the lineage notes and the section headings exactly as written while ' +
    'cutting the prose around them. Do not guess at the witness list; preserve all ' +
    'operative content.',

  keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml', 'artifact/NAMING.md'],

  finders: [
    { lens: 'line-editor', hint: 'sentence-level compression: cut redundancy, filler and throat-clearing; convert passive to active; never drop a cast name, the vertex, a verb pattern, the Bitcoin block, the closing line, the proverb, a lineage note or a heading' },
    { lens: 'restructurer', hint: 'structure-level compression: merge overlapping passages, turn prose into tables or lists where denser, collapse preamble; never drop a cast name, the vertex, a verb pattern, the Bitcoin block, the closing line, the proverb, a lineage note or a heading' },
  ],

  prompts: {
    measure: (ctx) =>
      `Seat MEASURE. The counting rule ran code-side: ${JSON.stringify(ctx.args.measured)} (metric = words of artifact/NAMING.md; census N = ${CENSUS.length}). Read ${ctx.repo}/frontier.json; stale = true only if best.metric differs from the measured metric. Price the two lenses (line-editor, restructurer) by how many words each could plausibly remove without dropping a witness. Return JSON per the schema: { metric, stale, leverCosts, notes }. Numbers only, no advocacy.`,

    propose: (finder, measure, ctx) =>
      `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
The act to compress is below between the markers. Propose exactly ONE lever: a complete rewrite of the whole act, shorter, in the compressedText field (the full candidate text, markdown, no commentary). Keep every cast name (Soulbis, Soulbae, the Drake, GenitriX, flaxscrip), the vertex V63 and the Sovereign Anchor, both verb patterns verbatim (claim → inscribe → confirm and register → assert → verify), flaxscrip's Bitcoin block 945508, the closing line "I am because we were", the proverb, the V6 lineage notes, and the section headings. expectedMetric = your candidate's word count. leverId must be a short descriptive slug naming the lever (for example "tighten-ceremony-prose" or "list-the-verb-patterns"), never a bare number. Return JSON per the schema: { proposals: [{ leverId, title, lens, rationale, expectedMetric, hardConstraintNote, diffPlan, compressedText }] }. Plan and rewrite only — write no files.
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
The code-side gate already ran on the candidate (tools/check_naming.mjs): ${JSON.stringify({ N: census.N, passed: census.passed, missing: census.missing })}. Candidate word count: ${words}. Frontier best (read ${ctx.repo}/frontier.json): the number to beat.
Your job is the part code cannot do — the hard constraint. Read the candidate below and decide: does it still tell the Naming Ceremony (the arrival at V63 / Sovereign Anchor; the three bilateral moves claim → inscribe → confirm contrasted with register → assert → verify; flaxscrip's witnesses and his Bitcoin block 945508; the closing line "I am because we were"; the cast; the proverb and lineage notes; nothing invented)?
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

  isValidated: (v) => v.status === 'VALIDATED',
  isStructural: (critic, leverId) => (critic.classifications || []).some(c => c.leverId === leverId && c.class === 'structural'),

  conformChecks: [
    (f) => (f.gate && f.gate.N === CENSUS.length) ? [] : [`frontier.gate.N must equal the census length ${CENSUS.length}`],
  ],
}
