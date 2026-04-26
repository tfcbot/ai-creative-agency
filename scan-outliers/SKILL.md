---
name: scan-outliers
description: Flag a creator's outlier posts — anything 3-4× their median engagement.
requires:
  env:
    - SCRAPE_CREATORS_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# scan-outliers

Fetch a handle's posts, compute median engagement, and flag the 3-4× outliers worth studying.

## Providers

- **Scrape Creators** — https://docs.scrapecreators.com/llms.txt

## Steps

1. Fetch handle posts
2. Compute median engagement
3. Flag 3-4× outliers

## Input

- handle

## Output

- outlier post list
