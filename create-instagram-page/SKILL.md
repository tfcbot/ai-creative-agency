---
name: create-instagram-page
description: Provision a managed Instagram account via TokPortal.
requires:
  env:
    - TOKPORTAL_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# create-instagram-page

POST a TokPortal bundle of type account_only, wait for delivery, and return the credentials and TokMail.

## Providers

- **TokPortal** — https://developers.tokportal.com/llms.txt

## Steps

1. POST /bundles type=account_only
2. Wait for delivery
3. Return creds + TokMail

## Input

- niche

## Output

- account ID + creds
