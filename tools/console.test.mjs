#!/usr/bin/env node
// console.test.mjs — the console and the mint, tested where they can lie.
//
//   node tools/console.test.mjs
//
// Three assertions, each about a failure mode that would otherwise be
// invisible until it mattered:
//   1. a flipped byte in proposal_canon.json MUST surface as MISMATCH —
//      the console's one provable live signal cannot have a blind spot.
//   2. the mint MUST refuse that run, and must say GR-4 when it does.
//   3. a clean mint MUST produce an artefact whose κ-label and every
//      evidenceManifest hash re-derive from the shipped bytes.
//
// Runs in a scratch copy under the OS temp dir; never touches the repo.

import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { gatherRuns, deriveKappa } from './console.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(join(here, '..'))
const src = join(root, 'examples', 'field-guide')

let failures = 0
const check = (name, cond, detail) => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ' — ' + detail}`)
  if (!cond) failures++
}

const tmp = mkdtempSync(join(tmpdir(), 'harness-console-test-'))
try {
  // ---- 1. tamper drill: one flipped byte must read MISMATCH ----------------
  const tampered = join(tmp, 'fg-tampered')
  cpSync(src, tampered, { recursive: true })
  const canonPath = join(tampered, 'runs', 'r3', 'r3.1', 'p2-telegraphic-bullets-second-draw', 'proposal_canon.json')
  const bytes = Buffer.from(readFileSync(canonPath))
  bytes[Math.floor(bytes.length / 2)] ^= 0x01
  writeFileSync(canonPath, bytes)

  const runs = gatherRuns(tampered)
  const r3 = runs.find(r => r.runId === 'r3')
  const states = r3 ? r3.rounds.flatMap(rd => rd.proposals).map(p => p.hashState) : []
  check('flipped canon byte reads MISMATCH', states.includes('MISMATCH'),
    `hashStates were ${JSON.stringify(states)} — the tamper went unseen`)
  check('untampered proposals still MATCH', states.includes('MATCH'),
    `hashStates were ${JSON.stringify(states)}`)

  // ---- 2. the mint refuses the tampered run, naming GR-4 -------------------
  const refusal = spawnSync(process.execPath, ['tools/mint_artefact.mjs', tampered, 'r3'], { cwd: root, encoding: 'utf8' })
  const rout = (refusal.stdout || '') + (refusal.stderr || '')
  check('mint refuses a tampered run', refusal.status !== 0,
    'THE MINT ACCEPTED witnesses of unknown origin — the door just certified a lie')
  check('the refusal names GR-4', /GR-4/.test(rout) && /MISMATCH/.test(rout),
    `refusal text was: ${rout.slice(0, 200)}`)

  // ---- 3. a clean mint re-derives: κ and every evidence hash ---------------
  const clean = join(tmp, 'fg-clean')
  cpSync(src, clean, { recursive: true })
  rmSync(join(clean, 'artefacts'), { recursive: true, force: true })
  const mint = spawnSync(process.execPath, ['tools/mint_artefact.mjs', clean, 'r3'], { cwd: root, encoding: 'utf8' })
  check('mint succeeds on a clean run', mint.status === 0,
    ((mint.stdout || '') + (mint.stderr || '')).slice(0, 300))
  if (mint.status === 0) {
    const id = (mint.stdout.match(/MINTED (af-[0-9a-f]+)/) || [])[1]
    const aDir = join(clean, 'artefacts', id)
    const artefact = JSON.parse(readFileSync(join(aDir, 'artefact.json'), 'utf8'))
    check('κ-label re-derives from canonical bytes (Law L5)', deriveKappa(artefact) === artefact['κ'],
      `recorded ${artefact['κ']} ≠ derived ${deriveKappa(artefact)}`)
    let hashesOk = true, n = 0
    for (const [rel, want] of Object.entries(artefact.evidenceManifest)) {
      const got = createHash('sha256').update(readFileSync(join(aDir, rel))).digest('hex')
      if (got !== want) hashesOk = false
      n++
    }
    check(`every evidence hash re-derives (${n} files)`, hashesOk && n > 0, 'a shipped hash does not match its bytes')
    check('the artefact took no outward action', Array.isArray(artefact.door.actionsTaken) && artefact.door.actionsTaken.length === 0,
      'door.actionsTaken is not empty — software opened the door')
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

if (failures) { console.error(`\n${failures} console/mint test(s) FAILED.`); process.exit(1) }
console.log('\nconsole + mint: every check passed — the tamper is seen, the refusal names its rule, the labels re-derive.')
