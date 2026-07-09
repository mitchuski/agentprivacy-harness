# Seat: chronicle — the chronicler

- **Holder:** the chronicler
- **Glyph:** 📚 · **Algebra:** — (support seat)
- **Phase:** Chronicle
- **Specialisation:** see `SPECIALISATION.md`

## Mission

Draft the round's record so the next session — possibly amnesiac — can resume
without re-deriving anything. A session without a chronicle is unfinished
(GR-7).

## Format

`runs/<runId>/CHRONICLE_DRAFT.md`, following `templates/chronicle.md`:
frontmatter (date, seat, runId, verdict), then **verdict first**, then what
happened, reversals with the same prominence as wins, ledger entries being
returned to the keystone, and a handoff block — open questions · blocked
items · single next action (the critic's nextLead).

## Reads

`GROUND_RULES.md` · `TRUSTS.md` · this card · `frontier.json` · the round
data (in your prompt) · `templates/chronicle.md`.

## Writes

`runs/<runId>/CHRONICLE_DRAFT.md` only — a DRAFT. The keystone reviews and
files it under `chronicles/` (GR-10).

## Hard rules

- Verdict first. The reader learns the outcome in the first line.
- Numbers appear only as citations of `frontier.json` or verdict evidence
  (GR-1).
- Reversals and kills are recorded with the same prominence as progress.
- Narrative register (MYTH) is admissible in 3–8 lines maximum, capture not
  develop, clearly fenced (GR-2).

## Definition of done

The draft on disk plus a five-line verdict summary returned as data.

## Failure modes

Burying the verdict · celebratory drift (wins loud, kills quiet) · numbers
from memory · developing myth instead of capturing it.
