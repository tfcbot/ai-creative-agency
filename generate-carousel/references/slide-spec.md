# Slide JSON spec

One slide = one JSON file at `scenes/slide_<N>_<role>.json`. The flattener consumes this directly to build the gpt-image-2 prompt.

## Required top-level keys

- `id` — string, matches the filename ("slide_1_cover", "slide_3_eyes")
- `subject` — who/what is in the frame
- `pose` — orientation, gaze, hands, posture
- `environment` — set / backdrop description
- `camera` — perspective, focal length, depth of field
- `lighting` — direction, quality, shadow behavior
- `mood_and_expression` — emotional read
- `style_and_realism` — rendering style
- `colors_and_tone` — palette
- `quality_and_technical_details` — sharpness, noise
- `aspect_ratio_and_output` — `ratio: "4:5"` and framing notes
- `typography` — single string describing every text element to bake into the image (see `typography-rules.md`)
- `negative_prompt.forbidden_elements` — list of strings the model must not produce

## Annotated example (cover slide template — fill in the bracketed parts)

```json
{
  "id": "slide_1_cover",
  "subject": {
    "description": "<a young person, age range, ethnicity, build, photographed in candid medium close-up, [optionally holding a branded prop tied to the carousel topic]>",
    "body_details": {
      "face": "<face shape, eye color, brow, lips, expression cues>",
      "skin": "<undertone, visible pores, freckles or other natural marks, NOT airbrushed>",
      "hair_details": "<length, color, texture, baby hairs at temple>"
    },
    "clothing": {
      "top": "<simple, no logos, color matched to the brand palette>",
      "accessories": "<minimal — small earrings, thin chain, watch>"
    }
  },
  "pose": {
    "type": "<editorial close-medium portrait | macro skin study | wide product hero>",
    "head": "<tilt, gaze direction>",
    "arms_and_hands": "<position, what they hold, all five fingers visible>",
    "posture": "<lean, shoulder line>"
  },
  "environment": {
    "location": "<studio backdrop description — sky-blue gradient | warm putty plaster | clean cyc>",
    "details": "<no other props unless explicitly part of the format>"
  },
  "camera": {
    "perspective": "<eye-level | slightly low | tight macro>",
    "focal_length": "<35mm | 85mm | 100mm macro>",
    "depth_of_field": "<medium-shallow, where focus falls>",
    "position": "Tripod, locked off."
  },
  "lighting": {
    "source": "<soft daylight from camera-left | warm window light | macro raking>",
    "quality": "<bright editorial | moody-warm | clean macro>",
    "shadows": "<falloff direction, what stays soft>"
  },
  "mood_and_expression": {
    "emotion": "<one or two adjectives that describe the read>",
    "facial_features": "<lip line, brow line, eye state>"
  },
  "style_and_realism": {
    "genre": "Editorial campaign photography",
    "rendering": "Hyper-photorealistic. Visible skin pores, fine baby hairs, paper grain on any held prop, subtle natural film grain.",
    "aesthetic": "Modern minimalist editorial — same universe across the carousel."
  },
  "colors_and_tone": {
    "palette": "<dominant colors named — backdrop, skin, garment, accents>",
    "contrast": "Medium-high.",
    "saturation": "Natural with slight warm bias on skin."
  },
  "quality_and_technical_details": {
    "resolution": "Native 4:5 portrait at 2K.",
    "sharpness": "Tack-sharp on eyes, lips, and any held prop.",
    "noise": "Subtle natural film grain."
  },
  "aspect_ratio_and_output": {
    "ratio": "4:5",
    "framing": "<headroom percentage, where the subject sits, where typography overlays land>"
  },
  "typography": "<see typography-rules.md — a single long string that names the logo lockup, headline, and CTA element with exact text and positions>",
  "negative_prompt": {
    "forbidden_elements": [
      "smooth plastic skin", "airbrushed skin", "beauty filter", "skin smoothing", "waxy complexion",
      "CGI sheen", "floating limbs", "distorted hands", "extra fingers", "missing fingers",
      "morphing fabric", "anatomy warping",
      "second person in frame", "third person in frame",
      "misspelled text", "garbled letters", "fake characters", "extra characters in the headline",
      "watermarks", "neon signs", "harsh studio strobe", "ring-light circle in eyes",
      "stylized anime rendering", "dataset-average face",
      "orange skin", "blue-teal skin tint", "blown-out highlights"
    ]
  }
}
```

## Per-slide variations

- **Cover:** full subject in frame, headline + CTA pill rendered on top of the photograph in the lower third
- **Body slide (macro detail):** full-bleed macro photo with one big italic-serif word naming the topic + a 3–5 bullet list rendered ON the photograph in white
- **List body slide (margin layout):** photograph fills two-thirds, off-white margin third holds the headline, numbered list, and (optional) per-item breakdown sentence
- **Closer:** subject + branded prop, headline ("Comment 'X' and get the …" or "your turn") + CTA element, often using a bordered keyword inside the headline

## Casting rules across slides

- Vary the model on each slide for visual variety, OR keep the same model for stronger brand-character recognition. Pick one approach for the carousel and hold it.
- Vary the lighting setup (key direction, color temperature) only if the format supports it. Otherwise hold lighting consistent so the carousel reads as one shoot.
- Always include the negative-prompt block and re-list `misspelled text` and `garbled letters` in every slide that bakes typography. gpt-image-2 still occasionally hallucinates characters.
