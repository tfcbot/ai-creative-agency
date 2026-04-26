---
name: breakdown-video
description: Break down a local MP4 into shot list, hook, and prompt JSON.
requires:
  env:
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# breakdown-video

Run Gemini against a local video to emit a structured shot list, hook, and prompt JSON.

## Providers

- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Gemini analyze
2. Emit shot list + hook + prompt

## Input

- local MP4

## Output

- shot list + hook + prompt JSON
