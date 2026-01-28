
# Plan: Investment Quality Table with Row-Based Metrics

## Overview

Transform the DimensionTable to show count, rate, and cost-per on separate rows within each cell. This enables easy horizontal scanning - you can look across just the "rate" row to compare engagement rates, or just the "cost" row to compare cost efficiency.

## Cell Layout Design

Each metric cell will have three distinct rows:

```text
+-----------------+------------------+------------------+------------------+
| UTM Medium      | VISITORS         | 10s              | 30s              |
+-----------------+------------------+------------------+------------------+
| BitMedia        | 395              | 206              | 140              |  <- COUNT row
|                 |                  | 52.2%            | 35.4%            |  <- RATE row
|   $120 spent    | $0.30            | $0.58            | $0.86            |  <- COST row
+-----------------+------------------+------------------+------------------+
| Google          | 290              | 116              | 25               |  <- COUNT row
|                 |                  | 40.0%            | 8.6%             |  <- RATE row
|   $50 spent     | $0.17            | $0.43            | $2.00            |  <- COST row
+-----------------+------------------+------------------+------------------+
```

This way you can:
1. **Scan COUNT row** - Compare raw visitor/engagement numbers
2. **Scan RATE row** - Compare percentage performance
3. **Scan COST row** - Compare cost efficiency

## Visual Quality Indicators

### Row-Level Warnings
- High bot traffic (>20%): Red left border on the dimension cell + warning icon
- The bot percentage will be shown prominently in the dimension column

### Color Coding for Rates
- **Green**: Good performance (high engagement rates, low bot rates)
- **Orange**: Warning (medium performance)
- **Red**: Poor performance (low engagement, high bots)

### Investment Grade Badge
A computed grade (A+ to F) in the dimension column based on:
- Bot rate (lower is better)
- 30s engagement rate (higher is better)
- Wallet conversion rate (higher is better)

## New API Fields

Add to `TableRow` interface:
```typescript
interface TableRow {
  // Existing fields...
  
  // New cost-per fields
  cost_per_pageview: number | null;
  cost_per_stayed_10s: number | null;
  cost_per_stayed_30s: number | null;
  cost_per_stayed_60s: number | null;
  cost_per_stayed_5m: number | null;
  cost_per_wallet: number | null;
  
  // Wallet enrichment fields
  wallets_enriched: number | null;
  percent_enriched: number | null;
  total_balance_usd: number | null;
}
```

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/api.ts` | Modify | Add cost-per and wallet enrichment fields to TableRow |
| `src/components/overview/MetricCell.tsx` | Create | Reusable component for 3-row metric display |
| `src/components/overview/DimensionTable.tsx` | Modify | New layout with stacked rows, quality indicators |

## MetricCell Component

```tsx
interface MetricCellProps {
  count: number | null;
  rate: number | null;           // 0-100 percentage
  costPer: number | null;        // Cost per this metric
  showRate?: boolean;            // Some metrics don't have rate (e.g., visitors)
  showCost?: boolean;            // Only when cost source selected
  rateThresholds?: {             // For color coding
    good: number;                // Green above this
    warning: number;             // Orange above this, red below
  };
}

// Renders 3 stacked rows
<div className="flex flex-col">
  <span className="font-medium tabular-nums">{count}</span>
  {showRate && (
    <span className={cn("text-xs tabular-nums", rateColorClass)}>
      {rate}%
    </span>
  )}
  {showCost && costPer !== null && (
    <span className="text-xs text-muted-foreground tabular-nums">
      {formatCurrency(costPer)}
    </span>
  )}
</div>
```

## DimensionCell (First Column)

Enhanced dimension cell showing source info + quality:

```tsx
<div className={cn(
  "flex flex-col gap-0.5",
  hasHighBots && "border-l-2 border-destructive pl-2"
)}>
  <div className="flex items-center gap-2">
    {hasHighBots && <AlertTriangle className="h-3 w-3 text-destructive" />}
    <span className="font-medium">{dimValue}</span>
    <Badge variant={gradeVariant} className="text-xs">{grade}</Badge>
  </div>
  {hasCost && (
    <span className="text-xs text-muted-foreground">
      {formatCurrency(costTotal)} spent
    </span>
  )}
  <span className={cn("text-xs", botRateColor)}>
    {botRate}% bots
  </span>
</div>
```

## Investment Grade Logic

```typescript
function calculateGrade(row: TableRow): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
  const visitors = row.unique_visitors;
  const botRate = (row.bot_visitors ?? 0) / visitors;
  const engagementRate = (row.stayed_30s ?? 0) / visitors;
  const walletRate = (row.wallet_users ?? 0) / visitors;
  
  let score = 0;
  
  // Bot penalty (30 points max)
  if (botRate < 0.05) score += 30;
  else if (botRate < 0.15) score += 20;
  else if (botRate < 0.30) score += 10;
  
  // Engagement score (30 points max)
  if (engagementRate > 0.50) score += 30;
  else if (engagementRate > 0.30) score += 20;
  else if (engagementRate > 0.15) score += 10;
  
  // Wallet score (40 points max - most valuable)
  if (walletRate > 0.10) score += 40;
  else if (walletRate > 0.05) score += 30;
  else if (walletRate > 0.02) score += 20;
  else if (walletRate > 0) score += 10;
  
  if (score >= 90) return 'A+';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}
```

## Column Groups (Updated)

Reorganize toggleable groups:

| Group | Columns | Notes |
|-------|---------|-------|
| Traffic | Visitors, Views | Basic volume |
| Engagement | 10s, 30s, 60s, 5m | Time-based retention |
| Quality | Bot % | Already in dimension cell, but can toggle column |
| Wallets | Connected, Enriched, Balance | Wallet metrics |
| Conversions | Conv. Users, Total Conv. | Conversion metrics |

Note: Cost rows only appear when a cost source is selected. They're integrated into each metric cell, not a separate group.

## View Toggle Options

Add a simple toggle for density:
- **Standard**: Count + Rate rows
- **With Costs**: Count + Rate + Cost rows (auto-enabled when cost source selected)

## Implementation Order

1. **Update API types** - Add cost-per fields and wallet enrichment to TableRow
2. **Create MetricCell** - Reusable 3-row metric component
3. **Update DimensionTable** - New layout with:
   - Enhanced dimension column with grade + bot warning
   - MetricCell for all numeric columns
   - Automatic cost row when cost source selected
4. **Add grade calculation** - Investment quality scoring
5. **Add color utilities** - Rate thresholds for visual feedback

## Technical Notes

- If API doesn't return cost-per fields, calculate client-side: `cost_total / metric_count`
- Use `tabular-nums` CSS class for all numbers to maintain column alignment
- Grade is purely frontend calculation - visual aid only
- Bot warning threshold: 20% (configurable)
- Engagement rate colors: >50% green, 20-50% neutral, <20% red
