// drivers/claude_code.mjs — a tool-bearing seat driver: each seat is one
// headless Claude Code session, with shell and filesystem tools, behind
// whatever Messages endpoint the environment assigns.
//
// The API drivers (anthropic.mjs, openai.mjs) exchange text and JSON only, so
// their assay seat can never run a gate; it can only describe one. This driver
// exists for runs where the seat itself must build in scratch and execute the
// gate (SEAT_CONTRACT.md: "Missing executable evidence means BLOCKED"). Same rt
// contract as the other drivers: { agent, parallel, pipeline, phase, log }.
//
// Nothing here reads a credential. The endpoint and its placeholder token come
// from the caller (`env`), which takes them from the run's assigned gateway.
//
// A seat that dies returns null, as in every driver. Three signals from a
// metered gateway are handled here because a CLI exit is not feedback the model
// ever sees:
//   run_action=stop                  the run is over: rt.state.stopped = true, no retry
//   retryable=true                   bounded backoff, then one more attempt
//   reservation exceeds the budget   halve the output cap, one more attempt
// Anything else is recorded and the seat is dead for this round.

import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// The first balanced JSON object in a text, tolerant of prose and code fences.
export function extractJson(text) {
  const s = String(text || '')
  for (let start = s.indexOf('{'); start >= 0; start = s.indexOf('{', start + 1)) {
    let depth = 0, inStr = false, esc = false
    for (let i = start; i < s.length; i++) {
      const c = s[i]
      if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue }
      if (c === '"') inStr = true
      else if (c === '{') depth++
      else if (c === '}') { depth--; if (depth === 0) { try { return JSON.parse(s.slice(start, i + 1)) } catch { break } } }
    }
  }
  return null
}

export function classifyFailure(text) {
  const t = String(text || '')
  if (/run_action["'\s:=]+stop/i.test(t)) return 'stop'
  if (/model_reservation_exceeds_remaining_budget/i.test(t)) return 'reservation'
  if (/retryable["'\s:=]+true/i.test(t)) return 'retry'
  return 'unknown'
}

export function makeClaudeCodeRt({
  model,
  effort = null,
  cwd = process.cwd(),
  env = {},                       // endpoint + placeholder token, supplied by the caller
  bin = 'claude',
  maxOutputTokens = 32000,
  minOutputTokens = 4000,
  concurrency = 2,
  sessionTimeoutMs = 40 * 60 * 1000,
  deadlineEpochMs = null,         // absolute run deadline; sessions are clipped to it
  deadlineMarginMs = 5 * 60 * 1000,
  logDir = null,
  log = (m) => console.log('  ' + m),
} = {}) {
  if (!model) throw new Error('claude_code driver: a model is required')
  const state = { stopped: false, stopReason: null, calls: [], outputCap: maxOutputTokens }
  if (logDir) mkdirSync(logDir, { recursive: true })
  const requiredKeys = (schema) => (schema && Array.isArray(schema.required)) ? schema.required : []
  const shapeOk = (v, schema) => !schema || (v && typeof v === 'object' && requiredKeys(schema).every(k => k in v))
  let seq = 0

  const budgetMs = () => {
    if (!deadlineEpochMs) return sessionTimeoutMs
    return Math.max(0, Math.min(sessionTimeoutMs, deadlineEpochMs - Date.now() - deadlineMarginMs))
  }

  function once(prompt, seatModel, label, resume) {
    return new Promise((resolve) => {
      const timeout = budgetMs()
      if (timeout < 30000) return resolve({ ok: false, kind: 'deadline', text: '', raw: 'no time left for another session' })
      const args = ['-p', '--model', seatModel, '--output-format', 'json', '--dangerously-skip-permissions']
      if (effort) args.push('--effort', effort)
      if (resume) args.push('--resume', resume)
      const childEnv = { ...process.env, ...env, IS_SANDBOX: '1', DISABLE_AUTOUPDATER: '1', DISABLE_TELEMETRY: '1',
        CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1', CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS: '1',
        CLAUDE_CODE_MAX_OUTPUT_TOKENS: String(state.outputCap),
        // every helper request rides the assigned model: nothing else is authorised
        ANTHROPIC_MODEL: seatModel, ANTHROPIC_SMALL_FAST_MODEL: seatModel, ANTHROPIC_DEFAULT_HAIKU_MODEL: seatModel,
        ANTHROPIC_DEFAULT_SONNET_MODEL: seatModel, ANTHROPIC_DEFAULT_OPUS_MODEL: seatModel, CLAUDE_CODE_SUBAGENT_MODEL: seatModel }
      for (const k of Object.keys(env)) if (env[k] == null) delete childEnv[k]
      const started = Date.now()
      let out = '', err = '', done = false
      let child
      try { child = spawn(bin, args, { cwd, env: childEnv, stdio: ['pipe', 'pipe', 'pipe'], detached: true }) }
      catch (e) { return resolve({ ok: false, kind: 'unknown', text: '', raw: 'spawn failed: ' + e.message }) }
      const killGroup = () => { try { process.kill(-child.pid, 'SIGKILL') } catch { try { child.kill('SIGKILL') } catch { /* gone */ } } }
      const timer = setTimeout(() => { if (!done) { err += '\n[driver] session timeout'; killGroup() } }, timeout)
      child.stdout.on('data', d => { out += d })
      child.stderr.on('data', d => { err += d; if (err.length > 200000) err = err.slice(-100000) })
      child.on('error', e => { err += '\n[driver] ' + e.message })
      child.on('close', (code) => {
        done = true; clearTimeout(timer)
        let parsed = null
        try { parsed = JSON.parse(out) } catch { parsed = extractJson(out) }
        const text = parsed && typeof parsed.result === 'string' ? parsed.result : ''
        const failed = code !== 0 || !parsed || parsed.is_error === true
        const call = { label, model: seatModel, ms: Date.now() - started, exit: code, isError: !!failed,
          sessionId: parsed?.session_id || null, usage: parsed?.usage || null, turns: parsed?.num_turns ?? null }
        state.calls.push(call)
        if (logDir) {
          const n = String(++seq).padStart(3, '0')
          const safe = String(label || 'seat').replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 60)
          try { writeFileSync(join(logDir, `${n}-${safe}.json`), JSON.stringify({ ...call, result: text, stderrTail: err.slice(-4000), stdoutTail: parsed ? undefined : out.slice(-4000) }, null, 2) + '\n') } catch { /* a log is not the work */ }
          try { appendFileSync(join(logDir, 'calls.jsonl'), JSON.stringify(call) + '\n') } catch { /* same */ }
        }
        if (failed) return resolve({ ok: false, kind: classifyFailure(out + '\n' + err), text, raw: (text || err || out).slice(-600), sessionId: call.sessionId })
        resolve({ ok: true, text, sessionId: call.sessionId })
      })
      child.stdin.on('error', () => { /* the child may exit before reading */ })
      child.stdin.end(prompt)
    })
  }

  async function attempt(prompt, seatModel, label, resume = null) {
    let backoff = 15000
    for (let tries = 0; tries < 4; tries++) {
      if (state.stopped) return { ok: false, kind: 'stop', text: '' }
      const r = await once(prompt, seatModel, label, resume)
      if (r.ok) return r
      if (r.kind === 'stop') { state.stopped = true; state.stopReason = r.raw; log(`${label}: the gateway ended the run — no further sessions`); return r }
      if (r.kind === 'deadline') { state.stopped = true; state.stopReason = 'deadline'; return r }
      if (r.kind === 'reservation') {
        const next = Math.floor(state.outputCap / 2)
        if (next < minOutputTokens) { state.stopped = true; state.stopReason = 'budget cannot reserve another request'; log(`${label}: budget cannot reserve another request — stopping`); return r }
        state.outputCap = next; log(`${label}: reservation exceeded the remaining budget — output cap now ${next}`); continue
      }
      if (r.kind === 'retry' && tries < 3) { log(`${label}: retryable gateway error — waiting ${backoff / 1000}s`); await sleep(backoff); backoff *= 2; continue }
      log(`${label} (${seatModel}) failed: ${String(r.raw).replace(/\s+/g, ' ').slice(0, 300)}`)
      return r
    }
    return { ok: false, kind: 'unknown', text: '' }
  }

  let active = 0; const waiting = []
  const acquire = () => new Promise(r => { if (active < concurrency) { active++; r() } else waiting.push(r) })
  const release = () => { active--; const n = waiting.shift(); if (n) { active++; n() } }

  return {
    state,
    async agent(prompt, opts = {}) {
      const seatModel = opts.model || model
      const schema = opts.schema || null
      const label = opts.label || 'seat'
      const tail = schema
        ? `\n\nWhen your work is finished, your FINAL message must be ONLY one JSON object matching this schema, with no prose and no code fence:\n${JSON.stringify(schema)}`
        : ''
      await acquire()
      try {
        const first = await attempt(prompt + tail, seatModel, label)
        if (!first.ok) return null
        if (!schema) return first.text
        const v = extractJson(first.text)
        if (shapeOk(v, schema)) return v
        // one repair, in the same session, so the work is not paid for twice
        const fix = await attempt(`Your final message was not a JSON object matching the schema. Do no further work. Reply with ONLY the JSON object.\n${JSON.stringify(schema)}`, seatModel, label + ':repair', first.sessionId)
        const w = fix.ok ? extractJson(fix.text) : null
        if (shapeOk(w, schema)) return w
        log(`${label} (${seatModel}): no schema-valid JSON after one repair`)
        return null
      } finally { release() }
    },
    parallel: async (thunks) => Promise.all(thunks.map(t => t().catch(() => null))),
    pipeline: async (items, ...stages) => Promise.all(items.map(async (item, i) => {
      let acc = item
      for (const stage of stages) { acc = await stage(acc, item, i); if (acc == null) return null }
      return acc
    })),
    phase: (name) => log(`— ${name} —`),
    log,
  }
}
