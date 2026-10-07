<!-- door instance: review_mage (instance kept outside this tree, no git); copied 2026-10-07 for the guide sync -->
# The walk under a census — review_mage, 2026-09-21

**Verdict first.** The one-command entry path was walked end to end for the
purpose "review what this is, starting with how it can help a cryptocurrency
or AI business". Baseline measured: 50 claims, 35 claimed-only, 15 observed
(`frontier.json`). Census PASS (untraced 0, unquoted 0). CONFORM PASS. Stub
smoke round ran (2 proposals, both MIRAGE by construction, Φ_inference 0 —
the stub sits in both seats) and RUN VERIFIED offline. No model round. No
door opened.

## What happened, in order

1. `agentprivacy.org/skill.md` fetched twice: curl (200, text/markdown, 9,017
   bytes, Cloudflare cache hit) and the Claude fetcher (200, five-doors line
   intact). The 2026-09-12 wall (403 to Claude-class fetchers) is gone for
   this page.
2. The five doors probed: model, guide, City skill and the harness guide serve
   markdown; the Star serves an HTML application; the harness cloned at head
   3497212. The ENTRY.md mirror is byte-identical to the clone (sha256).
3. `node tools/adventure.mjs` printed the five paths; `node tools/check.mjs`
   passed 19 gates in 8.0 s on Node 22 with no package.json and no
   node_modules.
4. Scaffolded with `--prover gemma3:12b` (Ollama has gemma3:12b and 27b
   locally; no API key in this shell). The scaffold refused to conform until
   the five answers were real, as it says it will.
5. Shaped on `examples/corpus` (ADOPTION.md step 0): the review's claims are
   enumerable, so the auditor is the tool. Twelve records, fifty claims, each
   quoting a fetched page or the fetch log; `tools/measure.mjs` counts claimed
   vs observed; `tools/census.mjs` is the gate.
6. `artifact/REVIEW.md` written: verdict, crypto fit, AI fit, observed-vs-
   claimed table, the doors that are the keeper's, what the walk did not do.

## Reversals and discrepancies, at the same prominence as wins

- The Labs harness page records **20** gates passing on 2026-09-12; this clone
  passes **19** (CR-5, open). A gate removed or merged since; not a failure.
- Fleet count: **fifteen** in the README and HARNESS_PATHS, **23** on the
  entry page (CR-6, open).
- Skills: the research page says **163 skills + 42 personas**; the live
  catalogue counts **202 packets = 148 skills + 42 personas + 10 patterns +
  2 plugins** (CR-6, open).
- The services page's three calls to action all route to `/begin/`; there is
  no form and no price list. That is the design, not a defect, but a business
  reader should know the door is a conversation.
- The City's wiki and portal hosts do not resolve, exactly as the City page
  labels them (planned). Observed agreement with a claim of non-deployment.
- The guide's harness page carries a typo, "sourcedoes" (run-on), in the
  sentence that states the Gap's distinguishing claim.
- Two stray files and one stray directory were written into the keeper's
  memory folder by a mis-set temp variable during the walk and removed in the
  same session; two odd pre-existing filenames there (`1{print`, `=`) were
  left alone — not this walk's.

## Ledger entries proposed

- CR-1..CR-7 in `claims_register.md` (CR-5, CR-6 open).
- SOURCES: baseline-run, walk-2026-09-21, pages, entry, harness.
- No killed levers: the stub proposes nothing real.

## Handoff

The instance lives in the session scratchpad and is copied to `~/review_mage`
(instance only; run it from any harness checkout with `--instance`). Next lead
(critic's seat, by hand since the stub cannot): **OT-1 — turn claimed lines
into observed**: re-run `check.mjs` at the 2026-09-12 commit to settle CR-5;
count the published library against 163 to settle CR-6. A real round (Claude
proposing via `--proposals`, gemma3:12b proving) is the keeper's spend.

## Fix pass, same day

Keeper asked for the seven findings to be fixed. Applied locally, nothing
committed: the command block (five identical copies) now says an empty blank
is the question and lists a sixth door, the lab; the Star door tells agents
where to read; every doors paragraph says the prover needs a second model;
the services page gained a human door beside the agent door; the research
page counts the live catalogue; the fleet count is reconciled in words;
soul_mage records the 19-gate run and re-rendered the Labs harness page;
ENTRY.md, the runner and the adventure carry the same three fixes. One
regression caused and caught: a backslash halved by the shell broke the
runner's new line in two checkouts; the entry-regressions gate found it, the
line was merged, and both checkouts pass again. soul_mage's own gate is
NO-GO on four claims that other lanes' files moved; not this pass's to fix.
