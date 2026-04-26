# Scene JSON spec (multi-person wide)

A scene JSON describes a single composed frame containing more than one character or a specific environmental composition. The most important scene in this pipeline is the wide 2-shot — it becomes the reference image for every Seedance clip.

## Schema

Same top-level keys as a character spec (`subject`, `pose`, `environment`, `camera`, `lighting`, `mood_and_expression`, `style_and_realism`, `colors_and_tone`, `quality_and_technical_details`, `aspect_ratio_and_output`, `controlnet`, `negative_prompt`) — but `subject.description` describes both hosts and their positions in the frame, and `pose` describes both poses with explicit `host_a_pose` and `host_b_pose` sub-keys.

## Canonical example — Gen Z creator-lounge open-V 2-shot

```json
{
  "id": "podcast_lounge_wide",
  "subject": {
    "description": "Two Gen Z podcast co-hosts in a modern creator-lounge studio, seated in an open-V arrangement: Host A on the LEFT in a low tan bouclé armchair angled ~30° toward camera-right, Host B on the RIGHT in a matching tan bouclé armchair angled ~30° toward camera-left. Both angled SLIGHTLY toward the camera (not fully facing each other, not fully fronting the lens) — the signature modern podcast 'open-V' geometry. Host A: East Asian woman, late 20s, oversized faded cream tee under an oatmeal open cardigan, claw clip in her hair, small gold hoops, loose light-wash jeans. Host B: Latino man, early 30s, clean barber edge-up fade with a neatly groomed full dark beard, faded sage green short-sleeve tee over a thin white long-sleeve base layer, dark denim, small silver hoop, silver chain.",
    "body_details": { "skin_note": "Both hyper-photorealistic with visible pores, fine hair, micro-imperfections. No plastic smoothing.", "hands_note": "All visible hands have exactly five fingers, anatomically correct." },
    "clothing": { "host_a_top": "Camel-cream layered casual.", "host_b_top": "Faded sage tee over white long-sleeve base layer." }
  },
  "pose": {
    "type": "Modern open-V wide two-shot — two armchairs with a coffee table between them, both hosts angled slightly toward camera.",
    "host_a_pose": "Seated LEFT in tan bouclé armchair. Body angled ~30° toward camera-right. Right hand in a small open-palm gesture at chest height.",
    "host_b_pose": "Seated RIGHT in matching tan bouclé armchair. Body angled ~30° toward camera-left. Hands relaxed near armrest.",
    "interaction": "Eye-lines lock on each other across the coffee table. Neither host looks at the camera."
  },
  "environment": {
    "location": "Modern Gen Z creator-lounge podcast studio.",
    "details": "Two matching low-profile tan bouclé armchairs. Low coffee table between them with a warm cream natural-stone top, two matte black broadcast condenser mics on thin desk-arm stands, two warm-beige stoneware mugs, a small stack of books, a tiny ceramic vase with one dried-flower stem. Behind: hand-troweled plaster feature wall in warm putty / clay tone. Built-in shelves left and right with small ceramics, plants, and warm practical lamps. Edison-bulb pendant softly defocused above. Large monstera plant far-left corner. Washed sand-tone wool area rug.",
    "forbidden_decor": "No visible text. No logos. No neon signage. No dark wooden diamond geometric panel behind the hosts. No brick wall. No acoustic foam pyramids."
  },
  "camera": {
    "perspective": "Wide two-shot, eye-level, camera straight-on opposite the coffee table. Host A in left third, Host B in right third, coffee table + feature wall in middle third.",
    "focal_length": "35mm full-frame equivalent.",
    "depth_of_field": "Medium (~f/4). Both hosts in sharp focus; background softly defocused.",
    "position": "Tripod, locked off."
  },
  "lighting": {
    "source": "Soft warm key from camera-left, gentle fill from camera-right via ambient LED wall strip and shelf lamps. Pendant Edison bulb provides background motivation.",
    "quality": "Soft, warm, clean creator-lounge quality. 2800–3200K.",
    "shadows": "Gentle cheek-side falloff. Soft shadow under the coffee table. Subtle directional texture on the plaster wall."
  },
  "aspect_ratio_and_output": {
    "ratio": "16:9",
    "framing": "Wide two-shot. Frame reads from the hosts' knees up. Coffee table front edge in lower foreground."
  },
  "negative_prompt": {
    "forbidden_elements": [
      "turtleneck sweater", "crewneck sweatshirt", "business casual", "corporate attire",
      "polo shirt", "button-down shirt", "blazer", "matching outfits",
      "hosts side by side touching shoulders", "hosts at a kitchen table",
      "hosts looking directly at the camera", "either host breaking the fourth wall",
      "third person in frame", "neon sign with text", "logos", "watermarks",
      "dark-stained wood geometric diamond panel behind the hosts", "brick wall",
      "acoustic foam pyramids", "harsh ring-light circle in eyes",
      "smooth plastic skin", "airbrushed skin", "beauty filter",
      "distorted hands", "extra fingers", "morphing clothes",
      "Host A with beard", "Host B without beard"
    ]
  }
}
```

## Composition rules

- Open-V seating, ~30° toward camera on each host. Not fully profile, not fully fronting.
- Two foreground mics on slim arms, not heavy boom arms (those read as old-school studio).
- Coffee table low and forward — its front edge should be visible in the lower foreground.
- Background must include warm practical lighting (Edison bulb, lamp, LED strip wash) — never overhead studio lights.
- The set is the brand's signature; you reuse it across campaigns even when you change the cast.
