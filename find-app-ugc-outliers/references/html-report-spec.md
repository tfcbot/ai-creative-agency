# HTML report spec

Single-file static HTML at `<OUT>/report.html`. No build step, no localhost server — `open report.html` works.

## Columns

| # | Column | Source | Notes |
|---|---|---|---|
| 1 | Rank | row index + 1 | numeric |
| 2 | Thumb | `item.thumbnail` | 80px wide, 9:16 aspect, lazy-loaded `<img loading="lazy">` |
| 3 | Platform | `item.platform` | Badge: TT (`#fe2c55` bg, white text) / IG (gradient pink/orange) |
| 4 | Views | `item.views` | `toLocaleString()` |
| 5 | Engagement | `item.engagement_rate` | `(rate*100).toFixed(1) + "%"`, right-aligned |
| 6 | Handle | `item.handle` | linked: TT → `https://www.tiktok.com/@<handle>`, IG → `https://www.instagram.com/<handle>/` |
| 7 | Followers | `item.followers` | `toLocaleString()`. Show `—` if 0 (IG) |
| 8 | Hook | `item.watch?.hook` | wraps |
| 9 | Format | `item.watch?.format` | wraps |
| 10 | App? | `item.watch?.is_app` | ✓ green / ✗ red / ? grey |
| 11 | Watch | `item.url` | `<a target="_blank">open</a>` |

## Sort

Vanilla JS, no library. Click `<th data-sort="key">` → re-render `<tbody>` sorted by key. Re-click flips. Default sort: `engagement_rate` desc.

```html
<script>
  const data = /* injected JSON */;
  let sortKey = "engagement_rate", sortDir = -1;
  const tbody = document.querySelector("tbody");
  function render() {
    const rows = [...data].sort((a, b) => {
      const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
      return av < bv ? sortDir : av > bv ? -sortDir : 0;
    });
    tbody.innerHTML = rows.map(rowHTML).join("");
  }
  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const k = th.dataset.sort;
      if (k === sortKey) sortDir = -sortDir; else { sortKey = k; sortDir = -1; }
      render();
    });
  });
  render();
</script>
```

## Style

- Dark mode by default (creators look at this on phones late at night). `#0f0f0f` bg, `#e8e8e8` text.
- Sticky header.
- Row hover: subtle `#1a1a1a` highlight.
- Rows where `watch.is_app === false` get `opacity: 0.45` so false positives stay visible but recede.
- Failed-to-watch rows show `?` in the App? column with `opacity: 0.7`.

## Header

Top of the page:

```
<app_name> — UGC outliers
Generated 2026-05-03 17:12 UTC · 73 candidates · 10 watched · 7 confirmed
TikTok + Instagram only
```

Include a small "← regenerate via `find-app-ugc-outliers`" footer link to the GitHub README.

## What NOT to add

- No charts, no graphs. The table is the artifact.
- No exports beyond the JSON manifest. Don't add CSV / Sheets buttons until the user asks.
- No localhost server. `open report.html` is the contract.
