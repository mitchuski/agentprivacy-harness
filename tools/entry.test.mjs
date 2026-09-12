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

// A fake Ollama endpoint observes the actual selected models and boot inputs.
const calls = []
const server = createServer(async (req, res) => {
  let raw = ''; for await (const chunk of req) raw += chunk
  const body = JSON.parse(raw); calls.push(body)
  const keys = body.format?.required || []
  let value
  if (keys.includes('leverCosts')) value = { metric: 100, stale: false, leverCosts: [] }
  else if (keys.includes('proposals')) value = { proposals: [{ leverId: 'test', title: 'test', lens: 'test', rationale: 'test', expectedMetric: 99, hardConstraintNote: 'test', diffPlan: 'none' }] }
  else if (keys.includes('seedHex')) value = { seedHex: '0'.repeat(64), draw: 'test', transcript: 'fake endpoint' }
  else if (keys.includes('status')) value = { leverId: 'test', status: 'BLOCKED', evidence: 'fake endpoint does not evaluate' }
  else if (keys.includes('classifications')) value = { classifications: [], nextLead: 'stop' }
  else value = 'Test chronicle; no real model or evaluation.'
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ message: { content: typeof value === 'string' ? value : JSON.stringify(value) } }))
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
} finally { await new Promise(r => server.close(r)) }
console.log('Entry regressions PASS: scaffold paths/preservation, source record, safe discovery, salted template, actual seat routing and boot inputs.')
