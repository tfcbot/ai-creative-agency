# Recipe 07 — Iterate or ship

## Goal

Either commit to a regeneration loop (with a specific change) or declare the clone done.

## Steps

1. Read the verification report from recipe 06.

2. Branch on the result:

   - **All checks pass** → ship the clip
   - **Some checks fail and you have iterations left** → iterate
   - **All iterations exhausted, still failing** → ship the closest version, document the gap

## Shipping path

1. Confirm the clip is at `clone/clone.mp4`.
2. If the user wants captions burned on, run it through their captions tool of choice (separate skill — out of scope here). Save as `clone/clone-captioned.mp4`.
3. If the user wants to publish, hand off to a publisher skill (e.g. `generate-carousel`'s zernio recipe for the API pattern, or whichever skill matches the destination platform). The clip URL pattern matches what those skills expect.
4. Update `plan.md` with the final state: prompt version that worked, verification metrics, total cost, total iterations.
5. Tell the user the clone is ready and where to find the file.

## Iteration path

1. Identify the failure type from the comparison table.
2. Find the matching fix in the failure table in `references/verification-loop.md`:
   - Density failure → recipe 04, add more CUT. SHOT N: blocks
   - Variation failure → recipe 04, vary framing/angle/movement axes
   - Dialogue failure → recipe 04, cut word count
   - Product morph → recipe 03, regenerate product image
   - Wardrobe / setting drift → recipe 04, lock creator+setting in GLOBAL SETTING block
3. Apply the fix to `clone/prompt.md` (save the previous version as `clone/prompt-v1.md`).
4. Re-run recipe 05 (generate clip).
5. Re-run recipe 06 (verify).
6. Re-evaluate this recipe.

## When to stop

- 3 iterations is the soft cap for one product/reference pairing.
- $2 of cumulative Seedance spend is the hard cap before pausing to reconsider whether the reference is achievable.
- If the user is happy with a partial clone (most variations land, density 60% of target), it's reasonable to ship even when the strict acceptance threshold isn't met.

## What "ship" means

The deliverable is `clone/clone.mp4`. The pipeline does NOT publish to social platforms automatically — that's a separate, explicitly-confirmed step using a publisher skill. Hand off the file path / URL to the user and let them decide where it goes.

## Pipeline complete

The user now has a 15-second 9:16 cloned ad with the reference's pacing and shot variety, hosted at `clone/clone.mp4`. The full project — prompt, product image, verification — is reproducible from `clone/prompt.md` and `product/product.png`. Future iterations of the same product against new references reuse the product image; future iterations of the same reference against new products reuse the shot list.
