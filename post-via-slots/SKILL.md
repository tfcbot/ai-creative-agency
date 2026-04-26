---
name: post-via-slots
description: Publish to a TokPortal-managed account via the slot model.
requires:
  env:
    - TOKPORTAL_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# post-via-slots

Add a video slot to a TokPortal bundle, configure it, and publish the bundle.

## Providers

- **TokPortal** — https://developers.tokportal.com/llms.txt

## Steps

1. Add video slot
2. PUT slot config
3. Publish bundle

## Input

- account ID + video + caption

## Output

- published post
