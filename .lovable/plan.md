

## Polish Query Dashboard Tiles

### Problem
The dashboard tiles use raw recharts components with basic styling, while the Overview page uses the project's `ChartContainer`/`ChartTooltip`/`ChartTooltipContent` wrappers and polished table styling. The result looks inconsistent and rough.

### Changes

**1. Upgrade charts to use `ChartContainer` + `ChartTooltip`**

Replace raw `ResponsiveContainer`, `Tooltip`, and `Legend` in all tile chart components (`TileBarChart`, `TileLineChart`, `TilePieChart`) with the project's `ChartContainer`, `ChartTooltip`, and `ChartTooltipContent` from `@/components/ui/chart`. This gives:
- Proper themed tooltips (matching Overview style)
- Consistent axis styling via ChartContainer's built-in CSS
- Dark mode support via theme-aware color config

Build a dynamic `ChartConfig` from column names, assigning the platform color palette (Orange primary, Teal secondary, then other chart colors).

**2. Polish chart styling to match Overview**

- Bars: `radius={[3, 3, 0, 0]}`, use `COLOR_LEFT` (orange) and `COLOR_RIGHT` (teal) pattern
- Lines: `strokeWidth={2}`, `dot={false}`, same color scheme
- Axes: `tickLine={false}`, `axisLine={false}`, `tickMargin={8}` matching DailyChart
- CartesianGrid: `vertical={false}`, `strokeDasharray="3 3"`, `className="stroke-border"`

**3. Polish table tiles**

- Wrap table in `border border-border` container (matching DimensionTable)
- Header row: `bg-muted hover:bg-muted` background
- Header cells: `font-mono text-[10px] uppercase tracking-widest font-medium`
- Data cells: `font-mono text-xs tabular-nums` with proper alignment
- Numbers right-aligned, text left-aligned

**4. Polish tile card styling**

- Remove Card wrapper shadow, use `border border-border` only (flat Dune aesthetic)
- Increase chart heights to fill the tile better (scale with `dash_h`)
- Add subtle `AudienceScan` watermark on charts (matching DailyChart)

### Files to modify
- `src/pages/QueryDashboard.tsx` — all tile rendering components and card wrapper

