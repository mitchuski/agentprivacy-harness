#!/usr/bin/env node
// check.mjs — one command. Run this first, and after every change.
//
//   node tools/check.mjs
//
// Runs every gate this repo has, in the order a reader should trust them:
//
//   1. the axioms            — neg(bnot(x)) = succ(x), computed on all of Z/64Z
//   2. the engine's own tests — an outage must never be reported as exhaustion
//   3. every instance         — any directory carrying harness.config.mjs
//   4. the universe auditor   — exhaustive, if universe/ is present
//
// Zero dependencies. Exit 0 only if everything passes. It prints what it ran,
// so a failure names the command you can re-run yourself — which is the same
// discipline the harness demands of a PROVEN claim.

import { spawnSync } from 'node:child_process'
import { readdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const steps = []
const run = (label, args, opts = {}) => {
  const r = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' })
  const out = ((r.stdout || '') + (r.stderr || '')).trim()
  const passed = r.status === 0
  steps.push({ label, cmd: `node ${args.join(' ')}`, passed, out, optional: !!opts.optional })
  return passed
}

// ---- 1. the axioms -------------------------------------------------------
run('the axioms', ['engine/conform.mjs'])

// ---- 2. the engine's own tests -------------------------------------------
run('engine tests', ['engine/loop.test.mjs'])

// ---- 3. every instance ---------------------------------------------------
// An instance is any directory (one level down, or under examples/) carrying a
// harness.config.mjs. Discovered, not hard-coded: a repo that only gates the
// instances it remembers will silently stop gating the one you added.
const candidates = []
const SKIP = new Set(['node_modules', '.git', 'retired', 'templates'])
const scan = (dir) => {
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    if (!statSync(p).isDirectory()) continue
    if (existsSync(join(p, 'harness.config.mjs'))) candidates.push(p)
  }
}
scan(root)
scan(join(root, 'examples'))

// `templates/` is skipped above because it is not an instance — it is the
// blank a newcomer copies, and it is REQUIRED to fail. Assert that it does.
// A repo whose template quietly conforms has lost the check that stops a
// stranger running a harness which grades nothing and reports VALIDATED.
// It must fail, AND it must fail FOR THE RIGHT REASON. The first version of
// this test only asserted a non-zero exit — and passed happily while TODO
// detection was disabled, because the template also fails on its null
// baseline. A check that can pass for the wrong reason is worse than none:
// it reports health it never measured.
{
  const r = spawnSync(process.execPath, ['engine/conform.mjs', 'templates'], { cwd: root, encoding: 'utf8' })
  const out = ((r.stdout || '') + (r.stderr || ''))
  const refused = r.status !== 0
  const citesTodo = /still contains "TODO"/.test(out)
  const citesBaseline = /baseline\.metric is null/.test(out)
  const passed = refused && citesTodo && citesBaseline
  steps.push({
    label: 'template refuses (negative test)',
    cmd: 'node engine/conform.mjs templates  # must FAIL, on TODOs *and* the null baseline',
    passed,
    out: passed
      ? 'the unfilled template is refused, and names both reasons'
      : !refused
        ? 'THE TEMPLATE CONFORMS. It ships full of TODOs, so a newcomer would copy it, see PASS, and run a harness that grades nothing and reports VALIDATED.'
        : `the template is refused, but not for the reasons it must be — TODO detection: ${citesTodo ? 'live' : 'DEAD'}, null-baseline check: ${citesBaseline ? 'live' : 'DEAD'}. It is failing for some other reason and hiding a broken gate.`,
  })
}

if (candidates.length === 0) {
  steps.push({ label: 'instances', cmd: '(none found)', passed: true, out: 'no harness.config.mjs anywhere — nothing to gate', optional: true })
}
for (const c of candidates) run(`instance: ${relative(root, c).replace(/\\/g, '/')}`, ['engine/conform.mjs', relative(root, c)])

// ---- 4. the universe auditor (optional — the directory is deletable) ------
if (existsSync(join(root, 'universe', 'audit.mjs'))) {
  run('universe audit', ['universe/audit.mjs'])
} else {
  steps.push({ label: 'universe audit', cmd: '(skipped)', passed: true, out: 'universe/ is absent — that is supported and expected', optional: true })
}

// ---- report --------------------------------------------------------------
const failed = steps.filter(s => !s.passed)
const width = Math.max(...steps.map(s => s.label.length))

console.log('')
for (const s of steps) {
  const mark = s.passed ? '  ok  ' : ' FAIL '
  console.log(`${mark} ${s.label.padEnd(width)}  ${s.cmd}`)
}

if (failed.length) {
  for (const s of failed) {
    console.error(`\n──── ${s.label} ────`)
    console.error(s.out || '(no output)')
  }
  console.error(`\n${failed.length} of ${steps.length} gates FAILED. Nothing here is trustworthy until they pass.`)
  console.error('Each line above is a command you can re-run yourself.')
  process.exit(1)
}

// Say only what was actually measured. A summary that claims a gate it
// skipped is the same vacuous check this repo keeps catching in itself.
const ran = steps.filter(s => !/\(skipped\)|\(none found\)/.test(s.cmd))
const skipped = steps.length - ran.length

console.log(`\nALL ${ran.length} GATES PASS${skipped ? ` (${skipped} skipped)` : ''}.`)
const claims = ['The algebra holds', 'an outage cannot masquerade as exhaustion']
if (candidates.length) claims.push('every instance conforms')
if (steps.find(s => s.label === 'universe audit' && !/skipped/.test(s.cmd))) claims.push('every claim in the map resolves')
console.log(claims.join(', ') + '.')
for (const s of steps.filter(s => /\(skipped\)|\(none found\)/.test(s.cmd))) {
  console.log(`(not measured: ${s.label} — ${s.out})`)
}
