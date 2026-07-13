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
Read ${ctx.repo}/notes/KILLED_LEVERS.md first; never re-propose a K-id without new cited evidence.
TODO: name the target artifact and what a diffPlan must reference. Propose exactly 1 lever through YOUR lens. Plan only — never implement.`,
    holdApart: (proposal, i, ctx) =>
      `Seat HOLD-APART — the Gap ⿻ (xor). Proposal artifact (verbatim):
${JSON.stringify(proposal)}
Canonically serialize it (recursive sorted keys, no whitespace) and SAVE those exact bytes to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json — it must persist, it is the auditor's only route to your seed. SHA-256 that file (show the exact command; sha256sum of the saved file must equal seedHex), then TODO: state the deterministic draw rule for this instance's witnesses. Write gap.json alongside it. Never accept proposer-suggested witnesses.`,
    assay: (proposal, gap, i, ctx) =>
      `Seat ASSAY — soulbis ⚔️ (neg), the prover.
Proposal: ${JSON.stringify(proposal)}
Gap: seed=${gap.seedHex}. Re-derive it the auditor's way first: sha256sum ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json must equal seedHex. BLOCKED if the file is missing or the digest does not reproduce. Transcript: ${gap.transcript}
TODO: the exact scratch-copy procedure (GR-10) and the full held-out gate to run on the Gap's witnesses. VALIDATED only if full gate pass AND hard constraint holds AND metric beats frontier. Otherwise MIRAGE (name the failing check) or BLOCKED. Write verdict.json to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/ with EXACTLY the schema's shape — flat fields, metric a bare number, no extra nesting. The file an auditor reads must match the data the orchestrator receives.`,
    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals: ${JSON.stringify(proposals)}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural/probe-limited/noise (red-team the proposer's rationale, never the prover's verdict); draft KILLED_LEVERS entries for structural kills; name exactly ONE next lead.`,
    chronicle: (round, ctx) =>
      `Seat CHRONICLE. Draft ${ctx.runDir}/CHRONICLE_DRAFT.md following ${ctx.root}/templates/chronicle.md: verdict-first, reversals at win-prominence, handoff block ending in the critic's nextLead. Round data: ${JSON.stringify(round)}. Return the path plus a 5-line verdict summary.`,
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
