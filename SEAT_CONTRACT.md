# SEAT CONTRACT — what a harness config provides

The engine (`engine/dual_agent_loop.mjs`) is target-agnostic. A concrete
harness is a **config object** that fills the seats for one domain. You
should never need to touch the engine; you write a config, bundle it with
`tools/bundle.mjs`, and run it.

## The seven seats

| seat id | holder | glyph | algebra | phase | permitted writes |
|---|---|---|---|---|---|
| `measure` | the assessor | 🧙💰 | — | Measure | nothing (numbers are returned, not written) |
| `propose` | **soulbae** | 🧙 | `bnot` | Propose | nothing (plans only, never implements) |
| `hold-apart` | **the Gap** | ⿻ | `xor` | Hold-apart | `runs/<id>/p<i>-*/gap.json` |
| `assay` | **soulbis** | ⚔️ | `neg` | Assay | `runs/<id>/p<i>-*/` scratch + `verdict.json` |
| `critic` | the critic | 🗡️ | — | Critic | nothing (classifications are returned) |
| `chronicle` | the chronicler | 📚 | — | Chronicle | `runs/<id>/CHRONICLE_DRAFT.md` |
| `keystone` | **soulbae ⊥ soulbis** | 🧙⚔️ | `succ` | between rounds, main session | `frontier.json` · `claims_register.md` · `manifest.yaml` · fold into the artifact |

The three algebra seats are the core: soulbae proposes (`bnot`, complement —
reduce, reshape), the Gap separates (`xor`, the held-apart derivation),
soulbis proves (`neg`, negation — the verdict that does not flatter). Their
composition is the successor: `neg(bnot(x)) = succ(x)`. The keystone is not a
third agent — it is the pair itself, operating in the main session where the
ledgers live, with the door (G4) always the First Person's.

## The config shape

```js
export default {
  name: 'my-harness',

  // objective — the first three required; the fourth is advised and will
  // likely become required
  objective: {
    metric: 'what frontier.json tracks, lower is better (e.g. "words")',
    gate: 'the held-out check that must fully pass — T5: zero collapses',
    hardConstraint: 'validity no score can override — GR-3',
    canary: 'an artifact that passes `gate` BY CONSTRUCTION, and why',
  },

  // trust literals — conform.mjs checks these
  door: 'first-person',                       // T6, exact literal
  heldApartRule: 'REQUIRED. Injected verbatim into every propose prompt. ' +
    'State that the proposer never sees, chooses, or influences the ' +
    'held-out witnesses, and that witnesses derive from the proposal ' +
    'artifact by hashing.',                   // T2 / GR-4
  keystoneOnlyWrites: ['frontier.json', 'claims_register.md', 'manifest.yaml'],

  // finders — soulbae's parallel lenses, >= 2, blind to each other
  finders: [
    { lens: 'lens-a', hint: 'what this lens looks for' },
    { lens: 'lens-b', hint: 'a genuinely different angle' },
  ],

  // prompt builders — strings; the engine prepends the boot preamble
  prompts: {
    measure:   (ctx) => '...',
    propose:   (finder, measure, ctx) => '...',
    holdApart: (proposal, i, ctx) => '...',
    assay:     (proposal, gap, i, ctx) => '...',
    critic:    (proposals, verdicts, ctx) => '...',
    chronicle: (round, ctx) => '...',
  },

  // JSON Schemas forcing structured seat output — all five required
  schemas: { measure, proposal, gap, verdict, critic },

  // stopping
  stop: { dryRounds: 2, maxRounds: 5 },

  // predicates
  isValidated:  (v, measure) => v.status === 'VALIDATED',  // must already
      // conjoin gate-pass AND metric win inside the assay verdict (T5)
  isStructural: (critic, leverId) =>
      critic.classifications?.some(c => c.leverId === leverId && c.class === 'structural'),

  // optional: extra numeric checks conform.mjs runs against frontier.json
  conformChecks: [(frontier) => /* return array of error strings */ []],
}
```

`ctx` is `{ root, repo, runId, runDir, config }` — paths already normalized.
`repo` is the instance directory (frontier, artifact, runs); `root` is the
skeleton clone holding `GROUND_RULES.md`, `TRUSTS.md`, and `seats/`, which
every seat boots from (T3). Pass `root` in the run args whenever the instance
lives outside the skeleton and does not carry its own copies of those
documents — it defaults to `repo`.

## Recommended schema fields

Instantiate these for your domain; the shapes below are what survived the
source harnesses.

- **proposal**: the schema validates one FINDER's return, and the engine
  expects the wrapper `{ proposals: Proposal[] }` (a lens may return more
  than one lever). Each `Proposal` is `{ leverId, title, lens, rationale,
  expectedMetric, hardConstraintNote, diffPlan, killedLeverCitations[] }` —
  `leverId` is a short kebab id; `diffPlan` names real parts of the real
  artifact; `killedLeverCitations` proves the proposer read
  `notes/KILLED_LEVERS.md`.
- **gap**: `{ seedHex, draw, transcript }` — the transcript must let a third
  party re-derive the seed: the exact canonical serialization (sorted keys,
  no whitespace), the exact hash command, the exact draw rule.
- **verdict**: `{ leverId, status: 'VALIDATED'|'MIRAGE'|'BLOCKED', metric,
  gateResult, evidence, scratchDir }` — evidence is run commands plus key
  output lines. `MIRAGE` = passed the proposer's story, failed the full gate;
  name the failing check. `BLOCKED` = could not run; name the missing piece.
- **critic**: `{ classifications: [{leverId, class:
  'structural'|'probe-limited'|'noise', why}], nextLead, killedLeverDrafts[] }`
  — exactly one `nextLead`.

### Optional: `mana` (advisory, display-only)

A config MAY declare `mana: ['🌞', …]` (or a single string) — the instance's
declared mana affinity from the workshop taxonomy of its universe. The engine
ignores it entirely; the conformance gate does not check it; the workshop
console and the artefact mint carry it through as display chips and as
`artefact.json.mana`. It is colour, not proof — *the mana is what you play
with; the VRC is what you prove with* — and an instance with no universe
simply omits it.

## The canary — and when NOT to build a harness

**A gate with no artifact known to pass it cannot distinguish a bad candidate
from an impossible gate.** Name one, in `objective.canary`.

The spar is safe by accident: its 8 questions are drawn *from* `GUIDE.md`, so
the uncompressed original answers all 8 by construction. The feasible set is
provably non-empty, and every `MIRAGE` is therefore the candidate's fault.
Take the canary away and a total failure becomes ambiguous — which is exactly
what happened to the `universe-builder` instance, where two blind lenses each
scored 0/8 against a gate that *no* candidate could pass, and the critic,
having no word for a bad gate, convicted the proposer on sound evidence.
`conform.mjs` advises on a missing canary today.

Before you write any of this, ask whether you need a harness at all:

> **The Gap earns its cost only where the claim space is too large to check.**

shor_mage samples 9,024 witnesses because you cannot run every input. tigzkp
samples held-out points because R1CS equivalence cannot be enumerated. There,
sampling is a necessity and hashing the proposal is what makes it honest.

If your claim space is **enumerable**, check all of it. Against an exhaustive
check a mirage is impossible: there is nothing to tune to. You want an
**auditor** — deterministic, total, cheap — not a prover. `universe/audit.mjs`
is one, and `universe/retired/` is the harness it replaced, kept as a worked
negative result.

The complementary test, from Promise Theory: the split is warranted when a
single agent would have to promise **two things it cannot independently
control**. If one agent can honestly promise the whole job — because anyone
may verify it completely, afterward — you do not need the pair.

## Product objectives — the complement pair

If your objective is a **product** of two factors (say `gates × qubits`),
give soulbae one finder per factor — Factor-A-minimiser ⊥ Factor-B-minimiser,
blind to each other — and put a **cliff-watcher** clause in the assay prompt:
score Δ(product), and reject any move that wins one factor at the other's
expense past break-even. The constitutional basis is T5: any zero (or any
net-negative trade) collapses the whole. This pattern comes from the
shor_mage instance, where the score is `avg executed Toffoli × peak qubits`.

When one factor is a **binary gate** (pass/fail), the gate itself is the
cliff-watcher: a fail is a zero, and a zero collapses the product. The spar
(`examples/field-guide/`) uses this form.

## The runtime adapter

The engine takes `rt = { agent, parallel, pipeline, phase, log }`:

- `agent(prompt, opts) -> Promise<any>` — run a subagent; with
  `opts.schema` (JSON Schema) it returns a validated object.
- `parallel(thunks) -> Promise<any[]>` — barrier; failed thunks resolve null.
- `pipeline(items, ...stages) -> Promise<any[]>` — per-item stages, no
  barrier between stages; stage callbacks receive `(prev, item, index)`.
- `phase(title)`, `log(msg)` — progress display.

`runHarness` returns `{ status, rounds, tally, confirmed, best, detail,
keystoneTodo }`. **`status` is `'COMPLETE'` or `'INCOMPLETE'`.** A round that
loses a seat to infrastructure — a dead agent, a killed session — is marked
`FAILED`, does **not** count as a dry round, and stops the loop with an
`aborted` block naming the dead seats. An outage is not an exhausted search,
and `keystoneTodo` says **FOLD NOTHING** when the two are confused. A finder
that *returns* zero proposals is still a dry round: empty is evidence, dead is
not. `engine/loop.test.mjs` pins this.

Inside the Claude Code **Workflow tool** these five exist as globals and
`import` is unavailable — which is why `tools/bundle.mjs` concatenates the
engine and your config into one self-contained `.workflow.mjs`. Under the
Claude Agent SDK or a plain node driver, implement the five functions
yourself and call `runHarness(config, rt)` directly. Configs must therefore
be self-contained: no imports.
