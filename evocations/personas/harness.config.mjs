// harness.config.mjs — evocations/personas: compress the bodies of the 42
// persona skills (agentprivacy-skills/persona/*/SKILL.md) under a census of
// each persona's four frontmatter invariants (alignment · equation_term ·
// proverb · spell), every ## heading of each body, and each persona's name.
// The artefact is the 42 bodies concatenated under their names
// (evocations/_lib/personas_census.mjs builds it); a validated fold is carried
// back to the 42 files by the keeper, one body each, frontmatter untouched.
import { makeEvocationConfig } from '../_lib/evocation.config.mjs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const here = dirname(fileURLToPath(import.meta.url))

export default makeEvocationConfig({
  name: 'evocation-personas',
  artefact: join(here, 'artifact', 'PERSONAS.md'),
  censusPath: join(here, 'census.json'),
  sourceFile: 'artifact/PERSONAS.md',
  hardConstraint: 'every one of the 42 personas is still present under its own # name heading with every ## section it had, in order; each persona\'s equation_term, proverb, spell and alignment still appear verbatim in its body or are restated there exactly; a persona still reads as a seat an agent can be dressed with — what it knows, when it activates, what it refuses; nothing invented; no persona merged into another (GR-3)',
  describe: 'This is the cast: 42 persona skills in the open agent-skills format, each a seat the harness can dress — an alignment (swordsman · mage · balanced · cosmological), an equation term it answers for, a proverb (its one-line law), a spell (its procedure in miniature), and a body saying what it knows, when it activates and what it refuses. The bodies repeat the same scaffolding 42 times. Compress the bodies without losing any persona, any of its four invariants, or any of its section headings.',
  finders: [
    { lens: 'scaffold-collapser', hint: 'the 42 bodies share boilerplate (identity preamble, spellbook-alignment framing, activation lists written the same way); collapse the shared scaffolding inside each body to its operative content without dropping a heading, a name or an invariant' },
    { lens: 'line-editor', hint: 'sentence-level compression inside each persona body: cut redundancy and filler; never drop a heading, a name, an equation term, a proverb, a spell or an alignment' },
  ],
})
