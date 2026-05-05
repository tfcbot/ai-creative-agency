# 05 — Render HTML report

Single static `report.html` written to `<OUT>/report.html`. Embedded CSS, vanilla JS for sortable columns. No build step, no localhost.

See `references/html-report-spec.md` for the full column schema and a copyable template.

## Pass-in data

The script renders rows from the `watched` array (from step 4). Each row gets:

| Column | Source |
|---|---|
| Rank | index + 1 |
| Thumb | `item.thumbnail` (img tag, lazy-loaded, fixed 80×142 9:16 box) |
| Platform | `item.platform` (badge: TT orange / IG pink) |
| Views | `item.views.toLocaleString()` |
| Engagement | `(item.engagement_rate * 100).toFixed(1) + "%"` |
| Handle | `<a href="profile">@handle</a>` |
| Followers | `item.followers.toLocaleString()` (0 if IG — IG search doesn't expose) |
| Hook | `item.watch?.hook` |
| Format | `item.watch?.format` |
| Confirmed | green ✓ / red ✗ / grey ? based on `item.watch?.is_app` |
| Watch | `<a href={item.url} target="_blank">open</a>` |

## Sort

Click any column header → sort by that key. Re-click flips direction. Default sort: engagement rate desc.

## Render

After writing the file, log the absolute path:

```
✓ Report: /abs/path/find-app-ugc-outliers-2026-05-03T17-12-43/report.html
```

User opens that file directly in their browser. Do NOT spin up a local server.
