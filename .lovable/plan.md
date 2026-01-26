

# Bot Analytics Drill-Down Page

## Overview
Create a dedicated Bot Analytics page (`/bots`) that users can navigate to by clicking on "Bot %" values in the DimensionTable. The page will inherit all active filters from the Overview page and provide deep insights into bot traffic using the new `/api/analytics/bots` endpoint.

---

## User Flow

```text
Overview Page                          Bot Analytics Page
+------------------------+            +----------------------------------+
| DimensionTable         |   click    |                                  |
| ┌──────────────────┐   |   ──────>  |  Bot Analytics                   |
| │ (direct)    46%  │   |            |                                  |
| └──────────────────┘   |            |  Filters: utm_source=google ✕    |
| Bot % is clickable     |            |  Date: Last 7 days               |
+------------------------+            |                                  |
                                      |  Summary Cards                   |
                                      |  [Bot 15%] [Human 80%] [Unk 5%]  |
                                      |                                  |
                                      |  Signals Section                 |
                                      |  Renderer Breakdown              |
                                      |  Dimension Table                 |
                                      +----------------------------------+
```

---

## 1. API Integration

### New Types in `src/lib/api.ts`

```typescript
// Bot Analytics types
export interface BotAnalyticsRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  dimension?: TableDimension;
  limit?: number;
  offset?: number;
}

export interface BotSummary {
  total_visitors: number;
  bot_visitors: number;
  human_visitors: number;
  unknown_visitors: number;
  bot_pct: number;
  human_pct: number;
  unknown_pct: number;
}

export interface BotSignals {
  webdriver_count: number;
  headless_count: number;
  total_checked: number;
}

export interface RendererBreakdown {
  renderer: string;
  visitor_count: number;
  is_headless: boolean;
}

export interface BotDimensionRow {
  dim_value: string;
  total_visitors: number;
  bot_visitors: number;
  human_visitors: number;
  unknown_visitors: number;
  bot_pct: number;
}

export interface BotAnalyticsResponse {
  success: boolean;
  tag_id: string;
  range: { from: string; to: string; timezone: string };
  filters: Record<string, string[]>;
  summary: BotSummary;
  signals: BotSignals;
  renderer_breakdown: RendererBreakdown[];
  dimension: TableDimension | null;
  pagination: { limit: number; offset: number; total_rows: number };
  rows: BotDimensionRow[];
}
```

### New API Function

```typescript
export async function fetchBotAnalytics(request: BotAnalyticsRequest): Promise<BotAnalyticsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/bots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}
```

---

## 2. Navigation from DimensionTable

### Make Bot % Clickable

Update `DimensionTable.tsx` to:
1. Accept `onBotClick` callback prop
2. Style the Bot % cells as clickable links
3. Pass current dimension and row value to the callback

```typescript
interface DimensionTableProps {
  // ... existing props
  onBotClick?: (dimValue: string) => void;  // New prop
}

// In the TableCell for bots:
<TableCell 
  className="text-right tabular-nums text-primary cursor-pointer hover:underline"
  onClick={() => onBotClick?.(row.dim_value)}
>
  {calcRate(row.bot_visitors, visitors)}
</TableCell>
```

### Navigation with Query Parameters

In `Overview.tsx`, handle the click:

```typescript
const handleBotClick = (dimValue: string) => {
  const params = new URLSearchParams();
  
  // Encode current state
  params.set("dim", tableDimension);
  params.set("val", dimValue);
  params.set("range", JSON.stringify(dateRange));
  if (Object.keys(activeFilters).length > 0) {
    params.set("filters", JSON.stringify(activeFilters));
  }
  
  navigate(`/bots?${params.toString()}`);
};
```

---

## 3. Bot Analytics Page

### New File: `src/pages/Bots.tsx`

#### Page Structure

```text
+----------------------------------------------------------+
|  ← Back to Overview                                       |
|                                                           |
|  Bot Analytics                          [Date Picker]     |
|  Analyzing traffic from: google.com (via utm_source)      |
|                                                           |
|  [Filters: utm_source ✕] [utm_medium ✕] [+ Add filter]   |
+----------------------------------------------------------+
|                                                           |
|  Summary Cards (3-column grid)                            |
|  +------------+ +------------+ +--------------+           |
|  | 🤖 Bots    | | 👤 Humans  | | ❓ Unknown   |           |
|  | 150        | | 800        | | 50           |           |
|  | 15%        | | 80%        | | 5%           |           |
|  +------------+ +------------+ +--------------+           |
|                                                           |
+----------------------------------------------------------+
|  Detection Signals                                        |
|  +------------------------------------------------------+ |
|  | WebDriver Detected: 80 (8.4% of checked)             | |
|  | Headless Browser: 70 (7.4% of checked)               | |
|  | Total Checked: 950 visitors                          | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
|  Renderer Breakdown                                       |
|  +------------------------------------------------------+ |
|  | Renderer                              | Count | Flag  | |
|  |---------------------------------------|-------|-------| |
|  | ANGLE (NVIDIA GeForce...)             | 500   |       | |
|  | Google SwiftShader                    | 50    | ⚠️    | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
|  Breakdown by [Referrer ▼]                                |
|  +------------------------------------------------------+ |
|  | Dim Value    | Total | Bots | Humans | Unk | Bot %   | |
|  |--------------|-------|------|--------|-----|---------|  |
|  | google.com   | 300   | 45   | 240    | 15  | 15.0%   | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

#### Key Features

1. **URL State Parsing**: Read `dim`, `val`, `range`, and `filters` from query params on mount
2. **Pre-applied Filters**: If navigated from Overview with a dimension value, add it as a filter
3. **Full Filtering UI**: Allow users to modify all filters (same as Overview page)
4. **Date Range Picker**: Reuse the existing DateRangePicker component
5. **Back Navigation**: Link back to Overview (preserve state if possible)

#### State Management

```typescript
// Parse URL params on mount
const [searchParams] = useSearchParams();
const initialDim = searchParams.get("dim") as TableDimension;
const initialVal = searchParams.get("val");
const initialRange = searchParams.get("range");
const initialFilters = searchParams.get("filters");

// Initialize state from URL or defaults
const [dateRange, setDateRange] = useState<DateRangeValue>(() => {
  if (initialRange) return JSON.parse(initialRange);
  return { type: "preset", days: 7 };
});

const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
  const base = initialFilters ? JSON.parse(initialFilters) : {};
  // Add the clicked dimension as a filter if present
  if (initialDim && initialVal) {
    const filterKey = dimensionToFilterKey(initialDim); // e.g., "referrer_domain" -> "sources"
    base[filterKey] = [...(base[filterKey] || []), initialVal];
  }
  return base;
});
```

---

## 4. Component Breakdown

### New Components

| Component | Purpose |
|-----------|---------|
| `src/pages/Bots.tsx` | Main bot analytics page |
| `src/components/bots/BotSummaryCards.tsx` | 3-card grid showing bot/human/unknown split |
| `src/components/bots/BotSignalsCard.tsx` | Detection signals section |
| `src/components/bots/RendererBreakdown.tsx` | Table showing GPU renderer distribution |
| `src/components/bots/BotDimensionTable.tsx` | Breakdown table specific to bot data |

### Reused Components

- `DateRangePicker` - for date range selection
- `ScorecardFilters` - for filter management (may need filter_options from a separate call)
- `DashboardLayout` - consistent sidebar navigation
- `Card`, `Table`, `Badge`, `Skeleton` - UI primitives

---

## 5. File Changes Summary

| File | Change |
|------|--------|
| `src/lib/api.ts` | Add `BotAnalyticsRequest`, `BotAnalyticsResponse`, and `fetchBotAnalytics` |
| `src/pages/Bots.tsx` | New page for bot analytics |
| `src/components/bots/BotSummaryCards.tsx` | New component for summary stats |
| `src/components/bots/BotSignalsCard.tsx` | New component for detection signals |
| `src/components/bots/RendererBreakdown.tsx` | New component for renderer table |
| `src/components/bots/BotDimensionTable.tsx` | New component for dimension breakdown |
| `src/components/overview/DimensionTable.tsx` | Add `onBotClick` prop, make Bot % cells clickable |
| `src/pages/Overview.tsx` | Add `handleBotClick` and pass to DimensionTable |
| `src/App.tsx` | Add route for `/bots` |

---

## 6. Technical Considerations

### Dimension to Filter Key Mapping

The API uses different keys for dimensions vs filters. Need a utility function:

```typescript
const DIMENSION_TO_FILTER: Record<TableDimension, keyof ActiveFilters> = {
  referrer_domain: "sources",
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term",
  device_type: "devices",
  browser: "browsers",
  os: "os",
  date_day: undefined, // Not applicable for filtering
};
```

### Filter Options on Bots Page

The bots endpoint doesn't return `filter_options`. Options:
1. Make an initial scorecard call to get filter options
2. Allow freeform filter editing (less ideal UX)
3. Cache filter options from Overview in localStorage (quick solution)

Recommendation: Make a lightweight scorecard call on page load to get `filter_options`.

### URL State Synchronization

When filters change on the Bots page, update the URL query params so users can share/bookmark specific views.

