// harness.config.mjs — examples/corpus: your own documents under a census.
//
// This instance is mostly an auditor (ADOPTION.md step 0): the claim set is
// enumerable, so tools/census.mjs IS the gate and needs no model. The seats
// exist for the part a script cannot do — read a source that moved and draft
// the next record — and the census decides what they proposed.

import { readFileSync } from 'node:fs'
import { census } from './tools/census.mjs'

const RECORDS = JSON.parse(readFileSync(new URL('./kb/records.json', import.meta.url), 'utf8'))
const CLAIMS = RECORDS.reduce((n, r) => n + (r.claims || []).length, 0)

export default {
  name: 'corpus',

  objective: {
    metric: 'weak traces — claims whose only evidence is a memory file rather than the source document (tools/census.mjs → weak); lower is better',
    gate: `the trace census over kb/records.json (N=${CLAIMS} claims): every claim's file still contains its quote and every number in a record's prose appears in a claim — untraced 0, unquoted 0 (tools/census.mjs --gate; T5)`,
    hardConstraint: 'the auditor reads corpus/ and never writes into it; no number enters a record without a quote from a file; a rendering that cites the records is never a source (GR-3)',
    canary: 'kb/records.json as shipped: every quote was copied from the file it cites, so the census passes by construction; a failure later is a document that moved or a record that lied',
  },

  door: 'first-person',

  gate: { N: CLAIMS, count: 8, mode: 'census', censusThreshold: 200 },

  heldApartRule:
    'You are BLIND to which claims the census will re-read (T2/GR-4). Every claim is ' +
    'probed, every number checked against a quote, so there is nothing to tune to: ' +
    'quote what the file says, with its path. Never paraphrase a number; never cite a ' +
    'summary where the document exists.',

  keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml', 'kb/records.json'],

  finders: [
    { lens: 'source-reader', hint: 'open ONE document in corpus/ and draft or refresh the record for what it asserts: one claim per number, the exact quote, the path' },
    { lens: 'trace-upgrader', hint: 'take ONE claim of kind memory and find the document that carries it; replace source, quote and kind; if no document does, say so and leave it weak' },
  ],

  prompts: {
    measure: (ctx) =>
      `Seat MEASURE. The census ran code-side: ${JSON.stringify(ctx.args.measured || census())}. Read ${ctx.repo}/frontier.json; stale = true if weak differs from best.metric. Price each lens by how many weak or stale claims it could clear. Return JSON per the schema: { metric (weak), stale, leverCosts, notes }. Numbers only.`,
    propose: (finder, measure, ctx) =>
      `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
The records are in ${ctx.repo}/kb/records.json; the documents in ${ctx.repo}/corpus/. Propose exactly ONE lever: a replacement record or a replacement claim as JSON text in recordJson, with source (a path under corpus/), quote (verbatim), kind (disk|memory), read (today). Return JSON per the schema. Plan only — write nothing.`,
    holdApart: (proposal, i, ctx, derived) =>
      `Seat HOLD-APART — the Gap ⿻ (xor)${derived ? ', SALTED mode' : ''}. ${derived ? `The engine derived seedHex = ${derived.seedHex} for proposal ${proposal.leverId}.` : ''} This is a CENSUS: the witness bank is every (source, quote) pair in the proposed record. Return JSON per the schema: { seedHex (the engine's, verbatim), draw ("census: every source/quote pair of the proposal"), transcript (the canonical serialisation rule and the re-derivation a third party runs with tools/verify_run.mjs) }.`,
    assay: (proposal, gap, i, ctx) =>
      `Seat ASSAY — soulbis ⚔️ (neg), the prover.
Gap seed = ${gap.seedHex}. Proposal: ${JSON.stringify(proposal)}.
Probe EVERY (source, quote) pair in the proposal's recordJson against the file under ${ctx.repo}/corpus/, whitespace-normalised, exactly as tools/census.mjs does; check every number in its recorded prose appears in a claim; check the hard constraint (no write into corpus/, no summary cited as a source). VALIDATED only if every pair traces AND no number is unquoted AND weak after the merge is strictly below frontier best (or the bank grows with weak not above best). Otherwise MIRAGE with failingCheck named, or BLOCKED. Return JSON per the schema: { leverId: "${proposal.leverId}", status, metric (weak after merge), gateResult "traced/claims", failingCheck, evidence, scratchDir: "${ctx.runDir}/p${i + 1}-${proposal.leverId}" }.`,
    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals: ${JSON.stringify(proposals.map(p => ({ leverId: p.leverId, lens: p.lens, title: p.title, expectedMetric: p.expectedMetric })))} Verdicts: ${JSON.stringify(verdicts)}. Classify each closed lever structural / probe-limited / noise (red-team the proposer's reading of the document, never the prover's verdict); draft KILLED_LEVERS entries for structural kills (a remembered number no document carries stays weak until a document carries it); name exactly ONE next lead. Return JSON per the schema.`,
    chronicle: (round, ctx) =>
      `Seat CHRONICLE. Draft the round's chronicle in markdown: verdict first (weak before → after, claims before → after), what happened, reversals at the same prominence as wins, ledger entries proposed, handoff ending in the critic's nextLead. Round data: ${JSON.stringify({ roundId: round.roundId, measure: round.measure, verdicts: round.verdicts, critic: round.critic })}.`,
  },

  schemas: {
    measure: { type: 'object', required: ['metric', 'stale', 'leverCosts'], properties: { metric: { type: 'number' }, stale: { type: 'boolean' }, leverCosts: { type: 'array', items: { type: 'object', required: ['lever', 'cost', 'ceiling'], properties: { lever: { type: 'string' }, cost: { type: 'string' }, ceiling: { type: 'string' } } } }, notes: { type: 'string' } } },
    proposal: { type: 'object', required: ['proposals'], properties: { proposals: { type: 'array', minItems: 1, items: { type: 'object', required: ['leverId', 'title', 'lens', 'rationale', 'expectedMetric', 'hardConstraintNote', 'diffPlan', 'recordJson'], properties: { leverId: { type: 'string' }, title: { type: 'string' }, lens: { type: 'string' }, rationale: { type: 'string' }, expectedMetric: { type: 'number' }, hardConstraintNote: { type: 'string' }, diffPlan: { type: 'string' }, recordJson: { type: 'string' } } } } } },
    gap: { type: 'object', required: ['seedHex', 'draw', 'transcript'], properties: { seedHex: { type: 'string' }, draw: { type: 'string' }, transcript: { type: 'string' } } },
    verdict: { type: 'object', required: ['leverId', 'status', 'evidence'], properties: { leverId: { type: 'string' }, status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] }, metric: { type: 'number' }, gateResult: { type: 'string' }, failingCheck: { type: 'string' }, evidence: { type: 'string' }, scratchDir: { type: 'string' } } },
    critic: { type: 'object', required: ['classifications', 'nextLead'], properties: { classifications: { type: 'array', items: { type: 'object', required: ['leverId', 'class', 'why'], properties: { leverId: { type: 'string' }, class: { type: 'string', enum: ['structural', 'probe-limited', 'noise'] }, why: { type: 'string' } } } }, nextLead: { type: 'string' }, killedLeverDrafts: { type: 'array', items: { type: 'string' } } } },
  },

  stop: { dryRounds: 2, maxRounds: 3 },
  isValidated: (v) => v.status === 'VALIDATED',
  isStructural: (critic, leverId) => (critic.classifications || []).some(c => c.leverId === leverId && c.class === 'structural'),

  conformChecks: [
    (f) => (f.gate && f.gate.untraced === 0 && f.gate.unquoted === 0) ? [] : ['frontier.gate must record untraced 0 and unquoted 0'],
    (f) => (f.gate && f.gate.claims === CLAIMS) ? [] : [`frontier.gate.claims must equal the claim count ${CLAIMS}`],
  ],
}
