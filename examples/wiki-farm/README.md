# examples/wiki-farm — the sample federation

A ready-to-serve Smallest Federated Wiki **farm data directory**, so a fresh
clone of this repo has a wiki neighborhood on day one — the Observe lane
(`WIKI.md`) with the engine already running. Two sites:

| site | what it is | how it exists |
|---|---|---|
| `agentprivacy.localhost` | the hub space — welcome, the harness, the agentprivacy origin, how to start your own site | **hand-authored** — edit it like any wiki |
| `field-guide.localhost` | the runnable spar's research, projected: runs, verdicts, killed levers, chronicles, and the knowledge graph | **generated** from `examples/field-guide` — re-run = re-true |

## Serve it

```bash
npm i -g wiki
wiki --farm --data <abs path to>/examples/wiki-farm --port 3030
```

Then open **http://agentprivacy.localhost:3030** — every `*.localhost` name
resolves to your own machine; the farm routes by hostname, one site per
name. Nothing here is reachable from anywhere else until you decide it is
(`WIKI.md` §serving documents the tailnet pattern and the hardening that
comes first).

## Regenerate the projected site

```bash
node tools/wiki_install.mjs examples/field-guide --farm examples/wiki-farm
```

Deterministic and additive: unchanged ledgers emit byte-identical pages, and
hand-authored pages (like the two `welcome-visitors`) are never deleted. The
run directory is the record; the site is its story.

## Add your own instance

```bash
node tools/wiki_install.mjs <your-instance> --farm examples/wiki-farm
```

Then fork `agentprivacy.localhost`'s welcome page and add your host to the
roster. Each installed site serves people its pages and serves agents
`/assets/spellweb/graph.json` — the same ledgers, two audiences, no drift.

## Ownership

No `status/` directories are committed — the farm creates them. Before
serving to anyone but yourself, claim each site by writing
`<site>/status/owner.json` with your name and a friend secret, and treat
that secret as a credential (never hand it to an agent; broker host-scoped
capability instead — `HARNESS_PATHS.md` #7).

*The wall is local until a person decides otherwise. That is not a
limitation; it is the design (T6).*
