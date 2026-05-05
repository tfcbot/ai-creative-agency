# 05 — Synthesize the top-performer pattern

After verification, the agent reads the confirmed entries' `watch.{hook, format, shot_list}` outputs and synthesizes the shared pattern across the top performers. This is where the skill stops being a search engine and starts being a creative brief.

This recipe runs in the agent — no provider call. The watch outputs from recipe 04 are the raw material; the agent's job is to find what's repeating across the winning posts and propose one synthesized format the user could film tomorrow.

## Inputs

The `verified[]` rows where `watch.is_app === true` and `watch.confidence ∈ {high, medium}`. If fewer than 3 confirmed entries exist, write a `pattern: null` and a one-line note in the report explaining there's not enough signal to synthesize. Don't fabricate a pattern from one or two posts.

## What to synthesize

```ts
type Pattern = {
  shared_format: string;          // The most common format across confirmed posts. e.g. "First-person POV walkthrough where the creator narrates their day using the app"
  shared_hook_archetype: string;  // The hook structure that repeats. e.g. "Frustration cold-open: creator complains about a pain point in the first 2s, app appears as the resolution at 3-5s"
  shared_shot_beats: string[];    // 3-5 shot beats common across the top performers. Order matters.
  what_makes_it_work: string;     // One paragraph on why this pattern is converting. Reference specific evidence from the watch outputs.
  bio_signal_pattern: string;     // What the bio CTA pattern looks like across confirmed creators. e.g. "10/12 confirmed creators link <app>.com in bio with no in-post mention"
  outliers: string[];             // Confirmed entries that DON'T fit the shared pattern, named by handle. These are alternative angles worth flagging.
  suggested_format: {
    title: string;                // A name for the format. e.g. "Pain-Point POV Walkthrough"
    duration_sec: number;         // Suggested length, anchored to the actual top-performer durations
    hook: string;                 // Concrete hook script with an actual line of voiceover/text
    shot_list: { t: string, shot: string, vo_or_text: string }[];  // Specific shot beats with timings and example VO/text
    cta: string;                  // The CTA, modeled on the bio_signal_pattern
    why_this_should_work: string; // One paragraph tying the synthesis back to evidence
  };
};
```

## Process

1. **Cluster formats.** Tally the `format` strings across confirmed entries. Group near-duplicates ("talking-head review" and "talking-head walkthrough" → one cluster). Identify the dominant cluster (≥ 40% of confirmed entries) — that's the `shared_format`.

2. **Cluster hooks.** Look at the `hook` strings. Most app-UGC hooks fall into one of: pain-point cold open, before/after, POV story, list/promise, demo cold-open, social-proof. Pick the dominant archetype as `shared_hook_archetype`.

3. **Synthesize shot beats.** Across the `shot_list[]` arrays, find shots that repeat across ≥ half the confirmed entries. List them in chronological order — that's `shared_shot_beats`.

4. **Inspect the bios.** Across `verified[].profile.bio` and `bio_link`, find what the brand's affiliate creators all do — same landing page? Same vanity slug pattern (e.g. `*.fromladder` for Ladder)? Same copy structure? That's `bio_signal_pattern`. The user will need to mirror this if they want their content to convert the same way.

5. **Surface outliers.** Confirmed entries that *don't* fit the shared pattern aren't noise — they're alternative angles. Flag them by handle in `outliers[]` so the user knows the pattern isn't the only path.

6. **Write the suggested format.** Use the synthesized pattern as scaffolding, but write a concrete shot list with actual VO/text the user can shoot. The `suggested_format.shot_list` should have specific timings, specific shot descriptions, specific spoken or on-screen lines. Anchor everything to evidence from the verified entries — never invent a pattern not represented in the data.

## Output

Add `pattern` as a top-level field in the manifest. The renderer consumes it and surfaces the section above the verified-videos table.

## When to skip

If the verified entries don't share a dominant pattern (no cluster reaches 40%), set `pattern.shared_format = "no dominant pattern"` and explain in `what_makes_it_work` that the brand's organic UGC is heterogeneous. Still produce a `suggested_format` — pick the highest-engagement-rate verified post and propose a clone of its structure as the most defensible synthesis.
