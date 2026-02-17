

# Move Sort and Pagination Client-Side (Fetch All Wallets Once)

## Problem

Currently, `sortBy`, `sortDir`, and `currentPage` are in the `loadWallets` dependency array, meaning every sort change or page navigation triggers a new backend request. Since we've already moved search, chains, types, and balance filters to client-side, sorting and pagination are the last remaining unnecessary API calls.

## Approach

Fetch **all** wallet rows in a single request (remove `limit`/`offset` from the API call), then handle sorting and pagination entirely client-side. This means:

- One API call when the page loads or the date range / website changes
- Everything else (search, filter, sort, paginate) happens instantly in the browser

## Changes to `src/pages/Wallets.tsx`

### 1. Remove sort and pagination from the API call

- Remove `sort_by`, `sort_dir`, `limit`, `offset` from the `fetchWallets` params
- Remove `sortBy`, `sortDir`, `currentPage` from the `loadWallets` dependency array
- Keep only `selectedWebsite` and `dateRange` as triggers for a new fetch

### 2. Add client-side sorting

After the existing `.filter()` chain, add a `.sort()` step that compares rows by the selected `sortBy` field and `sortDir`.

### 3. Add client-side pagination

After sorting, `.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)` to show only the current page.

### 4. Fix total count for pagination

The pagination footer currently uses `totalRows` from the API. After client-side filtering, `totalRows` should reflect the filtered count, not the raw API total. Compute this from the filtered array length so the "Showing X-Y of Z" text and page buttons stay accurate.

### 5. Reset page on filter/sort changes

Sorting or filter changes should reset `currentPage` to 0. The `handleSort` function already does this. The filter `onChange` handlers already do this too.

## Risk consideration

If a website has thousands of wallets, fetching all at once could be slow. However, the current pagination is 50 rows, and the typical dataset appears manageable. If needed in the future, a hybrid approach (server-side for large sets) can be added back.

