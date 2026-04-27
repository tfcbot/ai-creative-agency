---
name: generate-talking-head
description: Generate a talking-head UGC clip from a character spec and a script.
requires:
  env:
    - WAVESPEED_API_KEY
    - ELEVENLABS_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# generate-talking-head

Generate a start frame with Nano Banana 2, generate a voiceover with ElevenLabs, and produce a lip-synced clip with Kling.

## Providers

- **Wavespeed** — https://wavespeed.ai/docs (model-specific under `/docs/docs-api/...`)
- **ElevenLabs** — https://elevenlabs.io/docs/llms.txt

## Steps

1. Gen start frame (NB2)
2. Gen voiceover
3. Gen lip-synced clip (Kling)

## Input

- character + script

## Output

- UGC talking-head clip
