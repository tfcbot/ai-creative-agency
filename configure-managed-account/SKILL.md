---
name: configure-managed-account
description: Set bio, link, and image on a TokPortal-managed account.
requires:
  env:
    - TOKPORTAL_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# configure-managed-account

PUT bio/link/image to a TokPortal bundle's account, finalize, and run corrections if validation flags issues.

## Providers

- **TokPortal** — https://developers.tokportal.com/llms.txt

## Steps

1. PUT /bundles/:id/account
2. Finalize
3. Corrections if needed

## Input

- account ID + bio + link + image

## Output

- configured account
