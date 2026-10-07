#!/usr/bin/env node
// kappa_evidence.mjs — mint a run's record into a κ-addressed evidence bundle,
// and re-derive such a bundle from its root. The registry axis (tools/dcbor.mjs).
//
//   node tools/kappa_evidence.mjs mint   <instanceDir> <runId> [--out <dir>] [--sign]
//   node tools/kappa_evidence.mjs verify <bundleDir>
//   node tools/kappa_evidence.mjs root   <bundleDir>        # prints the "Evidence root:" line
//
// mint reads ONLY what the run already wrote (run.json; per proposal:
// proposal_canon.json, gap.json, verdict.json, candidate.md if present) and
// writes <out>/{objects,blobs,edges}/, root.json, graph.json, REPORT.md.
// Default out: <instanceDir>/runs/<runId>/evidence/. It changes nothing else:
// the Gap, the assay and the critic are untouched. What it adds is an
// addressable shape over their outputs:
//
//   proposal object ──evidence-provenance──► proposal_canon.json blob
//   gap object      ──derived-from──► proposal object   (the seed derives from
//                    hProposal, which IS the canon blob's κ hex: "witnesses
//                    derived from a κ the prover could not choose")
//   verdict object  ──derived-from──► proposal object; ──refers-to──► candidate
//   round ledger    ──composed-of──► verdict objects; tally check derived-from it
//   run root        ──composed-of──► ledgers + checks
//
// verify sees only the bundle: file names re-hash from content and objects
// are canonical; the composed-of walk from the root reaches every ledger;
// every row carries provenance to a blob; every check's facts recompute from
// its rows; every gap's hProposal equals its canon blob's κ; the merkle root
// matches; a leak scan passes. Exit 0 only when all hold. The Python verifier
// in kappa_evidence_mage reads the same layout (cross-language check).
//
// --sign: an ephemeral ed25519 key (tools/vrc.mjs convention: sign once, keep
// the did:key and the signature, discard the key) signs the root κ; the
// asserter of every edge becomes the registry anchor of that key
// (sha256 over dCBOR {0 "ed25519", 1 pubkey as int array}). Without --sign
// the asserter is the placeholder "unsigned:harness".
//
// Every κ here is "kappa-compatible (unverified)" until the P1 cargo check.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
import { join, resolve, relative, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateKeyPairSync, sign as edSign, verify as edVerify } from 'node:crypto'
import * as D from './dcbor.mjs'
import { didKey, publicKeyOf } from './vrc.mjs'

const NS = 'agentprivacy-evidence'
const PRIVATE = /[a-z]:[\\/]users[\\/]|\/c\/users|\/home\/|\/root\/|desktop-|\\\\wsl|@[a-z0-9.-]+\.(local|lan)/i
const redact = (s) => s.replace(new RegExp(PRIVATE.source, 'gi'), '[redacted]')

// ---------------------------------------------------------------- minting
class Bundle {
  constructor(lane, asserter) { this.lane = lane; this.asserter = asserter; this.objects = new Map(); this.blobs = new Map(); this.edges = new Map(); this.names = new Map() }
  put(v, name) { const k = D.kappaFromValue(v); this.objects.set(k, v); if (name) this.names.set(name, k); return k }
  putBlob(b, name) { const k = D.kappaFromBytes(b); this.blobs.set(k, b); if (name) this.names.set(name, k); return k }
  edge(s, t, rel, vk = null, md = null) { const e = D.edgeRecord(s, t, rel, this.asserter, vk, md); const k = D.kappaFromValue(e); this.edges.set(k, e); return k }
  ledger(name, desc, ks) { const k = this.put(new Map([[0, `${NS}/ledger/1`], [1, name], [2, ks], [3, this.lane], [4, desc]]), name); for (const c of ks) this.edge(k, c, 'composed-of'); return k }
  check(name, ledgerK, rule, facts) { const k = this.put(new Map([[0, `${NS}/check/1`], [1, ledgerK], [2, rule], [3, facts]]), name); this.edge(k, ledgerK, 'derived-from'); return k }
  root(composed, extra) {
    const leaves = [...this.objects.keys(), ...this.blobs.keys(), ...this.edges.keys()].sort()
    const mroot = D.merkleRoot(leaves.map(x => Buffer.from(x))).toString('hex')
    const v = new Map([[0, `${NS}/run-root/1`], [1, this.lane], [2, new Date().toISOString().slice(0, 10)],
      [3, [...this.names.entries()].sort().map(([n, k]) => [n, k])], [4, mroot], [5, D.STATUS], [6, this.asserter], [7, D.UPSTREAM]])
    if (extra) v.set(8, extra)
    const rk = D.kappaFromValue(v); this.objects.set(rk, v)
    for (const n of composed) { const e = D.edgeRecord(rk, this.names.get(n), 'composed-of', this.asserter); this.edges.set(D.kappaFromValue(e), e) }
    this.rootK = rk; this.mroot = mroot; this.nleaves = leaves.length
    return rk
  }
}

const js = (v) => v instanceof Map ? Object.fromEntries([...v].map(([k, x]) => [String(k), js(x)]))
  : v instanceof D.RustBytes ? Array.from(v) : v instanceof Uint8Array ? Buffer.from(v).toString('hex')
  : Array.isArray(v) ? v.map(js) : (typeof v === 'bigint' ? v.toString() : v)

function readJson(p) { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return null } }

export function mint(instDir, runId, { out = null, sign = false } = {}) {
  const runDir = join(instDir, 'runs', runId)
  if (!existsSync(runDir)) throw new Error(`no run directory at ${runDir}`)
  const outDir = out || join(runDir, 'evidence')
  const runJson = readJson(join(runDir, 'run.json')) || {}
  const lane = `harness/${basename(resolve(instDir))}/${runId}`

  let signer = null, asserter = 'unsigned:harness'
  if (sign) {
    const kp = generateKeyPairSync('ed25519')
    const raw = Buffer.from(kp.publicKey.export({ format: 'jwk' }).x, 'base64url')
    asserter = D.anchorFromKey('ed25519', raw)
    signer = { kp, raw, anchor: asserter }
  }
  const B = new Bundle(lane, asserter)

  const runBlob = B.putBlob(Buffer.from(redact(readFileSync(join(runDir, 'run.json'), 'utf8'))), 'source:run.json')
  const rounds = new Map()
  const scan = (base, label) => {
    for (const e of readdirSync(base, { withFileTypes: true })) {
      if (!e.isDirectory() || e.name === 'evidence') continue
      if (/^p\d+-/.test(e.name)) (rounds.get(label) || rounds.set(label, []).get(label)).push(join(base, e.name))
      else scan(join(base, e.name), label ? `${label}/${e.name}` : e.name)
    }
  }
  scan(runDir, '')
  let seq = 0
  const ledgerNames = [], checkNames = []
  for (const [roundId, dirs] of [...rounds.entries()].sort()) {
    const verdictKs = []
    for (const dir of dirs.sort()) {
      const pname = basename(dir)
      const canonPath = join(dir, 'proposal_canon.json')
      if (!existsSync(canonPath)) continue
      const canonBytes = readFileSync(canonPath)
      const canonK = B.putBlob(canonBytes, `canon:${roundId}/${pname}`)
      const gap = readJson(join(dir, 'gap.json')), verdict = readJson(join(dir, 'verdict.json'))
      const leverId = (verdict && verdict.leverId) || pname.replace(/^p\d+-/, '')
      const prop = new Map([[0, `${NS}/harness-proposal/1`], [1, seq++], [2, runId], [3, roundId], [4, pname], [5, leverId], [6, canonK]])
      const propK = B.put(prop, `proposal:${roundId}/${pname}`)
      B.edge(propK, canonK, 'evidence-provenance')
      if (gap) {
        const gapK0 = B.putBlob(readFileSync(join(dir, 'gap.json')), `gapjson:${roundId}/${pname}`)
        const g = new Map([[0, `${NS}/harness-gap/1`], [1, propK], [2, String(gap.seedHex || '')], [4, String(gap.hProposal || gap.seedHex || '')],
          [6, String(gap.mode || 'legacy')], [7, Number(gap.N || 0)], [8, Number(gap.count || 0)], [9, (gap.drawIndices || []).map(Number)]])
        if (gap.hSource) g.set(3, String(gap.hSource))
        if (gap.salt) g.set(5, String(gap.salt))
        const gapK = B.put(g, `gap:${roundId}/${pname}`)
        B.edge(gapK, propK, 'derived-from'); B.edge(gapK, gapK0, 'evidence-provenance')
      }
      if (verdict) {
        const vb = B.putBlob(Buffer.from(redact(readFileSync(join(dir, 'verdict.json'), 'utf8'))), `verdictjson:${roundId}/${pname}`)
        const v = new Map([[0, `${NS}/harness-verdict/1`], [1, propK], [2, String(verdict.status || 'UNKNOWN')], [5, redact(String(verdict.evidence || ''))]])
        if (typeof verdict.metric === 'number') v.set(3, verdict.metric)
        if (verdict.gateResult != null) v.set(4, redact(String(verdict.gateResult)))
        const vK = B.put(v, `verdict:${roundId}/${pname}`)
        B.edge(vK, propK, 'derived-from'); B.edge(vK, vb, 'evidence-provenance')
        if (existsSync(join(dir, 'candidate.md'))) {
          const cb = B.putBlob(Buffer.from(redact(readFileSync(join(dir, 'candidate.md'), 'utf8'))), `candidate:${roundId}/${pname}`)
          B.edge(vK, cb, 'refers-to')
        }
        verdictKs.push(vK)
      }
    }
    const ln = `verdicts:${roundId}`, cn = `tally:${roundId}`
    const lk = B.ledger(ln, `the verdicts of round ${roundId}, one per proposal, in proposal order`, verdictKs)
    B.check(cn, lk, 'harness/run-tally/1', tally(verdictKs.map(k => B.objects.get(k))))
    ledgerNames.push(ln); checkNames.push(cn)
  }
  const extra = new Map([['runId', runId], ['status', String(runJson.status || '')], ['sourceHash', String(runJson.sourceHash || '')], ['run_blob', runBlob]])
  const rootK = B.root([...ledgerNames, ...checkNames], extra)

  // write
  rmSync(outDir, { recursive: true, force: true })
  for (const d of ['objects', 'blobs', 'edges']) mkdirSync(join(outDir, d), { recursive: true })
  for (const [k, v] of B.objects) writeFileSync(join(outDir, 'objects', D.splitKappa(k)[1] + '.cbor'), D.encode(v))
  for (const [k, b] of B.blobs) writeFileSync(join(outDir, 'blobs', D.splitKappa(k)[1] + '.bin'), b)
  for (const [k, e] of B.edges) writeFileSync(join(outDir, 'edges', D.splitKappa(k)[1] + '.cbor'), D.encode(e))
  const meta = { root_kappa: rootK, status: D.STATUS, lane, minted_on: new Date().toISOString().slice(0, 10), merkle_root_sha256: B.mroot,
    merkle_leaves: B.nleaves, counts: { objects: B.objects.size, blobs: B.blobs.size, edges: B.edges.size }, names: Object.fromEntries(B.names), upstream: D.UPSTREAM }
  if (signer) {
    meta.signature = { by_anchor: signer.anchor, by_did: didKey(signer.kp.publicKey), alg: 'ed25519', over: rootK,
      sig: edSign(null, Buffer.from(rootK), signer.kp.privateKey).toString('base64url') }
  }
  writeFileSync(join(outDir, 'root.json'), JSON.stringify(meta, null, 1))
  writeFileSync(join(outDir, 'graph.json'), JSON.stringify({ status: D.STATUS, root: rootK,
    objects: Object.fromEntries([...B.objects].map(([k, v]) => [k, js(v)])), blobs: Object.fromEntries([...B.blobs].map(([k, b]) => [k, b.length])),
    edges: [...B.edges].map(([k, e]) => ({ kappa: k, source: e.get(0), target: e.get(1), relation: D.RELATION_NAME[e.get(2)], asserter: e.get(3) })) }, null, 1))
  const lines = [`# ${lane} evidence graph - minted ${meta.minted_on} - status: ${D.STATUS}`, '', `Evidence root: ${rootK}`, '',
    `Merkle root (provisional, SHA-256, ${B.nleaves} leaves): \`${B.mroot}\``, '', '| object | kappa |', '|---|---|',
    ...[...B.names.entries()].sort().map(([n, k]) => `| ${n} | \`${k}\` |`), '',
    `Objects ${B.objects.size}, blobs ${B.blobs.size}, edges ${B.edges.size}. Asserter \`${asserter}\`${signer ? ' (ed25519 anchor; signature in root.json)' : ' (placeholder, no key)'}.`, '',
    `Verify from the bundle alone: \`node tools/kappa_evidence.mjs verify ${relative(process.cwd(), outDir).replace(/\\/g, '/')}\`.`]
  writeFileSync(join(outDir, 'REPORT.md'), lines.join('\n') + '\n')
  return { rootK, outDir, counts: meta.counts, lines }
}

function tally(verdicts) {
  const statuses = verdicts.map(v => v.get(2))
  return { n: verdicts.length, validated: statuses.filter(s => s === 'VALIDATED').length, statuses: [...new Set(statuses)].sort() }
}
const RULES = { 'harness/run-tally/1': (rows) => tally(rows) }

// ---------------------------------------------------------------- verifying
export function verify(bundle, log = console.log) {
  const fails = []
  const fail = (m) => { fails.push(m); log('FAIL ' + m) }
  const objects = new Map(), blobs = new Map(), edges = new Map()
  for (const [sub, store] of [['objects', objects], ['edges', edges]]) {
    for (const fn of readdirSync(join(bundle, sub)).sort()) {
      const data = readFileSync(join(bundle, sub, fn)); const k = 'sha256:' + fn.slice(0, -5)
      let v; try { v = D.decode(data) } catch (e) { fail(`${sub}/${fn}: ${e.message}`); continue }
      if (D.kappaFromBytes(data) !== k) { fail(`${sub}/${fn}: content does not hash to its name`); continue }
      store.set(k, v)
    }
  }
  for (const fn of readdirSync(join(bundle, 'blobs')).sort()) {
    const data = readFileSync(join(bundle, 'blobs', fn)); const k = 'sha256:' + fn.slice(0, -4)
    if (D.kappaFromBytes(data) !== k) { fail(`blobs/${fn}: content does not hash to its name`); continue }
    blobs.set(k, data)
  }
  log(`re-hashed ${objects.size} objects, ${blobs.size} blobs, ${edges.size} edges`)
  const meta = JSON.parse(readFileSync(join(bundle, 'root.json'), 'utf8'))
  const rootK = meta.root_kappa, root = objects.get(rootK)
  const kind = (v) => v instanceof Map ? String(v.get(0) || '').split('/').slice(-2, -1)[0] : ''
  if (!root || kind(root) !== 'run-root') { fail('root kappa is not a run-root object in the bundle'); return { ok: false, fails } }
  log(`root ${rootK} | status: ${root.get(5)} | minted ${root.get(2)} | lane ${root.get(1)}`)
  const out = new Map()
  for (const e of edges.values()) { const key = `${e.get(0)}|${D.RELATION_NAME[e.get(2)]}`; (out.get(key) || out.set(key, []).get(key)).push(e.get(1)) }
  const O = (k, rel) => out.get(`${k}|${rel}`) || []
  const reached = new Set(), stack = [rootK]
  while (stack.length) { const k = stack.pop(); if (reached.has(k)) continue; reached.add(k); for (const t of O(k, 'composed-of')) { if (!objects.has(t) && !blobs.has(t)) fail(`composed-of target missing: ${t}`); stack.push(t) } }
  const names = new Map(root.get(3))
  for (const [n, k] of names) {
    if (!objects.has(k) && !blobs.has(k)) fail(`named object absent: ${n}`)
    const v = objects.get(k); if (v && ['ledger', 'check', 'summary'].includes(kind(v)) && !reached.has(k)) fail(`${n} not reachable from the root via composed-of`)
  }
  log(`composed-of walk reached ${reached.size} objects`)
  for (const [k, v] of objects) {
    if (kind(v) === 'ledger') {
      const rows = v.get(2), ce = O(k, 'composed-of')
      if (rows.length !== ce.length || !rows.every(r => ce.includes(r))) fail(`ledger ${v.get(1)}: composed-of edges do not match its row list`)
      for (const rk of rows) {
        if (!objects.has(rk)) { fail(`ledger ${v.get(1)}: row ${rk} missing`); continue }
        const prov = O(rk, 'evidence-provenance'); if (!prov.length || prov.some(p => !blobs.has(p))) fail(`row ${rk} of ${v.get(1)} lacks an evidence-provenance blob in the bundle`)
      }
    }
    if (kind(v) === 'check') {
      const led = objects.get(v.get(1)); if (!led || kind(led) !== 'ledger') { fail(`check ${k}: its ledger is missing`); continue }
      if (!O(k, 'derived-from').includes(v.get(1))) fail(`check ${k}: no derived-from edge to its ledger`)
      const rule = RULES[v.get(2)]; if (!rule) { fail(`check ${k}: unknown rule ${v.get(2)}`); continue }
      const rec = rule(led.get(2).map(r => objects.get(r)).filter(Boolean))
      const a = Buffer.compare(D.encode(rec), D.encode(v.get(3))) === 0
      if (!a) fail(`check ${v.get(2)} of ${led.get(1)}: recomputed ${JSON.stringify(rec)} != stored ${JSON.stringify(js(v.get(3)))}`)
      else log(`recomputed check ${v.get(2)} of ${led.get(1)}: ${JSON.stringify(rec)}`)
    }
    if (kind(v) === 'harness-gap') {
      const prop = objects.get(v.get(1)); const canonK = prop && prop.get(6)
      if (!prop || !blobs.has(canonK)) { fail(`gap ${k}: its proposal's canon blob is missing`); continue }
      if (D.splitKappa(canonK)[1] !== v.get(4)) fail(`gap ${k}: hProposal ${v.get(4).slice(0, 12)} != canon blob kappa ${D.splitKappa(canonK)[1].slice(0, 12)}`)
      if (!O(k, 'derived-from').includes(v.get(1))) fail(`gap ${k}: no derived-from edge to its proposal`)
    }
  }
  const gaps = [...objects.values()].filter(v => kind(v) === 'harness-gap').length
  if (gaps) log(`${gaps} gap seed(s) derive from their proposal canon's kappa`)
  const rootEdgeKs = new Set([...edges].filter(([, e]) => e.get(0) === rootK).map(([k]) => k))
  const leaves = [...new Set([...objects.keys(), ...blobs.keys(), ...edges.keys()])].filter(k => k !== rootK && !rootEdgeKs.has(k)).sort()
  const mroot = D.merkleRoot(leaves.map(x => Buffer.from(x))).toString('hex')
  if (mroot !== root.get(4)) fail(`merkle root mismatch: ${mroot} vs ${root.get(4)}`); else log(`merkle root over ${leaves.length} leaves matches`)
  const texts = function* (v) { if (typeof v === 'string') yield v; else if (v instanceof Map) { for (const x of v.values()) yield* texts(x) } else if (Array.isArray(v)) { for (const x of v) yield* texts(x) } }
  for (const [k, v] of [...objects, ...edges]) for (const s of texts(v)) if (PRIVATE.test(s)) fail(`private string in ${k}: ${JSON.stringify(s.slice(0, 60))}`)
  for (const [k, b] of blobs) if (PRIVATE.test(b.toString('utf8'))) fail(`private string in blob ${k}`)
  log('leak scan done')
  if (meta.signature) {
    try {
      const ok = edVerify(null, Buffer.from(meta.signature.over), publicKeyOf(meta.signature.by_did), Buffer.from(meta.signature.sig, 'base64url'))
      const anchorOk = ok && D.anchorFromKey('ed25519', Buffer.from(publicKeyOf(meta.signature.by_did).export({ format: 'jwk' }).x, 'base64url')) === meta.signature.by_anchor
      if (meta.signature.over !== rootK || !ok || !anchorOk) fail('root signature does not verify against the did:key / anchor in root.json')
      else log(`root signature verifies: ${meta.signature.by_did} = anchor ${meta.signature.by_anchor.slice(0, 20)}...`)
    } catch (e) { fail(`root signature check failed: ${e.message}`) }
  }
  log(`RESULT: ${fails.length ? fails.length + ' FAILURE(S)' : 'OK'} | status of every kappa: ${root.get(5)}`)
  return { ok: fails.length === 0, fails, rootK }
}

// ---------------------------------------------------------------- cli
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const [cmd, a, b, ...rest] = process.argv.slice(2)
  const opt = (f) => { const i = rest.indexOf(f); return i >= 0 ? rest[i + 1] : null }
  if (cmd === 'mint' && a && b) {
    const r = mint(resolve(a), b, { out: opt('--out') ? resolve(opt('--out')) : null, sign: rest.includes('--sign') || process.argv.includes('--sign') })
    console.log(r.lines.join('\n'))
  } else if (cmd === 'verify' && a) {
    process.exit(verify(resolve(a)).ok ? 0 : 1)
  } else if (cmd === 'root' && a) {
    const meta = JSON.parse(readFileSync(join(resolve(a), 'root.json'), 'utf8'))
    console.log(`Evidence root: ${meta.root_kappa}  (${meta.status}; merkle ${meta.merkle_root_sha256.slice(0, 16)}..., ${meta.counts.objects} objects, ${meta.counts.edges} edges)`)
  } else {
    console.error('usage: node tools/kappa_evidence.mjs mint <instanceDir> <runId> [--out <dir>] [--sign] | verify <bundleDir> | root <bundleDir>'); process.exit(2)
  }
}
