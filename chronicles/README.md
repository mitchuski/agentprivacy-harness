# chronicles — the repo's own record

One file per session, `YYYY-MM-DD_slug.md`, verdict first, reversals recorded
with the same prominence as progress, ending in a handoff block. A session
without a chronicle is unfinished (GR-7).

These are the **core repo's** chronicles — the engine, the gate, the tooling.
An *instance* keeps its own, next to its own frontier: see
`examples/field-guide/chronicles/` and `universe/chronicles/`.

A chronicle is not a changelog. The commit log says what changed; the chronicle
says what was *learned*, what was *reversed*, and what the next session must not
have to rediscover.

| date | chronicle | verdict |
|---|---|---|
| 2026-07-10 | [the harness audits itself](2026-07-10_the-harness-audits-itself.md) | Three rounds, nothing validated, six defects found — every one by running |
| 2026-07-13 | [the hardening](2026-07-13_the-hardening.md) | The review's four load-bearing defects closed in code, verified, and validated on a live salted-census spar (r5) — best 440, not folded |
| 2026-08-17 | [the fleet sync, and the Observe lane](2026-08-17_the-fleet-sync-and-the-observe-lane.md) | Sixteen entries folded (one withdrawn the next day); the Observe lane built (wiki wall + agent graph); the evening ruling — the harness emits data, never views |
| 2026-08-18 | [the practices cycle](2026-08-18_the-practices-cycle.md) | The 2024–26 field surveyed with 37 receipts: it converged on the fence, not the Gap; AGENTS.md adopted as the tool-neutral boot file |

## The instances' chronicles

| where | what it records |
|---|---|
| `universe/chronicles/2026-07-10_u1_incomplete.md` | an outage reported as an exhausted search |
| `universe/chronicles/2026-07-10_u2_mis-gated.md` | a gate no candidate could pass, and a critic with no word for it |
| `universe/chronicles/2026-07-10_u3_retirement.md` | the harness that should have been an auditor |
