// gen_aggregate.mjs — one aggregated reader: overview + findings, a section per
// source document (self / Forge / Naming / Star), and the OpenServ note.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
const RUNS = new URL('./', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const H = 'C:/Users/mitch/dual-agent-harness/'
const SC = 'C:/Users/mitch/AppData/Local/Temp/claude/C--Users-mitch/2c59dc2f-9548-41be-a975-8c3e4565d723/scratchpad/'
const { meta, runs, pricing } = JSON.parse(readFileSync(RUNS + 'results.json', 'utf8'))
const letter = readFileSync(RUNS + 'letter.md', 'utf8').trim()
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const disp = m => (pricing[String(m).replace(/^serv:/, '').replace(/-serv-.*$/, '')]?.display) || String(m).replace(/^serv:/, '')
const wc = t => String(t).trim().split(/\s+/).filter(Boolean).length
function inline(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<em>$1</em>') }
function md(src) {
  const L = String(src).split('\n'); const o = []; let i = 0
  while (i < L.length) { let l = L[i]
    if (/^```/.test(l)) { const b = []; i++; while (i < L.length && !/^```/.test(L[i])) b.push(L[i++]); i++; o.push('<pre><code>' + esc(b.join('\n')) + '</code></pre>'); continue }
    if (/^#{1,6}\s/.test(l)) { const n = l.match(/^#+/)[0].length; o.push(`<h${n}>${inline(l.replace(/^#+\s/, ''))}</h${n}>`); i++; continue }
    if (/^---+\s*$/.test(l)) { o.push('<hr>'); i++; continue }
    if (/^\s*[-*]\s/.test(l)) { const b = []; while (i < L.length && /^\s*[-*]\s/.test(L[i])) b.push('<li>' + inline(L[i++].replace(/^\s*[-*]\s/, '')) + '</li>'); o.push('<ul>' + b.join('') + '</ul>'); continue }
    if (/^>\s?/.test(l)) { o.push('<blockquote>' + inline(l.replace(/^>\s?/, '')) + '</blockquote>'); i++; continue }
    if (/^\s*$/.test(l)) { i++; continue }
    const b = []; while (i < L.length && !/^\s*$/.test(L[i]) && !/^```/.test(L[i]) && !/^#{1,6}\s/.test(L[i]) && !/^\s*[-*]\s/.test(L[i])) b.push(L[i++]); o.push('<p>' + inline(b.join(' ')) + '</p>') }
  return o.join('\n')
}
const vtxt = v => v ? `${v.status} ${v.gateResult || ''}`.trim() : '—'
const vcls = v => v ? (v.status === 'VALIDATED' ? 'ok' : v.status === 'MIRAGE' ? 'mir' : 'blk') : ''

// verdict table for an instance (rows = models, cols = the two proposals in dir order)
function verdictTable(inst, p1label, p2label) {
  const rs = runs.filter(r => r.instance === inst && String(r.model).startsWith('serv:'))
  const bm = {}; for (const r of rs) { bm[r.baseModel] = bm[r.baseModel] || {}; bm[r.baseModel][r.arm] = r }
  const rows = Object.keys(bm).map(m => { const s = bm[m].serv || bm[m].raw; const v = s.verdicts
    return `<tr><td><b>${esc(disp(m))}</b></td><td class="${vcls(v[0])}">${vtxt(v[0])}</td><td class="${vcls(v[1])}">${vtxt(v[1])}</td><td class="num">$${(s.costUSD || 0).toFixed(4)}</td></tr>` }).join('\n')
  return `<div class="panel"><table><tr><th>Model (as prover)</th><th>${p1label}</th><th>${p2label}</th><th>Spend</th></tr>${rows || '<tr><td colspan=4 class=dim>run pending</td></tr>'}</table></div>`
}
// a document reader: original + candidates as inner tabs (unique id prefix)
function docReader(id, srcPath, cands) {
  const src = existsSync(srcPath) ? readFileSync(srcPath, 'utf8') : '(source not found)'
  const tabs = [['Original · ' + wc(src) + 'w', md(src)]]
  for (const c of cands) { const t = existsSync(c.file) ? readFileSync(c.file, 'utf8') : '(candidate not found)'; tabs.push([`${c.label} · ${wc(t)}w`, (c.note ? `<p class="dim">${esc(c.note)}</p>` : '') + md(t)]) }
  const btns = tabs.map((t, n) => `<button role="tab" aria-selected="${n === 0}" onclick="pick('${id}',${n},this)">${esc(t[0])}</button>`).join('')
  const panes = tabs.map((t, n) => `<div class="doc" id="${id}-${n}"${n ? ' hidden' : ''}>${t[1]}</div>`).join('\n')
  return `<div class="tabs" role="tablist">${btns}</div>${panes}`
}

const self = runs.filter(r => r.instance === 'self' && String(r.model).startsWith('serv:'))
const zk = runs.filter(r => r.instance === 'zk-tale-5')
const mn = runs.filter(r => r.instance === 'mage-naming')
const ms = runs.filter(r => r.instance === 'mage-star')
const SRC = ['self', 'zk-tale-5', 'mage-naming', 'mage-star']
const allValidated = runs.filter(r => SRC.includes(r.instance) && r.verdicts.some(v => v.status === 'VALIDATED')).length
const totalCost = runs.filter(r => SRC.includes(r.instance)).reduce((a, r) => a + (r.costUSD || 0), 0)
const totalRuns = self.length + zk.length + mn.length + ms.length
const totalModels = new Set(runs.filter(r => String(r.model).startsWith('serv:')).map(r => r.baseModel)).size

// self eleven-model table (original two proposals)
const sBase = self.filter(r => !r.clean && !r.injected && !['shadow', 'kronos', 'multipath'].includes(r.arm))
const sByModel = {}; for (const r of sBase) { sByModel[r.baseModel] = sByModel[r.baseModel] || {}; sByModel[r.baseModel][r.arm] = r }
const sRows = Object.keys(sByModel).sort((a, b) => (sByModel[a].serv?.verdicts.filter(v => v.status === 'VALIDATED').length || 0) - (sByModel[b].serv?.verdicts.filter(v => v.status === 'VALIDATED').length || 0)).map(m => {
  const s = sByModel[m].serv; return `<tr><td><b>${esc(disp(m))}</b></td><td class="${vcls(s.verdicts.find(v => /trim|line-edit/.test(v.leverId)))}">${vtxt(s.verdicts.find(v => /trim|line-edit/.test(v.leverId)))}</td><td class="${vcls(s.verdicts.find(v => /merge|restructure/.test(v.leverId)))}">${vtxt(s.verdicts.find(v => /merge|restructure/.test(v.leverId)))}</td><td class="num">$${(s.costUSD || 0).toFixed(4)}</td></tr>` }).join('\n')
const clean = self.filter(r => r.clean).sort((a, b) => a.runId.localeCompare(b.runId))
const cleanRows = clean.map(r => `<tr><td><b>${esc(disp(r.model))}</b></td><td>${r.verdicts.map(v => `<span class="${vcls(v)}">${vtxt(v)}</span>`).join(' · ')}</td></tr>`).join('\n')

// ---- Overview chart: verdict mix per model, across all four documents ----
// Status palette (reserved): Validated=good, Mirage=warning, Blocked=serious.
// Direct count labels + legend, so identity is never colour-alone (CVD-safe).
const tally = {}
for (const r of runs) { if (!SRC.includes(r.instance) || !String(r.model).startsWith('serv:')) continue
  const k = r.baseModel; tally[k] = tally[k] || { V: 0, M: 0, B: 0 }
  for (const v of r.verdicts) tally[k][v.status === 'VALIDATED' ? 'V' : v.status === 'MIRAGE' ? 'M' : 'B']++ }
const chartRows = Object.entries(tally).map(([m, t]) => ({ m, ...t, total: t.V + t.M + t.B }))
  .sort((a, b) => b.V - a.V || b.total - a.total)
const maxTot = Math.max(...chartRows.map(r => r.total), 1)
const CH = { w: 640, labelW: 132, rowH: 26, gap: 9, barMax: 640 - 132 - 46 }
const chartH = chartRows.length * (CH.rowH + CH.gap) + 8
const seg = (x, w, fill, count, label, model) => w <= 0 ? '' :
  `<rect x="${x.toFixed(1)}" y="0" width="${Math.max(0, w - 2).toFixed(1)}" height="18" rx="3" fill="${fill}"><title>${esc(model)} — ${count} ${label}</title></rect>` +
  (w >= 20 ? `<text x="${(x + (w - 2) / 2).toFixed(1)}" y="13" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">${count}</text>` : '')
const svgRows = chartRows.map((r, i) => {
  const y = i * (CH.rowH + CH.gap)
  const u = CH.barMax / maxTot
  const wV = r.V * u, wM = r.M * u, wB = r.B * u
  return `<g transform="translate(0,${y})">
    <text x="${CH.labelW - 8}" y="13" text-anchor="end" font-size="12" fill="var(--ink)">${esc(disp(r.m))}</text>
    <g transform="translate(${CH.labelW},0)">
      ${seg(0, wV, 'var(--ok)', r.V, 'validated', disp(r.m))}
      ${seg(wV, wM, 'var(--mir)', r.M, 'mirage', disp(r.m))}
      ${seg(wV + wM, wB, 'var(--blk)', r.B, 'blocked', disp(r.m))}
      <text x="${(wV + wM + wB + 6).toFixed(1)}" y="13" font-size="11" fill="var(--mut)">${r.total}</text>
    </g></g>`
}).join('\n')
const chart = `<figure class="chart">
  <figcaption>Verdicts by model, across all four documents <span class="dim">— ordered by validated wins; each run contributes up to two verdicts</span></figcaption>
  <div class="legend"><span><span class="sw" style="background:var(--ok)"></span>Validated</span><span><span class="sw" style="background:var(--mir)"></span>Mirage</span><span><span class="sw" style="background:var(--blk)"></span>Blocked</span></div>
  <svg viewBox="0 0 ${CH.w} ${chartH}" width="100%" role="img" aria-label="Stacked bar chart of verdicts per model">${svgRows}</svg>
</figure>`

const letterHtml = esc(letter).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')

const html = `<title>The harness, read across four documents</title>
<style>
:root{--bg:#fbfaf7;--panel:#fff;--ink:#1a1c22;--mut:#5b6070;--line:#e7e4dc;--ok:#2e7d54;--mir:#b26b1f;--blk:#a33;--accent:#3b6ea5;}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--blk:#e07a7a;--accent:#6ea3d8;}}
:root[data-theme=dark]{--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--blk:#e07a7a;--accent:#6ea3d8;}
*{box-sizing:border-box;}body{background:var(--bg);color:var(--ink);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif;}
.wrap{max-width:840px;margin:0 auto;padding-block:32px;padding-left:20px;padding-right:20px;}
.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--mut);margin:0 0 6px;}
h1{font:600 27px/1.15 Georgia,serif;margin:0 0 8px;}h2{font:600 19px/1.2 Georgia,serif;margin:26px 0 6px;}h3{font:600 15px/1.2 Georgia,serif;margin:18px 0 4px;}
.lede{color:var(--mut);max-width:66ch;}.dim{color:var(--mut);font-size:12.5px;}
.nav{display:flex;gap:6px;flex-wrap:wrap;margin:20px 0 4px;position:sticky;top:0;background:var(--bg);padding:8px 0;z-index:5;border-bottom:1px solid var(--line);}
.nav button{font:inherit;font-size:13px;padding:7px 12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:8px;cursor:pointer;}
.nav button[aria-selected=true]{background:var(--accent);color:#fff;border-color:var(--accent);}
section.view[hidden]{display:none;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:18px 0;}
.chart{margin:18px 0 6px;background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:14px 16px;}
.chart figcaption{font:600 14px/1.3 Georgia,serif;margin-bottom:6px;}
.chart .legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--mut);margin:2px 0 10px;}
.chart .sw{display:inline-block;width:11px;height:11px;border-radius:3px;vertical-align:-1px;margin-right:5px;}
.chart svg{max-width:100%;height:auto;}
.verdicts{display:grid;gap:8px;margin:8px 0 4px;}
.vd{display:flex;gap:12px;align-items:flex-start;background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:10px 13px;}
.vd p{margin:0;font-size:13.5px;}
.chip{flex:0 0 auto;display:inline-block;font-size:11px;padding:3px 9px;border-radius:20px;border:1px solid;white-space:nowrap;margin-top:2px;}
.chip.ok{color:var(--ok);border-color:var(--ok);}.chip.mir{color:var(--mir);border-color:var(--mir);}.chip.blk{color:var(--blk);border-color:var(--blk);}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:12px 13px;}.stat .n{font:600 21px/1 Georgia,serif;}.stat .l{font-size:11px;color:var(--mut);margin-top:5px;}
.f{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px 15px 12px 42px;position:relative;margin:8px 0;font-size:14px;}
.f .k{position:absolute;left:13px;top:12px;width:20px;height:20px;border-radius:50%;background:var(--accent);color:#fff;font:600 12px/20px sans-serif;text-align:center;}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:4px 2px;margin:12px 0;overflow-x:auto;}
table{border-collapse:collapse;width:100%;font-size:13.5px;}th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);}th{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);}
td.num{font-variant-numeric:tabular-nums;}.ok{color:var(--ok);font-weight:600;}.mir{color:var(--mir);font-weight:600;}.blk{color:var(--blk);font-weight:600;}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 0;}
.tabs button{font:inherit;font-size:13px;padding:6px 12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:8px 8px 0 0;cursor:pointer;border-bottom:none;}
.tabs button[aria-selected=true]{background:var(--accent);color:#fff;border-color:var(--accent);}
.doc{background:var(--panel);border:1px solid var(--line);border-radius:0 11px 11px 11px;padding:18px 22px;}
.doc pre{background:var(--line);padding:12px 14px;border-radius:8px;overflow-x:auto;font-size:12.5px;}.doc :not(pre)>code{background:var(--line);padding:1px 5px;border-radius:4px;}.doc blockquote{border-left:3px solid var(--accent);margin:10px 0;padding:2px 14px;color:var(--mut);font-style:italic;}.doc hr{border:none;border-top:1px solid var(--line);margin:14px 0;}
.note{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:8px;padding:15px 17px;}.note p{margin:0 0 10px;}.note p:last-child{margin:0;}
code{font-family:"SF Mono",Consolas,monospace;font-size:12.5px;}
.foot{color:var(--mut);font-size:11.5px;margin-top:26px;border-top:1px solid var(--line);padding-top:12px;}
</style>
<div class="wrap">
<p class="eyebrow">agentprivacy dual-agent harness · SERV Reasoning · a reader</p>
<h1>One harness, three documents, eleven models</h1>
<p class="lede">A proposer proposes a shorter telling; a prover checks it against a held-out gate it cannot tune to. Here the prover seat is held by an inference API — SERV — across many models, on three documents from the agentprivacy ecosystem. Read the tellings, see how each model judged them, and read the note for the team who make the reasoning layer.</p>

<nav class="nav" role="tablist">
<button role="tab" aria-selected="true" onclick="view('ov',this)">Overview</button>
<button role="tab" aria-selected="false" onclick="view('self',this)">The harness doc</button>
<button role="tab" aria-selected="false" onclick="view('zk',this)">The Constraint Forge</button>
<button role="tab" aria-selected="false" onclick="view('mn',this)">The Naming Ceremony</button>
<button role="tab" aria-selected="false" onclick="view('ms',this)">The Eight-Pointed Star</button>
<button role="tab" aria-selected="false" onclick="view('os',this)">For OpenServ</button>
</nav>

<section class="view" id="view-ov">
<div class="grid">
<div class="stat"><div class="n">4</div><div class="l">source documents</div></div>
<div class="stat"><div class="n">${totalRuns}</div><div class="l">verification runs</div></div>
<div class="stat"><div class="n">${totalModels}</div><div class="l">models</div></div>
<div class="stat"><div class="n">$${totalCost.toFixed(2)}</div><div class="l">total spend</div></div>
<div class="stat"><div class="n">${allValidated}</div><div class="l">runs with a validated win</div></div>
</div>
${chart}
<h2>What a verdict means</h2>
<div class="verdicts">
<div class="vd"><span class="chip ok">Validated</span><p>The shorter telling passed the <b>whole</b> gate: every required string is still present (the code census) <b>and</b> the prover judged it still reads as the document it must remain. A real, bankable improvement — it also has to beat the current record.</p></div>
<div class="vd"><span class="chip mir">Mirage</span><p>It looked like a win — it was shorter — but failed the gate: it dropped a required string, or the prover judged it no longer does the document's job. The improvement was an illusion; folding it would quietly lose something. Catching these is the harness working, not failing.</p></div>
<div class="vd"><span class="chip blk">Blocked</span><p>No usable verdict was produced — the prover refused or could not complete the check (for example a guarded round, or a gate it had no tool to run). The round records no pass; nothing is banked.</p></div>
</div>
<h2>What the runs show</h2>
<div class="f"><span class="k">1</span><b>The code census is model-independent.</b> On every document, a proposal that drops a required string is caught at the same census count by every model. The part of the gate that is code does not depend on who proves.</div>
<div class="f"><span class="k">2</span><b>The judgment seat tracks the model — and the document.</b> When a candidate keeps every string, the un-codeable call (does the shorter text still teach) splits by model; and the same model can judge one document's fold valid and another's a mirage, because a denser document has a stricter constraint.</div>
<div class="f"><span class="k">3</span><b>It catches mirages and banks real wins.</b> Conservative edits that keep every string validate on the capable judges; a dropped word is a mirage on all of them; the strictest model errs toward refusal.</div>
<div class="f"><span class="k">4</span><b>The layer changes cost, not the verdict; and PromptGuard caught an injection.</b> On/off reached the same verdicts; the guard refused a benign injection-shaped line — and blocked the round with it.</div>
<h2>The shape, in one line</h2>
<p>It is a zero-knowledge proof turned inside out: the agent that proposes is the untrusted claimant, the agent that proves is the check, and a Fiat-Shamir challenge drawn from the sealed proposal keeps the claimant from ever tuning to the gate.</p>
</section>

<section class="view" id="view-self" hidden>
<h2>The harness's own newcomer document</h2>
<p class="dim">Two fixed proposals — a line-edit that drops one required word, and a restructure that keeps all 95 — judged by eleven models. Verdicts: line-editor · restructurer.</p>
<div class="panel"><table><tr><th>Model (as prover)</th><th>line-editor</th><th>restructurer</th><th>Spend</th></tr>${sRows}</table></div>
<h3>A banked win — a conservative edit that holds</h3>
<p class="dim">A line-edit that cut one sentence of glue (still 95/95 by code) and the restructure, judged again. It beats the prior record on the capable judges.</p>
<div class="panel"><table><tr><th>Model (as prover)</th><th>Verdicts: 1061 edit · 1046 restructure</th></tr>${cleanRows}</table></div>
</section>

<section class="view" id="view-zk" hidden>
<h2>The Constraint Forge — Zero Knowledge Spellbook, Tale 5</h2>
<p class="dim">A tale about R1CS, gates and constraints — proving itself. Two blind compressions, judged against an 85-string census. Read all three tellings.</p>
${verdictTable('zk-tale-5', 'line-edited · 1035w', 'restructured · 1018w')}
${docReader('zk', H + 'examples/zk-tale-5/artifact/FORGE.md', [
  { label: 'Line-edited', file: SC + 'zk_candidate_line-editor.md', note: 'Sentence-level compression, blind to the census.' },
  { label: 'Restructured', file: SC + 'zk_candidate_restructurer.md', note: 'Structure-level compression, blind to the census.' },
])}
</section>

<section class="view" id="view-mn" hidden>
<h2>The Naming Ceremony — City of Mages, Tome IV Act IV</h2>
<p class="dim">A City act: a Sovereign arrives at V63 by a bilateral rite. Two blind compressions, judged against a 62-string census. Read all three tellings.</p>
${verdictTable('mage-naming', 'line-edited · 1047w', 'restructured · 1048w')}
${docReader('mn', H + 'examples/mage-naming/artifact/NAMING.md', [
  { label: 'Line-edited', file: SC + 'mn_candidate_line-editor.md', note: 'Sentence-level compression, blind to the census.' },
  { label: 'Restructured', file: SC + 'mn_candidate_restructurer.md', note: 'Structure-level compression, blind to the census.' },
])}
</section>

<section class="view" id="view-ms" hidden>
<h2>The Eight-Pointed Star — City of Mages, Tome VIII Act 3</h2>
<p class="dim">The act about the harness's own geometry: the Swordsman's <code>neg</code> tetrahedron and the Mage's <code>bnot</code> tetrahedron crossing at the gap — the stella octangula, from which the City Key is forged. Two blind compressions, judged against a ${(runs.find(r=>r.instance==='mage-star')?'57':'57')}-string census.</p>
${verdictTable('mage-star', 'line-edited', 'restructured')}
${docReader('ms', H + 'examples/mage-star/artifact/STAR.md', [
  { label: 'Line-edited', file: SC + 'ms_candidate_line-editor.md', note: 'Sentence-level compression, blind to the census.' },
  { label: 'Restructured', file: SC + 'ms_candidate_restructurer.md', note: 'Structure-level compression, blind to the census.' },
])}
</section>

<section class="view" id="view-os" hidden>
<h2>A note for the OpenServ team</h2>
<div class="note"><p>${letterHtml}</p></div>
<h3>Portability notes</h3>
<p class="dim">Four things an SDK-swap customer hits, found live and handled in the driver: <code>gpt-5.4-nano</code> wants <code>max_completion_tokens</code>; strict <code>json_schema</code> needs objects closed and every property required; <code>claude-sonnet-5</code> rejects <code>temperature</code>; Anthropic strict mode rejects a nullable enum OpenAI accepts.</p>
</section>

<p class="foot">Generated ${meta.generated.slice(0, 10)} from <code>examples/self/runs/results.json</code>. Instances: self (95-string census), zk-tale-5 (85), mage-naming (62); each gate = a code census plus a model-judged hard constraint, runnable by a text-only prover. Harness: github.com/mitchuski/agentprivacy-harness.</p>
</div>
<script>
function view(id,btn){for(const s of document.querySelectorAll('section.view'))s.hidden=(s.id!=='view-'+id);for(const b of btn.parentNode.children)b.setAttribute('aria-selected',b===btn);window.scrollTo(0,0);}
function pick(g,n,btn){let i=0;while(document.getElementById(g+'-'+i)){document.getElementById(g+'-'+i).hidden=(i!==n);i++;}for(const b of btn.parentNode.children)b.setAttribute('aria-selected',b===btn);}
</script>`
writeFileSync(RUNS + 'harness-serv-reader.html', html)
console.log('serv reader:', (html.length / 1024).toFixed(1) + ' KB; self', self.length, 'zk', zk.length, 'mn', mn.length, 'ms', ms.length, 'validated', allValidated, 'cost $' + totalCost.toFixed(2))
