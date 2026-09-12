// drivers/ollama.mjs — the local-model seat driver: a model on your machine
// holds the seats. Zero dependencies; the only network hop is loopback or
// LAN to an Ollama server.
//
// Implements the engine's rt contract { agent, parallel, pipeline, phase, log }.
// Seats are pure data: the model returns JSON matching the seat schema and
// the runner (drivers/run.mjs) does every hash and every write. Structured
// output uses Ollama's `format` parameter (a JSON schema); one repair retry on
// a parse or shape miss; null on hard failure, so the engine's dead-seat
// accounting reports an outage as an outage, never as exhaustion (GR-5).
//
// Per-seat models: opts.model (set by the engine from config.seatOpts, or by
// the runner's --propose-model / --assay-model) overrides the default. Two
// different models in the proposer's and prover's seats is what makes
// Φ_inference = 1 (see engine/conform.mjs, D4b).

// numCtx: Ollama's default context is 4096 tokens, which a propose prompt that
// carries a whole artefact plus a full rewrite in its answer will overflow;
// 16384 covers every example here. Raise it for larger artefacts.
export function makeOllamaRt({ model, host = 'http://127.0.0.1:11434', concurrency = 1, timeoutMs = 900000, temperature = 0.2, numCtx = 16384, log = (m) => console.log('  ' + m) } = {}) {
  if (!model) throw new Error('ollama driver: a model is required (ollama list shows what the machine carries)')
  const requiredKeys = (schema) => (schema && Array.isArray(schema.required)) ? schema.required : []
  const shapeOk = (v, schema) => !schema || (v && typeof v === 'object' && requiredKeys(schema).every(k => k in v))

  async function chatOnce(prompt, schema, seatModel) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const body = { model: seatModel, stream: false, options: { temperature, num_ctx: numCtx }, messages: [{ role: 'user', content: prompt }] }
      if (schema) body.format = schema
      const res = await fetch(host.replace(/\/$/, '') + '/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal })
      if (!res.ok) throw new Error(`ollama ${res.status}: ${(await res.text()).slice(0, 200)}`)
      const data = await res.json()
      return data?.message?.content ?? ''
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

  // a fair queue: one local model serialises anyway
  let active = 0; const waiting = []
  const acquire = () => new Promise(r => { if (active < concurrency) { active++; r() } else waiting.push(r) })
  const release = () => { active--; const n = waiting.shift(); if (n) { active++; n() } }

  return {
    async agent(prompt, opts = {}) {
      const seatModel = opts.model || model
      const schema = opts.schema || null
      await acquire()
      try {
        for (let attempt = 0; attempt < 2; attempt++) {
          let text
          // A dropped connection is transport, not a model answer: retry it a
          // few times with a pause before declaring the seat dead (GR-5 —
          // an outage must be reported as an outage, but not manufactured by
          // giving up on the first hiccup while a 27B model is paging in).
          try { text = await withTransportRetry(() => chatOnce(attempt === 0 ? prompt : prompt + '\n\nYour previous answer was not valid JSON matching the required schema. Return ONLY the JSON object.', schema, seatModel), opts.label || 'seat', seatModel) }
          catch (e) { log(`${opts.label || 'seat'} (${seatModel}) failed: ${e.message}`); return null }
          if (!schema) return text
          try { const v = JSON.parse(text); if (shapeOk(v, schema)) return v } catch { /* repair once */ }
        }
        log(`${opts.label || 'seat'} (${seatModel}): no schema-valid JSON after one repair`)
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
