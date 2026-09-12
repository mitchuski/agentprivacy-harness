# Claims register — examples/corpus

| id | claim | tier | enforced by | evidence | status |
|---|---|---|---|---|---|
| CR-1 | Every claim in kb/records.json resolves to a file under corpus/ that still contains its quote | PROVEN | code | `node tools/census.mjs --gate` | accepted |
| CR-2 | Every number in a record's prose appears in one of its claims | PROVEN | code | `node tools/census.mjs` (unquoted) | accepted |
| CR-3 | The weak-trace count is 1 at baseline | PROVEN | code | `node tools/census.mjs` → weak | accepted |
| CR-4 | The auditor writes into corpus/ never | DERIVED | code | tools/census.mjs opens files read-only | accepted |
| CR-5 | The records assert that a document says a number, not that the number is right | OPEN | manual | settled only by the document's own provenance | accepted |
