#!/usr/bin/env node
// console.mjs — the Workshop Console: a localhost window onto the harness.
//
//   node tools/console.mjs [--port 4242] [--root <dir>]... [--open]
//
// A GET-only node:http server bound to 127.0.0.1. It is a WINDOW, not a hand:
// there is no route that writes, folds, mints, or publishes. Minting is
// tools/mint_artefact.mjs, run by a person; outward actions are the First
// Person's alone (T6/GR-8).
//
// GR-5 discipline: the run directory is the record and this server holds no
// authoritative state. Every full response is re-gathered from disk, and every
// proposal's sha256(proposal_canon.json) is re-derived with node:crypto and
// compared to the Gap's recorded seedHex — MATCH is computed in front of you,
// never cached across content changes, never trusted from a file.
//
// The run-directory walk below is a DELIBERATE independent copy of the one in
// tools/render_run.mjs, in the same spirit as engine/conform.mjs keeping its
// own copy of the axioms: two auditors that could drift are two auditors; one
// shared helper is one broken gate waiting to happen.
//
// Zero dependencies: node:http, node:fs, node:path, node:crypto,
// node:child_process, node:url only.

import { createServer } from 'node:http'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync, spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve, relative, basename } from 'node:path'
import { buildFeed } from './emit_feed.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(join(here, '..'))
// importable as a module (tools/console.test.mjs does); the server only
// starts when this file is the entry point.
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

// ---- args -----------------------------------------------------------------
const argv = isMain ? process.argv.slice(2) : []
let port = 4242
const extraRoots = []
let openBrowser = false
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--port') port = Number(argv[++i]) || 4242
  else if (argv[i] === '--root') extraRoots.push(resolve(argv[++i]))
  else if (argv[i] === '--open') openBrowser = true
}
// optional machine-local roots: tools/console.roots.json — a JSON array of
// directories to scan in addition to this repo. Gitignored on purpose: the
// paths are yours, the repo stays share-safe. Same discovery rule applies.
if (isMain) {
  try {
    for (const r of JSON.parse(readFileSync(join(here, 'console.roots.json'), 'utf8'))) extraRoots.push(resolve(String(r)))
  } catch { /* absent or unparseable — flags still work */ }
}

// ---- helpers ---------------------------------------------------------------
const readText = (p) => { try { return readFileSync(p, 'utf8') } catch { return null } }
const readJson = (p) => { const t = readText(p); if (t == null) return null; try { return JSON.parse(t) } catch { return { __unparseable: true, __raw: t.slice(0, 400) } } }
const sha256File = (p) => { try { return createHash('sha256').update(readFileSync(p)).digest('hex') } catch { return null } }
const safeStat = (p) => { try { return statSync(p) } catch { return null } }
const isDir = (p) => { const s = safeStat(p); return !!s && s.isDirectory() }
const listDir = (p) => { try { return readdirSync(p, { withFileTypes: true }) } catch { return [] } }

// canonical JSON (recursive sorted keys, no whitespace) — the κ-label preimage
// convention shared with the City Key and the /sigil verifier (Law L5:
// a κ-label is never trusted, only re-derived).
export function canonicalJson(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v)
  if (Array.isArray(v)) return '[' + v.map(canonicalJson).join(',') + ']'
  return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonicalJson(v[k])).join(',') + '}'
}
export function deriveKappa(artefact) {
  const clone = { ...artefact }
  delete clone['κ']  // the label is excluded from its own preimage
  return 'sha256:' + createHash('sha256').update(canonicalJson(clone), 'utf8').digest('hex')
}

// mini YAML frontmatter: `key: value` lines between --- fences ONLY.
function frontmatter(text) {
  if (!text || !text.startsWith('---')) return null
  const end = text.indexOf('\n---', 3)
  if (end < 0) return null
  const out = {}
  for (const line of text.slice(3, end).split('\n')) {
    const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return Object.keys(out).length ? out : null
}

// mini manifest.yaml subset: top-level `key: value`, `- item` lists, inline
// `{ k: v, k: v }` flow maps under `artifacts:`. On any surprise → {raw}.
function parseManifest(text) {
  if (!text) return null
  try {
    const out = { gates: [], rules: {}, artifacts: {} }
    let section = null
    for (const raw of text.split('\n')) {
      const line = raw.replace(/#.*$/, '').trimEnd()
      if (!line.trim()) continue
      if (/^gates:/.test(line)) { section = 'gates'; continue }
      if (/^rules:/.test(line)) { section = 'rules'; continue }
      if (/^artifacts:/.test(line)) { section = 'artifacts'; continue }
      const top = line.match(/^(\w[\w-]*):\s*(.*)$/)
      if (top && !line.startsWith(' ') && !line.startsWith('-')) { section = null; out[top[1]] = top[2]; continue }
      if (section === 'gates') { const m = line.match(/^\s*-\s*(.+)$/); if (m) out.gates.push(m[1].trim()) }
      else if (section === 'rules') { const m = line.match(/^\s+(\w[\w-]*):\s*(.+)$/); if (m) out.rules[m[1]] = m[2].trim() }
      else if (section === 'artifacts') {
        const m = line.match(/^\s+(.+?):\s*\{(.*)\}\s*$/)
        if (m) {
          const entry = {}
          for (const kv of m[2].split(',')) { const p = kv.split(':'); if (p.length >= 2) entry[p[0].trim()] = p.slice(1).join(':').trim() }
          out.artifacts[m[1].trim()] = entry
        }
      }
    }
    return out
  } catch { return { raw: text } }
}

// ---- instance discovery (check.mjs's rule, verbatim in spirit) -------------
const SKIP = new Set(['node_modules', '.git', 'retired', 'templates'])
function discover() {
  const found = []
  const scan = (dir) => {
    if (!isDir(dir)) return
    for (const e of listDir(dir)) {
      if (!e.isDirectory() || SKIP.has(e.name)) continue
      const p = join(dir, e.name)
      if (existsSync(join(p, 'harness.config.mjs'))) found.push(p)
    }
  }
  scan(repoRoot)
  scan(join(repoRoot, 'examples'))
  for (const r of extraRoots) {
    if (existsSync(join(r, 'harness.config.mjs'))) found.push(r)
    scan(r)
    scan(join(r, 'examples'))
  }
  // stable ids: relative to repo root when inside it, else absolute-ish slug
  return [...new Set(found.map(p => resolve(p)))].map(p => ({
    id: p.startsWith(repoRoot) ? relative(repoRoot, p).replace(/\\/g, '/') : p.replace(/\\/g, '/'),
    dir: p,
  }))
}
const instanceById = (id) => discover().find(i => i.id === id) || null

// ---- config summary (serializable fields only; functions never cross) ------
const configCache = new Map()  // dir -> {mtimeMs, summary}
async function configSummary(dir) {
  const cfgPath = join(dir, 'harness.config.mjs')
  const st = safeStat(cfgPath)
  if (!st) return { error: 'harness.config.mjs missing' }
  const hit = configCache.get(dir)
  if (hit && hit.mtimeMs === st.mtimeMs) return hit.summary
  let summary
  try {
    const mod = await import(pathToFileURL(cfgPath).href + '?v=' + st.mtimeMs)
    const c = mod.default || {}
    summary = {
      name: c.name || basename(dir),
      objective: c.objective || null,
      door: c.door || null,
      heldApartRule: c.heldApartRule || null,
      finders: Array.isArray(c.finders) ? c.finders.map(f => ({ lens: f.lens, hint: f.hint })) : [],
      stop: c.stop || null,
      mana: c.mana || null,   // optional, advisory, display-only (SEAT_CONTRACT)
    }
  } catch (e) {
    summary = { name: basename(dir), error: 'config failed to import: ' + String(e && e.message || e).slice(0, 300) }
  }
  configCache.set(dir, { mtimeMs: st.mtimeMs, summary })
  return summary
}

// ---- stamp: cheap change detector ------------------------------------------
function stampOf(dir) {
  let maxM = 0, count = 0
  const touch = (p) => { const s = safeStat(p); if (s) { maxM = Math.max(maxM, s.mtimeMs); count++ } }
  touch(join(dir, 'frontier.json'))
  touch(join(dir, 'harness.config.mjs'))
  touch(join(dir, 'manifest.yaml'))
  const walk = (p, depth) => {
    if (depth < 0 || !isDir(p)) return
    for (const e of listDir(p)) {
      const q = join(p, e.name)
      touch(q)
      if (e.isDirectory()) walk(q, depth - 1)
    }
  }
  walk(join(dir, 'runs'), 3)
  walk(join(dir, 'chronicles'), 1)
  walk(join(dir, 'artefacts'), 2)
  return Math.round(maxM) + ':' + count
}

// ---- the run walk (independent copy — see file header for why) --------------
const isProposalDir = (name) => /^p\d+-/.test(name)
export function gatherRuns(dir) {
  const runsDir = join(dir, 'runs')
  if (!isDir(runsDir)) return []
  const runs = []
  for (const r of listDir(runsDir)) {
    if (!r.isDirectory()) continue
    const runDir = join(runsDir, r.name)
    const rounds = new Map()   // roundId -> {proposals, chronicleDraft}
    const addProposal = (roundId, name, pdir) => {
      const canonPath = join(pdir, 'proposal_canon.json')
      const gap = readJson(join(pdir, 'gap.json'))
      const journal = existsSync(join(pdir, 'gap.journal.json'))
      const verdict = readJson(join(pdir, 'verdict.json'))
      const canon = readJson(canonPath)
      const derived = sha256File(canonPath)          // re-derived NOW (GR-4)
      const recorded = gap && typeof gap.seedHex === 'string' ? gap.seedHex.toLowerCase() : null
      const mt = (f) => { const s = safeStat(join(pdir, f)); return s ? Math.round(s.mtimeMs) : null }
      if (!rounds.has(roundId)) rounds.set(roundId, { roundId, proposals: [], chronicleDraft: null })
      rounds.get(roundId).proposals.push({
        name,
        canon: canon && !canon.__unparseable ? {
          leverId: canon.leverId, title: canon.title, lens: canon.lens,
          expectedMetric: canon.expectedMetric, hardConstraintNote: canon.hardConstraintNote,
        } : null,
        recorded, derived,
        hashState: derived && recorded ? (derived === recorded ? 'MATCH' : 'MISMATCH') : 'INCOMPLETE',
        verdict: verdict && !verdict.__unparseable ? {
          leverId: verdict.leverId, status: verdict.status, metric: verdict.metric,
          gateResult: verdict.gateResult, failingCheck: verdict.failingCheck,
        } : null,
        candidateExists: existsSync(join(pdir, 'candidate.md')),
        gapJournal: journal,
        mtimes: { canon: mt('proposal_canon.json'), gap: mt('gap.json'), verdict: mt('verdict.json'), candidate: mt('candidate.md') },
      })
    }
    const addChronicle = (roundId, p) => {
      const s = safeStat(p)
      if (!rounds.has(roundId)) rounds.set(roundId, { roundId, proposals: [], chronicleDraft: null })
      const text = readText(p) || ''
      rounds.get(roundId).chronicleDraft = { name: basename(p), mtime: s ? Math.round(s.mtimeMs) : null, head: text.split('\n').slice(0, 40).join('\n') }
    }
    for (const e of listDir(runDir)) {
      if (e.isDirectory() && isProposalDir(e.name)) addProposal(r.name, e.name, join(runDir, e.name))
      else if (e.isDirectory()) {
        for (const s of listDir(join(runDir, e.name))) {
          if (s.isDirectory() && isProposalDir(s.name)) addProposal(e.name, `${e.name}/${s.name}`, join(runDir, e.name, s.name))
          else if (s.isFile() && /chronicle/i.test(s.name) && s.name.endsWith('.md')) addChronicle(e.name, join(runDir, e.name, s.name))
        }
      } else if (e.isFile() && /chronicle/i.test(e.name) && e.name.endsWith('.md')) addChronicle(r.name, join(runDir, e.name))
    }
    if (rounds.size) runs.push({ runId: r.name, rounds: [...rounds.values()].sort((a, b) => a.roundId.localeCompare(b.roundId, 'en', { numeric: true })) })
  }
  return runs.sort((a, b) => a.runId.localeCompare(b.runId, 'en', { numeric: true }))
}

function gatherChronicles(dir) {
  const cd = join(dir, 'chronicles')
  if (!isDir(cd)) return []
  return listDir(cd)
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => ({ file: e.name, ...(frontmatter(readText(join(cd, e.name))) || {}) }))
    .sort((a, b) => b.file.localeCompare(a.file))
}

export function gatherArtefacts(dir) {
  const ad = join(dir, 'artefacts')
  if (!isDir(ad)) return []
  const out = []
  for (const e of listDir(ad)) {
    if (!e.isDirectory()) continue
    const a = readJson(join(ad, e.name, 'artefact.json'))
    if (!a || a.__unparseable) { out.push({ id: e.name, error: 'artefact.json missing or unparseable' }); continue }
    // Law L5: never trust a κ-label — re-derive it in front of the reader.
    const derivedKappa = deriveKappa(a)
    out.push({
      id: a.id || e.name, kappa: a['κ'] || null, derivedKappa,
      kappaState: a['κ'] ? (a['κ'] === derivedKappa ? 'MATCH' : 'MISMATCH') : 'ABSENT',
      status: a.status, mintedAt: a.mintedAt, run: a.run, frontier: a.frontier ? { beat: a.frontier.beat, best: a.frontier.best } : null,
      proposals: (a.proposals || []).map(p => ({ leverId: p.leverId, hashState: p.hashState, verdict: p.verdict && p.verdict.status })),
      mana: a.mana || null,
      door: a.door ? { owner: a.door.owner, actionsTaken: a.door.actionsTaken, actionsAvailable: a.door.actionsAvailable } : null,
      universe: a.universe ? { gatehouseEligible: !!(a.universe.gatehouse && a.universe.gatehouse.eligible), vertexHint: a.universe.vertexHint || null } : null,
    })
  }
  return out.sort((a, b) => String(b.mintedAt || '').localeCompare(String(a.mintedAt || '')))
}

// ---- universe seam (populated only when the layer is present) ---------------
function gatherUniverse() {
  const u = readJson(join(repoRoot, 'universe', 'universe.json'))
  if (!u || u.__unparseable) return null
  const uf = readJson(join(repoRoot, 'universe', 'frontier.json'))
  return {
    axes: u.sovereignty_axes || null,                 // glyphs read from data, never hardcoded (E-7)
    seatedPairs: (u.vertex_inventory && u.vertex_inventory.seated_pairs) || [],
    vacancies: (u.vertex_inventory && u.vertex_inventory.determined_vacancies) || [],
    seats: u.seats || null,
    edgeRule: u.the_edge_rule ? { statement: u.the_edge_rule.statement, seal: u.the_edge_rule.seal } : null,
    runsFeed: uf && !uf.__unparseable && Array.isArray(uf.runs)
      ? uf.runs.map(r => ({ runId: r.runId, status: r.status, tally: r.tally || null, reason: r.reason || r.yield || null }))
      : [],
  }
}

// ---- gate spawns (cached; re-run when stamp moved or cache >30s old) --------
const gateCache = new Map()  // key -> {stamp, at, result}
function spawnGate(label, args) {
  const r = spawnSync(process.execPath, args, { cwd: repoRoot, encoding: 'utf8', timeout: 120000 })
  return { cmd: `node ${args.join(' ')}`, exit: r.status, out: ((r.stdout || '') + (r.stderr || '')).trim().slice(0, 8000), at: new Date().toISOString(), label }
}
function cachedGate(key, stamp, thunk) {
  const hit = gateCache.get(key)
  if (hit && hit.stamp === stamp && Date.now() - hit.atMs < 30000) return hit.result
  const result = thunk()
  gateCache.set(key, { stamp, atMs: Date.now(), result })
  return result
}

// ---- doc allowlist (literal names; no path resolution of user input) --------
const DOCS = {
  'README.md': 'README.md', 'TRUSTS.md': 'TRUSTS.md', 'GROUND_RULES.md': 'GROUND_RULES.md',
  'ADOPTION.md': 'ADOPTION.md', 'SEAT_CONTRACT.md': 'SEAT_CONTRACT.md',
  'seats/measure.md': 'seats/measure.md', 'seats/soulbae-propose.md': 'seats/soulbae-propose.md',
  'seats/gap-hold-apart.md': 'seats/gap-hold-apart.md', 'seats/soulbis-assay.md': 'seats/soulbis-assay.md',
  'seats/critic.md': 'seats/critic.md', 'seats/chronicle.md': 'seats/chronicle.md', 'seats/keystone.md': 'seats/keystone.md',
}

// ---- routes -----------------------------------------------------------------
const json = (res, code, body) => { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)) }

async function handle(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'this console is a window, not a hand — GET only (T6/GR-8)' })
  const url = new URL(req.url, 'http://x')
  const q = url.searchParams

  if (url.pathname === '/') {
    const page = readText(join(here, 'console.html'))
    if (!page) return json(res, 500, { error: 'tools/console.html missing' })
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    return res.end(page)
  }

  // the workshop's front page — the contribution, a static instrument that
  // ships beside the live console (both speak the same house geometry).
  if (url.pathname === '/workshop' || url.pathname === '/workshop.html') {
    const page = readText(join(here, 'workshop.html'))
    if (!page) return json(res, 404, { error: 'tools/workshop.html missing' })
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    return res.end(page)
  }

  if (url.pathname === '/api/instances') {
    const list = []
    for (const inst of discover()) {
      const f = readJson(join(inst.dir, 'frontier.json'))
      list.push({
        ...inst,
        config: await configSummary(inst.dir),
        frontierSummary: f && !f.__unparseable ? {
          baseline: f.baseline && f.baseline.metric, best: f.best && f.best.metric,
          openTarget: f.openTarget && f.openTarget.id, updated: f.updated,
        } : null,
        stamp: stampOf(inst.dir),
      })
    }
    return json(res, 200, list)
  }

  if (url.pathname === '/api/state') {
    const inst = instanceById(q.get('instance'))
    if (!inst) return json(res, 404, { error: 'unknown instance' })
    const stamp = stampOf(inst.dir)
    if (q.get('since') === stamp) return json(res, 200, { unchanged: true, stamp })
    return json(res, 200, {
      stamp,
      instance: { ...inst, config: await configSummary(inst.dir) },
      frontier: readJson(join(inst.dir, 'frontier.json')),
      manifest: parseManifest(readText(join(inst.dir, 'manifest.yaml'))),
      runs: gatherRuns(inst.dir),
      chronicles: gatherChronicles(inst.dir),
      doorItems: gatherArtefacts(inst.dir),
      universe: inst.dir.startsWith(repoRoot) ? gatherUniverse() : null,
    })
  }

  if (url.pathname === '/api/gates') {
    const inst = instanceById(q.get('instance'))
    if (!inst) return json(res, 404, { error: 'unknown instance' })
    const stamp = stampOf(inst.dir)
    const rel = inst.dir.startsWith(repoRoot) ? relative(repoRoot, inst.dir).replace(/\\/g, '/') : inst.dir
    const conform = cachedGate('conform:' + inst.dir, stamp, () => spawnGate('conform', ['engine/conform.mjs', rel]))
    let audit = null
    if (existsSync(join(repoRoot, 'universe', 'audit.mjs'))) {
      audit = cachedGate('audit', stampOf(join(repoRoot, 'universe')), () => spawnGate('universe audit', ['universe/audit.mjs']))
    }
    return json(res, 200, { conform, audit })
  }

  if (url.pathname === '/api/check') {
    const result = cachedGate('check', 'ondemand', () => spawnGate('check', ['tools/check.mjs']))
    return json(res, 200, result)
  }

  if (url.pathname === '/api/doc') {
    const name = q.get('name')
    if (!Object.prototype.hasOwnProperty.call(DOCS, name)) return json(res, 404, { error: 'not on the allowlist' })
    const text = readText(join(repoRoot, DOCS[name]))
    if (text == null) return json(res, 404, { error: 'file missing' })
    res.writeHead(200, { 'content-type': 'text/markdown; charset=utf-8' })
    return res.end(text)
  }

  if (url.pathname === '/api/artefacts') {
    const inst = instanceById(q.get('instance'))
    if (!inst) return json(res, 404, { error: 'unknown instance' })
    return json(res, 200, gatherArtefacts(inst.dir))
  }

  // the runtime feed — the harness's produced math, in the shape the model's
  // other instruments speak (/star moving ceiling · game42 lattice · spellweb).
  // A live projection a consumer can poll; wiring it is the First Person's (T6).
  if (url.pathname === '/api/feed') {
    const inst = instanceById(q.get('instance'))
    if (!inst) return json(res, 404, { error: 'unknown instance' })
    try { return json(res, 200, buildFeed(inst.dir, repoRoot)) }
    catch (e) { return json(res, 500, { error: String(e && e.message || e) }) }
  }

  return json(res, 404, { error: 'no such route' })
}

if (isMain) {
serve()
}
function serve() {
const server = createServer((req, res) => { handle(req, res).catch(e => json(res, 500, { error: String(e && e.message || e) })) })
server.listen(port, '127.0.0.1', () => {
  const addr = `http://127.0.0.1:${port}/`
  console.log(`workshop console — a window, not a hand (GET-only, T6/GR-8)`)
  console.log(`  ${addr}`)
  console.log(`  instances: ${discover().map(i => i.id).join(' · ') || '(none found)'}`)
  console.log(`  universe layer: ${existsSync(join(repoRoot, 'universe', 'universe.json')) ? 'present' : 'absent (supported)'}`)
  if (openBrowser) {
    const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', addr]] : process.platform === 'darwin' ? ['open', [addr]] : ['xdg-open', [addr]]
    try { spawn(cmd[0], cmd[1], { detached: true, stdio: 'ignore' }).unref() } catch { /* the link is printed either way */ }
  }
})
}
