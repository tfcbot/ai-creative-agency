---
name: research-hooks
description: Mine first-line hooks from N seed creators and cluster them.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# research-hooks

Fetch posts from a list of seed creators, extract their first-line hooks, and cluster the best.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Fetch posts from N seeds
2. Extract first-line hooks
3. Cluster

## Input

- seed handles

## Output

- ranked hook table
