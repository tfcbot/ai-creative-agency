# 03 — Write slide specs for the brand

Take the format rules from `format.md` and the user's brand/niche, and write one structured spec per slide. The clone holds the format and swaps the scenes.

## Inputs

- `format.md` (from step 02) — the cover, body, and closer rules
- The user's brand context: account handle, niche, tone, any locked visual identity (logo, color, recurring motif). Ask if not provided.

## Output

`clone-carousel-<ts>/scenes/slide_<N>_<role>.json` — one JSON file per slide, in carousel order. See `references/slide-spec.md` for the full schema. Cover is `slide_1_cover.json`, closer is `slide_<N>_closer.json` named with the CTA word it carries.

## Steps

1. **Decide the slide count.** Match the reference. If the reference has 7 slides, your clone has 7 slides. Don't add or subtract — the format includes the rhythm.
2. **Write the cover spec.** Pull from the cover rule in `format.md`. Substitute the photograph for the user's brand niche but keep the headline placement, weight system, accent color, and brand-mark treatment identical. The headline TEXT can vary (it's about the brand) but the headline STYLE is locked.
3. **Write each body spec.** For each middle slide, propose a fresh scene that obeys every body invariant from `format.md`. If the body rule says "selfie / mirror / flatlay POV at golden hour, no text overlay," every middle slide must be one of those POVs at golden hour with no text. Vary the scene (kitchen vs. café vs. bedroom vs. beach) within the rule, never break the rule.
4. **Write the closer spec.** Pull from the closer rule. Same CTA mechanic as the reference (don't change comment-bait to follow-prompt). Same visual treatment (pill, outlined keyword box, etc.). Different photograph, different keyword if relevant.
5. **Add typography to the spec where it appears.** Cover has a `typography` field. Closer has a `typography` field. Body slides usually have `typography: "NO TEXT, no logos, no captions, completely clean photograph."` See `references/typography-rules.md` for the exact layered-paragraph format gpt-image-2 needs.
6. **Add `negative_prompt.forbidden_elements` to every spec.** Always include: misspelled text, garbled letters, fake characters, watermark, low resolution, plastic skin, uncanny, deformed hands, extra fingers. For body slides without text, also forbid text and logos to keep the model from hallucinating type.
7. **Sanity check.** Read all the specs in order. Do they read like one carousel? Same color palette? Same lighting era? Same era of subject (don't mix 2010s and 2026 aesthetics)? Same gender/ethnicity/age range of any human subject across slides if the body rule has a single recurring person?

## Substitution discipline

The most common failure mode is over-substitution — the user gets excited about their brand and the clone loses the format.

- **Lock down what the format dictates.** Headline style. Brand-mark position. CTA mechanic. POV system. Lighting era. Color palette. Number of slides. Single-italic-word motif if present.
- **Vary only what the format permits.** The actual scene of each photograph. The actual headline text. The actual brand mark wordmark. The actual CTA keyword.

## Brand vs. format conflict

If the user's brand identity directly conflicts with the format (e.g. brand is high-contrast tech aesthetic, reference is warm-pastel beauty UGC), tell them. The clone will not work as-is. They need either a different reference or to stretch one of their brand rules. Don't silently override either side.

## Failure modes

- **Specs read as a Pinterest mood board, not a single post.** You varied too much in the body slides. Re-read `format.md` and tighten.
- **Cover headline doesn't match the brand voice.** Workshop it with the user before generating — the cover is the most expensive slide to regenerate (typography reliability gets harder as you push the model).
- **Closer CTA promises something the user can't deliver.** "Comment AGENT and I'll DM the system" implies they actually have the system to DM. Confirm before specing.
