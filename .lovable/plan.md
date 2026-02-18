

# Export ALL Backend Fields with Full Comparison Deltas

## What's Missing Today

The export currently cherry-picks a handful of fields from each section while the backend returns much more. Here's what gets dropped:

**Daily Trend** -- only exports 3 of 18 fields:
- Missing: pageviews, bounce_count, bot_visitors/bot_checked, stayed_10s/30s/60s/5m, conversions_total, cost_total, wallets_enriched, percent_enriched, total/median_balance_usd, visitors_with_wallet_extension

**Dimension Table** -- missing 9 fields:
- Missing: conversions_total, bot_visitors/bot_checked, stayed_10s/30s/60s/5m, cost_total, total_balance_usd, visitors_with_wallet_extension

**Events** -- missing unique_users, first_seen, last_seen

**Wallet Actions** -- missing unique_wallets (with delta), first_seen, last_seen

**Wallet Distribution** -- missing percentage field

**Clicks** -- missing page_path

**Holders** -- collapsed to a single number instead of the full time series with chain and contract info

**Scorecard** -- missing wallets_not_enriched, wallets_enrichment_failed

Every one of these fields will also include a comparison delta when comparison mode is active.

## Changes

### File: `src/lib/overview-export.ts`

**formatDailyTrend** -- rewrite to export all non-null fields per row with deltas:
```
DAILY TREND
2026-02-17: pv 7527 (+5%) | vis 5940 (+8%) | bounce 2291 (-3%) | stayed10s 1761 (+12%) | stayed30s 942 (+10%) | stayed60s 637 (+7%) | stayed5m 277 (+15%) | bots 165 (-20%)/6107 | wallets 1 | enriched 1 (100%) | med_bal $8,071 | tot_bal $24,212 (+30%) | wallet_ext 7 (+40%) | conv 0 | conv_tot 0
```
Null fields are skipped to keep output compact.

**formatDimensionTable** -- add all missing fields with deltas:
- conversions_total, bot_visitors/bot_checked, stayed_10s/30s/60s/5m, cost_total, total_balance_usd, visitors_with_wallet_extension

**formatEvents** -- add unique_users (with delta), first_seen, last_seen

**formatWalletActions** -- add unique_wallets (with delta), first_seen, last_seen

**formatWalletDistribution** -- add percentage field

**formatClicks** -- add page_path to each row

**formatScorecard** -- add wallets_not_enriched, wallets_enrichment_failed (with deltas)

**New: formatHolderTrend** -- export full time series instead of a single total:
```
HOLDER TREND (date | chain | contract | count)
2026-02-18: eth-mainnet | 0xC974...Cedd | 486
2026-02-17: eth-mainnet | 0xC974...Cedd | 482
```

All of these changes are in a single file: `src/lib/overview-export.ts`. No other files need changes since all the data is already being passed through from the Overview page.
