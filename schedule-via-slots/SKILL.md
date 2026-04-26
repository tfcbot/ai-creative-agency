---
name: schedule-via-slots
description: Schedule a post on a TokPortal-managed account via the slot model.
requires:
  env:
    - TOKPORTAL_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# schedule-via-slots

Add a video slot, configure with a schedule time, and publish the bundle.

## Providers

- **TokPortal** — https://developers.tokportal.com/llms.txt

## Steps

1. Add slot
2. Configure w/ schedule time
3. Publish bundle

## Input

- account ID + video + time

## Output

- scheduled post
