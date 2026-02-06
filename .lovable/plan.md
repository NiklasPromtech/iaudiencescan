
# Smart Data Caching for Dashboard Pages

## Overview
Implement React Query caching across all dashboard pages to eliminate unnecessary reloads when navigating between pages. Data will be cached and shown instantly, with background refreshes when needed.

## What This Fixes
- No more loading spinners when navigating back to a page you just visited
- Instant page loads during demos
- Data still updates when it actually changes (create, edit, delete operations)
- Active scans still poll for updates

---

## Technical Changes

### 1. Configure QueryClient with Smart Defaults

**File: `src/App.tsx`**

Update the QueryClient with caching settings:
- `staleTime: 2 minutes` - Data is fresh for 2 minutes (no refetch on navigation)
- `gcTime: 10 minutes` - Cached data kept for 10 minutes after unmount
- `refetchOnWindowFocus: false` - Prevent refetch when switching browser tabs

### 2. Create Custom Hooks for Each Data Type

Create a new file `src/hooks/use-dashboard-queries.ts` with React Query hooks:

```text
+-------------------------------+
|   use-dashboard-queries.ts    |
+-------------------------------+
| useScans(websiteId)           |
| useAudiences(websiteId)       |
| useTouchpoints(websiteId)     |
| useContracts(websiteId)       |
| useCostSources(websiteId)     |
+-------------------------------+
```

Each hook will:
- Return cached data instantly if available
- Provide `refetch()` for manual refresh
- Provide mutation helpers that invalidate cache after create/edit/delete

### 3. Update Dashboard Pages

**Pages to update:**
- `Scans.tsx` - Replace `useState` + `useEffect` with `useScans()`
- `Audiences.tsx` - Replace with `useAudiences()`
- `Touchpoints.tsx` - Replace with `useTouchpoints()`
- `Contracts.tsx` - Replace with `useContracts()`
- `Costs.tsx` - Replace with `useCostSources()`

**For each page:**
- Remove local `useState` for data and loading
- Remove `useEffect` that fetches on mount
- Replace `fetchX()` callback with the hook
- Pass `refetch` to dialogs instead of custom callbacks

### 4. Handle Mutations (Create/Edit/Delete)

When data is modified (create, edit, delete), the cache must be invalidated:

```tsx
// In dialog components after successful save:
queryClient.invalidateQueries({ queryKey: ["scans", websiteId] });
```

This triggers an immediate refetch so the list updates.

### 5. Special Case: Active Scans Polling

For the Scans page, maintain polling when scans are processing:

```tsx
const { data: scans } = useScans(websiteId, {
  // Poll every 5 seconds if any scan is active
  refetchInterval: scans?.some(s => s.status === "PROCESSING") ? 5000 : false,
});
```

---

## Cache Behavior Summary

| Action | Behavior |
|--------|----------|
| Navigate to page | Show cached data instantly, no loader |
| Data older than 2 min | Background refetch (no loader) |
| Create/Edit/Delete | Cache invalidated, fresh fetch |
| Manual refresh button | Force refetch |
| Processing scan | Poll every 5 seconds |
| Website switch | New query key, fresh fetch |

---

## Files to Create/Modify

1. **Create** `src/hooks/use-dashboard-queries.ts` - All query hooks
2. **Modify** `src/App.tsx` - QueryClient defaults
3. **Modify** `src/pages/Scans.tsx` - Use `useScans` hook
4. **Modify** `src/pages/Audiences.tsx` - Use `useAudiences` hook
5. **Modify** `src/pages/Touchpoints.tsx` - Use `useTouchpoints` hook
6. **Modify** `src/pages/Contracts.tsx` - Use `useContracts` hook
7. **Modify** `src/pages/Costs.tsx` - Use `useCostSources` hook
8. **Modify** Dialog components - Add cache invalidation after mutations

---

## User Experience After Changes

1. First visit to Scans page: Normal load with skeleton
2. Navigate to Audiences: Normal load (first visit)
3. Navigate back to Scans: **Instant** - shows cached data
4. Create new scan: List updates immediately
5. Switch websites: Fresh fetch (different cache key)
6. Leave page for 10+ minutes: Fresh fetch on return
