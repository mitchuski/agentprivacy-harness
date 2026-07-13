#!/usr/bin/env node
// holon_audit.mjs — the mesh auditor. Re-derive every κ, re-hash every content
// edge, and resolve every relational edge, over a set of κ-addressed holons.
//
//   node tools/holon_audit.mjs <dir>
//
// Verifying a mesh of content-addressed holons is ENUMERABLE and DETERMINISTIC:
// there is nothing to tune to, because you cannot craft a holon whose κ
// re-derives to a value it does not have. So this is an AUDITOR, not a harness
// (see HOLONS.md and ADOPTION.md's harness-vs-auditor call) — agent-free, zero
// tokens, exhaustive. It is to the holon mesh what universe/audit.mjs is to the
// map: run it and a mirage becomes impossible.
//
// Checks, per holon:
//   1. κ integrity      — kappaOf(holon) equals the stored κ.
//   2. content edges    — every evidenceManifest entry re-hashes to its bytes.
//   3. relational edges — every κ→κ ref resolves within the mesh (or external);
//                         reports signed (minted) vs unsigned (proposed).
//
// Zero dependencies: node:fs, node:path, node:crypto (via kappa.mjs) only.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve, relative } from 'node:path'
import { kappaOf, verifyKappa } from './kappa.mjs'
import { verifyEdge } from './vrc.mjs'

const sha256File = (p) => { try { return createHash('sha256').update(readFileSync(p)).digest('hex') } catch { return null } }
const readJson = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return null } }
const isDir = (p) => { try { return statSync(p).isDirectory() } catch { return false } }

// A holon record is any JSON object carrying a κ field. We look for the two
// shapes the harness mints today — artefact.json and any *.holon.json — plus a
// bare feed carrying κ. (Feeds are holons only once stamped; unstamped feeds
// are skipped, not failed.)
function findHolons(root) {
  const out = []
  const walk = (p, depth) => {
    if (depth < 0 || !isDir(p)) return
    for (const name of readdirSync(p)) {
      const q = join(p, name)
      if (isDir(q)) { walk(q, depth - 1); continue }
      if (name === 'artefact.json' || name.endsWith('.holon.json')) {
        const j = readJson(q)
        if (j && typeof j['κ'] === 'string') out.push({ path: q, dir: dirname(q), holon: j })
      }
    }
  }
  walk(root, 8)
  return out
}

export function auditHolons(root) {
  const holons = findHolons(root)
  const errors = []
  const warnings = []
  let contentEdges = 0, relEdges = 0, minted = 0, proposed = 0

  const kappaSet = new Set(holons.map(h => h.holon['κ']))

  for (const { path, dir, holon } of holons) {
    const rel = relative(root, path).replace(/\\/g, '/')

    // 1. κ integrity
    const vk = verifyKappa(holon)
    if (!vk.ok) errors.push(`${rel}: κ does not re-derive — stored ${vk.stored || '(none)'} vs derived ${vk.derived}`)

    // 2. content edges — evidenceManifest: path → sha256(bytes)
    const man = holon.evidenceManifest && typeof holon.evidenceManifest === 'object' ? holon.evidenceManifest : null
    if (man) {
      for (const [entry, want] of Object.entries(man)) {
        contentEdges++
        const got = sha256File(join(dir, entry))
        if (got == null) errors.push(`${rel}: content edge → ${entry} missing`)
        else if (got !== want) errors.push(`${rel}: content edge → ${entry} re-hashes ${got}, manifest says ${want}`)
      }
    }

    // 3. relational edges (the VRC) — signed κ→κ references on holon.edges.
    //    A reference PROPOSES; a valid signature (against the signer's did:key)
    //    MINTS. A signature that does not verify is a failure, not a proposal.
    const sourceKappa = holon['κ']
    for (const edge of (Array.isArray(holon.edges) ? holon.edges : [])) {
      relEdges++
      if (edge && edge.sig) {
        const v = verifyEdge(sourceKappa, edge)
        if (v.minted) minted++
        else errors.push(`${rel}: relational edge → ${edge.target} carries a signature that does not verify (by ${edge.by || '?'}: ${v.error || 'invalid'})`)
      } else proposed++
      if (edge && edge.target && !kappaSet.has(edge.target) && !edge.external) warnings.push(`${rel}: relational edge → ${edge.target} not present in this mesh (mark it external if it lives elsewhere)`)
    }
  }

  return { root, holons, errors, warnings, contentEdges, relEdges, minted, proposed }
}

// ---- CLI ----
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const arg = process.argv[2]
  if (!arg) { console.error('usage: node tools/holon_audit.mjs <dir>'); process.exit(1) }
  const root = resolve(arg)
  if (!existsSync(root)) { console.error(`no such directory: ${root}`); process.exit(1) }

  const r = auditHolons(root)
  if (!r.holons.length) {
    console.log(`HOLON AUDIT — no κ-addressed holons under ${relative(process.cwd(), root).replace(/\\/g, '/') || '.'} (nothing to verify)`)
    process.exit(0)
  }
  for (const w of r.warnings) console.error(`  advisory: ${w}`)
  if (r.errors.length) {
    console.error(`HOLON AUDIT FAIL (${r.errors.length}) — the mesh does not re-derive:`)
    for (const e of r.errors) console.error(`  - ${e}`)
    process.exit(1)
  }
  console.log(`HOLON AUDIT PASS — ${r.holons.length} holon(s), ${r.contentEdges} content edge(s) re-hashed, ` +
    `${r.relEdges} relational edge(s) [${r.minted} minted · ${r.proposed} proposed]. Every κ re-derives; nothing to tune to.`)
}
