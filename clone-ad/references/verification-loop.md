# Verification loop

After Seedance produces a clone, run the same Gemini analysis on it that you ran on the reference. Compare the two shot lists. The clone is acceptable when it hits ≥ 2/3 of the reference's shot density.

## Why this matters

Most clone failures are silent — the video plays, the product is visible, the dialogue lands, but it's a flat single-take video with no cuts. Without a verification step, you'd ship a clone that doesn't actually clone the reference's pacing.

## The check

Run `gemini-2.5-flash:generateContent` on `clone/clone.mp4` with the same shot-list extraction prompt you used on the reference (per `references/gemini-video-analysis.md`). Save the response to `clone/verification.json`.

Then compare:

```
ref.shots_per_10s          vs   clone.shots_per_10s
ref.total_shots            vs   clone.total_shots
ref.cut_style              vs   clone.cut_style
```

## Acceptance threshold

The clone passes if:

- `clone.shots_per_10s >= 2/3 * ref.shots_per_10s`
- AND clone has at least 3 distinct framings across its shots (not all MEDIUM, etc.)
- AND clone has at least 2 distinct angles
- AND the dialogue rewrite is intelligible (ear-test the audio)

If any of these fail, regenerate (recipe 07).

## Examples

### Reference: 5 shots / 10s, mixed cuts

- Clone hits 4 shots / 10s with mixed framings → ✓ pass (4/5 ≥ 2/3)
- Clone hits 2 shots / 10s with all MEDIUM → ✗ fail (density and variation both low)

### Reference: 2 shots / 10s, slow burn

- Clone hits 2 shots / 10s with two distinct framings → ✓ pass
- Clone hits 1 shot / 10s, single take → ✗ fail (matched density but not variation)

### Reference: 6 shots / 10s, fast cuts

- Clone hits 4 shots / 10s with mixed everything → ✓ pass (4/6 = 0.67 ≥ 2/3)
- Clone hits 5 shots / 10s but all WIDE shots → ✗ fail (variation low)

## What to look at when it fails

When a clone fails verification, the failure type points to the fix:

| Failure | Likely cause | Fix |
|---|---|---|
| Low shot density | Prompt was narrative, not cut-based | Rewrite with explicit `CUT. SHOT N:` blocks |
| Density OK but framings monotonous | All shots were similar framing in the prompt | Vary framing axis across shots in the rewrite |
| Density OK but angles all EYE_LEVEL | Forgot to vary angle | Vary angle axis across shots |
| Wardrobe / setting drift across shots | Creator block wasn't locked globally | Move creator + setting description to a single global block at top of prompt |
| Dialogue garbled | Too many words | Cut to ≤ 35 words for 15s |
| Product morphs across shots | Hero shot unstable | Regenerate product image with stricter prompt |

## Caching the verification

Save the verification JSON. If you regenerate the clone, also regenerate the verification — but keep old verification files (`verification-v1.json`, `verification-v2.json`) so you can see the trajectory of the iterations.

## When NOT to over-iterate

Stop iterating after 3 attempts. If the clone keeps failing verification, the issue is upstream — usually:

- Reference is too short or too cut-heavy for Seedance's i2v capabilities (>7 cuts in 10s is unrealistic)
- Reference has multi-character dialogue (Seedance i2v doesn't handle this reliably)
- Reference relies on match cuts (action carrying across shots — Seedance doesn't reliably plan these)

In those cases, accept a partial clone — match the framing variety and pacing as closely as possible, ship the result, and move on.
