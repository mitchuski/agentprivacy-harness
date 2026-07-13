// attacks/run.mjs — run the red board and report.
//
//   node engine/attacks/run.mjs        (also reachable as: node tools/check.mjs --red)
//
// Runs every runnable attack against the live mechanism, prints the outcome
// table, and lists the declared attacks with the commit that makes each
// testable. Exit code:
//
//   non-zero  if any attack that is SUPPOSED to be blocked is currently winning
//             — i.e. the board is RED. This is the intended state before the
//             fixes land; each commit turns its attack green.
//   zero      only when every non-known-limit runnable attack is blocked.
//
// sample_hugger is a known limit: it wins and does not fail the board. A harness
// that publishes the attack it cannot stop earns more trust than one that hides
// it.

import { runnable, declared } from './registry.mjs'

const results = runnable.map(a => ({ meta: a.meta, ...a.run() }))

const width = Math.max(...runnable.map(a => a.meta.id.length), ...declared.map(a => a.meta.id.length))
const pad = (s) => s.padEnd(width)

console.log('\n── red-team board ─────────────────────────────────────────────\n')
console.log('runnable (exercised against the live mechanism):\n')
for (const r of results) {
  const mark = r.won ? (r.meta.knownLimit ? ' LIMIT' : '  WON ') : ' block'
  console.log(`  ${mark}  ${pad(r.meta.id)}  [${r.meta.targets} → ${r.meta.landsIn}]  ${r.detail}`)
}

console.log('\ndeclared (become runnable as their machinery lands):\n')
for (const d of declared) {
  console.log(`  ·      ${pad(d.meta.id)}  [${d.meta.targets} → ${d.meta.landsIn}]  ${d.meta.summary} — now: ${d.meta.expectedNow}`)
}

// The board is red if any non-known-limit attack currently wins.
const breaches = results.filter(r => r.won && !r.meta.knownLimit)

console.log('')
if (breaches.length) {
  console.error(`RED BOARD: ${breaches.length} attack(s) win that must be blocked.`)
  for (const b of breaches) console.error(`  → ${b.meta.id} (${b.meta.targets}): ${b.detail}`)
  console.error(`\nEach breach is a defect with a home: fix it in its landsIn commit, then this line goes green.`)
  process.exit(1)
}
const limits = results.filter(r => r.won && r.meta.knownLimit)
console.log(`GREEN BOARD: every runnable non-known-limit attack is blocked.${limits.length ? ` (${limits.length} documented known limit: ${limits.map(l => l.meta.id).join(', ')})` : ''}`)
if (declared.length) console.log(`(${declared.length} attack(s) still DECLARED, not yet runnable — their machinery lands in: ${[...new Set(declared.map(d => d.meta.landsIn))].join(', ')}. The board is not "all clear" until they run.)`)
