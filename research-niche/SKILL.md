---
name: research-niche
description: Research a niche on a specific platform — pull top posts, summarize formats and hooks.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# research-niche

Pull top-performing posts in a niche on a chosen platform and summarize the formats and hooks that are working.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Keyword search per a specific platform
2. Collect top posts
3. Summarize formats/hooks by analyzing with Gemini and Claude

## Input

- niche keyword + platforms

## Output

- top-posts table + format summary
