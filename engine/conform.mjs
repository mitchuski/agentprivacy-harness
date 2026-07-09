#!/usr/bin/env node
// conform.mjs — the harness's conformance gate (G0). Keeps an INDEPENDENT
// copy of the axioms — deliberately not imported from the engine — and fails
// on any drift between it, the documents, and (optionally) one harness
// instance. Exit 1 on any violation.
//
//   node engine/conform.mjs                     core axioms + documents
//   node engine/conform.mjs <harnessDir>        + that instance's config and frontier
//
// <harnessDir> must contain harness.config.mjs and frontier.json.

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const errs = []
const ok = (cond, msg) => { if (!cond) errs.push(msg) }

// ---- independent axiom copy (do NOT import these; that is the point) ----
const AXIOM = {
  seatCards: ['measure.md', 'soulbae-propose.md', 'gap-hold-apart.md', 'soulbis-assay.md', 'critic.md', 'chronicle.md', 'keystone.md'],
  algebra: { 'soulbae-propose.md': 'bnot', 'gap-hold-apart.md': 'xor', 'soulbis-assay.md': 'neg', 'keystone.md': 'succ' },
  inscription: '(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ',
  trustHeadings: ['### T1 ·', '### T2 ·', '### T3 ·', '### T4 ·', '### T5 ·', '### T6 ·'],
  groundRules: Array.from({ length: 10 }, (_, i) => `**GR-${i + 1} ·`),
  door: 'first-person',
}

// ---- 1. the algebra identity, computed, not asserted ----
// On Z/64Z: neg(x) = (64 - x) mod 64, bnot(x) = x XOR 63, succ(x) = (x + 1) mod 64.
for (let x = 0; x < 64; x++) {
  if ((64 - (x ^ 63)) % 64 !== (x + 1) % 64) {
    errs.push(`algebra identity neg(bnot(x)) = succ(x) FAILS at x=${x}`)
    break
  }
}

// ---- 2. document anchors ----
const readDoc = (p) => { try { return readFileSync(join(root, p), 'utf8') } catch { errs.push(`${p} missing or unreadable`); return '' } }
const trusts = readDoc('TRUSTS.md')
ok(trusts.includes(AXIOM.inscription), 'TRUSTS.md must carry the inscription verbatim')
for (const h of AXIOM.trustHeadings) ok(trusts.includes(h), `TRUSTS.md missing heading ${h}`)
const gr = readDoc('GROUND_RULES.md')
for (const h of AXIOM.groundRules) ok(gr.includes(h), `GROUND_RULES.md missing ${h.replace('**', '')}`)
for (const card of AXIOM.seatCards) {
  const body = readDoc(`seats/${card}`)
  const op = AXIOM.algebra[card]
  if (op) ok(body.includes('`' + op + '`'), `seats/${card} must name its algebra op \`${op}\``)
}

// ---- 3 + 4. one harness instance, if given ----
const harnessDir = process.argv[2] ? resolve(process.argv[2]) : null
if (harnessDir) {
  const cfgPath = join(harnessDir, 'harness.config.mjs')
  if (!existsSync(cfgPath)) {
    errs.push(`${cfgPath} not found`)
  } else {
    const config = (await import(pathToFileURL(cfgPath).href)).default
    ok(config?.door === AXIOM.door, `config.door must be '${AXIOM.door}' (T6)`)
    ok(typeof config?.heldApartRule === 'string' && config.heldApartRule.trim().length > 0, 'config.heldApartRule empty (T2/GR-4)')
    ok(!!config?.objective?.metric, 'config.objective.metric missing (GR-1)')
    ok(!!config?.objective?.gate, 'config.objective.gate missing (T5)')
    ok(!!config?.objective?.hardConstraint, 'config.objective.hardConstraint missing (GR-3)')
    ok(Array.isArray(config?.keystoneOnlyWrites) && config.keystoneOnlyWrites.length > 0, 'config.keystoneOnlyWrites missing (GR-10)')
    ok(Array.isArray(config?.finders) && config.finders.length >= 2, 'config.finders needs >= 2 lenses')
    if (Array.isArray(config?.finders)) {
      const lenses = new Set(config.finders.map(f => f && f.lens))
      ok(lenses.size === config.finders.length, 'config.finders lenses must be distinct')
    }
    for (const s of ['measure', 'proposal', 'gap', 'verdict', 'critic']) ok(!!config?.schemas?.[s], `config.schemas.${s} missing`)

    // frontier self-consistency (GR-1): numbers must cohere
    try {
      const f = JSON.parse(readFileSync(join(harnessDir, 'frontier.json'), 'utf8'))
      ok(typeof f.authority === 'string' && f.authority.length > 0, 'frontier: authority line missing')
      ok(typeof f.updated === 'string' && f.updated.length > 0, 'frontier: updated date missing')
      ok(Number.isFinite(f.baseline?.metric), 'frontier: baseline.metric missing')
      ok(Number.isFinite(f.best?.metric), 'frontier: best.metric missing')
      if (Number.isFinite(f.baseline?.metric) && Number.isFinite(f.best?.metric)) {
        ok(f.best.metric <= f.baseline.metric, `frontier: best.metric ${f.best.metric} must be <= baseline.metric ${f.baseline.metric} (lower is better)`)
      }
      for (const check of config?.conformChecks || []) {
        for (const e of check(f) || []) errs.push(`conformChecks: ${e}`)
      }
    } catch (e) {
      errs.push(`frontier.json unreadable or malformed: ${e.message}`)
    }
  }
}

if (errs.length) {
  console.error(`CONFORM FAIL (${errs.length}):`)
  for (const e of errs) console.error('  - ' + e)
  process.exit(1)
}
console.log(`CONFORM PASS — algebra proven on Z/64Z, trusts anchored, GR-1..10 present, 7 seats carded, door is the First Person's${harnessDir ? ', instance config + frontier coherent' : ''}.`)
