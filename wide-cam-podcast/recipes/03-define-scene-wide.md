# Recipe 03 — Define the wide 2-shot and generate the anchor frame

## Goal

Produce one JSON spec at `scenes/podcast_lounge_wide.json` and one rendered PNG at `frames/podcast_lounge_wide.png`. This frame is **the most important asset in the project** — every Seedance clip uses it as the reference image. Get it right before generating any clips.

## Steps

1. Read `references/scene-spec.md` for the schema and the canonical example. Use that example as your starting template.

2. Edit the scene JSON to match your two characters:
   - Copy each character's full visual description from `characters/*.json` into the scene's `subject.description`.
   - Set Host A on the LEFT, Host B on the RIGHT.
   - Use the open-V seating: ~30° toward camera on each, mirrored.
   - Reuse the `negative_prompt.forbidden_elements` block from the canonical example. Don't trim it — it's load-bearing.

3. Generate the wide via Wavespeed gpt-image-2 (read `references/wavespeed-gpt-image-2.md`):
   - Flatten the scene JSON into a prompt
   - POST with `aspect_ratio: "16:9"`, `resolution: "2k"`, `quality: "high"`
   - Poll, download, save to `frames/podcast_lounge_wide.png`

4. **Inspect ruthlessly.** This frame is reused in every clip — any artifact carries through:
   - Both hosts visible at opposite ends, not side by side
   - Open-V geometry — both angled toward camera, not full profile, not full front
   - Hands all have five anatomically correct fingers
   - Coffee table front edge visible in the lower foreground
   - Two mics on slim arms (not heavy boom arms)
   - Background plaster wall (or chosen feature wall) holds across the full width
   - No corporate background props (acoustic foam, brick wall, dark wooden geometric panel)
   - Wardrobe matches characters/*.json verbatim

   If any item fails, regenerate. Iterate until the wide is publishable on its own as a still.

## Alt path — Nano Banana 2 for the wide

For the wide specifically, Nano Banana 2 often produces stronger spatial coherence with two characters than gpt-image-2. If the gpt-image-2 wide keeps positioning the hosts side by side instead of across the open-V, switch to Nano Banana 2 (`references/gemini-nano-banana-2.md`) for this one frame at 4K.

## Output

```
scenes/podcast_lounge_wide.json
frames/podcast_lounge_wide.png
```

## Done when

- The wide passes inspection
- The user has approved the wide explicitly (it's the brand's signature set; lock it before scaling)

## Next

→ `recipes/04-define-clips.md`
