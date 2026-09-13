# RERUN — how to run the next evocation round

*Written 2026-09-12 at the pause. Read this, then the board (`README.md`), then
the evocation's `frontier.json`. Numbers below are cited from those files.*

## Where the three evocations stand

| evocation | baseline → best | census N | open target | attempts |
|---|---|---|---|---|
| `primer` | 1,998 → **1,573** | 64 | OT-2: below 1,573; the line-editor's cuts compose on top of the fold; no witness for form (table vs list) | r1 folded |
| `whitepaper` | 13,681 | 162 | OT-1: the first fold | none |
| `personas` | 53,254 | 206 | OT-1: the first fold | none |

Every one conforms and its canary passes. `node tools/check.mjs` at the root
gates all three (20 gates at the last count, before the other lane's
uncommitted work; run it and read the number it prints).

## The seating that has folded, twice

Both folds so far (the harness's own README, then the primer) used the same
pair: **Claude proposing, a local 27B proving.** A 12B proposer dropped 13 and
44 witnesses on the same task; Claude dropped none. The prover's job under a
census gate is the hard-constraint call — the census is code — and gemma3:27b
on CPU is sufficient for that and slow (10–25 minutes a round).

## The rerun, step by step

1. **Confirm the state.** Nothing may have moved, or the corpus copy may have.
   ```bash
   cd ~/dual-agent-harness
   node tools/check.mjs                                   # every gate; note the count
   node engine/conform.mjs evocations/<name>
   node evocations/<name>/tools/measure.mjs               # words · census · pass — must be pass:true
   ollama list && ollama ps                               # gemma3:27b on the box; nothing loaded is normal
   ```
   If `measure` reports `pass:false`, the artefact and the census disagree: the
   corpus copy was updated or someone edited `artifact/` by hand. Re-draw
   (`node evocations/_lib/census.mjs evocations/<name>/artifact/*.md`), prune,
   refreeze, re-measure, rewrite `frontier.json` baseline. Do not run a round
   against a failing canary.

2. **Choose the driver.** Three ways, in order of least to most setup.

   **a. `multi` (added by the other lane; simplest once its work is committed):**
   ```bash
   node drivers/run.mjs --instance evocations/<name> --driver multi \
     --propose-model anthropic:claude-opus-5 --assay-model ollama:gemma3:27b --run r<N> --max-rounds 1
   ```
   Needs `ANTHROPIC_API_KEY` in the environment (the box does not have one set;
   `ant auth status` is the credential check). The proposer runs live on the
   API; the census still runs code-side.

   **b. `--proposals` hand-off (what folded the primer; no API key needed):**
   spawn two Claude Code subagents, one per lens (`line-editor`,
   `restructurer`; for `personas` the lenses are `scaffold-collapser` and
   `line-editor`), each reading only `GROUND_RULES.md`, the evocation's
   `artifact/`, `frontier.json` and `notes/KILLED_LEVERS.md`, each told which
   categories of string to keep (numbers, headings, bold phrases, named terms,
   the formal expressions for the whitepaper; the `# name`, the four invariant
   lines and every `##` heading for personas) — never the census itself. Each
   returns `{"proposals":[{leverId (a slug, never a number), title, lens,
   rationale, expectedMetric, hardConstraintNote, diffPlan, compressedText}]}`.
   Write both to `evocations/<name>/runs/r<N>/proposals.handed.json` keyed by
   lens (use the Write tool for the candidate texts — a Bash heredoc over
   ~10 KB fails to parse), pre-check each with
   `node evocations/<name>/tools/check.mjs <candidate.md>`, then:
   ```bash
   node drivers/run.mjs --instance evocations/<name> --driver ollama --assay-model gemma3:27b \
     --proposals evocations/<name>/runs/r<N>/proposals.handed.json \
     --propose-model "claude-opus-5 (Claude Code subagents, one per lens)" --run r<N> --max-rounds 1
   ```
   The engine derives every seed after the proposals are committed, so the
   hand-off is as grind-proof as a live seat. Angle brackets in a transcript
   come back HTML-escaped; unescape before writing the candidate.

   **c. Local only (no Claude):** `--driver ollama --propose-model gemma3:12b
   --assay-model gemma3:27b`. Expect mirages on a long artefact; that is a
   valid result and the fold benchmark's first row.

   For the **whitepaper** the artefact is 13,681 words: a proposer must read
   and rewrite the whole thing, so a subagent needs room; split the lenses
   across two subagents as above and do not ask one for both. For
   **personas** the artefact is 53,254 words; a single whole-document rewrite
   is too large for one proposal — the next step there is a config change
   (propose per persona, gate per persona, fold the concatenation), not a
   bigger prompt. That is OT-1's real content for `personas`.

3. **Wait honestly.** Run it in the background and wait on the run's own
   file: `until grep -q '"status": "' <run output>; do sleep 5; done`. The
   engine marks a round INCOMPLETE if a seat dies of transport and refuses to
   count anything from it, even a VALIDATED verdict. If that happens the
   attempt is evidence, not a run: move it to
   `evocations/<name>/chronicles/evidence/r<N>-incomplete/` (not under
   `runs/`, or `verify_run --all` will read it as a round) and re-run. The
   Ollama driver retries transport failures four times with backoff; a
   `fetch failed` that survives that is a server problem, not a seat.

4. **Verify, then judge what the census cannot.**
   ```bash
   node tools/verify_run.mjs evocations/<name> r<N>            # RUN VERIFIED, or nothing counts
   node evocations/<name>/tools/check.mjs evocations/<name>/runs/r<N>/r<N>.1/p<i>-<lever>/candidate.md
   ```
   Then the keystone's own read, which is the part no script does: does the
   candidate still read as the thing it was? For the primer that meant
   confirming all 27 appendix rows and the substance of all 60 bullets
   survived a table-to-list change. The prover's evidence text from a local
   27B is thin ("adheres to the structure"); do not lean on it.

5. **Fold as keystone**, only on VALIDATED + verified + your own read:
   copy `candidate.md` over `artifact/<ARTEFACT>.md`; re-run `measure`;
   write `frontier.json` (best, a history row with coverage census N/N
   detection 1.0, an `attempts` row with the model pair and both candidates,
   close the target, open the next); file kills in `notes/KILLED_LEVERS.md`
   with a re-open condition; write `chronicles/<date>_r<N>_<slug>.md`
   verdict-first; `node tools/render_run.mjs evocations/<name> r<N>`;
   `node engine/conform.mjs evocations/<name>`; `node tools/check.mjs`.
   Update the board row in `README.md`.

6. **Record it in soul_mage** (the fleet's census-traced record), so the lab's
   page shows the round: add a `round` record to
   `~/soul_mage/corpora/harness/round_self.json` with one claim per number,
   each quoting `run.json`, a `verdict.json` or the chronicle; bump `gate.N`
   in `harness.config.mjs` and `gate.claims` + the harness corpus counts in
   `frontier.json`; then `node tools/census.mjs`, `build.mjs`,
   `render.mjs --write`, `gate.mjs` (must print GO); then
   `node tools/verify.mjs` in `~/agentprivacy_labs`.

## Doors that stay the keeper's

- **Carrying a fold into the corpus.** The evocation's `artifact/` is a
  working copy. The primer's 1,573-word fold has NOT been written to
  `agentprivacy-docs/what-agentprivacy-is.md`; `frontier.json` says
  `corpusFoldBack: PENDING`. Diff the artefact against the corpus file and
  decide.
- **Commits and pushes** of the harness, soul_mage (0 commits so far), the
  labs pages and the City skill file.
- **The other lane's uncommitted work** in this repository (newcomer-path
  review: `ENTRY.md`, `drivers/openai.mjs`, the `multi` driver, twelve
  modified files). Do not stage it from an evocation session; commit
  evocation files by path.

## Open findings to carry

- The census has no witness for **form**: a table that becomes an inline list
  passes. If tables are to be kept, add a form witness (e.g. the literal
  `| Platform | Purpose | URL |` header rows) to the census before the next
  primer round.
- `personas` has 129 invariant lines for 42 personas, not 168: some persona
  frontmatters lack one of alignment · equation_term · proverb · spell. A
  finding for `agentprivacy-skills`, not something to invent in the artefact.
- The local prover explains little. For an evocation whose hard constraint
  needs judgment (the whitepaper's worked examples "still teach what they
  taught"), consider a stronger prover or a second prover pass; record the
  pair in `run.json` either way.
