#!/usr/bin/env node
// emit_feed.mjs — the runtime feed: the harness's produced math, in one
// portable shape the model's other instruments can each speak.
//
//   node tools/emit_feed.mjs <instanceDir> [--out <path>] [--stdout]
//
// The harness does not merely get DRAWN in the instrument language — it
// PRODUCES the terms that language renders. This tool projects an instance's
// live runtime state into `runtime-feed.v1`, a small, zero-dependency JSON
// that maps directly onto the existing agentprivacy visualisations:
//
//   movingCeiling  → the /star moving-ceiling instrument. Each fold is a point
//                    on the descent; `ratio` = metric / baseline is R(t), the
//                    ceiling the workshop is driving toward its floor.
//   lattice        → the game42 ℤ/64ℤ lattice and the spellweb graph. The six
//                    sovereignty axes and every seated XOR-63 pair, read from
//                    the universe seam (null when the seam is absent).
//   artefacts      → spellweb nodes. Each sealed, κ-labelled result, content-
//                    addressed so a consumer can re-derive it.
//
// A feed is a PROJECTION, never the record: the run directory and frontier.json
// remain authoritative (GR-5). This tool reads only, and — like every producer
// here — takes no outward action; wiring a consumer (star, spellweb, game42)
// is the First Person's, at their door (T6).
//
// Zero dependencies: node:fs, node:path, node:url only.

import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative, basename } from 'node:path'
import { kappaOf } from './kappa.mjs'  // κ as state: the feed is a self-addressing holon (HOLONS.md)

const INSCRIPTION = '(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ'
const here = dirname(fileURLToPath(import.meta.url))
const defaultRepoRoot = resolve(join(here, '..'))

const readJson = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return null } }
const isDir = (p) => { try { return statSync(p).isDirectory() } catch { return false } }
const round4 = (n) => Math.round(n * 10000) / 10000

// buildFeed(instanceDir, repoRoot?) → the runtime-feed.v1 object.
// repoRoot locates the optional universe/ seam; an instance outside this repo
// simply gets lattice: null unless it carries its own universe/universe.json.
export function buildFeed(instanceDir, repoRoot = defaultRepoRoot) {
  const dir = resolve(instanceDir)
  const frontier = readJson(join(dir, 'frontier.json'))
  if (!frontier) throw new Error(`no readable frontier.json under ${dir}`)

  const baseline = frontier.baseline && frontier.baseline.metric
  const best = (frontier.best && frontier.best.metric) ?? baseline
  const metricName = (frontier.objective && frontier.objective.metric) || null

  // --- movingCeiling: the descent, as /star's R(t) ---
  // Prefer the authoritative history array; fall back to the two endpoints so a
  // freshly-folded instance still emits a coherent (if short) ceiling.
  let series
  if (Array.isArray(frontier.history) && frontier.history.length) {
    series = frontier.history.map(h => ({
      label: h.target || h.note || String(h.metric),
      value: h.metric,
      ratio: Number.isFinite(baseline) && baseline ? round4(h.metric / baseline) : null,
      date: h.date || null,
      lever: h.lever || null,
      target: h.target || null,
      coverage: h.coverage || null,          // {mode: census|sample, N, n, detection} — what the fold's gate actually bought
      note: h.coverageNote || h.note || null,
      chronicle: h.chronicle || null,        // repo-relative path to the fold's chronicle (the record)
    }))
  } else {
    series = [
      { label: 'baseline', value: baseline, ratio: 1, date: (frontier.baseline || {}).date || null, lever: null },
      { label: 'best', value: best, ratio: Number.isFinite(baseline) && baseline ? round4(best / baseline) : null, date: frontier.updated || null, lever: (frontier.best || {}).leverIds ? (frontier.best.leverIds[0] || null) : null },
    ]
  }
  const movingCeiling = {
    metric: metricName, direction: 'down',
    baseline, best,
    ratioNow: Number.isFinite(baseline) && baseline ? round4(best / baseline) : null,
    open: frontier.openTarget ? { id: frontier.openTarget.id, statement: frontier.openTarget.statement, status: frontier.openTarget.status } : null,
    series,
  }

  // --- verdict tally across all runs on disk, plus a per-run summary ---
  const tally = { VALIDATED: 0, MIRAGE: 0, BLOCKED: 0 }
  const runsDir = join(dir, 'runs')
  const runSummary = (p) => {
    const t = { VALIDATED: 0, MIRAGE: 0, BLOCKED: 0 }
    let proposals = 0
    const walk = (q, depth) => {
      if (depth < 0 || !isDir(q)) return
      for (const e of readdirSync(q, { withFileTypes: true })) {
        const r = join(q, e.name)
        if (e.isDirectory()) {
          if (existsSync(join(r, 'proposal_canon.json'))) proposals++
          walk(r, depth - 1)
        } else if (e.name === 'verdict.json') {
          const v = readJson(r)
          if (v && v.status && v.status in t) { t[v.status]++; tally[v.status]++ }
        }
      }
    }
    walk(p, 3)
    return { tally: t, proposals }
  }
  const runs = []
  if (isDir(runsDir)) {
    for (const e of readdirSync(runsDir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue
      const s = runSummary(join(runsDir, e.name))
      runs.push({ id: e.name, proposals: s.proposals, tally: s.tally, view: existsSync(join(runsDir, e.name, 'run.html')) ? `runs/${e.name}/run.html` : null })
    }
    runs.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
  }

  // --- killed levers: the fences, counted (GR-6 — filed as prominently as wins) ---
  let killedLevers = null
  const klPath = join(dir, 'notes', 'KILLED_LEVERS.md')
  if (existsSync(klPath)) {
    try {
      // an instance may carry a prefixed catalog (V2-K-5) beside citations of a
      // sibling's (K-5) — capture the full id so the two never dedupe together
      const ids = [...new Set([...readFileSync(klPath, 'utf8').matchAll(/\b(?:[A-Z]\d+-)?K-\d+[a-z]?\b/g)].map(m => m[0]))]
      killedLevers = { count: ids.length, ids }
    } catch { /* unreadable — omit rather than guess */ }
  }

  // --- lattice: the ℤ/64ℤ six-axis structure, from the universe seam ---
  let lattice = null
  const uniPath = existsSync(join(dir, 'universe', 'universe.json'))
    ? join(dir, 'universe', 'universe.json')
    : (dir.startsWith(repoRoot) && existsSync(join(repoRoot, 'universe', 'universe.json')) ? join(repoRoot, 'universe', 'universe.json') : null)
  if (uniPath) {
    const u = readJson(uniPath)
    if (u && u.sovereignty_axes) {
      lattice = {
        space: 'Z/64Z = {0,1}^6',
        axes: Object.values(u.sovereignty_axes).filter(a => a && a.weight).map(a => ({ axis: a.axis, glyph: a.glyph, weight: a.weight })),
        seatedPairs: ((u.vertex_inventory || {}).seated_pairs || []).map(sp => ({ pair: sp.pair, xor: sp.xor, reading: sp.reading, instances: sp.instances || [] })),
        vacancies: ((u.vertex_inventory || {}).determined_vacancies || []).map(v => ({ workshop: v.workshop, vertex: v.vertex, forcedAnchor: v.forced_anchor, developer: v.developer || null })),
        anchorLaw: (u.sovereignty_axes.anchor_law) || 'a seated pair XORs to 63',
      }
    }
  }

  // --- artefacts: sealed κ-labelled results → spellweb nodes ---
  const artefacts = []
  const aDir = join(dir, 'artefacts')
  if (isDir(aDir)) {
    for (const e of readdirSync(aDir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue
      const a = readJson(join(aDir, e.name, 'artefact.json'))
      if (a && a.id) artefacts.push({ id: a.id, kappa: a['κ'] || null, run: a.run ? a.run.runId : null, beat: a.frontier ? !!a.frontier.beat : null, best: a.frontier ? a.frontier.best : null })
    }
  }

  const out = {
    feed: 'dual-agent-harness/runtime-feed.v1',
    instance: (frontier.objective && frontier.name) || basename(dir),
    updated: frontier.updated || null,
    movingCeiling,
    objective: frontier.objective ? {
      metric: frontier.objective.metric || null,
      gate: frontier.objective.gate || null,
      hardConstraint: frontier.objective.hardConstraint || null,
    } : null,
    coverageNote: frontier.coverageNote || null,
    closedTargets: Array.isArray(frontier.closedTargets)
      ? frontier.closedTargets.map(t => ({ id: t.id, statement: t.statement, status: t.status, date: t.date || null }))
      : [],
    verdicts: tally,
    runs,
    killedLevers,
    lattice,
    artefacts,
    door: 'first-person',
    inscription: INSCRIPTION,
    note: 'A projection of runtime state for the model instruments (/star · game42 · spellweb). The run directory and frontier.json are authoritative; wiring a consumer is the First Person’s (T6).',
  }
  // κ as state: the feed self-addresses, so a consumer can re-derive it and a
  // mesh auditor can verify it like any other holon (HOLONS.md).
  out['κ'] = kappaOf(out)
  return out
}

// ---- CLI ----
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const argv = process.argv.slice(2)
  const positional = argv.filter(a => !a.startsWith('--'))
  if (!positional.length) {
    console.error('usage: node tools/emit_feed.mjs <instanceDir> [--out <path>] [--stdout]')
    process.exit(1)
  }
  const dir = resolve(positional[0])
  const feed = buildFeed(dir)
  const json = JSON.stringify(feed, null, 2)
  if (argv.includes('--stdout')) { console.log(json); process.exit(0) }
  let out = join(dir, 'feed.json')
  const oi = argv.indexOf('--out')
  if (oi >= 0 && argv[oi + 1]) out = resolve(argv[oi + 1])
  writeFileSync(out, json)
  const mc = feed.movingCeiling
  console.log(`runtime feed → ${relative(process.cwd(), out).replace(/\\/g, '/')}`)
  console.log(`  moving ceiling: ${mc.baseline} → ${mc.best} ${mc.metric || ''} (R = ${mc.ratioNow}); ${mc.series.length} points on the descent`)
  console.log(`  verdicts: ${feed.verdicts.VALIDATED}✓ ${feed.verdicts.MIRAGE}∿ ${feed.verdicts.BLOCKED}✕ · lattice: ${feed.lattice ? feed.lattice.seatedPairs.length + ' seated pairs' : 'absent (no universe seam)'} · artefacts: ${feed.artefacts.length}`)
  console.log(`  this feed is a projection; wiring a consumer (/star · game42 · spellweb) is the First Person's (T6).`)
}
