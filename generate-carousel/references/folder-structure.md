# Working directory layout

Set this up at the project root (e.g. `~/products/<carousel-name>/`) before running any pipeline step. Every recipe assumes this layout.

```
<carousel-name>/
├── research/                  # raw scrape data + downloaded reference images
│   ├── posts.json             # /v1/instagram/user/posts response
│   ├── post_<shortcode>.json  # one file per /v1/instagram/post pull
│   └── images/                # downloaded slide images from reference posts
├── scenes/                    # one JSON spec per slide (slide-spec.md)
│   ├── slide_1_cover.json
│   ├── slide_2_<topic>.json
│   └── …
├── frames/                    # generated slide PNGs (output of gpt-image-2)
│   ├── slide_1_cover.png
│   ├── slide_2_<topic>.png
│   └── …
├── caption.md                 # the caption draft that pairs with the carousel
├── post.md                    # the Zernio publish payload (account id, slide URLs, schedule)
└── plan.md                    # rolling notes — what's locked, what's pending, format chosen
```

## Folder responsibilities

- `research/` — Source of truth for the format study. Keep raw API responses so you can re-analyze without re-paying for credits. Downloaded reference images are for visual format comparison only — do not reproduce them in any generated slide.
- `scenes/` — Source of truth for what each slide will be. Edit JSON, regenerate.
- `frames/` — Generated PNGs only. Treat as derivable output. Keep `_raw.png` intermediates only if you needed a post-crop step.
- `caption.md` — The publishing-ready caption + hashtags + CTA. Lock this before submitting the post.
- `post.md` — Snapshot of the Zernio API request body — account id, slide CDN URLs in order, schedule time, IG mediaType. Useful for review and re-posting.
- `plan.md` — Rolling notes — what's locked, what's pending, what was tried and rejected.

## Naming conventions

- Slide filenames are 1-indexed: `slide_1_<role>.json`, `slide_2_<topic>.json`. Cover is always `slide_1_cover.json`. Closer is the highest-numbered slide and named with the CTA word it carries (`slide_7_closer.json`).
- Frame filenames match their JSON: `slide_2_skin.json` → `slide_2_skin.png`.
- Reference research filenames mirror the source post identifier: `post_<shortcode>.json`, `images/<shortcode>_s<N>.jpg`.
