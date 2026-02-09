

# Improve Report Clarity -- 4 Fixes

## 1. Confidence score: add a reason line

Below the confidence gauge (the 50% number + progress bar), add a one-line explanation based on the score and available data:

- If confidence < 0.5 and baseline_days < 7: "Limited by short baseline period ({N} days)"
- If confidence < 0.5 and baseline_days >= 7: "Limited by high variance in baseline data"
- If confidence 0.5-0.7: "Moderate -- consider extending analysis period for stronger signal"
- If confidence >= 0.7: "Strong statistical signal detected"

This goes in the Confidence Gauge section (around line 460-493) and also in the copy-text output.

## 2. "NEW" label for zero-baseline items

In the `BreakdownTable` and `FunnelComparisonBar` components, when `baseline_total` (or `expected`) is 0 but `actual` > 0, display "NEW" instead of "0.0% uplift" in the uplift column.

Also in the `formatPercent` helper and the top-performer callout -- if expected is 0, show "NEW" badge instead of a percentage.

**Affected spots:**
- `BreakdownTable` uplift column (line 1475-1481): check `item.baseline_total === 0 && item.actual > 0`, render a styled "NEW" badge
- `FunnelComparisonBar` uplift badge (line 1341): same check on `expected === 0`
- Top performer callout (line 936): handle zero-baseline case

## 3. Fix ">100% conversion" phrasing in insights

The insights array comes from the backend, but we can post-process it on the frontend. Scan each insight string for patterns like "X% of new wallet connections converted" where X > 100, and rephrase to "X conversions per new wallet connection" (dividing by 100).

Add a small `cleanInsight()` function that uses a regex to detect and rewrite these cases before rendering.

## 4. Fix "Event Period" methodology wording

Change the methodology text on lines 1100-1101:
- Current: `{windows.event_days} days during/after the event`
- New: `{windows.event_days} days (selected period: {formatDate(windows.event_start)} - {formatDate(windows.event_end)})`

Also update the Analysis Period label on line 565 from "Event Period" to "Selected Period" for consistency.

And update the timeline legend on line 810 from "Event Period" to "Selected Period".

---

## Technical details

**File to modify:** `src/components/touchpoints/IncrementalityResultsView.tsx`

All four fixes are in a single file with these changes:

| Fix | Location (approx lines) | Change |
|---|---|---|
| Confidence reason | 460-493 | Add explanatory text div below the gauge bar |
| Confidence in copy text | 244 | Append reason to confidence line |
| NEW label in BreakdownTable | 1475-1481 | Conditional render "NEW" badge vs percentage |
| NEW label in FunnelComparisonBar | 1335-1342 | Conditional render for zero-baseline |
| NEW in top performer callout | 930-938 | Handle zero-baseline |
| Insight post-processing | 977-995 | Add `cleanInsight()` wrapper |
| Methodology wording | 1100-1101 | Remove "during/after the event" |
| "Event Period" to "Selected Period" | 565, 810 | Label text changes |
