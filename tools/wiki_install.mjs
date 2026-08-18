#!/usr/bin/env node
// wiki_install.mjs — the Observe step made runnable: derive the knowledge
// graph, project the ledgers into FedWiki pages, and install the result as a
// host in a LOCAL Smallest-Federated-Wiki farm — so a research loop's story
// is a live, forkable wiki site the moment a round lands. WIKI.md is the map
// of the whole lane; this tool is its local leg only.
//
//   node tools/wiki_install.mjs <instanceDir> [--host <name.localhost>]
//                               [--farm <dir>] [--dry]
//
// host default: <config.wiki.host>, else <instance-name>.localhost
// farm default: <config.wiki.farm>, else ~/.wiki   (the farm auto-creates a
// site per Host header; writing the directory first simply claims the name)
//
// What it does, in order — each step idempotent:
//   1. node tools/spellweb.mjs <inst>            → <inst>/web/graph.json
//   2. node tools/wiki_emit.mjs <inst>           → <inst>/wiki/{pages,assets,manifest.json}
//   3. copy pages/ + assets/ into <farm>/<host>/ (never deletes a page it
//      did not emit — hand-authored and forked pages survive a re-install)
//   4. write <farm>/<host>/status/owner.json ONLY if absent — an existing
//      owner is never overwritten
//   5. delete <farm>/<host>/status/{sitemap.json,sitemap.xml,site-index.json}
//      so the farm rebuilds its caches on next request
//
// What it deliberately does NOT do (T6 — the door): start or expose a server,
// touch tailscale, roster the host into any federation index, or push
// anything. A localhost farm is a workshop wall; the moment the wall faces
// outward, the steps are the First Person's (WIKI.md §serving).

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join, resolve, basename, dirname } from 'node:path'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const [dirArg] = process.argv.slice(2).filter(a => !a.startsWith('--'))
if (!dirArg) { console.error('usage: node tools/wiki_install.mjs <instanceDir> [--host <name.localhost>] [--farm <dir>] [--dry]'); process.exit(2) }
const inst = resolve(dirArg)
const flag = (n) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : null }
const dry = process.argv.includes('--dry')

let config = null
try { config = (await import(pathToFileURL(join(inst, 'harness.config.mjs')).href)).default } catch {}
const host = flag('--host') || config?.wiki?.host ||
  `${basename(inst).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.localhost`
const farm = resolve(flag('--farm') || config?.wiki?.farm || join(homedir(), '.wiki'))
if (!/^[a-z0-9][a-z0-9.-]*$/.test(host)) { console.error(`refused: host "${host}" is not a clean lowercase hostname`); process.exit(2) }

// 1 + 2 · derive (graph + star), then project — idempotent, inside inst only
execFileSync(process.execPath, [join(here, 'spellweb.mjs'), inst], { stdio: 'inherit' })
execFileSync(process.execPath, [join(here, 'star.mjs'), inst], { stdio: 'inherit' })
execFileSync(process.execPath, [join(here, 'wiki_emit.mjs'), inst], { stdio: 'inherit' })

const src = join(inst, 'wiki')
const manifest = JSON.parse(readFileSync(join(src, 'manifest.json'), 'utf8'))
const site = join(farm, host)
const copies = []
for (const pg of manifest.pages) copies.push({ from: join(src, 'pages', pg.slug), to: join(site, 'pages', pg.slug) })
for (const a of manifest.assets || []) copies.push({ from: join(src, 'assets', a.as), to: join(site, 'assets', a.as) })

if (dry) {
  console.log(`DRY — would install ${manifest.pages.length} page(s) + ${(manifest.assets || []).length} asset(s) → ${site.replace(/\\/g, '/')}`)
  process.exit(0)
}

// 3 · install (additive: only paths this projection owns are written)
let wrote = 0
for (const c of copies) {
  mkdirSync(dirname(c.to), { recursive: true })
  const bytes = readFileSync(c.from)
  if (existsSync(c.to) && readFileSync(c.to).equals(bytes)) continue
  writeFileSync(c.to, bytes); wrote++
}

// 4 · claim ownership only where none exists
const ownerPath = join(site, 'status', 'owner.json')
if (!existsSync(ownerPath)) {
  mkdirSync(join(site, 'status'), { recursive: true })
  writeFileSync(ownerPath, JSON.stringify({ name: 'First Person', friend: {} }, null, 2) + '\n')
  console.log(`claimed: ${host} (status/owner.json written — set your farm's real owner/secret before serving to friends)`)
}

// 5 · invalidate the farm's caches so the next request rebuilds them
for (const f of ['sitemap.json', 'sitemap.xml', 'site-index.json']) {
  const p = join(site, 'status', f)
  if (existsSync(p)) rmSync(p)
}

const total = (() => { try { return readdirSync(join(site, 'pages')).length } catch { return 0 } })()
console.log(`installed ${host}: ${wrote} file(s) written (${copies.length - wrote} already current) · site now holds ${total} page(s)`)
console.log(`NOT done (T6): no server started, no tailnet exposure, no federation roster, no push — see WIKI.md.`)
