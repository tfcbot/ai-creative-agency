# Recipe 02 — Design the carousel

## Goal

Decide the carousel's structure: how many slides, what each slide does, the hook, the body sequence, the CTA. Lock content decisions before writing any JSON specs.

## Steps

1. Read `references/format-grammar.md` to confirm the slide-count default for the chosen format.

2. Decide the **slide count** (default: 7):
   - 1 cover
   - N body slides (one per item / step / detail / comparison case)
   - 1 closer

3. Write the **cover headline** — short, hook-driven, fits the format:
   - Format 1 (comparison): `<Tool A> vs <Tool B>` or `<X> or <Y>?`
   - Format 2 (workflow): `How to use <X> for <Y>`
   - Format 3 (reveal): `This is <X>` (with X italicized)
   - Format 4 (asset launcher): `Generate AI <thing> for your <vertical>`
   - Format 5 (listicle): `<N> <topic>`
   - Format 6 (product): `the <object>`

   Keep it ≤ 4 words for big sans treatment, with one italic accent word.

4. Write the **body slide list**. Each body slide is one item. Decide:
   - The naming word (one word per slide — `Skin`, `Eyes`, `Step 1`, `Use case A`)
   - The 3–5 bullet directives (or the comparison pair, the step text, the prompt template — depending on format)
   - Whether each slide gets the same casting or rotates models

5. Write the **closer**:
   - Format 5 default: comment-bait card with `Comment "<KEYWORD>" and get the <resource>`
   - Format 1 default: a recommendation pill on top of one of the comparison subjects
   - Otherwise: a soft CTA pill (`SAVE THIS →`, `FOLLOW FOR MORE →`)

6. Write the carousel structure into `plan.md` as a table:

   ```
   | slide | id                    | role         | naming word | bullets / content        |
   | 1     | slide_1_cover         | Hook         | <italic>    | headline + CTA pill      |
   | 2     | slide_2_<topic>       | Body         | Skin        | 4 bullets                |
   | 3     | slide_3_<topic>       | Body         | Eyes        | 4 bullets                |
   | …     |                       |              |             |                          |
   | N     | slide_N_closer        | Closer       | —           | comment-bait CTA         |
   ```

7. Decide on:
   - **Casting strategy** — same model across all slides, or different model per slide for variety
   - **Color palette** — text color (white / dark navy), backdrop palette, single accent
   - **Logo lockup wordmark** — three short words, the brand name in three lines
   - **Single-italic-word motif** — one italic-serif word per headline; everything else heavy bold sans

8. Get user approval on the table + casting + palette before writing any JSON specs.

## Output

```
plan.md   (carousel structure table + casting + palette + lockup decision)
```

## Done when

- The slide table is locked
- Cover headline, body slide naming words, body bullets, and closer CTA are all written out
- Casting strategy and palette are decided
- The user has approved the design before any slide spec is written

## Next

→ `recipes/03-write-slide-specs.md`
