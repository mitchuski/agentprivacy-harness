# examples/zk-tale-5 — The Constraint Forge

A second self-style instance: compress a Zero Knowledge Spellbook tale (Tale 5,
*The Constraint Forge*, the R1CS tale) without losing what it teaches. Same
mechanism as `examples/self` — the gate is code (`tools/check_forge.mjs`, an
85-string census) plus a model-judged hard constraint, so a text-only prover
(a local model or an inference API) can run it honestly.

- Artefact: `artifact/FORGE.md` (1056 words, census 85/85 by construction).
- Objective: fewer words; a dropped witness is a MIRAGE.
- Run: `node drivers/run.mjs --instance examples/zk-tale-5 --driver stub --run smoke`.
