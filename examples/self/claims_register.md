# Claims register — examples/self

| id | claim | tier | enforced by | evidence | status |
|---|---|---|---|---|---|
| CR-1 | The baseline is the word count of artifact/PATH.md by the rule in tools/measure.mjs | PROVEN | code | frontier.json baseline.how; `node tools/measure.mjs` | accepted |
| CR-2 | Every witness in census.json is present in artifact/PATH.md (the canary passes N/N) | PROVEN | code | `node tools/check_path.mjs` exits 0 | accepted |
| CR-3 | A candidate missing any witness cannot be VALIDATED | PROVEN | code | the assay prompt carries the code-side census result; the keystone re-runs check_path.mjs on candidate.md before folding | accepted |
| CR-4 | Every proposal's seed re-derives from its saved canonical bytes | PROVEN | code | `node ../../tools/verify_run.mjs . <run>` | accepted |
| CR-5 | The hard constraint (still the document a stranger opens first) is judged by the prover, not by code | REPORTED | prompt | the assay seat's evidence field; the keystone reads the candidate | accepted |
