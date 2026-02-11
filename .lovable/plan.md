
# Fix: Pages Feel Like They Don't Update When Navigating

## Root Cause

There are two data-fetching patterns in the app, and one of them is causing the "nothing updates" feeling:

**Pattern 1 — Manual `useEffect` + `useState`** (Overview, Bots, Change, Wallets)
These pages refetch data every time they mount. They work correctly but show a brief loading state that can flash too quickly to notice.

**Pattern 2 — React Query hooks** (Scans, Audiences, Costs, Contracts, Touchpoints)
These pages use `useScans()`, `useAudiences()`, `useCostSources()`, etc. from `use-dashboard-queries.ts`. The global React Query config in `App.tsx` sets:

```
staleTime: 2 * 60 * 1000  // 2 minutes — data is "fresh" for 2 minutes
refetchOnWindowFocus: false
```

This means when you navigate from Overview to Scans, then back and forth, React Query serves the cached data without refetching for 2 full minutes. The page appears instantly with the same data and zero loading indicators — making it feel like nothing happened.

## The Fix

### 1. Reduce `staleTime` to 0 in `App.tsx`
Setting `staleTime: 0` means data is always considered stale. React Query will still show cached data instantly (no loading flicker), but immediately triggers a background refetch. If the data changed, the UI updates seamlessly. The `gcTime` stays at 10 minutes so cached data is still available for instant display.

### 2. Enable `refetchOnMount: 'always'`
This ensures every page navigation triggers a refetch, even if the data was just fetched. Combined with staleTime 0, the user always sees a background refresh happening.

### 3. Add a subtle refetch indicator to key pages
Since background refetches won't show a full loading skeleton (cached data is shown), add a small animated indicator (like a spinning refresh icon in the page header) when `isFetching && !isLoading` — meaning data is being refreshed in the background. This gives the user visual confirmation that the page is alive and updating.

Apply this to:
- **Scans** page — show a subtle spinner next to the "Refresh" button when `isFetching`
- **Audiences** page — same pattern
- The other react-query pages (Costs, Contracts, Touchpoints) can get the same treatment

## Technical Details

| File | Change |
|------|--------|
| `src/App.tsx` | Change `staleTime` from `2 * 60 * 1000` to `0`, add `refetchOnMount: 'always'` |
| `src/pages/Scans.tsx` | Use `isFetching` from `useScans` to show subtle background refresh indicator on the Refresh button |
| `src/pages/Audiences.tsx` | Use `isFetching` from `useAudiences` to show background refresh indicator |
| `src/pages/Costs.tsx` | Same pattern with `useCostSources` |

The changes are small but the difference is significant: every page navigation will now visibly trigger a data refresh, making the app feel responsive and alive.
