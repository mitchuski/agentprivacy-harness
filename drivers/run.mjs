#!/usr/bin/env node
// drivers/run.mjs — run one harness round on any instance, with any driver,
// and persist the audit trail. Node alone; no dependencies.
//
//   node drivers/run.mjs --instance <dir> --driver stub --run smoke
//   node drivers/run.mjs --instance <dir> --driver ollama --model <m> --run r1
//   node drivers/run.mjs --instance <dir> --driver anthropic --run r1           (ANTHROPIC_API_KEY)
//   node drivers/run.mjs --instance <dir> --driver ollama --propose-model <a> --assay-model <b> --run r1
//   node drivers/run.mjs --instance <dir> --driver split --propose-model claude-opus-5 --assay-model <ollama model> --run r1
//   node drivers/run.mjs --instance <dir> --driver openai --model <m> --run r1           (OPENAI_API_KEY / OPENAI_BASE_URL)
//   node drivers/run.mjs --instance <dir> --driver multi --propose-model anthropic:claude-opus-5 --assay-model ollama:gemma3:27b --run r1
//   node drivers/run.mjs --instance <dir> --driver serv --propose-model gpt-5.4-nano --assay-model <ollama model> --run r1   (SERV_API_KEY)
//
// --driver serv puts the proposer on OpenServ's SERV Reasoning API (BRAID as a
// service, drivers/serv.mjs) and everything else on the local Ollama model:
// one seat, never both, never the default — one intermediary reading both
// prompts collapses the separation whatever the model ids say. --serv-raw
// sends the raw-mode header (the reasoning layer off), --serv-shadow "<hint>"
// declares the vendor's shadow agent; --serv-both is the deliberate exception
// that seats both sides behind SERV and records phiObservers: 0 in run.json.
// Each SERV call's token usage is persisted to run.json (usage), so raw and
// SERV rounds can be compared from the run record, never from a console.
//
// --driver split puts the proposer on the Claude API and the Gap, the prover,
// the critic and the chronicle on the local Ollama model: two model families,
// two machines' worth of separation, the corpus never leaving the box except
// as the proposal's canonical bytes.
//
// --driver multi generalises split: each seat model is written provider:model
// (providers: anthropic · ollama · openai · stub). The proposer's provider
// holds the propose seats; the prover's provider holds every other seat (the
// Gap, the assay, the critic, the chronicle, the measure). openai is any
// OpenAI-compatible chat endpoint (OpenAI, Groq, Together, vLLM, LM Studio,
// Ollama's /v1) — set OPENAI_BASE_URL and, where the server wants one,
// OPENAI_API_KEY. Nothing here downloads or syncs a model: ollama needs a
// running server with the named models already pulled (`ollama list`).
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
import { runHarness, validateConfig } from '../engine/dual_agent_loop.mjs'
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
const servRaw = argv.includes('--serv-raw')
const servBoth = argv.includes('--serv-both')
const servShadow = opt('--serv-shadow') ? { hint: opt('--serv-shadow'), max_iterations: 3 } : null
if (!runId) { console.error('usage: node drivers/run.mjs --instance <dir> --driver stub|ollama|anthropic|openai|split|multi|serv --run <runId> [--model <m> | --propose-model <a> --assay-model <b>] [--host <ollama url>] [--max-rounds n] [--proposals <file.json>] [--serv-raw] [--serv-shadow "<hint>"] [--serv-both]\n       multi: models are provider:model (anthropic · ollama · openai · serv · stub)\n       serv:  the proposer on SERV (SERV_API_KEY), the prover local (--assay-model) — one seat, never both, never the default'); process.exit(2) }
if (!existsSync(join(instance, 'harness.config.mjs'))) { console.error('run: no harness.config.mjs in ' + instance); process.exit(2) }

// Running an instance executes its config and optional measurement adapter.
// Model precedence: explicit seat flag, saved seat, general CLI default.
const baseConfig = (await import(pathToFileURL(join(instance, 'harness.config.mjs')).href)).default
// The seat contract is checked BEFORE a driver is built or the measurement
// adapter runs: an unfilled scaffold used to run to COMPLETE (2026-09-12).
{
  const contract = validateConfig(baseConfig)
  if (contract.length) { console.error('run: config violates the seat contract — nothing was run:\n  - ' + contract.join('\n  - ') + '\n  node engine/conform.mjs ' + instance + '  names the same gaps'); process.exit(2) }
}
const proposeModel = opt('--propose-model') || baseConfig.seatOpts?.propose?.model || opt('--model') || (proposalsFile ? 'handed-off' : null)
const assayModel = opt('--assay-model') || baseConfig.seatOpts?.assay?.model || opt('--model') || null
// ---- 1. the driver -----------------------------------------------------------
const log = (m) => console.log('  ' + m)
const PROVIDERS = ['anthropic', 'ollama', 'openai', 'serv', 'stub']
const servRts = []   // every SERV rt built for this run, for the usage record
// provider:model — split on the FIRST colon, and only when the prefix is a
// known provider, because ollama tags carry their own colon (gemma3:27b).
const parseSpec = (spec) => { const m = /^([a-z]+):(.+)$/.exec(String(spec || '')); return m && PROVIDERS.includes(m[1]) ? { provider: m[1], model: m[2] } : { provider: null, model: spec || null } }
const tag = (s) => (s.provider ? `${s.provider}:${s.model}` : s.model)
const makeRt = async (provider, model) => {
  if (provider === 'stub') return makeStubRt()
  if (provider === 'ollama') { const { makeOllamaRt } = await import('./ollama.mjs'); return makeOllamaRt({ model, host, log }) }
  if (provider === 'anthropic') { const { makeAnthropicRt } = await import('./anthropic.mjs'); return makeAnthropicRt({ model, log }) }
  if (provider === 'openai') { const { makeOpenAiRt } = await import('./openai.mjs'); return makeOpenAiRt({ model, log }) }
  if (provider === 'serv') { const { makeServRt } = await import('./serv.mjs'); const r = makeServRt({ model, raw: servRaw, shadow: servShadow, log }); servRts.push(r); return r }
  throw new Error(`unknown provider "${provider}" (anthropic · ollama · openai · serv · stub)`)
}
// Two rts, one per side of the Gap: the proposer's holds propose:*, the
// prover's holds everything else. The same rt on both sides is one driver.
const pair = (proposeRt, proverRt) => ({ ...proverRt, agent: async (prompt, opts = {}) => (String(opts.label || '').startsWith('propose:') ? proposeRt : proverRt).agent(prompt, opts) })

// models = what run.json records (provider:model under multi); seatModels =
// the bare names the engine hands each seat as opts.model on the wire.
let base, models, seatModels
let phiObservers = null   // set by the serv driver: 1 when the two seats are on different observers, 0 when one intermediary reads both
try {
  if (driver === 'stub') { base = makeStubRt(); models = { proposer: 'stub', prover: 'stub' }; seatModels = models }
  else if (driver === 'ollama' || driver === 'anthropic' || driver === 'openai') {
    const fallback = driver === 'anthropic' ? 'claude-opus-5' : null
    const p = proposeModel || fallback
    const a = assayModel || (proposalsFile ? null : proposeModel) || fallback
    const localModel = proposalsFile ? a : p
    if (!localModel) {
      console.error(proposalsFile
        ? `run: --assay-model <m> (or --model) is required with --proposals on the ${driver} driver — the prover needs a model`
        : `run: the proposer needs a model on the ${driver} driver: pass --model <m> or --propose-model <m> (a saved seatOpts.propose.model also works; --assay-model alone seats only the prover)`)
      process.exit(2)
    }
    base = await makeRt(driver, localModel); models = { proposer: p, prover: a }; seatModels = models
  } else if (driver === 'split' || driver === 'multi') {
    const P = proposalsFile ? { provider: null, model: proposeModel } : driver === 'split' ? { provider: 'anthropic', model: proposeModel || 'claude-opus-5' } : parseSpec(proposeModel)
    const A = driver === 'split' ? { provider: 'ollama', model: assayModel } : parseSpec(assayModel)
    if (driver === 'split' && !A.model) { console.error('run: --assay-model <ollama model> required for the split driver'); process.exit(2) }
    if (driver === 'multi' && (!A.provider || (!proposalsFile && !P.provider))) { console.error('run: --driver multi needs --propose-model <provider>:<model> and --assay-model <provider>:<model> (providers: anthropic · ollama · openai · stub); with --proposals the proposer is only a name for the record'); process.exit(2) }
    const proverRt = await makeRt(A.provider, A.model)
    const proposeRt = proposalsFile ? proverRt : await makeRt(P.provider, P.model)
    base = pair(proposeRt, proverRt)
    models = { proposer: tag(P), prover: tag(A) }
    seatModels = { proposer: P.model, prover: A.model }
  } else if (driver === 'serv') {
    // one seat, never both, never the default: the proposer on SERV, the
    // prover (and the Gap, the critic, the chronicle) on a local model.
    if (!proposeModel) { console.error('serv: the proposer needs a SERV catalogue model: pass --propose-model <id> (e.g. gpt-5.4-nano, claude-haiku-4.5; feature suffixes such as -serv-kronos ride on the id)'); process.exit(2) }
    if (!assayModel && !servBoth) { console.error('serv: one seat, never both, never the default — pass --assay-model <local model> for the prover (or --serv-both to put both seats behind one intermediary; run.json will record phiObservers: 0)'); process.exit(2) }
    const P = proposalsFile ? { provider: null, model: proposeModel } : { provider: 'serv', model: proposeModel }
    const A = servBoth ? { provider: 'serv', model: assayModel || proposeModel } : { provider: 'ollama', model: assayModel }
    const proverRt = await makeRt(A.provider, A.model)
    const proposeRt = proposalsFile ? proverRt : await makeRt(P.provider, P.model)
    base = pair(proposeRt, proverRt)
    models = { proposer: tag(P), prover: tag(A) }
    seatModels = { proposer: P.model, prover: A.model }
    phiObservers = servBoth ? 0 : 1
    if (servBoth) log('serv: --serv-both — both seats behind one intermediary; phiObservers: 0 will be recorded')
    if (servRaw) log('serv: raw mode — x-openserv-disable-braid: true on every SERV call')
    if (servShadow) log(`serv: shadow agent declared (hint: ${JSON.stringify(servShadow.hint)}, max_iterations ${servShadow.max_iterations})`)
  } else { console.error('run: unknown driver ' + driver + ' (stub · ollama · anthropic · openai · split · multi · serv)'); process.exit(2) }
} catch (e) { console.error('run: ' + (e && e.message || e)); process.exit(2) }

console.log('resolved seats: ' + JSON.stringify(models))

// ---- 2. measure, code-side, if the instance carries a counting rule ---------
let measured = null
const measureTool = join(instance, 'tools', 'measure.mjs')
if (existsSync(measureTool)) {
  const m = spawnSync(process.execPath, [measureTool], { cwd: instance, encoding: 'utf8' })
  if (m.status !== 0) { console.error('run: tools/measure.mjs failed:\n' + (m.stderr || m.stdout)); process.exit(1) }
  measured = JSON.parse(m.stdout)
  const shown = JSON.stringify(measured)
  console.log('measured: ' + (shown.length > 400 ? `${shown.slice(0, 400)} …(${shown.length} chars; the full JSON is stored in runs/${runId}/run.json and handed to every prompt as ctx.args.measured)` : shown))
}

// ---- 3. the run secret + source binding (after-commit, grind-proof) ---------
const saltSecret = randomBytes(32).toString('hex')   // never written anywhere

const sourceHash = baseConfig.sourceFile && existsSync(join(instance, baseConfig.sourceFile)) ? sha256Hex(readFileSync(join(instance, baseConfig.sourceFile), 'utf8')) : null

// ---- 4. seat models on the config, so the engine records Φ_inference --------
const seatOpts = { ...(baseConfig.seatOpts || {}) }
if (seatModels.proposer !== 'stub') seatOpts.propose = { ...(seatOpts.propose || {}), model: seatModels.proposer }
if (seatModels.prover !== 'stub') seatOpts.assay = { ...(seatOpts.assay || {}), model: seatModels.prover }
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
let result
try { result = await runHarness(config, rt, { repo: instance, root, runId, saltSecret, sourceHash, measured }) }
catch (e) { console.error('run: ' + (e && e.message || e)); console.error(`run: nothing was written to runs/${runId}`); process.exit(2) }

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
const servUsage = servRts.flatMap(r => r.usage || [])
const summary = { name: result.name, runId, driver, status: result.status, rounds: result.rounds, tally: result.tally, confirmed: result.confirmed, models, phiInference: models.proposer === models.prover ? 0 : 1, ...(phiObservers === null ? {} : { phiObservers }), measured, sourceHash, keystoneTodo: result.keystoneTodo, ...(servUsage.length ? { usage: servUsage } : {}) }
mkdirSync(join(instance, 'runs', runId), { recursive: true })
writeJson(join(instance, 'runs', runId, 'run.json'), summary)

// ---- 8. report --------------------------------------------------------------
console.log('\n' + JSON.stringify(summary, null, 2))
const shownInstance = /\s/.test(instance) ? JSON.stringify(instance.replace(/\\/g, '/')) : instance.replace(/\\/g, '/')
console.log(`\nverify:  node tools/verify_run.mjs ${shownInstance} ${runId}`)
console.log(`render:  node tools/render_run.mjs ${shownInstance} ${runId}`)
if (result.status !== 'COMPLETE') process.exit(1)
