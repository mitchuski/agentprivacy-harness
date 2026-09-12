# The newcomer path, walked by a stranger — maintenance

Verdict: the "use my research repository" route in ENTRY.md works end to end
offline once the config is filled, and its four claims held under test —
destination handling, saved prover selection, salted verification, and console
discovery that never imports a config. Eleven defects and confusing steps were
reproduced against a synthetic fixture and a loopback fake endpoint; this patch
closes them. No frontier moved; no provider was called; nothing was published.

## What was reproduced (main @ 4c8ed41)

1. `drivers/run.mjs --driver stub` ran the blank TODO scaffold to COMPLETE,
   exit 0, with `gate.N: 0` and an empty draw. Only conform and bundle refused.
2. `verify_run --all` called an honest INCOMPLETE run (an outage, no proposal
   committed) UNVERIFIABLE, and through `check.mjs` would redden the gate.
3. A gap.json re-salted consistently, and a verdict forged to VALIDATED 5/5
   with a coverage stanza, both passed `verify_run`: the verifier proves the
   record's internal consistency, not the secret's secrecy nor executed evidence.
4. A re-scaffold silently dropped a new `--prover` and `--source`.
5. The scaffold's printed next step was a Workflow bundle run without a
   `saltSecret` — legacy unsalted — and never mentioned the stub path.
6. `--assay-model` alone on the ollama driver printed a message naming the flag
   that had been supplied.
7. `adventure.mjs` counted `templates/` as "1 instance(s) nearby".
8. Scaffolding inside the checkout turned `check.mjs` red with no warning.
9. A missing ANTHROPIC_API_KEY surfaced as a raw stack trace.
10. Every model call carries frontier.json and the adapter's JSON lands in
    run.json; neither was documented as a disclosure surface.
11. Mixed path separators on Windows; ENTRY.md absent from the console allowlist.

## What changed

- `engine/dual_agent_loop.mjs` — `validateConfig` refuses TODO placeholders and
  a non-positive `gate.N` (or a bad `gate.mode`), so the runner and any Workflow
  bundle refuse what conform and bundle already refused.
- `drivers/run.mjs` — checks the seat contract before building a driver or
  running the measurement adapter; clean `run:` errors instead of stack traces;
  accurate model-missing messages; truncated `measured:` echo; forward-slash
  printed commands. New `--driver multi` with `provider:model` per seat
  (anthropic · ollama · openai · stub) and `--driver openai`; `split` is the
  anthropic/ollama special case of it. run.json records `provider:model`.
- `drivers/openai.mjs` — new OpenAI-compatible driver (Chat Completions;
  OPENAI_BASE_URL / OPENAI_API_KEY; json_schema with json_object fallback).
- `tools/verify_run.mjs` — an INCOMPLETE run is reported INCOMPLETE, exit 0,
  and counted apart in `--all`; the pass line now says what a pass does not
  establish (C6).
- `tools/new_instance.mjs` — prints what a flag did not do on a re-run, warns
  when the instance sits inside the checkout, and prints ENTRY.md's order
  (conform → stub → verify), with `saltSecret` named for the Workflow path.
- `tools/adventure.mjs`, `tools/console.mjs`, `templates/harness.config.mjs`,
  `ENTRY.md`, `README.md` — the skip set, the allowlist, `sourceFile` and
  `tools/measure.mjs` documented, the disclosure surface and the verifier's
  limits stated, the drivers listed.
- `tools/entry.test.mjs` — regressions for the runner refusal, INCOMPLETE runs,
  re-run notes, and multi-provider routing through the loopback fake.

## Second pass — the instructions and the pages, read as a stranger

- `ADOPTION.md` Part I §3 and Part II steps 2, 4 and 5 still described the
  unsalted Gap (`sha256sum proposal_canon.json = seedHex`), an 8-of-40 sample
  where the spar is now a 32/32 census, and a bundle-first run audited by
  `render_run`. Rewritten to the salted seed, the census, `drivers/run.mjs`
  and `verify_run.mjs`; bundle named as the Workflow-only path. The same
  bundle-first sentence in `SKILL.md` step 4, `SEAT_CONTRACT.md` and
  `WORKFLOW.md` step 5–6 corrected.
- `tools/console.html`: the gate buttons swallowed the 403 a console started
  without `--execute-gates` returns (the check button printed `$ undefined`);
  both now show the error and the restart flag.
- `tools/workshop.html` (the frontier page): folds were counted as
  `history.length − 1`, so a re-baseline counted as a fold (examples/self
  showed 2, it has 1); now a fold is a step down. The page opened on the first
  instance alphabetically — a flat line on a fresh clone; it now opens on the
  frontier with the most audited folds unless `?instance=` asks otherwise.
- Observed, not changed: `templates/README.default.md` (1,079 words) has
  moved ahead of `examples/self/artifact/PATH.md` (1,069) since the ENTRY.md
  line was added, and lists neither `openai.mjs` nor `multi`; the next self
  fold-back needs a re-baseline first. A concurrent session added
  `drivers/serv.mjs` and its README text during this pass; not reviewed here.

## Handoff

- Open: GitHub's default branch is `master`, three commits behind `main` and
  without ENTRY.md; a newcomer following the repository link does not land on
  the arrival contract. Changing the default branch or merging is the door.
- Open: C6 (read-log in-mount, model-pair) remains the only way to establish
  the secret's secrecy and executed evidence; the verifier now says so.
- Blocked: none. Commit and push are the First Person's.
