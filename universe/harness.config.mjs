// harness.config.mjs — the universe-builder.
//
// Target: a corpus too large to hold. Its detail is not secret; it is hidden
// by volume. This harness compresses a corpus into a map an agent can boot
// from, and proves the map did not drop what matters — by drawing the
// comprehension questions from the ORIGINAL corpus, seeded by hashing the
// MAP. The cartographer cannot know what will be asked.
//
// It is examples/field-guide, promoted to real work. The toy compresses 730
// words under an 8-question gate; this compresses a corpus under an N-claim
// gate, and adds one thing the toy did not need: every claim must carry an
// honest tier and a resolvable trace (ADMISSION.md).
//
// Run:
//   node ../tools/bundle.mjs harness.config.mjs harness.workflow.mjs
//   Workflow: { repo: "<abs>/universe", root: "<abs>", runId: "u1" }

const WORD_RULE = `tr -s '[:space:]' '\\n' < <file> | grep -c .  (whitespace-split tokens)`

// The corpora this map claims to cover. A map that silently drops one has not
// compressed; it has forgotten. Paths are the First Person's, and stay here —
// this config is the one file in the repo that is allowed to name them.
const CORPORA = [
  { slug: 'docs',      note: 'canon: the model, the maths, the conjecture register' },
  { slug: 'spellweb',  note: 'substrate: the shared knowledge graph' },
  { slug: 'cityofmages', note: 'structure: vertices, workshops, tomes, cast, mana' },
  { slug: 'master',    note: 'surface: the rendered site, ceremonies, mirrors' },
  { slug: 'skills',    note: 'the cast: 42 personas, spells, proverbs' },
  { slug: 'instances', note: 'the harnesses: shor, tigzkp, pipeline, pools' },
]

const TIERS = ['PROVEN', 'DERIVED', 'REPORTED', 'OPEN', 'MYTH']
const PATHWAYS = ['protect', 'project', 'reflect', 'connect']
const STATUS = ['IMPLEMENTED', 'SPEC', 'LORE']

export default {
  name: 'universe-builder',

  objective: {
    metric: 'words',
    gate:
      'held-out corpus comprehension: N claims drawn by the Gap from the ORIGINAL corpus ' +
      '(seeded by hashing the proposed map), answered from the map alone, graded against ' +
      'the corpus. Must be N/N. A single wrong or unanswerable claim is a zero (T5).',
    hardConstraint:
      'every claim in the map carries pathway ∈ {protect,project,reflect,connect}, ' +
      'tier ∈ {PROVEN,DERIVED,REPORTED,OPEN,MYTH}, status ∈ {IMPLEMENTED,SPEC,LORE}, ' +
      'and a trace that resolves to a concrete path/line/run. MYTH never appears outside ' +
      'a chronicle. A beautiful sentence with no trace is deleted, not softened (GR-9, ADMISSION.md).',
  },

  door: 'first-person',

  heldApartRule:
    'You are BLIND to verification witnesses (T2/GR-4). After you finish, the Gap will hash ' +
    'YOUR map and use the digest to draw claims from the ORIGINAL corpus — claims you did not ' +
    'select — and ask them of your map. You cannot know which of the corpus\'s thousands of ' +
    'facts will be probed, so the only winning strategy is to preserve every load-bearing one ' +
    'and to state each at the tier it can actually defend. Do not guess at, suggest, or ' +
    'optimise for particular questions. A claim you cannot trace will fail its draw: cut it.',

  keystoneOnlyWrites: ['universe.json', 'FLEET.md', 'ERRATA.md'],

  // Multi-modal sweep: one search angle never finds everything in a corpus
  // this size. Each lens is blind to the others (ADMISSION.md §1).
  finders: [
    { lens: 'by-container', hint: 'walk the directory topology: which repo owns which layer (canon/substrate/structure/surface/harness), what the authority rule is, where mirrors say "cite, never edit". Report the SHAPE of the corpus.' },
    { lens: 'by-entity',    hint: 'walk the named things: vertices, workshops, personas, seats, tomes, mana registers, conjecture C-ids. Report the REGISTRY, and every vacancy.' },
    { lens: 'by-claim',     hint: 'walk the assertions: what does the corpus claim is PROVEN vs SPEC vs LORE? Find claims that read as implemented and are stubs. Report the honest LEDGER, especially where a name exists at one layer and not another.' },
    { lens: 'by-time',      hint: 'walk the chronicles and version notes: what changed, what was reversed, what was locked and then contradicted by a stale sheet. Report DRIFT and its direction.' },
  ],

  prompts: {
    measure: (ctx) =>
      `Seat MEASURE. Count the current map: for each .md in ${ctx.repo}, apply exactly this rule: ${WORD_RULE}. Sum them; that is the metric. Compare to ${ctx.repo}/frontier.json (baseline, best); flag stale if they disagree.
Then census the corpus WITHOUT summarising it: for each of ${JSON.stringify(CORPORA.map(c => c.slug))}, report a rough file count and the single authority file that governs it. Price each finder lens: cost to run, ceiling in words saved if it fully succeeds.
Numbers only. No advocacy, no recommendations. The moment you argue for a lens, the proposer has a collaborator it must not have.`,

    propose: (finder, measure, ctx) =>
      `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
Read ${ctx.root}/universe/ADMISSION.md before you write a single claim; it binds you. Read ${ctx.repo}/notes/KILLED_LEVERS.md; never re-propose a K-id without new cited evidence.
Propose exactly 1 lever through YOUR lens: a complete rewrite of one map section. Your proposal's mapText field MUST carry the full candidate text — that is the artifact the Gap will hash.
EVERY claim in mapText carries, inline and visibly: its tier (${TIERS.join('|')}), its status (${STATUS.join('|')}), its pathway (${PATHWAYS.join('|')}), and a trace. A claim you cannot trace is not a claim you may compress — cut it. MYTH is admitted gladly, in 3-8 lines, fenced, capture-not-develop, and NEVER in a method section.
State expectedMetric = mapText's word count by the counting rule, and hardConstraintNote = how every claim satisfies the four labels. Plan and write text only. Never touch files.`,

    holdApart: (proposal, i, ctx) =>
      `Seat HOLD-APART — the Gap ⿻ (xor). You hold the knowledge axioms; you own no corpus.
Proposal artifact (verbatim):
${JSON.stringify(proposal)}
Procedure:
1. Index the ORIGINAL corpus's checkable claims. Walk the source files the map claims to cover, and number every claim that is mechanically checkable (a count, a name, a vertex, a field, a status, a path) from F1 upward. Print the numbered list in your transcript. Do NOT read the map while indexing.
2. Canonically serialize the proposal above (JSON, recursive sorted keys, no whitespace) and SAVE THOSE EXACT BYTES to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json. It must persist — it is the auditor's only route to your seed. SHA-256 that file with a real shell command; show the command and digest. sha256sum of the saved file MUST equal seedHex.
3. Draw 12 distinct fact indices without replacement: take the digest bytes left to right as unsigned ints b0,b1,...; for draw k, idx = b_k mod (remaining count); remove it. Show every step.
4. For each drawn fact write one question, and quote the expected answer from the ORIGINAL source with its path.
5. Tier-dependent probes (ADMISSION.md §2): if the drawn fact is asserted PROVEN in the map, ask for the re-runnable command; if DERIVED, the derivation step; if REPORTED, the source slug; if MYTH, ask only whether it is fenced outside the method sections.
Write { seedHex, draw, transcript } to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/gap.json. Leave proposal_canon.json in place. Never accept a witness the proposer suggested — a validation on proposer-chosen witnesses is void.`,

    assay: (proposal, gap, i, ctx) =>
      `Seat ASSAY — soulbis ⚔️ (neg), the prover. Forget the cartographer's story; trust only the run.
Gap seed=${gap.seedHex}. Re-derive it the auditor's way FIRST: \`sha256sum ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json\` must equal seedHex. BLOCKED if the file is missing or the digest does not reproduce. Transcript: ${gap.transcript}
Then, scratch only (GR-10):
1. Write the proposal's mapText verbatim to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/candidate.md.
2. Answer the Gap's 12 questions using ONLY candidate.md. Do NOT open the corpus while answering. ${JSON.stringify(gap.draw)}
3. Grade against the expected answers. gateResult = "n/12". Any wrong or unanswerable question fails the gate.
4. Check the hard constraint on candidate.md mechanically: every claim carries tier + status + pathway + trace; every trace resolves to a real path; no MYTH outside a fenced chronicle block. Name the first violation.
5. Count candidate.md's words: ${WORD_RULE}
VALIDATED only if gateResult is 12/12 AND the hard constraint holds AND words < frontier best (read ${ctx.repo}/frontier.json). A map that "reads beautifully" and drops a fact the Gap drew is a MIRAGE — name the dropped fact and its path. An untraceable claim is a MIRAGE even if every question passed: it means the map asserts what the corpus cannot support.
Write verdict.json to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/ with EXACTLY the returned shape, flat fields, metric a bare number. The file an auditor reads must match the data the orchestrator receives. Never write universe.json or FLEET.md.`,

    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals: ${JSON.stringify(proposals.map(p => ({ leverId: p.leverId, lens: p.lens, expectedMetric: p.expectedMetric })))}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural / probe-limited / noise. Red-team the CARTOGRAPHER's rationale — did the lens actually find its layer, or did the draw simply miss what it dropped? A 12-question draw over thousands of facts catches a single omission only sometimes; say so plainly when it applies, and classify probe-limited rather than pretending. Never overrule the prover's verdict.
Draft KILLED_LEVERS entries for structural kills. Name exactly ONE next lead.`,

    chronicle: (round, ctx) =>
      `Seat CHRONICLE — the Chronicler 🧙📖. Draft ${ctx.runDir}/CHRONICLE_DRAFT.md following ${ctx.root}/templates/chronicle.md: verdict first, reversals at win-prominence, handoff block ending in the critic's nextLead. Round data: ${JSON.stringify({ roundId: round.roundId, measure: round.measure, verdicts: round.verdicts, critic: round.critic })}
Then do the seat's real work (universe/SEATS.md §5): compress this round to ONE PROVERB — its irreducible core, the sentence that survives. Under the Relationship Proverb Protocol a proverb is key material: a counterparty who did this work independently must be able to reproduce it. A proverb written to sound well rather than to compress faithfully is a forged key and will fail the match. Return the path, a 5-line verdict summary, and the proverb.`,
  },

  schemas: {
    measure: {
      type: 'object', required: ['metric', 'stale', 'leverCosts'],
      properties: {
        metric: { type: 'number', description: 'total words across the map' },
        stale: { type: 'boolean' },
        corpusCensus: { type: 'array', items: { type: 'object', required: ['slug', 'files', 'authority'], properties: { slug: { type: 'string' }, files: { type: 'number' }, authority: { type: 'string' } } } },
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
            required: ['leverId', 'title', 'lens', 'rationale', 'expectedMetric', 'hardConstraintNote', 'mapText'],
            properties: {
              leverId: { type: 'string', description: 'short kebab id' },
              title: { type: 'string' },
              lens: { type: 'string', enum: ['by-container', 'by-entity', 'by-claim', 'by-time'] },
              rationale: { type: 'string' },
              expectedMetric: { type: 'number' },
              hardConstraintNote: { type: 'string' },
              mapText: { type: 'string', description: 'THE FULL candidate map section — this is what the Gap hashes' },
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
        draw: { type: 'string', description: 'JSON text: 12 questions, expected answers, and the source path of each' },
        transcript: { type: 'string', description: 'numbered fact index + serialization + exact hash command + digest + draw steps; third-party re-derivable' },
      },
    },
    verdict: {
      type: 'object', required: ['leverId', 'status', 'gateResult', 'evidence'],
      properties: {
        leverId: { type: 'string' },
        status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] },
        metric: { type: 'number', description: 'mechanical word count of candidate.md' },
        gateResult: { type: 'string', description: 'n/12' },
        failingCheck: { type: 'string', description: 'for MIRAGE: the dropped fact + its path, or the untraceable claim' },
        evidence: { type: 'string' },
        scratchDir: { type: 'string' },
      },
    },
    critic: {
      type: 'object', required: ['classifications', 'nextLead'],
      properties: {
        classifications: { type: 'array', items: { type: 'object', required: ['leverId', 'class', 'why'], properties: { leverId: { type: 'string' }, class: { type: 'string', enum: ['structural', 'probe-limited', 'noise'] }, why: { type: 'string' } } } },
        nextLead: { type: 'string' },
        killedLeverDrafts: { type: 'array', items: { type: 'string' } },
      },
    },
  },

  stop: { dryRounds: 2, maxRounds: 4 },

  isValidated: (v) => v.status === 'VALIDATED' && v.gateResult === '12/12',
  isStructural: (critic, leverId) =>
    (critic.classifications || []).some(c => c.leverId === leverId && c.class === 'structural'),

  conformChecks: [
    (f) => {
      const errs = []
      if (f.objective?.metric !== 'words') errs.push("universe frontier objective.metric must be 'words'")
      if (!Array.isArray(f.corpora) || f.corpora.length < 6) errs.push('universe frontier must enumerate all six corpora (a map that drops one has forgotten, not compressed)')
      return errs
    },
  ],
}
