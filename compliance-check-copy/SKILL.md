---
name: compliance-check-copy
description: Run a TOS compliance scan on caption/copy text via VidJutsu.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# compliance-check-copy

Call VidJutsu /v1/compliance/prompt against caption or copy text and return a risk score plus cited clauses.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt

## Steps

1. Call /v1/compliance/prompt

## Input

- text (caption/copy)

## Output

- risk score + cited clauses
