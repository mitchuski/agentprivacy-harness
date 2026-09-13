# Note for the seat working directly on the harness — the console as a game others can run

*2026-09-11, late. Written by the Star Key / Hold session on the First Person's direction, for whichever seat holds the harness next. A note, not a chronicle of a round: no frontier moved, nothing is committed. Read `AGENTS.md` first; this adds a direction, not a mandate.*

## What the First Person said, in his words

> the live console is something I think would be beneficial to have and be runnable by others where they can insert their own dataset or provide an agent access to a repo or directory and start folding. I think a game where the dual agent harness is pointed at different open source and (commercially) closed source repos to support with agentic integration, allowing for the folding of words as well as creation of numbers — for example the encodings we do into the wikis on the torus, and into trust artefacts and VTA memory.

Three asks are inside that:

1. **Runnable by others.** Someone who is not us clones the harness, points it at *their* dataset, repo or directory, and starts folding — without our Workflow tool, our wiki farm, or our keys.
2. **A game.** The fleet is the board. Each repo pointed at is a workshop; each fold is a move; the frontier is the score that only moves through the gate. Open-source repos and (with permission) commercially closed ones are both targets, and the product is *agentic integration support*: the harness folds a repo's words (docs, guides, specs) and creates its numbers (a metric the repo did not have).
3. **Folds become trust artefacts.** What a workshop produces should land where this lane already puts value: κ-addressed artefacts, wiki pages on the torus (the star chart), VRC edges, and now the Hold — VTA memory a bearer carries and can prove over.

## What already exists that this stands on (do not rebuild)

| Piece | Where | State |
|---|---|---|
| The read-only console: discovers every `harness.config.mjs` under the repo, `examples/`, and the roots in `tools/console.roots.json`; serves `/`, `/workshop`, `/frontier`, `/api/instances`, `/api/state`, `/api/gates`, `/api/feed`, `/run` — GET only, no outward action (T6/GR-8) | `tools/console.mjs` | running on :4242 tonight; nine workshops discovered |
| The workshop page, **restyled tonight** to the City / labs / agentprivacy.ai palette (Cormorant Garamond · Inter · JetBrains Mono, navy ground, the City's mono chips) and rewritten to read the fleet **live**: instance picker on the frontier canvas, a card per workshop from `/api/instances` deepened by each `/api/feed`, live tiles (workshops, audited folds, deepest fold), the four ecosystem doors, the honest-boundary list now including "a flat frontier is a benchmark before its first round". Falls back to the labelled field-guide demo when opened as a file | `tools/workshop.html` | served, script parse-checked; open it in a browser and look — the old page hard-coded 730→472 |
| The scaffold: `node tools/new_instance.mjs <dir> [name]` copies the ledgers and a blank config, refuses to pretend it is finished | `tools/new_instance.mjs`, `templates/` | used twice tonight for the Star Hold pair |
| The feed: `runtime-feed.v1` per instance, `movingCeiling.ratio` = R(t), what `/star`'s ceiling register draws | `tools/emit_feed.mjs` | both Star Hold instances emitted |
| The engine accepts **any** runtime `rt = { agent, parallel, pipeline, phase, log }` — the Workflow tool is the reference, not the only door | `engine/dual_agent_loop.mjs`, `CLAUDE.md` | the seam "runnable by others" needs |
| Wiki emission and the proxy (pages onto the farm, the torus chart), κ holons, minted artefacts, VRC edges, the star projection | `tools/wiki_emit.mjs`, `wiki_install.mjs`, `wiki_proxy.mjs`, `kappa.mjs`, `holon_audit.mjs`, `mint_artefact.mjs`, `vrc.mjs`, `star.mjs` | built in July–August; see `HOLONS.md`, `WIKI.md` |
| The Hold — VTA memory: a sidecar of retained signed envelopes beside a City Key; the Star runtime's `hold_relate` verifies before entry; a fold receipt is exactly the kind of item it was built to carry | `~/agentprivacy-mcp/lib/hold.mjs`, `swordsman/swordsman.mjs`, `bin/star.mjs`; reference `~/dtgwg-zkp-tf-mage/runtimes/star-hold/` | built tonight, 45/45 + 2/2; documented in `~/star-key/docs/STAR_SIGNATURE_ARTEFACT_REVIEW_2026-09-11.md` |
| Two instances whose objectives are *not* words: a claims register (unbacked claims, 4/22) and a disclosure seat (public-side bytes, 521) — the "creation of numbers" case already has two examples | `runtimes/star-hold/harness/`, `harness-disclosure/` | conform PASS, no round run |
| The catalogue of sixteen embodiments, each with its at-a-glance block — the shape a "game board" would list | `HARNESS_PATHS.md` (§17 added tonight) | — |

## What the game needs that does not exist yet (proposed, for the seat to price)

1. **A point-at-a-repo scaffold.** `new_instance` asks the human to fill the objective. The game needs a *deriver*: given a repo or directory, propose the objective, gate and canary from what is there — for words, a fact census over the docs with the guide's canary rule; for numbers, whatever the repo already counts (tests passed, constraints, bytes, a benchmark it ships). The proposal is a `harness.config.mjs` the human accepts; `conform.mjs` still refuses a TODO. This is the "insert your own dataset" door.
2. **A runner without our tools.** A `runs/` driver that takes `rt` from any agent API (or a human at a terminal playing the seats) and runs one round end to end, so a stranger can fold. The engine already accepts it; the missing piece is one honest example under `examples/` that is not ours.
3. **The board.** The console's `/api/instances` is already the list; a `/board` view is the game face — workshops as seats, folds as moves, R(t) as the score, the arena tier from the workshop page made literal. Keep it a projection (GR-5): nothing on the board is a record.
4. **Folds as artefacts, end to end.** One fold → `mint_artefact` (κ) → a wiki page on the torus (`wiki_emit`) → a Hold item (`star relate` of the fold's receipt, profile `agentprivacy.vta/1` or a trust task) → a VRC edge when a second workshop vouches for the fold. Each arrow exists as a tool; the chain has never been run as one move.
5. **Consent for closed repos.** A commercially closed repo enters the game only with a written grant in the instance (`SOURCES.md` + a `door` entry naming who allowed it); the harness never fetches, clones or pushes on its own (T6). The first closed target should be one of ours.

## Boundaries the note does not change

Outward actions are the First Person's (commits, pushes, DNS, registering a garden, sending the reply to the House of Archon). Numbers are cited from `frontier.json`, never restated. A round is a Workflow launch or an `rt` the human supplies; nothing in this note runs one. The console stays GET-only.

## Doors for the First Person

Whether the game's first outside target is a repo of ours (the candidates on the board tonight: `star-key`, `agentprivacy-mcp`, `hearthold_mage`) or a stranger's; whether `/board` lives in the console or on mages.city; whether a fold receipt enters the Hold as a self item signed by the workshop's own Swordsman (recommended) or as a witness item.
