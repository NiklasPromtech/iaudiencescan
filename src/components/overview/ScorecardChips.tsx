import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  Wallet,
  Target,
  Timer,
  Bot,
  CircleDollarSign,
  Percent,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Star,
  Radio,
} from "lucide-react";
import { ScorecardResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";

// Metric definition
interface MetricDefinition {
  key: string;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  getValue: (data: ScorecardResponse["data"]) => number | null;
  format?: "number" | "percent" | "currency";
  category: "traffic" | "engagement" | "wallets" | "conversions" | "bots";
}

// All available metrics
const METRICS: MetricDefinition[] = [
  // Traffic
  {
    key: "unique_visitors",
    label: "Unique Visitors",
    shortLabel: "Visitors",
    icon: <Users className="h-3.5 w-3.5" />,
    getValue: (d) => d.unique_visitors,
    category: "traffic",
  },
  {
    key: "pageviews",
    label: "Page Views",
    shortLabel: "Views",
    icon: <FileText className="h-3.5 w-3.5" />,
    getValue: (d) => d.pageviews,
    category: "traffic",
  },
  {
    key: "bounce_rate",
    label: "Bounce Rate",
    shortLabel: "Bounce",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    getValue: (d) => d.unique_visitors > 0 ? Math.round((d.bounce_count / d.unique_visitors) * 100) : null,
    format: "percent",
    category: "traffic",
  },
  // Engagement
  {
    key: "stayed_10s",
    label: "Stayed 10s+",
    shortLabel: "10s+",
    icon: <Timer className="h-3.5 w-3.5" />,
    getValue: (d) => d.stayed_10s,
    category: "engagement",
  },
  {
    key: "stayed_30s",
    label: "Stayed 30s+",
    shortLabel: "30s+",
    icon: <Timer className="h-3.5 w-3.5" />,
    getValue: (d) => d.stayed_30s,
    category: "engagement",
  },
  {
    key: "stayed_60s",
    label: "Stayed 60s+",
    shortLabel: "60s+",
    icon: <Timer className="h-3.5 w-3.5" />,
    getValue: (d) => d.stayed_60s,
    category: "engagement",
  },
  {
    key: "stayed_5m",
    label: "Stayed 5m+",
    shortLabel: "5m+",
    icon: <Timer className="h-3.5 w-3.5" />,
    getValue: (d) => d.stayed_5m,
    category: "engagement",
  },
  {
    key: "engagement_rate_10s",
    label: "10s Rate",
    icon: <Percent className="h-3.5 w-3.5" />,
    getValue: (d) => d.unique_visitors > 0 ? Math.round((d.stayed_10s / d.unique_visitors) * 100) : null,
    format: "percent",
    category: "engagement",
  },
  {
    key: "engagement_rate_30s",
    label: "30s Rate",
    icon: <Percent className="h-3.5 w-3.5" />,
    getValue: (d) => d.unique_visitors > 0 ? Math.round((d.stayed_30s / d.unique_visitors) * 100) : null,
    format: "percent",
    category: "engagement",
  },
  // Wallets
  {
    key: "wallet_users",
    label: "Wallets Tracked",
    shortLabel: "Wallets",
    icon: <Wallet className="h-3.5 w-3.5" />,
    getValue: (d) => d.wallet_users,
    category: "wallets",
  },
  // Conversions
  {
    key: "converted_users",
    label: "Conversions",
    icon: <Target className="h-3.5 w-3.5" />,
    getValue: (d) => d.converted_users,
    category: "conversions",
  },
  {
    key: "conversions_total",
    label: "Total Conversions",
    shortLabel: "Conv Total",
    icon: <Target className="h-3.5 w-3.5" />,
    getValue: (d) => d.conversions_total,
    category: "conversions",
  },
  // Bots
  {
    key: "bot_rate",
    label: "Bot Rate",
    shortLabel: "Bots",
    icon: <Bot className="h-3.5 w-3.5" />,
    getValue: (d) => d.bot_checked && d.bot_checked > 0 ? Math.round(((d.bot_visitors ?? 0) / d.bot_checked) * 100) : null,
    format: "percent",
    category: "bots",
  },
  {
    key: "bot_visitors",
    label: "Bot Visitors",
    icon: <Bot className="h-3.5 w-3.5" />,
    getValue: (d) => d.bot_visitors,
    category: "bots",
  },
];

interface ScorecardChipsProps {
  data: ScorecardResponse["data"] | null;
  loading: boolean;
  realtimeVisitors: number | null;
  starredMetrics: string[];
  onToggleStar: (metricKey: string) => void;
  dateRangeLabel: string;
}

export function ScorecardChips({
  data,
  loading,
  realtimeVisitors,
  starredMetrics,
  onToggleStar,
  dateRangeLabel,
}: ScorecardChipsProps) {
  const [showAll, setShowAll] = useState(false);

  const formatValue = (value: number | null, format?: "number" | "percent" | "currency"): string => {
    if (value === null) return "—";
    
    switch (format) {
      case "percent":
        return `${value}%`;
      case "currency":
        if (value >= 1000000) {
          return `$${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
          return `$${(value / 1000).toFixed(1)}K`;
        }
        return `$${value.toFixed(2)}`;
      default:
        return value.toLocaleString();
    }
  };

  // Filter metrics into starred and unstarred
  const starredMetricsList = METRICS.filter((m) => starredMetrics.includes(m.key));
  const unstarredMetricsList = METRICS.filter((m) => !starredMetrics.includes(m.key));

  return (
    <div className="space-y-3">
      {/* Main chips row - starred + realtime */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Realtime chip - always visible */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Radio className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">
            {realtimeVisitors !== null ? realtimeVisitors : "—"}
          </span>
          <span className="text-xs text-muted-foreground">live</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Starred metrics */}
        {loading ? (
          <>
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </>
        ) : (
          starredMetricsList.map((metric) => (
            <MetricChip
              key={metric.key}
              metric={metric}
              value={data ? metric.getValue(data) : null}
              formatValue={formatValue}
              isStarred={true}
              onToggleStar={() => onToggleStar(metric.key)}
            />
          ))
        )}

        {/* Show more/less toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              Less <ChevronUp className="h-3.5 w-3.5 ml-1" />
            </>
          ) : (
            <>
              More <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Expanded section - unstarred metrics grouped by category */}
      {showAll && !loading && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          {unstarredMetricsList.map((metric) => (
            <MetricChip
              key={metric.key}
              metric={metric}
              value={data ? metric.getValue(data) : null}
              formatValue={formatValue}
              isStarred={false}
              onToggleStar={() => onToggleStar(metric.key)}
            />
          ))}
        </div>
      )}

      {/* Subtle date range indicator */}
      <p className="text-xs text-muted-foreground pl-1">
        Showing data for {dateRangeLabel}
      </p>
    </div>
  );
}

interface MetricChipProps {
  metric: MetricDefinition;
  value: number | null;
  formatValue: (value: number | null, format?: "number" | "percent" | "currency") => string;
  isStarred: boolean;
  onToggleStar: () => void;
}

function MetricChip({ metric, value, formatValue, isStarred, onToggleStar }: MetricChipProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if metric has no data configured (null) vs zero value
  const isUnconfigured = value === null;
  const displayValue = formatValue(value, metric.format);

  return (
    <div
      className={cn(
        "group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-150",
        isStarred
          ? "bg-background border-border hover:border-primary/50"
          : "bg-muted/30 border-border/50 hover:bg-muted/50 hover:border-border",
        isUnconfigured && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      <span className={cn(
        "flex-shrink-0",
        isStarred ? "text-primary" : "text-muted-foreground"
      )}>
        {metric.icon}
      </span>

      {/* Label + Value */}
      <span className="text-xs text-muted-foreground">
        {metric.shortLabel || metric.label}:
      </span>
      <span className={cn(
        "text-xs font-medium",
        isStarred ? "text-foreground" : "text-muted-foreground"
      )}>
        {displayValue}
      </span>

      {/* Star button - appears on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar();
        }}
        className={cn(
          "absolute -right-1 -top-1 p-0.5 rounded-full bg-background border shadow-sm transition-all duration-150",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
          isStarred ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-primary hover:border-primary"
        )}
      >
        <Star
          className={cn("h-3 w-3", isStarred && "fill-primary")}
        />
      </button>
    </div>
  );
}
