---
date: 2026-09-12
seat: keystone
runId: self-r2
verdict: The harness folded its own README for the first time — 1,115 → 1,069 words at a 95/95 census, Claude proposing through a hand-off, a local 27B proving — and the ruling that this repository is the public one put the folded newcomer path at the top of the origin README, with the workshop below it. The universe map now records the new tree and a record layer. The record instance was renamed soul_mage.
---

# 2026-09-12 — the first self-fold

## Verdict

- `examples/self` r2: **VALIDATED 2 · MIRAGE 0 · BLOCKED 0**, both structural,
  seeds verified; the restructurer's 1,069-word candidate folded into
  `artifact/PATH.md` and `templates/README.default.md`. Frontier 1,115 → 1,069.
  Proposer: Claude Code subagents, one per lens, handed in through
  `drivers/run.mjs --proposals`; prover gemma3:27b; Φ_inference 1.
- The first attempt at r2 died of transport (Ollama `fetch failed` twice) and
  the engine refused it whole, including a VALIDATED verdict it had already
  received (GR-5). The Ollama driver gained transport retries; the retry
  stood. The refused attempt is kept as evidence outside `runs/`.
- **Ruling:** this repository is the public one; no separate default repo.
  The origin README now opens with the folded newcomer path (five commands,
  the ladder, the constitution, whose problem it is, pathways) and the
  workshop follows a divider.
- `universe/`: a **record** layer beside **harness** in the layer table and
  the machine map; a "tree as of 2026-09-12" table with every path resolving;
  the ruling and the self-fold as open items; the map re-measured (8,587 →
  8,997 words). `node universe/audit.mjs`: AUDIT PASS.
- The record instance beside this repository is now `soul_mage` (was
  oracle_mage); its gate is GO and the lab's harness pages render from it.
- Origin: **ALL 14 GATES PASS**. Default: 11 (+1 skipped).

## What happened

1. Round one on local models (12B ⊥ 27B) had caught two mirages. For round
   two the keeper asked that Claude take a seat. Two subagents were briefed
   with the artefact, the frontier and the kill ledger and told what K-1 and
   K-2 had lost; each returned one lever. `drivers/run.mjs` learned
   `--proposals <file>`: the proposals are committed before any seed derives,
   so the hand-off is as grind-proof as a live seat, and the model pair is
   recorded.
2. Both candidates carried all 95 witnesses on the code-side census before
   the round ran (1,092 and 1,069 words). The prover's job was the hard
   constraint; it validated both. The keystone re-ran `check_path.mjs` on the
   winner and folded it.
3. The universe map was brought up to the tree, and the keeper ruled that
   this repository stays the public one, which changed what the top of the
   origin README has to be.

## Reversals

- The refused r2 attempt lived under `runs/r2-incomplete/` for an hour and
  broke `verify_run --all` (a dead seat has no verdict file). Moved to
  `examples/self/chronicles/evidence/`; the verifier reads runs, and a refused
  round is not one.
- The soul_mage census caught four claims that quoted README sentences the
  restructure had rewritten; retraced to the new wording. The gate did its job
  on the page that describes the gate.
- `oracle_mage` could not be moved (a handle held the directory); `soul_mage`
  is a copy with a fresh git, and the old directory is stale until deleted.

## Ledger entries returned

- `examples/self/frontier.json`: best 1,069; OT-1 closed; OT-2 open (the
  line-editor's 23 words compose with the fold).
- `examples/self/chronicles/2026-09-12_r2_the-first-fold.md`.
- `drivers/ollama.mjs`: transport retry (four tries, backing off) — a dropped
  connection is not a model answer.
- `drivers/run.mjs`: `--proposals`, `--propose-model` as the record of who
  proposed.
- `universe/README.md`, `universe/universe.json`, `universe/frontier.json`.

## Handoff

- **Door:** push (asked for).
- **nextLead (self):** OT-2 — apply the line-editor's cuts on top of the
  fold, then a structural lever on the two witness-dense blocks nobody has
  touched.
- **nextLead (fleet):** the first two rows of the fold benchmark now exist
  (12B ⊥ 27B: two mirages; Claude ⊥ 27B: two folds). `tools/foldbench.mjs`
  in soul_mage is the tool to write.
