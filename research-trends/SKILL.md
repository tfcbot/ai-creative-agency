---
name: research-trends
description: Surface trending hooks and formats on a platform within a time window.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# research-trends

Pull trending and popular feeds on a platform, cluster by format, and rank what's heating up.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding
- **Claude** — runs in your agent session — no key needed

## Steps

1. Pull trending + popular feeds
2. Cluster by format
3. Rank

## Input

- platform + window

## Output

- trending hooks/formats table
