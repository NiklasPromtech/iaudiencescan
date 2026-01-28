import { cn } from "@/lib/utils";

export interface MetricCellProps {
  count: number | null;
  rate?: number | null;           // 0-100 percentage
  costPer?: number | null;        // Cost per this metric
  showRate?: boolean;             // Some metrics don't have rate (e.g., visitors)
  showCost?: boolean;             // Only when cost source selected
  rateThresholds?: {              // For color coding
    good: number;                 // Green above this
    warning: number;              // Orange above this, red below
  };
  className?: string;
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getRateColorClass(
  rate: number | null,
  thresholds?: { good: number; warning: number }
): string {
  if (rate === null || !thresholds) return "text-muted-foreground";
  
  if (rate >= thresholds.good) return "text-emerald-500";
  if (rate >= thresholds.warning) return "text-amber-500";
  return "text-destructive";
}

export function MetricCell({
  count,
  rate,
  costPer,
  showRate = true,
  showCost = false,
  rateThresholds,
  className,
}: MetricCellProps) {
  const rateColorClass = getRateColorClass(rate ?? null, rateThresholds);

  return (
    <div className={cn("flex flex-col text-right", className)}>
      {/* Row 1: Count - always visible */}
      <span className="font-medium tabular-nums text-foreground">
        {count !== null ? count.toLocaleString() : "—"}
      </span>
      
      {/* Row 2: Rate - always takes space, content conditional */}
      <span className={cn("text-xs tabular-nums h-4", showRate ? rateColorClass : "invisible")}>
        {showRate && rate !== undefined && rate !== null ? `${Math.round(rate)}%` : "—"}
      </span>
      
      {/* Row 3: Cost-per - always takes space when showCost is true for any cell */}
      <span className={cn("text-xs tabular-nums h-4", showCost ? "text-muted-foreground" : "invisible")}>
        {showCost ? formatCurrency(costPer ?? null) : "—"}
      </span>
    </div>
  );
}

// Engagement rate thresholds (higher is better)
export const ENGAGEMENT_THRESHOLDS = {
  good: 50,
  warning: 20,
};

// Bot rate thresholds (lower is better, so inverted logic)
export const BOT_THRESHOLDS = {
  good: 5,    // <5% bots is green
  warning: 15, // <15% is orange, >15% is red
};
