---
name: create-youtube-channel
description: Provision a managed YouTube channel via TokPortal.
requires:
  env:
    - TOKPORTAL_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# create-youtube-channel

POST a TokPortal bundle, wait for delivery, and return the YouTube channel credentials.

## Providers

- **TokPortal** — https://developers.tokportal.com/llms.txt

## Steps

1. POST /bundles
2. Wait for delivery
3. Return creds

## Input

- niche

## Output

- channel ID + creds
