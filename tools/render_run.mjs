#!/usr/bin/env node
// render_run.mjs — project one run directory into a single static HTML page.
//
//   node tools/render_run.mjs <instanceDir> <runId>
//   node tools/render_run.mjs <instanceDir> --all
//
// Pure read, one write: runs/<runId>/run.html and nothing else. The page is a
// GENERATED PROJECTION of the run directory — never hand-edited, never
// authoritative; the run directory is the record (GR-6 discipline: what is
// filed is what counts, and this page only points at it).
//
// The pedagogical heart is the Gap ⿻: for every proposal the page shows the
// recorded seedHex from gap.json AND re-derives sha256(proposal_canon.json)
// from the file bytes at render time. Re-derive, never trust (GR-4). A
// mismatch renders as a loud warning, because a mismatch means the witnesses
// were not provably drawn from the proposal and the round is void.
//
// Zero dependencies: node:fs, node:path, node:crypto only.

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, resolve, basename } from 'node:path'

const INSCRIPTION = '(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ'

const [instArg, runArg] = process.argv.slice(2)
if (!instArg || !runArg) {
  console.error('usage: node tools/render_run.mjs <instanceDir> <runId>')
  console.error('       node tools/render_run.mjs <instanceDir> --all')
  process.exit(1)
}
const instanceDir = resolve(instArg)
const runsDir = join(instanceDir, 'runs')
if (!existsSync(runsDir)) { console.error(`no runs/ directory under ${instanceDir}`); process.exit(1) }

// ---- read helpers: everything is optional; absence is reported, not thrown ----
const readText = (p) => { try { return readFileSync(p, 'utf8') } catch { return null } }
const readJson = (p) => { const t = readText(p); if (t == null) return null; try { return JSON.parse(t) } catch { return { __unparseable: true, __raw: t.slice(0, 400) } } }
const sha256File = (p) => { try { return createHash('sha256').update(readFileSync(p)).digest('hex') } catch { return null } }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---- gather one run ----
function gatherRun(runId) {
  const runDir = join(runsDir, runId)
  const entries = readdirSync(runDir, { withFileTypes: true })

  // proposal scratch dirs: runs/<runId>/p<i>-<leverId>/ (GR-10 scratch copies)
  const proposals = entries
    .filter(e => e.isDirectory() && /^p\d+-/.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
    .map(e => {
      const dir = join(runDir, e.name)
      const canonPath = join(dir, 'proposal_canon.json')
      const gap = readJson(join(dir, 'gap.json'))
      const derived = sha256File(canonPath)
      const recorded = gap && typeof gap.seedHex === 'string' ? gap.seedHex.toLowerCase() : null
      return {
        name: e.name,
        canon: readJson(canonPath),
        canonExists: existsSync(canonPath),
        gap,
        verdict: readJson(join(dir, 'verdict.json')),
        candidateExists: existsSync(join(dir, 'candidate.md')),
        derived,
        recorded,
        // MATCH only when both sides exist and agree; anything less is not a match
        hashState: derived && recorded ? (derived === recorded ? 'MATCH' : 'MISMATCH') : 'INCOMPLETE',
      }
    })

  // chronicle drafts: CHRONICLE_DRAFT.md by convention, plus any *chronicle*.md
  const chronicles = entries
    .filter(e => e.isFile() && /chronicle/i.test(e.name) && e.name.endsWith('.md'))
    .map(e => ({ name: e.name, text: readText(join(runDir, e.name)) }))

  return {
    runId, runDir, proposals, chronicles,
    measure: readJson(join(runDir, 'measure.json')),          // optional: some drivers persist it
    critic: readJson(join(runDir, 'critic.json')),            // optional: some drivers persist it
    frontierBefore: readJson(join(runDir, 'frontier_before.json')), // optional before/after snapshots
    frontierAfter: readJson(join(runDir, 'frontier_after.json')),
  }
}

// ---- render fragments ----
const CHIP_CLASS = { VALIDATED: 'validated', MIRAGE: 'mirage', BLOCKED: 'blocked' }
const chip = (status) => `<span class="chip ${CHIP_CLASS[status] || 'other'}">${esc(status || 'NO VERDICT')}</span>`
const missing = (what) => `<p class="missing">${esc(what)} — not reached / not recorded. An honest partial teaches the bar (GR-5).</p>`
const mono = (s, cap = 4000) => `<pre>${esc(String(s).slice(0, cap))}${String(s).length > cap ? '\n… (truncated — read the file itself)' : ''}</pre>`
const kv = (pairs) => `<dl>${pairs.filter(([, v]) => v != null && v !== '').map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`

function renderMeasure(run, frontier) {
  const parts = []
  if (frontier) {
    parts.push('<p>Numbers cited from <code>frontier.json</code> — the sole authority (GR-1). Prose never restates them.</p>')
    parts.push(kv([
      ['objective', frontier.objective?.metric],
      ['baseline', frontier.baseline?.metric],
      ['best', frontier.best?.metric],
      ['best levers', (frontier.best?.leverIds || []).join(', ') || '(none folded)'],
      ['updated', frontier.updated],
    ]))
    if (Number.isFinite(frontier.baseline?.metric) && Number.isFinite(frontier.best?.metric)) {
      parts.push(`<p class="delta">frontier delta to date: ${esc(frontier.baseline.metric)} → ${esc(frontier.best.metric)} (${esc(frontier.best.metric - frontier.baseline.metric)})</p>`)
    }
  } else parts.push(missing('frontier.json at the instance root'))
  if (run.frontierBefore && run.frontierAfter) {
    parts.push(`<p class="delta">this run recorded before/after: best ${esc(run.frontierBefore.best?.metric)} → ${esc(run.frontierAfter.best?.metric)}</p>`)
  }
  if (run.measure) parts.push('<details><summary>measure.json (persisted by this driver)</summary>' + mono(JSON.stringify(run.measure, null, 2)) + '</details>')
  else parts.push('<p class="note">no measure.json — the reference engine returns measure output to the orchestrator without persisting it.</p>')
  return parts.join('\n')
}

function renderPropose(run) {
  if (!run.proposals.length) return missing('proposal scratch dirs (runs/<runId>/p<i>-<leverId>/)')
  return run.proposals.map(p => {
    if (!p.canonExists) return `<div class="card"><h4>${esc(p.name)}</h4>${missing('proposal_canon.json')}</div>`
    if (p.canon?.__unparseable) return `<div class="card"><h4>${esc(p.name)}</h4><p class="missing">proposal_canon.json unparseable — bytes still hashable below.</p></div>`
    const c = p.canon || {}
    return `<div class="card"><h4>${esc(p.name)}</h4>` + kv([
      ['leverId', c.leverId], ['title', c.title], ['lens', c.lens],
      ['expectedMetric', c.expectedMetric], ['hardConstraintNote', c.hardConstraintNote],
    ]) + (c.rationale ? `<details><summary>rationale</summary>${mono(c.rationale)}</details>` : '') + '</div>'
  }).join('\n')
}

function renderHoldApart(run) {
  if (!run.proposals.length) return missing('the Gap ⿻')
  return run.proposals.map(p => {
    let hash
    if (p.hashState === 'MATCH') {
      hash = `<div class="hashbox match"><span class="badge match">MATCH ✓</span>
<p>The witnesses provably derive from the proposal's own bytes. soulbae could not have known them.</p>
${kv([['recorded seedHex (gap.json)', p.recorded], ['derived sha256(proposal_canon.json), computed at render time', p.derived]])}</div>`
    } else if (p.hashState === 'MISMATCH') {
      hash = `<div class="hashbox mismatch"><span class="badge mismatch">MISMATCH — ROUND VOID ⚠</span>
<p><strong>The recorded seed does not reproduce from the saved bytes.</strong> Either the canon file was altered after the draw, or the draw was not seeded from it. Witnesses of unknown origin validate nothing: treat every verdict on this proposal as void and the round as BLOCKED (GR-4).</p>
${kv([['recorded seedHex (gap.json)', p.recorded], ['derived sha256(proposal_canon.json), computed at render time', p.derived]])}</div>`
    } else {
      hash = `<div class="hashbox incomplete"><span class="badge other">CANNOT RE-DERIVE</span>
${kv([['recorded seedHex', p.recorded || '(gap.json missing or seedHex absent)'], ['derived sha256', p.derived || '(proposal_canon.json missing — the auditor has nothing to hash)']])}
<p>Without both sides there is no proof the Gap was held apart. The reference assay returns BLOCKED here.</p></div>`
    }
    const draw = p.gap && !p.gap.__unparseable && p.gap.draw ? `<details><summary>the draw (questions + expected answers)</summary>${mono(typeof p.gap.draw === 'string' ? p.gap.draw : JSON.stringify(p.gap.draw, null, 2))}</details>` : ''
    const transcript = p.gap && !p.gap.__unparseable && p.gap.transcript ? `<details><summary>transcript (third-party re-derivable)</summary>${mono(p.gap.transcript)}</details>` : ''
    return `<div class="card"><h4>${esc(p.name)}</h4>${hash}${draw}${transcript}</div>`
  }).join('\n')
}

function renderAssay(run) {
  if (!run.proposals.length) return missing('soulbis ⚔️')
  return run.proposals.map(p => {
    if (!p.verdict) return `<div class="card"><h4>${esc(p.name)}</h4>${missing('verdict.json')}</div>`
    if (p.verdict.__unparseable) return `<div class="card"><h4>${esc(p.name)}</h4><p class="missing">verdict.json unparseable.</p>${mono(p.verdict.__raw)}</div>`
    const v = p.verdict
    return `<div class="card"><h4>${esc(p.name)} ${chip(v.status)}</h4>` + kv([
      ['leverId', v.leverId], ['metric', v.metric], ['gateResult', v.gateResult],
      ['failingCheck', v.failingCheck], ['scratchDir', v.scratchDir],
      ['candidate.md', p.candidateExists ? 'present' : 'missing'],
    ]) + (v.evidence ? `<details><summary>evidence</summary>${mono(v.evidence)}</details>` : '') + '</div>'
  }).join('\n')
}

function renderCritic(run) {
  if (!run.critic) return '<p class="note">no critic.json — the reference engine returns the critic\'s classification to the orchestrator without persisting it; the chronicle draft carries the round\'s reading.</p>'
  if (run.critic.__unparseable) return '<p class="missing">critic.json unparseable.</p>' + mono(run.critic.__raw)
  const rows = (run.critic.classifications || []).map(c => `<tr><td>${esc(c.leverId)}</td><td>${esc(c.class)}</td><td>${esc(c.why)}</td></tr>`).join('')
  return (rows ? `<table><tr><th>lever</th><th>class</th><th>why</th></tr>${rows}</table>` : '') +
    (run.critic.nextLead ? `<p><strong>next lead:</strong> ${esc(run.critic.nextLead)}</p>` : '')
}

function renderChronicle(run) {
  if (!run.chronicles.length) return missing('chronicle draft (a session without a chronicle is unfinished, GR-7)')
  return run.chronicles.map(c => `<div class="card"><h4>${esc(c.name)} <span class="chip other">DRAFT — keystone reviews and files</span></h4>${mono(c.text, 12000)}</div>`).join('\n')
}

// ---- page ----
function renderPage(run) {
  const frontier = readJson(join(instanceDir, 'frontier.json'))
  const configExists = existsSync(join(instanceDir, 'harness.config.mjs'))
  const anyMismatch = run.proposals.some(p => p.hashState === 'MISMATCH')
  const tally = { VALIDATED: 0, MIRAGE: 0, BLOCKED: 0, other: 0 }
  for (const p of run.proposals) {
    const s = p.verdict && !p.verdict.__unparseable ? p.verdict.status : null
    tally[s in CHIP_CLASS ? s : 'other'] += 1
  }

  const phases = [
    ['Measure', 'frontier numbers only, no advocacy', renderMeasure(run, frontier)],
    ['Propose', 'soulbae 🧙 (bnot) — blind lenses in parallel', renderPropose(run)],
    ['Hold-apart', 'the Gap ⿻ (xor) — hash the proposal, derive the witnesses', renderHoldApart(run)],
    ['Assay', 'soulbis ⚔️ (neg) — the full gate, VALIDATED / MIRAGE / BLOCKED', renderAssay(run)],
    ['Critic', 'classifies the whole round: structural / probe-limited / noise', renderCritic(run)],
    ['Chronicle', 'drafts the record — verdict first', renderChronicle(run)],
  ]

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>run ${esc(run.runId)} — dual-agent harness</title>
<style>
  :root { --bg:#0d1117; --panel:#161b22; --edge:#30363d; --ink:#c9d1d9; --dim:#8b949e;
          --green:#3fb950; --amber:#d29922; --red:#f85149; --grey:#8b949e; --accent:#a5b4fc; }
  * { box-sizing: border-box; }
  body { margin:0; padding:2rem 1rem 4rem; background:var(--bg); color:var(--ink);
         font:15px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; }
  main { max-width: 60rem; margin: 0 auto; }
  h1 { font-size:1.3rem; margin:0 0 .3rem; } h4 { margin:0 0 .5rem; font-size:1rem; }
  a { color: var(--accent); }
  .inscription { color:var(--accent); letter-spacing:.03em; margin:.2rem 0 .8rem; }
  .disclaimer { border:1px solid var(--edge); border-left:3px solid var(--grey); background:var(--panel);
                color:var(--dim); padding:.6rem .9rem; margin:0 0 1.4rem; font-size:.85rem; }
  .voidbanner { border:2px solid var(--red); background:#3d1418; color:#ffb3ad; padding:.9rem 1rem;
                margin:0 0 1.4rem; font-weight:bold; }
  section.phase { border:1px solid var(--edge); border-radius:6px; background:var(--panel);
                  margin:0 0 1rem; padding:1rem 1.2rem; }
  section.phase > h2 { margin:0 0 .15rem; font-size:1.05rem; }
  section.phase > p.mandate { margin:0 0 .9rem; color:var(--dim); font-size:.85rem; }
  .arrow { text-align:center; color:var(--dim); margin:-.4rem 0 .6rem; }
  .card { border:1px solid var(--edge); border-radius:6px; padding: .8rem 1rem; margin:0 0 .8rem; background:var(--bg); }
  .chip { display:inline-block; padding:.05rem .55rem; border-radius:999px; font-size:.75rem;
          font-weight:bold; vertical-align:middle; border:1px solid; }
  .chip.validated { color:var(--green); border-color:var(--green); background:#12261a; }
  .chip.mirage    { color:var(--amber); border-color:var(--amber); background:#2b2211; }
  .chip.blocked   { color:var(--red);   border-color:var(--red);   background:#3d1418; }
  .chip.other     { color:var(--grey);  border-color:var(--grey);  background:#1c2128; }
  .badge { display:inline-block; padding:.1rem .6rem; font-weight:bold; border-radius:4px; margin-bottom:.4rem; }
  .badge.match    { background:#12261a; color:var(--green); border:1px solid var(--green); }
  .badge.mismatch { background:var(--red); color:#fff; }
  .badge.other    { background:#1c2128; color:var(--grey); border:1px solid var(--grey); }
  .hashbox { border-radius:6px; padding:.6rem .8rem; margin:0 0 .6rem; border:1px solid var(--edge); }
  .hashbox.match { border-color:var(--green); } .hashbox.incomplete { border-color:var(--grey); }
  .hashbox.mismatch { border:2px solid var(--red); background:#2a0e11; }
  dl { display:grid; grid-template-columns:max-content 1fr; gap:.15rem .9rem; margin:.4rem 0; }
  dt { color:var(--dim); } dd { margin:0; overflow-wrap:anywhere; }
  pre { background:#0a0d12; border:1px solid var(--edge); border-radius:6px; padding:.7rem .9rem;
        overflow-x:auto; white-space:pre-wrap; overflow-wrap:anywhere; font-size:.82rem; margin:.4rem 0; }
  details { margin:.4rem 0; } summary { cursor:pointer; color:var(--dim); }
  table { border-collapse:collapse; width:100%; font-size:.85rem; }
  th, td { border:1px solid var(--edge); padding:.35rem .6rem; text-align:left; vertical-align:top; }
  th { color:var(--dim); font-weight:normal; }
  .missing { color:var(--dim); font-style:italic; } .note { color:var(--dim); font-size:.85rem; }
  .delta { color:var(--accent); }
  .tally .chip { margin-right:.4rem; }
  footer { color:var(--dim); font-size:.8rem; margin-top:2rem; border-top:1px solid var(--edge); padding-top:.8rem; }
</style></head><body><main>
<h1>run ${esc(run.runId)} · ${esc(basename(instanceDir))}</h1>
<p class="inscription">${esc(INSCRIPTION)}</p>
<p class="disclaimer">generated projection — never hand-edited, never authoritative; the run directory is the record.
Rendered ${esc(new Date().toISOString())} by tools/render_run.mjs from <code>${esc(run.runDir.replace(/\\/g, '/'))}</code>.
Re-derive anything you care about from the files themselves.</p>
${anyMismatch ? `<div class="voidbanner">⚠ HASH MISMATCH — a recorded Gap seed does not reproduce from the saved proposal bytes. The held-apart property is unproven for this run; treat its verdicts as void (GR-4). Details in the Hold-apart phase below.</div>` : ''}
<p class="tally">${run.proposals.length} proposal(s) · ${chip('VALIDATED')} ${tally.VALIDATED} ${chip('MIRAGE')} ${tally.MIRAGE} ${chip('BLOCKED')} ${tally.BLOCKED} <span class="chip other">NO VERDICT</span> ${tally.other}</p>
${phases.map(([name, mandate, body], i) => (i ? '<div class="arrow">▼</div>' : '') +
    `<section class="phase"><h2>${i + 1} · ${esc(name)}</h2><p class="mandate">${esc(mandate)}</p>${body}</section>`).join('\n')}
<footer>
<p>Conformance (G0): ${configExists ? '<code>harness.config.mjs</code> present at the instance root' : '<strong>harness.config.mjs NOT FOUND at the instance root</strong>'} —
this page does not run the gate; run it yourself: <code>node engine/conform.mjs ${esc(instArg)}</code>.
The gate proves <code>${esc(INSCRIPTION)}</code> on Z/64Z every time rather than taking it on faith.</p>
<p>The frontier does not move here. Folding is the keystone's; the door is the First Person's (T6/GR-8).</p>
</footer>
</main></body></html>
`
}

// ---- main: pure read, one write per run ----
const runIds = runArg === '--all'
  ? readdirSync(runsDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name)
  : [runArg]
if (!runIds.length) { console.error(`no runs found under ${runsDir}`); process.exit(1) }

for (const runId of runIds) {
  const runDir = join(runsDir, runId)
  if (!existsSync(runDir) || !statSync(runDir).isDirectory()) { console.error(`no such run: ${runDir}`); process.exit(1) }
  const run = gatherRun(runId)
  const outPath = join(runDir, 'run.html')
  writeFileSync(outPath, renderPage(run))
  const voided = run.proposals.filter(p => p.hashState === 'MISMATCH').length
  console.log(`rendered ${runId} -> ${outPath} (${run.proposals.length} proposal(s)${voided ? `, ${voided} HASH MISMATCH — VOID` : ''})`)
}
