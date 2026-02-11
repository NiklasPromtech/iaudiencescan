

# World Map, Conversion Event & Wallet Action Overhaul

## 1. Install `react-simple-maps` for a real world map

The current hand-drawn SVG paths will be replaced with `react-simple-maps`, which renders proper TopoJSON world geometry using d3-geo projections. This gives us an accurate, interactive choropleth map.

**Install:** `react-simple-maps` (works with React 18, MIT licensed, ~50k weekly downloads)

## 2. Interactive Drillable World Map

Replace the contents of `CountryMapChart.tsx` with a proper map powered by `react-simple-maps`:

- Renders a real world map using the `world-atlas` TopoJSON from unpkg CDN
- Countries with data are color-coded (green for positive uplift, red for negative)
- Countries without data are light gray
- **Click a country** to trigger a callback that tells the parent "user wants region-level data for this country"
- **Click a region** to drill into cities
- A breadcrumb trail at the top shows the drill path: World > United States > California
- A "Back" button lets users navigate up

The component interface will accept:
- `data` -- the current level's breakdown items
- `drillLevel` -- "country" | "region" | "city"
- `onDrill(countryCode: string)` -- callback when clicking a country/region
- `onBack()` -- callback to go up one level
- `breadcrumb` -- array of labels for the drill path
- `loading` -- shows a spinner overlay when fetching drill-down data

When at "region" or "city" level, the map zooms into the selected country/region automatically.

## 3. Drill-down state management in IncrementalityResultsView

In the parent component, add state to manage the drill:

- `mapDrillLevel`: "country" | "region" | "city"
- `mapDrillPath`: e.g., `["United States"]` or `["United States", "California"]`
- `mapDrillData`: the breakdown data for the current drill level (starts as `breakdowns.country`)

When a user clicks a country:
1. Set loading state
2. Call the backend API (via `supabase.functions.invoke`) with the touchpoint ID + country filter to get region-level data
3. Display the region breakdown on the map
4. Clicking a region repeats for city-level data

If the backend call fails or returns no data, show a "No detailed data available" message.

## 4. Focused Conversion Event Table

When breakdown key is `conversion_event`, render a specialized 3-column table instead of the generic BreakdownTable:

```text
 Dimension          | Conv/day                         | Uplift
--------------------|----------------------------------|--------
 Signed up          | [gray bar] 33  [green bar] 137   | +315%
 wallet_detected    | [gray bar] 254 [green bar] 450   | +77%
```

- **Dimension**: Event name, cleaned up (replace underscores with spaces, title case)
- **Conv/day**: Two mini horizontal bars stacked -- gray for baseline daily avg, colored for actual daily avg. Numbers displayed inline.
- **Uplift**: Badge colored green/red based on positive/negative

## 5. Focused Wallet Action Table

Same layout as Conversion Event, but uses `wallets` metric:

```text
 Dimension          | Wallets/day                      | Uplift
--------------------|----------------------------------|--------
 submitted          | [gray bar] 33  [green bar] 137   | +307%
 connected          | [gray bar] 0   [green bar] 7     | NEW
```

## Technical Details

### Files to modify

| File | Change |
|------|--------|
| `package.json` | Add `react-simple-maps` dependency |
| `src/components/touchpoints/CountryMapChart.tsx` | Complete rewrite -- real map with `ComposableMap`, `Geographies`, `Geography` from react-simple-maps. Color-coded choropleth, click handlers, breadcrumb, zoom. |
| `src/components/touchpoints/IncrementalityResultsView.tsx` | 1) Add drill-down state and API call logic for map. 2) Add `FocusedBreakdownTable` component for conversion_event and wallet_action. 3) In the breakdowns accordion, route conversion_event and wallet_action to the focused table instead of generic BreakdownTable. |

### CountryMapChart new props interface

```typescript
interface CountryMapChartProps {
  data: CountryData[];
  formatNumber: (n: number) => string;
  formatPercent: (n: number) => string;
  drillLevel: "country" | "region" | "city";
  breadcrumb: string[];
  onDrill?: (key: string) => void;
  onBack?: () => void;
  loading?: boolean;
}
```

### FocusedBreakdownTable component (inline in IncrementalityResultsView)

```typescript
interface FocusedBreakdownTableProps {
  data: BreakdownItem[];
  metricKey: "conversions" | "wallets";
  metricLabel: string;  // "Conv/day" or "Wallets/day"
  formatNumber: (n: number) => string;
  formatPercent: (n: number) => string;
}
```

Each row renders:
- Dimension name (title-cased, underscores replaced)
- Two inline bars: gray for `baseline_daily_avg`, green/red for `event_daily_avg`, with numbers
- Uplift badge: green for positive, red for negative, "NEW" if baseline is 0

### Map geography source
Uses `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json` -- lightweight TopoJSON loaded at runtime (no bundling overhead).

