---
name: compliance-check
description: Run a TOS compliance scan on a video via VidJutsu.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# compliance-check

Call VidJutsu /v1/compliance/video and return a risk score plus cited clauses.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt

## Steps

1. Call /v1/compliance/video

## Input

- video

## Output

- risk score + cited clauses
