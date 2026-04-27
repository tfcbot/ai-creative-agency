---
name: score-hook
description: Score the first 3 seconds of a video for hook strength.
requires:
  env:
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# score-hook

Trim the first 3 seconds and run Gemini to score hook strength and suggest improvements.

## Providers

- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding
- **ffmpeg** — local — install via `brew install ffmpeg`

## Steps

1. Trim first 3s
2. Gemini score hook strength

## Input

- video

## Output

- score + suggestions
