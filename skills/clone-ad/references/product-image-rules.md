# Product image rules

The product image is the i2v starting frame for Seedance. It's the second-most failure-prone artifact in the pipeline (after the prompt). Get it right and Seedance has a stable anchor for every shot. Get it wrong and the product morphs across cuts.

## What works

- **Single product, dead center.**
- **Pure white seamless background.** No textured surface, no environmental backdrop, no shadow gradient.
- **Studio softbox lighting** — even, slightly directional, no harsh strobe highlights, no deep cast shadow.
- **2048×2048 square** at minimum (Nano Banana 2 default works). Square is fine even if the final clip is 9:16; Seedance crops/extends.
- **Product fills 60–80% of the frame.** Don't shoot it small in a vast white field — Seedance will struggle to track it. Don't shoot it cropped — the full silhouette anchors identity.
- **Product is in its standard orientation** — not rotated, not on its side, not viewed from a weird angle. Seedance carries the orientation forward.
- **Generic product description** is fine — Nano Banana 2 doesn't need brand names, just shape, material, and color: "matte black aluminum drink shaker with a knurled cap, satin finish, no labels." The user's own logo can be added in post.

## What fails

- **Fine typography on the product.** Seedance can't reliably hold typography across shots. The label text mangles. Workaround: generate the product without text, add the wordmark in post via an overlay tool, or use a logo-free angle.
- **Reflective chrome or mirror finishes.** They pick up environmental colors that morph between shots. Use matte or satin variants if possible.
- **Transparent products** (water bottles, glass jars). Seedance compresses transparency artifacts shot-to-shot. Frosted or opaque variants are more stable.
- **Multiple products in the frame.** Cluttered hero shot = unstable clone. Pick one hero product. Show others in dedicated shots within the prompt instead.
- **Heavy props in the hero shot** (a hand holding it, a surface under it, a shadow on a counter). The hero shot should be product-only, isolated. Hands and surfaces show up shot-by-shot in the Seedance prompt, not in the starting frame.

## When the user already has a product image

If they supply their own image, sanity-check it against the rules above. Common fails:

- **Photographed on a wood counter or marble** — needs background-removed and re-comped on white.
- **Phone-photo lighting** — yellow cast, soft shadow under the product. Re-shoot or run a quick Nano Banana 2 generation with a clean prompt.
- **Logo prominently visible** — Seedance will mangle it. Either decide to live with the mangling and fix in post, or generate a logo-free version for the i2v anchor and overlay the logo on the final video.

## Hero shot prompt template (Nano Banana 2)

```
<exact product description: shape, material, color, size, finish>
photographed on a pure white seamless backdrop, studio softbox lighting,
even illumination, no harsh highlights, no deep shadow, product centered
filling 70% of frame, square 2048×2048, photorealistic, sharp focus on
the product, depth of field gently falling off behind the product,
no text overlay, no watermark, no logo if not part of the product,
no other objects in the frame.
```

The exact product description carries the most weight. Be specific:

- "16oz double-wall stainless steel tumbler, brushed satin finish, slight conical taper, flat lid"
- "wide-mouth opaque amber glass dropper bottle, 30ml, black plastic cap with white text label that reads 'TONIC' in tight uppercase"
- "cylindrical metal aluminum can, dark forest green wrap with subtle gold script lettering, slight condensation droplets"

## Saving the spec

Save the prompt that produced your product image to `product/product-prompt.md`. If you regenerate, you start from the same spec and tweak — never from scratch.

## Iteration loop

Generate → inspect → regenerate. Each Nano Banana 2 call is ~$0.04 and ~30–90 seconds. Budget for 2–3 iterations to get a stable hero shot. Once it's right, you reuse it for every Seedance regeneration in the same project — never regenerate the product image when you regenerate the clip.
