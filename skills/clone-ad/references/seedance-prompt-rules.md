# Seedance prompt rules

This is the most failure-prone artifact in the pipeline. The wrong prompt structure produces a flat single-take video. The right structure produces a 4–5-cut multi-shot ad.

## The core rule

**Use explicit `CUT. SHOT N:` syntax. Never use narrative time beats.**

### What fails

```
A 15-second TikTok ad. The first 4 seconds are a hook with the creator
holding the product. Then 4 seconds reveal the benefit. The last 7 seconds
show the creator using it in different settings.
```

This produces ONE continuous take from a single camera. Seedance interprets time-beat narrative as "show me one continuous scene over 15 seconds," not "show me 3 cuts."

### What works

```
CUT. SHOT 1: EXTREME_CLOSEUP, EYE_LEVEL, STATIC. Creator's face mid-frame,
mouth open mid-word. She says: "<line 1>". Bathroom mirror, warm tungsten,
phone mic.

CUT. SHOT 2: MEDIUM_CLOSEUP, LOW_ANGLE, HANDHELD. Creator holds <product>
toward camera, smiles. No dialogue. Same bathroom, soft motion blur.

CUT. SHOT 3: WIDE, EYE_LEVEL, TRACKING. Creator walks down kitchen
hallway, <product> in hand. She says: "<line 2>". Daylight, natural ambience.

CUT. SHOT 4: CLOSEUP, OVERHEAD, STATIC. <product> on counter top, creator's
hand reaching in to pick it up. No dialogue. Counter has natural props.

CUT. SHOT 5: MEDIUM, EYE_LEVEL, STATIC. Creator faces camera in living
room, holds <product> at chest. She says: "<closing line>". Soft window light.
```

This produces 5 distinct cuts at distinct framings, angles, and locations.

## The 5 mandatory variations across consecutive shots

Within a 15-second clip, vary these axes shot-to-shot:

1. **Framing** — never two consecutive MEDIUM shots. Mix EXTREME_CLOSEUP / CLOSEUP / MEDIUM_CLOSEUP / MEDIUM / MEDIUM_WIDE / WIDE.
2. **Angle** — vary EYE_LEVEL / LOW_ANGLE / HIGH_ANGLE / OVERHEAD / POV. At least 3 distinct angles across 5 shots.
3. **Movement** — vary STATIC / HANDHELD / PAN / TILT / DOLLY / TRACKING / ORBIT. At least 2 distinct movement types.
4. **Location** — multiple distinct spaces if the reference uses them. Bathroom → kitchen → bedroom → outside reads as a real ad. One static room reads as a flat take.
5. **Action** — what the creator does shot-to-shot. Holding → walking → applying → showing → reacting. Varied verbs across shots.

## Density targets

Map the reference's `shots_per_10s` to your prompt:

| Reference density | Prompt structure |
|---|---|
| ≥ 5 shots per 10s | 7–8 CUT. SHOT N: blocks for a 15s output |
| 3–4 shots per 10s | 5–6 CUT. SHOT N: blocks |
| 2–3 shots per 10s | 3–4 CUT. SHOT N: blocks |
| < 2 shots per 10s | 2–3 CUT. SHOT N: blocks (talking-head pacing) |

## Per-shot field order

Within each `CUT. SHOT N:` block, write the fields in this order so Seedance reads them consistently:

```
CUT. SHOT N: <FRAMING>, <ANGLE>, <MOVEMENT>. <Subject and action in one sentence>. <Spoken line in quotes if any, or "No dialogue.">. <Setting / environment notes>.
```

## Dialogue rules

- Quote the dialogue **verbatim** in single quotes. Don't paraphrase, don't describe what's said.
- Keep total spoken words ≤ 35 for a 15-second clip. More than that and Seedance compresses delivery and drops sync.
- One creator only — Seedance is unreliable with two-person dialogue in i2v from a single product image. If the reference has two creators, plan a different approach.

## Field-level vocabulary that Seedance honors

- **Framing words:** `EXTREME_CLOSEUP`, `CLOSEUP`, `MEDIUM_CLOSEUP`, `MEDIUM`, `MEDIUM_WIDE`, `WIDE`. Use these exact tokens in caps; don't substitute synonyms ("tight on the face" doesn't read as well as `EXTREME_CLOSEUP`).
- **Angle words:** `EYE_LEVEL`, `LOW_ANGLE`, `HIGH_ANGLE`, `OVERHEAD`, `POV`. Same — exact tokens.
- **Movement words:** `STATIC`, `HANDHELD`, `PAN`, `TILT`, `DOLLY`, `TRACKING`, `ORBIT`. Same.

## Negative reinforcement

End the prompt with one sentence reinforcing the cut count:

> Six distinct cuts. Each shot has a different framing, angle, location, or action. The cuts are visible — not a continuous take.

This nudges the model toward the cut-count target when the framing variation alone isn't enough.

## Do not include

- Time codes ("at 0:04 the creator…"). Time codes get interpreted as "one continuous take with these moments."
- Subjective adjectives that don't drive cinematography ("emotional," "aspirational," "iconic"). Strip them.
- Camera brand names ("shot on iPhone," "Canon C70"). Doesn't change output.
- Music or song references. Seedance native audio is dialogue + ambient; music has to be added in post.

## How to know it worked

After generation, run the verification loop (recipe 06). If the clone hits ≥ 2/3 of the reference's `shots_per_10s`, it's a successful clone. Lower than that and the prompt collapsed back to narrative — usually because too few CUT. SHOT N: blocks, or because the framing/angle/movement variations were too uniform.
