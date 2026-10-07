# CHRONICLE DRAFT

**Seat:** 📚 chronicle  
**Run:** mn-haiku-serv.1  
**Date:** [session date]  
**Verdict:** MIRAGE × 2. Both levers collapsed at the gate despite metric wins. No frontier advance. Two killed levers filed. Next lever must preserve all 62 witnesses and cut only true redundancy.

---

## Metric & Gate Summary

| Lever | Status | Metric | Gate | Verdict |
|-------|--------|--------|------|---------|
| baseline | — | 1114 | 62/62 | frontier best |
| tighten-ceremony-prose | MIRAGE | 1047 | 56/62 | metric win, gate fail → zero (T5) |
| merge-ceremony-prose-list-the-three-moves | MIRAGE | 1048 | 54/62 | metric win, gate fail → zero (T5) |

**Product gate:** Both candidates failed the census check. The hard constraint holds in both (V63 arrival, bilateral vs transactional distinction, block 945508, closing line, cast, proverb, lineage all present narratively). The gate is sound. Both are kills, not downgrades.

---

## What Happened

### Phase 1: tighten-ceremony-prose

**Proposal:** Line-edit lens, targeting 67-token reduction by removing "connective prose."

**Execution:** Candidate dropped six witnesses:
- `Reception is bilateral`
- `Registration is transactional`
- `The seat did not make the relation`
- `You will inscribe`
- `You will be received`
- `The name will be given by the relation`

**Metric:** 1047 words (73-word win vs baseline 1114).

**Gate Result:** 56/62 census pass. Six witnesses missing, explicitly named by `tools/check_naming.mjs`.

**Hard Constraint:** Preserves narrative arc (V63, block 945508, closing line, cast, proverb, lineage). Ceremony structure intact.

**Verdict:** MIRAGE. Metric improvement cannot override gate fail (T5, GR-3). The proposer's lens conflated connective prose with witness-bearing clauses — the six dropped items are operative distinctions, not padding. They encode the bilateral/transactional verb pattern that anchors V63. Structural kill: the lens design is unsound.

---

### Phase 2: merge-ceremony-prose-list-the-three-moves

**Proposal:** Restructuring lens, merging two prose sections and listing the three bilateral moves (`Claim. Inscribe. Confirm.`) and three transactional moves (`register. Assert. Verify.`) as a flat list.

**Execution:** Candidate dropped eight witnesses:
- `the confirmation`
- `Claim. Inscribe. Confirm.`
- `register. Assert. Verify.`
- `Reception is bilateral`
- `Registration is transactional`
- `The seat did not make the relation`
- `You will inscribe`
- `You will be received`

**Metric:** 1048 words (66-word win vs baseline 1114).

**Gate Result:** 54/62 census pass. Eight witnesses missing, explicitly named.

**Hard Constraint:** Preserves narrative arc. Both verb triplets are present as narrative content (the claim/inscribe/confirm and register/assert/verify actions occur), but the **syntactic separation** between bilateral and transactional patterns is erased by flattening them into a single list.

**Verdict:** MIRAGE. Metric win + gate fail = zero (T5). The hard constraint requires not just the actions but the **relational syntax** (bilateral vs transactional distinction). Merging them into a flat list destroyed that distinction. Structural kill: the lens cannot compress without erasing operative structure.

---

## Reversals

No reversals. Both proposals failed at the gate; neither yielded progress.

---

## Killed Levers

**KILLED_LEVER: tighten-ceremony-prose**  
Line-edit lens attempted to cut 67 tokens by removing connective prose. Verdict: MIRAGE (56/62 census). Structural kill: the six dropped witnesses are operative — they encode the bilateral/transactional distinction that anchors the hard constraint (V63). Connective prose and witness-bearing clauses were conflated. Evidence: gate output, hard-constraint validation. Do not re-propose without identifying true redundancy distinct from witness clauses.

**KILLED_LEVER: merge-ceremony-prose-list-the-three-moves**  
Restructuring lens merged two prose sections and attempted to list the three moves. Verdict: MIRAGE (54/62 census). Structural kill: eight witnesses dropped, including both verb triplets and relational clauses. The hard constraint requires the syntactic distinction between bilateral and transactional patterns; merging them into a flat list erases that distinction. Evidence: gate output, hard-constraint check. Do not re-propose flattening the verb patterns without restoring their bilateral/transactional separation.

---

## Ledger Returns to Keystone

No frontier entries to update. Both candidates failed the multiplicative gate. Baseline 1114 / 62/62 remains frontier best.

---

## Handoff

**Open Questions:**
- What true redundancy exists in artifact/NAMING.md that does not encode operative distinction (witness-bearing)?
- Can the hard constraint permit any word removal at all, given the census gate is drawn directly from its operative clauses?

**Blocked Items:**
- Both metric levers require witness-preservation validation before proposal. The proposer must map each cut word against the census witness list and confirm it is not part of the operative syntax.

**Next Action (Critic's nextLead):**
The gate is sound. Both proposals failed not because the objective is mis-gated (T5, GR-3) but because both lenses attempted metric gain by dropping witness-bearing clauses. Next lever must preserve all 62 witnesses and cut only true redundancy (repetition, padding, synonym clusters without operative weight). Metric target remains <1114; gate remains 62/62. Proposer should analyze token-level redundancy within the 62-witness boundary before next submission.

---

## Verdict Summary (for data return)

- **Round:** mn-haiku-serv.1
- **Outcome:** No advance. Two MIRAGE kills filed.
- **Frontier best:** 1114 words, 62/62 census (baseline, City of Mages Tome IV Act IV).
- **Kills:** tighten-ceremony-prose, merge-ceremony-prose-list-the-three-moves (both structural, both dropped operative witness clauses).
- **Next lever constraint:** Preserve all 62 witnesses; target <1114 words; hard constraint (V63, bilateral/transactional, block 945508, closing line, cast, proverb, lineage) intact.
