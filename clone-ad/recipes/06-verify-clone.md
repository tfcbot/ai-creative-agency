# Recipe 06 — Verify the clone

## Goal

Run `clone/clone.mp4` through Gemini using the same shot-list extraction prompt as step 2. Compare the result to `reference/shot-list.json`. Decide whether the clone passes or needs to be regenerated.

## Steps

1. Read `references/verification-loop.md` for the acceptance threshold and failure-type table.

2. Upload `clone/clone.mp4` to Gemini's Files API (per `references/gemini-video-analysis.md`).

3. Run the same shot-list extraction prompt from step 2 on the clone. Save the result to `clone/verification.json`.

4. Compare the two JSONs across these axes:

   - **Density:** `clone.shots_per_10s` vs `ref.shots_per_10s`
     - PASS if `clone.shots_per_10s >= 2/3 * ref.shots_per_10s`
   - **Variation:** clone has at least 3 distinct framings and at least 2 distinct angles
   - **Dialogue:** ear-test the audio — is the dialogue intelligible? Is the lip sync acceptable?

5. Build a small comparison report for the user:

   ```
   | metric          | reference | clone | pass |
   | total_shots     |     6     |   5   |  ✓   |
   | shots_per_10s   |    4.0    |  3.3  |  ✓   |
   | distinct framings|    4     |   3   |  ✓   |
   | distinct angles |     3     |   2   |  ✓   |
   | cut_style       | hard cuts | hard cuts |  ✓   |
   | dialogue intelligible |  -  |  yes  |  ✓   |
   ```

6. Save the report to `plan.md`.

7. Decide:

   - **All pass** → ship. Proceed to recipe 07.
   - **Density fails** → loop back to recipe 04 (rewrite prompt with more CUT. SHOT N: blocks)
   - **Variation fails** → loop back to recipe 04 (vary framing/angle axes)
   - **Dialogue fails** → loop back to recipe 04 (cut word count)
   - **Multiple fails** → triage by cause table in `references/verification-loop.md`

## Output

```
clone/verification.json
plan.md   (with the comparison table)
```

## Done when

- Verification JSON is saved
- Comparison report is in `plan.md`
- The user has seen the report and either approved shipping or asked for an iteration

## Cost

- ~$0.01 per verification at gemini-2.5-flash
- 30–60 seconds wall time

## Iteration cap

Stop iterating after 3 attempts. If the clone keeps failing verification:

- The reference may be too cut-heavy for Seedance i2v (>7 cuts per 10s isn't realistic)
- The reference may have multi-character dialogue (Seedance struggles with this)
- The reference may rely on match cuts (action carrying across shots)

In those cases, ship the closest acceptable version and document the gap in `plan.md`. Don't burn more than ~$2 of Seedance credits chasing a clone that's structurally beyond the model's reach.

## Next

→ `recipes/07-iterate-or-ship.md`
