# SPECIALISATION — personas, spells, and the Game of 42

The core of this repo is deliberately plain: seven functional seats, six
trusts, ten ground rules. That is the shareable skeleton. This document is
the map for going further — how a harness instance takes on **flesh**
(personas, skills, spells) and **structure** (the Game of 42 station
pattern), the way the working instances listed in `HARNESS_PATHS.md` did.
Everything here is optional; nothing here weakens a trust.

## 1. Dressing seats with personas — the agentprivacy-skills corpus

The **agentprivacy-skills** corpus (0xagentprivacy, agentprivacy.ai; v5,
"The Attachment Architecture") is a library of ~160 Agent Skills in five
categories: `meta/` (harness frameworks — including the dual-agent-harness
skill that mirrors this repo), `persona/` (42 casts: swordsman-aligned,
mage-aligned, balanced, cosmological), `privacy-layer/` (one skill per term
of the V(π,t) privacy-value equation), `role/` (domain knowledge), and
`wikis/` (git-less federated distribution).

A specialised instance dresses a seat by binding a persona to it:

- **propose** takes a **mage-aligned** persona; **assay** takes a
  **swordsman-aligned** one. The persona's frontmatter already declares its
  side (`alignment`, `dual_agent_role`, `emoji`) — the corpus was built so
  the pair decomposes this way.
- Each persona carries a **proverb** (its one-line law) and a **spell** — a
  `→`-chained pipeline that reads as the seat's procedure in miniature. A
  good binding is one where the spell IS the seat's Definition of done said
  faster. Example shape, from the horizon-gate skill:
  `state-the-waste → smallest-fix → confirm-or-reject-with-metrics → assay(held-out)`.
- Support seats (measure, critic, chronicle) take balanced or role personas;
  the keystone is never dressed — it is the pair itself.

Record bindings in a small registry JSON (seat → persona → skills → mandate)
and extend `engine/conform.mjs` to check that every seat's persona resolves
and no seat carries an empty mandate. The tigzkp instance (see
`HARNESS_PATHS.md`) carries the worked reference in its own canon registry.

## 2. The Game of 42 — fractal specialisation that follows structure

The station pattern is how instances multiply WITHOUT drifting: **6 axes ×
7 stations = 42**.

- **Axes.** Each workshop instance sits on one axis of work (the tigzkp
  instance holds the *compute* axis). Six axes bound a fleet; a new domain
  claims a vertex on an axis rather than inventing a new shape.
- **Stations.** Within a workshop, each of the seven seats takes a station:
  a non-empty subset of the three faculties **head = 1, heart = 2,
  hands = 4**. The seven non-empty subsets are the seven vertices 1..7 of
  the faculty cube — exactly one seat per vertex, filled in order. The seat
  that only thinks (head), the seat that only runs (hands), the seat that
  holds the pair together (head+heart+hands = 7 — the keystone) all exist
  because the cube says they must.
- **Anchors.** A specialised instance names an anchor pair whose vertices
  XOR to 63 — the complement law `bnot` made structural (the compute-axis
  instance anchors V38 ⊕ V25 = 63).
- **Checked, not asserted.** All of this extends the conformance gate:
  faculty subsets cover the seven cube vertices exactly once, fill orders
  are a permutation of 1..7, the anchor XOR holds. Structure you cannot
  check is decoration; the Game of 42 is structure because `conform.mjs`
  can fail on it.

**The fractal part.** The same algebra recurs at every scale:

- Inside a seat: soulbae's parallel finders are little mages, blind to each
  other — a propose seat is itself a (⊥) composition.
- Inside a workshop: the seven seats compose to one keystone step,
  `neg(bnot(x)) = succ(x)`.
- Across a fleet: workshops on different axes are held apart the same way
  seats are — each publishes a frontier, none writes another's ledgers, and
  what travels between them passes a gate it did not choose. The First
  Person is the keystone of the fleet, exactly as the keystone is the pair
  of the workshop.

So specialisation "follows structure": you never invent a new trust
topology, you re-instantiate the same one at the next scale, and the
conformance gate grows one more check instead of one more exception.

## 3. The order of operations

1. Copy `templates/harness.config.mjs`, fill the seats — the instance works
   plain. (Most instances should stop here for a while.)
2. Bind personas/spells to seats in a registry JSON; extend conform.
3. Claim an axis vertex and seat the stations when the instance joins a
   fleet.

Flesh after skeleton, structure before scale.
