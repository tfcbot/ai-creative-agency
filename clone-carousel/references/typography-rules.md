# Typography rules — baking type into gpt-image-2

gpt-image-2 can render high-quality typography directly into the image in a single pass. Done right, you skip the post-overlay step and ship the slide as-rendered. Done wrong, you get garbled letters, fake characters, or text rendered beside the subject when you wanted it on top.

These are the rules that make the difference.

## The single-string `typography` field

Every slide JSON has a top-level `typography` key. The flattener picks it up automatically and includes it in the prompt under a `TYPOGRAPHY:` label. The string is a single long natural-language paragraph describing every text element you want rendered.

Structure the paragraph as numbered layers:

```
"typography": "Render editorial typography DIRECTLY IN THE IMAGE on top of the photograph as a finished cover. <N> layers, all <color> text rendered cleanly and legibly. (1) MAIN HEADLINE …, (2) LOGO LOCKUP …, (3) CTA PILL …. All rendered text must be perfectly spelled, sharp, and legible. Typography MUST appear in the final rendered image, not as a placeholder."
```

End every typography string with the exact reliability sentence:

> All rendered text must be perfectly spelled, sharp, and legible. Typography MUST appear in the final rendered image, not as a placeholder.

That sentence measurably reduces hallucinated and missing text.

## Layer types

### Main headline

Big, layered ON TOP of the photograph, never beside it. 1–3 lines.

> three lines centered — small italic-serif word '<small>' at the top about a quarter the size of the rest, then '<big sans>' on the next line in heavy bold sans-serif, with the word '<accent>' set in italic serif while the rest stays bold sans, creating the recurring single-italic-word motif

Single-italic-word motif: every headline gets exactly one italic-serif word; everything else is heavy bold sans. This is a load-bearing typographic signature for many beauty/lifestyle and editorial-aesthetic carousels. Hold it across every slide that has a headline.

### Brand mark / logo lockup

3 lines of brand text stacked tightly at top-center or top-left. Mixed weight to add interest:

> line 1 '<word>' in heavy bold sans-serif uppercase, line 2 '<word>' in italic serif uppercase, line 3 '<word>' in heavy bold sans-serif uppercase

The italic-serif middle line is the recurring motif. Keep wordmarks short — three words max, one syllable each works best.

For app-icon-style brand marks (e.g. ChatGPT logo tile under a headline):

> a small soft-green rounded-square app-icon tile centered directly under the headline showing the white <symbol> mark, sized about the height of a single line of headline text

### CTA pill (for "comment X" closers, save-bait, follow prompts)

A rounded pill shape with imperative text inside, near the bottom-center of the frame:

> rounded full-pill shape filled warm white with a subtle drop shadow, containing the dark-navy uppercase sans-serif text '<imperative>' followed by a right-pointing arrow glyph

### Bordered keyword (for comment-bait closers like "Comment WORD")

For closers where the keyword is the action, render it inside an outlined rectangle within the headline:

> the word 'Comment' in heavy bold sans-serif white, followed by a single space, followed by the word '<KEYWORD>' rendered inside a rounded white-outlined rectangular pill, followed by another space, followed by 'and' in heavy bold sans-serif white. Line 2: '<follow-on phrase>' in heavy bold sans-serif white.

### Bulleted list (for body slides that carry text)

Tight white sans-serif bullets layered on the photograph. Cap at 3–5 items. Each item ≤ 60 characters. Lead with a filled white round bullet glyph.

## Color choice

- **All-white text** reads cleanest on hyper-real skin photography and outdoor scenes
- **Dark navy** works on off-white margins or solid pale backgrounds
- **Avoid mid-grays** — they vanish into skin tones and gradient backdrops

Pick one text color per carousel and hold it across every slide that has text.

## Position language

gpt-image-2 understands natural-language positioning. Use:

- `top-center` / `top-left` / `bottom-center`
- `lower-third` / `upper-right area` / `center-left`
- `layered ON TOP of the photograph`
- `overlapping the model's chest and shoulders`
- `on the off-white margin to the left of the photograph`
- `the lower third of the frame, well below the headline`

Avoid pixel coordinates — the model doesn't reliably interpret them.

## Reliability — the negative prompt

Always include in `negative_prompt.forbidden_elements`:

- `misspelled text`
- `garbled letters`
- `fake characters`
- `extra characters in the headline`
- `text in the wrong place`

If gpt-image-2 hallucinates characters on a held prop (a card, a phone screen, a sign), add a slide-specific clause:

- `text on the prompt card other than the word <X>`
- `unwanted text on the phone screen`

For body slides with no text at all, also include:

- `text`
- `logos`
- `captions`
- `watermark`

## Failure modes and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Garbled letters in the headline | Headline string was too long or stacked too many lines | Tighten to ≤ 3 lines, ≤ 30 characters per line |
| Hallucinated text on the model's hand-held prop | Prop was described as "blank" without specifying allowed content | Specify the exact word allowed on the prop, or add a slide-specific forbidden clause |
| Text rendered beside the subject instead of on top | Position phrase was too tentative | Use "layered ON TOP of the photograph, overlapping the model's chest" |
| CTA pill renders as a rectangle, not a pill | Shape wasn't described enough | "rounded full-pill shape filled warm white with a subtle drop shadow" |
| Logo lockup renders one line instead of three | Stacking wasn't enforced | "three lines stacked tightly" |
| Body slide has hallucinated text on a wall sign | Body slide spec didn't forbid text | Add `text`, `logos`, `captions` to forbidden_elements |

## The single-italic-word rule (when the format calls for it)

Every headline gets exactly one italic-serif word; everything else is heavy bold sans-serif. This is the load-bearing typographic motif of many beauty / lifestyle / editorial carousels. Don't vary it slide to slide — it's what makes seven different photographs read as one carousel. If the reference doesn't use this motif, don't impose it; pick whatever motif the reference uses and hold that.
