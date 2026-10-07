---
date: YYYY-MM-DD
seat: <seat id>
runId: <run id>
verdict: <one line — the outcome, first>
---

# <date> — <slug>

## Verdict

The outcome, stated before anything else. What was validated, what died,
what moved on the frontier (cited from frontier.json only).

## What happened

The round in order: measure → proposals → gap seeds → assay → critic.

## Reversals

Anything that un-happened, with the same prominence as the wins. "Nothing
reversed" is a valid entry; silence is not.

## Ledger entries returned

Proposed claims_register / KILLED_LEVERS entries for the keystone to
serialise (GR-10).

## Evidence root

`Evidence root: sha256:<root κ>` — from `node tools/kappa_evidence.mjs root
runs/<runId>/evidence` after `mint`. One line, copied, never retyped. A reader
holding the bundle re-derives every verdict, gap seed and tally in this
chronicle from that root alone (`verify`). Until the registry cross-check
(P1) passes, the line carries its label: "kappa-compatible (unverified)".
Omit the section only when no bundle was minted, and say so.

## Handoff

- **Open questions:**
- **Blocked items:**
- **Single next action:** (the critic's nextLead)
