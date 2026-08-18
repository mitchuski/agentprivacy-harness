# Sources — the harness repo

Trace or delete (GR-9): nothing is citable unless it resolves through this
registry to a concrete path or reference.

Evidence classes: **E-RUN** — output produced in this repo (path) ·
**E-DOC** — a document in this repo (path) · **E-EXT** — external source
(stable URL, DOI, or spec name).

## The lineage (cited by `RESEARCH.md`)

| slug | class | resolves to | note |
|---|---|---|---|
| fiat-shamir-1986 | E-EXT | Fiat & Shamir, "How To Prove Yourself", CRYPTO 1986 | hash-derived challenges; the Gap's ancestor |
| promise-theory | E-EXT | Burgess, Promise Theory (promise-theory.org) | the autonomy axiom behind T1 |
| pvm-v6 | E-EXT | the Privacy-is-Value model V6 · agentprivacy.ai · 0xagentprivacy | the six trusts and the Swordsman ⊥ Mage architecture |

## The practices survey (cited by `PRACTICES.md`, 2026-08-18 cycle)

Fetched by three sweep lanes blind to this repo's claims; every row is
REPORTED tier (GR-2). Dates as published; living docs marked (living).

| slug | class | resolves to | note |
|---|---|---|---|
| anthropic-building-effective-agents | E-EXT | https://www.anthropic.com/engineering/building-effective-agents | 2024-12 · workflows vs agents; five patterns; ACI |
| anthropic-multi-agent-research | E-EXT | https://www.anthropic.com/engineering/multi-agent-research-system | 2025-06 · orchestrator-workers; delegation specs; checkpointing |
| anthropic-writing-tools | E-EXT | https://www.anthropic.com/engineering/writing-tools-for-agents | 2025-09 · tool design as prompt engineering |
| anthropic-context-engineering | E-EXT | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | 2025-09 · context rot; just-in-time retrieval; compaction |
| anthropic-agent-sdk | E-EXT | https://claude.com/blog/building-agents-with-the-claude-agent-sdk | 2025-09 · gather → act → verify; verification tiers |
| anthropic-agent-skills | E-EXT | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | 2025-10 · progressive disclosure; open standard 2025-12 |
| anthropic-code-exec-mcp | E-EXT | https://www.anthropic.com/engineering/code-execution-with-mcp | 2025-11 · filter in code; sandbox tradeoff |
| anthropic-long-running | E-EXT | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | 2025-11 · JSON state over prose; one feature at a time; git as recovery |
| anthropic-when-multi-agent | E-EXT | https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them | 2026-01 · split by context, not phase; verification subagent |
| claude-code-best-practices | E-EXT | https://code.claude.com/docs/en/best-practices | (living) · a check the agent can run; hooks for guarantees |
| claude-code-memory | E-EXT | https://code.claude.com/docs/en/memory | (living) · CLAUDE.md hierarchy; the @AGENTS.md bridge |
| skill-authoring | E-EXT | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices | (living) · "the context window is a public good" |
| agents-md | E-EXT | https://agents.md/ | (living) · the neutral boot-file convention; Linux Foundation stewarded; 60k+ repos |
| github-copilot-agents-md | E-EXT | https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/ | 2025-08 · Copilot reads AGENTS.md, nested |
| cursor-rules | E-EXT | https://cursor.com/docs/context/rules | (living) · reads AGENTS.md natively; reference files, don't copy |
| gemini-md | E-EXT | https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html | (living) · GEMINI.md; context.fileName → AGENTS.md |
| augment-agents-md | E-EXT | https://www.augmentcode.com/guides/how-to-build-agents-md | 2026-03/06 · tiered boundaries; auto-generated files hurt |
| osmani-agents-md | E-EXT | https://addyosmani.com/agents/15-agents-md/ | 2026 · ~150 lines; grow from repeated mistakes |
| openai-practical-guide | E-EXT | https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf | 2025-04 · single agent first; layered guardrails; HITL triggers |
| openai-harness-engineering | E-EXT | https://openai.com/index/harness-engineering/ | 2026-02 · repo as source of truth; deterministic enforcement. Primary URL refused our fetch (403); claims corroborated via InfoQ 2026-02 coverage — labelled accordingly |
| langchain-multi-agent | E-EXT | https://www.langchain.com/blog/how-and-when-to-build-multi-agent-systems | 2025-06 · parallelize reads, serialize writes |
| google-adk-patterns | E-EXT | https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/ | 2025-12 · generator-critic; determinism where flow is known |
| anthropic-demystifying-evals | E-EXT | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | 2026-01 · grader types; pass@k vs pass^k; broken-task heuristic |
| metr-reward-hacking | E-EXT | https://metr.org/blog/2025-06-05-recent-reward-hacking/ | 2025-06 · frontier models game reachable graders |
| openai-cot-monitoring | E-EXT | https://arxiv.org/abs/2503.11926 | 2025-03 · monitor out of the reward loop; obfuscation risk |
| anthropic-emergent-misalignment | E-EXT | https://arxiv.org/abs/2511.18397 | 2025-11 · reward hacking generalizes to misalignment |
| metr-elicitation | E-EXT | https://metr.github.io/autonomy-evals-guide/elicitation-protocol/ | 2024–25 · held-out dev/test split; fix the harness first |
| openai-swebench-verified | E-EXT | https://openai.com/index/introducing-swe-bench-verified/ | 2024-08 · harness defects bias both directions |
| openai-swebench-retired | E-EXT | https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ | 2026 · a "verified" benchmark decays; contamination at the top |
| swebench-plus | E-EXT | https://arxiv.org/abs/2410.06992 | 2024-10 · ~31% of passes ride weak tests; solution leakage |
| arc-policy | E-EXT | https://arcprize.org/policy | (living) · semi-private/private sets; ±10% overfit alarm |
| huang-self-correct | E-EXT | https://arxiv.org/abs/2310.01798 | ICLR 2024 · intrinsic self-correction degrades; correlated error |
| wataoka-self-preference | E-EXT | https://arxiv.org/abs/2410.21819 | NeurIPS-W 2024 · self-preference is perplexity-driven |
| criticgpt | E-EXT | https://arxiv.org/abs/2407.00215 | 2024-06 · trained critics out-catch humans; critics hallucinate |
| khan-debate | E-EXT | https://arxiv.org/abs/2402.06782 | ICML 2024 · debate lifts weak judges; truth argues better |
| weaver | E-EXT | https://arxiv.org/abs/2506.18203 | NeurIPS 2025 · aggregate weak verifiers; the generation–verification gap |
| slsa-in-toto | E-EXT | https://slsa.dev/spec · https://slsa.dev/blog/2023/05/in-toto-and-slsa | 2023–25 · signed statements over content digests |
