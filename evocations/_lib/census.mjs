#!/usr/bin/env node
// census.mjs — draw a witness bank from a markdown document, and check a
// candidate against a frozen one. Shared by every evocation.
//
//   node evocations/_lib/census.mjs <artefact.md>                 → JSON witness list on stdout (draw)
//   import { drawCensus, checkText, countWords } from './census.mjs'
//
// What is drawn, deterministically, from the artefact:
//   numbers      every number with a unit, ratio or multiplier glued to it (678×, 70:1, 2-3 year, V5, 30 tales)
//   headings     every `##` / `###` heading text
//   terms        every **bold** phrase (the document's own emphasis is its own term list)
//   named        a fixed vocabulary of the corpus's proper terms that appear in the text
// The draw is a starting point: the keeper prunes decoration (a date in a
// header is not a claim) and freezes the result as census.json. From then on
// the proposer never sees it, and checkText probes every entry, whitespace-
// normalised, case-sensitive (mode census: a single dropped witness fails).

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const NAMED = ['Swordsman', 'Mage', 'First Person', 'Privacy Value Model', '7th Capital', 'seventh capital', 'behavioral capital',
  'Relationship Proverb Protocol', 'RPP', 'VRC', 'Verifiable Relationship Credential', 'Zcash', 'ENS', 'zero-knowledge', 'Zero Knowledge',
  'Fiat-Shamir', 'Promise Theory', 'Autonomy Axiom', 'Gap', 'the door', 'spellbook', 'Spellbook', 'proverb', 'κ', 'sha256',
  'Amnesia Protocol', 'Game of 42', 'City of Mages', 'Hitchhiker', 'IEEE 7012', 'MyTerms', 'DTG', 'Trust over IP', 'BGIN', 'Kwaai',
  'sovereign', 'surveillance', 'information-theoretic', 'three-axis', 'delegation', 'protection']

const norm = (s) => String(s).replace(/\s+/g, ' ').trim()

export function drawCensus(text) {
  const out = new Set()
  // numbers with something glued to them
  for (const m of text.matchAll(/\b\d[\d,]*(?:\.\d+)?(?:\s?[×x]|:\d+|-\d+ year|\s(?:tales|weeks|sites|words|forms|agents|spellbooks|years|months|days|pages|nodes|laps|seconds))\b/gi)) out.add(norm(m[0]))
  for (const m of text.matchAll(/\bV\d+(?:\.\d+)?\b/g)) out.add(m[0])
  for (const m of text.matchAll(/\b\d{2,}(?:,\d{3})+\b/g)) out.add(m[0])
  // headings
  for (const m of text.matchAll(/^#{2,3}\s+(.+?)\s*$/gm)) out.add(norm(m[1]))
  // bold terms (short ones — a bold sentence is emphasis, not a term)
  for (const m of text.matchAll(/\*\*([^*\n]{2,60})\*\*/g)) { const t = norm(m[1]); if (t.split(' ').length <= 6) out.add(t) }
  // named vocabulary present in the text
  for (const n of NAMED) if (text.includes(n)) out.add(n)
  return [...out]
}

export function checkText(text, witnesses) {
  const hay = norm(text)
  const missing = witnesses.filter(w => !hay.includes(norm(w)))
  return { N: witnesses.length, passed: witnesses.length - missing.length, missing, pass: missing.length === 0 }
}

export function countWords(text) { return String(text).split(/\s+/).filter(Boolean).length }

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2]
  if (!file) { console.error('usage: node evocations/_lib/census.mjs <artefact.md>'); process.exit(2) }
  const text = readFileSync(resolve(file), 'utf8')
  const w = drawCensus(text)
  console.log(JSON.stringify({ authority: 'Drawn by evocations/_lib/census.mjs from the artefact; pruned and frozen by the keeper. The proposer never sees it. Mode census: every entry probed.', drawnFrom: file.replace(/\\/g, '/'), words: countWords(text), witnesses: w }, null, 2))
}
