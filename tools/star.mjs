#!/usr/bin/env node
// star.mjs — the lattice seating: place an instance and its validated
// results on the ℤ/64ℤ = {0,1}⁶ sovereignty lattice, as DATA ONLY. The
// sibling of emit_feed.mjs (which carries the numbers): this carries the
// GEOMETRY — which vertex the workshop burns at, the anchor the XOR-63 law
// forces, and where each sealed result seats. The star instruments that
// render it (soulbis.com/star, game42, City Key work) live with their
// keepers — GRAPH.md is the dialect they consume.
//
//   node tools/star.mjs <instanceDir> [--vertex N] [--out <dir>]
//
// Emits <out>/star.json (format star.v1; default: <instanceDir>/web/).
//
// The seating rules, stated honestly:
//   · The INSTANCE vertex is declared (config `star: { vertex: N }` or
//     --vertex). Undeclared instances get a PROVISIONAL vertex derived from
//     the instance name's sha256 mod 64 — a content-derived placeholder the
//     JSON labels as such, never a claim of a City seat. Seating a workshop
//     in the City proper is the First Person's (universe/FLEET.md §3).
//   · The ANCHOR is never chosen: anchor = 63 XOR vertex — the anchor law,
//     the same one conform.mjs checks on declared pairs.
//   · Each VALIDATED result seats at κ mod 64 — content-addressed geometry:
//     the artefact's own κ (or, unminted, the sha256 of its lever id) picks
//     its vertex. Re-run = re-true; nothing is assigned by hand.
//   · This is colour and geometry, NEVER proof (FLEET.md §6: mana is not
//     proof). Importing any of it into a real City Key is the door.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { join, resolve, basename } from 'node:path'

const args = process.argv.slice(2)
const dirArg = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out' && args[i - 1] !== '--vertex')[0]
if (!dirArg) { console.error('usage: node tools/star.mjs <instanceDir> [--vertex N] [--out <dir>]'); process.exit(2) }
const inst = resolve(dirArg)
const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null }
const outDir = resolve(flag('--out') || join(inst, 'web'))
mkdirSync(outDir, { recursive: true })

const sha = (s) => createHash('sha256').update(s).digest('hex')
const readJson = (p, d = null) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return d } }

const AXES = [
  { bit: 5, weight: 32, axis: 'Protection', glyph: '🛡️' },
  { bit: 4, weight: 16, axis: 'Delegation', glyph: '🤝' },
  { bit: 3, weight: 8, axis: 'Memory', glyph: '📜' },
  { bit: 2, weight: 4, axis: 'Connection', glyph: '🔗' },
  { bit: 1, weight: 2, axis: 'Computation', glyph: '⚡' },
  { bit: 0, weight: 1, axis: 'Value', glyph: '💎' },
]
const burns = (v) => AXES.filter(a => v & a.weight).map(a => `${a.glyph} ${a.axis}`)

let config = null
try { config = (await import(pathToFileURL(join(inst, 'harness.config.mjs')).href)).default } catch {}
const name = config?.name || basename(inst)

const declared = flag('--vertex') !== null ? Number(flag('--vertex')) : (config?.star?.vertex ?? null)
if (declared !== null && !(Number.isInteger(declared) && declared >= 0 && declared <= 63)) {
  console.error(`refused: vertex must be an integer 0..63, got ${declared}`); process.exit(2)
}
const vertex = declared ?? parseInt(sha(`instance:${name}`).slice(0, 8), 16) % 64
const anchor = 63 ^ vertex
if ((vertex ^ anchor) !== 63) throw new Error('anchor law violated — unreachable')

// ---- seat every VALIDATED result: κ mod 64 ----------------------------------
const results = []
const seatResult = (id, kind, hex, detail) => {
  const clean = String(hex).replace(/^sha256:/, '')
  const v = parseInt(clean.slice(0, 8), 16)
  if (!Number.isFinite(v)) return
  results.push({ id, kind, vertex: v % 64, addressedBy: kind === 'artefact' ? 'κ' : 'sha256(id)', detail })
}
for (const adir of ['artefacts', 'artifacts'].map(d => join(inst, d)).filter(existsSync)) {
  for (const d of readdirSync(adir)) {
    const holon = readJson(join(adir, d, 'holon.json')) || readJson(join(adir, d, 'artefact.json'))
    const kappa = holon?.kappa || holon?.['κ']
    if (kappa) seatResult(d, 'artefact', String(kappa), holon.title || holon.leverId || null)
  }
}
if (existsSync(join(inst, 'runs'))) for (const rid of readdirSync(join(inst, 'runs'))) {
  const walk = (d) => {
    let entries = []
    try { entries = readdirSync(d, { withFileTypes: true }) } catch { return }
    for (const e of entries) {
      if (!e.isDirectory()) continue
      const p = join(d, e.name)
      if (!/^p\d+-/.test(e.name)) { walk(p); continue }
      const verdict = readJson(join(p, 'verdict.json'))
      const prop = readJson(join(p, 'proposal_canon.json'))
      if (verdict?.status === 'VALIDATED' && prop) {
        const id = `${rid}/${prop.leverId || e.name}`
        if (!results.some(r => r.detail === (prop.leverId || null) && r.kind === 'artefact'))
          seatResult(id, 'validated-lever', sha(id), prop.title?.slice(0, 120) || null)
      }
    }
  }
  walk(join(inst, 'runs', rid))
}

const star = {
  format: 'star.v1',
  instance: name,
  derived: 'seated by tools/star.mjs — κ mod 64, re-run = re-true; geometry and colour, never proof (FLEET.md §6)',
  space: 'Z/64Z = {0,1}^6, MSB-first: Protection 32 · Delegation 16 · Memory 8 · Connection 4 · Computation 2 · Value 1',
  vertex: { v: vertex, declared: declared !== null, burns: burns(vertex), note: declared === null ? 'PROVISIONAL — sha256(name) mod 64; declare star.vertex in the config (or seat it in the City) to make it real' : 'declared in harness.config.mjs / --vertex' },
  anchor: { v: anchor, law: 'anchor = 63 XOR vertex — never chosen', burns: burns(anchor) },
  results,
  door: 'importing any of this into a City Key, /star, or game42 is the First Person\'s alone (T6)',
}
writeFileSync(join(outDir, 'star.json'), JSON.stringify(star, null, 2) + '\n')
console.log(`star seated for ${name}: V${vertex}${declared === null ? ' (provisional)' : ''} ⊥ V${anchor} · ${results.length} result(s) → ${join(outDir, 'star.json').split('\\').join('/')}`)
console.log(`geometry only — rendering lives with the consumer (/star, game42, City Key work); dialect: GRAPH.md`)
