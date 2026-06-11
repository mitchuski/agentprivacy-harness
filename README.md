# agentprivacy-dual-agent-harness

**The Swordsman ⚔️ ⊥ Mage 🧙 dual-agent harness framework and its instances, each package
fork-ready into its own git.** A proposer (Mage — reduces) and a prover (Swordsman — validates)
held apart by a **Gap** (a held-out gate the proposer cannot tune to). `neg ⊕ bnot → succ`.

> **Honest framing, carried into every harness:** a harness produces *validated* improvements
> to a stated objective; only the held-out gate makes a claim true.

## The packages here

| Package | What it is | Fork into |
|---|---|---|
| **`generic/`** | the foundation — the engine (`core/dual_agent_loop.mjs`), the seat contract, the persona/skill bindings, a blank `_TEMPLATE/`, the skill | a `dual-agent-harness` framework repo |
| **`shor-mage/`** | instance #1 — quantum resource estimation on ecdsa.fail (config + the self-contained Workflow bundle) | a `swordsman-mage-pqc` repo |

**Instances can also live with the project they serve.** The MyTerms instance (#2) was moved out
to **`myterms/harness/`** so the `myterms` project owns its own harness alongside its two
extensions (`myswordsman/` + `mymage/`). That is the general pattern: the *framework* lives here;
a *project* may vendor the engine and own its instance. Each package/instance is **self-contained**
— it vendors its own copy of `core/dual_agent_loop.mjs` (canonical source: `generic/core/`), so it
works the moment you `git init` it.

## Fork model

```
generic/            → git init → the framework (others write new harnesses against it)
shor-mage/          → git init → run the PQC harness (Workflow bundle or SDK)
../myterms/harness/ → versioned with the myterms project → run the MyTerms harness
```

Cross-package links in the docs (e.g. an instance README pointing at `../generic/`) are for the
monorepo view; on fork they become a reference to the **generic package** by name. Nothing
load-bearing crosses a package boundary at runtime — each carries its own engine.

## The algebra (shared by all three)

The agentprivacy V6 master inscription, proven on Z/64Z
(`agentprivacy-docs/privacy_value_v6_formal_specification.md`):

```
(⚔️ ⊥ ⿻ ⊥ 🧙) 😊  =  neg ⊕ bnot → succ            neg(bnot(x)) = succ(x)
```

⚔️ Swordsman = `neg` = prover · 🧙 Mage = `bnot` = proposer · ⿻ the Gap = the held-out gate
(`I(Y_S;Y_M|X)=0`) · → succ = the validated result, which emerges only from the two held apart.

## Where to start

- **Build a new harness:** copy `generic/harnesses/_TEMPLATE/`, read `generic/core/SEAT_CONTRACT.md`
  and `generic/bindings/personas-and-skills.md`.
- **Run myterms (mock):** `node myterms/run.mjs`.
- **Cross-ecosystem scope** (skills · docs · spellweb · star · master): `ECOSYSTEMS.md` and the
  spec `agentprivacy-docs/specs/DUAL_AGENT_HARNESS_SPEC_v1.md`.

License: Apache-2.0 (per package).
