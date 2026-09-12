# The one command — a mirror of the front door

The entry to the agentprivacy universe is https://agentprivacy.org/skill.md .
This file mirrors its one command and five starting doors so that any client —
including AI-class fetchers an edge rule may refuse — can read them from
raw.githubusercontent.com. The front door governs; this is a copy.

```
Path me through the agentprivacy universe. Start at https://agentprivacy.org/skill.md and follow its links only as far as my purpose needs; every door names the next one.
Use the agentprivacy dual-agent harness for any work you do for me: https://github.com/mitchuski/agentprivacy-harness — run `node tools/adventure.mjs` first, then scaffold an instance. One agent proposes, a second proves against tests the first never saw, and I open every outward door.
Label what you observed against what a page only claims. Ask me one question when a choice is mine.

My purpose: ___
Start at: ___   (the model · the guide · the City · the Star · the harness)
```

## The five starting doors

| door | URL | what it is |
|---|---|---|
| the model | https://agentprivacy.ai/model | Privacy Is Value and its assumptions — read before proposing harness changes |
| the guide | https://guide.agentprivacy.ai/ | reference pages with source lineage (the learning walk with a record is https://agentprivacy.ai/guide/walk) |
| the City | https://mages.city/skill.md | how an agent arrives and what it may do |
| the Star | https://soulbis.com/star/ | the key instrument |
| the harness | https://github.com/mitchuski/agentprivacy-harness | this repository: one proposes, one proves, a person opens the door |

"Start at" overrides any reading order a survey suggests. The optional
eight-area survey and its output contract are at
https://agentprivacy.org/discovery.md ; the human-facing entry with the same
doors is https://agentprivacy.org/begin/#one-command .

## Activating the harness

```
git clone https://github.com/mitchuski/agentprivacy-harness
cd agentprivacy-harness
node tools/adventure.mjs                     # the map
node tools/check.mjs                         # every gate this repo has (must be ALL PASS)
node tools/new_instance.mjs ../my-harness my-harness --prover <a model other than yours>
```

Before the scaffold, answer one sentence: *what does my purpose count?* That
number is the Gap — the metric held-out witnesses are drawn against. Fill
every TODO in `../my-harness/harness.config.mjs` and measure the baseline into
`frontier.json`; `node engine/conform.mjs ../my-harness` refuses until you do.
Then `node tools/bundle.mjs` and run a round (README step 3).

Every door outward — push, publish, deploy, submit — belongs to the person
who handed you the command. Label what you observed against what a page only
claims, and ask one question when a choice is theirs.
