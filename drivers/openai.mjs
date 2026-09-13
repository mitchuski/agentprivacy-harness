// drivers/openai.mjs — the OpenAI-compatible seat driver, over plain fetch.
//
// Speaks the Chat Completions shape (POST {base}/v1/chat/completions) that
// OpenAI, Groq, Together, Mistral, vLLM, LM Studio and Ollama's own /v1 all
// accept, so one driver reaches any of them. Same rt contract as the other
// drivers; seats are pure data (the model returns JSON matching the seat
// schema; the runner does every hash and every write).
//
// Endpoint and credentials come from the environment and are never logged:
//   OPENAI_BASE_URL   default https://api.openai.com; a local server is fine
//   OPENAI_API_KEY    required for the default base; optional for a base you set
//
// Structured output: `response_format: json_schema` first; a server that
// rejects it (400) is retried once with `json_object`; then one repair retry
// on a parse or shape miss; null on hard failure, so the engine's dead-seat
// accounting reports an outage as an outage, never as exhaustion (GR-5).
//
// Per-seat models: opts.model (set by the engine from config.seatOpts, or by
// drivers/run.mjs) overrides the default. Nothing here downloads a model.

export function makeOpenAiRt({ model, apiKey = process.env.OPENAI_API_KEY, baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com', maxTokens = 16000, temperature = 0.2, concurrency = 2, timeoutMs = 600000, log = (m) => console.log('  ' + m) } = {}) {
  if (!model) throw new Error('openai driver: a model is required')
  if (!apiKey && !process.env.OPENAI_BASE_URL) throw new Error('openai driver: OPENAI_API_KEY is not set (or point OPENAI_BASE_URL at a local OpenAI-compatible server that needs no key)')
  const requiredKeys = (schema) => (schema && Array.isArray(schema.required)) ? schema.required : []
  const shapeOk = (v, schema) => !schema || (v && typeof v === 'object' && requiredKeys(schema).every(k => k in v))
  const endpoint = baseUrl.replace(/\/$/, '').replace(/\/v1$/, '') + '/v1/chat/completions'

  async function once(prompt, schema, seatModel, format) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const body = { model: seatModel, max_tokens: maxTokens, temperature, messages: [{ role: 'user', content: prompt }] }
      if (schema && format === 'json_schema') body.response_format = { type: 'json_schema', json_schema: { name: 'seat', schema } }
      else if (schema && format === 'json_object') body.response_format = { type: 'json_object' }
      const headers = { 'content-type': 'application/json' }
      if (apiKey) headers.authorization = 'Bearer ' + apiKey
      const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal })
      if (!res.ok) { const e = new Error(`openai ${res.status}: ${(await res.text()).slice(0, 300)}`); e.status = res.status; throw e }
      const data = await res.json()
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
  let format = 'json_schema'   // downgraded once, for the whole run, if the server rejects it

  return {
    async agent(prompt, opts = {}) {
      const seatModel = opts.model || model
      const schema = opts.schema || null
      const label = opts.label || 'seat'
      await acquire()
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          const p = attempt === 0 ? prompt : prompt + '\n\nYour previous answer was not valid JSON matching the required schema. Return ONLY the JSON object.'
          let text
          try {
            text = await withTransportRetry(() => once(p, schema, seatModel, format), label, seatModel)
          } catch (e) {
            if (schema && format === 'json_schema' && e.status === 400 && /response_format|json_schema/i.test(e.message)) {
              format = 'json_object'; log(`${label} (${seatModel}): server rejected json_schema; using json_object for this run`)
              try { text = await withTransportRetry(() => once(p, schema, seatModel, format), label, seatModel) }
              catch (e2) { log(`${label} (${seatModel}) failed: ${e2.message}`); return null }
            } else { log(`${label} (${seatModel}) failed: ${e.message}`); return null }
          }
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
