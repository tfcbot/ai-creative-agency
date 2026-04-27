---
name: weekly-report
description: Synthesize a weekly winners + losers report via Zernio + Gemini.
requires:
  env:
    - ZERNIO_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# weekly-report

Pull the last 7 days from Zernio and run Gemini to synthesize winners and losers.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Pull last 7 days
2. Gemini synthesize winners + losers

## Input

- account

## Output

- weekly report
