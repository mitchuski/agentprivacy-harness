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

  // objective — all three fields required
  objective: {
    metric: 'what frontier.json tracks, lower is better (e.g. "words")',
    gate: 'the held-out check that must fully pass — T5: zero collapses',
    hardConstraint: 'validity no score can override — GR-3',
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

## Product objectives — the complement pair

If your objective is a **product** of two factors (say `gates × qubits`),
give soulbae one finder per factor — Factor-A-minimiser ⊥ Factor-B-minimiser,
blind to each other — and put a **cliff-watcher** clause in the assay prompt:
score Δ(product), and reject any move that wins one factor at the other's
expense past break-even. The constitutional basis is T5: any zero (or any
net-negative trade) collapses the whole. This pattern comes from the
shor_mage instance, where the score is `avg executed Toffoli × peak qubits`.

When one factor is a **binary gate** (pass/fail), the gate itself is the
cliff-watcher: a fail is a zero, and a zero collapses the product. The toy
example (`examples/field-guide/`) uses this form.

## The runtime adapter

The engine takes `rt = { agent, parallel, pipeline, phase, log }`:

- `agent(prompt, opts) -> Promise<any>` — run a subagent; with
  `opts.schema` (JSON Schema) it returns a validated object.
- `parallel(thunks) -> Promise<any[]>` — barrier; failed thunks resolve null.
- `pipeline(items, ...stages) -> Promise<any[]>` — per-item stages, no
  barrier between stages; stage callbacks receive `(prev, item, index)`.
- `phase(title)`, `log(msg)` — progress display.

Inside the Claude Code **Workflow tool** these five exist as globals and
`import` is unavailable — which is why `tools/bundle.mjs` concatenates the
engine and your config into one self-contained `.workflow.mjs`. Under the
Claude Agent SDK or a plain node driver, implement the five functions
yourself and call `runHarness(config, rt)` directly. Configs must therefore
be self-contained: no imports.
