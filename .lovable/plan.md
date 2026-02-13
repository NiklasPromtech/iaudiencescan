
## Fix: CORS error on Report V2 API call

The "Failed to fetch" error is caused by a wrong API base URL. The Change.tsx page calls `https://api.audiencescan.xyz/analytics/report/v2`, but all other analytics endpoints in the project use `https://cdn.audiencescan.io/api` (defined as `ANALYTICS_API_URL` in `src/lib/api.ts`). The `.xyz` domain likely doesn't have CORS configured for the Lovable preview origin.

### Changes

**File: `src/pages/Change.tsx`**
- Change the `REPORT_V2_URL` constant from `https://api.audiencescan.xyz/analytics/report/v2` to `https://cdn.audiencescan.io/api/analytics/report/v2` to match the working base URL used by all other API calls in the project.

That single line change should resolve the CORS/fetch failure for both Basic and Advanced modes, since they both use the same `callV2Api` function.
