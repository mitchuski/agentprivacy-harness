# Maintenance · 2026-10-25 · A lane shown as a chain

Maintenance, not research: no seat, no round, no verdict.

**What changed.** `README.md` gains a section, *Show a lane as a chain*, after *View a run*: a lane's κ-evidence
bundles (minted by `tools/kappa_evidence.mjs mint` or kappa-evidence-mage) can be read as one PoAW chain page with
the engine kept in the hash-site lane (`levers/chain_site.py` + one project JSON), and the community index is
regenerated with `levers/evidence_cards.mjs`. It names the three skill drafts that carry the method
(`evidence-chain-page`, `seal-notation`, `evidence-chain-face`), which are drafts awaiting review, not published.

**Why.** Twelve lanes were read this way on 2026-10-25; the harness is where a cloner's own runs mint bundles, so the
front-facing README should say what those bundles can become. No harness code, gate, seat or instance changed.

**Checked.** `node tools/check.mjs`: all 64 gates pass after the edit.

**Doors (the First Person's, unexecuted).** Commit; whether the chain engine should later move into this repo as a
tool rather than be pointed at.

**Later the same day.** The section now names the problem a *quest* of the Mages City with a subdomain of its own
(the line settled in blake3_mage `docs/HONING_THE_EXPRESSION_2026-10-25_QUEST.md`). Gates re-run: all pass.
