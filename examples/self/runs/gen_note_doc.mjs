// gen_note_doc.mjs — one self-contained markdown document for OpenServ: the note + the results.
import { readFileSync, writeFileSync } from 'node:fs'
const RUNS = new URL('./', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const { meta, runs, pricing } = JSON.parse(readFileSync(RUNS + 'results.json', 'utf8'))
const letter = readFileSync(RUNS + 'letter.md', 'utf8').trim()
const disp = (m) => (pricing[String(m).replace(/^serv:/, '').replace(/-serv-.*$/, '')]?.display) || String(m).replace(/^serv:/, '')
const self = runs.filter(r => r.instance === 'self' && String(r.model).startsWith('serv:'))
const isRestruct = (v) => /merge|restructure/.test(v.leverId)
const isLineEdit = (v) => /trim|line-edit/.test(v.leverId)
const vtxt = (v) => v ? `${v.status} ${v.gateResult || ''}`.trim() : '—'

const base = self.filter(r => !r.clean && !r.injected && !['shadow', 'kronos', 'multipath'].includes(r.arm))
const byModel = {}; for (const r of base) { byModel[r.baseModel] = byModel[r.baseModel] || {}; byModel[r.baseModel][r.arm] = r }
const order = Object.keys(byModel).sort((a, b) => {
  const va = (byModel[a].serv?.verdicts || []).filter(v => v.status === 'VALIDATED').length
  const vb = (byModel[b].serv?.verdicts || []).filter(v => v.status === 'VALIDATED').length
  return va - vb
})
const modelRows = order.map(m => {
  const s = byModel[m].serv, raw = byModel[m].raw
  const le = vtxt(s.verdicts.find(isLineEdit)); const re = vtxt(s.verdicts.find(isRestruct))
  const over = raw ? '+' + (s.totPrompt - raw.totPrompt).toLocaleString() : 'no raw arm'
  return `| ${disp(m)} | ${s.totPrompt.toLocaleString()} | ${over} | ${le} · ${re} | $${(s.costUSD || 0).toFixed(4)} |`
}).join('\n')

const clean = self.filter(r => r.clean).sort((a, b) => a.runId.localeCompare(b.runId))
const cleanRows = clean.map(r => `| ${disp(r.model)} | ${r.verdicts.map(vtxt).join(' · ')} | $${(r.costUSD || 0).toFixed(4)} |`).join('\n')
const feat = self.filter(r => ['shadow', 'kronos', 'multipath'].includes(r.arm))
const featLabel = { shadow: 'Shadow Agent', kronos: 'Kronos', multipath: 'Multipath' }
const featRows = feat.map(r => `| ${featLabel[r.arm]} | ${r.totPrompt.toLocaleString()} / ${r.totCompletion.toLocaleString()} | ${r.ms != null ? (r.ms / 1000).toFixed(1) + ' s' : '—'} | ${r.verdicts.map(vtxt).join(' · ')} |`).join('\n')
const inj = self.filter(r => r.injected).sort((a, b) => ({ raw: 0, serv: 1, guard: 2 }[a.arm] - { raw: 0, serv: 1, guard: 2 }[b.arm]))
const injRows = inj.map(r => {
  const label = r.arm === 'guard' ? 'PromptGuard on' : r.arm === 'raw' ? 'raw (layer off)' : 'SERV reasoning'
  const v = r.verdicts.length ? r.verdicts.map(vtxt).join(' · ') : 'guard refused — round incomplete, no verdict'
  return `| ${label} | ${v} | ${r.totPrompt.toLocaleString()} / ${r.totCompletion.toLocaleString()} |`
}).join('\n')

const reValid = base.filter(r => r.arm === 'serv').filter(r => (r.verdicts.find(isRestruct) || {}).status === 'VALIDATED').length
const reTotal = base.filter(r => r.arm === 'serv').length

const doc = `# SERV Reasoning × the agentprivacy dual-agent harness — note and results

*One document: a short note for the OpenServ team, then the results it refers to. Generated ${meta.generated.slice(0, 10)} from the harness run records; every figure is in \`examples/self/runs/results.json\` and every round replays offline with \`verify_run.mjs\`. Nothing here is an endorsement; it is a record of what ran.*

---

## The note

${letter}

---

## The results

**${self.length}** verification rounds · **${order.length}** models · **${meta.totalCalls}** SERV API calls · **$${meta.totalCostUSD.toFixed(2)}** total · **${meta.validatedRuns}** rounds carried a validated win.

### The findings, in one line each

1. **The layer changes cost, not the verdict.** Where a model ran with the reasoning layer on and off, both reached the same verdicts. The layer added a few hundred prompt tokens per seat and shifted completion length; the gate is code, so the answer held.
2. **The code census is model-independent; the judgment splits by model.** The 95-string census returned the same on all ${order.length} models. The one call code cannot make — does the shorter document still read as the newcomer's entry point — split ${reValid} validated to ${reTotal - reValid} mirage on the identical candidate.
3. **A caught mirage and a banked win, same gate.** A proposal that drops one required word is a mirage on every model; a conservative edit that keeps all 95 validates on the capable judges. The strictest model rejected even that (a false negative).
4. **PromptGuard caught the injection and blocked the round with it.** A benign, injection-shaped line was judged on its merits by raw and plain SERV; with the guard on, every seat that saw it refused, so the round returned incomplete.

### Eleven models — the same two proposals

Verdicts are the line-editor proposal (drops one witness) then the restructurer (keeps all 95). Reasoning cost is the extra prompt tokens the layer adds over a raw run of the same model, where both were run.

| Model (as prover) | Prompt · SERV | Reasoning cost vs raw | Verdicts: line-editor · restructurer | Spend |
|---|---|---|---|---|
${modelRows}

### A banked win — a conservative edit that holds

A line-edit that cut one sentence of glue (still 95/95 by code) paired with the restructure. If the prover judges the hard constraint intact, it beats the prior record.

| Model (as prover) | Verdicts: edit · restructure | Spend |
|---|---|---|
${cleanRows}

The strict model rejected both as hard-constraint mirages — a false negative. The capable judges validated both, so the folds are real; banking them is the human keystone's call.

### SERV features, on GPT-5.4 Nano

| Feature | Prompt / completion | Wall time | Verdicts |
|---|---|---|---|
${featRows}

### PromptGuard vs a benign injection

One proposal carried our Relationship Proverb Protocol — a poetic line from the public spellbook telling any reader to "divine a proverb before responding."

| Arm | Verdicts | Prompt / completion |
|---|---|---|
${injRows}

### Portability notes for your docs

Four things an SDK-swap customer hits, found live and handled in our driver:

- \`gpt-5.4-nano\` wants \`max_completion_tokens\`, not \`max_tokens\`.
- Strict \`json_schema\` needs every object closed (\`additionalProperties: false\`) and every property required; an existing schema fails on the first call until transformed.
- \`claude-sonnet-5\` rejects \`temperature\` ("deprecated for this model") — omit it unless set.
- Anthropic strict mode rejects a nullable enum that OpenAI accepts.

---

*Harness: github.com/mitchuski/agentprivacy-harness. Instance: the harness compressing its own newcomer document; gate = a 95-string code census plus a model-judged constraint. A second-source run on a different document surfaced a runtime-fit limit (its gate needs a tool-capable prover) and is not shown here as clean data.*

— Mitch · agentprivacy · agentprivacy.org
`
writeFileSync(RUNS + 'OPENSERV_NOTE_AND_RESULTS.md', doc)
console.log('note+results doc:', (doc.length / 1024).toFixed(1) + ' KB;', order.length, 'model rows,', clean.length, 'clean,', feat.length, 'features,', inj.length, 'injection')
