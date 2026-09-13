// Newcomer regressions: temporary files and a loopback fake model, no provider calls.
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync, spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { configSummary } from './console.mjs'
import template from '../templates/harness.config.mjs'
import { deriveHoldApart } from '../engine/dual_agent_loop.mjs'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = mkdtempSync(join(tmpdir(), 'harness-entry-test-'))
const run = (...args) => spawnSync(process.execPath, args, { cwd: tmp, encoding: 'utf8' })
const scaffold = (...args) => run(join(root, 'tools/new_instance.mjs'), ...args)
assert.equal(scaffold('one').status, 0)
assert(existsSync(join(tmp, 'one/harness.config.mjs')))
assert.equal(scaffold('intended', 'named').status, 0)
assert(existsSync(join(tmp, 'intended/harness.config.mjs')))
assert(!existsSync(join(tmp, 'named')))
assert.equal(scaffold('with space', 'project', '--prover', 'B', '--source', tmp).status, 0)
const configPath = join(tmp, 'with space/harness.config.mjs')
const before = readFileSync(configPath, 'utf8')
assert(before.includes('model: "B"'))
assert.equal(scaffold('with space', 'rename', '--prover', 'C').status, 0)
assert.equal(readFileSync(configPath, 'utf8'), before)
assert.equal(JSON.parse(readFileSync(join(tmp, 'with space/connection.local.json'))).researchRoot, tmp)
assert.equal(scaffold('bad', '--prover').status, 1)
assert(!existsSync(join(tmp, 'bad')))
assert.equal(scaffold('bad', '--unknown').status, 1)
assert.equal(scaffold('bad', '--source', 'missing').status, 1)

const hostile = join(tmp, 'hostile'); mkdirSync(hostile)
writeFileSync(join(hostile, 'harness.config.mjs'), 'throw new Error("CONFIG EXECUTED")')
assert.equal((await configSummary(hostile)).name, 'hostile')
const proposal = { leverId: 'test' }
const derived = deriveHoldApart(proposal, { gate: { N: 4, mode: 'census' }, saltSecret: 'secret' })
const gapPrompt = template.prompts.holdApart(proposal, 0, {}, derived)
assert(gapPrompt.includes(derived.seedHex))
assert(!gapPrompt.includes('sha256sum'))
assert(!template.prompts.assay(proposal, derived, 0, {}).includes('sha256sum'))

// The runner refuses an unfilled scaffold before building a driver or running
// the measurement adapter, and writes nothing (a TODO config used to run to
// COMPLETE, exit 0, with gate.N = 0 — newcomer review, 2026-09-12).
{
  const r = run(join(root, 'drivers/run.mjs'), '--instance', join(tmp, 'one'), '--driver', 'stub', '--run', 'blank')
  assert.notEqual(r.status, 0)
  assert(/TODO/.test(r.stderr) && /gate\.N/.test(r.stderr))
  assert(!existsSync(join(tmp, 'one/runs/blank')))
}
// An INCOMPLETE run (seats lost to infrastructure) is an outage, not a
// tampered chain: verify_run says INCOMPLETE and exits 0; --all counts it apart.
{
  mkdirSync(join(tmp, 'one/runs/outage'), { recursive: true })
  writeFileSync(join(tmp, 'one/runs/outage/run.json'), JSON.stringify({ runId: 'outage', status: 'INCOMPLETE', rounds: 1 }))
  const r = run(join(root, 'tools/verify_run.mjs'), join(tmp, 'one'), 'outage')
  assert.equal(r.status, 0); assert(/INCOMPLETE/.test(r.stdout))
  const all = run(join(root, 'tools/verify_run.mjs'), join(tmp, 'one'), '--all')
  assert.equal(all.status, 0); assert(/1 INCOMPLETE run/.test(all.stdout))
}
// A re-run says what a flag did NOT do instead of dropping it silently.
{
  const r = scaffold('with space', '--prover', 'D', '--source', tmp)
  assert.equal(r.status, 0)
  assert(/--prover D was NOT applied/.test(r.stdout) && /--source was NOT recorded/.test(r.stdout))
}

// A fake Ollama endpoint observes the actual selected models and boot inputs.
const calls = []
const server = createServer(async (req, res) => {
  let raw = ''; for await (const chunk of req) raw += chunk
  const body = JSON.parse(raw); calls.push({ ...body, url: req.url })
  const keys = body.format?.required || body.response_format?.json_schema?.schema?.required || []
  let value
  if (keys.includes('leverCosts')) value = { metric: 100, stale: false, leverCosts: [] }
  else if (keys.includes('proposals')) value = { proposals: [{ leverId: 'test', title: 'test', lens: 'test', rationale: 'test', expectedMetric: 99, hardConstraintNote: 'test', diffPlan: 'none' }] }
  else if (keys.includes('seedHex')) value = { seedHex: '0'.repeat(64), draw: 'test', transcript: 'fake endpoint' }
  else if (keys.includes('status')) value = { leverId: 'test', status: 'BLOCKED', evidence: 'fake endpoint does not evaluate' }
  else if (keys.includes('classifications')) value = { classifications: [], nextLead: 'stop' }
  else value = 'Test chronicle; no real model or evaluation.'
  res.setHeader('content-type', 'application/json')
  const content = typeof value === 'string' ? value : JSON.stringify(value)
  // /v1/chat/completions answers in the OpenAI shape; /api/chat in Ollama's
  res.end(JSON.stringify(req.url.startsWith('/v1/') ? { choices: [{ message: { content } }] } : { message: { content } }))
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
try {
  const instance = join(tmp, 'model-instance')
  cpSync(join(root, 'examples/field-guide'), instance, { recursive: true })
  const p = join(instance, 'harness.config.mjs')
  writeFileSync(p, readFileSync(p, 'utf8').replace('export default {', "export default { seatOpts: { assay: { model: 'saved-B' } },"))
  for (const [id, extra, expected] of [['saved', [], 'saved-B'], ['explicit', ['--assay-model', 'explicit-C'], 'explicit-C']]) {
    calls.length = 0
    const args = [join(root, 'drivers/run.mjs'), '--instance', instance, '--driver', 'ollama', '--model', 'general-A', '--run', id, '--max-rounds', '1', '--host', `http://127.0.0.1:${server.address().port}`, ...extra]
    await new Promise((resolveRun, reject) => {
      const child = spawn(process.execPath, args, { cwd: root, stdio: 'ignore', timeout: 20000 })
      child.on('error', reject); child.on('exit', resolveRun)
    })
    const summary = JSON.parse(readFileSync(join(instance, 'runs', id, 'run.json')))
    assert.equal(summary.models.prover, expected)
    assert.equal(summary.models.proposer, 'general-A')
    assert(calls.some(c => c.model === expected && c.format?.required?.includes('status')))
    assert(calls.every(c => c.messages[0].content.includes('# GROUND RULES')))
  }

  // --driver multi: a provider per seat. The proposer's provider (openai, at a
  // local OpenAI-compatible base URL) holds propose:*; the prover's (ollama)
  // holds every other seat. run.json records provider:model; the wire carries
  // the bare model name. No real provider is reached.
  calls.length = 0
  const base = `http://127.0.0.1:${server.address().port}`
  await new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, [join(root, 'drivers/run.mjs'), '--instance', instance, '--driver', 'multi', '--propose-model', 'openai:prop-P', '--assay-model', 'ollama:prove-Q', '--run', 'multi', '--max-rounds', '1', '--host', base], { cwd: root, stdio: 'ignore', timeout: 20000, env: { ...process.env, OPENAI_BASE_URL: base, OPENAI_API_KEY: 'test-not-a-key' } })
    child.on('error', reject); child.on('exit', resolveRun)
  })
  const multi = JSON.parse(readFileSync(join(instance, 'runs', 'multi', 'run.json')))
  assert.deepEqual(multi.models, { proposer: 'openai:prop-P', prover: 'ollama:prove-Q' })
  assert.equal(multi.phiInference, 1)
  const isPropose = (c) => (c.response_format?.json_schema?.schema?.required || c.format?.required || []).includes('proposals')
  const proposeCalls = calls.filter(isPropose), otherCalls = calls.filter(c => !isPropose(c))
  assert(proposeCalls.length > 0 && proposeCalls.every(c => c.url === '/v1/chat/completions' && c.model === 'prop-P'))
  assert(otherCalls.length > 0 && otherCalls.every(c => c.url === '/api/chat' && c.model === 'prove-Q'))
} finally { await new Promise(r => server.close(r)) }
console.log('Entry regressions PASS: scaffold paths/preservation, source record, safe discovery, salted template, runner refuses TODOs, INCOMPLETE runs, re-run notes, actual seat routing, multi-provider routing and boot inputs.')
