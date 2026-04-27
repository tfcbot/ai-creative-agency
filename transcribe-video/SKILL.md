---
name: transcribe-video
description: Transcribe a video with word-level timing via VidJutsu.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# transcribe-video

Call VidJutsu /v1/transcribe and return the text with word-level timings.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt

## Steps

1. Call /v1/transcribe

## Input

- video URL or file

## Output

- text + word timings
