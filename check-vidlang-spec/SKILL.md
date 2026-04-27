---
name: check-vidlang-spec
description: Validate a VidLang spec via VidJutsu /v1/check.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# check-vidlang-spec

Call VidJutsu /v1/check with the enabled rules and return a validation report.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt

## Steps

1. Call /v1/check w/ enabled rules

## Input

- spec + rules

## Output

- validation report
