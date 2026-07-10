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

import { mkdirSync, existsSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, basename } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const T = join(root, 'templates')

const [dirArg, nameArg] = process.argv.slice(2)
if (!dirArg) {
  console.error('usage: node tools/new_instance.mjs <dir> [name]')
  console.error('  e.g. node tools/new_instance.mjs ../my-harness shrink-the-binary')
  process.exit(1)
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
dir('notes'); copy('KILLED_LEVERS.md', join('notes', 'KILLED_LEVERS.md'))
dir('runs'); dir('chronicles'); dir('artifact')

for (const g of ['runs/.gitkeep', 'chronicles/.gitkeep']) {
  const f = join(dest, g)
  if (!existsSync(f)) { writeFileSync(f, ''); made.push(g) }
}

// Give the config its name so the very first edit is a real one, not a rename.
const cfgPath = join(dest, 'harness.config.mjs')
const cfg = readFileSync(cfgPath, 'utf8')
if (cfg.includes("name: 'TODO-my-harness'")) {
  writeFileSync(cfgPath, cfg.replace("name: 'TODO-my-harness'", `name: ${JSON.stringify(name)}`))
}

const rel = (p) => join(dirArg, p).replace(/\\/g, '/')

console.log(`\nscaffolded ${name} → ${dest}`)
if (made.length) console.log('  created: ' + made.join(', '))
if (kept.length) console.log('  kept (already present): ' + kept.join(', '))

console.log(`
It does NOT conform yet, and it should not. Three things are missing, and each
one is a decision only you can make:

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

Then:

  node engine/conform.mjs ${dirArg}                         # must PASS
  node tools/bundle.mjs ${rel('harness.config.mjs')} ${rel('harness.workflow.mjs')}

and run the workflow with { repo: "${dest.replace(/\\/g, '/')}", root: "${root.replace(/\\/g, '/')}", runId: "r1" }.

The conformance gate will refuse a config still wearing its TODOs. That refusal
is the point: a harness that grades nothing will still say VALIDATED.
`)
