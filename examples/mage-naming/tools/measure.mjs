#!/usr/bin/env node
// measure.mjs — the counting rule for examples/mage-naming, code-side (GR-1).
// Prints JSON: { metric: words of artifact/NAMING.md, census: N, pass }.
// drivers/run.mjs runs this before a round and hands the result to the seats.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { checkText, countWords } from './check_naming.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const text = readFileSync(join(here, '..', 'artifact', 'NAMING.md'), 'utf8')
const c = checkText(text)
console.log(JSON.stringify({ metric: countWords(text), census: c.N, passed: c.passed, pass: c.pass, rule: 'whitespace-split tokens of artifact/NAMING.md' }))
