# Zernio — Instagram carousel publishing

## Endpoints

```
GET  https://api.zernio.com/v1/accounts                              # list connected accounts
GET  https://api.zernio.com/v1/posts                                 # list previous posts
GET  https://api.zernio.com/v1/posts?id=<post_id>                    # single post status
POST https://api.zernio.com/v1/posts                                 # create / schedule a post
```

Auth header: `Authorization: Bearer $ZERNIO_API_KEY`

## Step 1 — Verify the target account

```
GET /v1/accounts
```

Response includes an array of connected accounts. For each account you'll see `_id`, `platform`, `username`, `displayName`, `profileId._id`, `isActive`. Filter for `platform === "instagram"` and `isActive === true` and pick the right username. Capture the account `_id` and `profileId._id` — both are required when creating the post.

## Step 2 — Create the post

```
POST /v1/posts
{
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
      "scheduledFor": "<ISO 8601 timestamp>",
      "platformSpecificData": {
        "instagramSettings": {
          "mediaType": "CAROUSEL_ALBUM",
          "shareToFeed": true
        }
      }
    }
  ],
  "hashtags": ["<tag1>", "<tag2>", "<tag3>"]
}
```

Returns HTTP 201 with the created post object including `_id`.

## Notes on the request body

- **`mediaType: "CAROUSEL_ALBUM"`** — required for multi-image carousels. Without it, Zernio publishes only the first image.
- **`scheduledFor`** — set to a future ISO timestamp for scheduling, or ~60 seconds from now to publish immediately. Setting it to "now" sometimes results in a race condition where the post is processed before media items are saved; ~60 seconds out is the safe default.
- **`shareToFeed: true`** — required for carousels to appear on the main feed (not just in the user's grid).
- **`hashtags`** — Zernio accepts these separately, but the publish behavior is to inline them into the caption. Including them in `caption.md` and leaving `hashtags: []` works too.
- **Order matters.** The `mediaItems` array order is the swipe order on Instagram. Verify slide 1 is the cover and the closer is last before submitting.

## Step 3 — Poll for status

After submission, poll the post's status:

```
GET /v1/posts?id=<post_id>
```

Status field walks: `pending` → `publishing` → `published` (or `failed`).

Inside `platforms[0].platformSpecificData`:

- `lastPublishStage` — granular state ("creating_container", "publishing", "completed")
- `pendingContainerId` — Instagram Graph API container ID
- `externalPostId` / `permalinkUrl` — set after Instagram confirms publication; can take 1–5 minutes after `status: "published"`
- `publishError` — set if Instagram rejects the container (caption too long, image format invalid, etc.)

## Common failure modes

- **`mediaType` mismatch** — passing `REELS` for an image carousel results in publish failure. Always `CAROUSEL_ALBUM` for image carousels.
- **Image fetch failure** — Zernio fetches the slide URLs from the public CDN. If a URL is presigned with a short expiry, the fetch fails partway through. Use stable URLs (see `vidjutsu-cdn.md`).
- **Caption length** — Instagram caps captions at 2200 characters including hashtags. Trim if hitting the limit.
- **No active account on platform** — verify `/v1/accounts` returned the account with `isActive: true`. If not, the user needs to reconnect in the Zernio app.

## Confirmation pattern

Before submitting any `POST /v1/posts`, surface the full request body in chat for the user to approve. Posting to a public account is high-blast-radius — confirm:

1. Caption text
2. Slide order (slide 1 = cover, last slide = CTA)
3. Target account (`username`)
4. Schedule time (now / specific time / drafts mode)

Only fire the request after explicit approval.

## Drafts mode

If the user prefers to push to drafts and publish manually from the phone (recommended for sensitive accounts), submit with `scheduledFor` set to a far-future date. The post stays in Zernio without going to Instagram, and the user can publish manually from the Zernio app or, on supported plans, push to the Instagram native drafts inbox via additional `instagramSettings`.
