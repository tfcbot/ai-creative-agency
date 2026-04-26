# Recipe 01 — Research the format

## Goal

Identify the visual format pattern your carousel will follow. Pull data from a reference account in the user's niche, classify the format(s) they use, and pick one to replicate (in grammar, not in content).

## Steps

1. Read `references/format-grammar.md` to internalize the 6 recurring formats.

2. Ask the user (or decide from context):
   - The niche or topic for the carousel
   - A reference account in that niche they admire
   - The CTA mechanic they want at the end (comment-bait / follow-bait / link-in-bio)

3. Pull the reference account's profile and recent posts:

   ```
   GET https://api.scrapecreators.com/v1/instagram/profile?handle=<handle>
   GET https://api.scrapecreators.com/v1/instagram/user/posts?handle=<handle>
   ```

   Save responses to `research/posts.json`.

4. Filter to carousels (`__typename === "GraphSidecar"`) and rank by engagement (likes + comments). Drop the top 5–7 carousels into a summary table:

   ```
   | shortcode | slides | likes | comments | caption first 100 chars |
   ```

5. For each top carousel, fetch the full post detail and download slide 1 (cover) plus slide 2 (first body slide):

   ```
   GET https://api.scrapecreators.com/v1/instagram/post?url=https://www.instagram.com/p/<shortcode>
   ```

   Save responses to `research/post_<shortcode>.json` and download cover + body images to `research/images/`.

6. Inspect the images visually. Match each carousel to one of the 6 formats in `references/format-grammar.md`. Document:
   - Which format(s) the account uses most
   - The visual constants (logo lockup style, headline typography, single-italic-word motif, CTA style, color palette)
   - The body-slide layout pattern

7. Pick one format for the user's carousel based on:
   - Match between the format's strength and the user's content angle
   - The format with simpler casting (fewer subjects, fewer props) for easier regeneration
   - What's been working in the niche vs. what could differentiate

## Output

```
research/posts.json
research/post_<shortcode>.json   (one per carousel inspected)
research/images/<shortcode>_s<N>.jpg
plan.md                          (which format was chosen + why)
```

## Done when

- The chosen format is documented in `plan.md` with a one-line rationale
- The visual constants the carousel will inherit (logo lockup, headline type, CTA style, palette) are listed in `plan.md`
- The user has confirmed the format choice before any slide is designed

## Constraints

- Do NOT reproduce competitor copy, headlines, or imagery in your generated slides. Use the research to identify the **format grammar** only — write your own content from scratch.
- Do NOT use a competitor's wordmark or brand name in any slide of the user's carousel.

## Next

→ `recipes/02-design-the-carousel.md`
