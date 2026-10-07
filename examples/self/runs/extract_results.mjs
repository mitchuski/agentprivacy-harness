// extract_results.mjs — scan the SERV runs across instances and emit results.json
// for the OpenServ visualisation: per-run instance, source, arm, verdicts, tokens, cost, timing.
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
const HARNESS = 'C:/Users/mitch/dual-agent-harness/'
const SELF = HARNESS + 'examples/self/runs/'
const pricing = existsSync(SELF + 'pricing.json') ? JSON.parse(readFileSync(SELF + 'pricing.json', 'utf8')) : {}
const timings = {}
for (const t of [SELF + 'timings.json', HARNESS + 'examples/field-guide/runs/timings.json'])
  if (existsSync(t)) Object.assign(timings, JSON.parse(readFileSync(t, 'utf8')))
const baseModel = (m) => String(m || '').replace(/^serv:/, '').replace(/-serv-(kronos|multipath)(-\w+)*$/, '')
const cost = (prompt, completion, model) => {
  const p = pricing[baseModel(model)]; if (!p || p.inCentsPerM == null) return null
  return (prompt / 1e6) * (p.inCentsPerM / 100) + (completion / 1e6) * (p.outCentsPerM / 100)
}
// (instance runsDir, prefix regex, source label, baseline words)
const SOURCES = [
  { instance: 'self', dir: SELF, re: /^(r3|r4|r5|clean)/, source: 'the harness newcomer document (our corpus)', baseline: 1069 },
  { instance: 'field-guide', dir: HARNESS + 'examples/field-guide/runs/', re: /^fg-/, source: 'a 730-word practical field guide (not our corpus)', baseline: 730 },
  { instance: 'zk-tale-5', dir: HARNESS + 'examples/zk-tale-5/runs/', re: /^zk-/, source: 'Tale 5, The Constraint Forge, from the Zero Knowledge Spellbook', baseline: 1056 },
  { instance: 'mage-naming', dir: HARNESS + 'examples/mage-naming/runs/', re: /^mn-/, source: 'Tome IV Act IV, The Naming Ceremony, from the City of Mages tomes', baseline: 1114 },
  { instance: 'mage-star', dir: HARNESS + 'examples/mage-star/runs/', re: /^ms-/, source: 'Tome VIII Act 3, The Eight-Pointed Star, from the City of Mages tomes', baseline: 1205 },
]
const runs = []
for (const src of SOURCES) {
  if (!existsSync(src.dir)) continue
  for (const name of readdirSync(src.dir)) {
    const dir = src.dir + name
    if (!statSync(dir).isDirectory() || !existsSync(dir + '/run.json') || !src.re.test(name)) continue
    const rj = JSON.parse(readFileSync(dir + '/run.json', 'utf8'))
    const usage = rj.usage || []
    const totPrompt = usage.reduce((a, u) => a + (u.prompt_tokens || 0), 0)
    const totCompletion = usage.reduce((a, u) => a + (u.completion_tokens || 0), 0)
    const roundDir = existsSync(dir + '/' + name + '.1') ? dir + '/' + name + '.1' : null
    const verdicts = []
    if (roundDir) for (const pd of readdirSync(roundDir)) {
      const vp = roundDir + '/' + pd + '/verdict.json'
      if (existsSync(vp)) { const v = JSON.parse(readFileSync(vp, 'utf8')); verdicts.push({ leverId: v.leverId, status: v.status, metric: v.metric, gateResult: v.gateResult, failingCheck: v.failingCheck }) }
    }
    const model = rj.models?.prover || null, bm = baseModel(model)
    const arm = usage.some(u => u.raw) ? 'raw' : usage.some(u => u.guard) ? 'guard' : usage.some(u => u.shadow) ? 'shadow'
      : /kronos/.test(model || '') ? 'kronos' : /multipath/.test(model || '') ? 'multipath' : 'serv'
    runs.push({
      runId: name, instance: src.instance, source: src.source, baseline: src.baseline,
      status: rj.status, model, baseModel: bm, provider: pricing[bm]?.provider || null, arm,
      injected: /injected/.test(name), clean: /^clean/.test(name),
      proposer: rj.models?.proposer, phiObservers: rj.phiObservers ?? null, phiInference: rj.phiInference ?? null,
      totPrompt, totCompletion, calls: usage.length,
      costUSD: cost(totPrompt, totCompletion, model),
      verdicts, ms: timings[name]?.ms ?? null,
    })
  }
}
runs.sort((a, b) => (a.instance + a.runId).localeCompare(b.instance + b.runId))
const meta = {
  generated: new Date().toISOString(), gate: 'code census + a model-judged hard constraint',
  runCount: runs.length, totalCostUSD: runs.reduce((a, r) => a + (r.costUSD || 0), 0), totalCalls: runs.reduce((a, r) => a + r.calls, 0),
  validatedRuns: runs.filter(r => r.verdicts.some(v => v.status === 'VALIDATED')).length,
}
writeFileSync(SELF + 'results.json', JSON.stringify({ meta, pricing, runs }, null, 2) + '\n')
console.log('results.json:', runs.length, 'runs, $' + meta.totalCostUSD.toFixed(4), meta.totalCalls, 'calls,', meta.validatedRuns, 'with a VALIDATED')
for (const r of runs) console.log(`${r.instance.padEnd(12)} ${r.runId.padEnd(30)} ${String(r.model).padEnd(26)} ${r.arm.padEnd(9)} ${String(r.status).slice(0,10).padEnd(10)} p${r.totPrompt}/c${r.totCompletion} $${(r.costUSD||0).toFixed(4)} ${r.verdicts.map(v=>v.status[0]+(v.gateResult||'')).join(',')}`)
