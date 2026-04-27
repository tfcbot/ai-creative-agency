---
name: generate-video
description: Generate one AI video from an idea. Walks the user from rough concept → refined prompt → model pick (Seedance 2.0, Kling 3.0, or Sora 2) → final MP4 via Wavespeed.
requires:
  env:
    - WAVESPEED_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# generate-video

The base video skill. Use it standalone for one-off clips, or as a
building block under more specific skills (`/clone-ad`,
`/wide-cam-podcast`, `/generate-talking-head`). The skill's job is to
turn a rough idea into a finished MP4 — refining the prompt and
picking the right model along the way.

## Providers

- **Wavespeed** — pull `https://wavespeed.ai/docs` for the current API surface; model-specific endpoints under `https://wavespeed.ai/docs/docs-api/...` (e.g. `bytedance/bytedance-seedance-2.0-image-to-video`, `kwai/kling-v3-pro`, `openai/sora-2`)

## Pick the model

| Model | Best for | Trade-off |
|---|---|---|
| **Seedance 2.0** | UGC ads, talking-heads, multi-cut social videos. Native audio generated from prompt text. Up to ~15s. | Prompt must use explicit `CUT. SHOT N:` blocks — narrative beats produce flat single-take output. |
| **Kling 3.0** | Character continuity, lip-sync from reference image, longer cinematic clips. | No native audio — pair with `/clone-voice` + `/swap-voice` if dialogue is needed. |
| **Sora 2** | Complex multi-element scenes, hyperrealistic environments, "wow factor" hero shots. | Slowest and most expensive. Reach for it when Seedance and Kling can't deliver the idea. |

**Default:** Seedance 2.0 for social, Kling 3.0 for character-driven
content, Sora 2 only when the idea forces it.

## Steps

1. **Capture the idea.** Ask the user for: subject/concept, what
   should happen on screen, desired length, target platform (TikTok /
   IG Reels / YouTube → aspect ratio), and whether they have a
   reference image to use as a starting frame.
2. **Refine the prompt.** Rewrite the idea into a model-appropriate
   structured prompt:
   - **Seedance 2.0** → shot list with `CUT. SHOT N:` blocks naming
     framing, angle, movement, location, action, and dialogue per shot.
     Aim for 4–5 cuts per 10s for UGC energy.
   - **Kling 3.0** → character description + scene + camera move +
     duration. Reference image carries identity.
   - **Sora 2** → environment + subject + action + style + camera.
     Less rigid structure than Seedance; closer to a paragraph.
   Read the refined prompt back to the user and iterate before any
   provider call.
3. **Pick the model** from the table above.
4. **Set the params.** Aspect ratio (`9:16` TikTok/IG, `1:1` Meta
   static, `16:9` YouTube), resolution (`480p` for authentic-looking
   social, `720p`+ for higher fidelity), duration, native audio
   on/off (Seedance only).
5. **Generate.** Call Wavespeed's image-to-video endpoint if a
   reference image was provided, otherwise text-to-video. Poll the
   job until done, download the MP4 to
   `CWD/generate-video-<timestamp>/clip.mp4`.
6. **Show the user the result** and offer to regenerate with prompt
   or model adjustments. Save the final prompt alongside the MP4.

## Input

- Idea (subject, action, scene)
- (optional) Reference image for image-to-video
- Target platform / aspect ratio
- Duration

## Output

- MP4 at `CWD/generate-video-<timestamp>/clip.mp4`
- Wavespeed-hosted URL (valid ~7 days) printed for quick preview
- The final prompt saved alongside the MP4 for iteration

## Common failure modes

- **Flat single-take Seedance output** — prompt described narrative
  beats, not shots. Rewrite with explicit `CUT.` markers.
- **Kling identity drift** — reference image angle was too dynamic.
  Use a clean 3/4 profile starting frame.
- **Sora burn rate** — defaulted to Sora when Seedance would have
  worked. Always justify Sora before reaching for it.
