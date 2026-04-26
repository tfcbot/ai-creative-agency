# Recipe 03 — Write slide specs

## Goal

Produce one JSON spec per slide at `scenes/slide_<N>_<role>.json`. These specs are the source of truth — gpt-image-2 reads them via the flattener, and any regeneration starts from them.

## Steps

1. Read `references/slide-spec.md` to internalize the schema.

2. Read `references/typography-rules.md` carefully — the typography string is the most failure-prone part of each spec.

3. For each slide in the table from `plan.md`:

   a. Copy the cover-slide template from `references/slide-spec.md` and fill in:
      - `id` — matches the filename
      - `subject.description` — full identity, body details, clothing, accessories
      - `pose` — head turn, hands, posture
      - `environment` — backdrop, props (or "no props")
      - `camera` — perspective, lens, depth of field
      - `lighting` — direction, quality, shadows
      - `mood_and_expression` — emotional read
      - `style_and_realism`, `colors_and_tone`, `quality_and_technical_details` — usually shared across the carousel
      - `aspect_ratio_and_output` — `4:5` and a per-slide framing note (where the headline lands)

   b. Write the `typography` string per `references/typography-rules.md`. For body slides include exact bullet text. For comment-bait closers include the keyword inside a bordered pill.

   c. Copy the canonical `negative_prompt.forbidden_elements` from the schema reference. Add any slide-specific negatives (e.g. for held-card slides, add `text on the prompt card other than the word <X>`).

4. **Cross-check across slides.** Open all the JSONs side by side and verify:
   - Logo lockup wording is identical in every `typography` string
   - Logo lockup position is identical (top-center vs top-left)
   - Text color is identical
   - The single-italic-word motif appears exactly once per headline
   - Wardrobe palette is consistent across slides if using rotating casting

5. **Have the user review the specs before generation.** Show a compact summary table in chat:

   ```
   | slide | model casting | macro/portrait | headline word | bullets |
   ```

   Iterate on copy until approved. Saves regeneration credits later.

## Output

```
scenes/
├── slide_1_cover.json
├── slide_2_<topic>.json
├── …
└── slide_N_closer.json
```

## Done when

- Every slide has a complete JSON spec
- The typography string in each spec passes the rules in `references/typography-rules.md`
- The user has approved the spec table before any generation runs

## Next

→ `recipes/04-generate-slides.md`
