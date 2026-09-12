#!/usr/bin/env node
// personas_census.mjs — build the persona evocation's artefact and draw its
// witness bank.
//
// Artefact: the 42 persona bodies, each under its `# <name>` heading with a
// header block carrying the four frontmatter invariants (alignment ·
// equation_term · proverb · spell). A rewrite of the bodies must carry those
// lines, so the census can probe them.
// Census: every `# <name>`, every invariant line, every distinct `## heading`.
//
//   node evocations/_lib/personas_census.mjs <persona-dir> <out-artefact.md>   → census JSON on stdout

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const dir = resolve(process.argv[2] || 'C:/Users/mitch/agentprivacy-skills/persona')
const outArtefact = process.argv[3] ? resolve(process.argv[3]) : null
const names = readdirSync(dir).filter(d => existsSync(join(dir, d, 'SKILL.md'))).sort()
const INV = ['alignment', 'equation_term', 'proverb', 'spell']
const witnesses = []
const parts = []
const field = (fm, k) => { const m = new RegExp('^\\s*' + k + ':\\s*(?:"([^"]*)"|(.+))$', 'm').exec(fm); return m ? (m[1] ?? m[2]).trim() : null }
for (const n of names) {
  const t = readFileSync(join(dir, n, 'SKILL.md'), 'utf8')
  const segs = t.split(/^---\s*$/m)
  const fm = segs[1] || ''
  const body = segs.slice(2).join('---').trim()
  const invLines = INV.map(k => { const v = field(fm, k); return v ? `${k}: ${v}` : null }).filter(Boolean)
  witnesses.push(`# ${n}`)
  for (const l of invLines) witnesses.push(l)
  for (const m of body.matchAll(/^##\s+(.+?)\s*$/gm)) witnesses.push(`## ${m[1].trim()}`)
  parts.push(`# ${n}\n\n${invLines.join('\n')}\n\n${body}\n`)
}
if (outArtefact) writeFileSync(outArtefact, parts.join('\n---\n\n'))
console.log(JSON.stringify({
  authority: 'Drawn by evocations/_lib/personas_census.mjs from the 42 persona SKILL.md files: each persona\'s # name, its four frontmatter invariants (alignment · equation_term · proverb · spell) as header lines in the artefact, and every distinct ## heading of the bodies. Frozen by the keeper; the proposer never sees it. Mode census.',
  personas: names.length,
  witnesses: [...new Set(witnesses)],
}, null, 2))
