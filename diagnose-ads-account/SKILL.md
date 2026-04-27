---
name: diagnose-ads-account
description: Diagnose an ads account's binding constraint via funnel metrics + Gemini.
requires:
  env:
    - ZERNIO_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# diagnose-ads-account

Pull funnel metrics from Zernio and run Gemini to identify the binding constraint.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Pull funnel metrics
2. Gemini identify constraint

## Input

- account + range

## Output

- constraint diagnosis
