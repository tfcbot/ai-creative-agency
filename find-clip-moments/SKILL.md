---
name: find-clip-moments
description: Rank clip-worthy moments in a long-form video via transcribe + Gemini.
requires:
  env:
    - VIDJUTSU_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# find-clip-moments

Transcribe a long-form video and run Gemini to score moments by clip-worthiness.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Transcribe
2. Gemini score moments

## Input

- long-form video

## Output

- ranked timestamp list
