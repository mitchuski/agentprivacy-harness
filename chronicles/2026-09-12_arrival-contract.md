# Arrival contract — maintenance

Verdict: the entry path now distinguishes exploration, research setup and
agentprivacy reference routes before assigning a research seat. This is a
maintenance change, not a validated research fold; no frontier was changed.

The scaffold preserves positional destinations and saved config, and can record
a research directory separately from scratch in a gitignored planning file.
The runner respects saved prover models and supplies boot text to API seats.
The generic template consumes the engine's salted derivation and makes absent
inputs/evidence explicit. Console discovery no longer imports executable configs;
running gates from the console is an explicit startup choice.

Validation: tools/check.mjs passes including tools/entry.test.mjs. The latter
uses temporary fixtures and a loopback fake model, verifies actual model routing,
and checks discovery against a throwing config. tools/make_default.mjs emits a
distribution whose gates pass. No provider model was called and nothing was
published. Existing workshop and catalogue work was preserved.

Handoff:
- Open: domain adapters must supply authorized source inputs and executable
  evidence; a connection record alone does not run arbitrary research.
- Blocked: none for this local maintenance patch. Live website handoffs were
  not verified or changed.
- Next action: exercise the own-repository route against one chosen research
  task, with its input scope and evaluation rule established.
