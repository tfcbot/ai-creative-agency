---
name: score-thumbnail
description: Score a thumbnail with VidJutsu /v1/watch + a scoring prompt.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# score-thumbnail

Run VidJutsu /v1/watch against a thumbnail with a scoring prompt and return a score plus critique.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt

## Steps

1. Call /v1/watch with scoring prompt

## Input

- image

## Output

- score + critique
