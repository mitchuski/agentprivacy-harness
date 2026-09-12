// harness.config.mjs — evocations/whitepaper: compress the Swordsman ⊥ Mage
// whitepaper v6.3 (agentprivacy-docs/papers/whitepapers/swordsman_mage_whitepaper_v6_3.md)
// under a census of its numbers and versions, every ## section, every
// bold-defined term, the named vocabulary and the formal expressions.
import { makeEvocationConfig } from '../_lib/evocation.config.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const here = dirname(fileURLToPath(import.meta.url))

export default makeEvocationConfig({
  name: 'evocation-whitepaper',
  artefact: join(here, 'artifact', 'WHITEPAPER.md'),
  censusPath: join(here, 'census.json'),
  sourceFile: 'artifact/WHITEPAPER.md',
  hardConstraint: 'the candidate is still the whitepaper: every ## section kept in order; every **Term**: definition in Core Terminology kept as a definition; the formal expressions (the separation bound, the reconstruction ceiling, the shared root, the inscription) kept exactly; the worked examples and the proverb walkthrough still teach what they taught; nothing invented; no pointer to a longer version (GR-3)',
  describe: 'This is the Swordsman ⊥ Mage whitepaper, version 6.3: the formal statement of the dual-agent architecture, the Privacy Value Model, the six trusts, the Relationship Proverb Protocol and the verification protocol, with worked examples. It is long and repeats itself across sections written at different times. Compress it without losing a number, a version, a section, a defined term, a named protocol or a formal expression.',
})
