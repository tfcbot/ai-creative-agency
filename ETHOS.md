# AI Creative Agency Ethos

Principles every skill in this repo follows. New skills must satisfy
all of them before merging.

---

## 1. Each skill ships a finished output

A skill's happy-path produces one usable artifact end to end — not a
fragment that requires another skill to be useful. If the work spans
multiple end products, it's multiple skills.

## 2. Self-contained

A skill runs without installing other tfcbot repos. Recipes and
references travel inside the skill's own directory. Don't introduce
cross-skill imports until two existing skills already need the same
abstraction — favor duplication over premature sharing.

## 3. Naming = use case

Verb-first. `clone-ad`, not `ad-cloner`. `generate-carousel`, not
`carousel-builder`. The slash command is what a user types when they
know what they want — match that intent.

## 4. Wavespeed for video and image. VidJutsu for QA. ElevenLabs for voice. Captions.ai for captions

Don't introduce a model-level provider (Sora, Kling, Seedance directly,
etc.) unless Wavespeed can't host the model. The provider stack stays
small. New providers require an entry in `docs/PROVIDERS.md` with
signup link, expected cost, and rationale.

## 5. Cost transparency up front

Every skill's `SKILL.md` lists expected per-run API cost in the
walkthrough section before any provider call runs. No surprises
mid-run.

## 6. Validate keys before running

A skill stops gracefully when a required key is missing, with the
signup link for that provider. No partial runs that fail halfway and
burn credits on dependencies that have already returned.

## 7. Outputs land in `CWD/<skill>-<timestamp>/`

Predictable. Never overwrite. Easy to clean up. The skill operates on
the user's current working directory and creates a new timestamped
output dir per run.

## 8. One skill per release

Don't bundle changes across skills in a single commit. Each skill
ships independently — make commits readable in isolation.
