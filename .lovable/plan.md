

# Interactive Timeline Chart with Pageview Data for Basic View

## What it does

Replace the plain slider with a beautiful area chart showing daily pageviews over the entire tracking period. Users drag two handles (start/end) directly on or below the chart so they can visually see traffic spikes and choose meaningful date ranges -- "oh, we got more users here, let's figure out why."

## How it works

1. **Update the API type and response handling** to include `daily_breakdown` and `total_tracked`
2. **Build a mini area chart** (using Recharts, already installed) showing pageviews per day across the full tracking window
3. **Overlay the slider** beneath the chart, aligned to the same date axis, so dragging handles visually highlights the selected period
4. **Highlight the selected range** on the chart with a colored fill vs muted for outside the range
5. **Show summary stats** for the selected period (total pageviews, events, wallets in the selected window)

## Visual layout

```text
+--------------------------------------------------+
|  Select your analysis period                      |
|                                                   |
|  ▁▂▃▅▇█▇▅▃▂▁▂▃▅▇███▇▅▃▂▁  <-- area chart        |
|  (muted) |  (highlighted)  | (muted)             |
|          [====|============|====]  <-- slider      |
|  Jan 15   Start: Jan 22    End: Feb 9   Feb 9     |
|                                                   |
|  Selected period: 18 days                         |
|  12,400 pageviews · 890 events · 210 wallets      |
|                                                   |
|  [x] Exclude bot traffic                          |
|                                                   |
|           [ Get Insights ]                        |
+--------------------------------------------------+
```

## Technical details

**File: `src/lib/api.ts`**
- Add `DailyBreakdownItem` interface: `{ date: string; pageviews: number; events: number; wallets: number; total: number }`
- Update `TrackingStatusResponse` to include `total_tracked: number` and `daily_breakdown: DailyBreakdownItem[]`

**File: `src/pages/Change.tsx`**
- Import `AreaChart`, `Area`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`, `ReferenceArea` from `recharts`
- Replace the plain `Slider` section in Basic view with:
  - A `ResponsiveContainer` + `AreaChart` rendering `daily_breakdown` as a smooth area chart
  - Use `ReferenceArea` to highlight the selected date range on the chart (purple/primary fill)
  - The chart area outside the selection stays muted/gray
  - Below the chart, keep the `Slider` with dual handles, visually aligned
  - Show formatted start/end date labels below the slider handles
- Compute summary stats for the selected range by slicing `daily_breakdown` between start and end offsets, summing pageviews/events/wallets
- Display the summary in a clean stats row below the slider
- The chart uses `ChartContainer` and `ChartTooltip` from the existing chart components for consistent styling

