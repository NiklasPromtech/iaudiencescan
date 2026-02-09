
# Basic View: Date Range Slider with Tracking Status

## What it does

When users land on `/change` in Basic mode, the app fetches the tracking status for the selected website to get the available date range (`first_tracked_at` / `last_tracked_at`). It then displays a visual date timeline slider where users drag two handles to select a **start** and **end** date. Pressing "Get Insights" fires the same incrementality report endpoint with sensible defaults (exclude bots, breakdowns: conversion_event, wallet_action, country, referrer_domain).

## How it works

1. **Fetch tracking status** on mount (when `viewMode === "basic"` and website is selected)
   - `GET https://cdn.audiencescan.io/api/analytics/tracking-status/{tagId}`
   - Store `first_tracked_at` and `last_tracked_at`

2. **Date range slider**
   - Uses a dual-handle `Slider` component mapped to day indices
   - Minimum start = `first_tracked_at + 7 days` (need baseline)
   - Maximum end = `last_tracked_at`
   - Show formatted date labels for start and end below the slider
   - The full range label (first date to last date) shown at edges

3. **"Get Insights" button**
   - Sends to the same `/api/analytics/incrementality/report` endpoint
   - Payload built with:
     - `event_type: "range"`
     - `time.start_date` = selected start
     - `time.end_date` = selected end
     - `baseline_days` = number of days between `first_tracked_at` and selected start (auto-calculated)
     - `event_name` = auto-generated from dates
     - `breakdowns: ["conversion_event", "wallet_action", "country", "referrer_domain"]`
     - `filters.exclude.bot_status: ["bot"]`
   - Results shown using the existing `IncrementalityResultsView` component

## Visual layout

```text
+--------------------------------------------------+
|  Measure Change          [Basic] [Advanced]       |
|  Description text...                              |
+--------------------------------------------------+
|                                                   |
|  Loading tracking data... (skeleton while loading)|
|                                                   |
|  Jan 15          [====|=======|====]       Feb 9  |
|                  Start: Jan 22  End: Feb 9        |
|                                                   |
|  [x] Exclude bot traffic                          |
|                                                   |
|         [ Get Insights ]                          |
|                                                   |
+--------------------------------------------------+
|  Results (shared with advanced)                   |
+--------------------------------------------------+
```

## Technical details

**File: `src/lib/api.ts`**
- Add `fetchTrackingStatus(tagId: string)` function
- Uses `ANALYTICS_API_URL` base with `GET /analytics/tracking-status/{tagId}`
- Returns `{ success, tag_id, is_tracking, first_tracked_at, last_tracked_at, days_active }`

**File: `src/pages/Change.tsx`**
- Add state: `trackingStatus` (stores API response), `loadingTracking` (boolean)
- Add state: `basicRange` as `[number, number]` for the slider (day offsets from first_tracked_at)
- Add `useEffect` to fetch tracking status when basic mode is active and website changes
- Compute `minStartOffset = 7` (first_tracked_at + 7 days minimum)
- Compute `maxOffset` = total days between first and last tracked
- Slider `min={minStartOffset}`, `max={maxOffset}`, two handles
- Display start/end as formatted dates derived from `first_tracked_at + offset days`
- Add `handleBasicAnalyze` function that builds the payload with defaults and calls the same report endpoint
- Replace the black placeholder card with the actual slider UI
- Include an "Exclude bot traffic" checkbox (default checked), same as advanced
