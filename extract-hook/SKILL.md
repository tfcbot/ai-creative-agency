---
name: extract-hook
description: Pull the first 3 seconds of a video plus a hook structure breakdown.
requires:
  env:
    - VIDJUTSU_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# extract-hook

Trim the first 3 seconds, transcribe, and run Gemini to characterize the hook structure.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding
- **ffmpeg** — local — install via `brew install ffmpeg`

## Steps

1. Trim first 3s
2. Transcribe
3. Gemini hook structure

## Input

- video file/URL

## Output

- first 3s clip + transcript + hook
