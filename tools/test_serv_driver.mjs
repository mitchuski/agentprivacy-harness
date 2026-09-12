#!/usr/bin/env node
// tools/test_serv_driver.mjs — proves drivers/serv.mjs against a local mock of
// SERV's /v1/chat/completions. No network beyond loopback, no key: the mock
// checks the request shape the SERV docs require (Bearer auth, a system
// message first, strict json_schema when a schema is sent, the raw-mode header
// exactly when raw, the serv_shadow_agent tool exactly when shadow is set) and
// answers like the API. The live call is the key holder's; this is the shape.

import { createServer } from 'node:http'
import { makeServRt, strictify } from '../drivers/serv.mjs'

const failures = []
const check = (cond, msg) => { if (!cond) failures.push(msg) }
const seen = []

const server = createServer((req, res) => {
  let raw = ''
  req.on('data', c => { raw += c })
  req.on('end', () => {
    const reply = (code, obj) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)) }
    if (req.method !== 'POST' || req.url !== '/v1/chat/completions') return reply(404, { error: { message: 'unknown path' } })
    if (!/^Bearer .+/.test(req.headers.authorization || '')) return reply(401, { error: { message: 'missing or invalid api key' } })
    let body
    try { body = JSON.parse(raw) } catch { return reply(400, { error: { message: 'invalid json' } }) }
    const first = (body.messages || [])[0]
    if (!first || first.role !== 'system') return reply(400, { error: { message: 'a system prompt is required' } })
    seen.push({ headers: req.headers, body })
    const schema = body.response_format?.json_schema?.schema || null
    const content = schema ? JSON.stringify({ status: 'VALIDATED', note: 'mock seat' }) : 'plain text answer'
    reply(200, { id: 'mock', choices: [{ message: { role: 'assistant', content } }], usage: { prompt_tokens: 11, completion_tokens: 7, total_tokens: 18 } })
  })
})

await new Promise(r => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}`
const schema = { type: 'object', required: ['status', 'note'], properties: { status: { type: 'string' }, note: { type: 'string' } } }

try {
  // 1. the API's own rule, exercised directly: no system message → 400
  const bad = await fetch(base + '/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer x' }, body: JSON.stringify({ model: 'm', messages: [{ role: 'user', content: 'hi' }] }) })
  check(bad.status === 400, `mock: a call without a system message should be 400, got ${bad.status}`)
  const noKey = await fetch(base + '/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ model: 'm', messages: [{ role: 'system', content: 's' }] }) })
  check(noKey.status === 401, `mock: a call without a bearer token should be 401, got ${noKey.status}`)

  // 2. the driver, plain
  const rt = makeServRt({ model: 'gpt-5.4-nano', apiKey: 'test-key', baseUrl: base, log: () => {} })
  const text = await rt.agent('say something', { label: 'critic:r1' })
  check(text === 'plain text answer', `plain: expected the mock text, got ${JSON.stringify(text)}`)
  const obj = await rt.agent('answer the seat', { label: 'assay:lever-1', schema })
  check(obj && obj.status === 'VALIDATED' && obj.note === 'mock seat', `schema: expected a schema-valid object, got ${JSON.stringify(obj)}`)
  check(seen.length === 2, `plain+schema: expected 2 requests, got ${seen.length}`)
  check(seen[0].body.messages[0].role === 'system' && seen[0].body.messages[1].role === 'user', 'plain: first message must be system, second user')
  check(seen[0].body.messages[0].content.length > 0, 'plain: system message must not be empty')
  check(seen[0].body.response_format === undefined, 'plain: no response_format without a schema')
  check(seen[1].body.response_format?.type === 'json_schema' && seen[1].body.response_format.json_schema.strict === true, 'schema: response_format must be json_schema with strict: true')
  { const w = seen[1].body.response_format.json_schema.schema
    check(JSON.stringify(w) === JSON.stringify(strictify(schema)), 'schema: the wire schema must be the strict transform of the seat schema')
    check(w.additionalProperties === false && schema.required.every(k => (w.required || []).includes(k)), 'schema: strict transform keeps every original required key and closes the object') }
  for (const s of seen) {
    check(s.headers.authorization === 'Bearer test-key', 'auth: Bearer header must carry the key')
    check(s.headers['x-api-key'] === undefined, 'auth: no x-api-key header')
    check(s.headers['x-openserv-disable-braid'] === undefined, 'default: no raw-mode header unless raw')
    check(s.body.tools === undefined, 'default: no serv tools unless shadow')
    check(s.body.fallbacks === undefined && s.headers['anthropic-beta'] === undefined, 'default: no anthropic fallback beta')
    check(s.body.model === 'gpt-5.4-nano', 'model: the driver default reaches the wire')
  }

  // 3. per-seat model override
  await rt.agent('x', { label: 'propose:lens', model: 'claude-haiku-4.5' })
  check(seen[2].body.model === 'claude-haiku-4.5', 'model: opts.model must override the default')

  // 4. raw mode
  const rawRt = makeServRt({ model: 'gpt-5.4-nano', apiKey: 'test-key', baseUrl: base, raw: true, log: () => {} })
  await rawRt.agent('x', { label: 'assay:raw', schema })
  check(seen[3].headers['x-openserv-disable-braid'] === 'true', 'raw: x-openserv-disable-braid: true must be sent')
  check(seen[3].body.tools === undefined, 'raw: no serv tools unless shadow')

  // 5. shadow agent
  const shadowRt = makeServRt({ model: 'gpt-5.4-nano', apiKey: 'test-key', baseUrl: base, shadow: { hint: 'the answer must name the lever', max_iterations: 4 }, log: () => {} })
  await shadowRt.agent('x', { label: 'assay:shadow', schema })
  const tool = (seen[4].body.tools || [])[0]
  check(tool && tool.type === 'function' && tool.function.name === 'serv_shadow_agent', 'shadow: serv_shadow_agent tool must be declared')
  check(tool && tool.function.parameters.properties.hint.default === 'the answer must name the lever', 'shadow: hint must be the default of the hint parameter')
  check(tool && tool.function.parameters.properties.max_iterations.default === 4, 'shadow: max_iterations must be the default of that parameter')
  check(seen[4].headers['x-openserv-disable-braid'] === undefined, 'shadow: no raw header unless raw')

  // 6. usage rows
  const rows = (r) => r.usage.map(u => [u.label, u.model, u.raw, u.shadow, u.prompt_tokens, u.completion_tokens, u.total_tokens].join('|'))
  check(rt.usage.length === 3, `usage: plain rt should hold 3 rows, got ${rt.usage.length}`)
  check(rows(rt)[0] === 'critic:r1|gpt-5.4-nano|false|false|11|7|18', `usage: first row wrong: ${rows(rt)[0]}`)
  check(rows(rt)[2] === 'propose:lens|claude-haiku-4.5|false|false|11|7|18', `usage: override row wrong: ${rows(rt)[2]}`)
  check(rows(rawRt)[0] === 'assay:raw|gpt-5.4-nano|true|false|11|7|18', `usage: raw row wrong: ${rows(rawRt)[0]}`)
  check(rows(shadowRt)[0] === 'assay:shadow|gpt-5.4-nano|false|true|11|7|18', `usage: shadow row wrong: ${rows(shadowRt)[0]}`)

  // 7. constructor guards
  let threw = false; try { makeServRt({ model: 'm', apiKey: '', baseUrl: base }) } catch { threw = true }
  check(threw, 'guard: no key must throw')
  threw = false; try { makeServRt({ apiKey: 'k', baseUrl: base }) } catch { threw = true }
  check(threw, 'guard: no model must throw')
} finally { server.close() }

if (failures.length) { console.error('test_serv_driver: FAIL\n  - ' + failures.join('\n  - ')); process.exit(1) }
console.log(`test_serv_driver: PASS — ${seen.length} mock calls; bearer, system-first, strict json_schema, raw header, shadow tool and usage rows all as the SERV docs state (mock, not live)`)
