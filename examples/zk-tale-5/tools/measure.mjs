#!/usr/bin/env node
// measure.mjs — the counting rule for examples/zk-tale-5, code-side (GR-1).
// Prints JSON: { metric: words of artifact/FORGE.md, census: N, pass }.
// drivers/run.mjs runs this before a round and hands the result to the seats.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { checkText, countWords } from './check_forge.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const text = readFileSync(join(here, '..', 'artifact', 'FORGE.md'), 'utf8')
const c = checkText(text)
console.log(JSON.stringify({ metric: countWords(text), census: c.N, passed: c.passed, pass: c.pass, rule: 'whitespace-split tokens of artifact/FORGE.md' }))
