---
name: upload-customer-list
description: Upload a PII customer list to a custom audience (server-hashed).
requires:
  env:
    - ZERNIO_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# upload-customer-list

Upload a PII customer list (emails/phones) to a Zernio audience — Zernio hashes server-side.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt

## Steps

1. Upload PII list (server-hashed)

## Input

- audience ID + emails/phones

## Output

- upload result
