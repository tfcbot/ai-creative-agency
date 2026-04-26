# Typography rules — baking type into gpt-image-2

gpt-image-2 can render high-quality typography directly into the image. Done right, you skip the post-overlay step and ship the slide as-rendered. Done wrong, you get garbled letters or hallucinated words.

These are the rules that make the difference.

## The single-string `typography` field

Add a top-level `typography` key to every slide JSON. The flattener picks it up automatically and includes it in the prompt under a `TYPOGRAPHY:` label. The string should be a single long natural-language paragraph describing every text element you want rendered.

Structure the paragraph as numbered layers:

```
"typography": "Render editorial typography DIRECTLY IN THE IMAGE on top of the photograph as a finished cover. <N> layers, all <color> text rendered cleanly and legibly. (1) LOGO LOCKUP at <position>, … (2) MAIN HEADLINE … (3) CTA PILL …. All rendered text must be perfectly spelled, sharp, and legible. Typography MUST appear in the final rendered image, not as a placeholder."
```

## Layer types

### Logo lockup
3 lines of brand text stacked tightly at top-center or top-left of the frame. Mixed weight to add interest:

> line 1 '<word>' in heavy bold sans-serif uppercase, line 2 '<word>' in italic serif uppercase, line 3 '<word>' in heavy bold sans-serif uppercase

The italic-serif middle line is the recurring motif. Keep the brand wordmark short — three words max, one syllable each works best.

### Main headline
Big, layered ON TOP of the photograph, never beside it. 1–3 lines. Use the single-italic-word motif:

> three lines centered — small italic-serif word '<small>' at the top about a quarter the size of the rest, then '<big sans>' on the next line in heavy bold sans-serif, with the word '<accent>' set in italic serif while the rest stays bold sans, creating the recurring single-italic-word motif

### CTA pill
A rounded pill shape with imperative text inside, near the bottom-center of the frame:

> rounded full-pill shape filled warm white with a subtle drop shadow, containing the dark-navy uppercase sans-serif text '<imperative>' followed by a right-pointing arrow glyph

### Bulleted list (for body slides)
Tight white sans-serif bullets layered on the photograph. Cap at 3–5 items. Each item ≤ 60 characters. Lead with a filled white round bullet glyph.

### Bordered keyword (for "comment X" CTAs)
For comment-bait closers, render the keyword inside a thin rounded outlined rectangle within the headline:

> the word 'Comment' in heavy bold sans-serif white, followed by a single space, followed by the word '<KEYWORD>' rendered inside a rounded white-outlined rectangular pill, followed by another space, followed by 'and' in heavy bold sans-serif white. Line 2: '<follow-on phrase>' in heavy bold sans-serif white.

## Spelling and reliability

Add this exact phrase to the end of every typography string:

> All rendered text must be perfectly spelled, sharp, and legible. Typography MUST appear in the final rendered image, not as a placeholder.

Add these forbidden elements to the slide's `negative_prompt.forbidden_elements`:

- `misspelled text`
- `garbled letters`
- `fake characters`
- `extra characters in the headline`
- `text in the wrong place`

If gpt-image-2 still hallucinates characters on a held prop (a card, a sign), add a specific clause to forbid extra text on that prop:

- `text on the prompt card other than the word <X>`

## Color choice

- All-white text reads cleanest on hyper-real skin photography
- Dark navy works on off-white margins or solid pale backgrounds
- Avoid mid-grays — they vanish into skin tones and gradient backdrops

Pick one text color per carousel and hold it across every slide.

## Position language

gpt-image-2 understands natural-language positioning. Use:

- `top-center` / `top-left` / `bottom-center`
- `lower-third` / `upper-right area` / `center-left`
- `layered on top of the photograph`
- `overlapping the model's chest and shoulders`
- `on the off-white margin to the left of the photograph`
- `the lower third of the frame, well below the headline`

Avoid pixel coordinates — the model doesn't reliably interpret them.

## Failure modes and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Garbled letters in the headline | Headline string was too long or stacked too many lines | Tighten to ≤ 3 lines, ≤ 30 characters per line |
| Hallucinated text on the model's hand-held prop | Prop was described as "blank" without specifying allowed content | Specify the exact word to render on the prop (e.g. "the word 'PROMPT' in heavy black sans") |
| Text rendered beside the subject instead of on top | Position phrase was too tentative | Use "layered ON TOP of the photograph, overlapping the model's chest" |
| CTA pill renders without the rounded shape | Pill wasn't described enough | Describe the shape: "rounded full-pill shape filled warm white with a subtle drop shadow" |
| Logo lockup renders one line instead of three | Stacking wasn't enforced | Use the phrase "three lines stacked tightly" |

## Single-italic-word rule

Every headline gets exactly one italic-serif word; everything else is heavy bold sans-serif. This is the load-bearing typographic motif of the format. Do not vary it slide to slide — it's what makes seven different photographs read as one carousel.
