---
name: add-overlay
description: Burn a text overlay onto a video via VidJutsu /v1/overlay.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# add-overlay

Call VidJutsu /v1/overlay with text and position to burn an overlay onto a video.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt

## Steps

1. Call /v1/overlay w/ text + position

## Input

- video + text + position

## Output

- video with overlay
