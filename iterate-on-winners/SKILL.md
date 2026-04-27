---
name: iterate-on-winners
description: Generate next-round briefs from top performers via Zernio + Gemini.
requires:
  env:
    - ZERNIO_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# iterate-on-winners

Pull top performers from Zernio and run Gemini to generate next-round briefs.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Pull top performers
2. Gemini next-round briefs

## Input

- account + window

## Output

- brief list
