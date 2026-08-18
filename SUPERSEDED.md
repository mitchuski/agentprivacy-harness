# SUPERSEDED

This repo is the **v1 extraction** (2026-06-11) and is kept as prior art.
It is superseded by the rebuilt skeleton at `C:\Users\mitch\dual-agent-harness`
(fresh from scratch, 2026-07-09), which carries what v1 lacked:

- `TRUSTS.md` — the six PVM constitutional trusts, each mapped to where it bites
- `engine/conform.mjs` — the gate that proves the Z/64Z algebra instead of asserting it
- `GROUND_RULES.md` GR-1..GR-10 and seven seat cards in `seats/`
- a verified runnable toy (`examples/field-guide/`) with the Fiat-Shamir Gap audit trail

Design difference, not just completeness: v2 keeps instances OUT of the
framework repo ("your harness path is a config, not a fork") — `HARNESS_PATHS.md`
maps to them where they live. This repo's vendored `shor-mage/` instance is the
shape v2 deliberately rejects.

Note for the First Person: the public remote (github.com/mitchuski/agentprivacy-harness)
still carries the shor-mage workflow bundle in its history.
