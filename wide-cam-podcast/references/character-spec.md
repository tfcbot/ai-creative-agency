# Character JSON spec

Each host is one JSON file at `characters/<host_id>.json`. The schema is rich and structured intentionally — flatten it to a natural-language prompt at gen time. The structure forces consistency.

## Required top-level keys

- `subject` — who they are
- `pose` — body and head orientation, gaze direction
- `environment` — where they're sitting (matches the scene)
- `camera` — how the camera sees them
- `lighting` — direction, quality, shadow behavior
- `mood_and_expression` — emotional read
- `style_and_realism` — rendering style
- `colors_and_tone` — palette
- `quality_and_technical_details` — sharpness, noise
- `aspect_ratio_and_output` — `ratio: "16:9"` and framing notes
- `controlnet` — pose + depth control intent (used for prompt-time wording, not always wired to controlnet endpoints)
- `negative_prompt` — `forbidden_elements: [...]`

## Annotated example (Host A — East Asian woman, late 20s)

```json
{
  "subject": {
    "description": "East Asian woman in her late 20s with a soft oval face, warm brown almond eyes, and a relaxed intelligent presence. Shoulder-length straight black hair center-parted, one side tucked behind her right ear.",
    "body_details": {
      "face": "Soft oval. Brows full, naturally arched. Warm brown eyes, medium almond. Lips medium fullness, natural rose tint.",
      "skin": "Warm-neutral undertone, clear but NOT airbrushed — visible natural pores. Subtle natural redness on the tip of the nose.",
      "hair_details": "Individual strands catch the key light along the crown. A few baby hairs at the temple. Ends are blunt-cut, healthy, not glossy-CGI."
    },
    "clothing": {
      "top": "Camel ribbed turtleneck sweater in heavyweight merino knit. Vertical ribbing clearly visible. Fitted but not tight.",
      "accessories": "Small gold stud earrings. Thin gold ring on the right middle finger."
    }
  },
  "pose": {
    "type": "Seated medium shot, mid-conversation with an unseen co-host at the right end of the table.",
    "head": "Turned 20–25° toward screen-right, looking past the camera at her partner. NOT looking at the camera.",
    "arms_and_hands": "Forearms come forward to rest near the table edge. Hands relaxed, all five fingers visible and anatomically correct.",
    "posture": "Seated upright with a slight forward lean (5–10°), engaged-listener posture."
  },
  "environment": {
    "location": "Warm moody podcast studio interior. Intimate two-person setup.",
    "details": "Dark wood geometric accent panel behind, soft-defocused shelf with a vintage camera and books, warm Edison-bulb practical lamp glowing in the background right.",
    "context": "Evening warm interior, lived-in creator studio feel."
  },
  "camera": {
    "perspective": "Eye-level medium shot from slightly screen-right. Subject in left two-thirds of the 16:9 frame, negative space toward screen-right.",
    "focal_length": "35mm full-frame equivalent, natural perspective, minimal distortion.",
    "depth_of_field": "Shallow to medium (~f/2 to f/2.8). Eyes tack-sharp; background softly defocused.",
    "position": "Tripod, locked off."
  },
  "lighting": {
    "source": "Soft warm key from front-left, subtle cool fill from screen-right, faint rim catching the hair on her right side.",
    "quality": "Moody, warm, 2800–3200K. Skin well-lit but not flat.",
    "shadows": "Gentle falloff on the far cheek and neck. Background drops into deeper warm shadow."
  },
  "mood_and_expression": {
    "emotion": "Engaged, curious, warm. Actively listening, on the verge of responding.",
    "facial_features": "Lips closed with a subtle asymmetric smile, eyes alert on her partner, brows softly raised in interest."
  },
  "style_and_realism": {
    "genre": "Candid podcast documentary photography, naturalistic.",
    "rendering": "Hyper-photorealistic. Visible skin texture, individual hair strands, fabric weave on the turtleneck rib.",
    "aesthetic": "Warm filmic, cinematic but intimate."
  },
  "colors_and_tone": {
    "palette": "Warm caramel as the dominant color, amber practical-lamp highlights, deep walnut browns in the wood panel, muted desaturated backdrop.",
    "contrast": "Medium-high.",
    "saturation": "Natural, slightly warm white balance. Skin reads authentic, not orange."
  },
  "quality_and_technical_details": {
    "resolution": "High (delivered at native 16:9 2K).",
    "sharpness": "Tack-sharp on eyes, lips, ribbing at the chest. Gentle falloff behind.",
    "noise": "Subtle natural film-grain sensor noise in shadows."
  },
  "aspect_ratio_and_output": {
    "ratio": "16:9",
    "framing": "Medium shot. Frame cuts across just below the bust line. Subject occupies the left two-thirds; right third is negative space across the table."
  },
  "controlnet": {
    "pose_control": {
      "purpose": "Lock seated conversational pose and mirrored eye-line with the co-host",
      "constraints": [
        "preserve 20–25° head turn toward screen-right",
        "preserve forward lean of 5–10°",
        "hands posed naturally near table edge, all five fingers visible"
      ]
    }
  },
  "negative_prompt": {
    "forbidden_elements": [
      "smooth plastic skin", "airbrushed skin", "beauty filter", "skin smoothing",
      "floating limbs", "distorted hands", "extra fingers", "missing fingers",
      "second person in frame", "back of another head in frame",
      "direct eye contact with camera", "looking at lens",
      "stylized anime rendering", "harsh studio strobe lighting",
      "text on screen", "captions", "logos", "watermarks"
    ]
  }
}
```

## Casting rules

- Two hosts must have visibly different silhouettes — different hair shape, different top color, different skin undertone if possible. The viewer's eye must register a cut at a glance.
- Mirror their eye-lines. If Host A looks screen-right, Host B looks screen-left. Their head turn angles should match in magnitude (e.g. both at ~20°).
- Wardrobe rule for modern Gen Z brand podcasts: oversized tees, cardigans, vintage-washed cotton, minimal jewelry. Do not dress the hosts in business attire (turtlenecks, crewnecks-with-collars, polos, button-downs) unless the brand explicitly calls for it.
- No logos, no wordmarks, no graphic prints anywhere on the wardrobe.

## Reference

The schema follows the same shape as `/Users/blurware/products/operating-docs/marketing/characters/character-base-fitness.json` — that file is the canonical template and worth reading once.
