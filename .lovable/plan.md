

# Update API Keys Page Instructions

Remove `tag_id` from the example request and update the supported endpoints list, since the edge function will auto-inject the `tag_id` from the API key's linked website.

## Changes

### `src/pages/ApiKeys.tsx`

1. Update the curl example to remove `tag_id` from the request body -- callers only need to send `range` (and any other non-tag params)
2. Update the "Supported endpoints" line to show only `/analytics/scorecard` and `/analytics/table`

### `supabase/functions/api-proxy/index.ts`

1. After key validation, query the `websites` table for the `tag_id` using `keyRow.website_id`
2. Parse the incoming JSON body, inject the resolved `tag_id`, and forward
3. Trim `ALLOWED_PATHS` to only `/analytics/scorecard` and `/analytics/table`
4. Remove the `/analytics/tracking-status/*` wildcard check

### Updated curl example will look like:

```text
curl https://wksyyydmgpcaxdijalqf.supabase.co/functions/v1/api-proxy/analytics/scorecard \
  -H "Authorization: Bearer as_k_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"range":{"type":"last_full_days","days":7,"timezone":"UTC"}}'
```

No new files. Two files modified.

