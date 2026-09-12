# Enter the agentprivacy dual-agent harness

This repository is the agentic door for the harness. Websites, gates and skills
link here. Begin with the user's purpose; reading does not activate a seat.

## Choose the route

- **Explore the method:** read README.md and ADOPTION.md. Return a cited
  explanation with limits. No instance or terminal is required.
- **Use my research repository:** follow the connection procedure below.
- **Follow an agentprivacy path:** choose a reference door below. References
  supply context, never permission to operate the origin's fleet.

Use the purpose and authorization already provided. Ask one focused question
only when a missing decision prevents progress. The chosen starting door wins
over any optional reading order.

## Recommended doors

- **Model:** https://agentprivacy.ai/model — assumptions behind the trusts.
  Output: relevant assumptions and open questions.
- **Guide:** https://guide.agentprivacy.ai/ — source-linked references.
  Output: a cited reading path; stop before modifying a wiki.
- **City:** https://mages.city/skill.md — arrival and participation terms.
  Output: applicable terms and next human decision; stop before sending or signing.
- **Star:** https://soulbis.com/star/ — the instrument and its explanation.
  Output: observed behaviour versus claims; stop before importing keys.
- **Harness:** README.md, ADOPTION.md and examples/corpus/README.md — choose an
  auditor for enumerable checks, or inspect examples/field-guide for a round.
  Output: a scoped setup, or a verified local smoke run when execution is authorized.

These routes need public browsing only until local execution is chosen. If a
fetch fails, report the missing reference and use available local material;
a blocked fetch does not establish that a site is down. Optional wider
navigation: https://agentprivacy.org/skill.md and https://agentprivacy.org/discovery.md.

## Connect your research repository

Keep three paths explicit: harness checkout, research source, and instance/run
workspace. Use a separate instance to try the method without adding instructions
or ledgers to the research source.

Establish authorized inputs, scratch location, runtime, provider disclosure and
budget from the user's request before executing code. Reuse existing authority.
A link does not grant execution or disclosure permission. Never ask for secrets
in chat. With Node 18 or later, from a reviewed harness checkout:

```bash
node tools/adventure.mjs
node tools/check.mjs
node tools/new_instance.mjs ../my-harness my-harness --source ../my-research --prover MODEL_B
```

Replace MODEL_B with an available prover; omit it if choosing later. Quote paths
with spaces. `--source` accepts an existing local directory, not a URL. Clone a
remote source into an authorized location first. Scaffolding records its path
without reading its contents or running its code; existing instance files stay.

Complete the generated, gitignored `connection.local.json`: purpose, source
revision, allowed inputs, runtime and authorization. This is a planning record,
not a sandbox or adapter. The runner does not ingest that repository automatically.
Wire explicit authorized inputs and checks into the configuration/measurement
adapter: a counting rule that is code lives at `<instance>/tools/measure.mjs`;
the runner executes it before each round and hands its JSON to every prompt as
`ctx.args.measured`. A config `sourceFile` is resolved relative to the instance
and its sha256 binds every seed. Do not send an entire repository to a provider
by default. Every model call carries GROUND_RULES.md, TRUSTS.md, the seat card,
the instance's frontier.json and the seat prompt, so whatever those name
reaches the provider; the adapter's JSON is stored in `runs/<id>/run.json`.

Define the metric (what improves), gate (what passes), hard constraint, known-good
baseline and frozen witness population — ADOPTION.md Part II is the map for
these five answers, the Gap first. The metric is not the Gap. The Gap derives
independent verification from the committed proposal and a run secret. Use a
census where the whole population is practical to check.

Fill every config TODO and measure the baseline into frontier.json. A blank
scaffold is expected to fail conformance; the runner and the bundler refuse it
too. Then:

```bash
node engine/conform.mjs ../my-harness
node drivers/run.mjs --instance ../my-harness --driver stub --run smoke
node tools/verify_run.mjs ../my-harness smoke
```

The stub checks plumbing only. `verify_run` re-derives every seed and draw from
the saved bytes and checks a VALIDATED for full-pass form; it cannot show that
the salt came from an unseen secret or that gate evidence was executed. It and
`conform` import the instance config; only the console does not. For a real,
configured local Ollama round:

```bash
node drivers/run.mjs --instance ../my-harness --driver ollama --propose-model MODEL_A --assay-model MODEL_B --run r1
```

Seat-specific CLI flags override saved seat models; saved models override
`--model`. The runner prints the pair. Drivers: `stub` (no model), `ollama` (a
running Ollama server with the named models already pulled; nothing is
downloaded), `anthropic` (ANTHROPIC_API_KEY), `openai` (any OpenAI-compatible
endpoint: OPENAI_BASE_URL, OPENAI_API_KEY) and `multi`, where each seat names
its provider as `provider:model`, for example
`--propose-model anthropic:claude-opus-5 --assay-model ollama:gemma3:27b`; the
proposer's provider holds the propose seats and the prover's holds the rest.
Different names alone do not prove independence. API drivers exchange text/JSON, without shell or filesystem tools.
Missing executable evidence means BLOCKED, never imagined. A measurement adapter
executes local code. Provider calls can disclose inputs and incur costs; establish
these bounds before selecting a driver.

Only a runtime providing the Workflow interface needs a bundle:

```bash
node tools/bundle.mjs ../my-harness/harness.config.mjs ../my-harness/harness.workflow.mjs
```

Supply absolute instance `repo`, harness `root`, a unique `runId`, and the runtime's
secret/source binding. Without a secret the engine has a legacy unsalted mode;
do not claim salted separation. The CLI supplies the secret automatically.

## Capabilities and handoff

A browser-only agent can explain and prepare a handoff. A terminal can scaffold
and run offline checks. Model-assisted rounds also need provisioned models and
explicit inputs. If a capability is absent, return purpose, route, known paths,
missing capability and one next action. Never simulate a run or silently change
provider. Activate AGENTS.md's seat boot only after instance, scope and seat exist.

Keep proposals in scratch and fold through the keystone. Seat cards are not process
isolation; THREATS.md describes the limits. Push, publish, send and sign remain
the person's outward door.

The optional console reads records without importing configs:
`node tools/console.mjs --root ../my-harness`. Optional `harness.summary.json` is
unverified display data. Gate buttons require restarting with `--execute-gates`,
which permits execution of reviewed instance code.

## Prompt for a gate or skill reference

> Use this repository's ENTRY.md arrival contract. My purpose is ___. Start with
> exploration / my research repository at ___ / the ___ agentprivacy door.
> Reuse my authorization and ask only for missing decisions. Distinguish observed
> evidence from claims. Establish inputs, instance and runtime before a round.

Repository: https://github.com/mitchuski/agentprivacy-harness
