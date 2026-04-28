# Zernio — Instagram carousel publishing

Zernio is the multi-platform social publisher. This skill uses three Zernio endpoints:

- `GET /v1/accounts` — list connected accounts (find the target Instagram account)
- `POST /v1/posts` — create + publish (or schedule)
- `GET /v1/posts?id=<id>` — poll post status and retrieve the IG permalink

Auth header: `Authorization: Bearer $ZERNIO_API_KEY`

Base URL: `https://api.zernio.com`

## Step 1 — Verify the target account

```
GET /v1/accounts
```

Returns an array (top-level array, not `.data`). Each element has `_id`, `platform`, `username`, `displayName`, `profileId._id`, `isActive`. Filter for `platform === "instagram"` and `isActive === true` and pick the matching username.

You need both:

- `_id` — the account ID (passed as `accountId`)
- `profileId._id` — the profile ID (passed as `profileId`)

Both are required when creating the post.

## Step 2 — Create the post (immediate publish)

```
POST /v1/posts
{
  "publishNow": true,
  "content": "<the caption from caption.md>",
  "mediaItems": [
    { "type": "image", "url": "<slide 1 CDN URL>" },
    { "type": "image", "url": "<slide 2 CDN URL>" },
    …
  ],
  "platforms": [
    {
      "platform": "instagram",
      "accountId": "<account _id>",
      "profileId": "<profileId _id>",
      "platformSpecificData": {
        "instagramSettings": {
          "mediaType": "CAROUSEL_ALBUM",
          "shareToFeed": true
        }
      }
    }
  ],
  "hashtags": []
}
```

Returns HTTP 201 with the created post object including `_id`. With `publishNow: true`, status will be `"published"` immediately. The Instagram permalink populates in 1–5 minutes (poll for it).

## Step 2 — Create the post (scheduled)

Same payload but **drop `publishNow`** and add `scheduledFor` to both the top level and each platform entry:

```json
{
  "scheduledFor": "<ISO 8601 future timestamp>",
  "content": "…",
  "mediaItems": [ … ],
  "platforms": [
    {
      "platform": "instagram",
      "accountId": "…",
      "profileId": "…",
      "scheduledFor": "<same timestamp>",
      "platformSpecificData": { … }
    }
  ]
}
```

For drafts mode (held indefinitely): use a far-future `scheduledFor` like `"2027-01-01T00:00:00.000Z"`. Don't include `publishNow`.

## The `publishNow` gotcha (read this carefully)

`publishNow: true` is a **CREATE-only** parameter. It does **not** work on PUT/update.

What this breaks:

- POST without `publishNow` and a near-future `scheduledFor` → post lands as a draft, never publishes
- POST a draft, then PUT `publishNow: true` to "promote" it → silently ignored, stays as draft
- PUT `mediaItems` on a `scheduled` post → status demotes to `draft`, will not publish at the scheduled time

The fix:

- **For immediate publish:** POST with `publishNow: true`. Don't update afterward.
- **For scheduled publish:** POST with `scheduledFor` and no `publishNow`. Don't PUT.
- **For drafts:** POST with far-future `scheduledFor`.
- **To promote a draft to publish:** DELETE the draft and POST a fresh post with `publishNow: true`. PUT cannot promote.

## PUT — updating a draft

PUT `/v1/posts/<id>` works for editing draft content (caption, mediaItems) but always demotes status to `draft` regardless of what it was before. Use it for review-and-revise loops on drafts, then DELETE + POST to actually publish.

PATCH is not supported (returns HTTP 405).

## Step 3 — Poll for the Instagram permalink

```
GET /v1/posts?id=<post_id>
```

Inside `platforms[0].platformSpecificData`:

- `lastPublishStage` — granular state: `creating_container` → `publishing` → `completed`
- `pendingContainerId` — Instagram Graph API container ID
- `externalPostId` — the IG media ID, populates after Meta confirms publication
- `permalinkUrl` — the public IG URL (`https://www.instagram.com/p/<shortcode>/`), populates same time as `externalPostId`
- `publishError` — set if Meta rejects the container (caption too long, image format invalid, etc.)

Poll every 15s for up to 5 minutes. If `permalinkUrl` is still null, surface the post ID to the user and tell them it's propagating.

## Common failure modes

- **`mediaType` mismatch.** Passing `"REELS"` for an image carousel results in publish failure. Always `"CAROUSEL_ALBUM"` for image carousels.
- **Image fetch failure.** Zernio fetches slide URLs from the public CDN. If a URL is presigned with a short expiry or pointing to local storage, the fetch fails partway through. Use stable CDN URLs (see `vidjutsu-cdn.md`).
- **Caption length.** Instagram caps captions at 2200 characters including hashtags. Trim if hitting the limit.
- **No active account on platform.** Verify `/v1/accounts` returned the account with `isActive: true`. If not, the user needs to reconnect in the Zernio app.

## Confirmation pattern

Before submitting any `POST /v1/posts`, surface the full request body in chat for user approval. Posting to a public account is high-blast-radius — confirm:

1. Caption text
2. Slide order (slide 1 = cover, last slide = CTA)
3. Target account (`username`)
4. Schedule time (now / specific time / drafts mode)

Only fire the request after explicit approval.

## Output

Save the response to `post.md`:

```markdown
# Published carousel

- Zernio post ID: <_id>
- Status: published
- Account: @<username>
- Slides (in order):
  1. <CDN URL>
  …
- Caption: see caption.md
- Instagram permalink: <permalinkUrl, once propagated>
```

## Cost

Free per publish on the included Zernio plan.
