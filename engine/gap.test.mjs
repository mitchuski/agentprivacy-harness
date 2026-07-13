// gap.test.mjs — the Gap tool fails loudly.
//
// Runs: node engine/gap.test.mjs   (zero deps, exit 0 = pass)
//
// Covers the properties the whole audit chain leans on:
//   1. canonicalisation is order-independent (the draw cannot depend on key order)
//   2. the cross-derivation invariant: sha256 of the bytes the Gap WRITES equals
//      hashCanon(canonicalize(proposal)) — the CR-7 fence (a trailing newline
//      broke this once), so verify_run's re-hash of the file will always match
//   3. the draw is deterministic and byte-faithful to the prompt's procedure
//   4. the draw is a permutation prefix: distinct indices, all in 1..N
//   5. legacy vs salted seed modes, and that salt actually moves the draw
//   6. loud failure on bad arguments

import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { canonicalize, hashCanon, hashProposal, deriveSeed, draw, holdApart, sha256Hex, perProposalSalt } from './gap.mjs'

let failures = 0
const eq = (a, b, msg) => {
  const A = JSON.stringify(a), B = JSON.stringify(b)
  if (A === B) { console.log(`  ok   ${msg}`); return }
  failures++
  console.error(` FAIL  ${msg}\n         expected ${B}\n         got      ${A}`)
}
const ok = (cond, msg) => eq(!!cond, true, msg)
const throws = (fn, msg) => {
  try { fn(); failures++; console.error(` FAIL  ${msg} (did not throw)`) }
  catch { console.log(`  ok   ${msg}`) }
}

// ---- 0a. sandbox safety: gap.mjs uses no runtime-only globals ------------
// gap.mjs runs INSIDE the Workflow sandbox (the loop derives the seed there),
// which has no node:crypto AND no TextEncoder — a live spar died on each in
// turn. This guard fails if either (or Buffer / Math.random / Date / require)
// is reintroduced in CODE, so the next reader learns it from a test, not a
// 600-second workflow crash. Comments are stripped before scanning.
{
  const src = readFileSync(new URL('./gap.mjs', import.meta.url), 'utf8')
  const codeOnly = src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
  const hostile = ['TextEncoder', 'TextDecoder', 'Buffer', 'Math.random', 'Date.now', 'new Date', 'node:', 'require(']
  const found = hostile.filter(h => codeOnly.includes(h))
  eq(found, [], 'gap.mjs code uses no sandbox-hostile globals (Workflow has no node:crypto/TextEncoder)')
}

// ---- 0. the pure-JS SHA-256 equals node:crypto (no drift) ----------------
// gap.mjs carries its own SHA-256 so it runs in the crypto-less Workflow
// sandbox. This is the cross-derivation that makes that safe: if the pure
// implementation ever diverges from node:crypto, THIS fails — loudly.
{
  const inputs = ['', 'a', 'abc', 'the quick brown fox', '⿻ soulbae 🧙 ⚔️ soulbis',
    JSON.stringify({ b: 1, a: [1, 2, 3], z: null }), 'x'.repeat(55), 'y'.repeat(56),
    'z'.repeat(63), 'w'.repeat(64), 'q'.repeat(65), 'm'.repeat(1000)]
  let allMatch = true
  for (const s of inputs) {
    const ref = createHash('sha256').update(s, 'utf8').digest('hex')
    if (sha256Hex(s) !== ref) { allMatch = false; console.error(`   sha256 mismatch on ${JSON.stringify(s.slice(0, 20))}`) }
  }
  // known-answer for "abc"
  eq(sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'sha256("abc") = the FIPS test vector')
  ok(allMatch, `pure-JS sha256 == node:crypto over ${inputs.length} inputs (lengths spanning block boundaries)`)
}

// ---- 1. canonicalisation is order-independent ----------------------------
{
  const a = { b: 1, a: 2, nested: { y: 9, x: 8 } }
  const b = { nested: { x: 8, y: 9 }, a: 2, b: 1 }
  eq(canonicalize(a), canonicalize(b), 'canonicalize ignores key order')
  eq(hashProposal(a), hashProposal(b), 'h_proposal is key-order invariant')
}

// ---- 2. the cross-derivation invariant (the CR-7 fence) ------------------
// The Gap must write EXACTLY canonicalize(proposal) — no trailing newline —
// so an auditor hashing the file on disk reproduces h_proposal.
{
  const dir = mkdtempSync(join(tmpdir(), 'gap-test-'))
  try {
    const proposal = { leverId: 'x', compressedText: 'hello world', expectedMetric: 2 }
    const canon = canonicalize(proposal)
    const path = join(dir, 'proposal_canon.json')
    writeFileSync(path, canon)                       // exact bytes, no newline
    const fileHash = createHash('sha256').update(readFileSync(path)).digest('hex')
    eq(fileHash, hashCanon(canon), 'sha256(written file) == hashCanon(canon)  [verify_run replay]')

    // and the failure mode CR-7 caught: a stray trailing newline breaks it.
    const path2 = join(dir, 'with_newline.json')
    writeFileSync(path2, canon + '\n')
    const fileHash2 = createHash('sha256').update(readFileSync(path2)).digest('hex')
    ok(fileHash2 !== hashCanon(canon), 'a trailing newline breaks the match (the CR-7 defect, now a test)')
  } finally { rmSync(dir, { recursive: true, force: true }) }
}

// ---- 3. the draw is deterministic and byte-faithful ----------------------
// Re-implement the prompt's procedure independently here and demand agreement:
// digest bytes left to right, idx = b_k mod remaining, remove without replacement.
{
  const seed = createHash('sha256').update('a fixed proposal').digest('hex')
  const N = 32, count = 8
  const bytes = Buffer.from(seed, 'hex')
  const remaining = Array.from({ length: N }, (_, i) => i + 1)
  const expect = []
  for (let k = 0; k < count; k++) {
    const idx = bytes[k] % remaining.length
    expect.push(remaining[idx]); remaining.splice(idx, 1)
  }
  eq(draw(seed, N, count), expect, 'draw matches the byte procedure the prompt described')
  eq(draw(seed, N, count), draw(seed, N, count), 'draw is deterministic (same seed → same draw)')
}

// ---- 4. the draw is a valid permutation prefix ---------------------------
{
  const seed = createHash('sha256').update('another proposal').digest('hex')
  const picks = draw(seed, 32, 8)
  eq(picks.length, 8, 'draw returns count indices')
  eq(new Set(picks).size, 8, 'draw indices are distinct (without replacement)')
  ok(picks.every(i => i >= 1 && i <= 32), 'draw indices are all in 1..N')
  // a large, census-scale draw (past the 32-byte head) stays valid
  const big = draw(seed, 200, 120)
  eq(new Set(big).size, 120, 'a >32 draw extends the byte stream and stays distinct')
  ok(big.every(i => i >= 1 && i <= 200), 'extended draw indices stay in range')
}

// ---- 5. seed modes: legacy vs salted -------------------------------------
{
  const p = { leverId: 'x', compressedText: 'preserve every fact' }
  const h = hashProposal(p)
  eq(deriveSeed({ hProposal: h }), h, 'legacy mode: seed == h_proposal (historic-run compatible)')
  const salted = deriveSeed({ hSource: 'aa', hProposal: h, salt: 'bb' })
  ok(salted !== h, 'salted mode: folding a salt moves the seed off the proposal hash')
  const salted2 = deriveSeed({ hSource: 'aa', hProposal: h, salt: 'cc' })
  ok(salted !== salted2, 'a different salt gives a different seed (grinding the proposal no longer fixes the draw)')
  // holdApart end-to-end, legacy vs salted, must differ in the draw
  const legacyDraw = holdApart({ proposal: p, N: 32, count: 8 }).drawIndices
  const saltedDraw = holdApart({ proposal: p, N: 32, count: 8, hSource: 'aa', salt: 'bb' }).drawIndices
  ok(JSON.stringify(legacyDraw) !== JSON.stringify(saltedDraw), 'the salt changes which facts are probed')
}

// ---- 6. loud failure on bad arguments ------------------------------------
{
  throws(() => draw('ab', 5, 0), 'draw refuses count < 1')
  throws(() => draw('ab', 0, 1), 'draw refuses N < 1')
  throws(() => draw('ab', 3, 4), 'draw refuses count > N')
  throws(() => deriveSeed({ salt: 'bb' }), 'deriveSeed refuses a missing h_proposal')
}

console.log('')
if (failures) { console.error(`${failures} gap.test assertion(s) FAILED.`); process.exit(1) }
console.log('gap.test: all assertions pass.')
