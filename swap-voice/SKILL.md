---
name: swap-voice
description: Swap the voice in a video to a target voice via ElevenLabs STS.
requires:
  env:
    - ELEVENLABS_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# swap-voice

Run ElevenLabs speech-to-speech against a video with a target voice ID and return a voice-swapped video.

## Providers

- **ElevenLabs** — https://elevenlabs.io/docs/llms.txt

## Steps

1. Call ElevenLabs STS w/ target voice

## Input

- video + voice ID

## Output

- voice-swapped video
