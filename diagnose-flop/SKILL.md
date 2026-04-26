---
name: diagnose-flop
description: Hypothesize why a post underperformed vs. its handle baseline.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# diagnose-flop

Fetch the post, compare to the handle's baseline, and run Gemini to hypothesize why it flopped.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Fetch post
2. Compare to handle baseline
3. Gemini hypothesis

## Input

- post URL

## Output

- underperformance hypothesis
