// dcbor.mjs — canonical dCBOR + the registry κ axis, zero dependencies.
//
// The harness's own κ law (tools/kappa.mjs) is sha256 over canonical JSON. The
// UOR kappa-registry's κ is sha256 over canonical dCBOR (draft-mcnally-
// deterministic-cbor), the axis its anchors, edges and namespace roots live
// on. Evidence bundles are minted on THAT axis so a registry (or anyone with
// the registry's rules) can re-derive them; holons keep the JSON law. Both are
// "sha256:" + hex and both are re-derived, never trusted.
//
// This is a second, independent implementation of the encoder in
// kappa_evidence_mage/kappa.py (Python). The two are held equal on a fixed
// vector in tools/kappa_evidence.test.mjs; equality with the compiled Rust
// crate (kappa-registry @ 2af8656, bc-dcbor-rust @ 2e5b901) is the P1 cargo
// check, pending. Until it passes every κ on this axis is labelled
// "kappa-compatible (unverified)".
//
// Rules mirrored from the pinned dcbor source (file:line in kappa.py):
//   ints shortest form; floats reduced to ints when integral, else the
//   shortest of f16/f32/f64 that round-trips exactly; NaN = f97e00; ±inf as
//   f16; text NFC; map keys sorted bytewise by their encoded form; a Rust
//   Vec<u8> field encodes as an ARRAY of ints (the derive quirk), a real
//   byte string as major type 2; Option None fields are omitted.
//
// Value model (JS → CBOR): null, boolean, number, bigint, string, Uint8Array
// (byte string), RustBytes (int array), Array, Map (any keys), plain object
// (text keys).

import { createHash } from 'node:crypto'

export const STATUS = 'kappa-compatible (unverified)'
export const UPSTREAM = { 'kappa-registry': '2af8656', 'bc-dcbor-rust': '2e5b901 (branch feat/dcbor-derive)' }

export class RustBytes extends Uint8Array {}

function head(major, n) {
  n = BigInt(n)
  const m = major << 5
  if (n < 24n) return Buffer.from([m | Number(n)])
  if (n < 0x100n) return Buffer.from([m | 24, Number(n)])
  if (n < 0x10000n) { const b = Buffer.alloc(3); b[0] = m | 25; b.writeUInt16BE(Number(n), 1); return b }
  if (n < 0x100000000n) { const b = Buffer.alloc(5); b[0] = m | 26; b.writeUInt32BE(Number(n), 1); return b }
  if (n < 0x10000000000000000n) { const b = Buffer.alloc(9); b[0] = m | 27; b.writeBigUInt64BE(n, 1); return b }
  throw new RangeError('integer out of CBOR range')
}

function encodeInt(i) {
  i = BigInt(i)
  return i >= 0n ? head(0, i) : head(1, -1n - i)
}

// f16 bits of a float that is already exactly an f32, or null if it does not round-trip.
function f16Bits(f) {
  const dv = new DataView(new ArrayBuffer(4)); dv.setFloat32(0, f)
  const bits = dv.getUint32(0)
  const sign = bits >>> 31 ? 0x8000 : 0
  const exp = (bits >>> 23) & 0xff, mant = bits & 0x7fffff
  const e = exp - 127
  if (exp === 0) return f === 0 ? sign : null // f32 subnormals are below the f16 subnormal range
  if (e > 15) return null
  if (e >= -14) return (mant & 0x1fff) ? null : (sign | ((e + 15) << 10) | (mant >>> 13))
  const m = Math.abs(f) * 16777216 // 2^24
  return Number.isInteger(m) && m >= 1 && m < 1024 ? (sign | m) : null
}

function encodeFloat(x) {
  if (Number.isNaN(x)) return Buffer.from([0xf9, 0x7e, 0x00])
  if (x === Infinity) return Buffer.from([0xf9, 0x7c, 0x00])
  if (x === -Infinity) return Buffer.from([0xf9, 0xfc, 0x00])
  if (Number.isInteger(x) && Math.abs(x) < 18446744073709551616) return encodeInt(BigInt(x))
  if (Math.fround(x) === x) {
    const h = f16Bits(x)
    if (h !== null) { const b = Buffer.alloc(3); b[0] = 0xf9; b.writeUInt16BE(h, 1); return b }
    const b = Buffer.alloc(5); b[0] = 0xfa; b.writeFloatBE(x, 1); return b
  }
  const b = Buffer.alloc(9); b[0] = 0xfb; b.writeDoubleBE(x, 1); return b
}

export function encode(v) {
  if (v === null || v === undefined) return Buffer.from([0xf6])
  if (v === true) return Buffer.from([0xf5])
  if (v === false) return Buffer.from([0xf4])
  if (typeof v === 'bigint') return encodeInt(v)
  if (typeof v === 'number') return encodeFloat(v)
  if (typeof v === 'string') { const s = Buffer.from(v.normalize('NFC'), 'utf8'); return Buffer.concat([head(3, s.length), s]) }
  if (v instanceof RustBytes) return Buffer.concat([head(4, v.length), ...Array.from(v, b => encodeInt(b))])
  if (v instanceof Uint8Array) return Buffer.concat([head(2, v.length), Buffer.from(v)])
  if (Array.isArray(v)) return Buffer.concat([head(4, v.length), ...v.map(encode)])
  if (v instanceof Map || typeof v === 'object') {
    const entries = v instanceof Map ? [...v.entries()] : Object.entries(v)
    const items = entries.map(([k, val]) => [encode(k), encode(val)]).sort((a, b) => Buffer.compare(a[0], b[0]))
    for (let i = 1; i < items.length; i++) if (Buffer.compare(items[i - 1][0], items[i][0]) === 0) throw new Error('duplicate map keys after canonical encoding')
    return Buffer.concat([head(5, items.length), ...items.flat()])
  }
  throw new TypeError(`no dCBOR encoding for ${typeof v}`)
}

export function kappaFromBytes(bytes) { return 'sha256:' + createHash('sha256').update(bytes).digest('hex') }
export function kappaFromValue(v) { return kappaFromBytes(encode(v)) }
export function splitKappa(k) { const i = k.indexOf(':'); return [k.slice(0, i), k.slice(i + 1)] }

// --- typed edges: the upstream Edge struct (types.rs:377-394) ------------------
export const EDGE_RELATION = {
  'owns': 0, 'composed-of': 1, 'assertion': 2, 'revocation': 3, 'capability': 4, 'recovery-share': 5,
  'epoch-root': 6, 'akd-tree-node': 7, 'chunk-manifest': 8, 'witness-receipt': 9, 'offload-receipt': 10,
  'derived-from': 11, 'certified-by': 12, 'evidence-provenance': 13, 'section-of': 14, 'refers-to': 15, 'delegation': 16,
}
export const RELATION_NAME = Object.fromEntries(Object.entries(EDGE_RELATION).map(([s, n]) => [n, s]))

export function edgeRecord(source, target, relation, asserter, valueKappa = null, metadata = null) {
  if (!(relation in EDGE_RELATION)) throw new Error(`unknown relation ${relation}`)
  const m = new Map([[0, source], [1, target], [2, EDGE_RELATION[relation]], [3, asserter]])
  if (valueKappa !== null) m.set(4, valueKappa)
  if (metadata !== null) m.set(5, new RustBytes(metadata))
  return m
}

// crypto/anchor.rs:14-27 — AnchorInput {0 algorithm, 1 public_key: Vec<u8>} (the Vec<u8> quirk applies)
export function anchorFromKey(algorithm, publicKey) {
  return kappaFromValue(new Map([[0, algorithm], [1, new RustBytes(publicKey)]]))
}

// --- merkle (merkle.rs:10-67) ---------------------------------------------------
const sha = (b) => createHash('sha256').update(b).digest()
export const hashLeaf = (d) => sha(Buffer.concat([Buffer.from([0]), Buffer.from(d)]))
export const hashNode = (l, r) => sha(Buffer.concat([Buffer.from([1]), l, r]))
export function merkleRoot(leaves) {
  if (!leaves.length) return null
  let level = leaves.map(hashLeaf)
  while (level.length > 1) {
    const next = []
    for (let i = 0; i < level.length; i += 2) next.push(hashNode(level[i], level[i + 1] ?? level[i]))
    level = next
  }
  return level[0]
}

// --- decoder for verification: rejects anything that does not re-encode byte-identically
export function decode(data) {
  const [v, n] = dec(Buffer.from(data), 0)
  if (n !== data.length) throw new Error('trailing bytes')
  if (Buffer.compare(encode(v), Buffer.from(data)) !== 0) throw new Error('non-canonical input')
  return v
}

function dec(b, i) {
  const ib = b[i]; const major = ib >>> 5, ai = ib & 0x1f; i += 1
  if (major === 7) {
    if (ai === 20) return [false, i]
    if (ai === 21) return [true, i]
    if (ai === 22) return [null, i]
    if (ai === 25) { const h = b.readUInt16BE(i); return [f16ToNumber(h), i + 2] }
    if (ai === 26) return [b.readFloatBE(i), i + 4]
    if (ai === 27) return [b.readDoubleBE(i), i + 8]
    throw new Error('unsupported simple value')
  }
  let n
  if (ai < 24) n = BigInt(ai)
  else if (ai === 24) { n = BigInt(b[i]); i += 1 }
  else if (ai === 25) { n = BigInt(b.readUInt16BE(i)); i += 2 }
  else if (ai === 26) { n = BigInt(b.readUInt32BE(i)); i += 4 }
  else if (ai === 27) { n = b.readBigUInt64BE(i); i += 8 }
  else throw new Error('indefinite length not allowed in dCBOR')
  const asNum = (x) => (x <= BigInt(Number.MAX_SAFE_INTEGER) && x >= -BigInt(Number.MAX_SAFE_INTEGER)) ? Number(x) : x
  if (major === 0) return [asNum(n), i]
  if (major === 1) return [asNum(-1n - n), i]
  const len = Number(n)
  if (major === 2) return [new Uint8Array(b.subarray(i, i + len)), i + len]
  if (major === 3) return [b.subarray(i, i + len).toString('utf8'), i + len]
  if (major === 4) { const out = []; for (let k = 0; k < len; k++) { const [x, j] = dec(b, i); out.push(x); i = j } return [out, i] }
  if (major === 5) { const out = new Map(); for (let k = 0; k < len; k++) { const [key, j] = dec(b, i); const [val, j2] = dec(b, j); out.set(key, val); i = j2 } return [out, i] }
  throw new Error('tags not supported')
}

function f16ToNumber(h) {
  const sign = h >>> 15 ? -1 : 1, exp = (h >>> 10) & 0x1f, mant = h & 0x3ff
  if (exp === 0) return sign * mant * Math.pow(2, -24)
  if (exp === 31) return mant ? NaN : sign * Infinity
  return sign * (1 + mant / 1024) * Math.pow(2, exp - 15)
}
