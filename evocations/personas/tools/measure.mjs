#!/usr/bin/env node
// measure.mjs — the counting rule, code-side (GR-1). drivers/run.mjs runs it first.
import { readFileSync } from 'node:fs'
import { checkText, countWords } from '../../_lib/census.mjs'
import { CENSUS, ARTEFACT } from './check.mjs'
const text = readFileSync(ARTEFACT, 'utf8')
const c = checkText(text, CENSUS)
console.log(JSON.stringify({ metric: countWords(text), census: c.N, passed: c.passed, pass: c.pass, rule: 'whitespace-split tokens of artifact/PERSONAS.md' }))
