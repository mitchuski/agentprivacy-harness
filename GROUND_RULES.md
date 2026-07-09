# GROUND RULES

These bind every seat, every session. They are read at boot and are not
negotiable mid-run. They are the generic form of rules that survived three
working harnesses (quantum circuit estimation, ZK constraint reduction,
research-paper pipelines); each rule earned its place by an actual failure.

**GR-1 · frontier.json is the sole authority for numbers.** No metric, score,
count, or timing appears in prose except as a citation of `frontier.json`.
When a run moves a number, the keystone updates `frontier.json` first, prose
second.

**GR-2 · claim tiers.** Every load-bearing claim in `claims_register.md`
carries one tier:

- **PROVEN** — executed in this repo, output on record, re-runnable.
- **DERIVED** — follows mathematically from a PROVEN claim; derivation cited.
- **REPORTED** — from an external source; slug-cited via `SOURCES.md`.
- **OPEN** — conjecture under research; must state what would settle it.
- **MYTH** — narrative register; lives in chronicles only, never in method
  docs.

**GR-3 · the hard constraint is hard.** Every harness declares at least one
validity constraint that no score can override (`objective.hardConstraint` in
the config). A result that violates it is not a result at any score — not a
worse result, not a result.

**GR-4 · the Gap is held apart.** Verification witnesses derive from the
proposal artifact by hashing (Fiat-Shamir). The proposer never sees, chooses,
or influences them. A validation run on proposer-suggested witnesses is void.
A revised proposal is a new artifact — re-derive.

**GR-5 · honest labels.** Probe runs and full-gate runs are labelled as such.
A candidate is not a result; a prototype is not a product. Nothing wears the
costume of a submitted result before it has passed the door.

**GR-6 · negative results are filed.** A killed lever goes to
`notes/KILLED_LEVERS.md` with the same prominence as a win: what it was, why
it died, what evidence killed it. No seat re-proposes a K-id without new
evidence, cited.

**GR-7 · chronicle per session.** A session without a chronicle is
unfinished. One file per session, `chronicles/YYYY-MM-DD_slug.md`,
verdict-first, reversals recorded with the same prominence as progress,
handoff block at the end (open questions · blocked items · single next
action).

**GR-8 · the door is the First Person's alone.** Push, commit, submit, email,
publish — no seat performs, marks, simulates, or assumes these. The runtime
reports status; the First Person triggers. The proposer does not approve its
own proposal; the workshop does not open its own door. (Trust T6.)

**GR-9 · trace or delete.** Nothing is citable unless it resolves through
`SOURCES.md` to a concrete path or reference. A claim that cannot be traced
is removed, not softened.

**GR-10 · scratch copies only.** No seat edits the target artifact in place
during a run. Proposals are implemented in `runs/<runId>/<proposal>/` scratch
copies; a validated lever is folded back by the keystone, once, with the
conformance gate green before and after. Only the keystone writes
`frontier.json`, `claims_register.md`, and `manifest.yaml` — other seats
*return* proposed entries, and the keystone serialises them (append-only
ledgers do not survive concurrent writers).
