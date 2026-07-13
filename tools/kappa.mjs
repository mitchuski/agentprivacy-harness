// kappa.mjs — the κ law, in one place. The content-addressing primitive shared
// by every producer and verifier of κ-addressed holons (see HOLONS.md).
//
//   κ = "sha256:" + sha256( canonicalJson( object with the κ field removed ) )
//
// This is the City Key / sigil Law L5 convention: a κ-label is never trusted,
// only re-derived; the label is excluded from its own preimage so an object can
// carry its own address.
//
// This module is a SHARED primitive, deliberately — the opposite of the
// independent-copy idiom used for gate/audit logic. Content-addressing only
// works if every producer computes the IDENTICAL κ, so the mint, the feed, the
// console, and the auditor all import THIS function rather than keeping their
// own. The independent check for κ lives in the test layer (a cross-derivation)
// and in the language-agnostic spec, not in maintaining N copies that could
// drift — because two drifting κ functions do not catch each other, they just
// break addressing.
//
// Zero dependencies: node:crypto only.

import { createHash } from 'node:crypto'

// canonical JSON: recursively sorted keys, no whitespace. The κ preimage.
export function canonicalJson(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v)
  if (Array.isArray(v)) return '[' + v.map(canonicalJson).join(',') + ']'
  return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canonicalJson(v[k])).join(',') + '}'
}

// sha256 of a utf-8 string → lowercase hex.
export function sha256Hex(str) {
  return createHash('sha256').update(str, 'utf8').digest('hex')
}

// the κ-label of a holon: sha256 over its canonical bytes, with the κ field
// (and any extra excluded keys) removed from the preimage.
//
// The `edges` field is ALWAYS excluded: relations are not identity. A holon's
// address is its content, and it must stay stable as it accrues signed
// relational edges (the VRC — see tools/vrc.mjs, HOLONS.md). Otherwise signing
// an edge whose source is this holon's κ would change that very κ.
export function kappaOf(holon, exclude = []) {
  const clone = { ...holon }
  delete clone['κ']
  delete clone['edges']
  for (const k of exclude) delete clone[k]
  return 'sha256:' + sha256Hex(canonicalJson(clone))
}

// verify a holon's stored κ against a fresh derivation → { ok, stored, derived }.
export function verifyKappa(holon) {
  const stored = holon && typeof holon['κ'] === 'string' ? holon['κ'] : null
  const derived = kappaOf(holon)
  return { ok: stored != null && stored === derived, stored, derived }
}
