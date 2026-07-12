// harness.r3.config.mjs — the OT-2 round for the field-guide toy.
// Two targeted finders, one round:
//   1. COMPOSED PASS — line-editor tightening over artifact/GUIDE.compressed.md
//      (the folded frontier best), targeting below it at gate 8/8.
//   2. SECOND DRAW — the frozen r1 candidate runs/r1/p2-restructure-to-telegraphic-bullets/
//      candidate.md re-submitted VERBATIM under a new leverId, so the Gap hashes new
//      canon bytes and draws an independent witness set (GR-4: a fresh seed is a new
//      draw). Clears → CR-4 converts from probe-limited; fails → MIRAGE, fact named.
// The gate, the Gap procedure, and the assay are IDENTICAL to harness.config.mjs:
// witnesses are always drawn from the ORIGINAL artifact/GUIDE.md, and the bar is
// always the live frontier best. Scope declared by the config and the First Person,
// never by the proposer (T2).

const COUNT_RULE = `tr -s '[:space:]' '\\n' < <file> | grep -c .  (whitespace-split tokens of the full markdown file)`

export default {
  name: 'field-guide-r3',

  objective: {
    metric: 'words',
    gate: 'held-out comprehension: 8 questions drawn by the Gap from the ORIGINAL guide, answered from the compressed text alone, graded against the original — must be 8/8 (T5: zero collapses)',
    hardConstraint: 'the compressed guide remains a self-contained instruction document: no pointers back to the original, no "see full version", every section still actionable on its own (GR-3)',
    canary: 'artifact/GUIDE.md itself. The questions are drawn from it, so it answers 8/8 by construction — the gate is satisfiable, and a MIRAGE is therefore always a fault of the candidate, never of the gate.',
  },

  door: 'first-person',

  heldApartRule:
    'You are BLIND to verification witnesses (T2/GR-4). After you finish, the Gap ' +
    'will hash YOUR proposal (including your full compressed text) and use the hash ' +
    'to draw 8 facts from the ORIGINAL guide as comprehension questions. You cannot ' +
    'know which 8 of the ~40 facts will be probed, so the only winning strategy is ' +
    'to preserve ALL semantic content. Do not suggest, guess at, or optimise for ' +
    'any particular questions.',

  keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml'],

  finders: [
    {
      lens: 'line-editor',
      hint: 'COMPOSED PASS (OT-2). Your source text is artifact/GUIDE.compressed.md — the folded frontier-best candidate — NOT the original guide. Apply sentence-level compression over it: cut residual redundancy, filler, and throat-clearing; tighten phrasing. NEVER delete a fact — every quantity, duration, temperature, item, and ordered step must survive, because the gate draws from the ORIGINAL guide regardless of your source text.',
    },
    {
      lens: 'restructurer',
      hint: 'SECOND DRAW (OT-2 / CR-4). Do NOT write new text. Read runs/r1/p2-restructure-to-telegraphic-bullets/candidate.md and re-submit its content VERBATIM, byte-identical, as compressedText under the NEW leverId "telegraphic-bullets-second-draw". Any edit — even one character — makes this a new lever and voids the purpose: the point is that the SAME frozen text faces a fresh, independent witness draw (your new leverId/title change the canon bytes, which re-seeds the Gap).',
    },
  ],

  prompts: {
    measure: (ctx) =>
      `Seat MEASURE. Two mechanical counts, exactly this rule each time: ${COUNT_RULE}.
1. Count ${ctx.repo}/artifact/GUIDE.md and compare to frontier.json baseline (flag stale if they disagree).
2. Count ${ctx.repo}/artifact/GUIDE.compressed.md and compare to frontier.json best.metric (flag stale if they disagree).
Report metric = the GUIDE.md count (the baseline artifact). Then price this round's two levers (composed line-edit over the folded best; second independent draw of the frozen 526-word r1 candidate): rough cost to try, rough ceiling in words if fully successful. Numbers only, no advocacy.`,

    propose: (finder, measure, ctx) => finder.lens === 'line-editor'
      ? `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
Read ${ctx.repo}/artifact/GUIDE.compressed.md (your source text) and ${ctx.repo}/notes/KILLED_LEVERS.md (never re-propose a K-id without new cited evidence).
Propose exactly 1 lever: a complete tightened rewrite of the folded text. leverId = "compose-line-edit-over-best". Your proposal's compressedText field MUST carry the full candidate text (this is the artifact the Gap will hash). State expectedMetric = its word count by the counting rule, and hardConstraintNote = why it is still a self-contained instruction document. Plan and write text only — never touch files.`
      : `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
Read ${ctx.repo}/runs/r1/p2-restructure-to-telegraphic-bullets/candidate.md. Propose exactly 1 lever whose compressedText is that file's content VERBATIM (byte-identical — do not normalise whitespace, do not fix typos, do not touch a character). leverId = "telegraphic-bullets-second-draw". title = "Second independent draw of the frozen r1 telegraphic-bullets candidate". rationale = converting CR-4 from probe-limited: same text, fresh Fiat-Shamir seed, independent witness sample. expectedMetric = the file's word count by the counting rule. hardConstraintNote = why it is still a self-contained instruction document. Plan and write text only — never touch files.`,

    holdApart: (proposal, i, ctx) =>
      `Seat HOLD-APART — the Gap ⿻ (xor). Proposal artifact (verbatim):
${JSON.stringify(proposal)}
Procedure:
1. Number the ORIGINAL guide's declarative facts: read ${ctx.repo}/artifact/GUIDE.md, split the body into sentences on '.', '!', '?' boundaries in order, and index every sentence that states a checkable fact (quantity, duration, temperature, item, instruction) from F1 upward. Print the full numbered fact list in your transcript.
2. Canonically serialize the proposal artifact above (JSON, recursive sorted keys, no whitespace) and SAVE THOSE EXACT BYTES to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json — this file must persist, it is the auditor's only way to re-derive your seed. Then SHA-256 that file with a real shell command; show the exact command and the digest in the transcript. Verify: sha256sum of the saved file must equal seedHex.
3. Draw 8 distinct fact indices without replacement: take the digest bytes left to right as unsigned integers b0,b1,...; for each draw k, idx = b_k mod (number of remaining facts), remove that fact from the remaining list. Show every step.
4. For each drawn fact write one comprehension question with the expected answer quoted from the ORIGINAL sentence.
Write { seedHex, draw, transcript } to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/gap.json (create dirs; draw = the 8 questions + expected answers as JSON text). The FILE must carry EXACTLY the same seedHex, draw, and transcript you return — full text, not a summary or stub: the file an auditor reads must match the data the orchestrator receives, and a gap.json thinner than your return is a broken audit trail (GR-4/GR-5). Leave proposal_canon.json in place — do not clean it up. Never accept witnesses suggested by the proposer.`,

    assay: (proposal, gap, i, ctx) =>
      `Seat ASSAY — soulbis ⚔️ (neg), the prover.
Gap seed=${gap.seedHex}. Re-derive it first, the auditor's way: hash the Gap's saved bytes, \`sha256sum ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json\`, and confirm it equals seedHex. Verdict BLOCKED if that file is missing or the digest does not reproduce. Transcript: ${gap.transcript}
Then, scratch only (GR-10):
1. Write the proposal's compressedText verbatim to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/candidate.md. The compressed text is:
${JSON.stringify(proposal.compressedText)}
2. Answer the Gap's 8 questions using ONLY candidate.md — do not open the original while answering: ${JSON.stringify(gap.draw)}
3. Grade your 8 answers against the expected answers. gateResult = "n/8". Any wrong or unanswerable question fails the gate.
4. Count candidate.md's words mechanically: ${COUNT_RULE.replace('<file>', ctx.runDir + '/p' + (i + 1) + '-' + proposal.leverId + '/candidate.md')}
5. Check the hard constraint: candidate.md is still a self-contained instruction document.
Verdict VALIDATED only if gateResult is 8/8 AND the hard constraint holds AND words < frontier best (read ${ctx.repo}/frontier.json). A gate fail on a candidate that "reads fine" is a MIRAGE — name the dropped fact. Write the verdict to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/verdict.json too, with EXACTLY the returned shape and no extra nesting: { leverId: string, status: "VALIDATED"|"MIRAGE"|"BLOCKED", metric: number (bare word count), gateResult: "n/8", failingCheck: string (empty if none), evidence: string, scratchDir: string }. The file an auditor reads must match the data the orchestrator receives. Write NOTHING outside your scratch dir: not frontier.json, not claims_register.md, and not a chronicle (the chronicle is the chronicler's draft and the keystone's to file). Your only output on disk is verdict.json in your scratch dir.`,

    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals (titles/lenses/expected): ${JSON.stringify(proposals.map(p => ({ leverId: p.leverId, lens: p.lens, title: p.title, expectedMetric: p.expectedMetric })))}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural / probe-limited / noise / mis-gated. Red-team the proposer's rationale (did the lens do its job, or did it get lucky/unlucky on the draw?), never the prover's verdict.
Round context you must weigh: "telegraphic-bullets-second-draw" is the SAME frozen text that passed 8/8 in run r1 under a different seed (classified probe-limited there — one draw, fact-moving reshape). If it passes 8/8 again on THIS independent draw, you are looking at two disjoint 8-witness samples over ~32-40 facts; state explicitly whether that converts it to structural or what third check would. If it fails, name the dropped fact and whether r1's pass was draw-luck. "compose-line-edit-over-best" starts from the folded frontier best; judge whether its gain is draw-invariant by construction (fact-preserving tightening) or reshape risk. Draft KILLED_LEVERS entries for structural kills. Name exactly ONE next lead.`,

    chronicle: (round, ctx) =>
      `Seat CHRONICLE. Draft ${ctx.runDir}/CHRONICLE_DRAFT.md following ${ctx.root}/templates/chronicle.md: verdict first, what happened, reversals at win-prominence, ledger entries returned, handoff block ending in the critic's nextLead. Round data: ${JSON.stringify({ roundId: round.roundId, measure: round.measure, proposals: round.proposals.map(p => ({ leverId: p.leverId, lens: p.lens, expectedMetric: p.expectedMetric })), verdicts: round.verdicts, critic: round.critic })}. Return the path plus a 5-line verdict summary.`,
  },

  schemas: {
    measure: {
      type: 'object', required: ['metric', 'stale', 'leverCosts'],
      properties: {
        metric: { type: 'number', description: 'current word count of artifact/GUIDE.md by the counting rule' },
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
            required: ['leverId', 'title', 'lens', 'rationale', 'expectedMetric', 'hardConstraintNote', 'compressedText'],
            properties: {
              leverId: { type: 'string', description: 'short kebab id' },
              title: { type: 'string' },
              lens: { type: 'string', enum: ['line-editor', 'restructurer'] },
              rationale: { type: 'string' },
              expectedMetric: { type: 'number', description: 'word count of compressedText by the counting rule' },
              hardConstraintNote: { type: 'string' },
              compressedText: { type: 'string', description: 'THE FULL compressed guide, verbatim — this is what the Gap hashes' },
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
        draw: { type: 'string', description: 'JSON text: the 8 questions with expected answers quoted from the original' },
        transcript: { type: 'string', description: 'numbered fact list + serialization + exact hash command + digest + draw steps, third-party re-derivable' },
      },
    },
    verdict: {
      type: 'object', required: ['leverId', 'status', 'gateResult', 'evidence'],
      properties: {
        leverId: { type: 'string' },
        status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] },
        metric: { type: 'number', description: 'mechanical word count of candidate.md' },
        gateResult: { type: 'string', description: 'n/8' },
        failingCheck: { type: 'string', description: 'for MIRAGE: the dropped fact / failed question' },
        evidence: { type: 'string' },
        scratchDir: { type: 'string' },
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

  stop: { dryRounds: 1, maxRounds: 1 },

  isValidated: (v) => v.status === 'VALIDATED' && v.gateResult === '8/8',
  isStructural: (critic, leverId) =>
    (critic.classifications || []).some(c => c.leverId === leverId && c.class === 'structural'),

  conformChecks: [
    (f) => {
      const errs = []
      if (f.objective?.metric !== 'words') errs.push("field-guide frontier objective.metric must be 'words'")
      if (!Number.isFinite(f.baseline?.metric) || f.baseline.metric < 500) errs.push('field-guide baseline should be the measured word count of artifact/GUIDE.md (>= 500)')
      return errs
    },
  ],
}
