---
name: b-roll-ugc
description: Generate a 15s UGC b-roll-style social ad from any product PDP URL via Higgsfield Marketing Studio. Pipeline ingests the URL, pulls Kalodata research on what's already winning for the product, generates with a hardened prompt template, polls to completion, and runs VidJutsu critic as a QA gate. Use when the user wants a Higgsfield UGC video, a Marketing Studio video, or a b-roll-style social spot for a specific product URL.
requires:
  env:
    - VIDJUTSU_API_KEY
  mcp:
    - claude.ai Higgsfield (show_marketing_studio, generate_video, job_status)
  skills:
    - kalopilot (for the Kalodata research step)
---

# b-roll-ugc

Produce a single 15s 9:16 UGC b-roll video for any product PDP URL Higgsfield Marketing Studio can ingest. Visual-only by default — voiceover and captions are layered post-production via ElevenLabs and ZapCap, never burned in by the model.

## When to use

- User shares a product PDP URL and wants an ad/UGC video.
- User mentions "Higgsfield UGC", "Marketing Studio video", or "b-roll for [product]".
- Building a series of ad creatives for a brand.

## When NOT to use

- User wants a multi-shot character-driven narrative → use `director` instead.
- User wants pure product b-roll with zero person on screen → switch the `mode` to `Hyper Motion` (still works with this skill, see Modes section).

## Pipeline (run sequentially)

1. **Ingest the product** via Higgsfield MCP `show_marketing_studio` with `type=product` and the user's URL. Verify `status: completed` in the response. **If `status: failed`, stop immediately and tell the user the URL could not be ingested by Higgsfield Marketing Studio — ask them to provide a different link that the scraper can handle.** Do not attempt workarounds or retries; this is a hard requirement.

2. **Run Kalodata research** via the `kalopilot` skill. Send a query like:
   > For US TikTok Shop product ID `<numeric_id>` (or brand/keyword if not on TikTok Shop), find the top 5 highest-GMV creator videos in the last 30 days. For each: GMV, views, length, and a one-sentence description of the format/hook. Then summarize the single winning format pattern in one paragraph.

   Use the result to inform the script's hook, b-roll vocabulary, and pacing.

3. **Generate the video** via Higgsfield MCP `generate_video` using the prompt template below.

4. **Poll** `job_status` with `sync: true` until status is terminal (`completed`, `failed`, or `nsfw`). Marketing Studio video typically takes 3–5 minutes.

5. **QA gate via VidJutsu critic** — POST `https://api.vidjutsu.ai/v1/watch` with the rendered `rawUrl` and a prompt that checks: any speaking mouth, any spoken audio, any burned-in captions, product flavor accuracy, anatomy artifacts. Require a 1–10 score and pass/fail.

6. **Refine if score < 8** — tighten the negative prompt or pin the avatar more aggressively, then retry once. If a second attempt still fails, surface to the user rather than burning more attempts.

## Defaults

| Param | Default | Notes |
|---|---|---|
| `model` | `marketing_studio_video` | only model that supports URL-driven product entities |
| `mode` | `UGC` | switch to `Hyper Motion` for pure product b-roll, no person on screen |
| `aspect_ratio` | `9:16` | TikTok / Reels / Shorts native |
| `duration` | `15` | sweet spot from Kalodata top-performer data; matches 11–45s winning band |
| `avatars` | `[{"id": "cd6fb78c-e1a2-42f1-8b1e-902c15511877", "type": "preset"}]` | Valentina (female) — pinned to prevent server defaulting to Stefan (male). Override only when user requests a different avatar. |
| `generate_audio` | omit | Server flips this to `true` on UGC mode regardless. Don't fight it; control via negative prompt instead. |

## Prompt template

```
Phone-camera UGC vertical 9:16, 15 seconds, candid morning [setting] vibe, soft natural daylight, warm wellness aesthetic.

A young woman quietly prepares and holds her [PRODUCT NAME] — [SKU/flavor/variant]. She makes eye contact with the camera throughout but never speaks — confident, easy smile, mouth closed and relaxed.

Shot 1 (0-3s): medium shot of her in the [setting] looking directly at the camera, the [PRODUCT NAME] held in front of her chest with both hands, label facing forward.

Shot 2 (3-6s): cuts to close-up of her hands [doing the product action — scooping, pouring, opening], [color/texture detail].

Shot 3 (6-9s): back to her — she lifts the [product/result] beside her face, looks at camera with a small confident smile, gives a subtle 'cheers' nod.

Shot 4 (9-12s): close-up of her hand [secondary product detail — twisting cap, sealing, smoothing] against the [surface] background.

Shot 5 (12-15s): final medium shot — she stands by the window holding the closed [PRODUCT NAME] at chest height with one hand, [secondary prop] in the other, looking softly at the camera, lips closed in a slight smile.

Phone-camera UGC realism, slight grain, natural daylight color.

Negative: no speaking, no mouth open, no mouth moving, no talking, no dialogue, no voiceover, no spoken audio, no music, no soundtrack, no burned-in caption text, no on-screen typography, no subtitles, no logo overlays, [SKU-specific exclusions — e.g. "no mango flavor, no yellow powder, no orange powder"].
```

**Variables to fill:**
- `[PRODUCT NAME]` — full SKU as it appears on the tub/box
- `[SKU/flavor/variant]` — explicit, the variant being shot (e.g. "Strawberry Kiwi (pink powder)")
- `[setting]` — kitchen, bathroom, bedroom, living room
- `[product action]` — scoop into shaker, twist open, pour, etc.
- `[secondary prop]` — what else lives on the counter (glass of water, journal, fresh fruit)
- `[SKU-specific exclusions]` — every flavor/variant that exists in the product entity that we are NOT shooting today

## Modes

| Mode | Use when | Avatar |
|---|---|---|
| `UGC` | Default. Female creator on camera, hands and face visible, never speaking. | Pin Valentina (`cd6fb78c-...`) |
| `Hyper Motion` | Pure product b-roll, no person ever on screen. | Server still attaches one but it won't appear in shots. Override prompt to "no person, hands only" or "no humans at all." |

## Hard-won learnings

These are the failure modes that this skill prevents. Keep them in mind when overriding defaults.

1. **Higgsfield server flips `generate_audio: true` on UGC mode regardless of input.** You cannot disable audio via param. Control audio via negative prompt only: "no voiceover, no music, no spoken audio."

2. **Marketing Studio paraphrases burned-in caption text and hallucinates voiceover dialogue.** Never ask the model to render specific caption strings or recite a specific script — it will produce gibberish ("Done untknohy", "Doris igery labring baal.pak") and unrelated VO ("she's married in France"). Always do captions and voiceover in post-production via ZapCap (`editor-captions` skill) and ElevenLabs.

3. **Pin the avatar.** If you don't pass `avatars`, the server defaults to whichever preset it picks — including male avatars like Stefan when you wanted a female creator. Always pin explicitly.

4. **Lock the SKU/flavor in BOTH positive and negative.** Product entities often have multiple SKU images (e.g. one tub has Strawberry Kiwi pink AND Mango yellow). Without explicit locking, the model may scoop pink in shot 2 and hero a Mango tub in shot 5. State the target flavor in the positive prompt AND list every other flavor in the negative.

5. **Marketing Studio scrape can fail on some PDPs.** If `show_marketing_studio` returns `failed`, tell the user the URL is not ingestable and ask for a different link. Don't try to fix it programmatically.

6. **VidJutsu critic on every render.** No exceptions. Marketing Studio passes look completely fine in JSON metadata but the actual MP4 may have hallucinated audio, gibberish text, or flavor mismatch. The critic catches this in seconds — cheaper than a wasted post-production session.

## Reference run

Job `00515168-6ca3-456d-8230-919f0a844b32` — Bloom Nutrition Greens (Strawberry Kiwi). Scored 10/10 on VidJutsu critic. Avatar: Valentina pinned. Mode: UGC. Use as the canonical example when validating future generations from this skill.
