# 04 — Generate slides

Submit every slide spec to Wavespeed gpt-image-2 in parallel. Poll until each completes. Save outputs to `frames/`. Handle the safety filter when it fires.

## Endpoint

```
POST https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image
Authorization: Bearer $WAVESPEED_API_KEY
```

See `references/wavespeed-gpt-image-2.md` for the request body, polling endpoint, and output dimensions.

## Steps

1. **Flatten each spec into a prompt.** Use the labeled-section pattern from `references/wavespeed-gpt-image-2.md`. Include the typography string verbatim. Pass `forbidden_elements` joined by commas as `negative_prompt`.
2. **Submit all slides in parallel.** Wavespeed handles concurrent submissions cleanly. A 7-slide carousel typically completes in 1–2 minutes wall time when fired in parallel.
3. **Capture every task ID.** Don't lose them — if your poll loop dies you'll need to re-poll the existing tasks rather than re-submitting (wastes credits).
4. **Poll each task every ~2 seconds** until status is `completed` or `failed`.
5. **On `completed`:** download `outputs[0]` (a CloudFront PNG URL) to `frames/slide_<N>_<role>.png`. Output dimensions are 1824×2288 native — no post-crop needed.
6. **On `failed` with `error: "Content flagged as potentially sensitive"`:** rewrite that one spec with safer wording, resubmit, continue. See "Content moderation" below.
7. **On `failed` with any other error:** retry the same submission once (transient). If it fails twice, the prompt has a problem — usually the typography section is too dense. Tighten and resubmit.

## Parallelism gotcha

Use independent error handling per slide. If you wrap all polls in a single `Promise.all` and one slide fails, the others are abandoned mid-flight (you can't recover them without re-polling by task ID). Either:

- Use `Promise.allSettled` and recover failures individually, OR
- Track task IDs in an array, run a tolerant poll loop that retries failures, and only resubmit the specific failed spec

The first approach is simpler. The second is cheaper if you've already burned credits.

## Content moderation

gpt-image-2's safety filter is opinionated. Common triggers when cloning a beauty/lifestyle reference:

- "Bare legs" / "tiny shorts" / "bedroom" combinations
- Overt skin exposure descriptions even on non-explicit subjects
- "Wet hair" + "shower" combinations
- Product references that the model thinks are weapons / drugs / restricted

When a slide gets flagged:

1. Read the spec for the trigger phrase. Usually one or two words.
2. Rewrite the spec with safer wording. Examples that have shipped:
   - "tiny black shorts and bare legs" → "loose blue jeans and white sneakers"
   - "wet hair sticking to her face" → "freshly washed hair, slightly damp at the ends"
   - "bedroom mirror" → "hallway mirror" or "full-length mirror in a minimalist room"
3. Add `nudity` and `suggestive` to the negative prompt.
4. Resubmit. Don't fight the filter. The 30-second rewrite is cheaper than a deep argument with the model.

## Quality check before moving on

After all slides are saved, look at every PNG. Specifically:

- **Cover headline:** spelled correctly, all lines present, accent word in the right color, brand mark visible
- **Body slides:** no hallucinated text or logos sneaking in
- **Closer headline:** spelled correctly, CTA keyword visible, pill or outlined-box treatment intact
- **Faces and hands:** no extra fingers, no warped anatomy, no uncanny eyes (most common failure mode in beauty UGC)

If any slide fails the check, regenerate just that one — don't re-fire the whole carousel. See `references/wavespeed-gpt-image-2.md` for the regen pattern.

## Output

```
clone-carousel-<ts>/frames/
├── slide_1_cover.png
├── slide_2_<topic>.png
├── …
└── slide_<N>_closer.png
```

Plus a log of task IDs in `wavespeed-tasks.json` so you can re-poll if needed:

```json
[
  { "id": "slide_1_cover", "taskId": "...", "outputUrl": "..." },
  …
]
```

## Cost

~$0.02 per slide at 2K, 4:5, quality high. A 7-slide carousel is ~$0.14, plus ~$0.02 per regenerated slide.
