```markdown
---
date: 2026-09-13
seat: chronicle
runId: mn-sonnet-5-serv.1
verdict: MIRAGE — both proposed levers failed the held-out census gate; best remains unchanged
---

# Chronicle — mn-sonnet-5-serv.1

## Verdict

**MIRAGE.** Two levers were proposed this round; both produced lower word
counts than the frontier best but both failed the held-out census gate
(`tools/check_naming.mjs`), and per GR-3/T5 a gate failure collapses the
result to zero regardless of metric. No lever validated this round. Frontier
`best.metric` remains **1114** (frontier.json), gate N=62, OT-1 still OPEN.

## What happened, phase by phase

**Measure phase.** Baseline metric confirmed at 1114 words (frontier.json).
Lever costs were estimated ahead of proposal: `line-editor` rated low cost
with a ceiling of roughly 20–60 words (sentence-level trims, before witness
density forces a stop); `restructurer` rated higher cost with a ceiling of
roughly 100–200 words (scene/paragraph reordering, requiring full re-census
after any restructure).

**Proposal/validation phase.**
- `tighten-ceremony-prose` (line-editor lens): metric 1047, gate 56/62.
  Six required witnesses were absent from the candidate text: *Reception is
  bilateral*, *Registration is transactional*, *The seat did not make the
  relation*, *You will inscribe*, *You will be received*, *The name will be
  given by the relation*. MIRAGE.
- `merge-ceremony-prose-list-the-three-moves` (restructurer lens): metric
  1048, gate 54/62. Eight required witnesses were absent, including the
  confirmation triads *Claim. Inscribe. Confirm.* / *register. Assert.
  Verify.*, plus the same bilateral/transactional witnesses lost above.
  MIRAGE.

Both candidates carried the hard-constraint narrative elements (V63 arrival,
the three bilateral vs transactional moves, flaxscrip's Bitcoin block
945508, closing line, cast, proverb/lineage) in some form, but that reading
is moot: the mechanical census gate fails outright before any hard-constraint
or word-count judgment applies (T5 cliff-watch — a gate fail is a zero, not
a worse result).

**Critic phase.** Both levers were classified **structural**, not
probe-limited: line-editing that treats connective prose as fungible will
always risk cutting witness-bearing sentences, and restructuring/merging
necessarily paraphrases — fatal to a verbatim-witness census. Neither would
survive a re-run on a different witness draw with the same lens. Both are
recommended for permanent kill filing.

## Reversals (same prominence as wins)

This round's apparent "progress" — two candidates beating 1114 words
(1047, 1048) — **is itself the reversal being recorded**: both wins are
void. Lower word count achieved by deleting verbatim witness text is not a
result at any score (GR-3, T5). No numeric improvement is admissible; the
frontier best stays at 1114.

## Ledger entries returned to keystone

Two entries for `notes/KILLED_LEVERS.md` (keystone to serialise, GR-10):

- **K-tighten-ceremony-prose** — line-editor lens, killed by census MIRAGE
  (56/62); six verbatim witnesses removed (see list above); evidence:
  `tools/check_naming.mjs` run against candidate at
  `runs/mn-sonnet-5-serv/mn-sonnet-5-serv.1/p1-tighten-ceremony-prose`.
  Structural: lens has no witness-awareness.
- **K-merge-ceremony-prose-list-the-three-moves** — restructurer lens,
  killed by census MIRAGE (54/62); eight verbatim witnesses removed
  (including both confirmation triads); evidence:
  `tools/check_naming.mjs` run against candidate at
  `runs/mn-sonnet-5-serv/mn-sonnet-5-serv.1/p2-merge-ceremony-prose-list-the-three-moves`.
  Structural: merging/restructuring paraphrases, fatal to a verbatim census.

No `frontier.json` change proposed — `best`, `history`, and `openTarget`
(OT-1, OPEN) are unaffected by this round.

## Handoff

**Open questions:** Can any compression strategy reduce word count below
1114 while treating all 62 census witnesses as immovable, unparaphrased
anchors?

**Blocked items:** No validated lever this round; both candidate levers are
void (MIRAGE) and slated for kill-list filing. OT-1 remains unmet.

**Single next action (critic's nextLead):** Try a lever that first extracts
the exact 62 witness strings from `census.json` and treats them as immovable
anchors, compressing only the prose strictly between/around them — no
merging, no paraphrase touching an anchor's sentence — and prove
witness-safety via `tools/check_naming.mjs` before word count is even
measured.
```

---

**Five-line verdict summary (data):**

1. Verdict: MIRAGE — no lever validated this round; frontier best stays at 1114 (frontier.json).
2. `tighten-ceremony-prose`: metric 1047, gate 56/62 — six witnesses missing — MIRAGE.
3. `merge-ceremony-prose-list-the-three-moves`: metric 1048, gate 54/62 — eight witnesses missing — MIRAGE.
4. Both classed structural (critic) — killed lever drafts returned for `notes/KILLED_LEVERS.md`, no frontier.json edit proposed.
5. Next action: witness-anchored compression lens — extract the 62 `census.json` strings as immovable anchors, compress only surrounding prose, verify witness-safety before measuring.
