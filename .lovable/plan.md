

## Unify Dashboard Fonts with Landing Page

### Problem

The landing page uses **Space Mono** (`font-mono`) for all data-oriented elements -- table headers, numeric values, stat labels, percentages -- giving it a sharp, technical feel. The dashboard uses the default **Bai Jamjuree** (`font-bai`) for everything, creating a jarring disconnect when users transition from landing to platform.

### Solution

Apply the same typographic hierarchy from the landing page across all dashboard components:

- **Table headers**: `font-mono text-[10px] uppercase tracking-widest text-muted-foreground` (matching landing page `<th>` style)
- **Numeric data cells**: `font-mono tabular-nums` (matching landing page `<td>` style)
- **Stat labels**: `font-mono text-[10px] uppercase tracking-widest` (matching landing page scorecard labels)
- **Stat values**: `font-mono font-bold tabular-nums` (matching landing page scorecard values)
- **Section headings** (h3 like "Breakdown by Referrer"): Keep `font-bai` or switch to `font-serif` for section titles -- these are descriptive, not data
- **Body text / descriptions**: Keep `font-bai` -- it stays as the reading font

### Files to Update

| File | What changes |
|------|-------------|
| **`src/components/overview/DimensionTable.tsx`** | All `TableHead` get `font-mono text-[10px] uppercase tracking-widest`. All numeric `TableCell` / `MetricCell` / `WalletMetricCell` values get `font-mono`. |
| **`src/components/overview/MetricCell.tsx`** | Add `font-mono` to the count, rate, and cost spans. |
| **`src/components/overview/DimensionCell.tsx`** | Add `font-mono` to the dimension value, bot rate text. |
| **`src/components/overview/ScorecardChips.tsx`** | Stat values get `font-mono`. Category labels already have uppercase but need `font-mono tracking-widest`. The "live" label, metric labels, and values all get `font-mono`. |
| **`src/components/overview/EventsTable.tsx`** | All `TableHead` get `font-mono text-[10px] uppercase tracking-widest`. Numeric cells get `font-mono tabular-nums`. |
| **`src/components/overview/DailyChart.tsx`** | Chart axis ticks get `fontFamily: 'Space Mono, monospace'`. Metric selector labels, legend text get `font-mono`. |
| **`src/components/bots/BotSummaryCards.tsx`** | Legend labels, percentages, counts all get `font-mono`. |
| **`src/components/bots/BotDimensionTable.tsx`** | Same pattern: `TableHead` headers get `font-mono text-[10px] uppercase tracking-widest`, data cells get `font-mono tabular-nums`. |
| **`src/components/bots/BotSignalsCard.tsx`** | Signal labels and values get `font-mono`. |
| **`src/components/bots/RendererBreakdown.tsx`** | Data values get `font-mono tabular-nums`. |
| **`src/components/contracts/HolderChartDialog.tsx`** | Stat card labels get `font-mono text-[10px] uppercase tracking-widest`. Values get `font-mono font-bold`. Chart axis ticks get `fontFamily: 'Space Mono, monospace'`. |
| **`src/components/overview/WalletsOverviewTable.tsx`** | Headers and numeric cells get `font-mono`. |
| **`src/components/overview/WalletExtensionsTable.tsx`** | Headers and numeric cells get `font-mono`. |
| **`src/components/scan-results/SummaryBadges.tsx`** | Stat values get `font-mono`. |
| **`src/components/scan-results/ScanResultsStats.tsx`** | Stat values get `font-mono tabular-nums`. Labels get `font-mono text-[10px] uppercase tracking-widest`. |

### Typography Rules (Summary)

| Element | Font | Style |
|---------|------|-------|
| Section headings (h2, h3) | `font-serif` or `font-bai` | Normal casing, semibold |
| Table column headers | `font-mono` | `text-[10px] uppercase tracking-widest` |
| Numeric data values | `font-mono` | `tabular-nums` |
| Stat card labels | `font-mono` | `text-[10px] uppercase tracking-widest` |
| Stat card values | `font-mono` | `font-bold tabular-nums` |
| Body/description text | `font-bai` | Normal |
| Chart axis ticks | `Space Mono` | Via Recharts `fontFamily` prop |

### No structural changes

This is purely a className update across dashboard components. No layout, logic, or data changes.
