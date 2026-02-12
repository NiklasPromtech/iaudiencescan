

## Align Dashboard with Landing Page Quality

### 1. Bot Summary: Replace 3 cards with donut chart layout

**File: `src/components/bots/BotSummaryCards.tsx`**

Replace the current 3-card grid with the landing page's donut + legend layout (matching `MockBotSummary.tsx`). This means:
- SVG donut chart on the left showing proportional arcs for Bots, Humans, Unknown
- Legend rows on the right with color dots, icons, labels, counts, and percentages
- Single horizontal card instead of 3 vertical cards

**Color changes:**
- Bots: Red (`hsl(0, 84%, 60%)`) -- keep as-is
- Humans: Orange (`hsl(var(--primary))`) -- was green, now uses the primary orange
- Unknown: Teal/green (`hsl(170, 70%, 45%)`) -- was grey, now uses the secondary green

Also update `src/components/landing/mock-data.ts` and `src/components/landing/MockBotSummary.tsx` colors to match (Humans = orange/primary, Unknown = teal).

### 2. Dashboard DailyChart: Match landing page bar chart style

**File: `src/components/overview/DailyChart.tsx`**

- Change the right-axis bar color from `hsl(var(--foreground))` (black) to `hsl(170, 70%, 45%)` (teal) to match the landing page's orange + teal bar pair
- Change bar `radius` from `[4, 4, 0, 0]` to `[3, 3, 0, 0]` (subtler top rounding, matches landing)
- Add `vertical={false}` to CartesianGrid (already there, confirm)
- Remove axis lines and tick lines for cleaner look (already done, confirm)

### 3. HolderChartDialog: Replace LineChart with AreaChart

**File: `src/components/contracts/HolderChartDialog.tsx`**

Replace the basic orange LineChart with a styled AreaChart matching `MockHolderTrend`:
- Switch from `LineChart` + `Line` to `AreaChart` + `Area` with a teal gradient fill (`hsl(170, 70%, 45%)`)
- Add `linearGradient` definition for the area fill (fading from 30% opacity to 0)
- Use `monotone` curve type with `strokeWidth={2}`
- Remove dot markers for cleaner look
- Remove `CartesianGrid` vertical lines
- Update stat card styles: remove `rounded-lg` (use `rounded-none`), use `font-mono` for labels
- Update the `borderRadius` in tooltip `contentStyle` from `"8px"` to `"0"`
- Change YAxis domain to `["dataMin - 100", "dataMax + 100"]` for better scale

### 4. Trusted By section in Dashboard sidebar or header

**File: `src/components/dashboard/DashboardLayout.tsx`**

Add a subtle "Trusted by" logo strip at the bottom of the sidebar or as a footer inside the dashboard. The white client logos will be displayed with reduced opacity against the sidebar's dark-ish background, using the same marquee or static row approach. Import the 10 logos from `src/assets/client-logos/`.

Since the sidebar already exists in `DashboardSidebar.tsx`, the logos will go at the bottom of that sidebar as a subtle footer section.

**File: `src/components/dashboard/DashboardSidebar.tsx`**

Add a "Trusted by" section at the bottom of the sidebar with the client logos displayed in a compact grid or vertical scroll, using low opacity that increases on hover.

### Files changed (summary)

| File | Change |
|------|--------|
| `src/components/bots/BotSummaryCards.tsx` | Full rewrite: donut chart + legend layout, new color scheme |
| `src/components/landing/MockBotSummary.tsx` | Update colors: Humans = orange, Unknown = teal |
| `src/components/landing/mock-data.ts` | Update color classes for Humans/Unknown |
| `src/components/overview/DailyChart.tsx` | Right bar color to teal, bar radius adjustment |
| `src/components/contracts/HolderChartDialog.tsx` | Replace LineChart with AreaChart + gradient, flat styling |
| `src/components/dashboard/DashboardSidebar.tsx` | Add "Trusted by" logo section at sidebar bottom |
