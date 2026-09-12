# Claims register

Every load-bearing claim gets a CR-id and a tier (GR-2). Prose elsewhere may
assert nothing that does not resolve to a CR-id here. Keystone-only writes;
other seats return proposed entries.

Tiers (epistemic strength): **PROVEN** (executed here, re-runnable) ·
**DERIVED** (follows from a PROVEN claim, derivation cited) · **REPORTED**
(external, slug-cited via SOURCES.md) · **OPEN** (must state what would settle
it) · **MYTH** (chronicles only).

**enforced by** (the second axis — the *mechanism*, not the strength; D4):
`code` (a gate re-runs it) · `protocol` (impossible-by-construction, e.g. a
hash commitment) · `runtime` (denied by the sandbox/mount) · `prompt` (a seat
card asks) · `manual` (honest human discipline) · `nothing` (unenforced).
`tools/check_claims.mjs` is a hard gate: **a PROVEN or DERIVED claim enforced
only by `prompt`, `manual`, or `nothing` is a failure** — it is a claim
stronger than its enforcement. Downgrade the tier or build the enforcement.
When enforcement is improving, write `now → later, post-Cx` and the checker
reads the *current* (pre-arrow) value.

| id | claim | tier | enforced by | evidence | status |
|---|---|---|---|---|---|
| CR-1 | Baseline metric is N by the counting rule in frontier.json | PROVEN | code | frontier.json baseline.how, run of YYYY-MM-DD | accepted |
