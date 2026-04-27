---
name: download-post
description: Download a social post's media plus its metadata via Scrape Creators.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# download-post

Fetch the post, download its media, and emit the metadata as JSON.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt

## Steps

1. Fetch post
2. Download media
3. Emit metadata

## Input

- post URL

## Output

- MP4 + metadata JSON
