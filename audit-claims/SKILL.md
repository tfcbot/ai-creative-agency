---
name: audit-claims
description: Scan copy for risky claims via Gemini.
requires:
  env:
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# audit-claims

Run Gemini against text to flag risky claims that need substantiation or disclaimers.

## Providers

- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Gemini scan for risky claims

## Input

- text

## Output

- flagged claims list
