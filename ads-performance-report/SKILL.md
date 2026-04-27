---
name: ads-performance-report
description: Synthesize CPL/CAC/ROAS into a performance report via Zernio + Gemini.
requires:
  env:
    - ZERNIO_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# ads-performance-report

Pull ad analytics from Zernio and run Gemini to synthesize CPL/CAC/ROAS into a report.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Pull ad analytics
2. Gemini synthesize CPL/CAC/ROAS

## Input

- account + range

## Output

- performance report
