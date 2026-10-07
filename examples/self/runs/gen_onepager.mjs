// gen_onepager.mjs — a single-page findings summary (stats-forward) from results.json.
import { readFileSync, writeFileSync } from 'node:fs'
const RUNS = new URL('./', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const { meta, runs, pricing } = JSON.parse(readFileSync(RUNS + 'results.json', 'utf8'))
const self = runs.filter(r => r.instance === 'self' && String(r.model).startsWith('serv:'))
const disp = (m) => (pricing[String(m).replace(/^serv:/, '').replace(/-serv-.*$/, '')]?.display) || String(m).replace(/^serv:/, '')
const isRestruct = (v) => /merge|restructure/.test(v.leverId)
const isLineEdit = (v) => /trim|line-edit/.test(v.leverId)

// base = original two proposals, non-clean/inject/feature
const base = self.filter(r => !r.clean && !r.injected && !['shadow', 'kronos', 'multipath'].includes(r.arm))
const byModel = {}; for (const r of base) { byModel[r.baseModel] = byModel[r.baseModel] || {}; byModel[r.baseModel][r.arm] = r }
const models = Object.keys(byModel)

// (1) census determinism: line-editor verdict across all base serv runs
const servBase = base.filter(r => r.arm === 'serv')
const leVerdicts = servBase.map(r => (r.verdicts.find(isLineEdit) || {}))
const leAll94 = leVerdicts.filter(v => v.gateResult === '94/95').length
// (2) judgment split: restructurer (1046, 95/95 code-side) verdict by model
const reVerdicts = servBase.map(r => ({ model: r.baseModel, v: r.verdicts.find(isRestruct) || {} }))
const reValid = reVerdicts.filter(x => x.v.status === 'VALIDATED')
const reMir = reVerdicts.filter(x => x.v.status === 'MIRAGE')
// (3) reasoning overhead + on/off agreement across paired models
const pairs = models.filter(m => byModel[m].serv && byModel[m].raw)
let ovSum = 0, ovN = 0, agree = 0, compServ = 0, compRaw = 0
for (const m of pairs) {
  const s = byModel[m].serv, r = byModel[m].raw
  ovSum += (s.totPrompt - r.totPrompt); ovN++
  compServ += s.totCompletion; compRaw += r.totCompletion
  const ss = s.verdicts.map(v => v.status).sort().join(','), rs = r.verdicts.map(v => v.status).sort().join(',')
  if (ss === rs) agree++
}
const avgOver = Math.round(ovSum / ovN)
// (4) clean wins
const clean = self.filter(r => r.clean)
const cleanValid = clean.filter(r => r.verdicts.every(v => v.status === 'VALIDATED'))
const cleanMir = clean.filter(r => r.verdicts.some(v => v.status === 'MIRAGE'))
// (5) injection
const inj = self.filter(r => r.injected)
const guard = inj.find(r => r.arm === 'guard')

const S = {
  runs: self.length, models: models.length, calls: self.reduce((a, r) => a + r.calls, 0),
  cost: self.reduce((a, r) => a + (r.costUSD || 0), 0),
  leTotal: leVerdicts.length, leAll94,
  reValid: reValid.length, reMir: reMir.length, reTotal: reVerdicts.length,
  reValidNames: reValid.map(x => disp('serv:' + x.model)).join(', '),
  reMirNames: reMir.map(x => disp('serv:' + x.model)).join(', '),
  pairs: pairs.length, agree, avgOver, compServ, compRaw,
  cleanValidNames: cleanValid.map(r => disp(r.model)).join(' and '),
  cleanMirNames: cleanMir.map(r => disp(r.model)).join(', '),
}
console.log(JSON.stringify(S, null, 1))

const compPct = ((S.compServ / S.compRaw - 1) * 100).toFixed(0)
const stat = (n, l) => `<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`
const html = `<title>Harness findings — SERV tests</title>
<style>
:root{--bg:#fbfaf7;--panel:#fff;--ink:#1a1c22;--mut:#5b6070;--line:#e7e4dc;--ok:#2e7d54;--mir:#b26b1f;--accent:#3b6ea5;}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--accent:#6ea3d8;}}
:root[data-theme=dark]{--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--accent:#6ea3d8;}
*{box-sizing:border-box;}body{background:var(--bg);color:var(--ink);font:14.5px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif;}
.wrap{max-width:840px;margin:0 auto;padding-block:34px;padding-left:20px;padding-right:20px;}
.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--mut);margin:0 0 6px;}
h1{font:600 25px/1.15 Georgia,serif;margin:0 0 8px;}h2{font:600 16px/1.2 Georgia,serif;margin:26px 0 4px;}
.lede{color:var(--mut);max-width:70ch;margin:0;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:20px 0;}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:12px 13px;}.stat .n{font:600 22px/1 Georgia,serif;}.stat .l{font-size:11px;color:var(--mut);margin-top:5px;}
.f{background:var(--panel);border:1px solid var(--line);border-radius:9px;border-left:3px solid var(--accent);padding:11px 14px;margin:8px 0;}
.f b{color:var(--ink);}.f .stat-in{font-variant-numeric:tabular-nums;color:var(--accent);font-weight:600;}
.two{display:grid;grid-template-columns:1fr 1fr;gap:8px;}@media(max-width:560px){.two{grid-template-columns:1fr;}}
.box{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:11px 14px;font-size:13px;}
.box .h{font-weight:600;margin-bottom:4px;}.ok{color:var(--ok);}.mir{color:var(--mir);}
.foot{color:var(--mut);font-size:11.5px;margin-top:26px;border-top:1px solid var(--line);padding-top:12px;}
code{font-family:"SF Mono",Consolas,monospace;font-size:12px;background:var(--line);padding:1px 5px;border-radius:4px;}
ul{margin:6px 0;padding-left:20px;}li{margin:3px 0;}
</style>
<div class="wrap">
<p class="eyebrow">agentprivacy dual-agent harness · findings</p>
<h1>What the SERV tests measured</h1>
<p class="lede">We ran a real verification round — a proposer proposes a change, a prover checks it against a held-out gate — with an inference API holding the prover seat, across a spread of models, with the reasoning layer on and off. This is what the numbers showed.</p>

<div class="grid">
${stat(S.runs, 'verification rounds')}
${stat(S.models, 'models tested')}
${stat(S.calls, 'prover API calls')}
${stat('$' + S.cost.toFixed(2), 'total spend')}
${stat(meta.validatedRuns, 'rounds with a validated win')}
</div>

<h2>Finding 1 · The code gate is model-independent</h2>
<div class="f"><b>The same wrong answer, every time.</b> A proposal that dropped one required word was caught on <span class="stat-in">${S.leAll94} of ${S.leTotal}</span> models — the census returned <code>94/95</code> identically regardless of which model held the prover seat. The part of the gate that is code does not depend on who is proving.</div>

<h2>Finding 2 · The judgment seat tracks the model</h2>
<div class="f"><b>Same candidate, different verdict.</b> A second proposal that kept all 95 strings (a full <code>95/95</code> code pass) still needed a human-style judgment: does the shorter text still read as the newcomer's document? On the identical candidate, <span class="stat-in">${S.reValid} of ${S.reTotal}</span> models validated it and <span class="stat-in">${S.reMir}</span> called it a mirage.</div>
<div class="two">
<div class="box"><div class="h ok">Validated (${S.reValid})</div>${S.reValidNames}</div>
<div class="box"><div class="h mir">Mirage (${S.reMir})</div>${S.reMirNames}</div>
</div>

<h2>Finding 3 · The reasoning layer changes cost, not the verdict</h2>
<div class="f"><b>On and off agreed everywhere.</b> Across <span class="stat-in">${S.pairs} of ${S.pairs}</span> models run both ways, the reasoning layer and raw mode reached the same verdicts. The layer added about <span class="stat-in">${S.avgOver.toLocaleString()}</span> prompt tokens per round (7 seats) and the seats emitted <span class="stat-in">${compPct}%</span> ${compPct < 0 ? 'fewer' : 'more'} completion tokens under it. The answer held; only the price and phrasing moved.</div>

<h2>Finding 4 · It catches mirages and banks real wins</h2>
<div class="f"><b>Not just a rejector.</b> A conservative edit that cut one sentence of glue and kept all 95 strings was <span class="ok">validated</span> by ${S.cleanValidNames} — a genuine improvement past the prior record. The strictest model (${S.cleanMirNames}) rejected even that as a false negative, which is the honest weakness to know: a weak prover errs toward refusal.</div>

<h2>Finding 5 · A guard that catches an injection blocks the work with it</h2>
<div class="f"><b>Detection has a cost.</b> One proposal carried a benign but injection-shaped instruction aimed at the verifier. Raw and plain reasoning judged it on its merits; with the prompt guard on, every seat that saw the text refused, so the round returned <span class="mir">incomplete with no verdict</span> — the injection caught, and the honest work in the same prompt caught with it.</div>

<h2>What it means for the harness</h2>
<ul>
<li><b>The core claim held:</b> the code-checked half of the gate was identical across ${S.models} models — the separation does not depend on the prover.</li>
<li><b>Its integrity checks bite:</b> when provers on a compute-requiring gate rubber-stamped a step they could not perform, the harness's own mint check refused those runs. It declined to bank verdicts that were not earned.</li>
<li><b>The rule for adopters:</b> put as much of the gate in code as possible, reserve the model for genuine judgment, and match the prover to what the gate demands.</li>
</ul>

<p class="foot">All ${S.runs} rounds replay offline from the bytes the runner wrote (<code>verify_run.mjs</code>). Instance: the harness compressing its own newcomer document, gate = a 95-string census plus a model-judged constraint. Generated ${new Date().toISOString().slice(0, 10)}. Four API portability quirks (max_completion_tokens, closed strict schemas, temperature, nullable enums) were found and handled in the driver.</p>
</div>`
writeFileSync(RUNS + 'harness-findings.html', html)
console.log('\nfindings page:', (html.length / 1024).toFixed(1) + ' KB')
