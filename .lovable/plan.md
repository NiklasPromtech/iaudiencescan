

# Add Complete Comparison Deltas to "Copy to AI" Export

## Problem
The current export only includes deltas for some metrics. Several sections are missing comparison deltas when in comparison mode:

1. **Scorecard**: Missing deltas for `stayed_10s/30s/60s/5m`, `bot_visitors`, `wallets_enriched`, `median_balance_usd`, `total_balance_usd`, `visitors_with_wallet_extension`, `conversions_total`
2. **Daily Trend**: No deltas at all for any metric (visitors, wallets, conversions)
3. **Dimension Table**: Only visitors have deltas; missing for pageviews, wallets, bounce%, conversions, enriched, balance
4. **Wallet Extensions**: No deltas (comparison data is available but ignored)
5. **Wallet Distribution**: Missing delta on `total_usd`
6. **Clicks**: Missing delta on `unique_visitors`

## Changes

### File: `src/lib/overview-export.ts`

**Scorecard section** -- add deltas for all remaining fields:
- Engagement: `Stayed 10s: X (+Y%) 30s: X (+Y%) 60s: X (+Y%) 5m: X (+Y%)`
- Bots: `Bots: X (+Y%) / Z checked`
- Wallet extensions: `Wallet Ext: X (+Y%)`
- Conversions total: `Conv Total: X (+Y%)`
- Enrichment line: add deltas to `wallets_enriched`, `median_balance_usd`, `total_balance_usd`

**Daily Trend** -- add deltas per row by matching on the comparison map (already built but unused):
- Format: `2026-02-12: 7115 (+8%) | 5 (+25%) | 2 (+100%)`

**Dimension Table** -- add deltas for all metrics per row:
- Format: `source: 340 (+12%) | pv: 500 (+5%) | wallets: 15 (+50%) | bounce: 28%`

**Wallet Extensions** -- wire up `compWalletExtensionsRows` to show deltas:
- Build a comparison map keyed by `wallet_type` and show delta on count

**Wallet Distribution** -- add delta on `total_usd`:
- Format: `$0-100: 12 (+20%) | $600 (+15%)`

**Clicks** -- add delta on `unique_visitors`:
- Format: `link text: /url | clicks: 50 (+10%) | visitors: 30 (+5%)`

**Also**:
- Remove the `slice(0, 20)` cap on dimension rows and clicks so all data is exported
- Add `activeFilters` field to interface and print them in the header when present

### File: `src/pages/Overview.tsx`

- Pass `activeFilters` (the current filter state) into `formatOverviewForAI()`

