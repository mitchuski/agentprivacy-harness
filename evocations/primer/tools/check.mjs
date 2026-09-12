#!/usr/bin/env node
// check.mjs — the census gate for this evocation: does a candidate still carry
// every witness in census.json? Exit 1 on any miss.
//   node tools/check.mjs [candidate.md]      (default: artifact/PRIMER.md)
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { checkText, countWords } from '../../_lib/census.mjs'
const here = dirname(fileURLToPath(import.meta.url))
export const CENSUS = JSON.parse(readFileSync(join(here, '..', 'census.json'), 'utf8')).witnesses
export const ARTEFACT = join(here, '..', 'artifact', 'PRIMER.md')
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2] ? resolve(process.argv[2]) : ARTEFACT
  const text = readFileSync(file, 'utf8')
  const r = checkText(text, CENSUS)
  console.log(JSON.stringify({ file: file.replace(/\\/g, '/'), words: countWords(text), ...r }, null, 2))
  process.exit(r.pass ? 0 : 1)
}
