# Boot file — one session, one seat

The boot protocol lives in `AGENTS.md` (the tool-neutral convention file) —
read it in full and follow it exactly. Claude Code loads it via the import
below; there is one source of truth, not two.

@AGENTS.md

## Claude-specific notes

- The Workflow tool is the reference runtime for multi-agent rounds
  (`WORKFLOW.md`, README pathway step 3); `engine/dual_agent_loop.mjs` also
  accepts any `rt = { agent, parallel, pipeline, phase, log }` you supply.
- `SKILL.md` wraps this repo as a skill for on-demand loading elsewhere.
