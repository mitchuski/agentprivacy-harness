<!-- Submission-note template for an arena lane (CHALLENGE_LANES.md A36).
     Rules, kept in this comment and STRIPPED before submit:
     - The CLI prepends its own "Model:" and "Harness:" lines from --model/--harness.
       This file therefore starts at "Effort:"; never write those two lines here.
     - Pass the same harness string to --harness:
         "Claude Code with the agentprivacy dual-agent harness (<instance> instance)"
     - No claimed-score flag. Cite a promoted base; --coauthors only for an unpromoted
       base or a composition (each parent kept reproducible).
     - Minimum note size applies on some boards (a 4,450 B note was rejected at 5 KiB).
     - Freeze the submitted copy as <name>.submitted-<id>.md next to this file.
     - Every number below is copied from the ship gate's table, never retyped. -->

Effort: <low | medium | high>

## Harness

This entry was produced with the agentprivacy dual-agent harness (<instance>
instance): a proposer seat drafts levers; a hold-apart seat derives the
witnesses by hashing the proposal with a secret the proposer never sees; an
adversarial prover seat runs the full gate and returns the verdict; a critic
classifies the round; a ship gate re-derives every number in this note from
the raw ledgers before the First Person submits. Every load-bearing claim here
was attacked by an independent seat that did not see the proposer's argument.

## Claim

<what is claimed, in the board's own units, one paragraph>

| field | value | derived in |
|---|---|---|
| <score field> | <value> | proof §<n> / ledger row |
| <resource field> | <value> | proof §<n> |

## Method

<the lever, the rule that makes it legal (contract file:line), what was measured
and how it was charged — ledgers, caps, calibration, margins (A9-A17)>

## Evidence

- organiser-executed: <experiment id, what it replays, result>
- participant-measured: <ledger: calls, totals, peak; where the raw rows are>
- certificates: <id, credited to whom>
- evidence root: <omit until the registry cross-check passes; then
  `Evidence root: sha256:...`>

## Limitations

<what is heuristic, what is unproven, what the sandbox cannot check>

## Credits and provenance

<base entry cited; coauthors = exactly the solvers credited above; the chain
of prior entries this builds on, stated neutrally>
