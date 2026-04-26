# Clip JSON spec (Seedance 2.0 text-to-video block)

One clip = one ~15s dialogue block. One JSON file per clip at `clips/block_<N>.json`. The Seedance call uses this file directly.

## Required keys

```json
{
  "id": "block_1",
  "model": "bytedance/seedance-2.0/text-to-video",
  "aspect_ratio": "16:9",
  "resolution": "720p",
  "duration_seconds": 15,
  "reference_image": "../frames/podcast_lounge_wide.png",
  "dialogue": {
    "host_a": "<one short conversational question>",
    "host_b": "<the reply / teaching moment>"
  },
  "prompt": "<one paragraph describing the locked static wide shot, the two hosts in detail, and the ACTION block with the dialogue quoted verbatim>",
  "negative_prompt": "<comma-separated forbidden elements>"
}
```

## Prompt structure that works

This shape produced a clean 60s ad with consistent characters across four blocks:

> Locked static wide shot in [WARM CREATOR-LOUNGE PODCAST STUDIO]. Two hosts seated in [matching tan bouclé armchairs in an open-V arrangement across a low cream-stone coffee table]. Both are angled roughly 30 degrees toward the camera but facing each other, not looking at the lens. The camera does not move — fully static, tripod-locked, no push, no zoom, no pan. Host A (LEFT): [full visual description repeated verbatim across all blocks]. Host B (RIGHT): [full visual description repeated verbatim across all blocks]. Coffee table between them holds [mics, mugs, props described once]. Background: [feature wall, shelves, pendant, plant — described once]. Warm ambient creator-lounge lighting, moody but clean.
>
> ACTION: Host A speaks first, looking at Host B with [emotional cue] — she says: '[exact line in single quotes]' Brief beat of eye contact. Host B then answers with [emotional cue], [body language detail] — he says: '[exact line in single quotes]'.
>
> Both hosts remain seated in their chairs the entire time. Natural conversational micro-movements, accurate lip-sync to each spoken line, both faces clearly readable throughout. Native audio — clean dialogue, quiet lounge room tone, no background music, no sound effects. Hyper-realistic skin texture, no plastic smoothing, consistent wardrobe and setting from start to end, identical continuity with the previous blocks.

## Canonical negative prompt

Reuse this verbatim for every block — it tells Seedance to hold the wide and the wardrobe steady:

```
camera pans, camera zoom, camera push-in, camera pull-out, handheld shake,
cut to close-up, multiple shots, split screen,
hosts looking at the camera, hosts breaking the fourth wall,
either host standing up, either host leaving the chair,
wardrobe change, set change, third person in frame, crowd in background,
text on screen, captions, subtitles, logos, wordmarks, watermarks, neon signs,
dark-stained wood geometric diamond panel, brick wall, acoustic foam pyramids,
background music, sound effects, voiceover,
distorted hands, extra fingers, missing fingers, morphing clothes, floating limbs,
plastic airbrushed skin, beauty filter
```

## Field guidance

- `id` — `block_1` through `block_N`. Match the filename.
- `model` — always `bytedance/seedance-2.0/text-to-video`.
- `aspect_ratio` — always `16:9`.
- `resolution` — start at `720p`. Bump to `1080p` only if you plan to do digital punch-ins in the edit (cropping into the frame).
- `duration_seconds` — Seedance accepts 4–15. Use `15` for any conversational block. Shorter than 12s rushes the dialogue.
- `reference_image` — relative path to the wide PNG. The pipeline uploads it to the Wavespeed CDN at gen time.
- `dialogue.host_a` — one short question. Roughly 2 seconds when read aloud.
- `dialogue.host_b` — the answer. Roughly 12–13 seconds when read aloud.
- `prompt` — see structure above. The dialogue lines must appear verbatim inside the ACTION block in single quotes.
- `negative_prompt` — copy the canonical block above unless you have a reason to add to it.

## Block structure for a 4-block ad

```
block_1.json — HOOK         A: "<broad curiosity question>"      B: "<framing answer>"
block_2.json — ACCESSIBILITY A: "<can anyone do it?>"             B: "<yes, here's why>"
block_3.json — USE CASES     A: "<what is it used for?>"          B: "<concrete examples>"
block_4.json — CTA           A: "<how do I start?>"               B: "<your brand name + soft CTA>"
```
