# 02 — Analyze the format

Read the downloaded slides and write the format rules. This is the load-bearing step. Get this right and step 3 is fill-in-the-blanks. Get this wrong and your clone won't read as same-format.

## What "format" means

A carousel format is the recurring grammar of the post — what the cover does, what the middle slides hold across them, what the closer does, and how the caption pairs with all of it. Every winning carousel has a format you can write down in five lines.

## Steps

1. **Look at every slide.** Open each `slide_<N>.jpg` and read it like a designer. The Read tool surfaces the image to you visually — use that, not just the accessibility caption.
2. **Categorize each slide by role.** Three roles matter:
   - **Cover (slide 1):** carries the headline, brand mark, and the hook. The most type-heavy slide.
   - **Body / proof (slides 2 through N-1):** hold the same visual rule across all of them. This rule is what gives the carousel continuity.
   - **Closer (slide N):** the CTA. Comment-bait, follow-prompt, save-prompt, or DM-prompt.
3. **Write the cover rule.** Headline placement, headline style (font weight, color, single-color accent word, italic-vs-bold motif), brand mark style and position, photographic subject. Be specific about position — "lower-third overlapping the model's chest" not just "below the subject."
4. **Write the body rule.** What's consistent across slides 2 through N-1? Same lighting style? Same crop tightness? Same camera angle? Same text-on / text-off pattern? Same color palette? In good carousels all middle slides obey 4–6 invariants — list them.
5. **Write the closer rule.** What's the CTA mechanic — comment a keyword, save the post, follow for more, DM the creator? What's the visual treatment — pill shape, outlined keyword box, just bold text? What does the photograph show?
6. **Write the caption pattern.** Read the caption. Length in lines. Hook structure (question / promise / claim). Body structure (proof / explanation / list). CTA structure (matches the closer slide's mechanic). Hashtag count and category mix.
7. **Save it.** Write everything to `clone-carousel-<ts>/format.md` as a clean markdown summary. This is the source of truth for the next step.

## Format.md scaffold

```markdown
# Reference format — @<creator> / <shortcode>

## Cover rule
- Headline: <text content>, <position>, <weight + color + accent treatment>
- Brand mark: <treatment + position>
- Photograph: <subject + scene + camera>

## Body rule (slides 2 to <N-1>)
- Invariant 1: <e.g. all photographed at golden-hour, warm palette>
- Invariant 2: <e.g. no text overlay on any body slide>
- Invariant 3: <e.g. one human subject per slide, shot in selfie / mirror / flatlay POV>
- (etc.)

## Closer rule
- CTA mechanic: <comment-bait / save / follow / DM>
- CTA treatment: <pill / outlined keyword / bold-only>
- Photograph: <subject + scene>

## Caption pattern
- Hook: <one-line description>
- Body: <2–3 sentence structure description>
- CTA: <ask>
- Hashtags: <count + category mix>
```

## What good looks like

Concrete, actionable rules. "Body slides are all photoreal beauty UGC selfies at golden-hour, no text overlay, one female subject, shot 26mm front-camera, warm palette" is a rule you can act on. "Body slides look natural" is not a rule.

## What bad looks like

- Generic adjectives ("aesthetic", "vibey", "clean")
- Rules that contradict each other across slides — that means you missed a sub-format
- Skipping the caption analysis — the caption is half the format

## Failure modes

- **Format reads as 3 sub-formats, not one.** The reference may be a worse carousel than you thought. Stop and ask the user if they want a different reference. Cloning a confused format produces a confused clone.
- **You can't articulate the body invariants.** Look longer. There's always a rule. If middle slides really have no shared invariant, this isn't a format-driven carousel and the skill doesn't apply.
