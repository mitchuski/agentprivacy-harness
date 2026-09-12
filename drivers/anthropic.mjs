// drivers/anthropic.mjs — the Claude API seat driver, over plain fetch.
//
// This repository ships with zero dependencies, so the driver speaks the
// Messages API directly (POST https://api.anthropic.com/v1/messages) rather
// than importing the SDK. Same rt contract as the other drivers; seats are
// pure data (the model returns JSON matching the seat schema via structured
// output; the runner does every hash and every write).
//
// Credentials: ANTHROPIC_API_KEY in the environment. Nothing is read from
// disk, nothing is logged. Defaults: model claude-opus-5 (thinking is adaptive
// by default on that model); refusal fallbacks are enabled by default via the
// server-side-fallback beta so a policy decline re-runs on a fallback model
// inside the same call — pass fallbacks:false to disable.
//
// Two different models in the two seats (--propose-model / --assay-model in
// drivers/run.mjs, or config.seatOpts) is what makes Φ_inference = 1.

export function makeAnthropicRt({ model = 'claude-opus-5', apiKey = process.env.ANTHROPIC_API_KEY, baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com', maxTokens = 16000, effort = 'high', fallbacks = true, concurrency = 4, timeoutMs = 600000, log = (m) => console.log('  ' + m) } = {}) {
  if (!apiKey) throw new Error('anthropic driver: ANTHROPIC_API_KEY is not set')
  const requiredKeys = (schema) => (schema && Array.isArray(schema.required)) ? schema.required : []
  const shapeOk = (v, schema) => !schema || (v && typeof v === 'object' && requiredKeys(schema).every(k => k in v))

  async function once(prompt, schema, seatModel) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const body = { model: seatModel, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }], output_config: { effort } }
      if (schema) body.output_config.format = { type: 'json_schema', schema }
      const headers = { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }
      if (fallbacks) { body.fallbacks = 'default'; headers['anthropic-beta'] = 'server-side-fallback-2026-07-01' }
      const res = await fetch(baseUrl.replace(/\/$/, '') + '/v1/messages', { method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal })
      if (!res.ok) throw new Error(`anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`)
      const data = await res.json()
      if (data.stop_reason === 'refusal') throw new Error('refusal' + (data.stop_details?.category ? ` (${data.stop_details.category})` : ''))
      return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
    } finally { clearTimeout(timer) }
  }

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
          try { text = await once(attempt === 0 ? prompt : prompt + '\n\nReturn ONLY the JSON object matching the schema.', schema, seatModel) }
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
