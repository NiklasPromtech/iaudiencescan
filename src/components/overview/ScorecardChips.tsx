import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  Wallet,
  Target,
  Timer,
  Bot,
  Percent,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Star,
  Radio,
  DollarSign,
  PieChart,
  Puzzle,
} from "lucide-react";
import { ScorecardResponse } from "@/lib/api";

// Metric definition
interface MetricDefinition {
  key: string;
  label: string;
  shortLabel?: string;
  icon: React.ReactNode;
  getValue: (data: ScorecardResponse["data"]) => number | null;
  format?: "number" | "percent" | "currency";
  category: "traffic" | "engagement" | "wallets" | "conversions" | "bots" | "costs";
}

// All available metrics
const METRICS: MetricDefinition[] = [
  // Traffic
  {
    key: "unique_visitors",
    label: "Unique Visitors",
    shortLabel: "Visitors",
    icon: <Users className="h-4 w-4" />,
    getValue: (d) => d.unique_visitors,
    category: "traffic",
  },
  {
    key: "pageviews",
    label: "Page Views",
    shortLabel: "Views",
    icon: <FileText className="h-4 w-4" />,
    getValue: (d) => d.pageviews,
    category: "traffic",
  },
  {
    key: "bounce_rate",
    label: "Bounce Rate",
    shortLabel: "Bounce",
    icon: <TrendingDown className="h-4 w-4" />,
    getValue: (d) => d.unique_visitors > 0 ? Math.round((d.bounce_count / d.unique_visitors) * 100) : null,
    format: "percent",
    category: "traffic",
  },
  {
    key: "visitors_with_wallet_extension",
    label: "Wallet Extensions",
    shortLabel: "Extensions",
    icon: <Puzzle className="h-4 w-4" />,
    getValue: (d) => d.visitors_with_wallet_extension ?? null,
    category: "traffic",
  },
  // Engagement
  {
    key: "stayed_10s",
    label: "Stayed 10s+",
    shortLabel: "10s+",
    icon: <Timer className="h-4 w-4" />,
    getValue: (d) => d.stayed_10s,
    category: "engagement",
  },
  {
    key: "stayed_30s",
    label: "Stayed 30s+",
    shortLabel: "30s+",
    icon: <Timer className="h-4 w-4" />,
    getValue: (d) => d.stayed_30s,
    category: "engagement",
  },
  {
    key: "stayed_60s",
    label: "Stayed 60s+",
    shortLabel: "60s+",
    icon: <Timer className="h-4 w-4" />,
    getValue: (d) => d.stayed_60s,
    category: "engagement",
  },
  {
    key: "stayed_5m",
    label: "Stayed 5m+",
    shortLabel: "5m+",
    icon: <Timer className="h-4 w-4" />,
    getValue: (d) => d.stayed_5m,
    category: "engagement",
  },
  {
    key: "engagement_rate_10s",
    label: "10s Rate",
    icon: <Percent className="h-4 w-4" />,
    getValue: (d) => d.unique_visitors > 0 ? Math.round((d.stayed_10s / d.unique_visitors) * 100) : null,
    format: "percent",
    category: "engagement",
  },
  {
    key: "engagement_rate_30s",
    label: "30s Rate",
    icon: <Percent className="h-4 w-4" />,
    getValue: (d) => d.unique_visitors > 0 ? Math.round((d.stayed_30s / d.unique_visitors) * 100) : null,
    format: "percent",
    category: "engagement",
  },
  // Wallets
  {
    key: "wallet_users",
    label: "Wallets Tracked",
    shortLabel: "Wallets",
    icon: <Wallet className="h-4 w-4" />,
    getValue: (d) => d.wallet_users,
    category: "wallets",
  },
  {
    key: "wallets_enriched",
    label: "Wallets Enriched",
    shortLabel: "Enriched",
    icon: <Wallet className="h-4 w-4" />,
    getValue: (d) => d.wallets_enriched ?? null,
    category: "wallets",
  },
  {
    key: "percent_enriched",
    label: "Enriched %",
    shortLabel: "Enrich %",
    icon: <PieChart className="h-4 w-4" />,
    getValue: (d) => d.percent_enriched ?? null,
    format: "percent",
    category: "wallets",
  },
  {
    key: "total_balance_usd",
    label: "Total Balance",
    shortLabel: "Balance",
    icon: <DollarSign className="h-4 w-4" />,
    getValue: (d) => d.total_balance_usd ?? null,
    format: "currency",
    category: "wallets",
  },
  {
    key: "median_balance_usd",
    label: "Median Balance",
    shortLabel: "Median",
    icon: <DollarSign className="h-4 w-4" />,
    getValue: (d) => d.median_balance_usd ?? null,
    format: "currency",
    category: "wallets",
  },
  // Conversions
  {
    key: "converted_users",
    label: "Conversions",
    icon: <Target className="h-4 w-4" />,
    getValue: (d) => d.converted_users,
    category: "conversions",
  },
  {
    key: "conversions_total",
    label: "Total Conversions",
    shortLabel: "Conv Total",
    icon: <Target className="h-4 w-4" />,
    getValue: (d) => d.conversions_total,
    category: "conversions",
  },
  // Bots
  {
    key: "bot_rate",
    label: "Bot Rate",
    shortLabel: "Bots",
    icon: <Bot className="h-4 w-4" />,
    getValue: (d) => d.bot_checked && d.bot_checked > 0 ? Math.round(((d.bot_visitors ?? 0) / d.bot_checked) * 100) : null,
    format: "percent",
    category: "bots",
  },
  {
    key: "bot_visitors",
    label: "Bot Visitors",
    icon: <Bot className="h-4 w-4" />,
    getValue: (d) => d.bot_visitors,
    category: "bots",
  },
  // Costs
  {
    key: "cost_total",
    label: "Total Cost",
    shortLabel: "Cost",
    icon: <DollarSign className="h-4 w-4" />,
    getValue: (d) => d.cost_total ?? null,
    format: "currency",
    category: "costs",
  },
];

// Category labels for grouping
const CATEGORY_LABELS: Record<string, string> = {
  traffic: "Traffic",
  engagement: "Time on Site",
  wallets: "Wallet Tracking",
  conversions: "Conversions",
  bots: "Bot Detection",
  costs: "Costs & ROI",
};

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
    <div className="space-y-4">
      {/* Main grid - starred metrics as pill cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Realtime pill - always visible */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Radio className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-foreground leading-tight">
              {realtimeVisitors !== null ? realtimeVisitors : "—"}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Active now</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Starred metrics as pill cards */}
        {loading ? (
          <>
            <Skeleton className="h-[62px] rounded-xl" />
            <Skeleton className="h-[62px] rounded-xl" />
            <Skeleton className="h-[62px] rounded-xl" />
            <Skeleton className="h-[62px] rounded-xl" />
          </>
        ) : (
          starredMetricsList.map((metric) => (
            <MetricPill
              key={metric.key}
              metric={metric}
              value={data ? metric.getValue(data) : null}
              formatValue={formatValue}
              isStarred={true}
              onToggleStar={() => onToggleStar(metric.key)}
            />
          ))
        )}

        {/* Show more toggle as a pill */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
        >
          {showAll ? (
            <>
              <span className="text-sm">Less</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="text-sm">More</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Expanded section - ALL metrics grouped by category, starred ones highlighted */}
      {showAll && !loading && (
        <div className="space-y-4 pt-3 border-t border-border/50">
          {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
            const categoryMetrics = METRICS.filter((m) => m.category === category);
            if (categoryMetrics.length === 0) return null;
            
            return (
              <div key={category}>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {label}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {categoryMetrics.map((metric) => (
                    <MetricPillSmall
                      key={metric.key}
                      metric={metric}
                      value={data ? metric.getValue(data) : null}
                      formatValue={formatValue}
                      isStarred={starredMetrics.includes(metric.key)}
                      onToggleStar={() => onToggleStar(metric.key)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtle date range indicator */}
      <p className="text-xs text-muted-foreground">
        Showing data for {dateRangeLabel}
      </p>
    </div>
  );
}

interface MetricPillProps {
  metric: MetricDefinition;
  value: number | null;
  formatValue: (value: number | null, format?: "number" | "percent" | "currency") => string;
  isStarred: boolean;
  onToggleStar: () => void;
}

function MetricPill({ metric, value, formatValue, isStarred, onToggleStar }: MetricPillProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isUnconfigured = value === null;
  const displayValue = formatValue(value, metric.format);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150",
        isStarred
          ? "bg-background border-border hover:border-primary/50 hover:shadow-sm"
          : "bg-muted/20 border-border/50 hover:bg-muted/40 hover:border-border",
        isUnconfigured && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
        isStarred ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {metric.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-lg font-semibold leading-tight truncate",
          isStarred ? "text-foreground" : "text-muted-foreground"
        )}>
          {displayValue}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {metric.shortLabel || metric.label}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar();
        }}
        className={cn(
          "absolute -right-1.5 -top-1.5 p-1 rounded-full bg-background border shadow-sm transition-all duration-150",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
          isStarred ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-primary hover:border-primary"
        )}
      >
        <Star className={cn("h-3 w-3", isStarred && "fill-primary")} />
      </button>
    </div>
  );
}

// Smaller pill for metrics in expanded section - highlights starred ones
interface MetricPillSmallProps {
  metric: MetricDefinition;
  value: number | null;
  formatValue: (value: number | null, format?: "number" | "percent" | "currency") => string;
  isStarred: boolean;
  onToggleStar: () => void;
}

function MetricPillSmall({ metric, value, formatValue, isStarred, onToggleStar }: MetricPillSmallProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUnconfigured = value === null;
  const displayValue = formatValue(value, metric.format);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all duration-150",
        isStarred
          ? "bg-primary/10 border-primary/30 hover:border-primary/50"
          : "bg-muted/20 border-border/50 hover:bg-muted/40 hover:border-border",
        isUnconfigured && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center",
        isStarred ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {React.cloneElement(metric.icon as React.ReactElement, { className: "h-3 w-3" })}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-sm font-medium leading-tight truncate",
          isStarred ? "text-foreground" : "text-muted-foreground"
        )}>
          {displayValue}
        </p>
        <p className="text-[10px] text-muted-foreground/70 truncate">
          {metric.shortLabel || metric.label}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar();
        }}
        className={cn(
          "absolute -right-1 -top-1 p-0.5 rounded-full bg-background border shadow-sm transition-all duration-150",
          isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75",
          isStarred 
            ? "border-primary text-primary" 
            : "border-border text-muted-foreground hover:text-primary hover:border-primary"
        )}
      >
        <Star className={cn("h-2.5 w-2.5", isStarred && "fill-primary")} />
      </button>
    </div>
  );
}
