---
name: draft-hashtags
description: Rank trending hashtags for a niche.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# draft-hashtags

Fetch trending hashtags via Scrape Creators and rank them for a niche with Gemini.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Fetch trending hashtags
2. Gemini rank for niche

## Input

- niche

## Output

- ranked hashtag list
