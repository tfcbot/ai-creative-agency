---
name: schedule-posts
description: Schedule a post on a connected account via Zernio.
requires:
  env:
    - ZERNIO_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# schedule-posts

Upload media to Zernio and create a post with a scheduledAt time.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt

## Steps

1. Upload media
2. Create post w/ scheduledAt

## Input

- account + media + caption + time

## Output

- scheduled post ID
