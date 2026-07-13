#!/usr/bin/env node
// mint_artefact.mjs — seal a validated run into an artefact and carry it to
// the door. And STOP there.
//
//   node tools/mint_artefact.mjs <instanceDir> <runId> [--round <roundId>]
//
// Writes <instanceDir>/artefacts/<id>/
//   artefact.json   — κ-labelled record (City Key / sigil Law L5 convention:
//                     sha256 over canonical JSON, the κ field excluded from
//                     its own preimage — never trusted, only re-derived)
//   evidence/       — byte copies of every proposal_canon.json, gap.json,
//                     verdict.json, candidate.md, the chronicle, frontier.json
//   DOOR.md         — the outward actions this tool did NOT take, as
//                     copy-pasteable commands for the First Person (T6/GR-8)
//
// REFUSES, naming the reason (exit 1):
//   - any proposal whose recorded Gap seed does not re-derive from the saved
//     canon bytes (witnesses of unknown origin certify nothing — GR-4)
//   - a non-green conformance gate (G0 before anything moves)
//   - a run with no verdict anywhere (a candidate is not a result — GR-5)
//
// This tool shares no gathering code with tools/console.mjs at runtime — it
// re-derives everything itself, deliberately (two auditors, not one).
// Zero dependencies.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync, mkdirSync, copyFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join, resolve, relative, basename } from 'node:path'
import { canonicalJson, sha256Hex, kappaOf } from './kappa.mjs'  // the one κ law (HOLONS.md)

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(join(here, '..'))

const argv = process.argv.slice(2)
const positional = argv.filter(a => !a.startsWith('--'))
let onlyRound = null
for (let i = 0; i < argv.length; i++) if (argv[i] === '--round') onlyRound = argv[i + 1]
if (positional.length < 2) {
  console.error('usage: node tools/mint_artefact.mjs <instanceDir> <runId> [--round <roundId>]')
  process.exit(1)
}
const instDir = resolve(positional[0])
const runId = positional[1]
const relInst = instDir.startsWith(repoRoot) ? relative(repoRoot, instDir).replace(/\\/g, '/') : instDir.replace(/\\/g, '/')

const refuse = (why) => { console.error(`MINT REFUSED — ${why}`); process.exit(1) }
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex')  // file bytes → hex
const sha256File = (p) => sha256(readFileSync(p))
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))
const maybeJson = (p) => { try { return readJson(p) } catch { return null } }
// canonicalJson + sha256Hex + kappaOf come from tools/kappa.mjs — the one κ law.

// ---- gather the run (independent re-derivation) -----------------------------
const runDir = join(instDir, 'runs', runId)
if (!existsSync(runDir)) refuse(`no such run: ${runDir}`)

const isProposalDir = (n) => /^p\d+-/.test(n)
const proposals = []   // {name, dir, roundId}
const rounds = new Set()
let chronicleDraft = null
for (const e of readdirSync(runDir, { withFileTypes: true })) {
  if (e.isDirectory() && isProposalDir(e.name)) { proposals.push({ name: e.name, dir: join(runDir, e.name), roundId: runId }); rounds.add(runId) }
  else if (e.isDirectory()) {
    if (onlyRound && e.name !== onlyRound) continue
    for (const s of readdirSync(join(runDir, e.name), { withFileTypes: true })) {
      if (s.isDirectory() && isProposalDir(s.name)) { proposals.push({ name: `${e.name}/${s.name}`, dir: join(runDir, e.name, s.name), roundId: e.name }); rounds.add(e.name) }
      else if (s.isFile() && /chronicle/i.test(s.name) && s.name.endsWith('.md')) chronicleDraft = join(runDir, e.name, s.name)
    }
  } else if (e.isFile() && /chronicle/i.test(e.name) && e.name.endsWith('.md')) chronicleDraft = join(runDir, e.name)
}
if (!proposals.length) refuse(`run ${runId} has no proposal scratch dirs`)

// ---- the three refusals ------------------------------------------------------
// 1. every seed must re-derive (GR-4)
const audited = proposals.map(p => {
  const canonPath = join(p.dir, 'proposal_canon.json')
  const gap = maybeJson(join(p.dir, 'gap.json'))
  const derived = existsSync(canonPath) ? sha256File(canonPath) : null
  const recorded = gap && typeof gap.seedHex === 'string' ? gap.seedHex.toLowerCase() : null
  const hashState = derived && recorded ? (derived === recorded ? 'MATCH' : 'MISMATCH') : 'INCOMPLETE'
  const verdict = maybeJson(join(p.dir, 'verdict.json'))
  return { ...p, derived, recorded, hashState, verdict, canonPath }
})
const bad = audited.filter(p => p.hashState !== 'MATCH')
if (bad.length) refuse(`witnesses of unknown origin certify nothing (GR-4). Non-MATCH proposals: ${bad.map(p => `${p.name} [${p.hashState}]`).join(', ')}`)

// 2. conform must be green (G0)
const conform = spawnSync(process.execPath, ['engine/conform.mjs', relInst], { cwd: repoRoot, encoding: 'utf8' })
if (conform.status !== 0) refuse(`the conformance gate is not green — fix that first (G0):\n${(conform.stdout || '') + (conform.stderr || '')}`)

// 3. a candidate is not a result (GR-5)
const withVerdicts = audited.filter(p => p.verdict && p.verdict.status)
if (!withVerdicts.length) refuse('no verdict.json anywhere in this run — a candidate is not a result (GR-5)')

// ---- assemble ----------------------------------------------------------------
const frontier = maybeJson(join(instDir, 'frontier.json'))
const cfg = await (async () => {
  try { return (await import(pathToFileURL(join(instDir, 'harness.config.mjs')).href)).default } catch { return {} }
})()

// the filed chronicle beats the draft, if one names this run
let chronicle = null
const chronDir = join(instDir, 'chronicles')
if (existsSync(chronDir)) {
  for (const f of readdirSync(chronDir).filter(f => f.endsWith('.md')).sort().reverse()) {
    const text = readFileSync(join(chronDir, f), 'utf8')
    const fm = {}
    if (text.startsWith('---')) {
      const end = text.indexOf('\n---', 3)
      for (const line of text.slice(3, end).split('\n')) { const m = line.match(/^([\w-]+):\s*(.*)$/); if (m) fm[m[1]] = m[2] }
    }
    if ((fm.runId || '').startsWith(runId) || text.includes(`runs/${runId}/`)) { chronicle = { path: `chronicles/${f}`, frontmatter: fm, abs: join(chronDir, f) }; break }
  }
}
if (!chronicle && chronicleDraft) chronicle = { path: relative(instDir, chronicleDraft).replace(/\\/g, '/'), frontmatter: { note: 'DRAFT — keystone has not filed it yet (GR-7)' }, abs: chronicleDraft }

const bestLevers = new Set((frontier && frontier.best && frontier.best.leverIds) || [])
const artefactProposals = withVerdicts.map(p => ({
  leverId: p.verdict.leverId,
  path: `runs/${runId}/${p.name}/`.replace(/\/+/g, '/'),
  seedHex: p.recorded,
  derivedSha256: p.derived,
  hashState: p.hashState,
  // coverage travels with the seal (D2): a downstream verifier sees exactly
  // what a VALIDATED bought — CENSUS (every witness) or SAMPLE n/N with its
  // single-omission detection probability. A sample is never dressed as a proof.
  verdict: { status: p.verdict.status, metric: p.verdict.metric, gateResult: p.verdict.gateResult, coverage: p.verdict.coverage || null },
  verdictSha256: sha256File(join(p.dir, 'verdict.json')),
}))

// universe drafts — only when the layer is present (the seam)
let universe = null
const uniPath = join(repoRoot, 'universe', 'universe.json')
if (instDir.startsWith(repoRoot) && existsSync(uniPath)) {
  const uni = maybeJson(uniPath) || {}
  const instName = cfg.name || basename(instDir)
  const pair = ((uni.vertex_inventory || {}).seated_pairs || []).find(sp => (sp.instances || []).includes(instName)) || null
  const headline = withVerdicts.filter(p => p.verdict.status === 'VALIDATED').sort((a, b) => (a.verdict.metric ?? 1e12) - (b.verdict.metric ?? 1e12))[0]
  universe = {
    spellwebNodeDraft: {
      id: 'PLACEHOLDER-until-id-assigned',
      type: 'artefact',
      label: `${instName} ${runId} — ${headline ? `${headline.verdict.metric} ${((frontier || {}).objective || {}).metric || ''} ${headline.verdict.status}` : 'sealed run'}`.trim(),
      desc: chronicle && chronicle.frontmatter && chronicle.frontmatter.verdict ? chronicle.frontmatter.verdict : 'sealed harness run',
      edgeDrafts: [{ source: 'PLACEHOLDER-until-id-assigned', target: `harness-instance-${instName}`, type: 'validated_by' }],
      $note: 'A DRAFT for the spellweb builder. A validated round PROPOSES an edge; only a signature MINTS it.',
    },
    wikiPageDraft: {
      title: `${instName} ${runId} Artefact`,
      story: [
        { type: 'paragraph', text: chronicle && chronicle.frontmatter && chronicle.frontmatter.verdict || 'sealed harness run' },
        { type: 'code', text: artefactProposals.map(p => { const cov = p.verdict.coverage; const covLabel = cov ? ` · ${cov.mode === 'census' ? `CENSUS ${cov.N}/${cov.N}` : `SAMPLE ${cov.N} (detection ${cov.detection})`}` : ''; return `${p.leverId}: seed ${p.seedHex} re-derives ${p.hashState} · ${p.verdict.status} ${p.verdict.metric ?? ''}${covLabel}` }).join('\n') },
      ],
    },
    gatehouse: { eligible: true, note: 'wrapping this bundle in a sigil-gate is a First Person ceremony (agentprivacy-guide-gatehouse)' },
    vertexHint: pair ? { pair: pair.pair, reading: pair.reading } : null,
    edgeRule: (uni.the_edge_rule || {}).statement || null,
  }
}

const artefact = {
  artefact: 'dual-agent-harness/artefact.v1',
  id: null,   // set after κ
  'κ': null,  // set below — sha256 over canonical JSON with this field excluded
  mintedAt: new Date().toISOString(),
  mintedBy: `node tools/mint_artefact.mjs ${relInst} ${runId}${onlyRound ? ' --round ' + onlyRound : ''}`,
  status: 'PREPARED',
  door: {
    owner: 'first-person',
    actionsTaken: [],
    actionsAvailable: ['git commit/push', 'fedwiki publish', 'gatehouse sigil-gate', 'send'],
    note: 'Software prepared this bundle and stopped. Any outward movement is the First Person’s alone (T6/GR-8).',
  },
  instance: { name: cfg.name || basename(instDir), dir: relInst },
  run: { runId, rounds: [...rounds].sort() },
  frontier: frontier ? {
    beat: artefactProposals.some(p => bestLevers.has(p.leverId)),
    objectiveMetric: (frontier.objective || {}).metric || null,
    baseline: (frontier.baseline || {}).metric ?? null,
    best: (frontier.best || {}).metric ?? null,
    openTarget: (frontier.openTarget || {}).id || null,
    updated: frontier.updated || null,
    sha256: sha256File(join(instDir, 'frontier.json')),
  } : null,
  proposals: artefactProposals,
  chronicle: chronicle ? { path: chronicle.path, frontmatter: chronicle.frontmatter, sha256: sha256File(chronicle.abs) } : null,
  conform: { command: `node engine/conform.mjs ${relInst}`, exit: 0, at: new Date().toISOString() },
  evidenceManifest: {},   // filled after the copies
  mana: cfg.mana || null,
  universe,
  inscription: '(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ',
}

// ---- provisional κ to fix the id, then evidence, then final κ ----------------
// (id derives from κ over the artefact WITHOUT evidenceManifest; the manifest
// is then added and κ recomputed over the full record. Both derivations are
// re-runnable by anyone from the shipped JSON.)
const provisional = { ...artefact }
delete provisional['κ']; delete provisional.evidenceManifest
const idKappa = sha256Hex(canonicalJson(provisional))
artefact.id = 'af-' + idKappa.slice(0, 12)
if (universe) {
  artefact.universe.spellwebNodeDraft.id = 'artefact-' + artefact.id
  artefact.universe.spellwebNodeDraft.edgeDrafts.forEach(e => { e.source = 'artefact-' + artefact.id })
}

const outDir = join(instDir, 'artefacts', artefact.id)
if (existsSync(outDir)) refuse(`artefact ${artefact.id} already exists — the same evidence mints the same id (content-addressed)`)
const evDir = join(outDir, 'evidence')
mkdirSync(evDir, { recursive: true })

const copyEvidence = (absSrc, relName) => {
  const dst = join(evDir, relName.replace(/[\\/]/g, '__'))
  copyFileSync(absSrc, dst)
  artefact.evidenceManifest['evidence/' + basename(dst)] = sha256File(dst)
}
for (const p of withVerdicts) {
  for (const f of ['proposal_canon.json', 'gap.json', 'verdict.json', 'candidate.md', 'gap.journal.json']) {
    const src = join(p.dir, f)
    if (existsSync(src)) copyEvidence(src, `${p.name}/${f}`)
  }
}
if (frontier) copyEvidence(join(instDir, 'frontier.json'), 'frontier.json')
if (chronicle) copyEvidence(chronicle.abs, chronicle.path)

// final κ over the complete record (Law L5 preimage: κ excluded) — the one κ law
artefact['κ'] = kappaOf(artefact)

writeFileSync(join(outDir, 'artefact.json'), JSON.stringify(artefact, null, 2))

// ---- DOOR.md -------------------------------------------------------------------
const validated = artefactProposals.filter(p => p.verdict.status === 'VALIDATED')
writeFileSync(join(outDir, 'DOOR.md'), `# ${artefact.id} — at the door

**κ** \`${artefact['κ']}\` — re-derive it: canonical-JSON the artefact with the κ field
removed, sha256 the bytes. Never trust the label (Law L5).

Sealed from \`${relInst}\` run \`${runId}\`: ${validated.length} VALIDATED /
${artefactProposals.length} closed proposals, every Gap seed re-derived MATCH,
conform green at mint. ${artefact.frontier && artefact.frontier.beat ? 'This run’s levers are IN the folded frontier best.' : 'This run is sealed but NOT folded into the frontier.'}

## What the software did NOT do — and will not

${artefact.door.actionsAvailable.map(a => `- ${a}`).join('\n')}

*"A validated round PROPOSES an edge. Only the counterparty's signature MINTS
it."* ${universe && universe.vertexHint ? `Seated pair hint: V${universe.vertexHint.pair[0]} ⊕ V${universe.vertexHint.pair[1]} = 63.` : ''}

## If you choose to carry it outward

\`\`\`
git add ${relInst}/artefacts/${artefact.id} && git commit    # the record travels with the repo
# fedwiki: hand universe.wikiPageDraft to the harness site builder (build-harness.js)
# spellweb: hand universe.spellwebNodeDraft to the graph, and let the counterparty sign the edge
# gatehouse: mint a sigil-gate for the bundle (agentprivacy-guide-gatehouse skill)
\`\`\`

The door opens from the outside only. ${artefact.inscription}
`)

console.log(`MINTED ${artefact.id}`)
console.log(`  κ ${artefact['κ']}`)
console.log(`  ${Object.keys(artefact.evidenceManifest).length} evidence files, every hash in artefact.json.evidenceManifest`)
console.log(`  ${validated.length} VALIDATED / ${artefactProposals.length} proposals · frontier beat: ${artefact.frontier ? artefact.frontier.beat : 'n/a'}`)
console.log(`  -> ${outDir}`)
console.log(`  status PREPARED — the door is yours (T6). See DOOR.md.`)
