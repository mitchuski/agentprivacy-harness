#!/usr/bin/env node
// drivers/run.mjs — run one harness round on any instance, with any driver,
// and persist the audit trail. Node alone; no dependencies.
//
//   node drivers/run.mjs --instance <dir> --driver stub --run smoke
//   node drivers/run.mjs --instance <dir> --driver ollama --model <m> --run r1
//   node drivers/run.mjs --instance <dir> --driver anthropic --run r1           (ANTHROPIC_API_KEY)
//   node drivers/run.mjs --instance <dir> --driver ollama --propose-model <a> --assay-model <b> --run r1
//   node drivers/run.mjs --instance <dir> --driver split --propose-model claude-opus-5 --assay-model <ollama model> --run r1
//
// --driver split puts the proposer on the Claude API and the Gap, the prover,
// the critic and the chronicle on the local Ollama model: two model families,
// two machines' worth of separation, the corpus never leaving the box except
// as the proposal's canonical bytes.
//
//   node drivers/run.mjs --instance <dir> --driver ollama --assay-model <m> --proposals <file.json> --propose-model "<name>" --run r2
//
// --proposals hands the proposer's seat to an agent that already answered
// elsewhere — a Claude Code subagent, a Workflow seat, a person — whose
// proposal sets are in a JSON file: { "<lens>": { proposals: [...] }, ... }.
// The engine still derives every seed AFTER the proposals are committed, so
// the hand-off is as grind-proof as a live seat; --propose-model names the
// agent for the record (models + phiInference in run.json).
//
// What the Workflow tool does for the reference runtime, this does with a
// plain rt: drives engine/dual_agent_loop.mjs, then PERSISTS what pure-data
// seats cannot write themselves:
//
//   runs/<runId>/<roundId>/p<i>-<leverId>/proposal_canon.json   exact canonical bytes
//   runs/<runId>/<roundId>/p<i>-<leverId>/gap.json              salted seed + draw (engine-derived)
//   runs/<runId>/<roundId>/p<i>-<leverId>/candidate.md          the proposal's compressedText, if any
//   runs/<runId>/<roundId>/p<i>-<leverId>/verdict.json          the assay's verdict
//   runs/<runId>/<roundId>/CHRONICLE_DRAFT.md                   the chronicle seat's draft
//   runs/<runId>/run.json                                       round summary (never the salt secret)
//
// tools/verify_run.mjs replays every seed from these bytes offline.
//
// If the instance carries tools/measure.mjs, it is run first and its JSON is
// passed to the config as ctx.args.measured (the counting rule, code-side).
// If the config names a sourceFile, its sha256 binds the run (hSource).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { runHarness } from '../engine/dual_agent_loop.mjs'
import { canonicalize, sha256Hex } from '../engine/gap.mjs'
import { makeStubRt } from './stub.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(join(here, '..'))
const argv = process.argv.slice(2)
const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null }
const instance = resolve(opt('--instance') || process.cwd())
const driver = opt('--driver') || 'stub'
const runId = opt('--run')
const host = opt('--host') || 'http://127.0.0.1:11434'
const maxRounds = opt('--max-rounds') ? Number(opt('--max-rounds')) : null
const proposalsFile = opt('--proposals') ? resolve(opt('--proposals')) : null
if (!runId) { console.error('usage: node drivers/run.mjs --instance <dir> --driver stub|ollama|anthropic|split --run <runId> [--model <m> | --propose-model <a> --assay-model <b>] [--host <url>] [--max-rounds n]'); process.exit(2) }
if (!existsSync(join(instance, 'harness.config.mjs'))) { console.error('run: no harness.config.mjs in ' + instance); process.exit(2) }

// Running an instance executes its config and optional measurement adapter.
// Model precedence: explicit seat flag, saved seat, general CLI default.
const baseConfig = (await import(pathToFileURL(join(instance, 'harness.config.mjs')).href)).default
const proposeModel = opt('--propose-model') || baseConfig.seatOpts?.propose?.model || opt('--model') || (proposalsFile ? 'handed-off' : null)
const assayModel = opt('--assay-model') || baseConfig.seatOpts?.assay?.model || opt('--model') || null
// ---- 1. the driver -----------------------------------------------------------
const log = (m) => console.log('  ' + m)
let base, models
if (driver === 'stub') { base = makeStubRt(); models = { proposer: 'stub', prover: 'stub' } }
else if (driver === 'ollama') {
  const { makeOllamaRt } = await import('./ollama.mjs')
  const localModel = proposalsFile ? assayModel : proposeModel
  if (!localModel) { console.error('run: --model or --propose-model/--assay-model required for the ollama driver'); process.exit(2) }
  base = makeOllamaRt({ model: localModel, host, log }); models = { proposer: proposeModel, prover: assayModel || proposeModel }
} else if (driver === 'anthropic') {
  const { makeAnthropicRt } = await import('./anthropic.mjs')
  base = makeAnthropicRt({ model: proposeModel || 'claude-opus-5', log }); models = { proposer: proposeModel || 'claude-opus-5', prover: assayModel || proposeModel || 'claude-opus-5' }
} else if (driver === 'split') {
  const { makeAnthropicRt } = await import('./anthropic.mjs')
  const { makeOllamaRt } = await import('./ollama.mjs')
  if (!assayModel) { console.error('run: --assay-model <ollama model> required for the split driver'); process.exit(2) }
  const api = makeAnthropicRt({ model: proposeModel || 'claude-opus-5', log })
  const local = makeOllamaRt({ model: assayModel, host, log })
  base = { ...local, agent: async (prompt, opts = {}) => (String(opts.label || '').startsWith('propose:') ? api : local).agent(prompt, opts) }
  models = { proposer: proposeModel || 'claude-opus-5', prover: assayModel }
} else { console.error('run: unknown driver ' + driver); process.exit(2) }

console.log('resolved seats: ' + JSON.stringify(models))

// ---- 2. measure, code-side, if the instance carries a counting rule ---------
let measured = null
const measureTool = join(instance, 'tools', 'measure.mjs')
if (existsSync(measureTool)) {
  const m = spawnSync(process.execPath, [measureTool], { cwd: instance, encoding: 'utf8' })
  if (m.status !== 0) { console.error('run: tools/measure.mjs failed:\n' + (m.stderr || m.stdout)); process.exit(1) }
  measured = JSON.parse(m.stdout)
  console.log('measured: ' + JSON.stringify(measured))
}

// ---- 3. the run secret + source binding (after-commit, grind-proof) ---------
const saltSecret = randomBytes(32).toString('hex')   // never written anywhere

const sourceHash = baseConfig.sourceFile && existsSync(join(instance, baseConfig.sourceFile)) ? sha256Hex(readFileSync(join(instance, baseConfig.sourceFile), 'utf8')) : null

// ---- 4. seat models on the config, so the engine records Φ_inference --------
const seatOpts = { ...(baseConfig.seatOpts || {}) }
if (models.proposer !== 'stub') seatOpts.propose = { ...(seatOpts.propose || {}), model: models.proposer }
if (models.prover !== 'stub') seatOpts.assay = { ...(seatOpts.assay || {}), model: models.prover }
const config = { ...baseConfig, seatOpts, ...(maxRounds ? { stop: { ...baseConfig.stop, maxRounds } } : {}) }

// ---- 5. the rt, with a tap that records full seat outputs -------------------
// With --proposals, the propose seats are answered from the file (one set per
// lens, keyed by lens name); every other seat runs on the driver.
const handed = proposalsFile ? JSON.parse(readFileSync(proposalsFile, 'utf8')) : null
const taps = []
const rt = { ...base, agent: async (prompt, opts = {}) => {
  const label = String(opts.label || '')
  let r
  if (handed && label.startsWith('propose:')) {
    const lens = label.slice('propose:'.length)
    r = handed[lens] || null
    if (!r) log(`propose:${lens} — no handed-off proposal set for this lens; the seat is dead for this round`)
    else log(`propose:${lens} — handed off (${(r.proposals || []).length} proposal(s) from ${models.proposer})`)
  } else {
    const card = label.startsWith('propose:') ? 'soulbae-propose.md' : label.startsWith('gap:') ? 'gap-hold-apart.md' : label.startsWith('assay:') ? 'soulbis-assay.md' : label.startsWith('critic:') ? 'critic.md' : label.startsWith('chronicle:') ? 'chronicle.md' : 'measure.md'
    const boot = ['GROUND_RULES.md', 'TRUSTS.md', 'seats/' + card].map(p => readFileSync(join(root, p), 'utf8')).join('\n\n')
    const frontier = readFileSync(join(instance, 'frontier.json'), 'utf8')
    r = await base.agent('Runtime: text/JSON only; no filesystem or shell tools. The host supplies the boot files below and persists returned data. Never claim to execute commands. If required inputs or executable evidence are absent, return BLOCKED (or null for a seat without a status schema).\n' + boot + '\nFRONTIER:\n' + frontier + '\n' + prompt, opts)
  }
  taps.push({ label: opts.label || '(unlabelled)', ok: r != null, result: r }); return r
} }

// ---- 6. run -----------------------------------------------------------------
const result = await runHarness(config, rt, { repo: instance, root, runId, saltSecret, sourceHash, measured })

// ---- 7. persist -------------------------------------------------------------
const tapFor = (prefix, key) => taps.find(t => t.label === `${prefix}:${key}`)?.result || null
const writeJson = (p, v) => writeFileSync(p, JSON.stringify(v, null, 2) + '\n')
for (const round of result.detail || []) {
  const roundDir = join(instance, 'runs', runId, round.roundId)
  mkdirSync(roundDir, { recursive: true })
  ;(round.proposals || []).forEach((p, i) => {
    const d = (round.holdApart || [])[i]
    if (!d) return
    const pdir = join(roundDir, `p${i + 1}-${p.leverId}`)
    mkdirSync(pdir, { recursive: true })
    writeFileSync(join(pdir, 'proposal_canon.json'), canonicalize(p))
    if (typeof p.compressedText === 'string') writeFileSync(join(pdir, 'candidate.md'), p.compressedText)
    const gapSeat = tapFor('gap', p.leverId)
    writeJson(join(pdir, 'gap.json'), { hSource: d.hSource, hProposal: d.hProposal, salt: d.salt, seedHex: d.seedHex, mode: d.mode, N: d.N, count: d.count, drawVersion: d.drawVersion, drawIndices: d.drawIndices, draw: gapSeat?.draw || null, transcript: gapSeat?.transcript || null })
    // match the verdict by lever id, unless the proposers minted duplicate ids
    // (a small model will answer "1" twice) — then by position, which the
    // engine's pipeline preserves; a mis-stated id is filed with the mismatch
    // recorded rather than dropped
    const ids = (round.proposals || []).map(q => q.leverId)
    const unique = new Set(ids).size === ids.length
    let verdict = unique ? ((round.verdicts || []).find(v => v.leverId === p.leverId) || null) : ((round.verdicts || [])[i] || null)
    if (!verdict && (round.verdicts || [])[i] && !ids.includes(round.verdicts[i].leverId)) verdict = { ...round.verdicts[i], leverIdMismatch: round.verdicts[i].leverId, leverId: p.leverId }
    if (verdict && verdict.leverId !== p.leverId) verdict = { ...verdict, leverIdMismatch: verdict.leverId, leverId: p.leverId }
    if (verdict) writeJson(join(pdir, 'verdict.json'), verdict.status === 'VALIDATED' ? { ...verdict, coverage: { mode: d.mode, detection: d.mode === 'census' ? 'always — every witness probed' : `${d.count}/${d.N}` } } : verdict)
  })
  const chronicle = tapFor('chronicle', round.roundId)
  if (typeof chronicle === 'string' && chronicle.trim()) writeFileSync(join(roundDir, 'CHRONICLE_DRAFT.md'), chronicle + '\n')
}
const summary = { name: result.name, runId, driver, status: result.status, rounds: result.rounds, tally: result.tally, confirmed: result.confirmed, models, phiInference: models.proposer === models.prover ? 0 : 1, measured, sourceHash, keystoneTodo: result.keystoneTodo }
mkdirSync(join(instance, 'runs', runId), { recursive: true })
writeJson(join(instance, 'runs', runId, 'run.json'), summary)

// ---- 8. report --------------------------------------------------------------
console.log('\n' + JSON.stringify(summary, null, 2))
console.log(`\nverify:  node tools/verify_run.mjs ${instance} ${runId}`)
console.log(`render:  node tools/render_run.mjs ${instance} ${runId}`)
if (result.status !== 'COMPLETE') process.exit(1)
