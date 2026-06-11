# Harness template

Copy this directory to `harnesses/<your-purpose>/` and build a new Swordsman ⊥ Mage harness.

1. **State the purpose & objective** in `harness.config.mjs` (`name`, `purpose`). If the objective
   is a product of factors, plan a complement pair of finders.
2. **Define the Gap** — the held-out gate the proposer cannot tune to. This is the most important
   design choice; without a real Gap you have a mirage generator, not a harness. Write exactly how
   the witnesses derive from the proposal into `heldApartRule`.
3. **Assign personas + skills to the seats** — see `../../bindings/personas-and-skills.md`. Pick a
   Mage (proposer) persona + reduction skills, a Swordsman (prover) persona + `agentprivacy-horizon-gate`
   + domain skills, and reference them in the prompt builders ("load skill …").
4. **Fill the prompt builders** (`measure/hunt/assay/critic`) and the schemas.
5. **Run** the config through `../../core/dual_agent_loop.mjs` with your orchestrator's runtime
   adapter `{ agent, parallel, pipeline, phase, log }`. For the Workflow tool (no `import`), ship a
   self-contained bundle (engine + config inlined) — see `../ecdsafail-pqc/` and its bundle in
   `shor_mage/harness/swordsman_mage_pqc.mjs`.

**Hard rules (inherited):** a pre-screen result is a *candidate*; only the full held-out gate
validates. The proposer never tunes to the test set. Outward-facing submit/ship steps are
human-triggered. Nothing is "proven" until the gate says so.
