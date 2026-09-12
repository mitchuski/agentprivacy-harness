// drivers/serv.mjs — the OpenServ SERV Reasoning seat driver, over plain fetch.
//
// SERV (docs.openserv.ai) is BRAID as a service: every call runs through a
// generated bounded reasoning prompt on the vendor's side before the upstream
// model answers. The caller never sees that graph; the audit trail lives in
// the vendor's console. This driver therefore holds ONE seat of a round, never
// both, never the default — drivers/run.mjs enforces that mechanically
// (--driver serv seats the proposer here and requires a local prover; the
// deliberate exception --serv-both records phiObservers: 0 in run.json).
//
// Transport, as the SERV docs state it (read 2026-09-12, not run live):
//   POST {base}/v1/chat/completions            the universal endpoint
//   Authorization: Bearer $SERV_API_KEY         required
//   messages[0] = { role: 'system' }            REQUIRED — SERV rejects a call
//                                               without a system prompt (400)
//   response_format: json_schema, strict        structured output for a schema seat
//   x-openserv-disable-braid: true              raw mode: the reasoning layer off,
//                                               billed at the upstream tier
//   tools: [{ function: { name: 'serv_shadow_agent' } }]
//                                               the vendor's validate-and-revise
//                                               loop (hint, max_iterations 1–10)
// Model-level features are chosen by the model id the caller passes
// (e.g. gpt-5.4-nano-serv-kronos-multipath); the driver does not add suffixes.
//
// Every call's usage (prompt/completion/total tokens) is kept on rt.usage with
// the seat label, the model, and the raw/shadow flags, so tokens emitted under
// raw and under SERV can be compared from the run record — the pair that
// conjecture C8 ("BRAID compression reduces R_max") is waiting on. The number
// is admissible only from the run files, never from the vendor's console.
//
// Same rt contract as the other drivers { agent, parallel, pipeline, phase, log };
// seats are pure data; one repair retry on a parse or shape miss; null on hard
// failure, so an outage is reported as an outage, never as exhaustion (GR-5).

const DEFAULT_SYSTEM = 'You hold one seat of a dual-agent harness round. Answer only what the seat asks; return only what the schema allows.'

// 2026-09-12 live finding: gpt-5.4-nano through SERV rejects `max_tokens` (400 unsupported_parameter, "use max_completion_tokens"); temperature is sent only when the caller sets one.

// strictify — the endpoint's strict json_schema mode (live finding, 2026-09-12)
// requires every object to carry additionalProperties: false and to list every
// property as required. The harness seat schemas are plain JSON Schema with
// optional fields, so the wire copy makes optional fields nullable and lists
// them; the runner still validates against the seat's ORIGINAL required keys.
export function strictify(s) {
  if (!s || typeof s !== 'object') return s
  if (Array.isArray(s)) return s.map(strictify)
  const out = { ...s }
  if (out.properties && typeof out.properties === 'object') {
    const req = new Set(Array.isArray(out.required) ? out.required : [])
    const props = {}
    for (const [k, v] of Object.entries(out.properties)) {
      let q = strictify(v)
      if (!req.has(k)) {
        if (typeof q.type === 'string' && q.type !== 'null') q = { ...q, type: [q.type, 'null'] }
        else if (Array.isArray(q.type) && !q.type.includes('null')) q = { ...q, type: [...q.type, 'null'] }
        if (Array.isArray(q.enum) && !q.enum.includes(null)) q = { ...q, enum: [...q.enum, null] }
      }
      props[k] = q
    }
    out.properties = props
    out.required = Object.keys(props)
    out.additionalProperties = false
  }
  if (out.items) out.items = strictify(out.items)
  for (const key of ['anyOf', 'oneOf', 'allOf']) if (Array.isArray(out[key])) out[key] = out[key].map(strictify)
  return out
}

export function makeServRt({ model, apiKey = process.env.SERV_API_KEY, baseUrl = process.env.SERV_BASE_URL || 'https://inference-api.openserv.ai', raw = false, shadow = null, systemPrompt = DEFAULT_SYSTEM, maxTokens = 16000, temperature = 0.2, concurrency = 2, timeoutMs = 600000, log = (m) => console.log('  ' + m) } = {}) {
  if (!model) throw new Error('serv driver: a model is required (a SERV catalogue id, e.g. gpt-5.4-nano or claude-haiku-4.5)')
  if (!apiKey) throw new Error('serv driver: SERV_API_KEY is not set (console.openserv.ai issues one; the live call is the key holder\'s)')
  if (shadow && (typeof shadow !== 'object' || typeof shadow.hint !== 'string')) throw new Error('serv driver: shadow must be { hint, max_iterations }')
  const shadowIters = shadow ? Math.min(10, Math.max(1, Number(shadow.max_iterations) || 3)) : null
  const requiredKeys = (schema) => (schema && Array.isArray(schema.required)) ? schema.required : []
  const shapeOk = (v, schema) => !schema || (v && typeof v === 'object' && requiredKeys(schema).every(k => k in v))
  const endpoint = baseUrl.replace(/\/$/, '').replace(/\/v1$/, '') + '/v1/chat/completions'
  const usage = []

  async function once(prompt, schema, seatModel, label) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const body = {
        model: seatModel, max_completion_tokens: maxTokens, ...(temperature == null ? {} : { temperature }),
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
      }
      if (schema) body.response_format = { type: 'json_schema', json_schema: { name: 'seat', strict: true, schema: strictify(schema) } }
      if (shadow) body.tools = [{ type: 'function', function: { name: 'serv_shadow_agent', parameters: { type: 'object', properties: { hint: { type: 'string', default: shadow.hint }, max_iterations: { type: 'integer', default: shadowIters } } } } }]
      const headers = { 'content-type': 'application/json', authorization: 'Bearer ' + apiKey }
      if (raw) headers['x-openserv-disable-braid'] = 'true'
      const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal })
      if (!res.ok) { const e = new Error(`serv ${res.status}: ${(await res.text()).slice(0, 300)}`); e.status = res.status; throw e }
      const data = await res.json()
      const u = data.usage || {}
      usage.push({ label, model: seatModel, raw: !!raw, shadow: !!shadow, prompt_tokens: u.prompt_tokens ?? null, completion_tokens: u.completion_tokens ?? null, total_tokens: u.total_tokens ?? null })
      const msg = data.choices?.[0]?.message || {}
      if (msg.refusal) throw new Error('refusal: ' + String(msg.refusal).slice(0, 200))
      return typeof msg.content === 'string' ? msg.content : (Array.isArray(msg.content) ? msg.content.filter(b => b.type === 'text').map(b => b.text).join('') : '')
    } finally { clearTimeout(timer) }
  }

  async function withTransportRetry(fn, label, seatModel, tries = 4) {
    let last
    for (let i = 0; i < tries; i++) {
      try { return await fn() }
      catch (e) {
        last = e
        const transport = /fetch failed|ECONNRESET|ECONNREFUSED|socket hang up|aborted|EPIPE/i.test(String(e && e.message))
        if (!transport || i === tries - 1) throw e
        const wait = 3000 * (i + 1)
        log(`${label} (${seatModel}): transport failure (${e.message}); retry ${i + 1}/${tries - 1} in ${wait / 1000}s`)
        await new Promise(r => setTimeout(r, wait))
      }
    }
    throw last
  }

  let active = 0; const waiting = []
  const acquire = () => new Promise(r => { if (active < concurrency) { active++; r() } else waiting.push(r) })
  const release = () => { active--; const n = waiting.shift(); if (n) { active++; n() } }

  return {
    usage,
    async agent(prompt, opts = {}) {
      const seatModel = opts.model || model
      const schema = opts.schema || null
      const label = opts.label || 'seat'
      await acquire()
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          const p = attempt === 0 ? prompt : prompt + '\n\nYour previous answer was not valid JSON matching the required schema. Return ONLY the JSON object.'
          let text
          try { text = await withTransportRetry(() => once(p, schema, seatModel, label), label, seatModel) }
          catch (e) { log(`${label} (${seatModel}) failed: ${e.message}`); return null }
          if (!schema) return text
          try { const v = JSON.parse(text); if (shapeOk(v, schema)) return v } catch { /* repair once */ }
        }
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
