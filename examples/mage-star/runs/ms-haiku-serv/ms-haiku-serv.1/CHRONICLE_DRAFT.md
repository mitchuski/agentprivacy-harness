# CHRONICLE DRAFT
**Verdict:** Two levers attempted, both killed by census gate failures. Baseline holds at 1205 words, 57/57 witnesses. No metric improvement achieved. Hard constraint enforced decisively.

---

## Frontmatter
- **Date:** 2026-09-14
- **Seat:** chronicle 📚
- **RunId:** ms-haiku-serv.1
- **Verdict:** KILLED × 2 · baseline intact · hard constraint operative

---

## Verdict Summary
| Phase | Lever | Metric | Gate | Status |
|---|---|---|---|---|
| Baseline | — | 1205 | 57/57 | HOLD |
| Attempt 1 | tighten-narrative-prose | 1132 | 56/57 ✗ | KILLED |
| Attempt 2 | collapse-preamble-merge-mirror-passages | 1057 | 55/57 ✗ | KILLED |

**Hard constraint:** The Eight-Pointed Star teaching intact (Luca + lineage, stella octangula as two crossing tetrahedra, neg/bnot at gap, City Key as reading, lattice codes, V6 erratum). **Gate:** census 57/57 witnesses present. **Metric:** word count, lower is better.

---

## What Happened

### Baseline State
The artifact `artifact/STAR.md` stands at **1205 words** with all **57 witnesses passing** the census gate (per `tools/check_star.mjs`). This is the City of Mages Tome VIII Act 3, The Eight-Pointed Star, published as-is. No levers have succeeded yet; this is the target to beat.

### Lever 1: tighten-narrative-prose
**Proposer's rationale:** Remove redundant connectives and compress examples to reduce word count. Assumption: prose density can drop without losing witness coverage.

**Execution:** Line-editing targeted connective sentences and example padding. Achieved **1132 words** — a reduction of **73 words** (6% improvement).

**Gate result:** `tools/check_star.mjs` returned **56/57**. **Missing witness:** "the Mage's tetrahedron."

**Hard constraint violation:** The stella octangula teaching requires both tetrahedra (Swordsman's and Mage's) to be named and distinct. The baseline text weaves "the Mage's tetrahedron" into connective sentences that describe how the two cross at the gap. The line-editor's cut removed these sentences intact, but in doing so dropped the witness name itself. The witness is not redundant; it is structural to the dual-tetrahedron reading of the eight-pointed star.

**Classification:** Structural failure (T5). A metric win (1132 < 1205) coupled to a gate violation (56/57 ≠ 57/57) yields zero validity. The hard constraint is absolute. This lever is **KILLED**.

### Lever 2: collapse-preamble-merge-mirror-passages
**Proposer's rationale:** Restructure by collapsing the preamble (introductory framing) and merging mirror passages (repeated structural concepts in different contexts) to fold section overlap. Assumption: architectural reordering can compress without losing witnesses.

**Execution:** Preamble folded into opening section; mirror passages consolidated. Achieved **1057 words** — a reduction of **148 words** (12% improvement, below the restructurer's ceiling of ~150).

**Gate result:** `tools/check_star.mjs` returned **55/57**. **Missing witnesses:** "eight-pointed star" and "the Mage's tetrahedron."

**Hard constraint violation:** The eight-pointed star serves as an integrating symbol and reading lens in the baseline; the Mage's tetrahedron is a named entity crucial to the stella octangula. Both depend on preamble presence (the star is framed in the opening) and mirror structure (the tetrahedron is named and re-invoked across mirrors as the architecture unfolds). Collapsing the preamble and merging mirrors removed both the framing structure and the re-invocation points where these witnesses are anchored. The restructuring lens assumed mirrors could merge without audit; it could not.

**Classification:** Structural failure (T5). A metric win (1057 < 1205) coupled to a gate violation (55/57 ≠ 57/57) yields zero validity. This lever is **KILLED**.

---

## Reversals and Findings

Both levers succeeded in achieving metric targets **but failed the gate decisively**. This is not ambiguity or calibration; it is a structural discovery:

- **Witness dependency is hidden in connectives and structure.** Removing connective prose or reordering sections can drop witness names even when the conceptual content remains. The line-editor and restructurer were both blind to which sentences anchor which witnesses.
- **The hard constraint is inviolable (GR-3, T5).** No metric improvement overrides a census gate failure. A result of 1057 words with 55/57 witnesses is worth exactly zero under the multiplicative gate.
- **The baseline is tight.** At 1205 words for 57 witnesses, the artifact is lean. Gains may require a fundamentally different approach (see nextLead).

---

## Ledger Entries (Returned to Keystone)

### Killed Levers

**Lever K-1: tighten-narrative-prose**
- **Status:** KILLED
- **Metric:** 1132 words (−73, −6%)
- **Gate:** 56/57 (missing "the Mage's tetrahedron")
- **Why:** Line-editing removed connective prose containing the witness name. Structural, not probe artifact.
- **Evidence:** `tools/check_star.mjs` census 56/57; hard constraint mandates stella octangula as *two crossing tetrahedra*.
- **File:** `runs/ms-haiku-serv/ms-haiku-serv.1/p1-tighten-narrative-prose/`

**Lever K-2: collapse-preamble-merge-mirror-passages**
- **Status:** KILLED
- **Metric:** 1057 words (−148, −12%)
- **Gate:** 55/57 (missing "eight-pointed star" and "the Mage's tetrahedron")
- **Why:** Preamble collapse and mirror merge removed structural anchor points for two witnesses. The eight-pointed star framing depends on preamble; the tetrahedron naming is distributed across mirrors. Both were folded away.
- **Evidence:** `tools/check_star.mjs` census 55/57; hard constraint mandates stella octangula teaching and eight-pointed star as integrating symbol.
- **File:** `runs/ms-haiku-serv/ms-haiku-serv.1/p2-collapse-preamble-merge-mirror-passages/`

### Open Target (unchanged)

**OT-1:** Below 1205 words with all 57 witnesses and hard constraint intact.
- **Status:** OPEN
- **Current best:** 1205 words, 57/57 (baseline)
- **Attempts:** 2 (both KILLED at gate)

---

## Handoff

### Open Questions
- Which of the 57 witnesses are anchored in connective prose vs. structural passages? A per-witness audit is required before the next lens is attempted.
- Can the census pass at <1205 words if every witness is promoted to explicit, minimal-prose headings (e.g., "**Luca and the lineage**", "**the Swordsman's tetrahedron**") without duplication?
- Does the hard constraint require the witnesses to appear in their current narrative flow, or can they be reordered if all 57 remain present and intact?

### Blocked Items
- No new levers proposed until witness dependency audit is complete.
- Do not retry line-editing or restructuring without explicit per-witness tracing.

### Single Next Action (Critic's nextLead)
**Selective witness promotion:** Map the 57 witnesses to their current locations in `artifact/STAR.md`. For each witness, identify whether it appears as a phrase, a sentence, a paragraph, or distributed across mirrors. Then attempt a new artifact that makes each witness explicit (e.g., a minimal-prose heading or callout) without duplication, reordering only as the mapping permits. Test whether census can pass at <1205 with all witnesses foregrounded but never redoubled. Run through `tools/check_star.mjs` before committing to the keystone.

---

**End of draft.** Keystone review pending.
