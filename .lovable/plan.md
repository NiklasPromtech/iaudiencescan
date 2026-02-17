

# Compare Periods on Overview

## What this does
Adds a "Compare periods" button to the Overview page that lets you see how your current date range compares to the equivalent previous period -- surfacing positive/negative deltas across all metrics (scorecard, daily chart, dimension table, events, wallets, etc.).

## How it works

1. **Button placement** -- Below the filter bar, a distinct button (not styled like filters) reading **"Compare to previous period"** appears. It uses a secondary/outline style with a compare icon (e.g., `ArrowLeftRight`) so it stands out from filters.

2. **Confirmation step** -- Clicking the button opens a small inline card (not a dialog) that explains:
   - "Compare **[date range label]** against the **previous [N] days**"
   - Shows any active filters as badges (e.g., `utm_source: ChainView`, `Country: India`)
   - A **"Run Comparison"** button and a **"Cancel"** link

3. **Two parallel API calls** -- On confirm, two `fetchOverview` requests fire simultaneously:
   - **Current period**: uses the existing `getRangeConfig()` and `activeFilters`
   - **Previous period**: same filters, but the date range is shifted back by the period length (e.g., Feb 11-17 becomes Feb 3-10)

4. **Comparison mode UI** -- Once both responses arrive:
   - The button changes to **"Exit comparison"** (with an X icon)
   - **ScorecardChips** receives both current and previous data, showing a small green/red delta badge next to each metric value (e.g., `+12%` or `-5%`)
   - **DimensionTable** gains a delta column showing change per row for the sorted metric
   - **DailyChart** overlays the previous period as a dashed/faded line behind the current period

5. **Exiting comparison** -- Clicking "Exit comparison" clears the comparison state and returns to normal view.

## Date range calculation
- **Preset "Last 7 days"** (Feb 11-17): previous = Feb 3-10 (7 days before)
- **Preset "Last 30 days"**: previous = 30 days before that range
- **Custom range** (e.g., Feb 5-12, 8 days): previous = Jan 28 - Feb 4
- **"Today"**: previous = yesterday
- **"Yesterday"**: previous = day before yesterday

## Technical details

### New files
- **`src/components/overview/ComparisonConfirmCard.tsx`** -- The inline confirmation card showing the comparison explanation, active filter badges, and Run/Cancel buttons.

### Modified files

- **`src/pages/Overview.tsx`**:
  - Add state: `comparisonData` (the previous-period overview response), `comparisonLoading`, `comparisonMode` boolean
  - Add `getPreviousRangeConfig()` that calculates the shifted date range
  - Add `handleStartComparison()` that fires the second API call
  - Add `handleExitComparison()` that clears comparison state
  - Render the "Compare to previous period" / "Exit comparison" button between FilterDialog and ScorecardChips
  - Render ComparisonConfirmCard inline when user clicks the button (before data loads)
  - Pass `comparisonData` down to ScorecardChips and DimensionTable

- **`src/components/overview/ScorecardChips.tsx`**:
  - Accept optional `comparisonData` prop (previous period scorecard)
  - When present, render a small delta badge next to each metric value showing percentage change with green (positive) / red (negative) coloring

- **`src/components/overview/DimensionTable.tsx`**:
  - Accept optional `comparisonRows` prop
  - When present, match rows by `dim_value` and show a small delta indicator next to the primary sorted metric

- **`src/components/overview/DailyChart.tsx`**:
  - Accept optional `comparisonData` prop (previous period daily rows)
  - When present, render a second line/area with reduced opacity and dashed stroke, offset so dates align visually

### Styling
- Compare button: `variant="outline"` with `border-dashed border-primary/40` and `ArrowLeftRight` icon -- visually distinct from the solid filter buttons
- Delta badges: `text-[11px] font-mono` with `text-green-500` for positive, `text-red-500` for negative
- All elements use `rounded-none` per the Dune aesthetic
