# Recipe 04 — Define the dialogue clips

## Goal

Produce one JSON file per dialogue block at `clips/block_<N>.json`. For a standard ~60s ad, that's four blocks. Each block JSON contains the dialogue, the prompt, and the negative prompt that Seedance will consume in Recipe 05.

## The 4-block structure

```
block_1.json  →  HOOK            broad curiosity question
block_2.json  →  ACCESSIBILITY   "so anyone could actually do this?"
block_3.json  →  USE CASES       "what are people actually using this for?"
block_4.json  →  CTA             "so how do I get started?" → brand answer
```

Each block ≈ 15 seconds: ~2s for Host A's question, ~13s for Host B's answer.

## Steps

1. Read `references/clip-spec.md` for the schema and the proven prompt structure.

2. Write the dialogue first, in `script.md`. Keep it conversational:
   - Host A asks **one simple question** per block
   - Host B answers in 1–3 short sentences (~13 seconds when read aloud)
   - No jargon, no marketing language, no hype words ("revolutionary," "game-changing," "must-have")
   - Map each block to one objection it dismantles (write the objection in a comment alongside)

3. For each block, write `clips/block_<N>.json` with all the keys from the schema:
   - `id: "block_<N>"`
   - `model: "bytedance/seedance-2.0/text-to-video"`
   - `aspect_ratio: "16:9"`, `resolution: "720p"`, `duration_seconds: 15`
   - `reference_image: "../frames/podcast_lounge_wide.png"`
   - `dialogue.host_a` and `dialogue.host_b` — the verbatim lines
   - `prompt` — follow the structure in `references/clip-spec.md`. **Critical:** repeat the full host wardrobe and set descriptions verbatim across every block. Do not abbreviate after block 1 — Seedance needs the full description each time to hold continuity.
   - `negative_prompt` — the canonical block from `references/clip-spec.md`. Use it verbatim.

4. Inside each `prompt`, include an explicit ACTION block that quotes both lines verbatim in single quotes:

   ```
   ACTION: Host A speaks first, looking at Host B with [emotional cue], [hand or body cue] — she says: '<line>' Brief beat of eye contact. Host B then answers with [emotional cue], [body cue] — he says: '<line>'.
   ```

5. Pick an emotional cue per block:
   - Block 1 (Hook): A is genuinely curious; B is grounded and easy
   - Block 2 (Accessibility): A is slightly surprised; B is reassuring
   - Block 3 (Use cases): A is engaged; B is enumerating with confident gestures
   - Block 4 (CTA): A leans forward; B nods on the brand name with a small half-smile

## CTA rule

Block 4's Host B answer must say the brand name like it's the obvious answer. No hype. No superlatives. The shape that works:

> "<Brand name>. That's the community. Everything's already in there — <2-3 concrete things>. You just plug in and start <verb>."

The delivery sells the brand; the copy just names it.

## Output

```
script.md           updated with all four exchanges
clips/block_1.json
clips/block_2.json
clips/block_3.json
clips/block_4.json
```

## Done when

- All four block JSONs validate
- Each prompt repeats the full host + set description verbatim (no abbreviations)
- Each ACTION block quotes both lines verbatim in single quotes
- The user has reviewed the dialogue in `script.md` before any clip is rendered

## Next

→ `recipes/05-generate-clips.md`
