
# API Key Access for AI Assistants

Allow users to generate API keys so external AI tools (like OpenClaw) can query their AudienceScan data through a Supabase edge function proxy.

## User Experience

1. User navigates to Settings, clicks "AI Assistant Access"
2. On the API Keys page, they click "Create API Key", pick a website, give it a label
3. The key is shown once (prefixed `as_k_...`) -- user copies it and gives it to their AI tool
4. AI tool calls the edge function proxy with the key; the proxy validates and forwards to `cdn.audiencescan.io/api`
5. User can view active keys (prefix only) and revoke them

## Database Setup (manual via Supabase SQL Editor)

Create an `api_keys` table:
- `id` (uuid, PK, default gen_random_uuid())
- `user_id` (uuid, FK to auth.users, NOT NULL)
- `website_id` (uuid, FK to websites, NOT NULL)
- `key_hash` (text, NOT NULL) -- SHA-256 of the full key
- `key_prefix` (text, NOT NULL) -- first 8 chars for display
- `label` (text) -- user-given name like "OpenClaw prod"
- `created_at` (timestamptz, default now())
- `last_used_at` (timestamptz, nullable)
- `revoked_at` (timestamptz, nullable)
- RLS enabled: users can only SELECT/INSERT/UPDATE their own keys

## New Files

### `src/pages/ApiKeys.tsx`
- Protected page showing the key management UI
- "Create API Key" button opens the create dialog
- Lists existing keys via `ApiKeyList` component
- Instructions section explaining how AI tools should use the key

### `src/components/settings/CreateApiKeyDialog.tsx`
- Dialog with website selector (from existing `listWebsites` API) and label input
- On submit: generates a random key (`as_k_` + 40 random hex chars), hashes it with SHA-256, stores the hash + prefix + metadata in the `api_keys` table
- Shows the full key once in a copyable field with a warning it won't be shown again

### `src/components/settings/ApiKeyList.tsx`
- Fetches keys from `api_keys` table (where `revoked_at` is null)
- Displays: key prefix, label, website name, created date, last used date
- Revoke button sets `revoked_at` to now

### `supabase/functions/api-proxy/index.ts`
- Accepts `Authorization: Bearer as_k_...` header
- Hashes the provided key, looks it up in `api_keys` using the Supabase service role client
- If valid and not revoked: updates `last_used_at`, resolves the `user_id` and `website_id`
- Forwards the request to `cdn.audiencescan.io/api` with `X-User-Id` and `X-Service-Key` headers (you will need to add a `API_PROXY_SERVICE_KEY` secret and support these headers on your backend)
- Supported proxy paths: `/analytics/scorecard`, `/analytics/table`, `/analytics/bots`, `/analytics/tracking-status/*`

## Modified Files

### `src/pages/Settings.tsx`
- Add a new card: "AI Assistant Access" with a `Key` icon, linking to `/settings/api-keys`

### `src/App.tsx`
- Add route: `/settings/api-keys` wrapped in `RequireAuth`, rendering `ApiKeys`

### `supabase/config.toml`
- Add `[functions.api-proxy]` with `verify_jwt = false` (key-based auth instead)

## Backend Requirement (your side)

Your `cdn.audiencescan.io` backend needs to accept two new headers:
- `X-Service-Key`: a shared secret you set as `API_PROXY_SERVICE_KEY` in Supabase secrets
- `X-User-Id`: the authenticated user's UUID

When both are present and the service key is valid, the backend should treat the request as authenticated for that user. This replaces the normal JWT flow for proxy requests only.

## Security Considerations

- Keys are never stored in plaintext -- only SHA-256 hashes
- Full key shown exactly once at creation time
- Keys are scoped to a specific website
- Revocation is immediate (soft delete via `revoked_at`)
- Edge function uses service role only for key lookup, not for data access
- Rate limiting can be added later at the edge function level
