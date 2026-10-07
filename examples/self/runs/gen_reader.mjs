// gen_reader.mjs — a standalone reader for the Zero Knowledge Spellbook run:
// the tale, its two compressions, and how each model judged them.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
const RUNS = new URL('./', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const HARNESS = 'C:/Users/mitch/dual-agent-harness/'
const SCRATCH = 'C:/Users/mitch/AppData/Local/Temp/claude/C--Users-mitch/2c59dc2f-9548-41be-a975-8c3e4565d723/scratchpad/'
const { meta, runs, pricing } = JSON.parse(readFileSync(RUNS + 'results.json', 'utf8'))
const disp = (m) => (pricing[String(m).replace(/^serv:/, '').replace(/-serv-.*$/, '')]?.display) || String(m).replace(/^serv:/, '')
const zk = runs.filter(r => r.instance === 'zk-tale-5' && String(r.model).startsWith('serv:'))
const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

// minimal, safe markdown → html (headings, fenced code, bold, hr, lists, blockquote, paragraphs)
function md(src) {
  const lines = String(src).split('\n'); const out = []; let i = 0
  while (i < lines.length) {
    let l = lines[i]
    if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>'); continue }
    if (/^#{1,6}\s/.test(l)) { const n = l.match(/^#+/)[0].length; out.push(`<h${n}>${inline(l.replace(/^#+\s/, ''))}</h${n}>`); i++; continue }
    if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue }
    if (/^\s*[-*]\s/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) buf.push('<li>' + inline(lines[i++].replace(/^\s*[-*]\s/, '')) + '</li>'); out.push('<ul>' + buf.join('') + '</ul>'); continue }
    if (/^>\s?/.test(l)) { out.push('<blockquote>' + inline(l.replace(/^>\s?/, '')) + '</blockquote>'); i++; continue }
    if (/^\s*$/.test(l)) { i++; continue }
    const buf = []; while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^```/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) && !/^\s*[-*]\s/.test(lines[i])) buf.push(lines[i++]); out.push('<p>' + inline(buf.join(' ')) + '</p>')
  }
  return out.join('\n')
}
function inline(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<em>$1</em>') }

const source = readFileSync(HARNESS + 'examples/zk-tale-5/artifact/FORGE.md', 'utf8')
const cand = (lens) => existsSync(SCRATCH + `zk_candidate_${lens}.md`) ? readFileSync(SCRATCH + `zk_candidate_${lens}.md`, 'utf8') : '(candidate not found)'
const le = cand('line-editor'), re = cand('restructurer')
const wc = (t) => String(t).trim().split(/\s+/).filter(Boolean).length

// verdict table by model
const isRestruct = (v) => /merge|restructure/.test(v.leverId)
const isLineEdit = (v) => /tighten|line-edit/.test(v.leverId)
const vtxt = (v) => v ? `${v.status} ${v.gateResult || ''}`.trim() : '—'
const cls = (v) => v ? (v.status === 'VALIDATED' ? 'ok' : v.status === 'MIRAGE' ? 'mir' : 'blk') : ''
const serv = zk.filter(r => r.arm === 'serv' || r.arm === 'raw')
const byModel = {}; for (const r of serv) { byModel[r.baseModel] = byModel[r.baseModel] || {}; byModel[r.baseModel][r.arm] = r }
const rows = Object.keys(byModel).map(m => {
  const s = byModel[m].serv || byModel[m].raw
  const le = s.verdicts.find(isLineEdit), rv = s.verdicts.find(isRestruct)
  return `<tr><td><b>${esc(disp(m))}</b></td><td class="${cls(le)}">${vtxt(le)}</td><td class="${cls(rv)}">${vtxt(rv)}</td><td class="num">$${(s.costUSD || 0).toFixed(4)}</td></tr>`
}).join('\n')
const validated = zk.filter(r => r.verdicts.some(v => v.status === 'VALIDATED')).map(r => disp(r.model))

const html = `<title>The Constraint Forge — a harness reader</title>
<style>
:root{--bg:#fbfaf7;--panel:#fff;--ink:#1a1c22;--mut:#5b6070;--line:#e7e4dc;--ok:#2e7d54;--mir:#b26b1f;--blk:#a33;--accent:#6a4fb3;}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--blk:#e07a7a;--accent:#a98fe0;}}
:root[data-theme=dark]{--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--blk:#e07a7a;--accent:#a98fe0;}
*{box-sizing:border-box;}body{background:var(--bg);color:var(--ink);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif;}
.wrap{max-width:820px;margin:0 auto;padding-block:34px;padding-left:20px;padding-right:20px;}
.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--mut);margin:0 0 6px;}
h1{font:600 27px/1.15 Georgia,serif;margin:0 0 8px;}h2{font:600 18px/1.2 Georgia,serif;margin:30px 0 6px;}
.lede{color:var(--mut);max-width:66ch;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:20px 0;}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:12px 13px;}.stat .n{font:600 21px/1 Georgia,serif;}.stat .l{font-size:11px;color:var(--mut);margin-top:5px;}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:11px;padding:4px 2px;margin:12px 0;overflow-x:auto;}
table{border-collapse:collapse;width:100%;font-size:13.5px;}th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);}th{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);}
td.num{font-variant-numeric:tabular-nums;}.ok{color:var(--ok);font-weight:600;}.mir{color:var(--mir);font-weight:600;}.blk{color:var(--blk);font-weight:600;}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 0;}
.tabs button{font:inherit;font-size:13px;padding:7px 13px;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:8px 8px 0 0;cursor:pointer;border-bottom:none;}
.tabs button[aria-selected=true]{background:var(--accent);color:#fff;border-color:var(--accent);}
.doc{background:var(--panel);border:1px solid var(--line);border-radius:0 11px 11px 11px;padding:20px 24px;}
.doc h3,.doc h4{font-family:Georgia,serif;} .doc pre{background:var(--line);padding:12px 14px;border-radius:8px;overflow-x:auto;font-size:12.5px;} .doc code{font-family:"SF Mono",Consolas,monospace;font-size:.92em;} .doc pre code{background:none;} .doc blockquote{border-left:3px solid var(--accent);margin:10px 0;padding:2px 14px;color:var(--mut);font-style:italic;} .doc hr{border:none;border-top:1px solid var(--line);margin:16px 0;} .doc :not(pre)>code{background:var(--line);padding:1px 5px;border-radius:4px;}
.docmeta{font-size:12px;color:var(--mut);margin:0 0 10px;}
.foot{color:var(--mut);font-size:11.5px;margin-top:28px;border-top:1px solid var(--line);padding-top:12px;}code{font-family:"SF Mono",Consolas,monospace;}
</style>
<div class="wrap">
<p class="eyebrow">agentprivacy dual-agent harness · a reader</p>
<h1>The Constraint Forge, read three ways</h1>
<p class="lede">Tale 5 of the Zero Knowledge Spellbook, run through the harness: two agents proposed a shorter telling, and an inference API — SERV, across several models — held the prover seat that checks whether the shorter telling still carries the tale. The original and both compressions are here to read; the table shows how each model judged them against a code census of ${meta ? '85' : ''} strings the tale must keep.</p>

<div class="grid">
<div class="stat"><div class="n">${zk.length}</div><div class="l">SERV runs</div></div>
<div class="stat"><div class="n">1056→${Math.min(wc(le), wc(re))}</div><div class="l">words, best proposal</div></div>
<div class="stat"><div class="n">85</div><div class="l">census strings</div></div>
<div class="stat"><div class="n">${validated.length ? validated.join(', ') : '—'}</div><div class="l">validated a fold</div></div>
</div>

<h2>How each model judged the two compressions</h2>
<p class="docmeta">Line-edited = ${wc(le)} words · Restructured = ${wc(re)} words. Verdict is status and census (kept/85).</p>
<div class="panel"><table>
<tr><th>Model (as prover)</th><th>Line-edited (${wc(le)}w)</th><th>Restructured (${wc(re)}w)</th><th>Spend</th></tr>
${rows || '<tr><td colspan=4 class=docmeta>run pending</td></tr>'}
</table></div>

<h2>Read the tale</h2>
<div class="tabs" role="tablist">
<button role="tab" aria-selected="true" onclick="pick(0,this)">Original · 1056w</button>
<button role="tab" aria-selected="false" onclick="pick(1,this)">Line-edited · ${wc(le)}w</button>
<button role="tab" aria-selected="false" onclick="pick(2,this)">Restructured · ${wc(re)}w</button>
</div>
<div class="doc" id="doc0">${md(source)}</div>
<div class="doc" id="doc1" hidden><p class="docmeta">Sentence-level compression, blind to the census. Kept every name, term, number and code; cut connective prose.</p>${md(le)}</div>
<div class="doc" id="doc2" hidden><p class="docmeta">Structure-level compression, blind to the census. Merged duplicate speeches and folded one repeated block; kept all operative content.</p>${md(re)}</div>

<p class="foot">Instance <code>examples/zk-tale-5</code>: gate = an 85-string code census (<code>tools/check_forge.mjs</code>) plus a model-judged hard constraint — does the shorter tale still teach. The proposers were blind to the census. Every run replays offline with <code>verify_run.mjs</code>. The harness is a proving system with the roles mirrored: the proposer is the claimant, the prover-seat is the check. Generated ${meta.generated.slice(0, 10)}.</p>
</div>
<script>
function pick(n,btn){for(let i=0;i<3;i++)document.getElementById('doc'+i).hidden=(i!==n);for(const b of btn.parentNode.children)b.setAttribute('aria-selected', b===btn);}
</script>`
writeFileSync(RUNS + 'zk-forge-reader.html', html)
console.log('reader:', (html.length / 1024).toFixed(1) + ' KB;', Object.keys(byModel).length, 'model rows; validated:', validated.join(',') || 'none yet')
