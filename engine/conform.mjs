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
const warns = []
const ok = (cond, msg) => { if (!cond) errs.push(msg) }
const advise = (cond, msg) => { if (!cond) warns.push(msg) }

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

    // ---- the canary ----------------------------------------------------
    // A gate with no artifact known to pass it cannot distinguish a bad
    // candidate from an impossible gate. The field-guide toy is safe by
    // accident: its questions are drawn FROM the original, so the original
    // scores 8/8 by construction. The universe-builder had no canary, and
    // both of its lenses scored 0/8 against a gate no candidate could pass
    // (universe/chronicles/2026-07-10_u2_mis-gated.md).
    //
    // A warning, not yet a failure: making it fatal would break sibling
    // instances mid-flight. Flipping it is the First Person's call.
    advise(config?.objective?.canary,
      'config.objective.canary is absent. Name a reference artifact (or the procedure that builds one) ' +
      'that passes objective.gate BY CONSTRUCTION, and say why. Without it, a total failure is ambiguous: ' +
      'you cannot tell a bad candidate from an impossible gate. See universe/chronicles/2026-07-10_u2_mis-gated.md.')
    if (typeof config?.objective?.canary === 'string' && !config.objective.canary.trim()) {
      errs.push('config.objective.canary is present but empty. Say what passes the gate by construction, or remove the field.')
    }

    // ---- unfilled template placeholders --------------------------------
    // A config still wearing its TODOs used to pass this gate. It must not.
    // A harness whose objective reads "TODO — what frontier.json tracks" will
    // run, and grade nothing, and say VALIDATED — and the gate that let it
    // through is worth less than no gate at all, because it was believed.
    const TODO = /\bTODO\b/i
    const placeholder = (v) => typeof v === 'string' && TODO.test(v)
    const fill = (label) => `${label} still contains "TODO" — fill it before running. An unfilled config runs and grades nothing.`
    if (placeholder(config?.name)) errs.push(fill('config.name'))
    if (placeholder(config?.objective?.metric)) errs.push(fill('config.objective.metric (GR-1)'))
    if (placeholder(config?.objective?.gate)) errs.push(fill('config.objective.gate (T5: this is the gate a zero collapses)'))
    if (placeholder(config?.objective?.hardConstraint)) errs.push(fill('config.objective.hardConstraint (GR-3)'))
    if (placeholder(config?.heldApartRule)) errs.push(fill('config.heldApartRule (T2/GR-4: this text is what keeps the proposer blind)'))
    for (const f of config?.finders || []) {
      if (placeholder(f?.lens)) errs.push(fill(`config.finders lens "${f.lens}"`))
      if (placeholder(f?.hint)) errs.push(fill(`config.finders hint for "${f?.lens}"`))
    }

    // frontier self-consistency (GR-1): numbers must cohere
    try {
      const f = JSON.parse(readFileSync(join(harnessDir, 'frontier.json'), 'utf8'))
      ok(typeof f.authority === 'string' && f.authority.length > 0, 'frontier: authority line missing')
      ok(typeof f.updated === 'string' && f.updated.length > 0, 'frontier: updated date missing')
      // The template ships these as null on purpose: you cannot have a
      // baseline until you have measured one. Say so, instead of reporting a
      // deliberate placeholder as an absence.
      const unmeasured = (v) => v === null || v === undefined
      ok(Number.isFinite(f.baseline?.metric),
        unmeasured(f.baseline?.metric)
          ? 'frontier: baseline.metric is null — the template ships it unmeasured. Run your counting rule against the artifact as it stands today and write the number here, with `how` naming the exact command (GR-1). A harness with no measured baseline has nothing to beat.'
          : `frontier: baseline.metric must be a number, got ${JSON.stringify(f.baseline?.metric)}`)
      ok(Number.isFinite(f.best?.metric),
        unmeasured(f.best?.metric)
          ? 'frontier: best.metric is null — set it equal to baseline.metric. Nothing has beaten the baseline yet, and pretending otherwise is the first mirage (GR-5).'
          : `frontier: best.metric must be a number, got ${JSON.stringify(f.best?.metric)}`)
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

if (warns.length) {
  console.warn(`CONFORM ADVISORY (${warns.length}):`)
  for (const w of warns) console.warn('  ~ ' + w)
}
if (errs.length) {
  console.error(`CONFORM FAIL (${errs.length}):`)
  for (const e of errs) console.error('  - ' + e)
  process.exit(1)
}
console.log(`CONFORM PASS — algebra proven on Z/64Z, trusts anchored, GR-1..10 present, 7 seats carded, door is the First Person's${harnessDir ? ', instance config + frontier coherent' : ''}.`)
