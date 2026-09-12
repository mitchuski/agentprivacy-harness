#!/usr/bin/env node
// check_path.mjs — the census gate for examples/self: does a candidate document
// still carry every witness in census.json? Whitespace-normalised, case-
// sensitive, every entry probed (mode census: a single dropped witness cannot
// hide). Exit 1 on any miss when run as a command; importable as checkText().
//
//   node tools/check_path.mjs [candidate.md]      (default: artifact/PATH.md)

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
export const CENSUS = JSON.parse(readFileSync(join(here, '..', 'census.json'), 'utf8')).witnesses
const norm = (s) => String(s).replace(/\s+/g, ' ')

export function checkText(text) {
  const hay = norm(text)
  const missing = CENSUS.filter(w => !hay.includes(norm(w)))
  return { N: CENSUS.length, passed: CENSUS.length - missing.length, missing, pass: missing.length === 0 }
}

export function countWords(text) { return String(text).split(/\s+/).filter(Boolean).length }

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2] ? resolve(process.argv[2]) : join(here, '..', 'artifact', 'PATH.md')
  const text = readFileSync(file, 'utf8')
  const r = checkText(text)
  console.log(JSON.stringify({ file: file.replace(/\\/g, '/'), words: countWords(text), ...r }, null, 2))
  process.exit(r.pass ? 0 : 1)
}
