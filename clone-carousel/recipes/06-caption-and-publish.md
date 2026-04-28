# 06 — Caption and publish

Draft a caption modeled on the reference's caption pattern (not its words), confirm the publish payload with the user, and fire `POST /v1/posts` to Zernio with `publishNow: true`.

## Steps

1. **Draft the caption.** Use the caption pattern from `format.md` — same hook shape, same payoff length, same CTA mechanic — but write it for the user's brand. Save to `caption.md`.
2. **List Zernio accounts** and pick the target Instagram account. See `references/zernio-publish.md` for the `/v1/accounts` request and the fields you need (`_id`, `profileId._id`, `isActive`, `username`).
3. **Build the create-post payload.** Slide URLs in carousel order, account IDs, `mediaType: "CAROUSEL_ALBUM"`, `shareToFeed: true`, `publishNow: true`. Full schema in `references/zernio-publish.md`.
4. **Surface the payload to the user for approval BEFORE firing.** Posting to a public account is high-blast-radius. Show: caption, slide order, target username, schedule (immediate or future). Wait for explicit go.
5. **Fire `POST /v1/posts`.** Capture the post `_id` in the response. With `publishNow: true` you should see `status: "published"` and `platforms[0].status: "published"` immediately.
6. **Poll for the Instagram permalink.** `GET /v1/posts?id=<post_id>` returns `platforms[0].platformSpecificData.permalinkUrl` once Meta confirms publication. Can take 1–5 minutes. Don't loop forever — surface the post ID and tell the user the permalink is propagating.

## The `publishNow` gotcha

`publishNow: true` is a CREATE-only parameter. It does not work on PUT.

Failure modes you will hit if you skip this:

- Creating with no `publishNow` and a near-future `scheduledFor` lands the post as a draft. Status stays `draft`, publish never fires.
- Editing the post after creation with PUT to add `publishNow: true` is silently ignored. Status stays `draft`.
- Updating `mediaItems` on a post via PUT demotes the status from `scheduled` to `draft`. The post will not publish at the scheduled time.

The fix:

- For immediate publish: POST with `publishNow: true`. Don't update afterward.
- For scheduled publish: POST with `scheduledFor: <ISO future>` (no `publishNow`). Don't PUT.
- For draft mode: POST with `scheduledFor: <far-future ISO>` (e.g. 2027-01-01).
- If you've already created a draft and want to publish, **delete and recreate** with `publishNow: true`. PUT will not promote a draft to scheduled.

## Regenerating one slide on a draft

If the user previews a draft and wants one slide redone:

1. Regenerate just that slide (gpt-image-2, single submission)
2. Re-upload to VidJutsu CDN, capture the new URL
3. PUT the full `mediaItems` array on the existing draft, with the new URL replacing the old one in carousel order
4. Confirm the user is happy
5. **Delete the draft and POST a fresh post with `publishNow: true`.** Don't try to PUT-then-publish — see the gotcha above.

## Caption rules

- Mirror the reference structure, not its content. Same shape, fresh words.
- Length should match — if the reference is 4 lines, your caption is 4 lines.
- The CTA in the caption must match the closer slide's CTA mechanic. If the closer says "comment 'PROMPTS' for the prompts," the caption opens with the same ask.
- Hashtags: 5–10 in the same category mix as the reference. If the reference uses 4 niche hashtags + 4 broad-category hashtags, yours does too.
- Length cap: 2200 characters including hashtags. Trim if you hit the limit.

## Confirmation pattern

Before firing `POST /v1/posts`, surface this to the user:

```
About to publish:
  Account: @<username>
  Caption: <full caption text>
  Slides: <N> (in this order)
  Schedule: <immediate / specific timestamp / draft>

Reply "publish" to fire, or tell me what to change.
```

Only fire after explicit approval.

## Output

After publish succeeds, save `post.md` with:

- Zernio post `_id`
- Instagram permalink (once polled)
- The full payload used (for debugging or re-publish)

## Cost

Free per publish on the included Zernio plan.
