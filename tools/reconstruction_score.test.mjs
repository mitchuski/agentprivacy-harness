import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { scoreReconstruction } from './reconstruction_score.mjs'

const fixture = () => ({
  schemaVersion: 1,
  run: { kind: 'synthetic-fixture', attackId: 'unit-test', model: 'none', view: 'synthetic permitted view',
    background: 'same synthetic prior', budget: 'one guess per field', datasetHash: 'a'.repeat(64), transcriptHash: 'b'.repeat(64) },
  records: [
    { id: 'one', withheld: { name: 'Synthetic Ada', city: 'Synthetic City' },
      attack: { name: 'Synthetic Ada', city: 'wrong' }, baseline: { name: null, city: 'Synthetic City' }, utility: { passed: 1, total: 2 } },
    { id: 'two', withheld: { name: 'Synthetic Bea' }, attack: { name: 'Synthetic Bea' }, baseline: { name: null }, utility: { passed: 1, total: 1 } },
  ],
})

test('counts sensitive recovery independently of complete record recovery and utility', () => {
  const out = scoreReconstruction(fixture())
  assert.equal(out.metrics.attackRecovery, 2 / 3)
  assert.equal(out.metrics.baselineRecovery, 1 / 3)
  assert.equal(out.metrics.recoveryUplift, 1 / 3)
  assert.equal(out.metrics.attackAllFactsExactRate, 1 / 2)
  assert.equal(out.metrics.attackFalseAssertionRate, 1 / 3)
  assert.equal(out.metrics.taskUtility, 2 / 3)
  assert.equal(out.status, 'SCORING_ONLY')
  assert.equal(JSON.stringify(out).includes('Synthetic Ada'), false)
  assert.equal(JSON.stringify(out).includes('synthetic permitted view'), false)
})
test('all abstentions are zero recovery and undefined false-assertion rate', () => {
  const input = fixture()
  for (const row of input.records) for (const key of Object.keys(row.attack)) row.attack[key] = null
  const out = scoreReconstruction(input)
  assert.equal(out.metrics.attackRecovery, 0)
  assert.equal(out.metrics.attackFalseAssertionRate, null)
  assert.equal(out.metrics.recoveryUplift, -1 / 3)
})
test('no normalization or semantic matching is silently applied', () => {
  const input = fixture()
  input.records[0].attack.name = 'synthetic ada'
  assert.equal(scoreReconstruction(input).counts.attackCorrect, 1)
})
for (const [name, mutate] of [
  ['empty population', x => { x.records = [] }],
  ['empty fact population', x => { x.records[0].withheld = {} }],
  ['duplicate record', x => { x.records.push(structuredClone(x.records[0])) }],
  ['missing guess', x => { delete x.records[0].attack.name }],
  ['extra guessed field', x => { x.records[0].attack.extra = 'guess' }],
  ['multiple guesses', x => { x.records[0].attack.name = ['a', 'b'] }],
  ['invalid utility', x => { x.records[0].utility.passed = 3 }],
  ['empty utility population', x => { x.records[0].utility = { passed: 0, total: 0 } }],
  ['missing budget', x => { delete x.run.budget }],
  ['malformed dataset digest', x => { x.run.datasetHash = 'not-a-hash' }],
  ['unsupported schema', x => { x.schemaVersion = 2 }],
  ['unknown metric input', x => { x.privacyCertified = true }],
]) test(`refuses ${name}`, () => {
  const input = fixture(); mutate(input)
  assert.throws(() => scoreReconstruction(input))
})

test('CLI preserves input-byte provenance and refuses malformed input without echoing it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'reconstruction-score-'))
  const path = join(dir, 'input.json')
  const cli = fileURLToPath(new URL('./reconstruction_score.mjs', import.meta.url))
  try {
    const bytes = JSON.stringify(fixture())
    writeFileSync(path, bytes)
    let run = spawnSync(process.execPath, [cli, path], { encoding: 'utf8' })
    assert.equal(run.status, 0, run.stderr)
    const result = JSON.parse(run.stdout)
    assert.equal(result.inputSha256, createHash('sha256').update(bytes).digest('hex'))
    assert.equal(result.status, 'SCORING_ONLY')
    assert.equal(run.stdout.includes('Synthetic Ada'), false)
    writeFileSync(path, '{"private":"DO_NOT_ECHO_THIS",BROKEN}')
    run = spawnSync(process.execPath, [cli, path], { encoding: 'utf8' })
    assert.equal(run.status, 1)
    assert.equal(run.stdout, '')
    assert.equal(run.stderr.includes('DO_NOT_ECHO_THIS'), false)
    assert.match(run.stderr, /invalid JSON/)
  } finally {
    unlinkSync(path)
    rmdirSync(dir)
  }
})
