# Working directory layout

Set this up at the root of the user's CWD before any recipe runs. Per ETHOS principle 7, the directory is named `clone-carousel-<YYYYMMDD-HHMM>/`, never overwritten across runs.

```
clone-carousel-<ts>/
├── research/                       # raw scrape data + downloaded reference images
│   ├── post_<shortcode>.json       # full Scrape Creators response
│   └── images/
│       ├── slide_1.jpg
│       ├── slide_2.jpg
│       └── …
├── format.md                       # the format rules (cover / body / closer / caption)
├── scenes/                         # one JSON spec per slide
│   ├── slide_1_cover.json
│   ├── slide_2_<topic>.json
│   ├── …
│   └── slide_<N>_closer.json
├── frames/                         # generated slide PNGs
│   ├── slide_1_cover.png
│   ├── slide_2_<topic>.png
│   ├── …
│   └── slide_<N>_closer.png
├── wavespeed-tasks.json            # task IDs + output URLs (for re-poll on failure)
├── caption.md                      # publishing-ready caption
└── post.md                         # Zernio post ID, slide CDN URLs, IG permalink
```

## Folder responsibilities

- `research/` — Source of truth for the format study. Keep raw API responses so you can re-analyze without re-paying credits. Downloaded reference images are for visual format comparison only — never reproduce them in any generated slide.
- `format.md` — The format rules extracted from the reference. Source of truth for step 03 (writing slide specs).
- `scenes/` — Source of truth for what each slide will be. Edit JSON, regenerate.
- `frames/` — Generated PNGs only. Treat as derivable output.
- `wavespeed-tasks.json` — Task IDs and CloudFront URLs from the gpt-image-2 calls. If your poll loop dies mid-run, this lets you re-poll instead of re-submit.
- `caption.md` — The publishing-ready caption + hashtags + CTA. Lock this before submitting the post.
- `post.md` — Snapshot of the Zernio post ID, the CDN slide URLs in order, the IG permalink once it propagates. Useful for review and re-posting.

## Naming conventions

- Slide filenames are 1-indexed: `slide_1_cover.json`, `slide_2_<topic>.json`. Closer is highest-numbered and named with the CTA word it carries (`slide_7_closer.json`).
- Frame filenames match their JSON: `slide_2_skin.json` → `slide_2_skin.png`.
- Reference research filenames mirror the source post identifier: `post_<shortcode>.json`, `images/slide_<N>.jpg` (1-indexed in carousel order).
