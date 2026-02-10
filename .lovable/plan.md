

# Add Metric Switcher to Timeline Range Chart

## What changes

Add a small toggle above the chart letting users switch which metric the area chart visualizes: **Pageviews**, **Events**, or **Wallets**. Currently it always shows pageviews.

## How it works

A row of three small pill buttons (similar to a segmented control) will sit between the description text and the chart. Selecting one changes the area chart's `dataKey` and updates the gradient colors slightly so each metric feels distinct.

The tooltip already shows all three metrics on hover -- that stays unchanged.

## Technical details

**File to modify:** `src/components/overview/TimelineRangeChart.tsx`

1. **Add state**: `useState<"pageviews" | "events" | "wallets">("pageviews")`

2. **Render toggle buttons** between the description paragraph and the chart div -- three small buttons using existing styling patterns (e.g., `bg-muted` inactive, `bg-primary text-primary-foreground` active), with the Eye/Zap/Wallet icons already imported.

3. **Swap `dataKey`** on the `<Area>` component from the hardcoded `"pageviews"` to the selected metric state variable.

4. **No other files change** -- the data shape (`DailyBreakdownItem`) already contains `pageviews`, `events`, and `wallets` fields, so no API or type changes are needed.

