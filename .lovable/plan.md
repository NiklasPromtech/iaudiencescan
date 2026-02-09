

# Replace "Campaign" with "Period" + Add World Map for Country Breakdown

## 1. Replace "Campaign" wording with "Period"

All references to "campaign" in the results view will be changed to "period" so it feels neutral -- whether the user is analyzing a specific event, a campaign, or just a time window.

**Changes in `src/components/touchpoints/IncrementalityResultsView.tsx`:**

| Current text | New text |
|---|---|
| "This campaign delivered measurable incremental value beyond baseline expectations" | "This period delivered measurable incremental value beyond baseline expectations" |
| "Repeat this campaign type. The incremental metrics demonstrate strong unit economics worth scaling." | "Repeat this approach. The incremental metrics demonstrate strong unit economics worth scaling." |
| "Campaign did not deliver expected incremental results above baseline" | "This period did not deliver expected incremental results above baseline" |
| "Reconsider this approach. The campaign did not generate meaningful incremental value..." | "Reconsider this approach. The period did not generate meaningful incremental value..." |
| "Insufficient data to determine if the campaign generated incremental impact" | "Insufficient data to determine if the period generated incremental impact" |
| Copy text: `Campaign: ${result.event_name}` | `Period: ${result.event_name}` |
| "Incremental metrics measure the TRUE impact of your campaign" | "...impact of your period" |
| "We compare observed behavior during the campaign (event period)" | "We compare observed behavior during the selected period" |

Approximately 8-10 string replacements, all in the same file.

## 2. World Map for Country Breakdown

Instead of showing country data as a plain table, render an SVG world map with countries colored by incremental performance. The table stays below as a detail view.

**New file: `src/components/touchpoints/CountryMapChart.tsx`**

- A lightweight SVG world map component using inline path data for major countries (or a small JSON map data file)
- Countries with data get colored on a gradient scale (green for positive incremental, red for negative, gray for no data)
- Hover tooltip showing country name, incremental value, and uplift percent
- Compact design that fits within the existing report page layout
- Falls back gracefully in PDF export (static colored SVG)

**Approach**: Use a simplified world map SVG with ~50 country paths (covering the most common countries). Each path gets a `data-country` attribute matching the breakdown key. The component maps breakdown data to fill colors.

**Modified file: `src/components/touchpoints/IncrementalityResultsView.tsx`**

- For the `country` breakdown specifically, render the `CountryMapChart` above the existing `BreakdownTable`
- Other breakdowns (utm_source, etc.) keep the table-only layout

## Technical details

**Files to create:**
- `src/components/touchpoints/CountryMapChart.tsx` -- SVG map component with country paths, color scaling, and tooltips

**Files to modify:**
- `src/components/touchpoints/IncrementalityResultsView.tsx` -- replace "campaign" wording (~10 spots), import and render `CountryMapChart` for country breakdowns

