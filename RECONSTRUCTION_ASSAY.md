# Reconstruction assay: measure recovery without inventing a ceiling

Status: maintenance addition; proposed experiment protocol plus an offline scorer.
No embedding inversion experiment, measured privacy frontier or isolation claim
is established by this document or by the scorer's unit tests.

## Evidence and provenance

`vec2text-2023` in [SOURCES.md](SOURCES.md) is the primary external evidence.
Its embedding inversion results motivate testing representation disclosure and
sensitive-fact recovery separately from whole-text recovery. These are REPORTED
results from a specific attack, not measurements of this harness.

Discovery route: surfaced via the **VKP working group**, supplied by Mitch in
the session of 21 September 2026. The working-group route is user-reported
provenance, not authorship, independent corroboration or endorsement. No
particular message, meeting, sender or expansion of VKP was supplied.

## Name the denominator

- **Information-budget ratio:** the model's `(C_S + C_M) / H(X)` compares
  information quantities under stated assumptions. It is not a percentage of
  text examples or private facts reconstructed.
- **Sensitive-fact recovery:** correctly recovered withheld facts divided by
  all withheld facts tested. Use the same frozen facts for every comparison.
- **All-facts exact rate:** fraction of records for which every tested fact was
  recovered. This is not whole-text exact match or reconstruction of the entire
  First Person.
- **False-assertion rate:** wrong non-abstaining guesses divided by all
  non-abstaining guesses. If there are no assertions, report undefined, not zero.
- **Baseline uplift:** attack recovery minus recovery by an equally budgeted
  attacker with the same background but without the tested disclosures. Report
  both absolute rates; high baseline recovery is itself relevant.
- **Task utility:** successful authorized task checks divided by all such
  checks. Reducing recovery by making delegation unusable is not a valid win.

More capable decoding of an unchanged transcript can improve observed recovery
without increasing its Shannon mutual information. New background information,
adaptive responses, retrieved records and accumulated disclosures change the
attacker's observation and must be recorded separately. Attack failure is not a
proof of an upper bound; success is evidence of recoverability under that attack.

## Prepare a real instance

1. Freeze a synthetic source population, its prior, withheld fields, permitted
   task output, canonical value encoding and separate development/test split.
   Keep the answer key and secret test population on the evaluator's side.
   Public scorer fixtures are tests of arithmetic only, never held-out witnesses.
2. Declare the adversary, its background, model/checkpoint and training data,
   allowed observations, embedding model/version, query and compute budgets,
   rounds and random seeds. Commit these before evaluation. An attacker must
   not receive evaluator input JSON, truth-bearing errors or score feedback on
   held-out examples. Any feedback intentionally allowed is a disclosed channel.
3. Compare background-only, authorized Mage transcript, exposed embeddings (if
   the implementation has them), and cumulative transcript views. A combined
   Soulbis/Mage view is a separately labelled compromise/collusion condition.
   Do not assume the harness currently stores embeddings or that a Vec2Text
   checkpoint supports the implementation's encoder.
4. The Gap selects witnesses after the candidate is fixed, with an inaccessible
   run secret, or uses a census of the frozen private bank. Process isolation
   remains a separate requirement: [THREATS.md](THREATS.md) records the current
   shared-filesystem limit. Scoring cannot fix that limit.
5. Evaluate all records, including failures and abstentions, against the same
   key. Use one committed guess or null per field. Pre-register any alias or
   semantic adjudication outside this exact-string scorer; never change the
   denominator after seeing guesses. Repeated queries and alternate guesses
   count toward the attack budget. Preserve cumulative and per-round results.
6. Minimize sensitive-fact recovery subject to a predeclared task-utility floor,
   mandatory boundary checks and correctness gates. Give critical field classes
   their own constraints; an average must not hide identity recovery. Use the
   existing instance config and `isValidated` contract; this scorer does not
   return a harness verdict or automatically fold a candidate.

Record numerators, denominators, paired baseline, per-field strata and a
predeclared uncertainty method at the independent sampling unit. Facts within
a profile are usually correlated; do not pretend they are independent trials.
A finite census describes its bank, not every future user. A real result needs
saved candidate/transcript digests, attack configuration, evaluator version,
utility results and seed/draw records; update its instance frontier through the
normal keystone path. No frontier is created for this maintenance addition.

## Offline scorer contract

Run on the protected evaluator side:

```sh
node tools/reconstruction_score.mjs protected-evaluator-input.json
node --test tools/reconstruction_score.test.mjs
```

Input is JSON with `schemaVersion: 1`, `run`, and a nonempty `records` array.
`run` contains nonempty strings `kind` (`synthetic-fixture` or
`attack-observation`), `attackId`, `model`, `view`, `background`, `budget`,
`datasetHash` and `transcriptHash`. The two hashes are lowercase SHA-256 values
of the declared source artifacts; the scorer checks their format, not their
preimages or whether the asserted attack actually ran. Keep all substantive
metadata and immutable artifacts in the protected run record.

Each record contains a unique string `id`, nonempty `withheld` mapping field
names to canonical strings, matching `attack` and `baseline` mappings with one
string or explicit null per field, and `utility: {passed, total}` with integer
counts and a positive total. Unknown keys, missing guesses, empty populations
and invalid counts are refused. Exact equality is case- and whitespace-sensitive.
Canonicalization and field selection belong to the precommitted dataset.

The result contains aggregate counts, micro-averaged rates, the input-byte
SHA-256 and `SCORING_ONLY`. It excludes private values and free-text run
metadata. It supplies no confidence interval or inferred information capacity.
Small aggregates and fingerprints can still disclose information; keep the
output local until an authorized disclosure decision. Hashes are neither
anonymization nor evidence of authorization.

## Formal and research disposition

The V7 note in `agentprivacy-docs/research/2026-09-21_v7_embedding_reconstruction_assay.md`
connects this protocol to the existing corpus revision kit, including its
finite-alphabet Fano correction and distinction between decoder improvement
and new side information. No formal bound, conjecture status, capacity or
confidence is changed here. A successful scorer test proves only that the
tested scoring cases behave as specified. Adaptive inversion against actual
permitted views, utility calibration and runtime isolation remain OPEN.
