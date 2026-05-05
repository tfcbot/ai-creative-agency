# 06 — Render HTML report

Drive the render via the bundled `render-report.ts`:

```bash
bun "$SKILL_DIR/render-report.ts" "$OUT/manifest.json" --out "$OUT/report.html"
```

`$SKILL_DIR` = the directory this `SKILL.md` lives in.

## What renders

1. **Pattern section (top of page)** — synthesized format, shared hook archetype, shared shot beats, bio CTA pattern, outliers, suggested format with concrete shot list. Drawn from `manifest.pattern`.
2. **Verified videos table** — only rows where `watch.is_app === true`. Each row plays the video inline via `<video controls preload="metadata" src="${cdn_url}">`. The user can watch the MP4 in the report without leaving the page.

Unverified and `is_app: false` rows are NOT rendered. They live in the manifest under `verified[]` for debugging only.

## Inline video player

Every confirmed entry's `cdn_url` (the Supabase URL from recipe 04) is a stable, embeddable MP4 that doesn't gatekeep — the same property that lets VidJutsu read it lets the browser play it. The renderer drops a 9:16 `<video>` element per row with native controls.

The user clicks play, watches the video, reads the hook + format + bio CTA columns next to it. No tab-switching, no waiting for TikTok's app sheet to load.

## Final output

Print the absolute path:

```
✓ Report: /abs/path/find-app-ugc-outliers-<ts>/report.html
```

For column schema and styling, see `references/html-report-spec.md`.
