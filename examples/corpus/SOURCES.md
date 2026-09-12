# Sources — examples/corpus

Trace or delete (GR-9). The records carry their sources inline (`kb/records.json` → `source` + `quote`).

| slug | class | resolves to | note |
|---|---|---|---|
| report | E-DOC | corpus/report.md | sample: the pilot's numbers |
| changelog | E-DOC | corpus/changelog.md | sample: where the dashboard came from |
| notes | E-MEM | corpus/notes-from-memory.md | sample: a remembered number; the weak class |
| census | E-RUN | `node tools/census.mjs --json` | the gate's output |
