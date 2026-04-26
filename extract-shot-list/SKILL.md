---
name: extract-shot-list
description: Extract a JSON shot list from a video via frame-by-frame Gemini analysis.
requires:
  env:
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# extract-shot-list

Run Gemini frame-by-frame against a video and emit a structured JSON shot list.

## Providers

- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Gemini frame-by-frame analysis
2. Emit shots

## Input

- video file/URL

## Output

- JSON shot list
