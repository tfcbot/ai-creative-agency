# AI Creative Agency — repo-local guidance

This repo is a flat collection of Claude Code skills. Each top-level
directory is one skill (one workflow, one finished use case).

## When editing a skill

- Only edit files in that skill's directory.
- Don't introduce shared abstractions across skills unless multiple
  existing skills already need them.
- Recipes are numbered (`01-`, `02-`, …) and execute in order.
- References describe provider APIs, schemas, and rules — not workflow
  steps.

## When adding a skill

Read [`ETHOS.md`](ETHOS.md) first. The eight principles are
non-negotiable.

Use this scaffold:

```
<new-skill>/
├── SKILL.md
├── recipes/
│   └── 01-….md
└── references/
    └── ….md
```

## SKILL.md frontmatter

Required fields:

```yaml
---
name: <slug-matching-dir-name>
description: <one-line description, used by Claude Code's skill router>
requires:
  env:
    - WAVESPEED_API_KEY
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---
```

Each skill must declare its required env vars. The skill is responsible
for checking them before any provider call (see ETHOS principle 6).

## Provider docs

When adding a provider reference, also update [`docs/PROVIDERS.md`](docs/PROVIDERS.md)
with the signup link and expected cost. New providers require ETHOS
principle 4 review.
