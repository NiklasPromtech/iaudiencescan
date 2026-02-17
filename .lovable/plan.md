

# Add Comparison Deltas to Holders, Dimension Table, and Bottom Tabs

## Problem

When comparison mode is active, percentage change deltas are shown for most scorecard metrics but **not** for:
1. **Token Holders** in the scorecard (shows "487" but no delta)
2. **Breakdown by Referrer table** - has a delta column for visitors only, but no deltas for engagement, wallets, or conversions columns
3. **Bottom tabs** (Events, Wallet Actions, Wallet Extensions, Wallet Distribution, Clicks) - no comparison data at all

## Changes

### 1. Token Holders delta in ScorecardChips

**File: `src/pages/Overview.tsx`**

The current period merges `token_holders` into the scorecard data (lines 531-548), but the comparison scorecard data doesn't get the same treatment. Fix: compute the comparison holder total from `comparisonData.holders` and merge it into the comparison scorecard data before passing to `ScorecardChips`.

### 2. Dimension Table - more delta columns

**File: `src/components/overview/DimensionTable.tsx`**

Currently only the Visitors column gets a delta (percentage change) column. Extend the comparison logic to show deltas for key metrics across each column group:
- Add a delta badge (inline, not a separate column) to each metric cell showing the % change vs the comparison row
- Modify `MetricCell` and `WalletMetricCell` to accept an optional `comparisonValue` prop and render the delta inline beneath the rate

### 3. Bottom tabs - pass comparison data through

**File: `src/pages/Overview.tsx`**

Pass comparison data to each bottom tab component:
- `EventsTable` gets `comparisonData.events`
- `WalletsOverviewTable` gets `comparisonData.wallets`
- `WalletExtensionsTable` gets `comparisonData.wallet_extensions`
- `WalletDistributionTable` gets `comparisonData.wallet_distribution`
- `ClicksTable` gets `comparisonData.clicks`

**Files: Each tab component**

Add an optional `comparisonData` prop to each component. When present, show a delta column or inline delta for the primary count metric (e.g., event_count, action_count, wallet_count, click_count).

## Detailed File Changes

### `src/pages/Overview.tsx`
- Compute comparison holder total from `comparisonData?.holders?.data?.data`
- Merge `token_holders` into comparison scorecard data before passing to `ScorecardChips`
- Pass comparison sub-results to each bottom tab component

### `src/components/overview/MetricCell.tsx`
- Add optional `comparisonCount` prop
- When present, render a small delta percentage below the rate row

### `src/components/overview/DimensionTable.tsx`
- Pass `comparisonMap` values into each `MetricCell` / `WalletMetricCell` as `comparisonCount`
- Remove the dedicated delta column for visitors (replace with inline delta in the MetricCell itself, consistent across all metrics)

### `src/components/overview/WalletDistributionTable.tsx`
- Add optional `comparisonData` prop (array of `WalletDistributionRow[]`)
- When present, show a delta column for wallet_count and total_usd

### `src/components/overview/EventsTable.tsx`
- Add optional `comparisonData` prop
- Match by event_name, show delta on event_count

### `src/components/overview/WalletsOverviewTable.tsx`
- Add optional `comparisonData` prop
- Match by action, show delta on action_count

### `src/components/overview/WalletExtensionsTable.tsx`
- Add optional `comparisonData` prop
- Match by extension_name, show delta on visitor_count

### `src/components/overview/ClicksTable.tsx`
- Add optional `comparisonData` prop
- Match by click_text + href, show delta on click_count

