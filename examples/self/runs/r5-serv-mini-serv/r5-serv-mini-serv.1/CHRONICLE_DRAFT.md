---
date: 2026-09-12
seat: chronicle
runId: r5-serv-mini-serv.1
verdict: MIRAGE
---

**Verdict:** MIRAGE — the round did not produce a validated lever. One candidate reached **95/95** on census but failed the hard constraint; the other improved to **94/95** and failed the census gate. No new result was folded.

## What happened

### Phase 1: probe of connective trimming
The first candidate, `trim-connective-prose-on-fold`, aimed to shave connective prose from the folded artifact. It was **not validated**: the census reported **94/95**, missing the witness `Shared state has exactly one writer`. The hard-constraint bundle was otherwise present, including the five commands in order, the loop table, the adoption steps, the constitution, and the box layout.

### Phase 2: probe of merged front-matter / intro structure
The second candidate, `merge-agent-note-into-constitution-and-collapse-step-preamble`, kept the census intact at **95/95** but failed the hard constraint. The issue was structural: the document was no longer the required first-open artifact. It introduced a longer-version pointer and changed the intro/run sections instead of preserving the exact ordered shape required.

## Reversals
- The **95/95** census result did **not** become a win because the hard constraint failed.
- The shorter-looking candidate did **not** become a win because it lost one witness and landed at **94/95**.

## Ledger entries proposed
- `trim-connective-prose-on-fold` → **MIRAGE**
- `merge-agent-note-into-constitution-and-collapse-step-preamble` → **MIRAGE**

## Handoff
Open questions: can the hard-constraint bundle be repaired without disturbing the current 95/95 census candidate shape?

Blocked items: the first-open structure currently conflicts with the attempted merge-style edit.

Single next action: **repair the hard constraint bundle so the first-open artifact preserves the exact required structure while re-evaluating the 95/95 candidate on the same witness set.**
