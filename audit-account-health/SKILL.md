---
name: audit-account-health
description: Audit a connected Zernio account's token and permissions.
requires:
  env:
    - ZERNIO_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# audit-account-health

GET account health from Zernio and report token validity plus granted permissions.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt

## Steps

1. GET account health
2. Report token + permissions

## Input

- account ID

## Output

- health report
