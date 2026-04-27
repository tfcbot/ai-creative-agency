---
name: breakdown-social-post
description: Break down a social post by URL — shot list, hook, and prompt JSON.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - VIDJUTSU_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# breakdown-social-post

Fetch a social post by URL, watch it with VidJutsu, and analyze it into a structured shot list, hook, and prompt JSON.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **VidJutsu** — https://docs.vidjutsu.ai/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding
- **ffmpeg** — local — install via `brew install ffmpeg`

## Steps

1. Fetch post
2. Get URL with Scrape Creators
3. Watch with VidJutsu
4. Analyze with Claude and Gemini

## Input

- post URL

## Output

- shot list + hook + prompt JSON
