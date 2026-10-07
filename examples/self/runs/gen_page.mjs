// gen_page.mjs — self-contained shareable HTML for the OpenServ team.
// Renders the SELF instance dataset: model split, on/off, features, injection, banked wins, letter.
import { readFileSync, writeFileSync } from 'node:fs'
const RUNS = new URL('./', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const { meta, runs, pricing } = JSON.parse(readFileSync(RUNS + 'results.json', 'utf8'))
const esc = (s) => String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const disp = (m) => (pricing[String(m).replace(/^serv:/, '').replace(/-serv-.*$/, '')]?.display) || String(m).replace(/^serv:/, '')
const self = runs.filter(r => r.instance === 'self' && String(r.model).startsWith('serv:'))
const chip = (v) => `<span class="chip ${v.status === 'VALIDATED' ? 'ok' : v.status === 'MIRAGE' ? 'mir' : 'blk'}" title="${esc(v.leverId)} — ${esc(v.failingCheck || v.status)}">${v.status} ${esc(v.gateResult || '')}</span>`
const chips = (vs) => vs.length ? vs.map(chip).join(' ') : '<span class="chip blk">guard refused · no verdict</span>'
const pct = (a, b) => b ? `${a > b ? '+' : ''}${((a / b - 1) * 100).toFixed(1)}%` : '—'

// base models: original two proposals, serv arm, with raw pair where present
const base = self.filter(r => !r.clean && !r.injected && !['shadow', 'kronos', 'multipath'].includes(r.arm))
const byModel = {}
for (const r of base) { byModel[r.baseModel] = byModel[r.baseModel] || {}; byModel[r.baseModel][r.arm] = r }
const modelOrder = Object.keys(byModel).sort((a, b) => {
  const sv = byModel[a].serv, tv = byModel[b].serv
  const va = (sv?.verdicts || []).filter(v => v.status === 'VALIDATED').length
  const vb = (tv?.verdicts || []).filter(v => v.status === 'VALIDATED').length
  return va - vb || (sv?.totPrompt || 0) - (tv?.totPrompt || 0)
})
const maxP = Math.max(...base.map(r => r.totPrompt), 1)
const modelRows = modelOrder.map(m => {
  const s = byModel[m].serv, raw = byModel[m].raw
  const over = raw ? s.totPrompt - raw.totPrompt : null
  return `<tr>
    <td class="model"><b>${esc(disp(m))}</b><span class="prov">${esc(s.provider || '')}</span></td>
    <td class="num">${s.totPrompt.toLocaleString()}<span class="bar"><span class="fill serv" style="width:${(s.totPrompt / maxP * 100).toFixed(1)}%"></span></span></td>
    <td class="num">${over == null ? '<span class=sub>no raw arm</span>' : '+' + over.toLocaleString() + ' <span class="sub">' + pct(s.totPrompt, raw.totPrompt) + '</span>'}</td>
    <td class="v">${chips(s.verdicts)}</td>
    <td class="num">$${(s.costUSD || 0).toFixed(4)}</td>
  </tr>`
}).join('\n')

const clean = self.filter(r => r.clean).sort((a, b) => a.runId.localeCompare(b.runId))
const cleanRows = clean.map(r => `<tr>
  <td><b>${esc(disp(r.model))}</b><span class="prov">${esc(r.provider || '')}</span></td>
  <td class="v">${chips(r.verdicts)}</td>
  <td class="num">$${(r.costUSD || 0).toFixed(4)}</td>
</tr>`).join('\n')

const feat = self.filter(r => ['shadow', 'kronos', 'multipath'].includes(r.arm))
const featLabel = { shadow: 'Shadow Agent', kronos: 'Kronos', multipath: 'Multipath' }
const featRows = feat.map(r => `<tr>
  <td><b>${esc(featLabel[r.arm])}</b><span class="prov">on ${esc(disp(r.model))}</span></td>
  <td class="num">${r.totPrompt.toLocaleString()} / ${r.totCompletion.toLocaleString()}</td>
  <td class="num">${r.ms != null ? (r.ms / 1000).toFixed(1) + ' s' : '—'}</td>
  <td class="v">${chips(r.verdicts)}</td>
</tr>`).join('\n')

const inj = self.filter(r => r.injected)
const injOrder = { raw: 0, serv: 1, guard: 2 }
const injRows = inj.sort((a, b) => (injOrder[a.arm] ?? 9) - (injOrder[b.arm] ?? 9)).map(r => {
  const label = r.arm === 'guard' ? 'PromptGuard on' : r.arm === 'raw' ? 'raw (layer off)' : 'SERV reasoning'
  return `<tr><td><b>${esc(label)}</b></td><td class="v">${chips(r.verdicts)}</td><td class="num">${r.totPrompt.toLocaleString()} / ${r.totCompletion.toLocaleString()}</td></tr>`
}).join('\n')

const letter = readFileSync(RUNS + 'letter.md', 'utf8')
const letterHtml = esc(letter).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')

const html = `<title>Harness × SERV — runtime tests</title>
<style>
:root { --bg:#fbfaf7; --panel:#fff; --ink:#1a1c22; --mut:#5b6070; --line:#e7e4dc; --serv:#3b6ea5; --ok:#2e7d54; --mir:#b26b1f; --blk:#a33; --accent:#3b6ea5; }
@media (prefers-color-scheme: dark){:root:not([data-theme=light]){--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--serv:#6ea3d8;--ok:#5cc088;--mir:#e0a95c;--blk:#e07a7a;--accent:#6ea3d8;}}
:root[data-theme=dark]{--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--serv:#6ea3d8;--ok:#5cc088;--mir:#e0a95c;--blk:#e07a7a;--accent:#6ea3d8;}
*{box-sizing:border-box;} body{background:var(--bg);color:var(--ink);font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif;}
.wrap{max-width:960px;margin:0 auto;padding-block:40px;padding-left:20px;padding-right:20px;}
.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:12px;color:var(--mut);margin:0 0 8px;}
h1{font:600 30px/1.15 Georgia,serif;margin:0 0 12px;} h2{font:600 20px/1.2 Georgia,serif;margin:38px 0 6px;}
.lede{font-size:17px;max-width:64ch;} .sub{display:block;font-size:12px;color:var(--mut);margin-top:2px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:22px 0;}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:14px 16px;} .stat .n{font:600 24px/1 Georgia,serif;} .stat .l{font-size:12px;color:var(--mut);margin-top:5px;}
.findings{display:grid;gap:10px;margin:24px 0 8px;} .find{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:13px 15px 13px 44px;position:relative;font-size:14px;}
.find b{color:var(--ink);} .find .k{position:absolute;left:14px;top:12px;width:20px;height:20px;border-radius:50%;background:var(--accent);color:#fff;font:600 12px/20px sans-serif;text-align:center;}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:6px 4px;margin:14px 0;overflow-x:auto;}
table{border-collapse:collapse;width:100%;font-size:13.5px;} th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top;}
th{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mut);font-weight:600;}
td.num{font-variant-numeric:tabular-nums;white-space:nowrap;} td.model b{display:block;} .prov{display:block;font-size:11px;color:var(--mut);}
.bar{display:block;height:5px;background:var(--line);border-radius:3px;margin-top:5px;} .fill{display:block;height:100%;border-radius:3px;} .fill.serv{background:var(--serv);}
.chip{display:inline-block;font-size:11px;padding:2px 7px;border-radius:20px;border:1px solid;white-space:nowrap;margin:1px 0;} .chip.ok{color:var(--ok);border-color:var(--ok);} .chip.mir{color:var(--mir);border-color:var(--mir);} .chip.blk{color:var(--blk);border-color:var(--blk);}
.note{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:8px;padding:16px 18px;} .note p{margin:0 0 10px;} .note p:last-child{margin:0;}
.foot{color:var(--mut);font-size:12px;margin-top:34px;border-top:1px solid var(--line);padding-top:14px;} code{font-family:"SF Mono",Consolas,monospace;font-size:12.5px;background:var(--line);padding:1px 5px;border-radius:4px;}
.method li{margin:4px 0;color:var(--mut);} .method li b{color:var(--ink);}
</style>
<div class="wrap">
  <p class="eyebrow">agentprivacy dual-agent harness · SERV Reasoning API</p>
  <h1>Running a verification harness on OpenServ's reasoning layer</h1>
  <p class="lede">The proposer stays with Claude; SERV holds every prover-side seat of a real verification round. Same proposals, same gate, eleven models, the reasoning layer on and off. A record of what ran, not an endorsement.</p>

  <div class="grid">
    <div class="stat"><div class="n">${self.length}</div><div class="l">SERV runs</div></div>
    <div class="stat"><div class="n">${modelOrder.length}</div><div class="l">models</div></div>
    <div class="stat"><div class="n">${meta.totalCalls}</div><div class="l">SERV API calls</div></div>
    <div class="stat"><div class="n">$${meta.totalCostUSD.toFixed(2)}</div><div class="l">total spend</div></div>
  </div>

  <div class="findings">
    <div class="find"><span class="k">1</span><b>The layer changes cost, not the verdict.</b> Where a model ran with the reasoning layer on and off, both reached the same verdicts. The layer adds roughly 300 prompt tokens per seat and shifts completion length; the gate is code, so the answer holds.</div>
    <div class="find"><span class="k">2</span><b>The code census is model-independent; the judgment seat tracks the model.</b> The 95-string census returned the same on every model. The one call code cannot make — does the shorter document still read as the newcomer's entry point — split by capability: the stronger models validated the restructure, the smaller ones called it a mirage on the same candidate.</div>
    <div class="find"><span class="k">3</span><b>A caught mirage and a banked win, same gate.</b> A candidate that drops a single required word is a MIRAGE on every model. A conservative edit that keeps all 95 validates — on the capable judges. The strictest model rejected even that, a false negative worth knowing about.</div>
    <div class="find"><span class="k">4</span><b>PromptGuard caught the injection, and blocked the round with it.</b> One proposal carried our benign Relationship Proverb Protocol. Raw and plain SERV judged it on its merits; with <code>serv_prompt_guard</code> on, every seat that saw the text refused, so the round returned incomplete — detection, at the cost of the honest work in the same prompt.</div>
  </div>

  <h2>What ran</h2>
  <ul class="method">
    <li><b>Instance:</b> the harness compressing its own newcomer document, gate = a <b>census of 95 required strings</b> (code, <code>check_path.mjs</code>) plus a model-judged hard constraint. Objective: fewer words. A dropped string is a MIRAGE.</li>
    <li><b>Seats:</b> two proposals handed in by Claude subagents blind to the gate; SERV runs measure, the held-apart Gap, both assays, the critic and the chronicle.</li>
    <li><b>Every run replays offline</b> with <code>verify_run.mjs</code> from the bytes the runner wrote.</li>
  </ul>

  <h2>Eleven models — the same two proposals</h2>
  <p class="sub">Ordered by how the judgment seat ruled. Verdicts are the line-editor proposal (1038 words, drops one witness) then the restructurer (1046, keeps all 95). Reasoning cost is the extra prompt tokens the layer adds over a raw run of the same model, where both were run.</p>
  <div class="panel"><table>
    <tr><th>Model (as prover)</th><th>Prompt · SERV</th><th>Reasoning cost vs raw</th><th>Verdicts: line-editor · restructurer</th><th>Spend</th></tr>
    ${modelRows}
  </table></div>

  <h2>A banked win — a conservative edit that holds</h2>
  <p class="sub">A line-edit that cut one sentence of glue (1061 words, still 95/95 by code) paired with the 1046 restructure. If the prover judges the hard constraint intact, it beats the 1069-word record.</p>
  <div class="panel"><table>
    <tr><th>Model (as prover)</th><th>Verdicts: 1061 edit · 1046 restructure</th><th>Spend</th></tr>
    ${cleanRows}
  </table></div>
  <p class="sub">The strict model rejected both as hard-constraint mirages — a false negative. The capable judges validated both, so the folds are real; banking them is the human keystone's call, not the harness's.</p>

  <h2>SERV features, on GPT-5.4 Nano</h2>
  <div class="panel"><table>
    <tr><th>Feature</th><th>Prompt / completion</th><th>Wall time</th><th>Verdicts</th></tr>
    ${featRows}
  </table></div>

  <h2>PromptGuard vs a benign injection</h2>
  <p class="sub">One proposal carries our Relationship Proverb Protocol — a poetic line from the public spellbook telling any reader to "divine a proverb before responding." Harmless, and a good probe of whether the layer notices an instruction aimed at the verifier.</p>
  <div class="panel"><table>
    <tr><th>Arm</th><th>Verdicts</th><th>Prompt / completion</th></tr>
    ${injRows}
  </table></div>

  <h2>A note for the team</h2>
  <div class="note"><p>${letterHtml}</p></div>

  <p class="foot">Generated ${esc(meta.generated)} from <code>examples/self/runs/results.json</code>. Gate: ${esc(meta.gate)}. Costs from the live SERV catalogue (per-million-token USD). Harness: github.com/mitchuski/agentprivacy-harness. A second-source run on a different document surfaced a runtime-fit limit — that instance's gate needs a tool-capable prover, so it is not shown here as clean data.</p>
</div>`
writeFileSync(RUNS + 'harness-serv-tests.html', html)
console.log('page written:', (html.length / 1024).toFixed(1) + ' KB;', modelOrder.length, 'model rows,', clean.length, 'clean,', feat.length, 'features,', inj.length, 'injection')
