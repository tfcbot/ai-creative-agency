# Recipe 01 — Define the two hosts

## Goal

Produce two JSON files at `characters/host_a.json` and `characters/host_b.json` that fully describe each host. These specs are the source of truth — every later step (frame generation, clip generation, regenerations after notes) reads from them.

## Steps

1. Read `references/character-spec.md` to internalize the schema.

2. Ask the user (or decide from context) for the brand vibe and target audience. Pick a casting that:
   - Has **two visibly different silhouettes** — different ethnicities or hair shapes, different top colors, different jewelry.
   - Matches the brand's audience (Gen Z creator-lounge default; adjust for niche).
   - Pairs a curious questioner with a grounded answerer (Host A asks; Host B teaches).

3. For each host, write a complete JSON file matching the schema in `references/character-spec.md`. Fill out every top-level key:
   - `subject` — full identity, body details, clothing, accessories
   - `pose` — seated medium shot, mirrored eye-line with the other host
   - `environment` — same world as `scenes/podcast_lounge_wide.json` (wait until that exists, or just describe it from the scene mock)
   - `camera`, `lighting`, `mood_and_expression`, `style_and_realism`, `colors_and_tone`, `quality_and_technical_details`, `aspect_ratio_and_output`
   - `controlnet.pose_control.constraints` — list the locked pose properties (head turn angle, lean, hand position)
   - `negative_prompt.forbidden_elements` — the canonical list from the schema reference

4. Mirror the eye-lines explicitly in the spec. If Host A's `pose.head` says "turned 20–25° toward screen-right," Host B's must say "turned 20–25° toward screen-LEFT." This makes the cuts feel like a real conversation.

5. Mirror the wardrobe palette. If Host A wears warm tones (cream, oatmeal, camel), Host B should wear cool-warm complement (sage, white, dark denim) — never both warm or both cool.

## Wardrobe defaults for modern Gen Z brand podcasts

- **Forbid:** turtlenecks, crewneck sweatshirts, polos, button-downs, blazers, suits, anything with a logo or graphic print.
- **Allow:** oversized vintage-washed tees, soft cardigans, layered long-sleeve base layers, light-wash or dark-raw denim, casual sneakers (out of frame), small gold or silver jewelry.

## Output

```
characters/
├── host_a.json
└── host_b.json
```

## Done when

- Both files validate as JSON.
- Both files contain every top-level key from `references/character-spec.md`.
- Eye-lines are mirrored, wardrobe palettes are mirrored, silhouettes are visibly different.
- The user has confirmed the casting before you generate any frames.

## Next

→ `recipes/02-generate-starting-frames.md`
