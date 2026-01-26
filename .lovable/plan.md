

# Date Filtering & Expanded Breakdown Table

## Overview
This plan addresses three key improvements to the Overview page:
1. Add a date range picker (defaulting to last 7 days)
2. Remove the "Engagement" and "Bounce Rate" cards from the Overview
3. Expand the Breakdown table to show all API columns with calculated rates, organized cleanly

---

## 1. Date Range Picker

### Implementation
Add a date range selector near the top of the page (next to or above the filters) that allows users to select custom date ranges.

**UI Options:**
- **Quick presets**: Last 7 days (default), Last 14 days, Last 30 days, Last 90 days
- **Custom range**: Calendar picker for custom start/end dates

```text
+--------------------------------------------------+
| Last 7 days ▼                                    |
+--------------------------------------------------+
| ○ Last 7 days                                    |
| ○ Last 14 days                                   |
| ○ Last 30 days                                   |
| ○ Last 90 days                                   |
| ───────────────────────────────────────────────  |
| Custom range...                                  |
|   [Jan 1, 2026] → [Jan 25, 2026]                |
+--------------------------------------------------+
```

### State Changes
```tsx
const [dateRange, setDateRange] = useState<{
  type: "preset" | "custom";
  days?: number;          // For presets: 7, 14, 30, 90
  from?: Date;            // For custom range
  to?: Date;              // For custom range
}>({ type: "preset", days: 7 });
```

### API Impact
The current API uses `last_full_days` range type. For custom dates, we may need to adjust the request format or calculate the number of days between dates.

---

## 2. Remove Engagement & Bounce Rate Cards

### Current State
Lines 258-336 in Overview.tsx contain:
- Engagement card (shows stayed_10s, stayed_30s, stayed_60s, stayed_5m)
- Bounce Rate card (shows bounce count and progress bar)

### Action
Delete both cards entirely. The engagement metrics will be visible in the expanded breakdown table with calculated rates.

---

## 3. Expanded Breakdown Table

### Available API Columns
Based on `TableRow` interface:
- `dim_value` (dimension value)
- `pageviews`
- `unique_visitors`
- `wallet_users` (nullable)
- `converted_users` (nullable)
- `conversions_total` (nullable)
- `bounce_count`
- `bot_visitors` (nullable)
- `bot_checked` (nullable)
- `stayed_10s`
- `stayed_30s`
- `stayed_60s`
- `stayed_5m`
- `cost_total` (nullable)

### Proposed Table Layout with Column Groups

To avoid messiness, organize columns into logical groups with subtle visual separators:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        │     TRAFFIC     │         ENGAGEMENT         │    WALLETS    │   CONVERSIONS   │
├────────────────────────┼─────────────────┼────────────────────────────┼───────────────┼─────────────────┤
│ Referrer ▼             │ Visitors  Views │ 10s   30s   60s   5m   Bot │ Count   Rate  │ Users    Total  │
├────────────────────────┼─────────────────┼────────────────────────────┼───────────────┼─────────────────┤
│ (direct)               │   35       47   │ 29%   11%   6%    3%   46% │  —       —    │  —        —     │
│ lovable.dev            │   4        37   │ 100%  100%  100%  75%  0%  │  —       —    │  —        —     │
│ lovableproject.com     │   3        5    │ 100%  100%  100%  100% 0%  │  —       —    │  —        —     │
└────────────────────────┴─────────────────┴────────────────────────────┴───────────────┴─────────────────┘
```

### Rate Calculations
All rates are calculated as percentage of `unique_visitors`:

| Metric | Calculation |
|--------|-------------|
| 10s Rate | `stayed_10s / unique_visitors * 100` |
| 30s Rate | `stayed_30s / unique_visitors * 100` |
| 60s Rate | `stayed_60s / unique_visitors * 100` |
| 5m Rate | `stayed_5m / unique_visitors * 100` |
| Bot Rate | `bot_visitors / unique_visitors * 100` |
| Wallet Rate | `wallet_users / unique_visitors * 100` (if configured) |
| Conversion Rate | `converted_users / unique_visitors * 100` (if configured) |

### Clean UX Approach: Collapsible Column Groups

To prevent overwhelming the user, implement **toggleable column groups**:

```text
┌────────────────────────────────────────────────────────────────────┐
│ Breakdown by Referrer                           [Referrer ▼]      │
├────────────────────────────────────────────────────────────────────┤
│ Show: [✓ Traffic] [✓ Engagement] [□ Bots] [□ Wallets] [□ Conversions] │
└────────────────────────────────────────────────────────────────────┘
```

**Default shown:** Traffic (Visitors, Views) + Engagement (10s, 30s, 60s, 5m rates)
**Hidden by default:** Bots, Wallets, Conversions (shown if user has data)

### Alternative: Horizontal Scroll with Sticky First Column

If column toggles feel too complex, use a horizontally scrolling table with:
- Sticky first column (dimension value)
- All columns visible, subtle group headers
- Muted text for null/unconfigured values (show "—")

---

## Technical Details

### New Component: DateRangePicker

| File | Purpose |
|------|---------|
| `src/components/overview/DateRangePicker.tsx` | Date range selector with presets + custom |

Uses existing `Calendar` component and `Popover` for the custom date picker.

### File Changes

| File | Change |
|------|--------|
| `src/pages/Overview.tsx` | Add date range state, remove Engagement/Bounce cards, pass date range to API calls, add DateRangePicker |
| `src/components/overview/DimensionTable.tsx` | Expand columns, add column group toggles, calculate all rates |
| `src/components/overview/DateRangePicker.tsx` | New component for date selection |
| `src/lib/api.ts` | May need to update range type if supporting custom dates |

### Updated DimensionTable Props

```tsx
interface DimensionTableProps {
  data: ApiTableRow[];
  loading: boolean;
  dimension: TableDimension;
  onDimensionChange: (dimension: TableDimension) => void;
  totalRows: number;
  // New: to conditionally show columns
  showWalletColumns?: boolean;      // true if wallet_users is configured
  showConversionColumns?: boolean;  // true if converted_users is configured
}
```

### Column Groups Configuration

```tsx
const COLUMN_GROUPS = [
  { 
    id: "traffic", 
    label: "Traffic", 
    columns: ["visitors", "views"],
    defaultVisible: true 
  },
  { 
    id: "engagement", 
    label: "Engagement", 
    columns: ["10s", "30s", "60s", "5m"],
    defaultVisible: true 
  },
  { 
    id: "bots", 
    label: "Bots", 
    columns: ["bot_rate"],
    defaultVisible: false 
  },
  { 
    id: "wallets", 
    label: "Wallets", 
    columns: ["wallet_count", "wallet_rate"],
    defaultVisible: false  // auto-show if data exists
  },
  { 
    id: "conversions", 
    label: "Conversions", 
    columns: ["conv_users", "conv_total"],
    defaultVisible: false  // auto-show if data exists
  },
];
```

---

## Summary

| Change | Impact |
|--------|--------|
| **Date picker** | Users can analyze any time period, not just 7 days |
| **Remove cards** | Cleaner Overview, less redundancy |
| **Expanded table** | All data visible in one place with smart organization |
| **Rate calculations** | Percentages make cross-segment comparison easy |
| **Column toggles** | Prevents overwhelm while allowing full data access |

