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

import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { gatherRuns, deriveKappa } from './console.mjs'
import { buildFeed } from './emit_feed.mjs'
import { kappaOf } from './kappa.mjs'
import { keypair, signEdge, verifyEdge } from './vrc.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(join(here, '..'))
const src = join(root, 'examples', 'field-guide')

let failures = 0
const check = (name, cond, detail) => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${name}${cond ? '' : ' — ' + detail}`)
  if (!cond) failures++
}

// The drill needs a run to tamper with. In the origin repo the real run
// records are used; in a clean clone (the default distribution ships the spar
// at its baseline, runs empty) a labelled FIXTURE run is synthesized in the
// temp copy — a test fixture, never a result (GR-5): two proposals whose seeds
// derive from their own bytes in the legacy unsalted form.
const fixtureRun = (instDir) => {
  const rid = 'drill'
  for (const name of ['p1-drill-a', 'p2-drill-b']) {
    const d = join(instDir, 'runs', rid, name)
    mkdirSync(d, { recursive: true })
    const canon = JSON.stringify({ fixture: name, note: 'console.test drill fixture — not a result' })
    writeFileSync(join(d, 'proposal_canon.json'), canon)
    writeFileSync(join(d, 'gap.json'), JSON.stringify({ seedHex: createHash('sha256').update(canon).digest('hex'), draw: ['F1'], transcript: 'drill fixture — legacy unsalted seed, derived from the canon bytes above' }))
    writeFileSync(join(d, 'verdict.json'), JSON.stringify({ status: 'VALIDATED', leverId: name, metric: 700, gateResult: 'drill 1/1' }))
    writeFileSync(join(d, 'candidate.md'), 'drill fixture candidate')
  }
  return rid
}
const findRun = (instDir) => {
  const rdir = join(instDir, 'runs')
  let names = []
  try { names = readdirSync(rdir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name) } catch { }
  for (const rid of names) {
    const found = (function walk(p, depth) {
      if (depth < 0) return null
      let entries = []
      try { entries = readdirSync(p, { withFileTypes: true }) } catch { return null }
      for (const e of entries) {
        if (!e.isDirectory()) continue
        const q = join(p, e.name)
        if (existsSync(join(q, 'proposal_canon.json')) && existsSync(join(q, 'gap.json'))) return q
        const deeper = walk(q, depth - 1); if (deeper) return deeper
      }
      return null
    })(join(rdir, rid), 2)
    if (found) return { rid, propDir: found }
  }
  return null
}

const tmp = mkdtempSync(join(tmpdir(), 'harness-console-test-'))
try {
  // ---- 1. tamper drill: one flipped byte must read MISMATCH ----------------
  const tampered = join(tmp, 'fg-tampered')
  cpSync(src, tampered, { recursive: true })
  if (!findRun(tampered)) fixtureRun(tampered)
  const hit = findRun(tampered)
  const RID = hit.rid
  const canonPath = join(hit.propDir, 'proposal_canon.json')
  const bytes = Buffer.from(readFileSync(canonPath))
  bytes[Math.floor(bytes.length / 2)] ^= 0x01
  writeFileSync(canonPath, bytes)

  const runs = gatherRuns(tampered)
  const r3 = runs.find(r => r.runId === RID)
  const states = r3 ? r3.rounds.flatMap(rd => rd.proposals).map(p => p.hashState) : []
  check('flipped canon byte reads MISMATCH', states.includes('MISMATCH'),
    `hashStates were ${JSON.stringify(states)} — the tamper went unseen`)
  check('untampered proposals still MATCH', states.includes('MATCH'),
    `hashStates were ${JSON.stringify(states)}`)

  // ---- 2. the mint refuses the tampered run, naming GR-4 -------------------
  const refusal = spawnSync(process.execPath, ['tools/mint_artefact.mjs', tampered, RID], { cwd: root, encoding: 'utf8' })
  const rout = (refusal.stdout || '') + (refusal.stderr || '')
  check('mint refuses a tampered run', refusal.status !== 0,
    'THE MINT ACCEPTED witnesses of unknown origin — the door just certified a lie')
  check('the refusal names GR-4', /GR-4/.test(rout) && /MISMATCH/.test(rout),
    `refusal text was: ${rout.slice(0, 200)}`)

  // ---- 3. a clean mint re-derives: κ and every evidence hash ---------------
  const clean = join(tmp, 'fg-clean')
  cpSync(src, clean, { recursive: true })
  rmSync(join(clean, 'artefacts'), { recursive: true, force: true })
  if (!findRun(clean)) fixtureRun(clean)
  const cleanRID = findRun(clean).rid
  const mint = spawnSync(process.execPath, ['tools/mint_artefact.mjs', clean, cleanRID], { cwd: root, encoding: 'utf8' })
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

  // ---- 3b. the holon mesh auditor catches a tampered evidence byte ---------
  if (mint.status === 0) {
    const id = (mint.stdout.match(/MINTED (af-[0-9a-f]+)/) || [])[1]
    const artDir = join(clean, 'artefacts')
    const passRun = spawnSync(process.execPath, ['tools/holon_audit.mjs', artDir], { cwd: root, encoding: 'utf8' })
    check('holon audit passes a clean mesh', passRun.status === 0 && /HOLON AUDIT PASS/.test(passRun.stdout),
      ((passRun.stdout || '') + (passRun.stderr || '')).slice(0, 200))
    // flip one byte of an evidence file — the content edge must no longer re-hash
    const evDir = join(artDir, id, 'evidence')
    const ev = readdirSync(evDir)[0]
    if (ev) {
      const evPath = join(evDir, ev)
      const b = Buffer.from(readFileSync(evPath)); b[0] ^= 0x01; writeFileSync(evPath, b)
      const failRun = spawnSync(process.execPath, ['tools/holon_audit.mjs', artDir], { cwd: root, encoding: 'utf8' })
      const fout = (failRun.stdout || '') + (failRun.stderr || '')
      check('holon audit catches a tampered content edge', failRun.status !== 0 && /content edge/.test(fout),
        `the mesh auditor did not fail on a flipped evidence byte: ${fout.slice(0, 200)}`)
    }
  }

  // ---- 4. the runtime feed projects frontier.json faithfully ---------------
  const feed = buildFeed(src)
  const fr = JSON.parse(readFileSync(join(src, 'frontier.json'), 'utf8'))
  check('feed moving-ceiling best matches frontier best', feed.movingCeiling.best === fr.best.metric,
    `feed ${feed.movingCeiling.best} vs frontier ${fr.best.metric}`)
  check('feed descent ends at the best (R non-rising, ≤ 1)', (() => {
    const s = feed.movingCeiling.series
    if (!s.length) return false
    const last = s[s.length - 1]
    // a fresh instance (best = baseline, one point, R = 1) is a valid descent
    // of length one — the default distribution ships exactly that shape.
    return last.value === fr.best.metric && (s[0].ratio ?? 1) >= (last.ratio ?? 1) && (last.ratio ?? 1) <= 1
  })(), 'the emitted R(t) descent does not end at the folded best')

  // ---- 5. the VRC: a signed relational edge mints; tampering breaks it ------
  const kp = keypair()
  const HA = { holon: 'vrc-test', tag: 'A' }; HA['κ'] = kappaOf(HA)
  const HB = { holon: 'vrc-test', tag: 'B' }; HB['κ'] = kappaOf(HB)
  const edge = signEdge(HA['κ'], { target: HB['κ'], relation: 'validated_by' }, kp)
  check('a signed VRC edge verifies (minted)', verifyEdge(HA['κ'], edge).minted,
    'signEdge/verifyEdge round-trip failed')
  check('a tampered edge target breaks the signature', !verifyEdge(HA['κ'], { ...edge, target: 'sha256:' + '0'.repeat(64) }).ok,
    'moving the target did not break the signature')
  check('the signer is a real ed25519 did:key (z6Mk…)', edge.by.startsWith('did:key:z6Mk'),
    `by = ${edge.by}`)
  const relLeak = { ...HA }; delete relLeak['κ']; relLeak.edges = [edge]
  check('edges do not change a holon κ (relations are not identity)', kappaOf(relLeak) === HA['κ'],
    'the edges field leaked into the κ preimage — a holon address must be stable as it accrues edges')

  // end to end: two holons, a signed edge between them, verified by the auditor
  const vdir = join(tmp, 'vrc-mesh')
  mkdirSync(vdir, { recursive: true })
  writeFileSync(join(vdir, 'A.holon.json'), JSON.stringify({ ...HA, edges: [edge] }))
  writeFileSync(join(vdir, 'B.holon.json'), JSON.stringify(HB))
  const vPass = spawnSync(process.execPath, ['tools/holon_audit.mjs', vdir], { cwd: root, encoding: 'utf8' })
  check('holon_audit mints a signed edge across a mesh', vPass.status === 0 && /1 minted/.test(vPass.stdout),
    ((vPass.stdout || '') + (vPass.stderr || '')).slice(0, 200))
  writeFileSync(join(vdir, 'A.holon.json'), JSON.stringify({ ...HA, edges: [{ ...edge, sig: (edge.sig[0] === 'A' ? 'B' : 'A') + edge.sig.slice(1) }] }))
  const vFail = spawnSync(process.execPath, ['tools/holon_audit.mjs', vdir], { cwd: root, encoding: 'utf8' })
  check('holon_audit catches a forged edge signature', vFail.status !== 0 && /signature does not verify/.test((vFail.stdout || '') + (vFail.stderr || '')),
    'a forged edge signature passed the mesh audit')
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

if (failures) { console.error(`\n${failures} console/mint test(s) FAILED.`); process.exit(1) }
console.log('\nconsole + mint: every check passed — the tamper is seen, the refusal names its rule, the labels re-derive.')
