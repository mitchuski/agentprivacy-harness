# The Seat Contract

*What a harness config provides to `dual_agent_loop.mjs`. Edit a config, never the engine.*

A harness is a config object. The engine reads a small flat interface; a config file is free to
build that interface from richer **seat bindings** (personas, skills, finders) declared at the top
— that is where you "plug in and assign personas/skills for purpose."

## The three seats

| Seat | Algebra | Role | You assign |
|---|---|---|---|
| **🧙 Mage** | `bnot` | **proposer** — proposes the smallest bounded change that makes the artifact cheaper | a proposer persona + reduction skills + a set of **finders** (lenses) |
| **⿻ the Gap** | `⊕` | **separation** — derives the held-out witnesses from the proposer's own output so they cannot be tuned to | the held-out gate mechanism for your domain |
| **⚔️ Swordsman** | `neg` | **prover** — runs the full gate, arbitrates the true objective, signs only a validated win | a prover persona + gate/domain skills |

**The non-negotiable invariant:** `det(Σ) ≠ 0` / `I(Y_S;Y_M|X)=0`. The Mage must not see or reason
about the witness derivation. If it can grade itself, the harness is a mirage factory. The engine
takes a `heldApartRule` string and injects it into every Mage prompt; make it explicit.

## The flat interface the engine consumes

```js
export default {
  name: 'ecdsafail-pqc',                 // label
  // 🧙 Mage proposers — each a distinct lens, run in parallel, blind to one another:
  finders: [ { lens: 'gate-minimiser', mandate: '…' }, … ],
  // the non-collusion guard injected into every Mage prompt (REQUIRED):
  heldApartRule: 'Do NOT read or reason about which test points will be drawn …',
  // prompt builders for the four other agents (return strings):
  measurePrompt: (round) => '…',                 // Eos — sync frontier, meter levers
  huntPrompt:   (proposal, i) => '…',            // ⿻ Gap — reseed witnesses, screen candidates
  assayPrompt:  (proposal, hunt, i) => '…',      // ⚔️ Swordsman — cliff-watcher + full held-out gate
  criticPrompt: (validated, all) => '…',         // Poros — structural / probe-limited / noise
  // JSON Schemas forcing structured agent output:
  schemas: { proposal, hunt, verdict, critic },
  // optional:
  stop: { dryRounds: 2, maxRounds: 12 },
  isValidated:  (v) => v.validated && v.verdict === 'validated' && v.beatsFrontier,
  isStructural: (c) => c.classification === 'structural',
};
```

## The complement pair (when the objective is a product)

If your objective is a product of factors (e.g. `cost × size`, `Toffoli × qubits`), split the Mage
into **Factor-A-Minimiser ⊥ Factor-B-Minimiser** finders (opposed by construction — cutting one can
raise the other), and let the Swordsman's `assayPrompt` run a **cliff-watcher** that scores
`Δ(product)` and rejects any move that wins one factor at the other's expense. One finder optimises
gates; its complement optimises size; the prover defends the product.

## Recommended schema fields

- **proposal**: `lever, value, rationale, expected{FactorDeltas}, isStructural, smallestFix`
- **hunt**: `candidates[], measured{factors}, note`
- **verdict**: `validated:bool, verdict:'validated'|'mirage'|'error', score:number, beatsFrontier:bool`
- **critic**: `classification:'structural'|'probe-limited'|'noise', continue:bool, nextLead`

See `../../shor-mage/harness.config.mjs` for a full worked config, and
`../harnesses/_TEMPLATE/` for a blank to copy.
