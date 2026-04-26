---
name: run-dm-sequence
description: Enroll contacts into a multi-step Zernio DM sequence.
requires:
  env:
    - ZERNIO_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# run-dm-sequence

Create a Zernio sequence and enroll contacts into it.

## Providers

- **Zernio** — https://docs.zernio.com/llms-full.txt

## Steps

1. Create sequence
2. Enroll contacts

## Input

- sequence steps + contacts

## Output

- enrollment IDs
