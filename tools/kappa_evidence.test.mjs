// kappa_evidence.test.mjs — the registry-axis encoder against the upstream
// vectors, the cross-implementation vector shared with kappa_evidence_mage
// (Python), and an end-to-end mint + verify + tamper on the primer run.
//
//   node tools/kappa_evidence.test.mjs
//
// Expected bytes come from bc-dcbor-rust @ 2e5b901 tests/encode.rs and the
// kappa-registry conformance tests; the κ strings in CROSS come from
// kappa_evidence_mage/test_vector.json (Python). Two independent encoders
// agreeing on a struct vector is the strongest check available before the
// P1 cargo run; it is not that run.

import { strict as assert } from 'node:assert'
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as D from './dcbor.mjs'
import { mint, verify } from './kappa_evidence.mjs'

const hex = (b) => Buffer.from(b).toString('hex')
let n = 0
const eq = (a, b, m) => { assert.equal(a, b, m); n++ }

// --- upstream encode vectors (encode.rs) ---
const V = [
  [0, '00'], [23, '17'], [255, '18ff'], [65536, '1a00010000'], [4294967295, '1affffffff'], [4294967296, '1b0000000100000000'],
  [18446744073709551615n, '1bffffffffffffffff'], [-1, '20'], [-2, '21'], [-127, '387e'], [-128, '387f'], [-32768, '397fff'],
  [-9223372036854775807n, '3b7ffffffffffffffe'],
  [1.5, 'f93e00'], [2345678.25, 'fa4a0f2b39'], [1.2, 'fb3ff3333333333333'], [Infinity, 'f97c00'], [-Infinity, 'f9fc00'], [NaN, 'f97e00'],
  [42.0, '182a'], [2345678.0, '1a0023cace'], [-2345678.0, '3a0023cacd'], [-0.0, '00'],
  [5.960464477539063e-8, 'f90001'], [1.401298464324817e-45, 'fa00000001'], [5e-324, 'fb0000000000000001'],
  [2.2250738585072014e-308, 'fb0010000000000000'], [6.103515625e-5, 'f90400'], [65504.0, '19ffe0'], [33554430.0, '1a01fffffe'],
  [-9223372036854774784.0, '3b7ffffffffffffbff'],
  [false, 'f4'], [true, 'f5'], [null, 'f6'],
  [Buffer.from('00112233', 'hex'), '4400112233'], ['Hello', '6548656c6c6f'], ['é', '62c3a9'],
  [[], '80'], [new Map(), 'a0'],
  [new Map([[-1, 3], [[-1], 7], ['z', 4], [10, 1], [false, 8], [100, 2], ['aa', 5], [[100], 6]]), 'a80a011864022003617a046261610581186406812007f408'],
  [new Map([[1, 45.7], [2, 'Hi there!']]), 'a201fb4046d9999999999a0269486920746865726521'],
  [new Map([[1, new D.RustBytes([1, 2, 200])]]), 'a10183010218c8'],
]
for (const [v, h] of V) eq(hex(D.encode(v)), h, `encode ${String(v).slice(0, 30)}`)

// --- registry conformance: blob kappa (kappa_label.rs) ---
eq(D.kappaFromBytes(Buffer.from('hello world')), 'sha256:b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')

// --- cross-implementation vector: must equal kappa_evidence_mage/test_vector.json (Python) ---
const CROSS = [
  ['test', 'sha256:6fe3180f700090697285ac1e0e8dc400259373d7bb94f0b1a9b086e7ba22dc3d'],
  [42, 'sha256:7f83f7bda2d63959d34767689f06d47576683d378d9eb8d09386c9a020395c53'],
  [1.5, 'sha256:b68bb45ecab0329ab815daf44f5a02d2a11a8ab87fbbdf4b08bcae00cada0324'],
  [39.85, 'sha256:7d3b247f560dcf35f3d5cb16bff5f27a09222389dcb4b66229c6c48ac5f26b81'],
  [D.edgeRecord('sha256:aa', 'sha256:bb', 'derived-from', 'anchor-x'), 'sha256:23845cdf442d9b335cb27793597104f6f8058ee1b9466ee4678bc17499bd4dd2'],
  [D.edgeRecord('sha256:aa', 'sha256:bb', 'composed-of', 'anchor-x', 'sha256:cc', Buffer.from([1, 255])), 'sha256:9817dbabd9132b46ad818ac1e4e02295b4f0bfa1e88876c6a6741dfeae4c3e9c'],
  [new Map([[0, 'agentprivacy-evidence/call/1'], [1, 0], [2, 's1_le60'], [3, 'SAT'], [4, 14.63], [5, 38.75], [6, 1.1], [7, 39.85], [8, 1021624], [9, 12],
    [10, 7104299], [11, '2026-10-05T18:58:25'], [13, 'ledger.jsonl'], [14, 'hashsmash/sha256-r32']]),
    'sha256:16031d9cd57219de323d53ac602bcfe952f673b69d9f740d3e3d2a378cdd2c1b'],
]
for (const [v, k] of CROSS) eq(D.kappaFromValue(v), k, 'cross-implementation vector')
eq(D.anchorFromKey('ed25519', Buffer.alloc(32, 1)), 'sha256:4f533fa8825c28074a27d811a8963baed14ef9403dec587b1e8f893c15f362b3', 'anchor vector')
eq(hex(D.merkleRoot([Buffer.from('a'), Buffer.from('b'), Buffer.from('c')])), 'e9636069c740c9ff51625b01a0b040396d265a9b920cc6febdfa5ecc9f58ecce', 'merkle vector')

// --- decoder: canonical round trip, non-canonical rejected ---
const rt = D.decode(D.encode(CROSS[6][0]))
eq(hex(D.encode(rt)), hex(D.encode(CROSS[6][0])), 'decode round trip')
assert.throws(() => D.decode(Buffer.from('1900ff', 'hex')), /non-canonical|trailing/); n++

// --- end to end on the primer run: mint, verify, sign, tamper ---
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const inst = join(root, 'evocations', 'primer')
const tmp = mkdtempSync(join(tmpdir(), 'kappa-ev-'))
try {
  const r = mint(inst, 'r1', { out: join(tmp, 'plain') })
  assert.ok(r.rootK.startsWith('sha256:')); n++
  const v1 = verify(join(tmp, 'plain'), () => {})
  assert.ok(v1.ok, 'plain bundle verifies: ' + v1.fails.join('; ')); n++
  const r2 = mint(inst, 'r1', { out: join(tmp, 'signed'), sign: true })
  const v2 = verify(join(tmp, 'signed'), () => {})
  assert.ok(v2.ok, 'signed bundle verifies: ' + v2.fails.join('; ')); n++
  const meta = JSON.parse(readFileSync(join(tmp, 'signed', 'root.json'), 'utf8'))
  assert.ok(meta.signature && meta.signature.by_did.startsWith('did:key:z') && meta.signature.by_anchor.startsWith('sha256:')); n++
  // determinism: same inputs, same root (the date is the only moving part within a day)
  const r3 = mint(inst, 'r1', { out: join(tmp, 'again') })
  eq(r3.rootK, r.rootK, 'mint is deterministic')
  // tamper: one byte in one object
  const objs = readdirSync(join(tmp, 'plain', 'objects')).sort()
  const f = join(tmp, 'plain', 'objects', objs[0]); const d = Buffer.from(readFileSync(f)); d[d.length - 1] ^= 1; writeFileSync(f, d)
  const v3 = verify(join(tmp, 'plain'), () => {})
  assert.ok(!v3.ok && v3.fails.some(m => /does not hash to its name/.test(m)), 'tamper detected'); n++
  // tamper: a flipped signature
  meta.signature.sig = meta.signature.sig.slice(0, -2) + (meta.signature.sig.endsWith('A') ? 'B' : 'A') + meta.signature.sig.slice(-1)
  writeFileSync(join(tmp, 'signed', 'root.json'), JSON.stringify(meta))
  const v4 = verify(join(tmp, 'signed'), () => {})
  assert.ok(!v4.ok && v4.fails.some(m => /signature/.test(m)), 'bad signature detected'); n++
} finally { rmSync(tmp, { recursive: true, force: true }) }

console.log(`kappa_evidence: ${n} checks passed (encoder vectors, cross-implementation vector, mint/verify/sign/tamper on evocations/primer r1)`)
