// harness.config.mjs — evocations/primer: compress "What Agentprivacy Really Is"
// (the mission document, agentprivacy-docs/what-agentprivacy-is.md) under a
// census of its numbers, ratios, named terms, headings and emphasised phrases.
import { makeEvocationConfig } from '../_lib/evocation.config.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const here = dirname(fileURLToPath(import.meta.url))

export default makeEvocationConfig({
  name: 'evocation-primer',
  artefact: join(here, 'artifact', 'PRIMER.md'),
  censusPath: join(here, 'census.json'),
  sourceFile: 'artifact/PRIMER.md',
  hardConstraint: 'the candidate is still the mission document: first person, the thesis stated before the architecture, the architecture before the proof, the proof before the invitation; every section heading kept in order; the appendix still lists every platform, repository, spellbook, agent, protocol, standard, community, research foundation, medium and integration the original names; nothing invented; no pointer to a longer version (GR-3)',
  describe: 'This is the founder\'s mission document for the agentprivacy body of work. It argues a thesis (privacy is the seventh capital), states an architecture (Swordsman ⊥ Mage), claims proof (spellbooks, agents, media), states an epistemology (mass through retrieval), and invites others in, then appends the body of work. Compress it without losing a number, a name, a heading or an emphasised phrase.',
})
