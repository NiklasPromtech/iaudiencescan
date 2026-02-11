

# Update Report for New API Fields: absolute_delta, low_confidence, smoothed uplift

## What's Changing

The backend now returns three new fields on every breakdown metric (`visitors`, `conversions`, `wallets`):
- `absolute_delta` -- the raw daily difference (event - baseline)
- `low_confidence` -- boolean flag when sample size is too small
- `uplift_percent` -- now smoothed (pseudo-counts), more conservative for small samples

We need to update three areas to use these properly:

1. **TypeScript interfaces** -- add the new fields
2. **FocusedBreakdownTable** (conversion_event + wallet_action) -- show absolute_delta as primary metric, de-emphasize low confidence rows
3. **CountryMapChart + country breakdown** -- use absolute_delta for map coloring and sorting
4. **Generic BreakdownTable** -- same treatment for other breakdowns (utm_source, etc.)
5. **Sorting** -- change from uplift_percent to |absolute_delta| everywhere

## Technical Details

### 1. Update `BreakdownMetric` interface (both files)

Add the new fields to the shared interface in `IncrementalityResultsView.tsx` and `FocusedBreakdownTable.tsx`:

```typescript
interface BreakdownMetric {
  baseline_daily_avg: number;
  event_daily_avg: number;
  uplift_percent: number;
  absolute_delta?: number;    // NEW
  low_confidence?: boolean;   // NEW
}
```

### 2. FocusedBreakdownTable.tsx changes

- **Sort by** `|absolute_delta|` descending instead of `event_daily_avg`
- **Primary display**: Show `absolute_delta` with a +/- sign (e.g., "+157.7/day") alongside the comparison bars
- **Low confidence rows**: Reduce opacity to 50%, append "(uncertain)" badge next to the uplift
- **Uplift column**: Use the smoothed `uplift_percent` as-is (it's already conservative)

### 3. CountryMapChart data mapping

In `IncrementalityResultsView.tsx` where country data is mapped to the chart (around line 635-641), use `absolute_delta` for the `incremental` field instead of computing it manually. Also pass `low_confidence` to the tooltip.

### 4. Generic BreakdownTable

Update the existing `BreakdownTable` component in `IncrementalityResultsView.tsx` to:
- Sort by `|absolute_delta|` on the visitors metric
- Show absolute_delta as the primary number
- Grey out low_confidence rows

### 5. Breakdown accordion sorting (line 611-615)

Change the sort from `uplift_percent` to `|absolute_delta|`:
```typescript
const sorted = [...data].sort((a, b) => {
  const aD = Math.abs(a.visitors?.absolute_delta ?? 0);
  const bD = Math.abs(b.visitors?.absolute_delta ?? 0);
  return bD - aD;
});
```

### Files Modified

| File | Changes |
|------|---------|
| `src/components/touchpoints/IncrementalityResultsView.tsx` | Update `BreakdownMetric` interface, change sort logic, update country map data mapping, update generic BreakdownTable |
| `src/components/touchpoints/FocusedBreakdownTable.tsx` | Update interface, sort by absolute_delta, show delta as primary metric, grey out low confidence rows |

### No new dependencies needed.

