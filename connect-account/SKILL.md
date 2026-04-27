---
name: connect-account
description: Connect a brand-owned account to Zernio via OAuth.
requires:
  env:
    - ZERNIO_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# connect-account

Initiate the Zernio OAuth flow for a platform and return the auth URL or pending data token.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt

## Steps

1. Initiate OAuth
2. Return authUrl or pendingDataToken

## Input

- platform + profile

## Output

- auth URL or token
