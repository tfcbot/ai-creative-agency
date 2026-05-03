---
name: clone-voice-from-video
description: Clone a voice from any video file (mp4/mov/webm) via ElevenLabs Instant Voice Clone. Strips audio with ffmpeg, uploads to ElevenLabs, returns a `voice_id` that can be passed to `add-voiceover-to-video` or any ElevenLabs TTS endpoint. Use when the user has a sample video of a person speaking and wants a reusable voice clone.
requires:
  env:
    - ELEVENLABS_API_KEY
  bin:
    - ffmpeg
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# clone-voice-from-video

Take a video that contains a person speaking, extract a clean audio sample, and create an ElevenLabs Instant Voice Clone (IVC). Return the `voice_id` so it can be used in TTS or paired with `add-voiceover-to-video`.

## When to use

- User shares a clip of themselves (or anyone) and wants to "clone this voice", "use this voice for narration", "make a voiceover in their voice".
- Building a series where multiple episodes need the same narrator and you want one persistent voice.
- User asks to recreate a creator's delivery for a script (with consent / authorized use only — see ETHOS principle 8).

## When NOT to use

- User already has a voice clone — skip to `add-voiceover-to-video` with the existing `voice_id`.
- The sample video has heavy background music / multiple speakers / phone-call quality. IVC will train on noise. Tell the user to provide a cleaner clip.
- Sample is < 10 seconds. ElevenLabs IVC will accept it but quality drops sharply. Push back.

## Cost

- ElevenLabs IVC clone: included in any paid tier (Starter / Creator / Pro). $0 incremental per clone.
- Voice slots are limited per plan (Starter: 10, Creator: 30, Pro: 160). If `voices/add` returns 400 with a slot-limit error, surface that and ask the user to delete an old voice.

## Pipeline

1. **Validate `ELEVENLABS_API_KEY`.** If missing, stop and link `https://elevenlabs.io/app/settings/api-keys`.

2. **Validate the input video.** Run `ffprobe` to confirm it has an audio stream and the duration is ≥ 10s. If duration is < 30s warn the user that quality will be lower than recommended (ElevenLabs recommends 30s–3min of clean speech for IVC).

3. **Extract audio** with ffmpeg. Mono, 44.1kHz, MP3 128kbps is plenty for IVC and keeps the upload small:

   ```sh
   ffmpeg -y -i <video> -vn -ac 1 -ar 44100 -c:a libmp3lame -b:a 128k <out>/voice-sample.mp3
   ```

4. **Upload + clone** via `POST https://api.elevenlabs.io/v1/voices/add`:

   ```sh
   curl -s -X POST "https://api.elevenlabs.io/v1/voices/add" \
     -H "xi-api-key: $ELEVENLABS_API_KEY" \
     -F "name=<descriptive-name>" \
     -F "description=<provenance: source file path or URL + sample length>" \
     -F "files=@<out>/voice-sample.mp3"
   ```

   Response: `{"voice_id": "...", "requires_verification": false}`. If `requires_verification: true`, the source audio matched ElevenLabs' professional-clone catalog — surface to user for resolution.

5. **Persist** the result. Write `<out>/voice.json`:

   ```json
   {
     "voice_id": "...",
     "name": "...",
     "source_video": "<absolute path to input>",
     "sample_duration_seconds": <number>,
     "created_at": "<ISO 8601>"
   }
   ```

6. **Return** the `voice_id` to the user. Suggest the natural next step: `add-voiceover-to-video` with this voice ID + a script + a target video.

## Naming convention

Use a name that includes the source provenance and a date so future-you can tell two clones apart in the ElevenLabs dashboard:

```
<short-handle>-<YYYY-MM-DD>
e.g. max-rundown-2026-04-29, jane-podcast-2026-05-12
```

## Output directory

Per ETHOS principle 7, all artifacts land in `CWD/clone-voice-from-video-<timestamp>/`:

```
clone-voice-from-video-2026-05-03T14-35-00/
├── voice-sample.mp3
└── voice.json
```

## Hard-won learnings

1. **The longer the clean sample, the better.** A 21s clip works but the clone sounds "thin" on long sentences. A 3-minute clip from the same speaker produces noticeably more natural prosody on the same downstream TTS calls. When the user has both options, prefer the longer one.

2. **MP3 128kbps mono is enough.** No measurable quality difference in IVC outcome between 128kbps mono and 320kbps stereo, and the upload is ~4× smaller / faster.

3. **ElevenLabs payment failures masquerade as 200 OK.** The `voices/add` endpoint will succeed (returns a `voice_id`) even if the account has a failed invoice — but the very next TTS call returns `{"detail":{"status":"payment_issue"}}`. If the next step (TTS) errors, point the user at `https://elevenlabs.io/app/subscription`.

4. **Don't pass video files directly to `voices/add`.** ElevenLabs accepts a multipart `files=@...` with audio MIME types. MP4 will sometimes work, sometimes 400. Always extract to MP3/WAV first.

5. **Provenance in the description field.** Future you (or the user) will look at the ElevenLabs voice library a month later and want to know where this clone came from. The skill writes the source video path into the voice description automatically — don't strip it.

## Reference run

EP-01 Bloom Greens used this skill in two passes:

- **Attempt 1:** 21s sample (`~/Downloads/7622121697906396447.mp4`) → `voice_id: AyP6wmJFa9fpkea2m0QX`. Usable but thin on the closing line.
- **Attempt 2:** 3:20 sample (`~/Downloads/7626063909715184927.mp4`) → `voice_id: lFGbjNWc9mbcFqOEMwq3`. Noticeably richer prosody. This is the one that shipped.

Lesson banked into the "longer sample wins" learning above.
