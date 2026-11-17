#!/usr/bin/env node
// openrsi/pack.mjs — build the source package an OpenRSI run is submitted from.
//
//   node openrsi/pack.mjs <out-dir>
//
// The package is the harness's method layer and nothing else: the engine, the
// Gap tool, the seat cards a round boots from, the ground rules and trusts, the
// instance scaffolder with the templates it copies, two drivers and the lane
// adapter. It carries no lane's research: no chronicles, no fleet catalogue, no
// instance, no notes about any problem. An OpenRSI harness must be
// general-purpose, and every published package is read by a reviewer, so the
// list below is explicit and the scan at the end refuses a package that names
// a problem domain.
//
// Never overwrites a directory it did not write: the out-dir must be absent,
// empty, or carry the marker file of an earlier pack.

import { mkdirSync, existsSync, readdirSync, rmSync, copyFileSync, writeFileSync, readFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(join(here, '..'))
const out = process.argv[2] ? resolve(process.argv[2]) : null
if (!out) { console.error('usage: node openrsi/pack.mjs <out-dir>'); process.exit(2) }

const FILES = [
  'LICENSE', 'GROUND_RULES.md', 'TRUSTS.md',
  'engine/dual_agent_loop.mjs', 'engine/gap.mjs', 'tools/kappa.mjs', 'tools/new_instance.mjs',
  'drivers/stub.mjs', 'drivers/claude_code.mjs',
  'seats/measure.md', 'seats/soulbae-propose.md', 'seats/gap-hold-apart.md', 'seats/soulbis-assay.md', 'seats/critic.md', 'seats/chronicle.md', 'seats/keystone.md',
  'templates/harness.config.mjs', 'templates/frontier.json', 'templates/claims_register.md', 'templates/manifest.yaml', 'templates/SOURCES.md', 'templates/KILLED_LEVERS.md',
  'openrsi/enter.mjs', 'openrsi/lane.config.mjs',
]
const ROOTED = { 'openrsi/package/harness.json': 'harness.json', 'openrsi/package/Dockerfile': 'Dockerfile', 'openrsi/package/README.md': 'README.md' }

const MARK = '.packed-by-openrsi-pack'
if (existsSync(out) && readdirSync(out).length && !existsSync(join(out, MARK))) {
  console.error(`pack: ${out} exists and was not written by this tool; refusing to replace it`); process.exit(2)
}
if (existsSync(out)) for (const e of readdirSync(out)) rmSync(join(out, e), { recursive: true, force: true })
mkdirSync(out, { recursive: true })

const missing = [...FILES, ...Object.keys(ROOTED)].filter(f => !existsSync(join(root, f)))
if (missing.length) { console.error('pack: missing source files:\n  ' + missing.join('\n  ')); process.exit(2) }
const put = (from, to) => { mkdirSync(dirname(join(out, to)), { recursive: true }); copyFileSync(join(root, from), join(out, to)) }
for (const f of FILES) put(f, f)
for (const [from, to] of Object.entries(ROOTED)) put(from, to)
writeFileSync(join(out, MARK), 'written by openrsi/pack.mjs; safe to regenerate\n')

// ---- the scan: a general-purpose package names no problem domain ---------------
// Words that would mean a lane's research travelled with the method.
const DOMAIN = /\b(ecdsa|secp256\w*|toffoli|qubits?|point[ _-]?add\w*|elliptic|modular (inversion|multiplication)|montgomery|karatsuba|adders?|shor(?:'s|_\w+)?|cuccaro|gidney)\b/i
const packed = [...FILES, ...Object.values(ROOTED)]
const hits = []
let bytes = 0
const digest = createHash('sha256')
for (const f of packed.slice().sort()) {
  const buf = readFileSync(join(out, f)); bytes += statSync(join(out, f)).size
  digest.update(f + '\0').update(buf)
  buf.toString('utf8').split(/\r?\n/).forEach((line, i) => { const m = DOMAIN.exec(line); if (m) hits.push(`${f}:${i + 1}: "${m[0]}"  ${line.trim().slice(0, 110)}`) })
}
console.log(`packed ${packed.length} files, ${bytes} bytes → ${out}`)
console.log('package sha256 (paths + bytes, sorted): ' + digest.digest('hex'))
if (hits.length) { console.error(`\npack: NO-GO — ${hits.length} line(s) name a problem domain; a general-purpose package may not:\n  ` + hits.join('\n  ')); process.exit(1) }
console.log('domain scan: clean')
