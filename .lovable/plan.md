

# Add `time_on_site` Breakdown Dimension

## What Changes

Add "Time on Site" as a new dimension option across the Overview page's DimensionTable dropdown and the Measure Change / Incrementality breakdown selectors.

## 1. Add `time_on_site` to the `TableDimension` type

In `src/lib/api.ts`, extend the `TableDimension` union type to include `"time_on_site"`.

## 2. Add to DimensionTable dropdown (Overview page)

In `src/components/overview/DimensionTable.tsx`, add a new entry to `DIMENSION_OPTIONS`:

```text
{ value: "time_on_site", label: "Time on Site" }
```

This automatically makes it available in the dimension `<Select>` on the Overview page. The existing `fetchTableData` call will send `dimension: "time_on_site"` and the API will return rows with `dim_value` keys like `"0-10s"`, `"10-30s"`, `"30s-1m"`, `"1-5m"`, `"5m+"`.

## 3. Add to Measure Change breakdown options

In `src/pages/Change.tsx`, add to `BREAKDOWN_OPTIONS`:

```text
{ value: "time_on_site", label: "Time on Site" }
```

Also include `"time_on_site"` in the default `breakdowns` array for basic mode (line ~381).

## 4. Add to Incrementality Analysis breakdown options

In `src/components/touchpoints/IncrementalityAnalysisDialog.tsx`, add to `BREAKDOWN_OPTIONS`:

```text
{ value: "time_on_site", label: "Time on Site" }
```

## 5. Add to Incrementality Results rendering

In `src/components/touchpoints/IncrementalityResultsView.tsx`, add to `breakdownConfig`:

```text
{ key: 'time_on_site', title: 'Time on Site', icon: Clock }
```

(Import `Clock` from lucide-react if not already imported.)

## 6. Add to filter dimension mapping

In `src/lib/api.ts`, add `time_on_site` to `DIMENSION_TO_FILTER` if needed for click-through filtering (may map to itself or be omitted if no filter equivalent exists).

## Technical Summary

| File | Change |
|------|--------|
| `src/lib/api.ts` | Add `"time_on_site"` to `TableDimension` type |
| `src/components/overview/DimensionTable.tsx` | Add to `DIMENSION_OPTIONS` array |
| `src/pages/Change.tsx` | Add to `BREAKDOWN_OPTIONS`, include in basic mode defaults |
| `src/components/touchpoints/IncrementalityAnalysisDialog.tsx` | Add to `BREAKDOWN_OPTIONS` |
| `src/components/touchpoints/IncrementalityResultsView.tsx` | Add to `breakdownConfig` |

No new components needed -- the existing table and breakdown rendering handles arbitrary `dim_value` strings, so buckets like `"0-10s"` and `"5m+"` will render correctly out of the box.

