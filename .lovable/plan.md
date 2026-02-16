

# Migrate Overview Page to Unified `/api/analytics/overview` Endpoint

## Summary

Replace the 11 separate API calls on the Overview page with a single `POST /api/analytics/overview` request for the initial page load. Individual endpoints are kept for pagination/sort changes on specific tables (e.g. dimension table with cost source, re-sorting clicks).

## What Changes

### 1. New API function in `src/lib/api.ts`

Add a `fetchOverview()` function that:
- Accepts a single request body matching the new endpoint spec (tag_id, range, filters, conversion_events, cost, and per-section sort/pagination options)
- Returns a typed response with all 11 sub-results, each wrapped in `{ success, data, error? }`
- Uses the existing `ANALYTICS_API_URL` and `getAuthToken()` pattern

### 2. Rewrite `loadAllData` in `src/pages/Overview.tsx`

**Before**: `loadAllData` fires 11 separate fetch calls (3 in parallel via `Promise.all`, then 6 sequential try/catch blocks, plus `loadCostSources` and `loadFilterOptions` called separately from the `useEffect`).

**After**: `loadAllData` makes a single `fetchOverview()` call, then distributes the response into the existing state variables:

| Response key | State setter | Fallback on failure |
|---|---|---|
| `scorecard.data` | `setScorecard()` | Show error |
| `table_date_day.data` | `setDailyData()` | Show error |
| `table_referrer_domain.data` | `setTableData()` | Show error |
| `filtering.data` | `setFilterOptions()` | Empty filters |
| `cost_sources.data` | `setCostSources()` | Empty array |
| `events.data` | `setEventsData()` | Empty state |
| `wallets.data` | `setWalletsData()` | Empty state |
| `wallet_extensions.data` | `setWalletExtensionsData()` | Empty state |
| `wallet_distribution.data` | `setWalletDistributionData()` | Empty state |
| `clicks.data` | `setClicksData()` | Empty state |
| `holders.data` | `setHolderData()` | Empty array |

Each sub-result is checked individually via `response.scorecard.success`, so partial failures are handled gracefully -- exactly how the page works today.

### 3. Keep individual endpoints for secondary interactions

These existing calls remain unchanged (they are not part of the initial page load):
- `loadTableData()` -- re-fetches dimension table when user changes dimension, cost source, or sorts
- `fetchRealtimeVisitors()` -- polled every 30s separately
- The old individual API functions stay in `api.ts` for use by other pages (Bots, Change, etc.)

### 4. Remove separate `loadCostSources` and `loadFilterOptions` calls

These are now included in the unified response (`cost_sources` and `filtering` keys), so the separate `useEffect` calls and dedicated load functions are removed from the Overview page.

## Technical Details

### New types added to `src/lib/api.ts`

```typescript
interface OverviewRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  conversion_events?: string[];
  cost?: { mode: string; keys?: Record<string,string>; cost_source_id?: string };
  table_date_day?: { sort?: {...}; limit?: number; offset?: number };
  table_referrer_domain?: { sort?: {...}; limit?: number; offset?: number };
  events_table?: { sort?: {...}; limit?: number; offset?: number };
  wallets_table?: { sort?: {...}; limit?: number; offset?: number };
  clicks_table?: { sort?: {...}; limit?: number; offset?: number };
  wallet_distribution?: { sort?: {...}; limit?: number; offset?: number };
  holders?: { contract_id?: string };
}

interface SubResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

interface OverviewResponse {
  success: boolean;
  tag_id: string;
  scorecard: SubResult<ScorecardResponse>;
  table_date_day: SubResult<TableResponse>;
  table_referrer_domain: SubResult<TableResponse>;
  filtering: SubResult<FilterOptionsResponse>;
  cost_sources: SubResult<{ cost_sources: CostSource[] }>;
  events: SubResult<EventsTableResponse>;
  wallets: SubResult<WalletsTableResponse>;
  wallet_extensions: SubResult<WalletExtensionsResponse>;
  wallet_distribution: SubResult<WalletDistributionResponse>;
  clicks: SubResult<ClicksTableResponse>;
  holders: SubResult<HoldersResponse>;
}
```

### Files modified

1. **`src/lib/api.ts`** -- Add `OverviewRequest`, `OverviewResponse`, `SubResult` types and `fetchOverview()` function
2. **`src/pages/Overview.tsx`** -- Rewrite `loadAllData` to use single endpoint; remove `loadCostSources` and `loadFilterOptions` as separate functions; simplify the main `useEffect`

### What stays the same

- All existing state variables and their types
- All child component props and rendering logic
- The `loadTableData` function for dimension table re-fetches
- Realtime visitor polling
- All other pages that use individual endpoints
- The individual API functions in `api.ts` (no deletion)

