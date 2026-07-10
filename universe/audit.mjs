#!/usr/bin/env node
// audit.mjs — the universe auditor. Exhaustive, deterministic, no agents.
//
//   node universe/audit.mjs
//
// WHY THIS EXISTS INSTEAD OF A HARNESS
//
// The Fiat-Shamir Gap earns its cost when the claim space is too large to
// check — 9,024 circuit witnesses, an infinity of R1CS points. You sample,
// and hashing the proposal is what makes the sample honest.
//
// This corpus map makes on the order of a hundred claims, and every one of
// them is enumerable. So check them ALL. Against an exhaustive check a mirage
// is impossible: there is nothing to tune to. A proposer cannot flatter a
// script that reads every line.
//
// Rounds u1 and u2 cost ~1.4M tokens and produced no evidence about the map,
// because a sampled gate was applied where an exhaustive one belonged. u2's
// verdicts measured the config, not the artifact. See
// chronicles/2026-07-10_u2_mis-gated.md and 2026-07-10_u3_retirement.md.
//
// This is the shape HARNESS_PATHS.md already names for the substrate and the
// publishing loop: an INTEGRITY GATE, NOT AN ADVERSARY.
//
// Exit 1 on any error. Warnings do not fail the build but are printed.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const errs = []
const warns = []
const ok = (cond, msg) => { if (!cond) errs.push(msg) }
const warn = (cond, msg) => { if (!cond) warns.push(msg) }

const read = (p) => readFileSync(join(here, p), 'utf8')
const has = (p) => existsSync(join(here, p))

const universe = JSON.parse(read('universe.json'))
const frontier = JSON.parse(read('frontier.json'))

// The method documents. MYTH may never appear as a claim tier here (GR-2).
const METHOD_DOCS = ['README.md', 'FLEET.md', 'SEATS.md', 'ADMISSION.md', 'ERRATA.md']
const mdText = Object.fromEntries(METHOD_DOCS.map(f => [f, read(f)]))

// ---------------------------------------------------------------- 1. axes
const AX = universe.sovereignty_axes
const axisNames = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].map(k => AX[k]?.axis)
const axisWeights = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'].map(k => AX[k]?.weight)
ok(JSON.stringify(axisWeights) === JSON.stringify([32, 16, 8, 4, 2, 1]),
  `axes: weights must be MSB-first 32,16,8,4,2,1 — got ${axisWeights.join(',')}`)
ok(new Set(axisNames).size === 6, 'axes: six distinct axis names required')

const weightOf = (name) => { const i = axisNames.indexOf(name); return i < 0 ? null : axisWeights[i] }
const bitsOf = (n) => axisNames.filter((_, i) => n & axisWeights[i])
const bin = (n) => n.toString(2).padStart(6, '0')

// ------------------------------------------------- 2. the anchor law (XOR 63)
// This is the check that E-7 taught us to want. The XOR survives a
// transposition of names across a pair, so verify the DIMENSIONS too.
for (const p of universe.vertex_inventory?.seated_pairs || []) {
  const [a, b] = p.pair
  ok((a ^ b) === 63, `seated_pairs: V${a} ⊕ V${b} = ${a ^ b}, must be 63 (the anchor law)`)
  ok(p.xor === 63, `seated_pairs: V${a}⊥V${b} declares xor=${p.xor}, must be 63`)
}

for (const v of universe.vertex_inventory?.determined_vacancies || []) {
  const { vertex, forced_anchor, burns, workshop } = v
  ok((vertex ^ forced_anchor) === 63,
    `${workshop}: V${vertex} ⊕ V${forced_anchor} = ${vertex ^ forced_anchor}, must be 63`)

  // burns is either an explicit axis list, or "all but X"
  let expected = bitsOf(vertex)
  if (Array.isArray(burns) && burns.length) {
    const allBut = /^all but (.+)$/.exec(burns[0])
    if (allBut) {
      const excluded = allBut[1].trim()
      ok(weightOf(excluded) !== null, `${workshop}: "all but ${excluded}" names no known axis`)
      const shouldBe = axisNames.filter(a => a !== excluded)
      ok(JSON.stringify(expected.slice().sort()) === JSON.stringify(shouldBe.slice().sort()),
        `${workshop}: V${vertex} (${bin(vertex)}) burns ${expected.join('+')}, but declares "all but ${excluded}"`)
    } else {
      ok(JSON.stringify(burns.slice().sort()) === JSON.stringify(expected.slice().sort()),
        `${workshop}: V${vertex} (${bin(vertex)}) burns ${expected.join('+')}, but declares ${burns.join('+')} — a name/dimension transposition (see ERRATA E-7)`)
    }
  }
}

// ------------------------------------------------------------- 3. the seats
const SEATS = ['measure', 'propose', 'hold-apart', 'assay', 'critic', 'chronicle', 'keystone']
const seats = universe.seats || {}
for (const s of SEATS) ok(!!seats[s], `seats: missing seat "${s}"`)
const algebra = { propose: 'bnot', 'hold-apart': 'xor', assay: 'neg', keystone: 'succ' }
for (const [s, op] of Object.entries(algebra)) {
  ok(seats[s]?.algebra === op, `seats: "${s}" must carry algebra "${op}", got "${seats[s]?.algebra}"`)
}
ok(seats.keystone?.personaComplement, 'seats: the keystone is the PAIR — it must record a personaComplement')

const cc = seats.corpus_counts || {}
ok((cc.swordsman + cc.mage + cc.balanced) === cc.total,
  `seats: corpus_counts ${cc.swordsman}+${cc.mage}+${cc.balanced} ≠ total ${cc.total}`)

// --------------------------------------------- 4. the map covers every corpus
// A map that drops a layer has forgotten, not compressed. The README's layer
// table must carry one row per corpus the frontier enumerates.
const layerRows = (mdText['README.md'].match(/^\|\s*\*\*[a-z]+\*\*\s*\|/gm) || []).length
ok(layerRows === frontier.corpora.length,
  `README.md: the layer table has ${layerRows} rows but frontier.json enumerates ${frontier.corpora.length} corpora ` +
  `(${frontier.corpora.map(c => c.layer).join(', ')}). A map that drops one has forgotten, not compressed.`)

// ------------------------------------------------------- 5. MYTH is fenced
for (const f of METHOD_DOCS) {
  const bad = mdText[f].split('\n').findIndex(l => /\btier:\s*MYTH\b/i.test(l) || /\bMYTH\s*·/i.test(l))
  ok(bad === -1, `${f}:${bad + 1} — a MYTH-tier claim in a method document. MYTH lives in chronicles only (GR-2, ADMISSION §3).`)
}

// ------------------------------------------- 6. errata + killed levers are sane
const errata = read('ERRATA.md')
const eIds = [...errata.matchAll(/^##\s+(E-\d+)\s+·/gm)].map(m => m[1])
ok(new Set(eIds).size === eIds.length, `ERRATA.md: duplicate E-ids among ${eIds.join(', ')}`)
for (const f of METHOD_DOCS) {
  for (const m of mdText[f].matchAll(/\bE-(\d+)\b/g)) {
    const id = `E-${m[1]}`
    ok(eIds.includes(id), `${f}: cites ${id}, which ERRATA.md does not define`)
  }
}

const kl = read('notes/KILLED_LEVERS.md')
const kIds = [...kl.matchAll(/^##\s+(K-\d+)\s+·/gm)].map(m => m[1])
ok(new Set(kIds).size === kIds.length, `KILLED_LEVERS.md: duplicate K-ids among ${kIds.join(', ')}`)
for (const k of kIds) {
  ok(/\*\*Re-opens if\.?\*\*/.test(kl.split(`## ${k}`)[1]?.split('\n## ')[0] || ''),
    `KILLED_LEVERS.md: ${k} has no "Re-opens if" clause. Killed ≠ impossible (GR-6).`)
}

// ------------------------------------------------- 7. the frontier tells truth
const WORD = (s) => s.split(/\s+/).filter(Boolean).length
const mapWords = readdirSync(here).filter(f => f.endsWith('.md')).reduce((n, f) => n + WORD(read(f)), 0)
ok(frontier.baseline?.metric === mapWords,
  `frontier.json: baseline.metric = ${frontier.baseline?.metric}, but the map measures ${mapWords} words. The frontier is the sole authority for numbers (GR-1); a stale one is a lying one.`)
ok(frontier.best?.metric === frontier.baseline?.metric || frontier.best?.metric < frontier.baseline?.metric,
  `frontier.json: best.metric ${frontier.best?.metric} must be ≤ baseline.metric ${frontier.baseline?.metric}`)
ok(frontier.best?.leverId === null || frontier.best?.gateResult,
  'frontier.json: best names a leverId but no gateResult — a best that never passed a gate is a mirage (GR-5)')

// every run must carry a chronicle, and it must exist (GR-7)
for (const r of frontier.runs || []) {
  ok(!!r.chronicle, `frontier.json: run ${r.runId} has no chronicle. A session without a chronicle is unfinished (GR-7).`)
  if (r.chronicle) ok(has(r.chronicle), `frontier.json: run ${r.runId} cites ${r.chronicle}, which does not exist`)
  ok(r.folded === null || r.folded, `frontier.json: run ${r.runId} must state what it folded (null is a valid, honest answer)`)
}

// -------------------------------------------- 8. traces resolve (GR-9)
// Every repo-relative path mentioned in a method doc must exist. A claim that
// cannot be traced is deleted, not defended.
const REL = /(?:^|[\s(`])((?:universe\/|engine\/|seats\/|templates\/|tools\/|examples\/|notes\/|chronicles\/)[A-Za-z0-9_./-]+\.(?:mjs|md|json))/g
for (const f of METHOD_DOCS) {
  for (const m of mdText[f].matchAll(REL)) {
    const p = m[1]
    const fromRoot = join(root, p)
    const fromHere = join(here, p)
    ok(existsSync(fromRoot) || existsSync(fromHere), `${f}: trace "${p}" does not resolve (GR-9: trace or delete)`)
  }
}

// ---------------------------------------- 9. no absolute local paths (shareable)
for (const f of METHOD_DOCS) {
  const m = /C:\\Users\\|C:\/Users\//.exec(mdText[f])
  warn(!m, `${f}: contains an absolute local path — the corpus travels, the First Person's filesystem does not`)
}

// ---------------------------------------------------------------- report
if (warns.length) {
  console.warn(`AUDIT WARNINGS (${warns.length}):`)
  for (const w of warns) console.warn('  ~ ' + w)
}
if (errs.length) {
  console.error(`\nAUDIT FAIL (${errs.length}):`)
  for (const e of errs) console.error('  - ' + e)
  process.exit(1)
}
console.log(`AUDIT PASS — ${mapWords} words · anchor law holds on every declared pair · 7 seats · ` +
  `${frontier.corpora.length} corpora covered · MYTH fenced · every trace resolves · every run chronicled.`)
