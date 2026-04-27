---
name: generate-image
description: Generate one AI image from an idea. Walks the user from rough concept → refined prompt → model pick (Nano Banana 2 or GPT-Image 2) → final PNG via Wavespeed.
requires:
  env:
    - WAVESPEED_API_KEY
homepage: https://github.com/tfcbot/ai-creative-agency
source: https://github.com/tfcbot/ai-creative-agency
---

# generate-image

The base image skill. Use it standalone for hero shots, character
reference sheets, thumbnails, or product photos — or as a building
block (start frame for `/generate-video`, slide for
`/generate-carousel`). The skill's job is to turn a rough idea into a
finished PNG, refining the prompt and picking the right model along
the way.

## Providers

- **Wavespeed** — pull `https://wavespeed.ai/docs` for the current API surface; model-specific endpoints under `https://wavespeed.ai/docs/docs-api/...` (e.g. `bytedance/bytedance-nano-banana-2`, `openai/gpt-image-2`)

## Pick the model

| Model | Best for | Trade-off |
|---|---|---|
| **Nano Banana 2** | Hyperrealistic product photos, characters, lifestyle scenes. Strong identity lock from reference image. | Weak at typography — keep on-image text minimal (logos, short wordmarks only). |
| **GPT-Image 2** | Reliable in-image typography. Carousels, slides, infographics, posters, thumbnails with words. | Less photorealistic — visible "AI illustration" aesthetic on faces and skin. |

**Rule of thumb:** if the image needs words baked in, use GPT-Image 2.
Otherwise Nano Banana 2.

## Steps

1. **Capture the idea.** Ask the user: what's the subject, what's the
   scene/setting, what's the angle/framing, what's the deliverable
   (e-commerce listing, video starting frame, slide), and what's the
   target aspect ratio.
2. **Refine the prompt.** Rewrite the idea into a model-appropriate
   structured prompt:
   - **Nano Banana 2** → `Hyperrealistic photo: [subject] in [setting],
     [framing — e.g. 3/4 profile], [lighting — e.g. softbox above
     left], [aspect].` 3–5 specific material/shape callouts; more and
     the model averages.
   - **GPT-Image 2** → `[Composition]: [subject] with text "[exact
     text]", [layout], [style].` Quote the exact text to bake in.
   Read the refined prompt back to the user and iterate before any
   provider call.
3. **Pick the model** from the table above.
4. **Set the params.** Size / aspect ratio (`1024*1024` square,
   `1024*1792` 9:16, `1792*1024` 16:9), number of variations.
5. **Generate.** Call the chosen Wavespeed endpoint, download the
   PNG(s) to `CWD/generate-image-<timestamp>/`.
6. **Show the user the result** and offer to regenerate or adjust.
   Save the final prompt alongside the PNG.

## Input

- Idea (subject, scene, framing)
- (optional) Reference image for identity lock (Nano Banana 2)
- Aspect ratio / size
- (optional) Exact in-image text (GPT-Image 2)

## Output

- PNG(s) at `CWD/generate-image-<timestamp>/`
- Wavespeed-hosted URL(s) printed for reuse (e.g. as `image` input to
  `/generate-video`)
- The final prompt saved alongside the PNG for iteration

## Common failure modes

- **Stylized / cartoony Nano Banana output** — prompt didn't anchor
  the model. Add "hyperrealistic" + "photograph".
- **Garbled GPT-Image 2 typography** — the text wasn't quoted, or it
  was too long. Quote exact characters; cap at ~6 words per line.
- **Background bleeding into product** — add "cutout on seamless
  white background, no reflections" for Nano Banana product shots.
