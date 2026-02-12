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
  { key: "unique_visitors", label: "Unique Visitors", shortLabel: "Visitors", icon: <Users className="h-3.5 w-3.5" />, getValue: (d) => d.unique_visitors, category: "traffic" },
  { key: "pageviews", label: "Page Views", shortLabel: "Views", icon: <FileText className="h-3.5 w-3.5" />, getValue: (d) => d.pageviews, category: "traffic" },
  { key: "bounce_rate", label: "Bounce Rate", shortLabel: "Bounce", icon: <TrendingDown className="h-3.5 w-3.5" />, getValue: (d) => d.unique_visitors > 0 ? Math.round((d.bounce_count / d.unique_visitors) * 100) : null, format: "percent", category: "traffic" },
  { key: "visitors_with_wallet_extension", label: "Wallet Extensions", shortLabel: "Extensions", icon: <Puzzle className="h-3.5 w-3.5" />, getValue: (d) => d.visitors_with_wallet_extension ?? null, category: "traffic" },
  // Engagement
  { key: "stayed_10s", label: "Stayed 10s+", shortLabel: "10s+", icon: <Timer className="h-3.5 w-3.5" />, getValue: (d) => d.stayed_10s, category: "engagement" },
  { key: "stayed_30s", label: "Stayed 30s+", shortLabel: "30s+", icon: <Timer className="h-3.5 w-3.5" />, getValue: (d) => d.stayed_30s, category: "engagement" },
  { key: "stayed_60s", label: "Stayed 60s+", shortLabel: "60s+", icon: <Timer className="h-3.5 w-3.5" />, getValue: (d) => d.stayed_60s, category: "engagement" },
  { key: "stayed_5m", label: "Stayed 5m+", shortLabel: "5m+", icon: <Timer className="h-3.5 w-3.5" />, getValue: (d) => d.stayed_5m, category: "engagement" },
  { key: "engagement_rate_10s", label: "10s Rate", icon: <Percent className="h-3.5 w-3.5" />, getValue: (d) => d.unique_visitors > 0 ? Math.round((d.stayed_10s / d.unique_visitors) * 100) : null, format: "percent", category: "engagement" },
  { key: "engagement_rate_30s", label: "30s Rate", icon: <Percent className="h-3.5 w-3.5" />, getValue: (d) => d.unique_visitors > 0 ? Math.round((d.stayed_30s / d.unique_visitors) * 100) : null, format: "percent", category: "engagement" },
  // Wallets
  { key: "wallet_users", label: "Wallets Tracked", shortLabel: "Wallets", icon: <Wallet className="h-3.5 w-3.5" />, getValue: (d) => d.wallet_users, category: "wallets" },
  { key: "wallets_enriched", label: "Wallets Enriched", shortLabel: "Enriched", icon: <Wallet className="h-3.5 w-3.5" />, getValue: (d) => d.wallets_enriched ?? null, category: "wallets" },
  { key: "percent_enriched", label: "Enriched %", shortLabel: "Enrich %", icon: <PieChart className="h-3.5 w-3.5" />, getValue: (d) => d.percent_enriched ?? null, format: "percent", category: "wallets" },
  { key: "total_balance_usd", label: "Total Balance", shortLabel: "Balance", icon: <DollarSign className="h-3.5 w-3.5" />, getValue: (d) => d.total_balance_usd ?? null, format: "currency", category: "wallets" },
  { key: "median_balance_usd", label: "Median Balance", shortLabel: "Median", icon: <DollarSign className="h-3.5 w-3.5" />, getValue: (d) => d.median_balance_usd ?? null, format: "currency", category: "wallets" },
  // Conversions
  { key: "converted_users", label: "Conversions", icon: <Target className="h-3.5 w-3.5" />, getValue: (d) => d.converted_users, category: "conversions" },
  { key: "conversions_total", label: "Total Conversions", shortLabel: "Conv Total", icon: <Target className="h-3.5 w-3.5" />, getValue: (d) => d.conversions_total, category: "conversions" },
  // Bots
  { key: "bot_rate", label: "Bot Rate", shortLabel: "Bots", icon: <Bot className="h-3.5 w-3.5" />, getValue: (d) => d.bot_checked && d.bot_checked > 0 ? Math.round(((d.bot_visitors ?? 0) / d.bot_checked) * 100) : null, format: "percent", category: "bots" },
  { key: "bot_visitors", label: "Bot Visitors", icon: <Bot className="h-3.5 w-3.5" />, getValue: (d) => d.bot_visitors, category: "bots" },
  // Costs
  { key: "cost_total", label: "Total Cost", shortLabel: "Cost", icon: <DollarSign className="h-3.5 w-3.5" />, getValue: (d) => d.cost_total ?? null, format: "currency", category: "costs" },
  // Token Holders
  { key: "token_holders", label: "Token Holders", shortLabel: "Holders", icon: <Users className="h-3.5 w-3.5" />, getValue: (d) => d.token_holders ?? null, category: "wallets" },
];

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
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
        return `$${value.toFixed(2)}`;
      default:
        return value.toLocaleString();
    }
  };

  const starredMetricsList = METRICS.filter((m) => starredMetrics.includes(m.key));
  const allItems = [
    // Realtime is always first
    { type: "realtime" as const },
    ...starredMetricsList.map((m) => ({ type: "metric" as const, metric: m })),
  ];

  return (
    <div className="space-y-3">
      {/* Flat stat row — no card borders, vertical dividers */}
      <div className="flex items-stretch flex-wrap">
        {loading ? (
          <div className="flex items-center gap-6 py-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        ) : (
          <>
            {allItems.map((item, idx) => (
              <div
                key={item.type === "realtime" ? "rt" : item.metric.key}
                className={cn(
                  "flex items-center gap-2 px-4 py-2",
                  idx < allItems.length - 1 && "border-r border-border"
                )}
              >
                {item.type === "realtime" ? (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-lg font-semibold text-foreground tabular-nums">
                      {realtimeVisitors !== null ? realtimeVisitors : "—"}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">live</span>
                  </>
                ) : (
                  <FlatMetric
                    metric={item.metric}
                    value={data ? item.metric.getValue(data) : null}
                    formatValue={formatValue}
                    isStarred={true}
                    onToggleStar={() => onToggleStar(item.metric.key)}
                  />
                )}
              </div>
            ))}

            {/* More/Less toggle — flat inline */}
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {showAll ? (
                <>Less <ChevronUp className="h-3.5 w-3.5" /></>
              ) : (
                <>More <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </button>
          </>
        )}
      </div>

      {/* Expanded section — grouped by category, flat rows */}
      {showAll && !loading && (
        <div className="space-y-3 pt-3 border-t border-border/50">
          {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
            const categoryMetrics = METRICS.filter((m) => m.category === category);
            if (categoryMetrics.length === 0) return null;

            return (
              <div key={category}>
                <p className="font-mono text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-widest">
                  {label}
                </p>
                <div className="flex items-stretch flex-wrap">
                  {categoryMetrics.map((metric, idx) => (
                    <div
                      key={metric.key}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5",
                        idx < categoryMetrics.length - 1 && "border-r border-border/50"
                      )}
                    >
                      <FlatMetric
                        metric={metric}
                        value={data ? metric.getValue(data) : null}
                        formatValue={formatValue}
                        isStarred={starredMetrics.includes(metric.key)}
                        onToggleStar={() => onToggleStar(metric.key)}
                        compact
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Date range label */}
      <p className="text-xs text-muted-foreground">
        Showing data for {dateRangeLabel}
      </p>
    </div>
  );
}

// Flat inline metric — no card, no circle icon, just icon + value + label
interface FlatMetricProps {
  metric: MetricDefinition;
  value: number | null;
  formatValue: (value: number | null, format?: "number" | "percent" | "currency") => string;
  isStarred: boolean;
  onToggleStar: () => void;
  compact?: boolean;
}

function FlatMetric({ metric, value, formatValue, isStarred, onToggleStar, compact }: FlatMetricProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUnconfigured = value === null;
  const displayValue = formatValue(value, metric.format);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 transition-colors",
        isUnconfigured && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={cn(
        "text-muted-foreground",
        isStarred && "text-primary"
      )}>
        {metric.icon}
      </span>

      <div className="min-w-0">
        <p className={cn(
          "font-mono font-semibold leading-tight tabular-nums",
          compact ? "text-sm" : "text-lg",
          isStarred ? "text-foreground" : "text-muted-foreground"
        )}>
          {displayValue}
        </p>
        <p className={cn(
          "font-mono text-muted-foreground truncate",
          compact ? "text-[10px]" : "text-xs"
        )}>
          {metric.shortLabel || metric.label}
        </p>
      </div>

      {/* Star toggle — inline, no shadow, no rounded-full badge */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar();
        }}
        className={cn(
          "p-0.5 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0",
          isStarred ? "text-primary" : "text-muted-foreground hover:text-primary"
        )}
      >
        <Star className={cn("h-3 w-3", isStarred && "fill-primary")} />
      </button>
    </div>
  );
}
