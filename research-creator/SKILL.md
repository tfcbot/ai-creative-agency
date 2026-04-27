---
name: research-creator
description: Profile a single creator — fetch their posts and summarize what's working for them.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# research-creator

Fetch a creator's profile and recent posts/reels, then summarize their content patterns and outliers.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding
- **Claude** — runs in your agent session — no key needed

## Steps

1. Fetch profile
2. Fetch posts/reels
3. Summarize patterns

## Input

- handle

## Output

- content patterns + outlier list
