---
name: add-voiceover-to-video
description: Generate an ElevenLabs voiceover from a script and a `voice_id`, then mux it onto a (typically silent) video. Handles lead-in padding, end-pad to video length, and uploads the final mp4 to VidJutsu CDN for a stable URL. Use when the user has a voice ID + script + video and wants the spoken track laid down. Pairs with `clone-voice-from-video`.
requires:
  env:
    - ELEVENLABS_API_KEY
    - VIDJUTSU_API_KEY
  bin:
    - ffmpeg
    - ffprobe
    - vidjutsu (CLI, optional — used only for stable-URL upload)
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# add-voiceover-to-video

Take a `voice_id` (from ElevenLabs), a script (string), and a video file (mp4/mov). Produce a final mp4 with the voiceover muxed in. Upload to VidJutsu CDN and return a stable URL.

## When to use

- User has a silent or b-roll-style video and wants to add narration.
- Following `clone-voice-from-video` — the natural next step.
- Re-voicing a video with a script tweak (regenerate VO, re-mux) without re-rendering the video.

## When NOT to use

- User wants to *replace* an existing spoken track with a different voice → use `swap-voice` (ElevenLabs STS) instead.
- User has no script yet → write the script first; this skill assumes the script is locked.

## Cost

- ElevenLabs TTS (multilingual v2): ~$0.30 per 1K characters at the Creator tier (~$0.18 Pro). A 50-word script ≈ 280 chars ≈ $0.05–0.08.
- VidJutsu upload: free on the included plan.
- Total: < $0.10 per run.

## Pipeline

1. **Validate** `ELEVENLABS_API_KEY` and `VIDJUTSU_API_KEY`. Stop with a signup link if either is missing.

2. **Probe the video** with `ffprobe` to get its duration. The VO must fit inside this window.

3. **Generate the VO** via ElevenLabs TTS:

   ```sh
   curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/<VOICE_ID>?output_format=mp3_44100_128" \
     -H "xi-api-key: $ELEVENLABS_API_KEY" \
     -H "Content-Type: application/json" \
     --data-raw '{
       "text": "<script>",
       "model_id": "eleven_multilingual_v2",
       "voice_settings": {
         "stability": 0.55,
         "similarity_boost": 0.85,
         "style": 0.3,
         "use_speaker_boost": true,
         "speed": 0.95
       }
     }' \
     --output <out>/voiceover.mp3
   ```

4. **Sanity-check** the VO duration with `ffprobe`. If `vo_duration + lead_in > video_duration`, the script is too long — surface to the user with the delta and the suggestion to trim N words. Do not silently truncate.

5. **Mux** with ffmpeg. Add a small lead-in (default 0.5s) so the VO doesn't start on frame 1, and `apad` so the audio track stretches to match the (likely longer) video. `-shortest` ensures the output ends at video end:

   ```sh
   ffmpeg -y -i <video> -i <out>/voiceover.mp3 \
     -filter_complex "[1:a]adelay=500|500,apad[a]" \
     -map 0:v:0 -map "[a]" \
     -c:v copy -c:a aac -b:a 192k -shortest \
     <out>/video-with-vo.mp4
   ```

6. **Verify dead space.** If the gap between `vo_end + lead_in` and `video_duration` is > 2s, surface to the user with a suggestion to add a closing line of ~N words. Do not silently leave a long silence — viewers register it as an unfinished ad.

7. **Upload** to VidJutsu CDN for a stable shareable URL:

   ```sh
   vidjutsu upload <out>/video-with-vo.mp4
   # → returns { url, assetId }
   ```

8. **Persist** a manifest at `<out>/manifest.json`:

   ```json
   {
     "voice_id": "...",
     "script": "...",
     "vo_duration_seconds": <number>,
     "video_duration_seconds": <number>,
     "lead_in_seconds": 0.5,
     "tail_silence_seconds": <number>,
     "video_with_vo_path": "<abs path>",
     "vidjutsu_url": "https://cdn.vidjutsu.ai/...mp4",
     "vidjutsu_asset_id": "asset_..."
   }
   ```

## Defaults

| Param | Default | Notes |
|---|---|---|
| `model_id` | `eleven_multilingual_v2` | Best balance of quality and prosody for cloned voices. |
| `stability` | `0.55` | Slight expressiveness without drift. Lower = more emotional, higher = more monotone. |
| `similarity_boost` | `0.85` | Hold close to the cloned voice's character. |
| `style` | `0.3` | Light style transfer. Push to 0.5+ only if the source has strong vocal personality. |
| `speed` | `0.95` | Slightly slower than 1.0 reads more naturally for ad delivery. |
| `lead_in_seconds` | `0.5` | Avoids frame-1 audio cut-in. |
| `output_format` | `mp3_44100_128` | Plenty of headroom for AAC re-encode at mux. |

## Hard-won learnings

1. **ElevenLabs duration is non-deterministic on the same script.** Ask for a 50-word script with `speed: 0.95` and you may get 11.4s on one call and 14.5s on the next. Always re-probe after generation; don't assume word-count predicts seconds.

2. **Em-dashes (`—`) and ellipses (`...`) can blow up duration.** A script that rendered at 11s without dashes can render at 24s with dashes (the model sometimes treats them as long pauses). If the duration jumps wildly between attempts, normalize punctuation (commas + periods only) and re-run.

3. **Apostrophe escaping in shell-passed JSON.** `you'll` shelled through bash with `-d "...you\\'ll..."` will sometimes emit a stray backslash that ElevenLabs reads literally. Use `--data-raw '{"text":"..."}'` with single-quote outside / single-quote-escape-inside, or write the JSON to a file and `--data-binary @file.json`.

4. **`-shortest` cuts video to VO duration if you swap the args.** The pattern `ffmpeg -i video.mp4 -i vo.mp3 ... -shortest` plus `apad` on the audio side will preserve full video length only if the apad'd audio is longer than the video. Always `apad` the audio.

5. **TikTok Shop CTAs are vernacular.** Writers default to "go grab a tub" / "click the link below" — real creators say "tap the orange cart", "linked below", "ran to grab mine", "I'll link it". When the user asks for a CTA closer, draft in TikTok-creator vernacular by default.

6. **Dead space at the end reads as unfinished.** A 15s ad with a VO that ends at 11s shows the viewer 4 seconds of held-product silence. Either extend the script with a closer that maps to whatever's on screen during that window (use VidJutsu `/v1/watch` to identify the visual beat), or trim the video.

7. **Upload to VidJutsu CDN, not the bare Higgsfield/Wavespeed CDN.** Source CDNs rotate or expire (Higgsfield CloudFront has a 7-day TTL). VidJutsu URLs persist. For anything the user will share or re-publish, always upload.

## Reference run

EP-01 Bloom Greens (Strawberry Kiwi UGC, 15s):

- Voice: `lFGbjNWc9mbcFqOEMwq3` (cloned via `clone-voice-from-video`)
- Script: 54 words, ending with "Tap the orange cart, I linked the one I use."
- VO duration: 14.5s, lead-in 0.5s, video 15s → 0s tail silence
- Output: `https://cdn.vidjutsu.ai/uploads/mc_8ae830aed7914759ac75c693/8891660c-7e6d-4d03-a5c0-9240a8692dc5.mp4`

This run produced the canonical "no dead space, native CTA" output. Use as the validation template for future runs.
