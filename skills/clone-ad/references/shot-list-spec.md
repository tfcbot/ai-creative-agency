# Shot list JSON spec

Gemini outputs this structure when analyzing the reference ad. The rewriter (recipe 04) consumes it to build the Seedance prompt for the cloned version.

## Schema

```json
{
  "total_shots": 6,
  "total_duration_sec": 15,
  "shots_per_10s": 4.0,
  "cut_style": "hard cuts | match cuts | jump cuts | mixed",
  "shots": [
    {
      "n": 1,
      "start": 0.0,
      "end": 2.4,
      "framing": "EXTREME_CLOSEUP | CLOSEUP | MEDIUM_CLOSEUP | MEDIUM | MEDIUM_WIDE | WIDE",
      "angle": "EYE_LEVEL | LOW_ANGLE | HIGH_ANGLE | OVERHEAD | POV",
      "movement": "STATIC | HANDHELD | PAN | TILT | DOLLY | TRACKING | ORBIT",
      "location": "<where the shot takes place — bathroom mirror, kitchen counter, gym floor, car interior>",
      "in_frame": "<what objects/subjects are visible — creator face, product, prop>",
      "creator_action": "<what the on-camera person does — talking to camera, holding product, walking>",
      "spoken": "<verbatim line if dialogue, or empty>",
      "caption": "<on-screen text overlay if present, or empty>"
    }
  ],
  "creator": {
    "gender": "<m | f | nb>",
    "age_range": "<e.g. early 20s, late 30s>",
    "hair": "<length, color, style>",
    "wardrobe": "<garments, color palette>",
    "expression_style": "<warm, deadpan, enthusiastic, frustrated>"
  },
  "environment_notes": "<global setting notes — lighting palette, color grade, noise level, room aesthetic>",
  "audio": {
    "reverb": "<dry | tight room | slight reverb>",
    "voice_quality": "<phone mic | clip mic | studio>",
    "music": "<none | bed track | beat drop>",
    "pacing": "<slow | conversational | fast | rushed>"
  },
  "hook_structure": "<one-sentence summary of how the first 3 seconds grab attention>"
}
```

## Why every field matters

- `total_shots` and `shots_per_10s` — the **density target** the clone must hit. A reference with 4–5 cuts per 10s requires a clone with the same density. If the clone produces fewer shots, the prompt was too narrative — see `seedance-prompt-rules.md`.
- `framing`, `angle`, `movement` — three orthogonal axes that must vary across consecutive shots. If 6 shots all read MEDIUM / EYE_LEVEL / STATIC, the clone reads as one flat take even if the model honors the cut count.
- `creator` block — what the rewriter substitutes when adapting to the user's product context (gender, age range, wardrobe). Don't copy verbatim — adapt to the user's brand.
- `audio` block — pacing target for the dialogue rewrite. Slow reference = short rewrite. Fast reference = pack more words.
- `hook_structure` — the one-line essence of the first 3 seconds. The clone's first shot must execute the same hook category (ASMR, direct address, action mid-motion, product reveal, problem statement).

## Reading the data

- **High shot density (>4 per 10s)** = punchy ad, jump cuts dominating. Rewrite must hit similar density.
- **Low shot density (<2 per 10s)** = slow burn or talking head. Rewrite should mirror the slow rhythm with longer holds and less variation.
- **Cut style "match cuts"** = transitions where action carries from shot to shot (hand reaches → hand catches in next shot). Hard to clone reliably; if the reference relies on match cuts, lower expectations on shot-density target.

## What to do with this output

The shot list is the bridge between the reference and the clone. It's NOT directly used as the Seedance prompt — the rewriter (recipe 04) translates it into Seedance's `CUT. SHOT N:` syntax with the user's product, wardrobe, and dialogue substituted in.

## Cache aggressively

This JSON is cheap to keep and expensive to regenerate (Gemini analysis costs ~$0.01 per 15s and takes ~30–60s). Save it to `reference/shot-list.json` and reuse for every rewrite iteration. Only re-analyze if the reference itself changes.
