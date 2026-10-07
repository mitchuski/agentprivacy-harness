// gen_fit.mjs — a "fit map": each harness piece mapped to an OpenServ stack surface.
import { readFileSync, writeFileSync } from 'node:fs'
const RUNS = new URL('./', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const { meta, runs } = JSON.parse(readFileSync(RUNS + 'results.json', 'utf8'))
const SRC = ['self', 'zk-tale-5', 'mage-naming', 'mage-star']
const servRuns = runs.filter(r => SRC.includes(r.instance) && String(r.model).startsWith('serv:'))
const models = new Set(servRuns.map(r => r.baseModel)).size
const cost = servRuns.reduce((a, r) => a + (r.costUSD || 0), 0)
const validated = runs.filter(r => SRC.includes(r.instance) && r.verdicts.some(v => v.status === 'VALIDATED')).length

// relationship kinds → colour + label
const REL = {
  serv: ['SERV provides', 'ok'],
  compose: ['composes with', 'accent'],
  adds: ['the harness adds', 'mir'],
  platform: ['their platform', 'mut'],
}
// each row: harness piece · what it does · OpenServ surface · relationship
const rows = [
  ['Proposer seat (🧙 the Mage)', 'generates the candidate — the shorter telling, the reduced circuit, the answer', 'SERV Reasoning: any catalogue model as the generator; BRAID bounds the reasoning', 'serv'],
  ['Prover seat (⚔️ the Swordsman)', 'checks the candidate against the gate and returns the verdict', 'A SERV model holds the seat; the Shadow Agent is its in-call analogue', 'serv'],
  ['The Gap (⿻ Fiat-Shamir)', 'draws the challenge by hashing the sealed proposal, so the proposer cannot tune to it', 'No SERV equivalent — this is the harness\'s core addition: the un-tunable gate', 'adds'],
  ['The code census / gate', 'a deterministic, model-independent check run in code', 'SERV structured outputs + "validate at your boundary" (their own day-one advice), made a first-class gate', 'compose'],
  ['Critic + revise loop', 'red-teams the proposal, drives another round when it fails', 'The Shadow Agent\'s validate-and-iterate loop; Kronos auditing the reasoning prompt', 'compose'],
  ['Replayable audit trail', 'every round re-derives from saved bytes (verify_run.mjs)', 'SERV\'s console reports are the vendor-side analogue; the one ask — return a reasoning-prompt id — makes a SERV round fully replayable here', 'adds'],
  ['The driver seam (serv.mjs)', 'swaps any model into any seat with one contract', 'The SERV inference API: one OpenAI-shaped code path, base-URL swap', 'serv'],
  ['Separation (Φ_inference)', 'proposer ⊥ prover — different observers, so the check is independent', 'SERV\'s multi-provider catalogue lets you seat different models/observers', 'serv'],
  ['Boundary enforcement', 'refuses inputs that try to steer the verifier', 'PromptGuard — caught our benign injection in the run', 'compose'],
  ['Verifier identity', 'who signed this verdict, and can a counterparty trust it', 'ERC-8004 on-chain agent identity for the prover/verifier', 'platform'],
  ['Verification as a service', 'a verdict a counterparty pays to rely on', 'x402 payments on the same agent', 'platform'],
]
const rowHtml = rows.map(([piece, does, serv, rel]) => {
  const [label, cls] = REL[rel]
  return `<tr>
    <td class="piece"><b>${piece}</b><span class="does">${does}</span></td>
    <td class="rel"><span class="tag ${cls}">${label}</span></td>
    <td class="serv">${serv}</td>
  </tr>`
}).join('\n')

const html = `<title>Harness × OpenServ — the fit</title>
<style>
:root{--bg:#fbfaf7;--panel:#fff;--ink:#1a1c22;--mut:#5b6070;--line:#e7e4dc;--ok:#2e7d54;--mir:#b26b1f;--accent:#3b6ea5;}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--accent:#6ea3d8;}}
:root[data-theme=dark]{--bg:#0d0f16;--panel:#151824;--ink:#e8e9ee;--mut:#9aa0b2;--line:#242838;--ok:#5cc088;--mir:#e0a95c;--accent:#6ea3d8;}
*{box-sizing:border-box;}body{background:var(--bg);color:var(--ink);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,system-ui,sans-serif;}
.wrap{max-width:900px;margin:0 auto;padding-block:36px;padding-left:20px;padding-right:20px;}
.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--mut);margin:0 0 6px;}
h1{font:600 28px/1.15 Georgia,serif;margin:0 0 10px;}h2{font:600 19px/1.2 Georgia,serif;margin:30px 0 8px;}
.lede{font-size:16px;max-width:70ch;}.dim{color:var(--mut);font-size:12.5px;}
.layers{display:grid;gap:8px;margin:22px 0;}
.layer{border:1px solid var(--line);border-radius:11px;padding:14px 18px;}
.layer.top{background:color-mix(in srgb, var(--accent) 12%, var(--panel));border-color:var(--accent);}
.layer.bot{background:var(--panel);}
.layer .t{font:600 15px/1.2 Georgia,serif;}.layer .d{font-size:13px;color:var(--mut);margin-top:3px;}
.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--mut);margin:10px 0;}
.tag{display:inline-block;font-size:11px;padding:2px 9px;border-radius:20px;border:1px solid;white-space:nowrap;}
.tag.ok{color:var(--ok);border-color:var(--ok);}.tag.accent{color:var(--accent);border-color:var(--accent);}.tag.mir{color:var(--mir);border-color:var(--mir);}.tag.mut{color:var(--mut);border-color:var(--mut);}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:4px 2px;margin:12px 0;overflow-x:auto;}
table{border-collapse:collapse;width:100%;font-size:13.5px;}th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top;}
th{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);}
td.piece b{display:block;}.does{display:block;font-size:12px;color:var(--mut);margin-top:3px;}
td.rel{white-space:nowrap;}td.serv{color:var(--ink);}
.callout{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--mir);border-radius:8px;padding:14px 16px;margin:14px 0;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0;}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:12px 13px;}.stat .n{font:600 21px/1 Georgia,serif;}.stat .l{font-size:11px;color:var(--mut);margin-top:5px;}
.moves li{margin:6px 0;}
.foot{color:var(--mut);font-size:11.5px;margin-top:28px;border-top:1px solid var(--line);padding-top:12px;}code{font-family:"SF Mono",Consolas,monospace;font-size:12.5px;}
</style>
<div class="wrap">
<p class="eyebrow">agentprivacy dual-agent harness · OpenServ SERV</p>
<h1>How the harness fits the OpenServ stack</h1>
<p class="lede">SERV makes reasoning reliable and cheap <em>inside a call</em>. The harness makes a <em>result</em> provable and replayable <em>across agents</em>. They are not rivals — they stack. This maps each piece of the harness to the OpenServ surface that fills it, composes with it, or the one thing the harness adds.</p>

<div class="layers">
<div class="layer top"><div class="t">The harness — the verification envelope</div><div class="d">a proposer and a prover held apart by a gate the proposer cannot tune to; a verdict that replays from bytes. Turns "an agent said X" into "X survived a gate no one could game."</div></div>
<div class="layer bot"><div class="t">SERV — the reasoning engine</div><div class="d">bounded reasoning per call (BRAID), a Shadow-Agent quality pass, PromptGuard, a multi-provider catalogue behind one API. The models that fill the seats.</div></div>
</div>

<div class="grid">
<div class="stat"><div class="n">${models}</div><div class="l">SERV models run as the prover</div></div>
<div class="stat"><div class="n">${servRuns.length}</div><div class="l">verification runs</div></div>
<div class="stat"><div class="n">$${cost.toFixed(2)}</div><div class="l">total spend</div></div>
<div class="stat"><div class="n">${validated}</div><div class="l">runs with a validated win</div></div>
</div>

<h2>The fit, piece by piece</h2>
<div class="legend">
<span><span class="tag ok">SERV provides</span> a surface that fills the seat</span>
<span><span class="tag accent">composes with</span> a SERV feature that complements it</span>
<span><span class="tag mir">the harness adds</span> what SERV does not have</span>
<span><span class="tag mut">their platform</span> infra the verifier can ride</span>
</div>
<div class="panel"><table>
<tr><th>Harness piece</th><th>Relationship</th><th>OpenServ surface</th></tr>
${rowHtml}
</table></div>

<div class="callout"><b>The one thing the harness adds, and why it matters to you:</b> the Gap and the replayable verdict. SERV's marketing promises an "audit-grade decision trail"; the console gives part of it. The harness completes it — a decision that a third party re-derives from bytes, against a challenge no one could tune to. That is the difference between "our model is reliable" and "we can prove this decision was sound," which is what your regulated buyers actually pay for. One field from you — a stable id of the generated reasoning prompt — makes a SERV round fully replayable here, and turns SERV into the reasoning core of a provably auditable agent runtime.</div>

<h2>What we can do to show the fit</h2>
<ul class="moves">
<li><b>The demo is already run.</b> SERV held the prover seat across ${models} of your models for $${cost.toFixed(2)}; the reader has the verdicts, the cost, and four doc fixes we found for free.</li>
<li><b>A joint public example:</b> an <code>examples/serv-verified</code> instance in the open harness that seats SERV as the prover, so your customers can run "SERV-verified" agent work out of the box — reproducible and co-citable.</li>
<li><b>Ride your own rails:</b> the verifier agent takes an ERC-8004 identity and charges through x402 — verification becomes a first-class, paid, identified service on your stack.</li>
<li><b>The one ask:</b> return the reasoning-prompt id. Small for you; it closes the replay gap and makes the audit story true end to end.</li>
</ul>

<p class="foot">Generated ${meta.generated.slice(0, 10)}. Public harness: github.com/mitchuski/agentprivacy-harness. This page is a companion to the results reader (<code>harness-serv-reader.html</code>); the SERV key lives only in the environment, never in a repo.</p>
</div>`
writeFileSync(RUNS + 'harness-serv-fit.html', html)
console.log('fit map:', (html.length / 1024).toFixed(1) + ' KB;', rows.length, 'mapped pieces;', models, 'models, $' + cost.toFixed(2))
