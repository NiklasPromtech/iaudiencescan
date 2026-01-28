import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { TableRow as ApiTableRow } from "@/lib/api";
import { InvestmentGradeBadge, calculateInvestmentGrade } from "./InvestmentGrade";

interface DimensionCellProps {
  row: ApiTableRow;
  showGrade?: boolean;
  showCost?: boolean;
  showBotRate?: boolean;
  botWarningThreshold?: number; // Default 20%
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function DimensionCell({
  row,
  showGrade = true,
  showCost = false,
  showBotRate = true,
  botWarningThreshold = 20,
}: DimensionCellProps) {
  const visitors = row.unique_visitors;
  const botRate = visitors > 0 ? ((row.bot_visitors ?? 0) / visitors) * 100 : 0;
  const hasHighBots = botRate > botWarningThreshold;
  const grade = calculateInvestmentGrade(row);
  
  // Bot rate color
  const getBotRateColor = () => {
    if (botRate < 5) return "text-emerald-500";
    if (botRate < 15) return "text-amber-500";
    return "text-destructive";
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 min-w-[140px]",
        hasHighBots && "border-l-2 border-destructive pl-2 -ml-2"
      )}
    >
      {/* Row 1: Dimension value + Grade badge */}
      <div className="flex items-center gap-2">
        {hasHighBots && (
          <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
        )}
        <span className="font-medium text-foreground truncate">
          {row.dim_value || "(not set)"}
        </span>
        {showGrade && <InvestmentGradeBadge grade={grade} />}
      </div>
      
      {/* Row 2: Cost spent (if available) */}
      {showCost && row.cost_total !== null && (
        <span className="text-xs text-muted-foreground">
          {formatCurrency(row.cost_total)} spent
        </span>
      )}
      
      {/* Row 3: Bot rate */}
      {showBotRate && row.bot_visitors !== null && (
        <span className={cn("text-xs tabular-nums", getBotRateColor())}>
          {Math.round(botRate)}% bots
        </span>
      )}
    </div>
  );
}
