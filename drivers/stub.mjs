// drivers/stub.mjs — a deterministic seat driver. No model, no network, no clock.
//
// Exists so the whole six-phase loop, the file layout, conform and
// verify_run.mjs can be proven green on any machine with Node alone. Every
// seat answer is a pure function of the prompt text, so two runs of the same
// round produce byte-identical artefacts.
//
// The stub never folds anything: its proposals restate the artefact unchanged
// and its assay returns MIRAGE ("a stub graded no real candidate"), which is
// the truthful verdict for a round in which no model held a seat. Use it to
// see the machinery move; use drivers/ollama.mjs or drivers/anthropic.mjs to
// see it think.

const grab = (re, s, fallback = null) => { const m = re.exec(s); return m ? m[1] : fallback }

export function makeStubRt() {
  return {
    async agent(prompt, opts = {}) {
      const label = opts.label || ''
      const p = String(prompt)
      if (label.startsWith('measure:')) {
        const metric = Number(grab(/"metric":\s*(\d+)/, p, '0'))
        return { metric, stale: false, leverCosts: [{ lever: 'stub', cost: 'none', ceiling: 'none — the stub proposes nothing new' }], notes: 'stub measure: restates the count the runner injected' }
      }
      if (label.startsWith('propose:')) {
        const lens = label.slice('propose:'.length)
        const metric = Number(grab(/"metric":\s*(\d+)/, p, '1'))
        // Whatever text the config put between STUB-SOURCE markers is echoed
        // back unchanged; configs that want the stub to carry a candidate wrap
        // the artefact in those markers in their propose prompt.
        const src = grab(/<<STUB-SOURCE>>([\s\S]*?)<<\/STUB-SOURCE>>/, p, '')
        return { proposals: [{ leverId: `stub-${lens}`, title: `stub lever through ${lens}`, lens, rationale: 'deterministic stub: restates the artefact so the loop can be exercised without a model', expectedMetric: metric, hardConstraintNote: 'unchanged text cannot violate the hard constraint', diffPlan: 'no change', compressedText: src, recordJson: '{}' }] }
      }
      if (label.startsWith('gap:')) {
        const seedHex = grab(/seedHex\s*=\s*([0-9a-f]{64})/, p, '0'.repeat(64))
        return { seedHex, draw: 'stub draw: every witness, in order (census)', transcript: 'stub: seed handed by the engine (salted mode); no independent derivation performed' }
      }
      if (label.startsWith('assay:')) {
        const leverId = grab(/"leverId":"([^"]+)"/, p, 'unknown')
        return { leverId, status: 'MIRAGE', metric: Number(grab(/"metric":\s*(\d+)/, p, '0')), gateResult: '0/0', failingCheck: 'stub: no model held the prover\'s seat, so no gate was actually answered', evidence: 'stub verdict — deterministic, folds nothing', scratchDir: '' }
      }
      if (label.startsWith('critic:')) {
        const ids = [...p.matchAll(/"leverId":"([^"]+)"/g)].map(m => m[1])
        return { classifications: [...new Set(ids)].map(leverId => ({ leverId, class: 'noise', why: 'stub round: nothing was graded' })), nextLead: 'run the same round with a model in the seats (drivers/ollama.mjs or drivers/anthropic.mjs)', killedLeverDrafts: [] }
      }
      if (label.startsWith('chronicle:')) {
        return '# stub round\n\nVerdict: nothing folded — a deterministic stub held every seat. The loop ran, the seeds derived, the files landed. Run it with a model to see a fold.\n'
      }
      return null
    },
    parallel: async (thunks) => Promise.all(thunks.map(t => t().catch(() => null))),
    pipeline: async (items, ...stages) => Promise.all(items.map(async (item, i) => {
      let acc = item
      for (const stage of stages) { acc = await stage(acc, item, i); if (acc == null) return null }
      return acc
    })),
    phase: () => {},
    log: (m) => console.log('  ' + m),
  }
}
