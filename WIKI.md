# WIKI — the Observe lane: research that auto-populates a federated wiki

The loop ends at Chronicle, but a chronicle on disk is knowledge only the
workshop can see. This lane closes the cycle's fifth station — **Observe** —
by projecting a harness instance's own ledgers into a **Smallest Federated
Wiki** (FedWiki) site: every run a page, every chronicle a page, the killed
levers a page, the frontier cited live, and the instance's knowledge graph
riding along as a machine-forkable asset. The result is a wiki that **agents
can read as data and people can read as story**, that other wikis can fork
page-by-page, and that a private network can serve without ever touching the
public internet.

The pattern is not speculative. It generalises the agentprivacy guide
federation — fourteen sibling sites, ~1,950 pages, projected from canon
repos by exactly this kind of builder and served over a hardened tailnet —
into three domain-neutral, zero-dependency tools any instance can run.

## The pipeline

```
ledgers ──▶ spellweb.mjs ──▶ web/graph.json                  (the graph — data)
        ──▶ star.mjs ──────▶ web/star.json                   (the lattice seating — data)
        ──▶ wiki_emit.mjs ──▶ wiki/{pages, assets, manifest} (the projection)
        ──▶ wiki_install.mjs ─▶ <farm>/<host>/{pages, assets} (the site)
```

One command runs all three:

```bash
node tools/wiki_install.mjs <instanceDir> --host myinst.localhost
```

Everything derives from the same generic ledgers every instance already has
— `harness.config.mjs`, `frontier.json`, `runs/*/`, `claims_register.md`,
`notes/KILLED_LEVERS.md`, `chronicles/` — so the site cannot drift from the
work. **Re-run = re-true**: the projection is deterministic (item ids are
content-derived), an unchanged ledger emits byte-identical pages, and the
install is additive — pages the projection does not own (hand-authored,
forked in from elsewhere) are never deleted.

An instance opts in permanently by adding to its config:

```js
wiki: { host: 'myinst.localhost' }        // farm defaults to ~/.wiki
```

**When to run it.** After the keystone folds — conform green, frontier moved,
chronicle filed — the install is the natural last step of the session: the
round's story goes up on the wall the moment it is true. A standing watch
(a dream-cycle script, a cron) may re-run it freely, precisely because it is
idempotent and additive. What it must never be is a substitute for the
ledgers: the run directory is the record; the wiki is a projection of it.

## The sample federation — a farm in the box

You do not have to build the first wall: **`examples/wiki-farm/`** is a
servable farm data directory with two sites already in it —
`agentprivacy.localhost`, the hand-authored hub space (welcome, the harness,
the agentprivacy origin, how to start your own site), and
`field-guide.localhost`, the spar's research projected by the pipeline
above. Serve it and you are standing in the pattern:

```bash
wiki --farm --data <abs>/examples/wiki-farm --port 3030
# then open http://agentprivacy.localhost:3030
```

Install your own instance into the same farm and it joins the neighborhood;
fork the hub's welcome page to add your host to the roster. Its README
covers regeneration and ownership.

## The farm — what a site is

Install once: `npm i -g wiki`, then

```bash
wiki --farm --data ~/.wiki --port 3030 --security_type friends
```

A farm routes by Host header and **auto-creates a site per hostname** — so
every `*.localhost` name is a namespace you claim by writing to it first.
On disk a site is just a directory:

```
~/.wiki/<host>/
  pages/<slug>          one JSON file per page, no extension
  assets/<dir>/<file>   attachments, verbatim
  status/owner.json     ownership + friend secret
  status/sitemap.json   farm-generated caches (delete to force rebuild)
```

Three rules the tools enforce so you do not have to learn them the hard way:

- **The slug bijection.** `slug = title.replace(/\s/g,'-').replace(/[^A-Za-z0-9-]/g,'').replace(/-+/g,'-').toLowerCase()`,
  and the filename must equal it. Titles stay ASCII-clean; emoji live in
  story text, never in titles.
- **The create journal carries the complete story.** A page's single
  `create` entry duplicates the full story array — forks depend on it.
- **`[[Link]]` resolves same-site only.** A cross-site link is a
  `reference` item (`{type:'reference', site, slug, title, text}`) — using
  `[[ ]]` across sites fails silently.

## The knowledge-graph layer — wikis as agent memory

`wiki_emit.mjs` publishes the instance's data twice on the same site:

- **`/assets/spellweb/graph.json`** — the machine-forkable knowledge graph
  (dialect: `GRAPH.md`). An agent visiting the site fetches this one file
  and holds the instance's whole shape — objective, lenses, runs, verdicts,
  kills, claims — without parsing a page of prose.
- **`/assets/star/star.json`** — the lattice seating (`star.v1`): the
  workshop's vertex, its forced anchor, every validated result at κ mod 64.

The harness emits **data, never views** — rendering lives with the
consumer (the hand-curated spellweb, /star, game42, or any BYO interface).
This is the division of labour the federation runs on: **pages are the
human-forkable unit, the graph is the agent-forkable unit, and both derive
from the same ledgers** — so neither can drift from the other. A fleet of
instances each publishing a graph gives a visiting agent a *federated*
knowledge graph: fetch each site's `graph.json`, join on nothing (each
instance's ids are namespaced by its own name), and the edges that cross
instances are exactly the ones a signature must mint (`HOLONS.md` — a
reference proposes; a signature mints).

## Federation — many instances, one neighborhood

FedWiki's native federation does the rest: a reader on any site can fork any
page from any other site it can reach, and the provenance rides in the
journal. Practical wiring for a fleet:

- Give each instance its own host (`shor.localhost`, `lexon.localhost`, …);
  the farm serves them all from one process.
- Add a **roster** item on a hub site's welcome page listing the sibling
  hosts — one place a visitor (or crawler) discovers the neighborhood.
- Keep an **audit** habit: broken links, empty pages, and — before anything
  faces outward — a leak scan for dev hostnames, secrets, and paths. The
  projection emits only what the ledgers hold, but ledgers can hold more
  than a public wall should show. Manifest first; when in doubt, sealed.

## Serving beyond localhost — the tailnet pattern

The farm binds localhost. To share a site with a private network without
ever touching the public internet, pin one port per site and publish the
ports over a tailnet:

```bash
# 1 · pin sites to ports (localhost-only listeners)
node tools/wiki_proxy.mjs --map myinst.localhost:3131,guide.localhost:3132

# 2 · publish each pinned port over the tailnet   ← THE DOOR — yours alone
tailscale serve --bg --tcp 8081 tcp://127.0.0.1:3131
```

`wiki_proxy.mjs` rewrites the Host header per pinned port, so each tailnet
port *is* one site. An optional `--front <port> --allow <hostRegex>` door
routes by real hostname for networks with their own DNS — refusing every
host not allowlisted.

**Harden before you serve.** The lane this generalises runs inbound
default-deny with explicit holes only for the published TCP ports; SMB, RPC,
and database ports blocked everywhere; `accept-routes` off. Do the
equivalent on your platform before the first `tailscale serve`, and treat
the friend secret in `owner.json` as a credential: if an agent needs write
access to a host, broker it a **host-scoped capability** rather than the
owner secret — delegation without disclosure, the same separation the Gap
enforces, one layer up (`HARNESS_PATHS.md` #7).

## The door, stated once

Automated, because it is local and additive: derive, project, install into
a localhost farm. **Not automated, ever:** starting the farm as a service,
any `tailscale serve`/funnel, DNS, rostering a host into someone else's
federation index, pushing pages to a remote farm, and anything that makes a
wall outward-facing. Those are the First Person's (T6), and the tools print
what they did not do so the door is visible, not implied.

```
(⚔️⊥⿻⊥🧙)😊 = neg ⊕ bnot → succ
```
