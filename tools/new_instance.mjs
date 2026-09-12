#!/usr/bin/env node
// new_instance.mjs — scaffold a harness instance from templates/.
//
//   node tools/new_instance.mjs <dir> [name]
//
// Copies the ledgers and a blank config, makes the directories the engine
// writes into, and then tells you exactly what remains — because a scaffold
// that pretends to be finished is the first mirage a newcomer meets.
//
// It never overwrites. Re-running on an existing instance reports what is
// already there and leaves it alone.

import { mkdirSync, existsSync, copyFileSync, writeFileSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, basename, sep } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const T = join(root, 'templates')

// --prover <model>: seat the prover on a different model than the proposer, so
// the pair is cross-model from the first round (conform.mjs D4b advisory:
// same-model pairs have Φ_inference ≈ 0 — the prover shares the proposer's
// blind spots). One flag here beats a config edit nobody makes.
const argv = process.argv.slice(2)
const values = {}, positional = []
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (['--prover', '--source'].includes(a)) {
    if (!argv[i + 1] || argv[i + 1].startsWith('--') || values[a]) {
      console.error('missing or duplicate value for ' + a); process.exit(1)
    }
    values[a] = argv[++i]
  } else if (a.startsWith('--')) { console.error('unknown option: ' + a); process.exit(1) }
  else positional.push(a)
}
const [dirArg, nameArg] = positional
const prover = values['--prover'] || null
const source = values['--source'] ? resolve(values['--source']) : null
if (!dirArg || positional.length > 2) {
  console.error('usage: node tools/new_instance.mjs <dir> [name] [--prover <model>] [--source <research-directory>]')
  process.exit(1)
}
if (source && (!existsSync(source) || !statSync(source).isDirectory())) {
  console.error('--source must name an existing local directory'); process.exit(1)
}
const dest = resolve(dirArg)
const name = nameArg || basename(dest)

const made = []
const kept = []

const dir = (p) => { const f = join(dest, p); if (existsSync(f)) { kept.push(p + '/') } else { mkdirSync(f, { recursive: true }); made.push(p + '/') } }
const copy = (from, to) => {
  const f = join(dest, to)
  if (existsSync(f)) { kept.push(to); return }
  copyFileSync(join(T, from), f); made.push(to)
}

mkdirSync(dest, { recursive: true })
copy('harness.config.mjs', 'harness.config.mjs')
copy('frontier.json', 'frontier.json')
copy('claims_register.md', 'claims_register.md')
copy('manifest.yaml', 'manifest.yaml')
copy('SOURCES.md', 'SOURCES.md')
dir('notes'); copy('KILLED_LEVERS.md', 'notes/KILLED_LEVERS.md')
dir('runs'); dir('chronicles'); dir('artifact')

for (const g of ['runs/.gitkeep', 'chronicles/.gitkeep']) {
  const f = join(dest, g)
  if (!existsSync(f)) { writeFileSync(f, ''); made.push(g) }
}

// Give the config its name so the very first edit is a real one, not a rename.
const cfgPath = join(dest, 'harness.config.mjs')
const cfg = readFileSync(cfgPath, 'utf8')
let cfgOut = cfg
if (cfgOut.includes("name: 'TODO-my-harness'")) {
  cfgOut = cfgOut.replace("name: 'TODO-my-harness'", `name: ${JSON.stringify(name)}`)
}
// Seat the prover model right under the door line; conform.mjs reads
// config.seatOpts.assay.model and drops the D4b advisory when it differs.
const doorLine = "door: 'first-person', // T6 — leave exactly as is; conform.mjs checks the literal"
if (prover && cfgOut.includes(doorLine) && !cfgOut.includes('seatOpts:')) {
  cfgOut = cfgOut.replace(doorLine, doorLine + `\n\n  // The prover's model (D4b). The proposer runs on the caller's default; the\n  // prover must not. Set by new_instance.mjs --prover.\n  seatOpts: { assay: { model: ${JSON.stringify(prover)} } },`)
}
if (made.includes('harness.config.mjs') && cfgOut !== cfg) writeFileSync(cfgPath, cfgOut)

const connectionPath = join(dest, 'connection.local.json')
if (!existsSync(connectionPath)) {
  writeFileSync(connectionPath, JSON.stringify({
    version: 1, state: 'draft', harnessRoot: resolve(root), instanceRoot: dest,
    researchRoot: source, revision: null, purpose: null, allowedInputs: [],
    scratchRoot: join(dest, 'runs'), runtime: null,
    authorization: { execution: null, providerDisclosure: null, budget: null },
    note: 'Planning record only; not a sandbox or permission grant. The runner does not read source files from this record. Configure explicit inputs and checks before running.'
  }, null, 2) + '\n')
  made.push('connection.local.json')
}
const ignorePath = join(dest, '.gitignore')
const ignore = existsSync(ignorePath) ? readFileSync(ignorePath, 'utf8') : ''
if (!ignore.split(/\r?\n/).includes('connection.local.json')) writeFileSync(ignorePath, ignore + (ignore && !ignore.endsWith('\n') ? '\n' : '') + 'connection.local.json\n')

const rel = (p) => join(dirArg, p).replace(/\\/g, '/')
const show = (p) => p.replace(/\\/g, '/')
const q = (p) => (/\s/.test(p) ? JSON.stringify(p) : p)

// Say what a flag did NOT do. A re-run never overwrites, so a --prover or a
// --source aimed at a file that already exists is dropped — loudly, not silently.
const notes = []
if (prover && !made.includes('harness.config.mjs')) notes.push(`--prover ${prover} was NOT applied: ${rel('harness.config.mjs')} already existed and is never overwritten. Set seatOpts.assay.model by hand.`)
if (source && !made.includes('connection.local.json')) notes.push(`--source was NOT recorded: ${rel('connection.local.json')} already existed. Set researchRoot by hand.`)
const harnessRoot = resolve(root)
if (dest === harnessRoot || dest.startsWith(harnessRoot + sep)) notes.push(`this instance sits INSIDE the harness checkout (${show(harnessRoot)}). tools/check.mjs discovers and gates it, and fails until it conforms; ENTRY.md scaffolds a sibling such as ../my-harness.`)

console.log(`\nscaffolded ${name} → ${show(dest)}`)
if (made.length) console.log('  created: ' + made.map(show).join(', '))
if (kept.length) console.log('  kept (already present): ' + kept.map(show).join(', '))
for (const n of notes) console.log('  note: ' + n)

console.log(kept.includes('harness.config.mjs') ? `
${rel('harness.config.mjs')} was kept as it was; the three answers below apply only if it is still unfilled.
Read ENTRY.md; connection.local.json records source and scope without granting permissions:` : `
It does NOT conform yet, and it should not. Three things are missing, and each
one must be grounded in the user's purpose and existing authorization.
Read ENTRY.md; connection.local.json records source and scope without granting permissions:`)

console.log(`
  1. THE GAP — before anything else. Say how held-out witnesses derive from a
     proposal by hashing it. If you cannot, you do not have a harness yet; you
     have a to-do list. Write it into ${rel('harness.config.mjs')} as
     heldApartRule, and into the holdApart prompt as a procedure.

  2. THE OBJECTIVE, THE GATE, THE HARD CONSTRAINT — fill every TODO in
     ${rel('harness.config.mjs')}. The gate is a factor in a product: any zero
     collapses the result at any score (T5). The hard constraint is validity no
     score may override (GR-3).

  3. THE BASELINE — measure your artifact as it stands today, by a stated
     counting rule, and write the number into ${rel('frontier.json')}
     (baseline.metric, and best.metric equal to it). Nothing has beaten it yet.

Then, in this order (ENTRY.md):

  node engine/conform.mjs ${q(dirArg)}                                   # must PASS
  node drivers/run.mjs --instance ${q(dirArg)} --driver stub --run smoke    # plumbing only, no model
  node tools/verify_run.mjs ${q(dirArg)} smoke                           # every seed re-derived offline

A real round names a model per seat; the CLI draws the run secret itself:

  node drivers/run.mjs --instance ${q(dirArg)} --driver ollama --propose-model <a> --assay-model <b> --run r1

Only a runtime that provides the Workflow interface needs a bundle:

  node tools/bundle.mjs ${q(rel('harness.config.mjs'))} ${q(rel('harness.workflow.mjs'))}

run with { repo: "${show(dest)}", root: "${show(harnessRoot)}", runId: "r1", saltSecret: "<64 hex the runtime draws and no seat ever sees>" }.
Without saltSecret the engine runs LEGACY unsalted — do not claim salted separation.

The conformance gate, the bundler and the runner all refuse a config still
wearing its TODOs. That refusal is the point: a harness that grades nothing
would still say VALIDATED.
`)
