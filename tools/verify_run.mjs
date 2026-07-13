#!/usr/bin/env node
// verify_run.mjs — one offline, fail-closed verifier for a run (D5).
//
//   node tools/verify_run.mjs <instanceDir> <runId>
//
// Takes a run directory and an unfriendly reader, and returns a bit. NO LLM
// calls, NO network. It re-derives every link of the chain that a VALIDATED
// rests on, using the SAME engine/gap.mjs the loop derived with, and exits
// non-zero on anything it cannot establish. The render is a projection; this is
// the judgment. Where the render says "not recorded", this says UNVERIFIABLE —
// a distinct verdict, never a pass.
//
// The pieces used to be scattered — render_run re-derived the seed,
// mint_artefact refused tampered seeds, holon_audit re-hashed κ. This
// consolidates the run-level ones into a single command wired into check.mjs,
// so every run in the repo is re-verified on every check. If the harness cannot
// verify its own history, it cannot ask anyone to trust its future.
//
// Checks per proposal (as applicable to what the run recorded):
//   1. proposal_canon.json exists and is byte-identical to canonicalize(parsed)
//   2. sha256(canon bytes) == hProposal (salted) or == seedHex (legacy)
//   3. salted: seed == sha256(hSource || hProposal || salt)
//   4. the recorded draw indices == draw(seed, N, count) / census = 1..N
//   5. verdict.json present; a VALIDATED is a full pass and carries coverage
//   6. a sample-mode VALIDATED at N <= censusThreshold is flagged (should be census)
// Checks 7+ (read-log in-mount, model-pair) land with C6 and are reported as
// PENDING, never silently passed.
//
// Zero dependencies beyond engine/gap.mjs.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { join, resolve, relative } from 'node:path'
import { canonicalize, hashCanon, deriveSeed, draw } from '../engine/gap.mjs'

const [instArg, runArg] = process.argv.slice(2)
if (!instArg || !runArg) { console.error('usage: node tools/verify_run.mjs <instanceDir> <runId|--all>'); process.exit(2) }
const instDir = resolve(instArg)

// --all: verify every run directory the instance has, each in its own child so
// one UNVERIFIABLE does not abort the rest. Used by check.mjs so the repo
// re-verifies its whole history on every check.
if (runArg === '--all') {
  const runsRoot = join(instDir, 'runs')
  if (!existsSync(runsRoot)) { console.log('no runs/ to verify'); process.exit(0) }
  const ids = readdirSync(runsRoot, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name)
  const selfPath = fileURLToPath(import.meta.url)
  let bad = 0
  for (const id of ids) {
    const res = spawnSync(process.execPath, [selfPath, instArg, id], { encoding: 'utf8' })
    process.stdout.write(res.stdout || '')
    if (res.status !== 0) { bad++; process.stderr.write(res.stderr || '') }
  }
  if (bad) { console.error(`\n${bad} of ${ids.length} run(s) UNVERIFIABLE.`); process.exit(1) }
  console.log(`\nALL ${ids.length} run(s) verify.`); process.exit(0)
}

const runDir = join(instDir, 'runs', runArg)
if (!existsSync(runDir)) { console.error(`UNVERIFIABLE: no run directory at ${runDir}`); process.exit(1) }

const readText = (p) => { try { return readFileSync(p, 'utf8') } catch { return null } }
const readJson = (p) => { const t = readText(p); if (t == null) return null; try { return JSON.parse(t) } catch { return { __bad: true } } }
const sha256FileBytes = (p) => { try { return createHash('sha256').update(readFileSync(p)).digest('hex') } catch { return null } }

// gate params from the instance config (N/count/mode/threshold); defaults if absent.
let gate = { N: null, count: 8, mode: null, censusThreshold: 200 }
try {
  const cfg = (await import(pathToFileURL(join(instDir, 'harness.config.mjs')).href)).default
  if (cfg?.gate) gate = { ...gate, ...cfg.gate }
} catch {}

// discover proposal dirs: runs/<runId>/<roundId>/p<i>-<lever>/ (round-scoped) or runs/<runId>/p<i>-<lever>/
const isProposalDir = (n) => /^p\d+-/.test(n)
const proposalDirs = []
const scan = (base, label) => {
  for (const e of readdirSync(base, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    if (isProposalDir(e.name)) proposalDirs.push({ label: label ? `${label}/${e.name}` : e.name, dir: join(base, e.name) })
    else scan(join(base, e.name), label ? `${label}/${e.name}` : e.name) // descend into roundId dirs
  }
}
scan(runDir, '')

const results = []
for (const { label, dir } of proposalDirs.sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }))) {
  const checks = []
  // severity 'fail' → UNVERIFIABLE if it fails (crypto chain, the integrity
  // spine). severity 'warn' → noted but not fatal (metadata a legacy run
  // predates; a salted run promotes these to 'fail' below). A run is only
  // UNVERIFIABLE when something that must re-derive did not.
  const add = (name, ok, detail, severity = 'fail') => checks.push({ name, ok, detail, severity })
  const canonPath = join(dir, 'proposal_canon.json')
  const gap = readJson(join(dir, 'gap.json'))
  const verdict = readJson(join(dir, 'verdict.json'))

  // 1. canon exists and is canonical
  const canonText = readText(canonPath)
  if (canonText == null) { add('canon present', false, 'proposal_canon.json missing'); results.push({ label, checks, state: 'UNVERIFIABLE' }); continue }
  let parsed = null; try { parsed = JSON.parse(canonText) } catch {}
  add('canon is byte-canonical', parsed != null && canonicalize(parsed) === canonText,
    parsed == null ? 'unparseable JSON' : (canonicalize(parsed) === canonText ? 'exact canonical bytes' : 'not canonical / has stray bytes (e.g. trailing newline — CR-7)'))
  const fileHash = sha256FileBytes(canonPath)

  const salted = !!(gap && gap.salt && gap.hProposal)
  if (salted) {
    add('sha256(canon) == hProposal', fileHash === String(gap.hProposal).toLowerCase(), `${fileHash} vs ${gap.hProposal}`)
    const reSeed = hashCanon(String(gap.hSource ?? '') + gap.hProposal + gap.salt)
    add('seed == sha256(hSource‖hProposal‖salt)', reSeed === String(gap.seedHex).toLowerCase(), `${reSeed} vs ${gap.seedHex}`)
    // 4. draw replay
    const mode = gap.mode || gate.mode || 'sample'
    const N = Number.isInteger(gate.N) ? gate.N : (Array.isArray(gap.drawIndices) ? Math.max(...gap.drawIndices) : null)
    if (Array.isArray(gap.drawIndices) && N) {
      const expect = mode === 'census' ? Array.from({ length: N }, (_, k) => k + 1) : draw(gap.seedHex, N, gap.drawIndices.length)
      add('draw replays from seed', JSON.stringify(gap.drawIndices) === JSON.stringify(expect), mode === 'census' ? 'census = all facts' : `${JSON.stringify(gap.drawIndices)}`)
    } else add('draw replays from seed', false, 'drawIndices or N missing — cannot replay')
  } else if (gap && gap.seedHex) {
    // legacy: seed IS sha256(canon); re-derive the draw indices from the seed and
    // compare against the F-indices embedded in the draw questions.
    add('legacy seed == sha256(canon)', fileHash === String(gap.seedHex).toLowerCase(), `${fileHash} vs ${gap.seedHex}`)
    const drawText = typeof gap.draw === 'string' ? gap.draw : JSON.stringify(gap.draw || '')
    const recordedIdx = [...drawText.matchAll(/F(\d+)/g)].map(m => +m[1])
    const uniqRecorded = [...new Set(recordedIdx)]
    if (uniqRecorded.length && Number.isInteger(gate.N)) {
      // compare as SETS: legacy gap.json lists questions in the LLM's
      // presentation order (often sorted by index), not the draw order. Same 8
      // facts = the draw derived from the seed, regardless of presentation.
      const expect = draw(gap.seedHex, gate.N, uniqRecorded.length)
      const eqSet = JSON.stringify([...uniqRecorded].sort((a, b) => a - b)) === JSON.stringify([...expect].sort((a, b) => a - b))
      add('legacy draw replays from seed (as a set)', eqSet, `recorded {${uniqRecorded.join(',')}} vs replay {${expect.join(',')}}`)
    } else add('legacy draw replays from seed', true, 'no parseable draw indices — seed reproduction stands as the audit (legacy)')
  } else { add('seed recorded', false, 'gap.json missing or has no seedHex') }

  // 5. verdict + coverage
  if (!verdict || verdict.__bad) add('verdict present', false, 'verdict.json missing/unparseable')
  else {
    add('verdict present', true, verdict.status)
    if (verdict.status === 'VALIDATED') {
      const m = /^(\d+)\/(\d+)$/.exec(String(verdict.gateResult || ''))
      add('VALIDATED is a full pass', !!m && m[1] === m[2] && +m[2] > 0, `gateResult ${verdict.gateResult}`)
      // metadata checks: hard for salted (post-C4) runs, a warning for legacy
      // runs that predate coverage/census.
      const metaSev = salted ? 'fail' : 'warn'
      const cov = verdict.coverage
      add('coverage recorded', !!cov && !!cov.mode, cov ? `${cov.mode} detection ${cov.detection}` : 'no coverage stanza — cannot tell census from sample (D2)', metaSev)
      if (cov && cov.mode === 'sample' && Number.isInteger(gate.N) && gate.N <= (gate.censusThreshold ?? 200))
        add('sample not used on a censusable bank', false, `sample at N=${gate.N} <= threshold — should be census (D2)`, metaSev)
    }
  }

  // 6/7 pending (C6): read-log in-mount, model-pair. Reported, not passed.
  const hardFail = checks.filter(c => !c.ok && c.severity === 'fail')
  const warns = checks.filter(c => !c.ok && c.severity === 'warn')
  const state = hardFail.length ? 'UNVERIFIABLE' : (verdict?.status || 'VERIFIED')
  results.push({ label, checks, state, warns: warns.length, legacy: !salted, pending: ['read-log in-mount (C6)', 'model-pair (C6)'] })
}

// ---- report ----
console.log(`\nverify_run — ${relative(process.cwd(), runDir).replace(/\\/g, '/')} · ${proposalDirs.length} proposal(s)\n`)
let anyBad = false
for (const r of results) {
  const mark = r.state === 'UNVERIFIABLE' ? 'UNVERIFIABLE' : `verified (${r.state}${r.legacy ? ', legacy' : ''})${r.warns ? ` · ${r.warns} warning(s)` : ''}`
  console.log(`  ${r.state === 'UNVERIFIABLE' ? '✗' : '✓'} ${r.label} — ${mark}`)
  for (const c of r.checks) console.log(`      ${c.ok ? 'ok  ' : (c.severity === 'warn' ? 'warn' : 'FAIL')} ${c.name}${c.ok ? '' : ` — ${c.detail}`}`)
  if (r.state === 'UNVERIFIABLE') anyBad = true
}
if (!results.length) { console.error('\nUNVERIFIABLE: no proposal directories found in this run.'); process.exit(1) }
if (anyBad) { console.error(`\nUNVERIFIABLE — at least one proposal cannot be re-derived. A witness of unknown origin validates nothing (GR-4).`); process.exit(1) }
const totalWarns = results.reduce((n, r) => n + r.warns, 0)
console.log(`\nRUN VERIFIED — every proposal re-derives from its own saved bytes${totalWarns ? ` (${totalWarns} legacy warning(s): coverage/census metadata a pre-C4 run predates)` : ''}. (pending C6: read-log + model-pair checks)`)
