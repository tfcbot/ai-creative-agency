---
name: import-videos-csv
description: Bulk-fill TokPortal video slots from a CSV.
requires:
  env:
    - TOKPORTAL_API_KEY
homepage: https://github.com/tfcbot/ai-creative-lab
source: https://github.com/tfcbot/ai-creative-lab
---

# import-videos-csv

POST a CSV to /bundles/:id/videos/import-csv to bulk-fill slots.

## Providers

- **TokPortal** — https://developers.tokportal.com/llms.txt

## Steps

1. POST CSV to /bundles/:id/videos/import-csv

## Input

- account ID + CSV

## Output

- bulk slots filled
