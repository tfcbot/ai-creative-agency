---
name: extract-caption-pattern
description: Characterize how a creator writes captions — format, length, CTA shape.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
    - GEMINI_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# extract-caption-pattern

Fetch a handle's posts and run Gemini to analyze caption format, length, and CTA patterns.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt
- **Gemini** — https://ai.google.dev/gemini-api/docs/video-understanding

## Steps

1. Fetch handle posts
2. Gemini analyze format/length/CTA

## Input

- handle

## Output

- caption pattern report
