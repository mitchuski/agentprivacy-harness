#!/usr/bin/env node
// wiki_proxy.mjs — a Host-rewriting proxy for a FedWiki farm, generalised
// from the tailnet lane that serves the agentprivacy federation. A farm
// routes by Host header; anything that reaches it on a bare IP:port gets the
// default site. This proxy pins one localhost port per site, rewriting Host
// so each pinned port IS one site — which is exactly the shape
// `tailscale serve` (or any port-forwarder) can publish one at a time.
//
//   node tools/wiki_proxy.mjs --map <host>:<port>[,<host>:<port>...]
//                             [--farm-port 3030] [--front <port>]
//                             [--allow <hostRegex>]
//
//   --map    pinned listeners, e.g. myinst.localhost:3131,guide.localhost:3132
//   --front  optional front door on 0.0.0.0:<port> routing by REAL Host,
//            allowlisted by --allow (default: refuse everything). Without
//            --front, every listener binds 127.0.0.1 only.
//
// THE DOOR (T6): this tool binds localhost by default and never touches
// tailscale itself. Publishing a pinned port beyond the machine —
//   tailscale serve --bg --tcp 8081 tcp://127.0.0.1:3131
// — and the inbound-hardening that should precede it (default-deny with
// explicit holes; see WIKI.md §serving) are the First Person's steps.

import { createServer, request } from 'node:http'

const flag = (n, d = null) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d }
const farmPort = Number(flag('--farm-port', '3030'))
const mapArg = flag('--map')
if (!mapArg) { console.error('usage: node tools/wiki_proxy.mjs --map <host>:<port>[,...] [--farm-port 3030] [--front <port>] [--allow <hostRegex>]'); process.exit(2) }
const map = mapArg.split(',').map(s => { const i = s.lastIndexOf(':'); return { host: s.slice(0, i), port: Number(s.slice(i + 1)) } })
for (const m of map) if (!m.host || !Number.isInteger(m.port)) { console.error(`bad --map entry near "${m.host}:${m.port}"`); process.exit(2) }

const pipe = (req, res, host) => {
  const up = request({ host: '127.0.0.1', port: farmPort, method: req.method, path: req.url, headers: { ...req.headers, host } },
    (ur) => { res.writeHead(ur.statusCode, ur.headers); ur.pipe(res) })
  up.on('error', () => { res.writeHead(502); res.end('farm unreachable — is the wiki farm running on ' + farmPort + '?') })
  req.pipe(up)
}

for (const m of map) {
  createServer((req, res) => pipe(req, res, m.host)).listen(m.port, '127.0.0.1',
    () => console.log(`127.0.0.1:${m.port} → ${m.host} (farm :${farmPort})`))
}

const frontPort = flag('--front')
if (frontPort) {
  const allow = flag('--allow')
  const allowRe = allow ? new RegExp(allow) : null
  createServer((req, res) => {
    const host = String(req.headers.host || '').split(':')[0]
    if (!allowRe || !allowRe.test(host)) { res.writeHead(403); res.end('host not allowlisted') ; return }
    pipe(req, res, host)
  }).listen(Number(frontPort), '0.0.0.0',
    () => console.log(`0.0.0.0:${frontPort} front door — allow ${allow || '(nothing — pass --allow)'}`))
}
