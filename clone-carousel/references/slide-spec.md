# Slide spec — JSON schema for a single slide

One JSON file per slide, saved to `scenes/slide_<N>_<role>.json`. The flattener consumes this and produces the gpt-image-2 prompt.

## Schema

```json
{
  "id": "slide_1_cover",
  "role": "cover" | "body" | "closer",
  "subject": {
    "description": "<one paragraph: who or what is in the photo>"
  },
  "body_details": {
    "skin": "<…>",
    "hair": "<…>",
    "expression": "<…>"
  },
  "clothing": "<single string>",
  "pose": {
    "type": "<seated / standing / mid-stride / overhead-flatlay-pov / etc.>",
    "head": "<tilt / orientation>",
    "arms_and_hands": "<position>",
    "posture": "<weight + stance description>"
  },
  "environment": {
    "location": "<one phrase>",
    "details": "<props, blurred background elements, era>"
  },
  "camera": {
    "perspective": "<front-camera selfie / mirror reflection / overhead / third-person / etc.>",
    "focal_length": "<26mm / 35mm / 50mm look>",
    "depth_of_field": "<shallow / deep>",
    "position": "<eye-level / low / overhead>"
  },
  "lighting": {
    "source": "<window daylight / golden hour / studio / pink LED / etc.>",
    "quality": "<soft / hard / directional>",
    "shadows": "<long / short / fill>"
  },
  "mood_and_expression": {
    "emotion": "<calm / confident / playful>",
    "facial_features": "<half-smile / direct gaze / lips parted>"
  },
  "style": {
    "genre": "<hyperreal photographic / editorial / UGC>",
    "rendering": "<iPhone front-camera grain / 35mm film / clean studio>",
    "aesthetic": "<modern Instagram beauty UGC / Pinterest flatlay / etc.>"
  },
  "colors_and_tone": {
    "palette": "<warm honey / cream and beige / cool clean>",
    "contrast": "<low / medium / high>",
    "saturation": "<natural / desaturated / vivid>"
  },
  "quality": {
    "sharpness": "<razor sharp on the eyes / soft overall>",
    "noise": "<organic skin grain / clean digital>"
  },
  "aspect": {
    "ratio": "4:5 vertical",
    "framing": "<head-and-shoulders / full body / overhead crop>"
  },
  "typography": "<the verbatim typography string — see typography-rules.md>",
  "negative_prompt": {
    "forbidden_elements": [
      "misspelled text",
      "garbled letters",
      "fake characters",
      "watermark",
      "low resolution",
      "plastic skin",
      "uncanny",
      "deformed hands",
      "extra fingers"
    ]
  }
}
```

## Fields by role

### Cover
All fields present. `typography` carries the headline + brand-mark layers.

### Body
All fields present. `typography` is usually `"NO TEXT, no logos, no captions, completely clean photograph."` Add `"text"` and `"logos"` to `forbidden_elements` to keep the model from hallucinating type.

### Closer
All fields present. `typography` carries the CTA layer (pill, outlined keyword, or bold-only).

## How the flattener turns this into a prompt

The flattener walks the schema in this order and emits labeled sections. See `wavespeed-gpt-image-2.md` for the exact mapping.

```
SUBJECT: <subject.description>
BODY: <body_details flattened>
CLOTHING: <clothing>
POSE: <pose.type>
HEAD: <pose.head>
ARMS/HANDS: <pose.arms_and_hands>
POSTURE: <pose.posture>
ENVIRONMENT: <environment.location> — <environment.details>
CAMERA: <camera.perspective> <camera.focal_length> <camera.depth_of_field> <camera.position>
LIGHTING: <lighting.source> Quality: <lighting.quality> Shadows: <lighting.shadows>
MOOD: <mood_and_expression.emotion> Expression: <mood_and_expression.facial_features>
STYLE: <style.genre> <style.rendering> <style.aesthetic>
COLOR: <colors_and_tone.palette> Contrast: <colors_and_tone.contrast> Saturation: <colors_and_tone.saturation>
QUALITY: sharpness <quality.sharpness> <quality.noise>
FRAMING: <aspect.ratio> — <aspect.framing>
TYPOGRAPHY: <typography string verbatim>
```

`negative_prompt.forbidden_elements` is passed separately as the comma-joined `negative_prompt` request param.

## Continuity rules across the carousel

Every spec in the same carousel must share:

- `aspect.ratio` (always `4:5 vertical`)
- `colors_and_tone.palette` family (warm carousel = all warm slides; cool = all cool)
- `style.aesthetic` family
- Typography color (one text color across all slides — never mix white-text and dark-navy-text)

What varies per slide:

- `subject`, `environment`, `camera`, `pose` — the actual scene
- `typography` content (cover vs. body vs. closer have different text)
