---
name: extract-frame
description: Extract a single frame from a video at a timestamp.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# extract-frame

Use VidJutsu /v1/extract or local ffmpeg to extract a single PNG frame at a timestamp.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt
- **ffmpeg** — local — install via `brew install ffmpeg`

## Steps

1. /v1/extract or ffmpeg frame

## Input

- video + timestamp

## Output

- PNG frame
