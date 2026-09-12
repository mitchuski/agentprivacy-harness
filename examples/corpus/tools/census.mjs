#!/usr/bin/env node
// census.mjs — the auditor: every claim in kb/records.json resolves to a file
// under this instance that still contains its quote (whitespace-normalised),
// and every number in a record's prose appears in one of its claims.
//
//   node tools/census.mjs [--json] [--gate]
//
//   traced     the file exists and still says it
//   untraced   the file is missing or no longer says it — the gate fails
//   weak       kind: memory — allowed, counted; the metric frontier.json drives down
//   stale      the file changed after the claim's read date (informational)
//   unquoted   a number in `recorded` with no claim behind it — the gate fails
//
// Zero dependencies. Reads the corpus; never writes into it.

import { readFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(join(here, '..'))
const args = process.argv.slice(2)
const norm = (s) => String(s).replace(/\s+/g, ' ').trim()
const numbersIn = (s) => {
  const out = new Set()
  const text = String(s).replace(/\b(19|20)\d\d-\d\d(-\d\d)?\b/g, ' ')
  for (const m of text.matchAll(/(?<![A-Za-z0-9.])\d[\d,]*(?:\.\d+)?/g)) { const raw = m[0].replace(/,/g, ''); if (!/^(19|20)\d\d$/.test(raw)) out.add(raw) }
  return out
}

export function census() {
  const records = JSON.parse(readFileSync(join(ROOT, 'kb', 'records.json'), 'utf8'))
  let claims = 0, traced = 0, untraced = 0, weak = 0, stale = 0, unquoted = 0
  const problems = []
  for (const r of records) {
    const bag = []
    for (const c of r.claims || []) {
      claims++
      const p = resolve(ROOT, c.source)
      const ok = existsSync(p) && norm(readFileSync(p, 'utf8')).includes(norm(c.quote))
      if (ok) { traced++; if (c.kind === 'memory') weak++; try { if (c.read && statSync(p).mtime > new Date(c.read + 'T23:59:59Z')) stale++ } catch {} }
      else { untraced++; problems.push(`untraced ${c.id}: ${c.source} does not contain ${JSON.stringify(c.quote)}`) }
      bag.push(norm(c.text || ''), norm(c.quote || ''))
    }
    const have = new Set(); for (const s of bag) for (const n of numbersIn(s)) have.add(n)
    for (const n of numbersIn(r.recorded || '')) if (!have.has(n)) { unquoted++; problems.push(`unquoted ${r.id}: ${n} in recorded but in no claim`) }
  }
  return { records: records.length, claims, traced, untraced, weak, stale, unquoted, pass: untraced === 0 && unquoted === 0, problems }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = census()
  if (args.includes('--json')) console.log(JSON.stringify(r, null, 2))
  else { console.log(`census: ${r.records} records · ${r.claims} claims · traced ${r.traced} · untraced ${r.untraced} · weak ${r.weak} · stale ${r.stale} · unquoted ${r.unquoted} → ${r.pass ? 'PASS' : 'FAIL'}`); for (const p of r.problems) console.log('  ✘ ' + p) }
  if (!r.pass) process.exit(1)
}
