#!/usr/bin/env node
// adventure.mjs — the front door: choose your own adventure. Read-only. It
// looks at what exists around you, then prints the paths this workshop opens
// — from the most academic to the most myth — each with the exact commands
// that walk it. WORKFLOW.md is the same map in prose.
//
//   node tools/adventure.mjs

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(join(here, '..'))
const readJson = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return null } }
const g = (s) => `\x1b[33m${s}\x1b[0m`, c = (s) => `\x1b[36m${s}\x1b[0m`, d = (s) => `\x1b[2m${s}\x1b[0m`

// ── what exists around you ───────────────────────────────────────────────────
const spar = readJson(join(root, 'examples', 'field-guide', 'frontier.json'))
const farm = existsSync(join(root, 'examples', 'wiki-farm'))
const universe = existsSync(join(root, 'universe'))
const instances = []
for (const base of [root, resolve(join(root, '..'))]) {
  try { for (const e of readdirSync(base)) {
    const p = join(base, e)
    try { if (statSync(p).isDirectory() && existsSync(join(p, 'harness.config.mjs')) && p !== root) instances.push(p) } catch {}
  } } catch {}
}

console.log(`
  ${g('(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ')}

  One agent proposes. A second independently proves. The tests are drawn by
  hashing the proposal with a secret the proposer never sees. Everything else
  is a path from that one idea — pick yours.

  ${d('found here:')} the spar${spar ? ` (frontier ${spar.baseline?.metric} → ${spar.best?.metric})` : ' (unmeasured)'} · ${farm ? 'the sample wiki federation' : 'no sample farm'} · ${universe ? "one project's universe behind its seam" : 'no universe seam (fine)'}${instances.length ? ` · ${instances.length} instance(s) nearby` : ''}

  ${c('🤺 THE SPAR')} — feel the discipline before you trust it ${d('(start here)')}
     node tools/check.mjs                        ${d('every gate this repo has')}
     ${d('then run a round:')} README step 3 ${d('— Workflow tool or your own rt driver')}
     node tools/render_run.mjs examples/field-guide r4
     node tools/console.mjs                      ${d('watch a bout live on :4242')}

  ${c('🧙 BUILD YOUR OWN')} — the setup wizard that installs a mage
     node tools/new_instance.mjs ../my-harness my-harness
     ${d('fill every TODO (the gate refuses until you do), then:')}
     node engine/conform.mjs ../my-harness
     node tools/bundle.mjs ../my-harness/harness.config.mjs ../my-harness/harness.workflow.mjs
     ${d('ADOPTION.md is the map: five answers, define the Gap first')}

  ${c('🎓 THE ACADEMIC PATH')} — autoresearch: claims that survive an adversary
     ${d('the pattern: sweep bench ⊥ refute bench ⊥ judge, refuters blind to the')}
     ${d('prover (HARNESS_PATHS.md §15 · the litreview runtime). Absence is never')}
     ${d('novelty; an all-clear run indicts itself. RESEARCH.md holds the bar.')}

  ${c('🕸️ THE FEDERATION PATH')} — research that auto-populates a wiki
     wiki --farm --data ${farm ? 'examples/wiki-farm' : '<your farm dir>'} --port 3030
     node tools/wiki_install.mjs <instance> --farm examples/wiki-farm
     ${d('pages for people · /assets/spellweb/graph.json for agents · WIKI.md')}
     ${d('for serving beyond localhost (tailnet, hardening) — that part is the door')}

  ${c('⭐ THE LATTICE PATH')} — seat the work on ℤ/64ℤ
     node tools/star.mjs <instance>              ${d('vertex ⊥ anchor (63 XOR v), results at κ mod 64')}
     node tools/spellweb.mjs --workshop .        ${d('the whole machine as one graph (data; GRAPH.md)')}
     node tools/emit_feed.mjs <instance>         ${d('runtime-feed.v1 → /star, game42, spellweb')}
     ${d('geometry and colour, never proof — a City Key import is the door')}

  ${c('📖 THE MYTH PATH')} — the same truths, told as story
     ${d('SPECIALISATION.md: personas and spells bound to seats · chronicles/')}
     ${d('read in date order: the system telling its own tale, verdict first.')}
     ${d('The academic path and this one compress to the SAME invariant — that')}
     ${d('is the point, and the census would catch them drifting.')}

  ${d('Every path ends at the same place: a gate the proposer cannot choose,')}
  ${d('a ledger only one seat writes, and a door — push, publish, serve,')}
  ${d('submit — that is yours alone. WORKFLOW.md is this map in full.')}
`)
