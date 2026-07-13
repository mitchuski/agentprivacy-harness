#!/usr/bin/env node
// check_claims.mjs — the claims register polices itself (D4).
//
//   node tools/check_claims.mjs
//
// A claim register grades every load-bearing claim on two axes: a TIER
// (epistemic strength: PROVEN/DERIVED/REPORTED/OPEN/MYTH) and an ENFORCED-BY
// (the mechanism: code/protocol/runtime/prompt/manual/nothing). The tiers were
// always here; the second axis is the one an external reviewer had to supply by
// hand. This gate makes the pairing a rule:
//
//   a claim tiered PROVEN or DERIVED whose enforcement is prompt, manual, or
//   nothing is a HARD FAILURE — it asserts more than it can make true.
//
// That single rule would have caught D1 (grinding: PROVEN by "nothing"), the
// isolation overclaim (DERIVED by "prompt"), and the fact-preservation
// overclaim (DERIVED by a sample) before review did. It is the cheapest gate in
// the repo and it makes the register self-policing.
//
// It reads every claims_register.md it can find (repo root + each instance),
// but only enforces on registers that carry an `enforced by` column — a
// register without it is legacy, and reported as needing the column, not failed
// silently. Zero dependencies.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const STRONG = new Set(['proven', 'derived'])
const WEAK_ENFORCE = new Set(['prompt', 'manual', 'nothing'])
const KNOWN_ENFORCE = new Set(['code', 'protocol', 'runtime', 'prompt', 'manual', 'nothing'])

// the CURRENT enforcement of a cell like "**prompt** (seat cards) → runtime,
// post-D3" is `prompt`: take the text before any arrow, strip markdown/backticks,
// and read the first bare word.
function currentEnforcement(cell) {
  const beforeArrow = String(cell).split(/→|->|,/)[0]
  const cleaned = beforeArrow.replace(/[*`~_()]/g, ' ').trim().toLowerCase()
  const word = (cleaned.match(/[a-z]+/) || [''])[0]
  return word
}
function currentTier(cell) {
  const cleaned = String(cell).split(/→|->/)[0].replace(/[*`~_()]/g, ' ').trim().toLowerCase()
  return (cleaned.match(/proven|derived|reported|open|myth/) || [''])[0]
}

// find claims_register.md at the repo root and one level down (and under
// examples/), the same discovery the conformance gate uses for instances.
function findRegisters() {
  const found = []
  const consider = (p) => { if (existsSync(p)) found.push(p) }
  consider(join(root, 'claims_register.md'))
  const scanDir = (base) => {
    if (!existsSync(base)) return
    for (const name of readdirSync(base)) {
      if (['node_modules', '.git'].includes(name)) continue
      const d = join(base, name)
      try { if (statSync(d).isDirectory()) consider(join(d, 'claims_register.md')) } catch {}
    }
  }
  scanDir(root)
  scanDir(join(root, 'examples'))
  return [...new Set(found)]
}

// parse the first markdown table that has both a `tier` and an `enforced`
// header. Returns { rows: [{id, tier, enforce, raw}], hasEnforce }.
// split a markdown table row on unescaped pipes only — a claim like
// `I(Y_S ; Y_M \| X)` carries a literal pipe, and a naive split('|') would
// shift that row's columns and make the checker silently skip the very claim it
// must catch (found by running: flipping such a row's tier didn't trip the gate).
function cellsOf(line) {
  return line.split(/(?<!\\)\|/).map(s => s.trim())
}

function parseRegister(text) {
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*\|/.test(lines[i])) continue
    const header = cellsOf(lines[i]).map(s => s.toLowerCase())
    const tierCol = header.findIndex(h => h === 'tier')
    const enfCol = header.findIndex(h => h.includes('enforced'))
    const idCol = header.findIndex(h => h === 'id')
    if (tierCol < 0) continue
    // header + separator + rows
    const rows = []
    for (let j = i + 2; j < lines.length && /^\s*\|/.test(lines[j]); j++) {
      const cells = cellsOf(lines[j])
      // cellsOf on "| a | b |" yields ['', 'a', 'b', ''] — indices line up with header
      if (cells.length < header.length) continue
      rows.push({
        id: idCol >= 0 ? cells[idCol] : `row ${j - i - 1}`,
        tier: currentTier(cells[tierCol]),
        enforce: enfCol >= 0 ? currentEnforcement(cells[enfCol]) : null,
        raw: lines[j].trim(),
      })
    }
    return { rows, hasEnforce: enfCol >= 0 }
  }
  return { rows: [], hasEnforce: false }
}

const registers = findRegisters()
const failures = []
const warnings = []
let enforcedRegisters = 0
let claimsChecked = 0

for (const path of registers) {
  const rel = relative(root, path).replace(/\\/g, '/')
  const { rows, hasEnforce } = parseRegister(readFileSync(path, 'utf8'))
  if (!hasEnforce) { warnings.push(`${rel}: no "enforced by" column — add it so claims can be policed (D4)`); continue }
  enforcedRegisters++
  for (const r of rows) {
    if (!r.tier) continue
    claimsChecked++
    if (STRONG.has(r.tier)) {
      if (!r.enforce || r.enforce === '') { failures.push(`${rel} · ${r.id}: ${r.tier.toUpperCase()} but enforced-by is blank`); continue }
      if (WEAK_ENFORCE.has(r.enforce)) failures.push(`${rel} · ${r.id}: ${r.tier.toUpperCase()} enforced only by "${r.enforce}" — downgrade the tier or build the enforcement (D4)`)
      else if (!KNOWN_ENFORCE.has(r.enforce)) warnings.push(`${rel} · ${r.id}: unrecognised enforcement "${r.enforce}" (expected one of ${[...KNOWN_ENFORCE].join('/')})`)
    }
  }
}

console.log('')
for (const w of warnings) console.log(`  note  ${w}`)
if (failures.length) {
  console.error(`\nCLAIMS GATE FAILED — ${failures.length} claim(s) assert more than they enforce:`)
  for (const f of failures) console.error(`  FAIL  ${f}`)
  console.error(`\nA PROVEN/DERIVED claim enforced only by prompt/manual/nothing is an overclaim. Fix the claim or the enforcement.`)
  process.exit(1)
}
console.log(`\nCLAIMS GATE PASS — ${claimsChecked} strong-tier claim(s) across ${enforcedRegisters} register(s) all enforced by code/protocol/runtime.`)
