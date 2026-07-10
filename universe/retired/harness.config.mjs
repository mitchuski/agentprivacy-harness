// ============================================================================
// RETIRED — 2026-07-10. This config is prior art, not a live instance.
//
// The universe-builder was never a harness. Its target — a map of the corpus —
// makes ~100 enumerable claims, so `universe/audit.mjs` checks them ALL. The
// Fiat-Shamir Gap earns its cost only where the claim space is too large to
// check; against an exhaustive check a mirage is impossible, because there is
// nothing to tune to.
//
// Two rounds, ~1.4M subagent tokens, zero evidence about the map:
//   u1  infrastructure death. Yielded a real engine defect (an outage was
//       reported as exhaustion). Nothing about the map.
//   u2  9/9 agents, clean seeds, sound verdicts, MIRAGE x2 at 0/8 — because
//       the gate demanded a transcript while the objective demanded
//       compression. The feasible set was empty. The verdicts measured this
//       file, not the artifact.
//
// The auditor found u2's own unclaimed finding (a dropped corpus layer) on its
// first run, in milliseconds, for zero tokens.
//
// KEPT because a worked negative result is worth more than a ninth success.
// Read it for the shape of a config; do not run it. The one idea worth
// stealing is `mustAnswer` — and its general form is `objective.canary`, a
// reference artifact the gate must pass BY CONSTRUCTION. Without a canary you
// cannot tell a bad candidate from an impossible gate. That is what u2 was.
//
//   chronicles/2026-07-10_u2_mis-gated.md
//   chronicles/2026-07-10_u3_retirement.md
// ============================================================================

// harness.config.mjs — the universe-builder.
//
// Target: a corpus too large to hold. Its detail is not secret; it is hidden
// by volume. This harness compresses one map file at a time and proves the
// rewrite dropped nothing that matters — by drawing comprehension questions
// from the ORIGINAL sources, seeded by hashing the MAP. The cartographer
// cannot know what will be asked.
//
// It is examples/field-guide, promoted to real work, plus one thing the toy
// did not need: every claim must carry an honest tier and a resolvable trace
// (ADMISSION.md).
//
// SCOPE IS DECLARED HERE, NOT BY THE PROPOSER. Round u1 died because the Gap
// was told to "index the corpus" — some 24,000 files — and four lenses were
// each turned loose on all of it. A round must be bounded before it is run:
// one target file, a fixed source set, two lenses. Bounding the Gap by the
// CONFIG keeps the draw held apart (T2); bounding it by the proposal's own
// citations would hand the proposer its own exam paper.
//
// Run:
//   node ../tools/bundle.mjs harness.config.mjs harness.workflow.mjs
//   Workflow: { repo: "<abs>/universe", root: "<abs>", runId: "u2",
//               target: "README.md" }

const WORD_RULE = `tr -s '[:space:]' '\\n' < <file> | grep -c .  (whitespace-split tokens)`

// One entry per map file.
//
//   sources    — the Gap's ENTIRE reading list. Bounded, First-Person-authored,
//                blind to the proposer's choices.
//   mustAnswer — the SCOPE CONTRACT: the fact classes this map is responsible
//                for carrying. The Gap indexes ONLY facts that answer one of
//                these. Everything else in the sources is out of scope.
//
// Why mustAnswer exists (round u2, 2026-07-10): the Gap was told to index "any
// mechanically checkable fact" from the sources, and duly drew the grimoire's
// licence string, a JSON `version` field, and an audit script's
// `process.exitCode` expression. The target is a 1,150-word map of a 612 KB
// corpus — 1.1% of its sources. An 8/8 on arbitrary source facts demands a
// TRANSCRIPT, while objective.metric demands compression. Both proposals came
// back 0/8. No candidate could ever have passed. That is not a bad map; it is
// a bad gate — and a gate no candidate can pass is a wall.
//
// The scope contract fixes it without handing the proposer its own exam: the
// config declares WHICH KINDS of fact are fair game, the Gap still chooses
// WHICH ONES by hashing the proposal, and the proposer sees neither.
const TARGETS = {
  'README.md': {
    what: 'the corpus topology, the work dynamics, the resolution rule',
    sources: [
      'C:/Users/mitch/agentprivacy-docs/research/CONJECTURE_REGISTER_V6.md',
      'C:/Users/mitch/agentprivacy_master/src/data/conjecture-register-v6-mirror.json',
      'C:/Users/mitch/spellweb/scripts/graph-coherence-audit.mjs',
      'C:/Users/mitch/cityofmages/grimoire/city_of_mages_grimoire_v1_9_1.json',
      'C:/Users/mitch/game42/game-of-42.json',
      'C:/Users/mitch/tig_zk_loop/tigzkp_mage/canon/tigzkp-mage.json',
    ],
    mustAnswer: [
      'for each corpus layer: which repo owns it, and the exact path of its authority file',
      'the rule that resolves a disagreement between prose and register, stated in the source',
      'what a mirror says about its own editability (cite the field, not a paraphrase)',
      'the current conjecture register head and the next free number',
      'the exit condition of the substrate coherence gate (what makes it fail)',
      'the name and algebra of each of the seven seats, per the worked instance registry',
      'for any claim the map marks PROVEN: the exact re-runnable command that proves it',
    ],
  },
  'SEATS.md': {
    what: 'the 42 personas, the seat map, the invariants, the falsified wing rule',
    sources: [
      'C:/Users/mitch/agentprivacy_master/agentprivacy-skills/agentprivacy-skills-v5/persona',
      'C:/Users/mitch/tig_zk_loop/tigzkp_mage/canon/tigzkp-mage.json',
    ],
    mustAnswer: [
      'the count of personas, and the split by alignment',
      'which persona the worked instance seats at each of the seven seats, and its alignment',
      'the algebra operator carried by each algebra-bearing seat',
      'the equation_term of any persona the map names',
      'for any claim the map marks PROVEN: the exact re-runnable command that proves it',
    ],
  },
  'FLEET.md': {
    what: 'vertices as addresses, the anchor law, the workshop roster, the arc',
    sources: [
      'C:/Users/mitch/agentprivacy_master/public/tomes/workshops',
      'C:/Users/mitch/cityofmages/grimoire/city_of_mages_grimoire_v1_9_1.json',
      'C:/Users/mitch/cityofmages/architecture/lattice-vertex.ts',
    ],
    mustAnswer: [
      'the six sovereignty axes, in order, with their bit weights',
      'for any workshop the map names: its vertex, its ceremony shape, and its resident mage (or null)',
      'the anchor law, and the complement of any vertex the map names',
      'for any claim the map marks PROVEN: the exact re-runnable command that proves it',
    ],
  },
}

const TIERS = ['PROVEN', 'DERIVED', 'REPORTED', 'OPEN', 'MYTH']
const PATHWAYS = ['protect', 'project', 'reflect', 'connect']
const STATUS = ['IMPLEMENTED', 'SPEC', 'LORE']

const targetOf = (ctx) => {
  const t = String(ctx.args?.target || 'README.md')
  if (!TARGETS[t]) throw new Error(`unknown target '${t}'. Known: ${Object.keys(TARGETS).join(', ')}. Add it to TARGETS with an explicit source list — never point the Gap at a corpus root.`)
  return { name: t, ...TARGETS[t] }
}
const sourceList = (t) => t.sources.map(s => `  - ${s}`).join('\n')
const mustAnswerList = (t) => t.mustAnswer.map((q, i) => `  Q${i + 1}. ${q}`).join('\n')

export default {
  name: 'universe-builder',

  objective: {
    metric: 'words',
    gate:
      'held-out comprehension: 8 claims drawn by the Gap from the target\'s FIXED source list ' +
      '(seeded by hashing the proposed rewrite), answered from the rewrite alone, graded against ' +
      'the sources. Must be 8/8. A single wrong or unanswerable claim is a zero (T5).',
    hardConstraint:
      'every claim in the rewrite carries pathway ∈ {protect,project,reflect,connect}, ' +
      'tier ∈ {PROVEN,DERIVED,REPORTED,OPEN,MYTH}, status ∈ {IMPLEMENTED,SPEC,LORE}, ' +
      'and a trace that resolves to a concrete path/line/run. MYTH never appears outside ' +
      'a chronicle. A beautiful sentence with no trace is deleted, not softened (GR-9, ADMISSION.md).',
  },

  door: 'first-person',

  heldApartRule:
    'You are BLIND to verification witnesses (T2/GR-4). After you finish, the Gap will hash ' +
    'YOUR rewrite and use the digest to draw claims from the target\'s source files — a list ' +
    'fixed by the config before you were summoned, which you do not see and cannot influence. ' +
    'It will ask those claims of your rewrite. You cannot know which will be drawn, so the only ' +
    'winning strategy is to preserve every load-bearing fact and to state each at the tier it ' +
    'can actually defend. Do not guess at, suggest, or optimise for particular questions. ' +
    'A claim you cannot trace will fail its draw: cut it.',

  keystoneOnlyWrites: ['universe.json', 'FLEET.md', 'ERRATA.md'],

  // Two lenses, genuinely different, blind to each other. Four was greed: it
  // quadrupled the Gap and assay work for a single target file.
  finders: [
    { lens: 'by-container', hint: 'the SHAPE: which repo owns which layer, what the authority file is, what rule resolves a disagreement. Verify each path exists. Report topology, not narrative.' },
    { lens: 'by-claim', hint: 'the LEDGER: for each assertion, is it IMPLEMENTED, SPEC, or LORE? Hunt claims that read as implemented and are stubs, and names that exist at one layer and not another. Report what can actually be defended.' },
  ],

  // A word-count and a chronicle draft do not need the same reasoning as a
  // Fiat-Shamir draw or a verdict. Hold-apart and assay keep the frontier
  // model; the rest step down. This is the difference between a round that
  // finishes and a round that dies of its own weight.
  seatOpts: {
    measure: { model: 'haiku', effort: 'low' },
    chronicle: { model: 'sonnet', effort: 'low' },
    critic: { model: 'sonnet' },
    propose: { model: 'sonnet' },
    // holdApart, assay: inherit the session model. The Gap and the prover are
    // the two seats a harness must never economise on.
  },

  prompts: {
    measure: (ctx) => {
      const t = targetOf(ctx)
      return `Seat MEASURE. Two numbers and a check; nothing else.
1. Metric: for each .md in ${ctx.repo} (top level only), apply exactly ${WORD_RULE}. Sum them. That is the metric. Compare to ${ctx.repo}/frontier.json baseline/best; set stale=true if they disagree.
2. Target this round: ${t.name} — ${t.what}. Report its own word count by the same rule.
3. Confirm each of the target's source paths exists (a file or a directory). Do NOT read their contents; do NOT summarise them. Existence only:
${sourceList(t)}
Price the two lenses (by-container, by-claim): cost to run, ceiling in words if fully successful. Ceilings overlap; do not sum them.
Numbers only. No advocacy, no recommendations. The moment you argue for a lens, the proposer has a collaborator it must not have.`
    },

    propose: (finder, measure, ctx) => {
      const t = targetOf(ctx)
      return `Seat PROPOSE — soulbae 🧙 (bnot), lens = ${finder.lens}: ${finder.hint}
Frontier context: ${JSON.stringify(measure)}.
TARGET: rewrite ${ctx.repo}/${t.name} in full — ${t.what}. Nothing else is in scope this round.
You may read the target, ${ctx.root}/universe/ADMISSION.md (it binds you), ${ctx.repo}/notes/KILLED_LEVERS.md (never re-propose a K-id without new cited evidence), and any corpus file you need to VERIFY a claim you intend to make. Verify before you assert: the current target is UNVALIDATED — no Gap has ever drawn against it — so treat its claims as candidates, not sources. Where it asserts something you cannot trace, that is a defect to fix, not a fact to preserve.
Your mapText field MUST carry the full rewritten file — that is the artifact the Gap will hash.
EVERY claim carries, inline and visibly: tier (${TIERS.join('|')}), status (${STATUS.join('|')}), pathway (${PATHWAYS.join('|')}), and a trace. A claim you cannot trace is not a claim you may compress — cut it. MYTH is admitted gladly, 3-8 lines, fenced, capture-not-develop, and NEVER in a method section.
Smaller is the objective, but a fact dropped to save words fails the gate and is worth zero at any length (T5). State expectedMetric = the NEW TOTAL across ${ctx.repo}/*.md (i.e. the current total, minus the target's current words, plus your rewrite's words, by the counting rule). hardConstraintNote = how every claim satisfies the four labels. Plan and write text only. Never touch files.`
    },

    holdApart: (proposal, i, ctx) => {
      const t = targetOf(ctx)
      return `Seat HOLD-APART — the Gap ⿻ (xor). You hold the knowledge axioms; you own no corpus.
Proposal artifact (verbatim):
${JSON.stringify(proposal)}
YOUR READING LIST IS FIXED AND COMPLETE. It was set by the config before the proposer was summoned; the proposer has never seen it and cannot influence it. Read these and ONLY these as the ORIGINAL:
${sourceList(t)}
YOUR SCOPE CONTRACT. The target is a MAP, not a transcript: it is roughly 1% the size of its sources, and it is answerable only for the fact classes below. Index ONLY facts that answer one of these questions. A licence string, a JSON version field, a line number, or a code expression is OUT OF SCOPE unless one of these questions asks for it — drawing such a fact tests nothing and fails every possible candidate (round u2 proved this: 0/8 twice, on two independent seeds).
${mustAnswerList(t)}
Procedure:
1. Index checkable facts from the sources above that fall INSIDE the scope contract — a count, a name, a vertex, a field value, a status, a path, a command. Number them F1..Fn; aim for 20-30. Print the numbered list with each fact's source path, its value, and the contract question (Q1..Qn) it answers. A fact answering no question does not go in the pool. Index the SOURCES, not the proposal: within the contract, a fact the rewrite never mentions is exactly the kind the draw must reach. Do not let the proposal steer what you index.
2. Canonically serialize the proposal above (JSON, recursive sorted keys, no whitespace) and SAVE THOSE EXACT BYTES to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json. It must persist — it is the auditor's only route to your seed. SHA-256 that file with a real shell command; show the command and the digest. sha256sum of the saved file MUST equal seedHex.
3. Draw 8 distinct fact indices without replacement: take the digest bytes left to right as unsigned ints b0,b1,...; for draw k, idx = b_k mod (remaining count); remove it. Show every step.
4. For each drawn fact write one question and quote the expected answer from its source, with the path.
5. Tier-dependent probe (ADMISSION.md §2): if the rewrite asserts the drawn fact as PROVEN, also ask for its re-runnable command; if DERIVED, the derivation step; if REPORTED, the source slug; if MYTH, ask only whether it is fenced outside the method sections.
Write { seedHex, draw, transcript } to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/gap.json. Leave proposal_canon.json in place. Never accept a witness the proposer suggested — a validation on proposer-chosen witnesses is void.`
    },

    assay: (proposal, gap, i, ctx) => {
      const t = targetOf(ctx)
      return `Seat ASSAY — soulbis ⚔️ (neg), the prover. Forget the cartographer's story; trust only the run.
Gap seed=${gap.seedHex}. Re-derive it the auditor's way FIRST: \`sha256sum ${ctx.runDir}/p${i + 1}-${proposal.leverId}/proposal_canon.json\` must equal seedHex. BLOCKED if the file is missing or the digest does not reproduce. Transcript: ${gap.transcript}
Then, scratch only (GR-10):
1. Write the proposal's mapText verbatim to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/candidate.md.
2. Answer the Gap's 8 questions using ONLY candidate.md. Do NOT open the sources while answering. ${JSON.stringify(gap.draw)}
3. Grade against the expected answers. gateResult = "n/8". Any wrong or unanswerable question fails the gate.
4. Hard constraint, mechanically: every claim in candidate.md carries tier + status + pathway + trace; spot-resolve at least 3 traces against the filesystem; no MYTH outside a fenced chronicle block. Name the first violation.
5. Metric: total = (words of every top-level .md in ${ctx.repo} EXCEPT ${t.name}) + (words of candidate.md), each by ${WORD_RULE}. Show the arithmetic.
VALIDATED only if gateResult is 8/8 AND the hard constraint holds AND total < frontier best (read ${ctx.repo}/frontier.json). A rewrite that "reads beautifully" and drops a fact the Gap drew is a MIRAGE — name the dropped fact and its source path. An untraceable claim is a MIRAGE even if every question passed: it means the map asserts what the corpus cannot support.
Write verdict.json to ${ctx.runDir}/p${i + 1}-${proposal.leverId}/ with EXACTLY the returned shape, flat fields, metric a bare number. The file an auditor reads must match the data the orchestrator receives. Never write universe.json, FLEET.md, or frontier.json.`
    },

    critic: (proposals, verdicts, ctx) =>
      `Seat CRITIC. Proposals: ${JSON.stringify(proposals.map(p => ({ leverId: p.leverId, lens: p.lens, expectedMetric: p.expectedMetric })))}
Verdicts: ${JSON.stringify(verdicts)}
Classify each closed lever structural / probe-limited / noise / mis-gated (see your seat card). Red-team the CARTOGRAPHER's rationale — did the lens actually find its layer, or did the draw simply miss what it dropped? An 8-question draw over 20-30 indexed facts catches a single omission only sometimes; say so plainly and classify probe-limited rather than pretending.
BEFORE blaming the proposer, check the gate. If every lever failed totally and uniformly across independent seeds and orthogonal lenses, ask whether the drawn witnesses lie outside what objective.metric could ever let a candidate carry. If so the class is MIS-GATED: the verdict stands, the lever is unjudged, no killed lever is filed, and your nextLead addresses the GATE, not the proposer. Two lenses failing identically is not always structure — sometimes it is the sound of a wall.
Never overrule the prover's verdict.
Draft KILLED_LEVERS entries for structural kills. Name exactly ONE next lead.`,

    chronicle: (round, ctx) =>
      `Seat CHRONICLE — the Chronicler 🧙📖. Draft ${ctx.runDir}/CHRONICLE_DRAFT.md following ${ctx.root}/templates/chronicle.md: verdict first, reversals at win-prominence, handoff block ending in the critic's nextLead. Round data: ${JSON.stringify({ roundId: round.roundId, measure: round.measure, verdicts: round.verdicts, critic: round.critic })}
Then do the seat's real work (universe/SEATS.md §5): compress this round to ONE PROVERB — its irreducible core, the sentence that survives. Under the Relationship Proverb Protocol a proverb is key material: a counterparty who did this work independently must be able to reproduce it. A proverb written to sound well rather than to compress faithfully is a forged key and will fail the match. Return the path, a 5-line verdict summary, and the proverb.`,
  },

  schemas: {
    measure: {
      type: 'object', required: ['metric', 'stale', 'leverCosts'],
      properties: {
        metric: { type: 'number', description: 'total words across universe/*.md' },
        stale: { type: 'boolean' },
        targetWords: { type: 'number', description: "the target file's own word count" },
        sourcesPresent: { type: 'boolean', description: 'every source path in the target list exists' },
        leverCosts: { type: 'array', items: { type: 'object', required: ['lever', 'cost', 'ceiling'], properties: { lever: { type: 'string' }, cost: { type: 'string' }, ceiling: { type: 'string' } } } },
        notes: { type: 'string' },
      },
    },
    proposal: {
      type: 'object', required: ['proposals'],
      properties: {
        proposals: {
          type: 'array', minItems: 1, maxItems: 1,
          items: {
            type: 'object',
            required: ['leverId', 'title', 'lens', 'rationale', 'expectedMetric', 'hardConstraintNote', 'mapText'],
            properties: {
              leverId: { type: 'string', description: 'short kebab id; prefix it with your lens so two blind lenses cannot collide' },
              title: { type: 'string' },
              lens: { type: 'string', enum: ['by-container', 'by-claim'] },
              rationale: { type: 'string' },
              expectedMetric: { type: 'number', description: 'NEW TOTAL across universe/*.md after this rewrite' },
              hardConstraintNote: { type: 'string' },
              mapText: { type: 'string', description: 'THE FULL rewritten target file — this is what the Gap hashes' },
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
        draw: { type: 'string', description: 'JSON text: 8 questions, expected answers, and the source path of each' },
        transcript: { type: 'string', description: 'numbered fact index + serialization + exact hash command + digest + draw steps; third-party re-derivable' },
      },
    },
    verdict: {
      type: 'object', required: ['leverId', 'status', 'gateResult', 'evidence'],
      properties: {
        leverId: { type: 'string' },
        status: { type: 'string', enum: ['VALIDATED', 'MIRAGE', 'BLOCKED'] },
        metric: { type: 'number', description: 'new total words across universe/*.md' },
        gateResult: { type: 'string', description: 'n/8' },
        failingCheck: { type: 'string', description: 'for MIRAGE: the dropped fact + its source path, or the untraceable claim' },
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

  // One target, two lenses, at most two rounds. A round that cannot finish
  // proves nothing (see chronicles/2026-07-10_u1_incomplete.md).
  stop: { dryRounds: 1, maxRounds: 2 },

  isValidated: (v) => v.status === 'VALIDATED' && v.gateResult === '8/8',
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
