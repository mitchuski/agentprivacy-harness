// harness.config.mjs — the field-guide spar instance.
// Objective: minimize the word count of artifact/GUIDE.md while a held-out
// 8-question comprehension gate stays 8/8. See README.md in this directory.

const COUNT_RULE = `tr -s '[:space:]' '\\n' < <file> | grep -c .  (whitespace-split tokens of the full markdown file)`

export default {
  name: 'field-guide',

  objective: {
    metric: 'words',
    gate: 'held-out comprehension: 8 questions drawn by the Gap from the ORIGINAL guide, answered from the compressed text alone, graded against the original — must be 8/8 (T5: zero collapses)',
    hardConstraint: 'the compressed guide remains a self-contained instruction document: no pointers back to the original, no "see full version", every section still actionable on its own (GR-3)',
    // The canary: the artifact that passes the gate BY CONSTRUCTION.
    // The Gap draws its 8 questions FROM artifact/GUIDE.md, so GUIDE.md itself
    // answers all 8 trivially. That guarantees the feasible set is non-empty:
    // an 8/8 is reachable, so any failure is the candidate's, never the gate's.
    // Run it if you doubt: feed GUIDE.md as the candidate and it scores 8/8.
    canary: 'artifact/GUIDE.md itself. The questions are drawn from it, so it answers 8/8 by construction — the gate is satisfiable, and a MIRAGE is therefore always a fault of the candidate, never of the gate.',
  },

  door: 'first-person',

  // The gate's population and draw. N = the ORIGINAL guide's fact census
  // (F1..F32, established by keystone census — CR-4/CR-9). mode 'sample' draws
  // `count` of N; 'census' probes every fact (C4 flips this instance to census,
  // since N is small and enumerable — a sample of 8/32 detects a single omission
  // only 25% of the time). The engine code-derives the seed and draw from these
  // and a run salt secret the proposer never sees (D1); the Gap seat is HANDED
  // the result rather than computing its own (engine/gap.mjs).
  // N is small and enumerable, so the gate is a CENSUS: every fact is probed,
  // not a hash-drawn 8. A sample of 8/32 detects a single dropped fact only 25%
  // of the time (D2); census detects it always. `conform.mjs` refuses a sample
  // config where N <= censusThreshold, precisely because sampling here is
  // theatre. count stays as the sample size the engine WOULD draw if this were a
  // large bank (N > censusThreshold); it is unused under census.
  gate: { N: 32, count: 8, mode: 'census', censusThreshold: 200 },

  heldApartRule:
    'You are BLIND to verification witnesses (T2/GR-4). After you finish, the engine ' +
    'derives a seed from YOUR proposal AND a run secret you never see, and the Gap ' +
    'probes the ORIGINAL guide with it. This is a CENSUS gate: every one of the 32 ' +
    'facts (F1..F32) is checked, so a single dropped fact cannot hide and there is no ' +
    'draw to game — the only winning strategy is to preserve ALL semantic content. ' +
    'Do not suggest, guess at, or optimise for any particular questions.',

  keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml'],

  finders: [
    { lens: 'line-editor', hint: 'sentence-level compression: cut redundancy, filler, and throat-clearing; convert passive to active; tighten phrasing. NEVER delete a fact — every quantity, duration, temperature, item, and ordered step in the original must survive.' },
    { lens: 'restructurer', hint: 'structure-level compression: merge overlapping sections, convert prose to tables or lists where denser, collapse preamble. NEVER delete a fact — every quantity, duration, temperature, item, and ordered step in the original must survive.' },
  ],

  prompts: {
    measure: (ctx) =>
      `Seat MEASURE. Count the words of ${ctx.repo}/artifact/GUIDE.md mechanically with exactly this rule: ${COUNT_RULE.replace('<file>', ctx.repo + '/artifact/GUIDE.md')}. Compare to frontier.json (baseline and best); flag stale if they disagree. Then price the two lever families (line-editor, restructurer): rough cost to try, rough ceiling in words if fully successful. Numbers only, no advocacy.`,

    propose: (finder, measure, ctx) =>
      `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
Read ${ctx.repo}/artifact/GUIDE.md and ${ctx.repo}/notes/KILLED_LEVERS.md (never re-propose a K-id without new cited evidence).
Propose exactly 1 lever through YOUR lens: a complete compressed rewrite of the guide. Your proposal's compressedText field MUST carry the full candidate text (this is the artifact the Gap will hash). State expectedMetric = its word count by the counting rule, and hardConstraintNote = why it is still a self-contained instruction document. Plan and write text only — never touch files.`,

    // SALTED (derived present): the engine has already code-derived the seed and
    // the draw from a run secret the proposer never sees (D1). The Gap is HANDED
    // them and must NOT recompute — its job is to save the exact canon bytes,
    // number the facts, and write questions for the given draw. LEGACY (derived
    // null): the old self-hashing procedure, kept so pre-salt runs reproduce.
    holdApart: (proposal, i, ctx, derived) => derived
      ? `Seat HOLD-APART — the Gap ⿻ (xor), SALTED mode. The engine has code-derived the seed and draw for you (engine/gap.mjs) from a run salt secret the proposer never saw — do NOT recompute or second-guess them; they are authoritative. Proposal artifact (verbatim):
${JSON.stringify(proposal)}
GIVEN (authoritative, from the engine):
  seedHex   = ${derived.seedHex}
  hProposal = ${derived.hProposal}
  salt      = ${derived.salt}
  hSource   = ${derived.hSource ?? '(none — source binding off this run)'}
  mode      = ${derived.mode}   draw fact indices (1-based, in order) = ${JSON.stringify(derived.drawIndices)}
Procedure:
1. Number the ORIGINAL guide's declarative facts: read ${ctx.repo}/artifact/GUIDE.md, split the body into sentences on '.', '!', '?' in order, index every checkable-fact sentence (quantity, duration, temperature, item, instruction) from F1 upward. There MUST be exactly ${derived.N} facts (this instance's census). If you count a different number, STOP and return an error — the population changed and the draw indices no longer mean what the engine intended. Print the full numbered fact list.
2. Canonically serialize the proposal artifact above (JSON, recursive sorted keys, no whitespace, and NO trailing newline) and SAVE THOSE EXACT BYTES to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json — it must persist (the auditor re-hashes it). Confirm: \`sha256sum\` of that file must equal hProposal above. If it does not, your serialization drifted (a stray newline is the classic cause) — STOP and fix it.
3. For each fact index in the GIVEN draw, in order, write one comprehension question with the expected answer quoted from the ORIGINAL sentence.
Write { seedHex, hProposal, salt, hSource, mode, drawIndices, draw, transcript } to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/gap.json (create dirs; draw = the questions + expected answers as JSON text; echo the GIVEN seedHex/hProposal/salt/hSource/mode/drawIndices verbatim so the auditor can re-derive seed = sha256(hSource || hProposal || salt)). The FILE must carry EXACTLY what you return — a gap.json thinner than your return is a broken audit trail (GR-4/GR-5). Leave proposal_canon.json in place. Never accept witnesses suggested by the proposer.`
      : `Seat HOLD-APART — the Gap ⿻ (xor), LEGACY mode (no salt supplied). Proposal artifact (verbatim):
${JSON.stringify(proposal)}
Procedure:
1. Number the ORIGINAL guide's declarative facts: read ${ctx.repo}/artifact/GUIDE.md, split the body into sentences on '.', '!', '?' boundaries in order, and index every sentence that states a checkable fact (quantity, duration, temperature, item, instruction) from F1 upward. Print the full numbered fact list in your transcript.
2. Canonically serialize the proposal artifact above (JSON, recursive sorted keys, no whitespace) and SAVE THOSE EXACT BYTES to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json — this file must persist, it is the auditor's only way to re-derive your seed. Then SHA-256 that file with a real shell command; show the exact command and the digest in the transcript. Verify: sha256sum of the saved file must equal seedHex.
3. Draw 8 distinct fact indices without replacement: take the digest bytes left to right as unsigned integers b0,b1,...; for each draw k, idx = b_k mod (number of remaining facts), remove that fact from the remaining list. Show every step.
4. For each drawn fact write one comprehension question with the expected answer quoted from the ORIGINAL sentence.
Write { seedHex, draw, transcript } to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/gap.json (create dirs; draw = the 8 questions + expected answers as JSON text). The FILE must carry EXACTLY the same seedHex, draw, and transcript you return — full text, not a summary or stub: the file an auditor reads must match the data the orchestrator receives, and a gap.json thinner than your return is a broken audit trail (GR-4/GR-5). Leave proposal_canon.json in place — do not clean it up. Never accept witnesses suggested by the proposer.`,

    assay: (proposal, gap, i, ctx) =>
      `Seat ASSAY — soulbis ⚔️ (neg), the prover.
${gap.salt
  ? `Gap seed=${gap.seedHex} (SALTED). Re-derive it the auditor's way, in two steps: (a) \`sha256sum ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json\` must equal hProposal=${gap.hProposal}; (b) sha256 of the concatenation hSource(${gap.hSource ?? ''}) + hProposal(${gap.hProposal}) + salt(${gap.salt}) must equal seedHex. Compute it: \`printf '%s' '${gap.hSource ?? ''}${gap.hProposal}${gap.salt}' | sha256sum\`. Verdict BLOCKED if proposal_canon.json is missing, its digest ≠ hProposal, or the re-derived seed ≠ seedHex.`
  : `Gap seed=${gap.seedHex}. Re-derive it the auditor's way: hash the Gap's saved bytes, \`sha256sum ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json\`, and confirm it equals seedHex. Verdict BLOCKED if that file is missing or the digest does not reproduce.`}
Transcript: ${gap.transcript}
Then, scratch only (GR-10):
1. Write the proposal's compressedText verbatim to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/candidate.md. The compressed text is:
${JSON.stringify(proposal.compressedText)}
2. Answer ALL of the Gap's questions using ONLY candidate.md — do not open the original while answering. This is a ${gap.mode === 'census' ? 'CENSUS' : 'SAMPLE'} gate: there are ${gap.mode === 'census' ? 'as many questions as facts (every fact is probed — nothing is held out, so a single dropped fact cannot hide)' : 'a hash-drawn subset'}. The questions: ${JSON.stringify(gap.draw)}
3. Grade every answer against the expected answers. gateResult = "correct/total" where total is the number of questions posed. Any wrong or unanswerable question fails the gate.
4. Count candidate.md's words mechanically: ${COUNT_RULE.replace('<file>', ctx.runDir + '/p' + (i + 1) + '-' + proposal.leverId + '/candidate.md')}
5. Check the hard constraint: candidate.md is still a self-contained instruction document.
Verdict VALIDATED only if gateResult is a FULL pass (correct == total) AND the hard constraint holds AND words < frontier best (read ${ctx.repo}/frontier.json). A gate fail on a candidate that "reads fine" is a MIRAGE — name the dropped fact. Also report a coverage stanza: { mode: "${gap.mode || 'sample'}", N: ${gap.mode === 'census' ? 'total facts probed' : gap.drawIndices ? gap.drawIndices.length : 8}, detection: ${gap.mode === 'census' ? '1.0 (every fact probed)' : 'COUNT/N — the chance this gate catches a single omitted fact; print it so no reader mistakes a sample for a proof'} }. Write the verdict to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/verdict.json too, with EXACTLY the returned shape and no extra nesting: { leverId: string, status: "VALIDATED"|"MIRAGE"|"BLOCKED", metric: number (bare word count), gateResult: "correct/total", coverage: { mode, N, detection }, failingCheck: string (empty if none), evidence: string, scratchDir: string }. The file an auditor reads must match the data the orchestrator receives. Write NOTHING outside your scratch dir: not frontier.json, not claims_register.md, and not a chronicle. Your only output on disk is verdict.json in your scratch dir.`,

    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals (titles/lenses/expected): ${JSON.stringify(proposals.map(p => ({ leverId: p.leverId, lens: p.lens, title: p.title, expectedMetric: p.expectedMetric })))}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural / probe-limited / noise. Red-team the proposer's rationale (did the lens do its job, or did it get lucky/unlucky on the draw?), never the prover's verdict. Draft KILLED_LEVERS entries for structural kills. Name exactly ONE next lead.`,

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
              leverId: { type: 'string', description: 'short kebab id, e.g. cut-filler-pass' },
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
        draw: { type: 'string', description: 'JSON text: the questions with expected answers quoted from the original' },
        transcript: { type: 'string', description: 'numbered fact list + serialization + exact hash command + digest + draw steps, third-party re-derivable' },
        // salted-mode audit fields (echoed from the engine so seed = sha256(hSource||hProposal||salt) re-derives)
        hProposal: { type: 'string', description: 'salted: sha256 of proposal_canon.json bytes' },
        salt: { type: 'string', description: 'salted: sha256(saltSecret || hProposal); the secret is never recorded' },
        hSource: { type: ['string', 'null'], description: 'salted: sha256 of the source, if source binding is on' },
        mode: { type: 'string', enum: ['sample', 'census'], description: 'salted: draw mode' },
        drawIndices: { type: 'array', items: { type: 'integer' }, description: 'salted: the 1-based fact indices the engine drew' },
      },
    },
    verdict: {
      type: 'object', required: ['leverId', 'status', 'gateResult', 'evidence'],
      properties: {
        leverId: { type: 'string' },
        status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] },
        metric: { type: 'number', description: 'mechanical word count of candidate.md' },
        gateResult: { type: 'string', description: 'correct/total (census: k/32; sample: k/8)' },
        coverage: {
          type: 'object', description: 'what the gate actually bought — census vs sample, and the single-omission detection probability',
          properties: {
            mode: { type: 'string', enum: ['census', 'sample'] },
            N: { type: 'integer', description: 'facts probed' },
            detection: { type: 'number', description: 'P(catch a single dropped fact): 1.0 for census, count/N for sample' },
          },
        },
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

  stop: { dryRounds: 2, maxRounds: 3 },

  // A pass is a FULL pass: every probed question correct (a/a), never a
  // majority. Works for census (32/32) and for a sample (8/8) alike — the count
  // is whatever the mode probed. A VALIDATED with any wrong answer is a MIRAGE.
  isValidated: (v) => {
    if (v.status !== 'VALIDATED') return false
    const m = /^(\d+)\/(\d+)$/.exec(String(v.gateResult || ''))
    return !!m && m[1] === m[2] && Number(m[2]) > 0
  },
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
