#!/usr/bin/env node
// make_default.mjs — emit the DEFAULT distribution: the system alone.
//
//   node tools/make_default.mjs [--out <dir>]     (default: dist/default-harness)
//
// The default carries no results and no chronicles: engine, seats, tools,
// templates, the constitution and method documents, and the spar RESET to its
// measured baseline (730 words, census gate, no folds, OT-1 open). Everything
// excluded — the frontier history, the chronicles, the origin fleet catalogue
// (HARNESS_PATHS.md), RESEARCH.md's evidence, the universe seam — lives in the
// origin repository; the generated README says so.
//
// re-run = re-derived: the output is a pure function of this tree. After
// emitting, this tool runs `node tools/check.mjs` INSIDE the distribution and
// fails loudly if any gate is red — a default that does not pass its own gates
// is not a default (GR-5).
//
// Zero dependencies. Publishing the emitted tree anywhere is the First
// Person's door (T6).

import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative, basename } from 'node:path'
import { spawnSync } from 'node:child_process'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(join(here, '..'))
const argv = process.argv.slice(2)
const oi = argv.indexOf('--out')
const out = resolve(oi >= 0 && argv[oi + 1] ? argv[oi + 1] : join(root, 'dist', 'default-harness'))

if (out === root || root.startsWith(out)) { console.error('refusing: --out would overwrite the source tree'); process.exit(1) }
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const read = (p) => readFileSync(join(root, p), 'utf8')
const write = (rel, text) => { const p = join(out, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, text.replace(/\r\n/g, '\n')) }
const copy = (rel, toRel = rel) => cpSync(join(root, rel), join(out, toRel), { recursive: true })
// copy a directory but leave its run records and chronicles behind: the
// default carries the instance, never the origin's results (GR-5).
const RESULT_DIRS = new Set(['runs', 'chronicles', 'artefacts'])
const copyInstance = (rel) => cpSync(join(root, rel), join(out, rel), { recursive: true, filter: (src) => !RESULT_DIRS.has(basename(src)) })

// ---- the system: directories carried whole ----
copy('engine')
copy('seats')
copy('templates')
copy('tools')
copy('drivers')
rmSync(join(out, 'tools', 'console.roots.json'), { force: true })   // operator-local machine paths
rmSync(join(out, 'tools', 'workshop.html'), { force: true })        // the origin's front page presents the origin's evidence
rmSync(join(out, 'tools', 'make_default.mjs'), { force: true })     // the default does not re-emit itself

// ---- root documents: constitution + method, no results ----
for (const f of ['LICENSE', '.gitattributes', '.gitignore',
  'TRUSTS.md', 'GROUND_RULES.md', 'SEAT_CONTRACT.md', 'ADOPTION.md',
  'AGENTS.md', 'CLAUDE.md', 'SKILL.md', 'ENTRY.md',
  'WORKFLOW.md', 'PRACTICES.md', 'SOURCES.md', 'THREATS.md']) {
  if (existsSync(join(root, f))) copy(f)
}
write('README.md', read('templates/README.default.md'))
write('PATHWAYS.md', read('templates/PATHWAYS.default.md'))

// In the default, a few method documents point at things that live upstream or
// moved behind optional/; repoint them so a newcomer's first click lands.
const repoint = (rel, pairs) => {
  const p = join(out, rel); if (!existsSync(p)) return
  let s = readFileSync(p, 'utf8'); for (const [a, b] of pairs) s = s.split(a).join(b); writeFileSync(p, s)
}
repoint('SKILL.md', [['`SPECIALISATION.md`', '`optional/SPECIALISATION.md`'], ['`GRAPH.md`', '`optional/GRAPH.md`'], ['`HOLONS.md`', '`optional/HOLONS.md`'], ['`WIKI.md`', '`optional/WIKI.md`']])
repoint('ADOPTION.md', [['`universe/audit.mjs`', '`examples/corpus/tools/census.mjs`']])
repoint('WORKFLOW.md', [['hh_workshop ran every seat on a local', 'the origin\'s standalone workshop ran every seat on a local model, and `drivers/ollama.mjs` does the same here; a local']])
repoint('SEAT_CONTRACT.md', [['`universe/audit.mjs`', '`examples/corpus/tools/census.mjs`']])

// ---- optional layers: the origin's ecosystem, adopted one at a time ----
// These four name the origin's own sites, registries and lore. They are method
// documents, not results, so they ship — but behind a directory whose README
// says what they are, so a fresh instance is never booted into them by
// accident (AGENTS.md, "Whose problem this is").
for (const f of ['SPECIALISATION.md', 'GRAPH.md', 'HOLONS.md', 'WIKI.md']) {
  if (existsSync(join(root, f))) copy(f, join('optional', f))
}
write('optional/README.md', `# optional — layers you adopt one at a time\n\nNone of these is needed to run a round. Each names the origin repository's\nown ecosystem (its sites, registries, personas and wiki farms) as the worked\nexample; the method in each travels, the names do not. Adopt a layer when the\nrung you are on asks for it (README, "Adopt it in steps"):\n\n- \`SPECIALISATION.md\` — dressing seats with personas and skills; the station\n  pattern that lets instances multiply without drifting.\n- \`GRAPH.md\` — the graph dialect: κ-addressed nodes, edges that a signature\n  mints, the emitters in \`tools/\` (spellweb, star, emit_feed, vrc).\n- \`HOLONS.md\` — content addressing: κ = sha256 of canonical JSON with the label\n  excluded from its own preimage; sealed artefacts that re-derive anywhere.\n- \`WIKI.md\` — publishing a harness's ledgers into a federated wiki.\n\nReferences in these files to the origin's fleet, catalogue or chronicles\nresolve upstream, at github.com/mitchuski/agentprivacy-harness.\n`)

// claims register: drop the one row whose status narrates origin results
// (CR-H7 cites specific folds); every other row's evidence ships and re-runs.
write('claims_register.md', read('claims_register.md').split('\n')
  .filter(l => !l.startsWith('| CR-H7 ')).join('\n'))

// chronicles: the discipline, with no entries — the first is the adopter's
write('chronicles/README.md', `# chronicles — this repo's record\n\nOne file per session, \`YYYY-MM-DD_slug.md\`, verdict first, reversals recorded\nwith the same prominence as progress, ending in a handoff block. A session\nwithout a chronicle is unfinished (GR-7).\n\n**Empty by design.** This is the default distribution: the record starts with\nyou. The origin repository's chronicles are the worked example — read them in\ndate order to learn what the discipline feels like in practice.\n`)

// ---- the spar, reset to its baseline ----
const fg = 'examples/field-guide'
for (const f of ['harness.config.mjs', 'harness.workflow.mjs', 'SOURCES.md']) copy(`${fg}/${f}`)
copy(`${fg}/artifact/GUIDE.md`)
const frontier = JSON.parse(read(`${fg}/frontier.json`))
write(`${fg}/frontier.json`, JSON.stringify({
  authority: frontier.authority,
  updated: 'reset — the default distribution ships the spar at its baseline; the first fold is yours',
  objective: frontier.objective,
  baseline: frontier.baseline,
  best: { metric: frontier.baseline.metric, leverIds: [], evidence: 'equal to baseline — nothing has beaten it yet (GR-5: pretending otherwise is the first mirage)' },
  history: [{ metric: frontier.baseline.metric, date: frontier.baseline.date || null, lever: null, note: 'baseline — the moving ceiling’s start' }],
  openTarget: { id: 'OT-1', statement: `below ${frontier.baseline.metric} ${frontier.objective.metric} at the full census gate (every fact probed) with the hard constraint intact`, status: 'OPEN' },
  closedTargets: [],
}, null, 2) + '\n')
write(`${fg}/manifest.yaml`, read('templates/manifest.yaml').replace('<instance name>', 'field-guide'))
write(`${fg}/claims_register.md`, read('templates/claims_register.md'))
write(`${fg}/notes/KILLED_LEVERS.md`, read('templates/KILLED_LEVERS.md'))
write(`${fg}/chronicles/.gitkeep`, '')
write(`${fg}/README.md`, `# the spar — reset to its baseline\n\nA practice bout: compress \`artifact/GUIDE.md\` (${frontier.baseline.metric} ${frontier.objective.metric},\nmeasured by: \`${frontier.baseline.how}\`) while the census gate stays a full\npass — every enumerable fact probed, drawn against the ORIGINAL by hashing\nyour proposal with a run secret you never see. No folds have happened here:\nOT-1 is open, the frontier is yours to move, and the first chronicle is\nyours to write.\n\nRun a round with a driver (no model, a local model, or the Claude API):\n\n\`\`\`bash\nnode drivers/run.mjs --instance examples/field-guide --driver stub --run smoke\nnode drivers/run.mjs --instance examples/field-guide --driver ollama --model <m> --run r1\nnode drivers/run.mjs --instance examples/field-guide --driver anthropic --run r1      # ANTHROPIC_API_KEY\n\`\`\`\n\nOr with the Claude Code Workflow tool (the reference runtime):\n\n\`\`\`\nscriptPath: examples/field-guide/harness.workflow.mjs\nargs: { \"repo\": \"<abs>/examples/field-guide\", \"root\": \"<abs of this clone>\", \"runId\": \"r1\" }\n\`\`\`\n\nThen audit (\`node tools/verify_run.mjs examples/field-guide r1\`), fold as\nkeystone (\`seats/keystone.md\`), and seal (\`node tools/mint_artefact.mjs\`).\nThe origin repository's spar walked this same ground to a validated 472 —\nits chronicles are the worked example; its numbers are not yours to inherit.\n`)

// ---- the auditor and the self-fold: carried as instances, without results ----
copyInstance('examples/corpus')
copyInstance('examples/self')
write('examples/self/chronicles/.gitkeep', '')
write('examples/corpus/chronicles/.gitkeep', '')

// frontier.html ships a demo block carrying the origin spar's results; in the
// default it must not — swap it for the reset shape (served mode reads YOUR
// live feed and is unaffected).
const fhPath = join(out, 'tools', 'frontier.html')
if (existsSync(fhPath)) {
  const fh = readFileSync(fhPath, 'utf8')
  const start = fh.indexOf('var DEMO = {')
  const end = fh.indexOf('};', start)
  if (start >= 0 && end > start) {
    const demo = `var DEMO = { feed:'demo', instance:'field-guide (baseline — no folds yet)',\n  movingCeiling:{ metric:'${frontier.objective.metric}', baseline:${frontier.baseline.metric}, best:${frontier.baseline.metric}, ratioNow:1,\n    open:{ id:'OT-1', statement:'below ${frontier.baseline.metric} at the full census gate — the first fold is yours' },\n    series:[ {label:'baseline',value:${frontier.baseline.metric},ratio:1,date:null,lever:null,coverage:null,chronicle:null} ]},\n  objective:${JSON.stringify(frontier.objective)},\n  verdicts:{VALIDATED:0,MIRAGE:0,BLOCKED:0}, runs:[], killedLevers:null, artefacts:[] }`
    writeFileSync(fhPath, fh.slice(0, start) + demo + fh.slice(end + 2))
  }
}

// provenance note — what was left behind, and where it lives
write('DEFAULT.md', `# the default distribution\n\nGenerated by \`tools/make_default.mjs\` from the origin repository\n(github.com/mitchuski/agentprivacy-harness). It carries the SYSTEM alone:\nthe engine, the seats, the tools, four drivers, the constitution, three\nexamples reset to their baselines, and the optional layers behind\n\`optional/\`. No results, no chronicles, no fleet.\n\nDeliberately absent, living upstream: the origin's advancing frontiers and\nrun records · \`chronicles/\` · \`HARNESS_PATHS.md\` (the origin operator's\nfleet — any reference to it in these documents resolves upstream) ·\n\`RESEARCH.md\` (the origin's evidence statement) · \`EVOLUTION.md\` ·\n\`HARDENING.md\` and its plan · \`universe/\` (one project's corpus) · the\nworkshop front page · every \`runs/\` and \`artefacts/\` directory.\n\nEvery gate passes here without them — run \`node tools/check.mjs\` and see.\nThe record starts with you. Whose problem this is: yours (\`AGENTS.md\`).\n`)

// ---- self-check: the default must pass its own gates ----
console.log(`default distribution → ${relative(process.cwd(), out).replace(/\\/g, '/')}`)
const chk = spawnSync(process.execPath, [join(out, 'tools', 'check.mjs')], { cwd: out, encoding: 'utf8' })
process.stdout.write((chk.stdout || '').split('\n').slice(-6).join('\n'))
if (chk.status !== 0) {
  process.stderr.write(chk.stderr || '')
  console.error('\nDEFAULT REFUSED — a distribution that fails its own gates is not a default (GR-5).')
  process.exit(1)
}
console.log('\nThe default stands: system only, gates green, the record empty on purpose. Publishing it anywhere is the First Person’s (T6).')
