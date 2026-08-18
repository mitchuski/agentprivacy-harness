#!/usr/bin/env node
// spellweb.mjs — derive a knowledge graph from harness ledgers. Reflected
// back from the hh_workshop build (2026-07-18); slimmed to data-only
// 2026-08-17: every node and edge is WALKED out of ledgers, so the graph
// cannot drift from the thing it describes. Re-run = re-true.
//
//   node tools/spellweb.mjs <instanceDir> [--out <dir>]     one instance's web
//   node tools/spellweb.mjs --workshop <repoRoot> [--out <dir>]
//                                                the whole workshop: algebra,
//                                                trusts, seats, engine, and
//                                                every path in HARNESS_PATHS
//
// Emits <out>/graph.json (default: <dir>/web/) — DATA ONLY. The harness owns
// the graph; the view lives with the consumer (spellweb.ai, /star, game42,
// any BYO interface). Dialect and semantics: GRAPH.md — node { id, type,
// label, domain, layer, desc, ... } · edge { source, target, type }; a
// derived edge is a proposal, only a signature (VRC) mints one.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join, resolve, basename } from 'node:path'

const args = process.argv.slice(2)
const workshopMode = args.includes('--workshop')
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out')
const dirArg = workshopMode ? (positional[0] || '.') : positional[0]
if (!dirArg) { console.error('usage: node tools/spellweb.mjs <instanceDir> [--out <dir>]  |  --workshop <repoRoot> [--out <dir>]'); process.exit(2) }
const rootDir = resolve(dirArg)
const oi = args.indexOf('--out')
const outDir = oi >= 0 ? resolve(args[oi + 1]) : join(rootDir, 'web')
mkdirSync(outDir, { recursive: true })

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const read = (p, d = '') => { try { return readFileSync(p, 'utf8') } catch { return d } }
const readJson = (p, d = null) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return d } }

const nodes = [], edges = [], seen = new Set()
const node = (n) => { if (!seen.has(n.id)) { seen.add(n.id); nodes.push(n) } return n.id }
const edge = (source, target, type, extra = {}) => edges.push({ source, target, type, ...extra })

let name

if (!workshopMode) {
  // ═══ INSTANCE MODE — walk one instance's ledgers ═══════════════════════════
  const inst = rootDir
  let config = null
  try { config = (await import(pathToFileURL(join(inst, 'harness.config.mjs')).href)).default } catch {}
  name = config?.name || basename(inst)
  const instId = `instance-${slug(name)}`
  node({ id: instId, type: 'instance', label: name, domain: 'shared', layer: 'core', desc: `harness instance at ${inst.replace(/\\/g, '/')}` })
  if (config) {
    const objId = `objective-${slug(name)}`
    node({ id: objId, type: 'objective', label: 'the objective', domain: 'shared', layer: 'knowledge', desc: String(config.objective?.metric || '').slice(0, 300), gate: String(config.objective?.gate || '').slice(0, 300), hardConstraint: String(config.objective?.hardConstraint || '').slice(0, 300), canary: String(config.objective?.canary || '').slice(0, 300) })
    edge(instId, objId, 'holds')
    for (const f of config.finders || []) {
      const lid = `lens-${slug(f.lens)}`
      node({ id: lid, type: 'lens', label: f.lens, domain: /spec|prover|sword/i.test(f.lens) ? 'swordsman' : 'mage', layer: 'knowledge', desc: String(f.hint || '').slice(0, 240) })
      edge(lid, instId, 'searches_for')
    }
  }
  const frontier = readJson(join(inst, 'frontier.json'))
  if (frontier) {
    const fid = `frontier-${slug(name)}`
    node({ id: fid, type: 'frontier', label: `frontier · best ${frontier.best?.metric ?? '?'}`, domain: 'shared', layer: 'knowledge', desc: `baseline ${frontier.baseline?.metric} (${frontier.baseline?.date || ''}) → best ${frontier.best?.metric}`, baseline: frontier.baseline?.metric, best: frontier.best?.metric })
    edge(instId, fid, 'measured_by')
    if (frontier.openTarget) {
      const otId = `target-${slug(frontier.openTarget.id || 'ot')}`
      node({ id: otId, type: 'target', label: frontier.openTarget.id || 'open target', domain: 'shared', layer: 'knowledge', desc: String(frontier.openTarget.statement || '').slice(0, 300), status: frontier.openTarget.status })
      edge(fid, otId, 'advances_toward')
    }
  }
  if (existsSync(join(inst, 'runs'))) for (const rid of readdirSync(join(inst, 'runs'))) {
    const runDirTop = join(inst, 'runs', rid)
    try { if (!readdirSync(runDirTop)) continue } catch { continue }
    const summary = readJson(join(runDirTop, 'run.json'))
    const rnode = `run-${slug(rid)}`
    node({ id: rnode, type: 'run', label: `run ${rid}`, domain: 'shared', layer: 'record', desc: summary ? `${summary.status} · ${summary.rounds} round(s) · ${JSON.stringify(summary.tally)}` : 'recorded run', status: summary?.status || null })
    edge(rnode, `instance-${slug(name)}`, 'ran_in')
    const walk = (d) => {
      let entries = []
      try { entries = readdirSync(d, { withFileTypes: true }) } catch { return }
      for (const e of entries) {
        if (!e.isDirectory()) continue
        const p = join(d, e.name)
        if (!/^p\d+-/.test(e.name)) { walk(p); continue }
        const prop = readJson(join(p, 'proposal_canon.json'))
        const verdict = readJson(join(p, 'verdict.json'))
        if (!prop) continue
        const lid = `lever-${slug(rid)}-${slug(prop.leverId || e.name)}`
        node({ id: lid, type: 'lever', label: prop.leverId || e.name, domain: /spec|prover/i.test(prop.lens || '') ? 'swordsman' : 'mage', layer: 'work', desc: `${prop.title || ''} · ${verdict ? verdict.status : 'unassayed'}`, status: verdict?.status || null, lens: prop.lens || null })
        edge(lid, rnode, verdict ? (verdict.status === 'VALIDATED' ? 'validated_in' : verdict.status === 'MIRAGE' ? 'mirage_in' : 'blocked_in') : 'proposed_in')
        if (prop.lens) edge(lid, `lens-${slug(prop.lens)}`, 'through_lens')
      }
    }
    walk(runDirTop)
  }
  const reg = read(join(inst, 'claims_register.md'))
  for (const m of reg.matchAll(/^\|\s*(CR-[\w-]+|C-\d+|CL-\d+)\s*\|([^|]*)\|/gm)) {
    const cid = `claim-${slug(m[1])}`
    node({ id: cid, type: 'claim', label: m[1], domain: 'shared', layer: 'knowledge', desc: m[2].trim().slice(0, 200) })
    edge(`instance-${slug(name)}`, cid, 'claims')
  }
  const killed = read(join(inst, 'notes', 'KILLED_LEVERS.md'))
  for (const m of killed.matchAll(/^#{2,3}\s*(K-?\d+[^\n]*)$/gm)) {
    const kid = `killed-${slug(m[1].slice(0, 40))}`
    node({ id: kid, type: 'killed_lever', label: m[1].trim().slice(0, 60), domain: 'shared', layer: 'work', desc: 'killed ≠ impossible — carries a re-open condition' })
    edge(`instance-${slug(name)}`, kid, 'killed')
  }
  if (existsSync(join(inst, 'chronicles'))) for (const f of readdirSync(join(inst, 'chronicles')).filter(f => f.endsWith('.md'))) {
    const title = (read(join(inst, 'chronicles', f)).match(/^# (.+)$/m) || [null, f])[1]
    const cid = `chronicle-${slug(basename(f, '.md'))}`
    node({ id: cid, type: 'chronicle', label: title.slice(0, 70), domain: 'shared', layer: 'record', desc: f })
    edge(cid, `instance-${slug(name)}`, 'chronicles')
  }
} else {
  // ═══ WORKSHOP MODE — the whole harness as one web ═════════════════════════
  const root = rootDir
  name = 'the workshop'
  const algebra = node({ id: 'algebra', type: 'algebra', label: '(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ', domain: 'shared', layer: 'core', desc: 'The inscription: two different inversions, held apart, compose to the step forward. Proven on Z/64Z by engine/conform.mjs every run.' })
  // trusts
  for (const m of read(join(root, 'TRUSTS.md')).matchAll(/^### (T\d) · (.+)$/gm)) {
    const tid = node({ id: `trust-${m[1].toLowerCase()}`, type: 'trust', label: `${m[1]} · ${m[2].trim()}`, domain: 'first_person', layer: 'constitution', desc: 'constitutional trust — TRUSTS.md' })
    edge(tid, algebra, 'binds')
  }
  const gr = node({ id: 'ground-rules', type: 'rules', label: 'GROUND_RULES GR-1..GR-10', domain: 'shared', layer: 'constitution', desc: 'pasted into every seat at boot: frontier authority, claim tiers, hard constraints, Gap-only witnesses, honest labels, kills at win-prominence, chronicles, the door, trace-or-delete, keystone-only ledgers' })
  edge(gr, algebra, 'binds')
  // seats
  for (const f of (existsSync(join(root, 'seats')) ? readdirSync(join(root, 'seats')).filter(f => f.endsWith('.md')) : [])) {
    const title = (read(join(root, 'seats', f)).match(/^# (.+)$/m) || [null, basename(f, '.md')])[1]
    const dom = /soulbis|assay/.test(f) ? 'swordsman' : /soulbae|propose/.test(f) ? 'mage' : /keystone/.test(f) ? 'first_person' : 'shared'
    const sid = node({ id: `seat-${slug(basename(f, '.md'))}`, type: 'seat', label: title.slice(0, 60), domain: dom, layer: 'seats', desc: `seats/${f}` })
    edge(sid, algebra, 'seated_on')
  }
  // engine + lanes
  const engine = node({ id: 'engine', type: 'engine', label: 'engine/ · the loop + conform + tests', domain: 'shared', layer: 'machinery', desc: 'dual_agent_loop.mjs (Measure → Propose → Hold-apart → Assay → Critic → Chronicle) · conform.mjs proves the axioms with its own independent copy · loop.test.mjs pins the failure semantics' })
  edge(engine, algebra, 'proves')
  const lanes = [
    ['holon-layer', 'the holon layer · κ / VRC / audit', 'kappa.mjs one κ law · vrc.mjs signed relational edges (a reference proposes; a signature mints) · holon_audit.mjs re-derives everything — an auditor, and it says so (HOLONS.md)'],
    ['observe-lane', 'the Observe lane · wiki + graph', 'WIKI.md: spellweb.mjs → wiki_emit.mjs → wiki_install.mjs — research auto-populates a federated wiki; pages for people, graph.json for agents; serving beyond localhost is the door'],
    ['console-lane', 'the workshop console + mint', 'console.mjs live GET-only window · render_run.mjs / verify_run.mjs re-derive every seed from saved bytes · mint_artefact.mjs seals a validated run at the door'],
  ]
  for (const [id, label, desc] of lanes) { const lid = node({ id, type: 'tool', label, domain: 'shared', layer: 'machinery', desc }); edge(lid, engine, 'implements') }
  // paths — every row of the HARNESS_PATHS table
  const hp = read(join(root, 'HARNESS_PATHS.md'))
  const tbl = hp.split('\n').filter(l => /^\|/.test(l)).slice(2)
  for (const row of tbl) {
    const cells = row.split('|').map(c => c.trim()).filter(Boolean)
    if (cells.length < 5) continue
    const [inst, domain, objective, gap, weight] = cells
    const label = inst.replace(/\*\*/g, '')
    const w = weight.toLowerCase()
    const cls = /descendant/.test(w) ? 'descendant' : /retired/.test(w) ? 'retired' : /full/.test(w) ? 'full' : /filled|signed/.test(w) ? 'full' : 'adjacent'
    const pid = node({ id: `path-${slug(label)}`, type: 'path', label, domain: 'shared', layer: 'paths', desc: `${domain} — ${objective}`, gap: gap.replace(/\*\*/g, ''), weight: weight.replace(/\*\*/g, ''), cls })
    edge(pid, algebra, cls === 'descendant' ? 'inherits' : cls === 'retired' ? 'retired_from' : cls === 'full' ? 'proves' : 'wears')
  }
  node({ id: 'first-person', type: 'door', label: 'the First Person 😊 · the door', domain: 'first_person', layer: 'constitution', desc: 'every outward action — push, publish, submit, serve — is a human’s alone; the system’s job is to make the door visible and stop in front of it (T6)' })
  edge('first-person', algebra, 'opens')
}

// ═══ EMIT ═════════════════════════════════════════════════════════════════════
const ids = new Set(nodes.map(n => n.id))
const kept = edges.filter(e => ids.has(e.source) && ids.has(e.target))
const graph = {
  name, mode: workshopMode ? 'workshop' : 'instance',
  derived: 'walked from the ledgers by tools/spellweb.mjs — re-run = re-true; never hand-edit',
  nodeTypes: [...new Set(nodes.map(n => n.type))].sort(),
  edgeTypes: [...new Set(kept.map(e => e.type))].sort(),
  nodes, edges: kept,
}
writeFileSync(join(outDir, 'graph.json'), JSON.stringify(graph, null, 2) + '\n')

console.log(`graph derived (${graph.mode}) for ${name}: ${nodes.length} nodes · ${kept.length} edges → ${join(outDir, 'graph.json').split('\\').join('/')}`)
console.log(`the view lives with the consumer: point /spellweb, /star, game42, or any BYO interface at graph.json (dialect: GRAPH.md)`)
