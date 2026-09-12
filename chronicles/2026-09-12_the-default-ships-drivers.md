---
date: 2026-09-12
seat: keystone
runId: share-ready
verdict: The default distribution now runs a round out of the box — three drivers and a runner landed, two examples joined the spar (the auditor for your own documents, and the harness on its own README), the newcomer path was rewritten to be precise on actions and cut the default's root documents from 16,728 words in 18 files to 12,883 in 14, the origin's ecosystem documents moved behind optional/, the boot file says whose problem an instance is, PATHWAYS.md names the origin's work and how to bring a fold back — and the harness's first run on itself caught two mirages and one defect.
---

# 2026-09-12 — the default ships drivers

## Verdict

- Origin: `node tools/check.mjs` **ALL 14 GATES PASS** (three instances now:
  field-guide, corpus, self; their runs verify).
- Default: `node tools/make_default.mjs` emits and re-proves **11 gates (+1
  skipped)** with `drivers/`, three examples and `optional/` inside.
- `examples/self` r1 on local models (gemma3:12b ⊥ gemma3:27b, Φ_inference
  1): two proposals, **two MIRAGE**, no fold; seeds verified. The census
  caught 13 and 44 dropped witnesses respectively. Frontier stays 1,088.
- **Defect #14** found by that run and fixed: the runner matched verdicts by
  lever id; two proposals with the same id misfiled the second verdict.
  Positional matching when ids collide; mismatches recorded on the verdict.
- **Defect #15** found by re-baselining after that run and fixed:
  `tools/verify_run.mjs` replayed a census draw against the live config's
  `gate.N` rather than the `N` recorded in `gap.json`, so a census that grew
  by two witnesses made a verified round report UNVERIFIABLE. A run is
  verified against the bank it was drawn from; the verifier now prefers the
  recorded `N`.

## What happened

The keeper asked for the repository to be brought to a standard to share:
experiments outside the origin's knowledge base, the agentprivacy tooling
adoptable progressively rather than all at once, no files from the origin's
runtimes that would confuse a fresh AI working on someone else's problem, a
README precise on actions, and then a run of the harness on itself.

1. **Drivers.** `drivers/stub.mjs` (deterministic; MIRAGE by design),
   `drivers/ollama.mjs` (local; 16k context by default — Ollama's 4k default
   truncates a propose prompt that carries a whole artefact and a rewrite),
   `drivers/anthropic.mjs` (the Messages API over plain fetch, structured
   output, refusal fallbacks on by default, still zero dependencies), and
   `drivers/run.mjs` (any instance, any driver, `--propose-model` /
   `--assay-model`, `split` = API proposer with a local prover; persists
   proposal bytes, seed, candidate, verdict, chronicle draft and a run summary
   with the model pair). Stub rounds on the spar and on `examples/self`
   verified offline.
2. **Examples.** `examples/corpus`: the adopter's front door — three sample
   documents, records with quotes, a zero-dependency census; metric = weak
   traces, one by design. `examples/self`: the harness on its own README —
   census of 93 witnesses (now 95), canary passing at 1,088 words.
3. **The newcomer path.** `templates/README.default.md` rewritten: five
   commands with what each writes, the loop table, the adoption ladder
   (auditor → spar → your instance → a second model → the arena → optional
   layers), the constitution in one line each, the box, whose problem it is.
4. **The seam.** `make_default.mjs` copies drivers and the two examples
   (without runs, chronicles, artefacts), moves SPECIALISATION, GRAPH, HOLONS
   and WIKI behind `optional/` with a README, repoints SKILL, ADOPTION,
   SEAT_CONTRACT and WORKFLOW, writes `PATHWAYS.md` and a fuller
   `DEFAULT.md`. Identity markers in the default's root documents and drivers:
   23, all example names in method prose; 35 more in `optional/`.
5. **The name.** README, AGENTS.md and SKILL.md say *the agentprivacy
   dual-agent harness, tooling for your own agentic research*; AGENTS.md
   gained "Whose problem this is".
6. **The README's stale sentence.** "eleven defects" → the chronicles are the
   count (thirteen then; fifteen now).

## Reversals

- The first attempt at the self-fold run was stopped and restarted: the
  Ollama driver used the server's default 4,096-token context, which would
  have truncated the proposer's view of the artefact. `numCtx` is now 16,384.
- Defect #14 (above). The r1 verdict files stand as the old runner wrote
  them; the chronicle and `tools/check_path.mjs` carry the true per-candidate
  counts.
- The proposer answered `leverId: "1"` twice; the self config now asks for a
  descriptive slug.

## Ledger entries returned

- `examples/self/notes/KILLED_LEVERS.md` K-1, K-2, K-3.
- `examples/self/chronicles/2026-09-12_r1_two-mirages.md`.
- README: defect count sentence; drivers sentence; the default is the thing
  to share.

## Handoff

- **Door:** commit and push this working tree's changes from this lane (the
  keeper asked); the other lane's uncommitted edits to `HARNESS_PATHS.md`,
  `tools/workshop.html` and its 2026-09-11 chronicle are not touched here.
- **Door:** whether the public repository people clone becomes the default
  distribution (`dist/` is ignored today), with the origin as the workshop.
- **nextLead:** re-run `examples/self` with the line-editor prompt naming the
  census categories to keep verbatim, and with a stronger proposer through
  `--driver split`; the first fold of the README by the harness is one
  prompt away.
