---
name: schedule-optimal
description: Schedule a post at Zernio's next optimal time slot.
requires:
  env:
    - ZERNIO_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# schedule-optimal

Get the next optimal slot from Zernio and create a post at that time.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt

## Steps

1. Get next optimal slot
2. Create post at slot

## Input

- account + media + caption

## Output

- scheduled post ID
