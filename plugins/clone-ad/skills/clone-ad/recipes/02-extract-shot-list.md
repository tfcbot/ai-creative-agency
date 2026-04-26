# Recipe 02 — Extract the shot list

## Goal

Run the reference through Gemini and produce a structured shot list at `reference/shot-list.json`.

## Steps

1. Read `references/gemini-video-analysis.md` for the upload paths and `references/shot-list-spec.md` for the schema.

2. Pick the upload path:

   - **Local MP4** → upload via the Files API (resumable), capture the returned `file.uri`
   - **YouTube URL** → skip upload, pass the URL as `fileData.fileUri` directly

3. Build the analysis request. The prompt body should:

   - Describe every field of the schema in `references/shot-list-spec.md`
   - Insist on the controlled vocabulary for `framing`, `angle`, `movement`
   - Insist that `total_shots` reflects actual visible cuts, not narrative beats
   - Set `responseMimeType: "application/json"` in `generationConfig` to force clean JSON

4. POST to `gemini-2.5-flash:generateContent` and parse the response.

5. Sanity-check the JSON:
   - Does `total_shots` look right? (Eyeball-count cuts in the reference — should match within 1)
   - Does `shots[]` have entries with non-empty `framing`, `angle`, `movement` from the controlled vocabulary?
   - Does `creator` describe a single on-camera person?
   - Does `audio.pacing` match how it sounds?

   If any field is empty or wrong, re-run with a tighter prompt. Don't proceed to step 3 with a broken shot list — every downstream step depends on it.

6. Save the JSON to `reference/shot-list.json`.

7. Summarize for the user in chat:
   - Total shots and density (`shots_per_10s`)
   - Cut style
   - Creator description
   - Hook structure
   - The shot-by-shot table (`n`, `framing`, `angle`, `movement`, `location`)

## Output

```
reference/shot-list.json
```

## Done when

- Gemini returned a complete JSON matching the schema
- `total_shots` and `shots_per_10s` are populated correctly
- The user has reviewed the shot list summary in chat

## Cost

- ~$0.01 per 15s reference
- ~30–60 seconds wall time including upload

## Caching

`shot-list.json` is the canonical analysis. Don't re-run unless:
- The reference changes
- The first analysis was clearly broken (empty shots, wrong vocabulary)

Even when the user wants different clone variants, you reuse the same `shot-list.json`. Variants come from rewriting in step 4, not re-analyzing the reference.

## Next

→ `recipes/03-generate-product-image.md`
