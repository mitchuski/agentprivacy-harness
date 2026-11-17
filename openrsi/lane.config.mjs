// openrsi/lane.config.mjs — the seat-contract config for an OpenRSI lane.
//
// Problem-agnostic by construction. Nothing here knows what the assigned task
// is: the statement, the scaffold, the candidate paths and the research library
// all arrive at run time from the task service, and every seat reads them
// there. What this file fixes is the method: who proposes, who builds and runs
// the gate, where the witnesses come from, and who may move the frontier.
//
// The Gap in this lane is the trusted evaluator. Its test inputs are derived
// by the evaluator from the frozen candidate, after the candidate is frozen;
// no seat sees, chooses or influences them (T2/GR-4). The Gap seat is therefore
// held by code (openrsi/enter.mjs): it canonicalises the committed proposal,
// hashes it, and persists the exact bytes, so every verdict is bound to the
// proposal it judged.

export const slug = (s) => String(s || 'lever').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'lever'
export const DATA = (o) => `<<DATA>>${JSON.stringify(o)}<</DATA>>`
export const readData = (prompt) => { const m = /<<DATA>>([\s\S]*?)<<\/DATA>>/.exec(String(prompt)); return m ? JSON.parse(m[1]) : null }

// lane = { name, instance, workspace, candidatePaths, bestDir, evaluateHint, sessionMinutes, direction }
export function makeConfig(lane) {
  const cps = lane.candidatePaths
  const artifact = `the current best candidate, saved at ${lane.bestDir}/ (mirroring the task's candidate path${cps.length > 1 ? 's' : ''} ${cps.map(p => '`' + p + '`').join(', ')}); read-only`
  const taskDocs = `The assigned task statement is the \`instruction\` field of the JSON file named by $OPENRSI_TASK; read it before anything else in this prompt. The assigned research library catalogue is at $OPENRSI_KNOWLEDGE_BASE_URL (fetch entries with the \`web\` helper or curl, convert PDFs with pdftotext; there is no other network). ${lane.instance}/notes/LIBRARY.md holds what earlier seats already extracted from it: read that first and do not re-read a source it already covers.`
  return {
    name: lane.name,
    objective: {
      metric: `the trusted evaluator's score for the assigned task, ${lane.direction === 'max' ? 'higher' : 'lower'} is better (frontier.json)`,
      gate: 'the trusted `evaluate` command reports the candidate fully valid at its final validation stage; an earlier stage passing is a probe, never a pass (GR-5)',
      hardConstraint: "the task's own validity rules: only permitted content in the candidate paths, trusted and read-only files untouched, nothing recalled or reproduced from an existing solution",
      canary: 'the first candidate the evaluator reports fully valid, built in the canary phase before round 1; until it exists there is no frontier and no round is opened',
    },
    door: 'first-person',
    heldApartRule:
      'You are BLIND to verification witnesses (T2/GR-4). The trusted evaluator derives its test inputs from the frozen candidate after you have finished; ' +
      'you never see, choose or influence them. Do not suggest test inputs, seeds, points or questions, and do not shape a proposal around inputs you imagine.',
    keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml', 'notes/KILLED_LEVERS.md', 'notes/LIBRARY.md', 'notes/NEXT_LEAD.md', 'best/'],
    finders: [
      { lens: 'dominant-term', hint: 'by counting in the current candidate, find the single largest contributor to the metric and propose the smallest change that reduces it without raising another term past break-even' },
      { lens: 'structure', hint: 'propose replacing ONE component with a different construction, grounded in a named source from the assigned library, that changes the shape of the cost rather than trimming it' },
    ],
    prompts: {
      measure: (ctx) => `Seat MEASURE (held by code in this lane). ${DATA({ seat: 'measure', roundId: ctx.roundId })}`,
      propose: (finder, measure, ctx) =>
        `Seat PROPOSE, soulbae (bnot), lens = ${finder.lens}: ${finder.hint}
${taskDocs}
Frontier context (measured by code, not by a seat): ${JSON.stringify(measure)}
Target artifact: ${artifact}.
Killed levers: read ${lane.instance}/notes/KILLED_LEVERS.md and cite it; never re-propose a K-id without new cited evidence.
Propose exactly 1 lever through YOUR lens. Plan only, never implement, write no file. Your diffPlan must name real files and real parts of the target artifact and be specific enough for another agent to build without asking you anything. expectedMetric is your honest estimate of the evaluator's score after the change.
If you read library sources, return what a later seat must know about them in \`libraryNotes\` (source id, what it contains, what is usable; short and factual); the keystone files it.`,
      holdApart: (proposal, i, ctx) => `Seat HOLD-APART (held by code in this lane). ${DATA({ seat: 'gap', proposal, i, runDir: ctx.runDir })}`,
      assay: (proposal, gap, i, ctx) => {
        const scratch = `${ctx.runDir}/p${i + 1}-${slug(proposal.leverId)}`
        return `Seat ASSAY, soulbis (neg).
${taskDocs}
Proposal (committed; its canonical bytes are in ${scratch}/proposal_canon.json): ${JSON.stringify(proposal)}
Gap: ${JSON.stringify(gap)}
Your scratch directory is ${scratch}/ and you write nowhere else.
1. Copy ${lane.bestDir}/ to ${scratch}/candidate/ (same layout). Never edit ${lane.bestDir}/ or the candidate path inside ${lane.workspace}.
2. Implement the proposal's diffPlan in ${scratch}/candidate/. Build what was proposed; if it cannot be built as proposed, that is BLOCKED or MIRAGE, not an invitation to substitute your own lever.
3. Run the FULL gate: ${lane.evaluateHint.replace(/\{CANDIDATE\}/g, `${scratch}/candidate`)} Run \`evaluate --help\` once if the arguments are unclear. Keep the evaluator's JSON output in ${scratch}/evaluate.json. Evaluator runs are a limited, shared resource for the whole run (its output and \`run-status\` report how many remain): reason and self-check before each one, and never spend one on a candidate you already know is broken.
4. Verdict: VALIDATED only if the evaluator reports the candidate fully valid AND its score beats frontier.json. Otherwise MIRAGE (name the failing check) or BLOCKED (name the missing piece). \`metric\` is the evaluator's score, a bare number. \`scratchDir\` is exactly "${scratch}". Write the same object to ${scratch}/verdict.json.
You have about ${lane.sessionMinutes} minutes and a shared model budget: when the lever is clearly a mirage, stop and say so. The keystone re-runs the evaluator on your frozen scratch before anything is folded, so a verdict that overstates will be caught and recorded.`
      },
      critic: (proposals, verdicts, ctx) =>
        `Seat CRITIC. Text only: use no tools and read no files beyond your boot files.
Proposals: ${JSON.stringify(proposals)}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural / probe-limited / noise / mis-gated (red-team the proposer's rationale, never the prover's verdict). Draft one KILLED_LEVERS table row (markdown, columns: lever | died how | boundary | reopen when | evidence) for each structural kill. Name exactly ONE next lead in one sentence.`,
      chronicle: (round, ctx) => `Seat CHRONICLE (held by code in this lane). ${DATA({ seat: 'chronicle', roundId: round.roundId, proposals: (round.proposals || []).map(p => ({ leverId: p.leverId, lens: p.lens, title: p.title, expectedMetric: p.expectedMetric })), verdicts: round.verdicts, critic: round.critic })}`,
    },
    schemas: {
      measure: { type: 'object', required: ['metric', 'stale', 'leverCosts'], properties: { metric: { type: ['number', 'null'] }, stale: { type: 'boolean' }, leverCosts: { type: 'array' }, notes: { type: 'string' } } },
      proposal: {
        type: 'object', required: ['proposals'],
        properties: { proposals: { type: 'array', minItems: 1, maxItems: 1, items: {
          type: 'object', required: ['leverId', 'title', 'lens', 'rationale', 'expectedMetric', 'hardConstraintNote', 'diffPlan'],
          properties: { leverId: { type: 'string' }, title: { type: 'string' }, lens: { type: 'string' }, rationale: { type: 'string' }, expectedMetric: { type: 'number' },
            hardConstraintNote: { type: 'string' }, diffPlan: { type: 'string' }, killedLeverCitations: { type: 'array', items: { type: 'string' } }, libraryNotes: { type: 'string' } } } } },
      },
      gap: { type: 'object', required: ['seedHex', 'draw', 'transcript'], properties: { seedHex: { type: 'string' }, draw: { type: 'string' }, transcript: { type: 'string' } } },
      verdict: { type: 'object', required: ['leverId', 'status', 'evidence'],
        properties: { leverId: { type: 'string' }, status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] }, metric: { type: 'number' }, gateResult: { type: 'string' },
          failingCheck: { type: 'string' }, evidence: { type: 'string' }, scratchDir: { type: 'string' } } },
      critic: { type: 'object', required: ['classifications', 'nextLead'],
        properties: { classifications: { type: 'array', items: { type: 'object', required: ['leverId', 'class', 'why'], properties: { leverId: { type: 'string' }, class: { type: 'string', enum: ['structural', 'probe-limited', 'noise', 'mis-gated'] }, why: { type: 'string' } } } },
          nextLead: { type: 'string' }, killedLeverDrafts: { type: 'array', items: { type: 'string' } } } },
    },
    // One round per engine run: the keystone (enter.mjs) folds between runs,
    // so every round boots from a frontier the previous round's verdicts moved.
    stop: { dryRounds: 1, maxRounds: 1 },
    isValidated: (v) => v.status === 'VALIDATED',
    isStructural: (critic, leverId) => (critic.classifications || []).some(c => c.leverId === leverId && c.class === 'structural'),
    conformChecks: [],
  }
}

// The canary seat: the assay seat's build-and-gate procedure with no proposal
// to judge, only the gate to pass. Returns the verdict schema.
export function canaryPrompt(lane, scratch, attempt) {
  return `Seat ASSAY, soulbis (neg), CANARY PHASE, attempt ${attempt}.
There is no valid candidate yet, so there is no frontier and no lever to judge. Your whole job is the canary: the simplest candidate the trusted evaluator reports FULLY valid. Ignore the metric entirely; correctness first, and the plainest construction that is correct beats any clever one that is not.
The assigned task statement is the \`instruction\` field of the JSON file named by $OPENRSI_TASK; read it first. The assigned research library catalogue is at $OPENRSI_KNOWLEDGE_BASE_URL (fetch with the \`web\` helper or curl, convert PDFs with pdftotext; there is no other network).
Your scratch directory is ${scratch}/ and you write nowhere else. ${scratch}/candidate/ already holds the starting point (the task's scaffold, or the previous attempt's work), and ${scratch}/notes.md holds the previous attempt's notes if there was one: read them before redoing anything.
Work in small verified steps: build one component, check it, then the next. Run the gate with: ${lane.evaluateHint.replace(/\{CANDIDATE\}/g, `${scratch}/candidate`)} Run \`evaluate --help\` once to confirm its arguments. Read its output closely: the status it returns and the reason are your only ground truth. Evaluator runs are a limited, shared resource for the whole run (its output and \`run-status\` report how many remain), and later rounds need most of them: reason and self-check before each run, and never spend one on a candidate you already know is broken.
Keep ${scratch}/notes.md current as you go (what is built and checked, what failed and why, what is next), so that if this session ends early the next attempt continues instead of restarting.
Never edit the candidate path inside ${lane.workspace}; the keystone folds a candidate only after re-running the evaluator on your frozen scratch.
You have about ${lane.sessionMinutes} minutes. Verdict: VALIDATED only if the evaluator reported the candidate fully valid; otherwise BLOCKED with the exact stage and reason in failingCheck. leverId is "canary". \`metric\` is the evaluator's score when valid. \`scratchDir\` is exactly "${scratch}". Save the evaluator's last JSON output as ${scratch}/evaluate.json.`
}
