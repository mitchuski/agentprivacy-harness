// vrc.mjs — the relational edge: a κ→κ reference that a signature mints.
//
// The holon layer's content edges verify by re-hashing (the content is its own
// witness). A RELATIONAL edge crosses parties, so it needs the second thing the
// edge rule names: *a reference proposes an edge; a signature mints it.* This is
// the VRC (Verifiable Relationship Credential) at the content-addressing layer.
//
// A signer is content-addressed too: an ed25519 public key encoded as a
// `did:key` (multicodec ed25519-pub 0xed01, base58btc, `did:key:z…`). So the
// whole edge is self-certifying — the target is a κ (a did:cid-style address),
// the signer is a did:key, and the signature binds (source, target, relation).
// This is the substrate the House of Archon identity runtime seats on: a
// delegation between agents IS a signed relational edge (see HOLONS.md,
// ../hearthold_mage/SLOT.md).
//
// Keys are ephemeral by design (the amnesia protocol): sign once, keep the
// signature and the did:key (public), discard the private key. The signature
// outlives the key; the key need not.
//
// Zero dependencies: node:crypto only.

import { generateKeyPairSync, sign as edSign, verify as edVerify, createPublicKey } from 'node:crypto'
import { canonicalJson } from './kappa.mjs'

// ---- base58btc (Bitcoin alphabet), for did:key ----
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function b58encode(bytes) {
  let zeros = 0
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++
  const digits = [0]
  for (let i = zeros; i < bytes.length; i++) {
    let carry = bytes[i]
    for (let j = 0; j < digits.length; j++) { carry += digits[j] << 8; digits[j] = carry % 58; carry = (carry / 58) | 0 }
    while (carry) { digits.push(carry % 58); carry = (carry / 58) | 0 }
  }
  let out = '1'.repeat(zeros)
  for (let k = digits.length - 1; k >= 0; k--) out += B58[digits[k]]
  return out
}
function b58decode(str) {
  let zeros = 0
  while (zeros < str.length && str[zeros] === '1') zeros++
  const bytes = [0]
  for (let i = zeros; i < str.length; i++) {
    let carry = B58.indexOf(str[i])
    if (carry < 0) throw new Error('bad base58 character')
    for (let j = 0; j < bytes.length; j++) { carry += bytes[j] * 58; bytes[j] = carry & 0xff; carry >>= 8 }
    while (carry) { bytes.push(carry & 0xff); carry >>= 8 }
  }
  const out = Buffer.alloc(zeros + bytes.length)
  for (let k = 0; k < bytes.length; k++) out[zeros + bytes.length - 1 - k] = bytes[k]
  return out
}

// ---- ed25519 <-> did:key ----
const ED_MULTICODEC = Buffer.from([0xed, 0x01])                 // ed25519-pub
const ED_SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex')  // DER SPKI header for a raw ed25519 key

function rawPublic(publicKey) {
  const jwk = publicKey.export({ format: 'jwk' })
  return Buffer.from(jwk.x, 'base64url')                        // 32 raw bytes
}

export function keypair() {
  return generateKeyPairSync('ed25519')                        // { publicKey, privateKey } KeyObjects
}

// did:key for an ed25519 public key: did:key:z<base58btc(0xed01 || rawpub)>
export function didKey(publicKey) {
  return 'did:key:z' + b58encode(Buffer.concat([ED_MULTICODEC, rawPublic(publicKey)]))
}

// recover the public KeyObject from a did:key string
export function publicKeyOf(did) {
  if (typeof did !== 'string' || !did.startsWith('did:key:z')) throw new Error('not a did:key')
  const mc = b58decode(did.slice('did:key:z'.length))
  if (mc[0] !== 0xed || mc[1] !== 0x01) throw new Error('did:key is not ed25519')
  const raw = mc.subarray(2)
  if (raw.length !== 32) throw new Error('bad ed25519 key length')
  return createPublicKey({ key: Buffer.concat([ED_SPKI_PREFIX, raw]), format: 'der', type: 'spki' })
}

// ---- the edge ----
// the exact bytes a signature covers: source κ, target κ, relation — nothing
// else. Move any of the three and the signature no longer verifies.
function edgeMessage(sourceKappa, target, relation) {
  return canonicalJson({ v: 'vrc.v1', source: sourceKappa, target, relation: relation ?? null })
}

// sign a κ→κ edge. Returns { target, relation, by (did:key), sig (base64url) }.
export function signEdge(sourceKappa, { target, relation }, kp) {
  const sig = edSign(null, Buffer.from(edgeMessage(sourceKappa, target, relation), 'utf8'), kp.privateKey)
  return { target, relation: relation ?? null, by: didKey(kp.publicKey), sig: sig.toString('base64url') }
}

// verify a stored edge against the source holon's κ → { ok, minted, error? }.
// minted === a valid signature is present. An edge without a signature is a
// PROPOSAL, not an error; an edge with a BAD signature is a failure.
export function verifyEdge(sourceKappa, edge) {
  if (!edge || !edge.by || !edge.sig) return { ok: true, minted: false, proposed: true }
  try {
    const ok = edVerify(null, Buffer.from(edgeMessage(sourceKappa, edge.target, edge.relation), 'utf8'),
      publicKeyOf(edge.by), Buffer.from(edge.sig, 'base64url'))
    return { ok, minted: ok, error: ok ? undefined : 'signature does not verify' }
  } catch (e) { return { ok: false, minted: false, error: String(e && e.message || e) } }
}
