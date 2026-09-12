# examples/corpus — your own documents, under a census

The adopter's front door. Bring a directory of documents; write one record
per thing they assert and one claim per number, each claim quoting the file
it comes from; run the census. Every claim must resolve to a file that still
contains its quote, or the gate fails. No model is needed for that. The seats
are for the part a script cannot do: reading a moving source and drafting the
next record.

This is step 0 of `ADOPTION.md`: if every claim you make is enumerable, an
auditor is the whole tool. The harness earns its cost only where the claim
space is too large to check.

```
corpus/       three sample documents (replace them with yours)
kb/records.json   records → claims → { source, quote, kind (disk | memory), read }
tools/census.mjs  the gate: traced · untraced · weak · stale · unquoted
```

```bash
node tools/census.mjs                 # the whole gate, no model: exit 1 on an untraced claim or an unquoted number
node tools/census.mjs --json          # the same, as JSON, for a page or a pipeline
node ../../engine/conform.mjs .       # the instance conforms
node ../../drivers/run.mjs --instance . --driver stub --run smoke      # the loop around it, no model
```

- **metric** — weak traces: claims whose only evidence is a memory file, a
  summary or a rendering rather than the source's own document. Lower is
  better. The sample ships with one; finding its source is the first fold.
- **gate** — untraced 0 and unquoted 0 (every number in a record's prose
  appears in one of its claims).
- **hard constraint** — the auditor reads the corpus and writes into it never;
  a rendering that cites the records can never be cited back.
- **door** — publishing what the records say is yours.

To adopt: replace `corpus/`, rewrite `kb/records.json`, set `gate.N` in
`harness.config.mjs` to your claim count, put the census numbers in
`frontier.json`, run the gate.
