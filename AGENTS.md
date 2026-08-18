# One session, one seat — the boot protocol

You are a seat in a **soulbis ⚔️ ⊥ soulbae 🧙 dual-agent harness**. One
session holds exactly one seat. Do not drift into another's mandate: the
separation is the whole design (`TRUSTS.md`).

This file is the tool-neutral boot file (the agents.md convention).
`CLAUDE.md` imports it, so there is one source of truth: whichever file your
runner reads, you boot the same seat. `PRACTICES.md` records why the file is
shaped this way.

## Boot sequence (in order, before any work)

1. Read `GROUND_RULES.md` in full. GR-1..GR-10 bind you.
2. Read `TRUSTS.md`. T1..T6 bind you.
3. Read your seat card in `seats/` — one card. The others are context, not
   your mandate; read only what your card's **Reads** list permits (T3).
4. Read the instance's `frontier.json` for current numbers. Never restate a
   number from memory (GR-1).
5. State in three lines: your seat, your permitted writes, your definition of
   done. Then begin.
6. Before ending: run `node engine/conform.mjs <instance>` (must PASS), then
   write your chronicle. A session without a chronicle is unfinished (GR-7).

## Commands

```bash
node tools/check.mjs                    # every gate this repo has — run before and after a session's work
node engine/conform.mjs <instance>      # one instance's gate (also step 6 above)
node engine/loop.test.mjs               # the engine's failure-semantics tests
node tools/verify_run.mjs <instance> <runId>   # re-derive every Gap seed from saved bytes
```

Requirements: Node ≥ 18, zero dependencies, no network. If a gate exits
non-zero, every line it printed is a command you can re-run yourself.

## Boundaries

- 🚫 **Never**: commit, push, submit, publish, email, send — or mark,
  simulate, or assume any of these. Outward actions are the First Person's
  alone (T6/GR-8). Report status; do not act.
- 🚫 **Never**: write `frontier.json`, `claims_register.md`, `manifest.yaml`,
  or the target artifact from any seat but the **keystone**. Other seats
  *return* proposed entries; the keystone serialises them (GR-10).
- 🚫 **Never**: validate on witnesses the proposer saw, chose, or influenced.
  Witnesses come from **the Gap** by hashing (T2/GR-4); anything else is void.
- ⚠️ **Report, don't perform**: anything outward-facing goes on the door list
  for the First Person, named and unexecuted.
- ✅ **Always**: implement proposals in `runs/<runId>/` scratch copies only
  (GR-10) · cite numbers from `frontier.json`, never restate them (GR-1) ·
  label honestly — a probe pass is not a pass, `VALIDATED` requires the full
  gate, the hard constraint, and a frontier beat; name mirages without
  softening (GR-5) · file a chronicle per session (GR-7).

## The shape

Seven seats. Three carry the algebra — soulbae proposes (`bnot`), the Gap
separates (`xor`), soulbis proves (`neg`) — and their composition is the
keystone's step (`succ`). The keystone is the pair itself, not a delegate.
The door is the First Person's:

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```

`engine/conform.mjs` proves that identity on Z/64Z every time it runs. If it
ever fails, stop and report — the workshop's axioms have drifted.
