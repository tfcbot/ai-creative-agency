# Recipe 04 — Rewrite the shot list for the product

## Goal

Translate `reference/shot-list.json` into a Seedance prompt at `clone/prompt.md` that uses the user's product, their dialogue, and matched-but-fresh framing variations. This is the load-bearing creative step.

## Steps

1. Read `references/seedance-prompt-rules.md` carefully. Internalize the `CUT. SHOT N:` syntax and the 5 mandatory variations across consecutive shots.

2. Ask the user for:
   - **The dialogue / spoken script** — what their creator says across the clip. Cap at ~35 words for 15s.
   - **The hook angle** — what's the first 3 seconds about? Match the reference's `hook_structure` (problem statement / direct address / ASMR / mid-action).
   - **Any setting variations** — same locations as reference (bathroom, kitchen, bedroom)? or different? Default: keep the location pattern the reference uses, swap specific decor for the user's brand context.
   - **Wardrobe** — the creator's wardrobe in the clone. Default: a wardrobe consistent with the reference's `creator.wardrobe` description but with the user's brand color palette.
   - **Creator description** — who is the on-camera person? Adapt from `creator` in the reference but customize to fit the user's audience.

3. Build the prompt. Structure it as:

   ```
   GLOBAL SETTING:
   <one block describing the creator (gender, age range, ethnicity, hair, wardrobe), the
   environment palette, and the audio pacing. This locks identity across all shots.>

   CUT. SHOT 1: <FRAMING>, <ANGLE>, <MOVEMENT>. <Subject and action>. <Spoken line in
   single quotes if any, or 'No dialogue.'>. <Setting / environment notes>.

   CUT. SHOT 2: ...

   CUT. SHOT N: ...

   <closing line: "N distinct cuts. Each shot has a different framing, angle, location,
   or action. The cuts are visible — not a continuous take.">
   ```

4. Map each `shots[i]` from `reference/shot-list.json` to a `CUT. SHOT i:` block:

   - Carry over the `framing`, `angle`, `movement` tokens (use exact controlled vocabulary)
   - Adapt `location` to fit the product (e.g. reference says "kitchen counter" for a food product → keep "kitchen counter" for a beverage product, change to "bathroom vanity" for a beauty product)
   - Adapt `creator_action` to involve the user's product (e.g. "holding the kettle" → "holding the <user's product>")
   - Replace `spoken` with the user's dialogue line for that shot (or empty if no dialogue)
   - Drop `caption` from each shot — Seedance can't reliably render burned captions; add them in post

5. **Verify the variation across consecutive shots.** Walk down the rewritten shot list and check:
   - No two consecutive shots have identical `framing`
   - No two consecutive shots have identical `angle`
   - No two consecutive shots have identical `movement`
   - At least 2 distinct locations appear in the prompt
   - At least 3 distinct creator actions appear across the shots

   If any check fails, edit before continuing — the variation is what produces visible cuts.

6. **Verify the dialogue word count.** Total words spoken across all shots must be ≤ 35 for a 15s output. Trim if needed.

7. Save to `clone/prompt.md`. Show the user the full prompt for review before generating.

## Output

```
clone/prompt.md
```

## Done when

- Every reference shot has a corresponding `CUT. SHOT N:` block
- All five variations (framing, angle, movement, location, action) are honored
- Total dialogue ≤ 35 words
- The prompt closes with the cut-count reinforcement line
- The user has approved the prompt before any clip is generated

## Iteration

If the first generated clip fails verification (recipe 06), come back to this recipe and tighten the prompt — usually it's a variation that wasn't enforced or too much dialogue. Save iterations as `clone/prompt-v2.md` etc.

## Next

→ `recipes/05-generate-clip.md`
