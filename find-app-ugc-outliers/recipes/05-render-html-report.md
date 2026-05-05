# 05 — Render HTML report

The HTML render is the only deterministic piece of this skill — it's pure JSON → HTML. Drive it via the bundled `render-report.ts`:

```bash
bun "$SKILL_DIR/render-report.ts" "$OUT/manifest.json" --out "$OUT/report.html"
```

`$SKILL_DIR` = the directory this `SKILL.md` lives in (the agent already knows it from invocation context).

The renderer reads `manifest.json` (whose shape is defined in recipe 06) and writes `report.html` with two sortable tables: UGC outliers ranked by engagement rate, and active Meta ads filtered by brand mention. Embedded CSS, vanilla JS — no build step, no localhost server.

For column schema and styling, see `references/html-report-spec.md`.

## Final output

Print the absolute path to `report.html`. The user opens it directly in their browser.

```
✓ Report: /abs/path/find-app-ugc-outliers-2026-05-05T17-12-43/report.html
```
