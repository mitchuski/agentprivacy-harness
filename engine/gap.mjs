// gap.mjs — the Gap ⿻, as code.
//
// The hold-apart phase used to live entirely in a seat prompt: an LLM was told
// to canonicalise the proposal, hash it in a shell, and do modular reduction by
// hand in its transcript. That is fragile (a stray newline changed the hash
// once — CR-7) and it is only auditable AFTER the fact, by re-deriving from the
// saved bytes. This module makes the seed and the draw a deterministic function
// the Gap seat INVOKES, so the same code that produces the draw is the code the
// verifier replays (tools/verify_run.mjs). The seat shrinks to: call, narrate,
// write the questions.
//
// It reuses tools/kappa.mjs's canonicaliser DELIBERATELY: content-addressing
// only works if every producer computes the identical bytes. The independent
// check lives in the test layer (a cross-derivation against sha256 of the file
// the Gap actually writes), not in a second drifting copy.
//
// Zero dependencies, and deliberately sandbox-safe: the seed and draw are
// computed INSIDE the loop, and the loop's reference runtime is the Claude Code
// Workflow sandbox, which has NO Node.js API access (no node:crypto). So this
// module carries a pure-JS SHA-256 rather than importing node:crypto. It is not
// a second, drifting hash: engine/gap.test.mjs cross-checks it against
// node:crypto over many inputs, so a divergence is a failing test, not a silent
// break — the same "independent check in the test layer" idiom kappa.mjs uses.
// Only canonicalJson (pure, no crypto) is shared from kappa.mjs.

import { canonicalJson } from '../tools/kappa.mjs'

// ---- pure-JS SHA-256 (FIPS 180-4), operating on bytes -------------------
const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]
const rotr = (x, n) => (x >>> n) | (x << (32 - n))

// sha256 of a byte array (numbers 0..255 or a Uint8Array) → Uint8Array(32).
export function sha256Bytes(bytes) {
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19
  const len = bytes.length
  // padding: 0x80, then zeros, then 64-bit big-endian bit length
  const bitLen = len * 8
  const withOne = len + 1
  const total = withOne + ((56 - (withOne % 64) + 64) % 64) + 8
  const msg = new Uint8Array(total)
  msg.set(bytes, 0)
  msg[len] = 0x80
  // bit length as 64-bit big-endian (JS bit ops are 32-bit; high word from /2^32)
  const hi = Math.floor(bitLen / 0x100000000)
  const lo = bitLen >>> 0
  msg[total - 8] = (hi >>> 24) & 0xff; msg[total - 7] = (hi >>> 16) & 0xff
  msg[total - 6] = (hi >>> 8) & 0xff;  msg[total - 5] = hi & 0xff
  msg[total - 4] = (lo >>> 24) & 0xff; msg[total - 3] = (lo >>> 16) & 0xff
  msg[total - 2] = (lo >>> 8) & 0xff;  msg[total - 1] = lo & 0xff

  const w = new Array(64)
  for (let off = 0; off < total; off += 64) {
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4
      w[i] = ((msg[j] << 24) | (msg[j + 1] << 16) | (msg[j + 2] << 8) | msg[j + 3]) >>> 0
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const t2 = (S0 + maj) >>> 0
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0
    h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0
  }
  const out = new Uint8Array(32)
  const words = [h0, h1, h2, h3, h4, h5, h6, h7]
  for (let i = 0; i < 8; i++) {
    out[i * 4] = (words[i] >>> 24) & 0xff; out[i * 4 + 1] = (words[i] >>> 16) & 0xff
    out[i * 4 + 2] = (words[i] >>> 8) & 0xff; out[i * 4 + 3] = words[i] & 0xff
  }
  return out
}

// utf-8 encode a string to a byte array, BY HAND. The Workflow sandbox has
// neither node:crypto NOR TextEncoder (a live spar proved it — r5 died on
// `TextEncoder is not defined`), so we encode code points to UTF-8 bytes
// directly, including surrogate pairs for astral characters (the emoji in the
// canon). gap.test.mjs cross-checks the resulting hash against node:crypto over
// inputs that include emoji, so a wrong encoding is a failing test.
function utf8(str) {
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    if (c < 0x80) bytes.push(c)
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f))
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
      const lo = str.charCodeAt(i + 1)
      if (lo >= 0xdc00 && lo <= 0xdfff) {
        const cp = 0x10000 + ((c - 0xd800) << 10) + (lo - 0xdc00)
        bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f))
        i++
      } else bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f))
    }
    else bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f))
  }
  return bytes
}
const toHex = (bytes) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
const fromHex = (hex) => { const a = new Uint8Array(hex.length / 2); for (let i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i * 2, 2), 16); return a }

// sha256 of a utf-8 string → lowercase hex (matches kappa.sha256Hex; the test
// proves it).
export function sha256Hex(str) { return toHex(sha256Bytes(utf8(str))) }

// The canonical bytes the Gap saves to proposal_canon.json — recursively
// sorted keys, no whitespace, no trailing newline. The auditor re-hashes THIS
// exact string; sha256 of the written file must equal hashCanon(canonicalize(p)),
// which holds iff the file carries these bytes and nothing else (no EOF newline).
export function canonicalize(proposal) {
  return canonicalJson(proposal)
}

// sha256 (hex) of a canonical string.
export function hashCanon(canonStr) {
  return sha256Hex(canonStr)
}

// convenience: the proposal's content hash, h_proposal.
export function hashProposal(proposal) {
  return hashCanon(canonicalize(proposal))
}

// Derive the draw seed.
//
//   legacy (the spar's Gap before D1/C2): the seed IS the proposal hash. A
//     proposer that can resubmit can grind it — this is the defect D1 closes.
//     Selected when neither a source hash nor a salt is supplied, so historic
//     runs re-derive under the same rule they were drawn with.
//
//   salted (D1/C2+): seed = sha256(h_source || h_proposal || salt). With salt
//     drawn AFTER the proposal is committed, the proposer cannot predict the
//     draw (source binding also stops a candidate silently changing the
//     population it is graded against).
//
// The salt's SOURCE is a tier property, not this function's concern: the spar's
// Gap draws it from a CSPRNG (option A); the duel's Gap takes a prover-committed,
// later-revealed salt_S (option B, Blum). Either way it arrives here as `salt`.
export function deriveSeed({ hSource = null, hProposal, salt = null }) {
  if (hProposal == null) throw new Error('deriveSeed: hProposal is required')
  const legacy = hSource == null && salt == null
  if (legacy) return hProposal
  return sha256Hex((hSource || '') + hProposal + (salt || ''))
}

// Per-proposal salt for the spar's Gap (option A). The run draws ONE 32-byte
// secret (a CSPRNG, in real Node, by the orchestrator — never shown to any
// seat); each proposal's salt is derived from it AFTER the proposal is
// committed:  salt_i = sha256(saltSecret || h_proposal_i).
//
// Why derive rather than draw a fresh random salt per proposal: the derivation
// uses only sha256, so it runs in the Workflow sandbox (which blocks
// randomBytes/Math.random for resume-safety) and is deterministic given the
// secret — so a verifier that is handed the secret can reproduce every salt,
// while a proposer that never sees the secret cannot predict any of them
// (256-bit secret; grinding the proposal no longer fixes the draw). The single
// nondeterministic draw — the secret — happens once, outside the sandbox.
//
// For the duel's Gap (option B) the secret is replaced by a prover-committed,
// later-revealed nonce; same derivation, different source. The tier decides the
// source; this function does not care.
export function perProposalSalt(saltSecret, hProposal) {
  if (!saltSecret) throw new Error('perProposalSalt: saltSecret is required (32-byte hex, orchestrator-drawn)')
  if (!hProposal) throw new Error('perProposalSalt: hProposal is required')
  return sha256Hex(saltSecret + hProposal)
}

// A deterministic byte stream keyed on the seed. The first 32 bytes ARE the
// seed's own sha256 bytes, so a draw of count <= 32 is byte-for-byte the
// procedure the old prompt described (b0, b1, … = the digest bytes). Past 32
// the stream extends by hashing (seed || counter), so a large census-scale draw
// stays deterministic and third-party re-derivable without changing the small
// draws the field guide relies on.
function seedBytes(seedHex, need) {
  const head = fromHex(seedHex)
  if (need <= head.length) return head
  let out = Array.from(head)
  let counter = 0
  while (out.length < need) {
    const block = sha256Bytes(Uint8Array.from([...head, counter & 0xff]))
    out = out.concat(Array.from(block))
    counter++
  }
  return Uint8Array.from(out)
}

// Draw `count` distinct fact indices (1-based: F1..FN) from N without
// replacement, exactly as the hold-apart prompt specified: take the seed bytes
// left to right, and for draw k pick position (b_k mod remaining) out of the
// not-yet-drawn list, removing it. Returns the picks in draw order.
export function draw(seedHex, N, count) {
  if (!Number.isInteger(N) || N < 1) throw new Error(`draw: N must be a positive integer, got ${N}`)
  if (!Number.isInteger(count) || count < 1) throw new Error(`draw: count must be a positive integer, got ${count}`)
  if (count > N) throw new Error(`draw: count ${count} exceeds population N ${N}`)
  const bytes = seedBytes(seedHex, count)
  const remaining = Array.from({ length: N }, (_, i) => i + 1)
  const picks = []
  for (let k = 0; k < count; k++) {
    const idx = bytes[k] % remaining.length
    picks.push(remaining[idx])
    remaining.splice(idx, 1)
  }
  return picks
}

// The whole hold-apart step in one call: canonicalise, hash, seed, draw. The
// Gap seat calls this and narrates it; it never re-implements the arithmetic.
// Returns everything the run manifest and the auditor need.
export function holdApart({ proposal, N, count, hSource = null, salt = null }) {
  const canon = canonicalize(proposal)
  const hProposal = hashCanon(canon)
  const seedHex = deriveSeed({ hSource, hProposal, salt })
  const drawIndices = draw(seedHex, N, count)
  return { canon, hProposal, hSource, salt, seedHex, N, count, drawIndices }
}
