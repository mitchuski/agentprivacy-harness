// harness.config.mjs — blank harness config. Copy this next to your target
// artifact, fill every TODO, then bundle:
//   node tools/bundle.mjs <this file> <out>.workflow.mjs
// Contract: SEAT_CONTRACT.md. Constitution: TRUSTS.md. Define the Gap FIRST —
// if you cannot say how held-out witnesses derive from a proposal, you do not
// have a harness yet, you have a to-do list.

export default {
  name: 'TODO-my-harness',

  objective: {
    metric: 'TODO — what frontier.json tracks, lower is better',
    gate: 'TODO — the held-out check that must fully pass (T5: zero collapses)',
    hardConstraint: 'TODO — validity no score can override (GR-3)',
    // TODO — the CANARY: name an artifact (or the procedure that builds one)
    // that passes `gate` BY CONSTRUCTION. Usually it is the current artifact,
    // unoptimised. Without a canary you cannot tell a bad candidate from an
    // impossible gate: every lens scores zero and the critic blames the
    // proposer. conform.mjs advises on this today and may refuse it tomorrow.
    canary: 'TODO — what passes the gate by construction, and why',
  },

  door: 'first-person', // T6 — leave exactly as is; conform.mjs checks the literal

  // The gate's population and mode (D2). N = the size of your witness bank.
  // If N is small and enumerable, use 'census' — probe every witness; a sample
  // that misses one is theatre, and conform.mjs REFUSES 'sample' at
  // N <= censusThreshold. Only sample when the bank is genuinely too large to
  // check in full, and then print the detection probability next to the verdict.
  gate: { N: 0 /* TODO — your witness-bank size */, count: 8, mode: 'census', censusThreshold: 200 },

  heldApartRule:
    'You are BLIND to verification witnesses (T2/GR-4). Witnesses are derived ' +
    'by hashing your proposal artifact after you finish; you never see, choose, ' +
    'or influence them. Do not suggest test inputs, seeds, points, or questions. ' +
    'TODO: add the instance-specific sentence (what kind of witnesses exist here).',

  keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml'],

  finders: [
    { lens: 'TODO-lens-a', hint: 'TODO — what this lens looks for' },
    { lens: 'TODO-lens-b', hint: 'TODO — a genuinely different angle (for a product objective: one lens per factor)' },
  ],

  prompts: {
    measure: (ctx) =>
      `Seat MEASURE. TODO: the exact command/counting rule that re-derives the current metric at ${ctx.repo}; compare to frontier.json, flag stale; price each lever family. Numbers only, no advocacy.`,
    propose: (finder, measure, ctx) =>
      `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
TODO: supply the killed-lever ledger as authorized input; never re-propose a K-id without new cited evidence.
TODO: name the target artifact and what a diffPlan must reference. Propose exactly 1 lever through YOUR lens. Plan only — never implement.`,
    holdApart: (proposal, i, ctx, derived) =>
      `Seat HOLD-APART. Return data only; the host hashes and saves it.
Proposal: ${JSON.stringify(proposal)}
Engine derivation: ${JSON.stringify(derived)}
TODO: supply the frozen witness bank as authorized input and map derived.drawIndices to its witnesses. Return the supplied seedHex, draw, and transcript. Do not invent a seed or recompute an unsalted hash. If the derivation or bank is absent, return null.`,
    assay: (proposal, gap, i, ctx) =>
      `Seat ASSAY. Return data only; the host persists verdict.json.
Proposal: ${JSON.stringify(proposal)}
Gap: ${JSON.stringify(gap)}
TODO: supply authorized candidate/source inputs and the exact full-gate evidence from an executable adapter, or define an explicitly labelled semantic assessment. API-only seats cannot run shell commands or read local paths. Missing required inputs or executable evidence means BLOCKED. Never claim tests were executed from a description.
VALIDATED requires full gate pass, hard constraint intact, and a measured frontier beat.`,
    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals: ${JSON.stringify(proposals)}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural/probe-limited/noise/mis-gated (red-team the proposer's rationale, never the prover's verdict); draft KILLED_LEVERS entries for structural kills; name exactly ONE next lead.`,
    chronicle: (round, ctx) =>
      `Seat CHRONICLE. Draft ${ctx.runDir}/CHRONICLE_DRAFT.md following ${ctx.root}/templates/chronicle.md: verdict-first, reversals at win-prominence, handoff block ending in the critic's nextLead. Round data: ${JSON.stringify(round)}. Return the Markdown draft itself; the host persists it.`,
  },

  schemas: {
    measure: {
      type: 'object', required: ['metric', 'stale', 'leverCosts'],
      properties: {
        metric: { type: 'number' },
        stale: { type: 'boolean' },
        leverCosts: { type: 'array', items: { type: 'object', required: ['lever', 'cost', 'ceiling'], properties: { lever: { type: 'string' }, cost: { type: 'string' }, ceiling: { type: 'string' } } } },
        notes: { type: 'string' },
      },
    },
    proposal: {
      type: 'object', required: ['proposals'],
      properties: {
        proposals: {
          type: 'array', minItems: 1,
          items: {
            type: 'object',
            required: ['leverId', 'title', 'lens', 'rationale', 'expectedMetric', 'hardConstraintNote', 'diffPlan'],
            properties: {
              leverId: { type: 'string' }, title: { type: 'string' }, lens: { type: 'string' },
              rationale: { type: 'string' }, expectedMetric: { type: 'number' },
              hardConstraintNote: { type: 'string' }, diffPlan: { type: 'string' },
              killedLeverCitations: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    gap: {
      type: 'object', required: ['seedHex', 'draw', 'transcript'],
      properties: {
        seedHex: { type: 'string' },
        draw: { type: 'string', description: 'the witnesses drawn, as data' },
        transcript: { type: 'string', description: 'serialization + hash command + draw rule, third-party re-derivable' },
      },
    },
    verdict: {
      type: 'object', required: ['leverId', 'status', 'evidence'],
      properties: {
        leverId: { type: 'string' },
        status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] },
        metric: { type: 'number' }, gateResult: { type: 'string' },
        failingCheck: { type: 'string' }, evidence: { type: 'string' }, scratchDir: { type: 'string' },
      },
    },
    critic: {
      type: 'object', required: ['classifications', 'nextLead'],
      properties: {
        classifications: { type: 'array', items: { type: 'object', required: ['leverId', 'class', 'why'], properties: { leverId: { type: 'string' }, class: { type: 'string', enum: ['structural', 'probe-limited', 'noise', 'mis-gated'] }, why: { type: 'string' } } } },
        nextLead: { type: 'string' },
        killedLeverDrafts: { type: 'array', items: { type: 'string' } },
      },
    },
  },

  stop: { dryRounds: 2, maxRounds: 5 },

  isValidated: (v) => v.status === 'VALIDATED',
  isStructural: (critic, leverId) =>
    (critic.classifications || []).some(c => c.leverId === leverId && c.class === 'structural'),

  // optional: instance-specific numeric checks conform.mjs runs on frontier.json
  conformChecks: [],
}
