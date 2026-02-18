

# "Copy to AI" Button for Overview Data

## What It Does

Adds a small "Copy to AI" button near the date range picker on the Overview page. When clicked, it serializes all the currently loaded analytics data into a compact, token-efficient text format and copies it to your clipboard. You can then paste it into any AI chat (ChatGPT, Claude, etc.) to ask for analysis, insights, or a written update.

## Format Design

The export will be a compact plaintext summary -- not raw JSON -- to minimize token usage. Example output:

```text
AudienceScan Overview | example.com | Jan 10-17 2026 (vs Jan 3-10)

SCORECARD
Pageviews: 1,234 (+12%)  Visitors: 890 (+8%)  Bounce: 34% (-3%)
Wallets: 45 (+50%)  Conversions: 12 (+20%)  Holders: 487 (+5%)
Enriched: 38/45 (84%)  Median Balance: $2,400  Total Balance: $91,200

DAILY TREND (date | visitors | wallets | conversions)
Jan 10: 120 | 5 | 2
Jan 11: 135 | 7 | 3
...

TOP REFERRERS (source | visitors | delta | wallets | bounce%)
google.com: 340 +12% | 15 | 28%
twitter.com: 210 -5% | 22 | 41%
...

EVENTS (type | count | delta)
page_view: 1200 +10%
wallet_connect: 45 +50%
...

WALLET ACTIONS (action | count | delta)
...

CLICKS (text | url | count | delta)
...

WALLET DISTRIBUTION (tier | wallets | total_usd)
$0-100: 12 | $600
$100-1K: 18 | $9,000
...
```

## Technical Details

### New file: `src/lib/overview-export.ts`
- A pure function `formatOverviewForAI(...)` that takes all the state data (scorecard, tableData, dailyData, eventsData, walletsData, walletExtensionsData, walletDistributionData, clicksData, holderData, comparisonData, dateRange, websiteName) and returns a compact string
- Uses tab-separated values and abbreviations to keep token count low
- Includes comparison deltas inline when comparison mode is active
- Skips null/empty sections entirely

### Modified file: `src/pages/Overview.tsx`
- Import the formatter and `copyToClipboard` from export-utils
- Add a small button (clipboard icon + "Copy to AI") next to the date range picker
- On click: call `formatOverviewForAI(...)` with all current state, then `copyToClipboard(...)` with success toast "Copied overview data for AI"

### No new dependencies needed
- Uses existing `copyToClipboard` from `src/lib/export-utils.ts`
- Uses existing `lucide-react` icons (e.g., `ClipboardCopy`)
