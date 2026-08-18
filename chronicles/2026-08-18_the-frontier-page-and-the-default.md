---
date: 2026-08-18
seat: keystone (soulbae 🧙 ⊥ soulbis ⚔️), at the First Person's direction
scope: after the push (810c271 + f240439, main and master) — make the frontier a detailed interactive page of its own on richer feed data; give every instance's graph its true story; emit a DEFAULT distribution carrying no results and no chronicles
verdict: The frontier is now a page, not a widget — fold-by-fold coverage badges, closed-target annotations, a pinned detail panel, a rounds table linking each run's audit view, and the model's own terms (R(t) as the moving ceiling, the multiplicative gate) linking to agentprivacy.ai/model — driven by an enriched runtime-feed.v1 (coverage, chronicles, per-run tallies, killed levers, closed targets) whose two thin instances stopped lying by omission: lexon's frontier gained its authoritative seven-point history (211 → 201 → 181 → 152 → 123 → 64 → 22) and pools its three (36,832 → 17,224 → 17,159), every point traced to its fold chronicle. And the default exists: `tools/make_default.mjs` emits the system alone — spar reset to baseline, chronicles empty on purpose, HARNESS_PATHS/RESEARCH/universe left upstream — and REFUSES to hand over a tree whose own gates are not green (9 pass, universe honestly skipped). One portability defect found by the default's own self-check: the console test hard-coded the origin's r3 run as its tamper target, so a clean clone could not run the drill — it now discovers a target or synthesizes a labelled fixture. ALL 11 GATES PASS at the origin. This block is uncommitted — the door is the First Person's.
commits: none this block (the morning's two commits are pushed; this work awaits the next order)
---

# The frontier page, and the default

**Verdict first.** A reviewer at `127.0.0.1:4242/frontier` now reads a
fold's whole record — value, delta, lever, date, coverage mode with its
detection probability, chronicle path, κ artefact — by clicking a dot, and
walks the descent with arrow keys; every number arrives through the feed
from `frontier.json` and the page adds none of its own. A stranger who
wants the system without the story runs one command and gets a
self-checked clean tree whose first chronicle is theirs.

## What was built

- **runtime-feed.v1 enriched (additive):** series points carry `coverage`
  (census/sample, n/N, detection), `chronicle`, `target`; the feed gains
  `objective` (gate + hard constraint strings), `closedTargets`, `runs`
  (per-run proposal counts and V/M/B tallies, audit-view presence),
  `killedLevers` (GR-6, counted with ids). Console gains a `/run` route —
  a GET-only read of the already-rendered `runs/<id>/run.html`, runId
  sanitised, nothing executed.
- **`tools/frontier.html` rewritten as a page:** header strip (metric,
  descent, R(t), open target, verdicts, killed levers, κ artefacts), the
  stepped ceiling with census rings and sample-dashed rings told apart, a
  detail panel that defaults to the open target and the contribute
  commands, the rounds table, and "the model's terms" — R(t) and the
  multiplicative-gate formula with the agentprivacy.ai/model link. Demo
  mode ships only the in-repo spar, badged.
- **The instances' true stories:** lexon_pvm and privacy_pools_v2 frontier
  files gained authoritative `history` arrays, each point citing the fold
  chronicle it came from; both conform green. Hearthold renders honestly
  as a one-point descent — a frontier waiting for its first round.
- **`tools/make_default.mjs` + `templates/README.default.md`:** the
  default distribution. Ships: engine (attacks included), seats, tools
  (minus the origin's front page and this generator), templates, the
  constitution and method docs, the spar at baseline 730 with OT-1
  reopened, empty chronicles with the discipline stated, a filtered
  claims register (the one result-dependent row dropped), and a
  `DEFAULT.md` naming everything deliberately absent and where it lives.
  Self-check runs `check.mjs` inside the emitted tree and refuses on red.
- **Defect #12, found by the default's own gate:** `console.test.mjs`
  assumed the origin's `runs/r3/...` existed. It now discovers any
  proposal on disk or synthesizes a two-proposal drill fixture (labelled
  a fixture, never a result), and the feed test accepts the fresh-instance
  one-point descent. The origin's tests still run against the real runs.

## Handoff

**Open**
- The master-site question (the First Person's, asked this session):
  hosting a series of frontier pages on agentprivacy_master — recommended
  yes, as the public consumer of committed feed snapshots; wiring is a
  follow-up arc.

**Blocked**
- Nothing. ALL 11 GATES at the origin; 9/9 (+1 honest skip) in the dist.

**Doors (the First Person's, named, not performed)**
- Commit/push this block (feed + frontier page + console route + test
  hardening + make_default + README lines + this chronicle).
- lexon_pvm and privacy_pools_v2_mage carry uncommitted frontier history
  additions in their own repos — their commits are theirs.
- Publishing an emitted default tree as its own repo/branch (the tool
  only writes `dist/`, which is gitignored).

**Single next action**
- Review `127.0.0.1:4242/frontier` across all four instances, then rule
  on where the default tree gets published.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
