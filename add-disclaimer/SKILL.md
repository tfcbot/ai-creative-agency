---
name: add-disclaimer
description: Burn an FTC fine-print disclaimer onto a video via VidJutsu /v1/disclaimer.
requires:
  env:
    - VIDJUTSU_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# add-disclaimer

Call VidJutsu /v1/disclaimer with fine-print text to burn a compliance disclaimer onto a video.

## Providers

- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt

## Steps

1. Call /v1/disclaimer w/ fine-print text

## Input

- video + disclaimer text

## Output

- video with disclaimer
