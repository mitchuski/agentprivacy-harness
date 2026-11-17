#!/usr/bin/env node
// openrsi/enter.mjs — the keystone for an OpenRSI lane.
//
// An OpenRSI run hands a harness one file ($OPENRSI_TASK), a workspace, a
// metered model gateway and a trusted `evaluate` command, then leaves it alone
// until the budget or the clock ends. This entrypoint seats the dual-agent
// loop inside that envelope:
//
//   1. scaffold a fresh instance (tools/new_instance.mjs) beside the workspace
//   2. canary phase: the assay seat builds the first fully valid candidate
//   3. rounds: engine/dual_agent_loop.mjs, one round per run; soulbae proposes
//      through two blind lenses, the Gap binds each committed proposal by hash,
//      soulbis builds in scratch and runs the full gate, the critic classifies
//   4. between rounds the keystone folds, and it trusts no seat to do so: it
//      re-runs the trusted evaluator on the frozen scratch itself, and only a
//      candidate the evaluator calls valid AND better moves frontier.json and
//      the candidate path (GR-1, GR-7, GR-10)
//
// Measure, Gap and Chronicle are held by code here: they are counting, hashing
// and filing, and paying a model for them is how a round dies of its own weight.
//
// With no gateway (a packaging smoke test) the stub driver holds the model
// seats: the loop, the hashes and the files are exercised, nothing is graded.
//
// The door stays the First Person's (T6): nothing here submits, publishes or
// leaves the sandbox. Folding a candidate inside the run is the keystone's
// step; sending a run to a board is a person's.

import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync, readdirSync, rmSync, cpSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { runHarness, bootPreamble } from '../engine/dual_agent_loop.mjs'
import { canonicalize, hashCanon } from '../engine/gap.mjs'
import { makeStubRt } from '../drivers/stub.mjs'
import { makeClaudeCodeRt } from '../drivers/claude_code.mjs'
import { makeConfig, canaryPrompt, readData, slug } from './lane.config.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(join(here, '..')).replace(/\\/g, '/')
const say = (event, data = {}) => console.log(JSON.stringify({ event, ...data }))
const log = (m) => console.log('  ' + m)
const sha = (s) => createHash('sha256').update(s).digest('hex')
const readJson = (p, fallback = null) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return fallback } }
const writeJson = (p, v) => writeFileSync(p, JSON.stringify(v, null, 2) + '\n')

// ---- the task ---------------------------------------------------------------
const taskFile = process.env.OPENRSI_TASK
if (!taskFile || !existsSync(taskFile)) { console.error('enter: OPENRSI_TASK does not name a task file'); process.exit(2) }
const task = JSON.parse(readFileSync(taskFile, 'utf8'))
const workspace = resolve(task.workspace || process.env.OPENRSI_WORKSPACE || process.cwd()).replace(/\\/g, '/')
const candidatePaths = Array.isArray(task.candidate_paths) ? task.candidate_paths.filter(p => typeof p === 'string' && p && !p.includes('..')) : []
const smoke = task.evidence === 'smoke' || !task.gateway
const modelName = (m) => typeof m === 'string' ? m : (m && (m.request_model || m.name || m.model || m.id)) || null
const models = [task.model, ...(Array.isArray(task.models) ? task.models : [])].map(modelName).filter(Boolean).filter((m, i, a) => a.indexOf(m) === i)
const provider = task.model_provider || (Array.isArray(task.models) && task.models[0] && task.models[0].provider) || (task.model && task.model.provider) || null
const deadlineEpochMs = process.env.DUNGENESS_AGENT_DEADLINE_EPOCH ? Number(process.env.DUNGENESS_AGENT_DEADLINE_EPOCH) * 1000 : null
const msLeft = () => deadlineEpochMs ? deadlineEpochMs - Date.now() : Infinity
const maxUsd = Number(task.budget && task.budget.max_usd) || null
const problemId = slug((task.problem && task.problem.id) || 'task')

// ---- the instance -----------------------------------------------------------
// Beside the candidate when the workspace is writable; a read/write mount does
// not promise that this process may create a directory in it, so fall back to
// the temp directory rather than die before a seat is seated.
const instance = [process.env.HARNESS_INSTANCE, `${workspace}/.mage/${problemId}_mage`, `${tmpdir()}/mage/${problemId}_mage`]
  .filter(Boolean).map(p => p.replace(/\\/g, '/'))
  .find(p => { try { mkdirSync(dirname(p), { recursive: true }); return true } catch { return false } })
if (!instance) { console.error('enter: no writable place for the instance'); process.exit(2) }
const scaffold = spawnSync(process.execPath, [join(root, 'tools', 'new_instance.mjs'), instance, `${problemId}_mage`], { encoding: 'utf8' })
if (scaffold.status !== 0) { console.error('enter: could not scaffold the instance:\n' + (scaffold.stderr || scaffold.stdout)); process.exit(2) }
const bestDir = `${instance}/best`
for (const d of ['notes', 'runs', 'best']) mkdirSync(join(instance, d), { recursive: true })
for (const f of ['notes/LIBRARY.md', 'notes/NEXT_LEAD.md']) if (!existsSync(join(instance, f))) writeFileSync(join(instance, f), '')

const metricDoc = JSON.stringify((task.problem_document && task.problem_document.metric) || '')
const direction = /maxim|higher is better|"direction":"max/i.test(metricDoc) ? 'max' : 'min'
const better = (a, b) => b == null || (direction === 'max' ? a > b : a < b)
const sessionMinutes = Math.max(5, Math.min(40, Math.floor((msLeft() === Infinity ? 40 * 60000 : msLeft() / 4) / 60000)))
const evaluateTarget = (scratchCandidate) => candidatePaths.length === 1 ? `${scratchCandidate}/${candidatePaths[0]}` : scratchCandidate
const lane = {
  name: `${problemId}_mage`, instance, workspace, candidatePaths, bestDir, direction, sessionMinutes,
  evaluateHint: candidatePaths.length === 1 ? `\`evaluate --json {CANDIDATE}/${candidatePaths[0]}\`.` : '`evaluate --json {CANDIDATE}`.',
}
const config = makeConfig(lane)

// ---- candidate snapshots (contents only: a mount root is never renamed) ------
const listFiles = (dir, base = dir) => !existsSync(dir) ? [] : readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? listFiles(join(dir, e.name), base) : e.isFile() ? [relative(base, join(dir, e.name)).replace(/\\/g, '/')] : []).sort()
const treeHash = (dir) => sha(listFiles(dir).map(f => f + '\0' + sha(readFileSync(join(dir, f)))).join('\n'))
const emptyInto = (dir) => { if (existsSync(dir)) for (const e of readdirSync(dir)) rmSync(join(dir, e), { recursive: true, force: true }) }
function copyCandidate(fromRoot, toRoot) {
  for (const cp of candidatePaths) {
    const src = join(fromRoot, cp), dst = join(toRoot, cp)
    if (!existsSync(src)) continue
    if (statSync(src).isDirectory()) { mkdirSync(dst, { recursive: true }); emptyInto(dst); cpSync(src, dst, { recursive: true }) }
    else { mkdirSync(dirname(dst), { recursive: true }); writeFileSync(dst, readFileSync(src)) }   // write through: the file may be a mount
  }
}

// ---- the trusted evaluator, run by the keystone ------------------------------
const findKey = (o, key, depth = 0) => {
  if (!o || typeof o !== 'object' || depth > 4) return undefined
  if (key in o) return o[key]
  for (const v of Object.values(o)) { const r = findKey(v, key, depth + 1); if (r !== undefined) return r }
  return undefined
}
function evaluate(scratchCandidate) {
  const target = evaluateTarget(scratchCandidate)
  const r = spawnSync('evaluate', ['--json', target], { cwd: workspace, encoding: 'utf8', timeout: Math.max(60000, Math.min(45 * 60000, msLeft() - 30000)), maxBuffer: 16 * 1024 * 1024 })
  let doc = null
  try { doc = JSON.parse(r.stdout) } catch { const m = /\{[\s\S]*\}/.exec(r.stdout || ''); if (m) { try { doc = JSON.parse(m[0]) } catch { /* not JSON */ } } }
  // An explicit validity field wins; otherwise the evaluator's own status
  // decides. A penalty score beside a non-ok status is not a score.
  const v = doc ? (findKey(doc, 'valid') ?? findKey(doc, 'validity') ?? findKey(doc, 'is_valid') ?? doc.status) : undefined
  const valid = v === true || (typeof v === 'string' && /^(valid|passed|pass|ok|true)$/i.test(v)) || (v && typeof v === 'object' && v.valid === true)
  const s = doc ? (findKey(doc, 'score') ?? findKey(doc, 'metric')) : undefined
  const score = typeof s === 'number' && Number.isFinite(s) ? s : (s && typeof s === 'object' && typeof s.value === 'number' ? s.value : null)
  return { ran: r.status === 0 || !!doc, exit: r.status, valid: !!valid && score != null, score, doc, tail: doc ? null : String((r.stdout || '') + (r.stderr || '') + (r.error ? r.error.message : '')).slice(-1200) }
}

// ---- frontier, ledger, notes (keystone-only writes) --------------------------
const frontierPath = join(instance, 'frontier.json')
const today = () => new Date().toISOString().slice(0, 10)
const frontier = { ...(readJson(frontierPath, {})), updated: today(), objective: config.objective,
  baseline: { metric: null, date: today(), how: 'blank scaffold: no valid candidate exists until the canary phase passes the full gate' },
  best: { metric: null, leverIds: [], evidence: null },
  openTarget: { id: 'OT-1', statement: 'build the canary: the first candidate the trusted evaluator reports fully valid', status: 'OPEN' } }
writeJson(frontierPath, frontier)
const ledgerPath = join(instance, 'runs', 'ledger.jsonl')
let ledgerHead = '0'.repeat(64)
const ledger = (row) => { const body = { ...row, at: new Date().toISOString(), prev: ledgerHead }; ledgerHead = sha(canonicalize(body)); appendFileSync(ledgerPath, JSON.stringify({ ...body, hash: ledgerHead }) + '\n') }

// Seed best/ with the starting scaffold so a seat always has something to copy.
copyCandidate(workspace, bestDir)

function fold(scratchDir, leverId, where) {
  const scratchCandidate = join(String(scratchDir || ''), 'candidate').replace(/\\/g, '/')
  if (!scratchDir || !existsSync(scratchCandidate) || !resolve(scratchCandidate).replace(/\\/g, '/').startsWith(instance + '/runs/')) {
    ledger({ kind: 'fold-refused', leverId, where, reason: 'no scratch candidate inside this instance' }); return false
  }
  const hash = treeHash(scratchCandidate)
  const ev = evaluate(scratchCandidate)
  writeJson(join(scratchDir, 'keystone_evaluate.json'), { hash, valid: ev.valid, score: ev.score, exit: ev.exit, response: ev.doc, tail: ev.tail })
  const ok = ev.valid && better(ev.score, frontier.best.metric)
  ledger({ kind: 'keystone-assay', leverId, where, candidate: hash, valid: ev.valid, score: ev.valid ? ev.score : null, status: ev.doc ? ev.doc.status ?? null : null,
    evaluationsRemaining: ev.doc ? ev.doc.submissions_remaining ?? null : null, folded: ok, frontierBefore: frontier.best.metric })
  say('keystone_assay', { leverId, valid: ev.valid, score: ev.score, folded: ok, frontier: frontier.best.metric })
  if (!ok) return false
  copyCandidate(scratchCandidate, bestDir)       // the saved best first: it is what a restore reads
  copyCandidate(scratchCandidate, workspace)     // then the candidate path the run is judged on
  if (frontier.baseline.metric == null) frontier.baseline = { metric: ev.score, date: today(), how: 'the canary: first candidate the trusted evaluator reported fully valid' }
  frontier.best = { metric: ev.score, leverIds: [...(frontier.best.leverIds || []), leverId], evidence: relative(instance, join(scratchDir, 'keystone_evaluate.json')).replace(/\\/g, '/') }
  frontier.updated = today()
  frontier.openTarget = { id: 'OT-' + (frontier.best.leverIds.length + 1), statement: `beat ${ev.score} under the full gate`, status: 'OPEN' }
  writeJson(frontierPath, frontier)
  return true
}

// ---- the seats held by code ---------------------------------------------------
const runStatus = () => { const r = spawnSync('run-status', [], { encoding: 'utf8', timeout: 20000 }); return r.status === 0 ? String(r.stdout || '').trim().slice(0, 1500) : null }
const measureSeat = () => ({ metric: frontier.best.metric, stale: false,
  leverCosts: [], notes: [`best ${frontier.best.metric} (levers: ${(frontier.best.leverIds || []).join(', ') || 'none'})`, 'next lead from the last critic: ' + (readFileSync(join(instance, 'notes/NEXT_LEAD.md'), 'utf8').trim() || 'none yet'), 'run status: ' + (runStatus() || 'unavailable')].join(' | ') })
function gapSeat(prompt) {
  const d = readData(prompt); if (!d) return null
  const dir = `${d.runDir}/p${d.i + 1}-${slug(d.proposal.leverId)}`
  mkdirSync(dir, { recursive: true })
  const canon = canonicalize(d.proposal), seedHex = hashCanon(canon)
  writeFileSync(join(dir, 'proposal_canon.json'), canon)
  const gap = { seedHex, draw: "the trusted evaluator's own test inputs, derived by the evaluator from the frozen candidate; no seat draws or sees them",
    transcript: `seedHex = sha256(proposal_canon.json) binds the verdict to the committed proposal; check with: sha256sum ${dir}/proposal_canon.json` }
  writeJson(join(dir, 'gap.json'), gap)
  return gap
}
function chronicleSeat(prompt) {
  const d = readData(prompt) || {}
  const rows = (d.verdicts || []).map(v => `| ${v.leverId} | ${v.status} | ${v.metric ?? ''} | ${String(v.failingCheck || v.gateResult || '').replace(/\|/g, '/').slice(0, 160)} |`)
  return `# Round ${d.roundId}\n\nFrontier at open: ${frontier.best.metric}. Seat verdicts below are claims until the keystone's own evaluator run (runs/ledger.jsonl) confirms them.\n\n| lever | verdict | metric | check |\n|---|---|---|---|\n${rows.join('\n') || '| (none) | | | |'}\n\nNext lead: ${(d.critic && d.critic.nextLead) || 'none'}\n`
}

// ---- the driver ----------------------------------------------------------------
let base
if (smoke) base = makeStubRt()
else {
  if (!models.length) { console.error('enter: the task assigns no model'); process.exit(2) }
  const modelEntry = (Array.isArray(task.models) ? task.models : []).find(m => m && typeof m === 'object' && (m.base_url || m.url || m.endpoint)) || {}
  const gateway = String(modelEntry.base_url || modelEntry.url || modelEntry.endpoint || task.gateway).replace(/\/+$/, '').replace(/\/v1(\/messages)?$/, '')
  // The placeholder is public; the gateway holds the real access. One route per provider.
  const auth = provider === 'claude-subscription'
    ? { CLAUDE_CODE_OAUTH_TOKEN: 'testbed', ANTHROPIC_AUTH_TOKEN: null, ANTHROPIC_API_KEY: null }
    : { ANTHROPIC_AUTH_TOKEN: 'testbed', CLAUDE_CODE_OAUTH_TOKEN: null, ANTHROPIC_API_KEY: null }
  base = makeClaudeCodeRt({ model: models[0], effort: task.reasoning_effort || null, cwd: workspace,
    env: { ANTHROPIC_BASE_URL: gateway, ...auth }, concurrency: 2, deadlineEpochMs,
    maxOutputTokens: !maxUsd ? 16000 : maxUsd >= 8 ? 24000 : maxUsd >= 3 ? 12000 : 6000,
    sessionTimeoutMs: sessionMinutes * 60000, logDir: join(instance, 'runs', 'sessions'), log })
  // A second assigned model seats the prover's side, so the pair is cross-model.
  if (models[1]) config.seatOpts = { assay: { model: models[1] }, critic: { model: models[1] } }
  say('seated', { provider, proposer: models[0], prover: models[1] || models[0], gateway, direction, sessionMinutes, candidatePaths, instance })
}
const stopped = () => !!(base.state && base.state.stopped) || msLeft() < 4 * 60000
const rt = { ...base, log, agent: async (prompt, opts = {}) => {
  const label = String(opts.label || '')
  if (label.startsWith('measure:')) return measureSeat()
  if (label.startsWith('gap:')) return gapSeat(prompt)
  if (label.startsWith('chronicle:')) return chronicleSeat(prompt)
  return base.agent(prompt, opts)
} }

// ---- smoke: the machinery, no model, nothing graded ------------------------------
if (smoke) {
  const result = await runHarness(config, rt, { repo: instance, root, runId: 'smoke' })
  writeJson(join(instance, 'runs', 'smoke.run.json'), result)
  say('smoke', { status: result.status, rounds: result.rounds, tally: result.tally, candidate_paths: candidatePaths, note: 'stub driver: the loop ran, no candidate was graded' })
  process.exit(result.status === 'COMPLETE' ? 0 : 1)
}

// ---- canary phase -----------------------------------------------------------------
let attempt = 0, quickDeaths = 0, previous = null
while (frontier.best.metric == null && !stopped()) {
  attempt += 1
  const scratch = `${instance}/runs/canary/c${attempt}`
  mkdirSync(`${scratch}/candidate`, { recursive: true })
  if (previous) cpSync(previous, scratch, { recursive: true, filter: (s) => !/keystone_evaluate\.json$|verdict\.json$/.test(s) })
  else copyCandidate(workspace, `${scratch}/candidate`)
  const t0 = Date.now()
  const verdict = await base.agent(`${bootPreamble(root, instance, 'soulbis-assay.md')}\n${canaryPrompt(lane, scratch, attempt)}`, { label: `canary:c${attempt}`, schema: config.schemas.verdict })
  ledger({ kind: 'canary-seat', attempt, status: verdict ? verdict.status : 'DEAD', metric: verdict ? verdict.metric ?? null : null })
  // The keystone runs the gate whatever the seat said: a seat that timed out may still have left a valid candidate.
  if (!fold(scratch, 'canary', `canary/c${attempt}`)) {
    quickDeaths = (!verdict && Date.now() - t0 < 90000) ? quickDeaths + 1 : 0
    if (quickDeaths >= 3) { say('canary_abandoned', { reason: 'three sessions died at once; an outage is not a search' }); break }
  }
  previous = scratch
}

// ---- rounds -----------------------------------------------------------------------
let round = 0, failedRuns = 0
while (frontier.best.metric != null && !stopped() && failedRuns < 3) {
  round += 1
  const runId = `r${round}`
  let result
  try { result = await runHarness(config, rt, { repo: instance, root, runId }) }
  catch (e) { ledger({ kind: 'run-error', runId, error: String(e && e.message || e).slice(0, 400) }); failedRuns += 1; continue }
  const detail = (result.detail || [])[0] || {}
  mkdirSync(join(instance, 'runs', runId), { recursive: true })
  writeJson(join(instance, 'runs', runId, 'run.json'), result)
  if (typeof detail.chronicleDraft === 'string') writeFileSync(join(instance, 'runs', runId, 'CHRONICLE_DRAFT.md'), chronicleSeat(config.prompts.chronicle(detail, {})))
  // Fold: every VALIDATED claim is re-run by the keystone, best claim first.
  const claims = (detail.verdictsByIndex || detail.verdicts || []).filter(v => v && v.status === 'VALIDATED' && v.scratchDir)
    .sort((a, b) => direction === 'max' ? (b.metric ?? -Infinity) - (a.metric ?? -Infinity) : (a.metric ?? Infinity) - (b.metric ?? Infinity))
  let folded = 0
  for (const v of claims) { if (stopped() && folded) break; if (fold(v.scratchDir, v.leverId, runId)) folded += 1 }
  // File what the seats returned as data (GR-10: seats return, the keystone serialises).
  for (const p of detail.proposals || []) if (p.libraryNotes) appendFileSync(join(instance, 'notes/LIBRARY.md'), `\n## ${runId} · ${p.lens}\n${String(p.libraryNotes).slice(0, 4000)}\n`)
  if (detail.critic) {
    for (const k of detail.critic.killedLeverDrafts || []) appendFileSync(join(instance, 'notes/KILLED_LEVERS.md'), `${String(k).trim().replace(/\n+/g, ' ')}  <!-- ${runId} -->\n`)
    if (detail.critic.nextLead) writeFileSync(join(instance, 'notes/NEXT_LEAD.md'), String(detail.critic.nextLead).trim() + '\n')
  }
  ledger({ kind: 'round', runId, status: result.status, tally: result.tally, claims: claims.length, folded, best: frontier.best.metric })
  say('round', { runId, status: result.status, tally: result.tally, claims: claims.length, folded, best: frontier.best.metric })
  failedRuns = result.status === 'COMPLETE' ? 0 : failedRuns + 1
}

// ---- close: the candidate path holds the best the evaluator confirmed ---------------
if (frontier.best.metric != null) copyCandidate(bestDir, workspace)
ledger({ kind: 'close', best: frontier.best.metric, rounds: round, canaryAttempts: attempt, stop: (base.state && base.state.stopReason) || (msLeft() < 4 * 60000 ? 'deadline' : failedRuns >= 3 ? 'three failed rounds' : 'canary not reached') })
say('closed', { best: frontier.best.metric, levers: frontier.best.leverIds, rounds: round, canaryAttempts: attempt, ledgerHead, sessions: base.state ? base.state.calls.length : 0 })
process.exit(0)
