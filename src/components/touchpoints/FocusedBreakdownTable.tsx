interface BreakdownMetric {
  baseline_daily_avg: number;
  event_daily_avg: number;
  uplift_percent: number;
  absolute_delta?: number;
  low_confidence?: boolean;
}

interface BreakdownItem {
  key: string;
  visitors?: BreakdownMetric;
  conversions?: BreakdownMetric;
  wallets?: BreakdownMetric;
  baseline_total?: number;
  event_total?: number;
  expected?: number;
  actual?: number;
  incremental?: number;
  uplift_percent?: number;
}

interface FocusedBreakdownTableProps {
  data: BreakdownItem[];
  metricKey: "conversions" | "wallets";
  metricLabel: string;
  formatNumber: (n: number) => string;
  formatPercent: (n: number, baselineZero?: boolean) => string;
}

function toTitleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function FocusedBreakdownTable({
  data,
  metricKey,
  metricLabel,
  formatNumber,
  formatPercent,
}: FocusedBreakdownTableProps) {
  const zero: BreakdownMetric = { baseline_daily_avg: 0, event_daily_avg: 0, uplift_percent: 0 };

  // Sort by |absolute_delta| descending
  const sorted = [...data].sort((a, b) => {
    const aM = a[metricKey] ?? zero;
    const bM = b[metricKey] ?? zero;
    return Math.abs(bM.absolute_delta ?? 0) - Math.abs(aM.absolute_delta ?? 0);
  });

  const maxVal = Math.max(
    ...sorted.map(d => {
      const m = d[metricKey] ?? zero;
      return Math.max(m.baseline_daily_avg, m.event_daily_avg);
    }),
    1
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1.5fr_0.7fr_2fr_0.8fr] bg-muted/50 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <div>Dimension</div>
        <div className="text-right">Δ/day</div>
        <div>{metricLabel}</div>
        <div className="text-right">Uplift</div>
      </div>

      {/* Rows */}
      {sorted.map((item, idx) => {
        const metric = item[metricKey] ?? zero;
        const isNew = metric.baseline_daily_avg === 0 && metric.event_daily_avg > 0;
        const isPositive = metric.uplift_percent > 0;
        const isLowConf = metric.low_confidence === true;
        const delta = metric.absolute_delta ?? (metric.event_daily_avg - metric.baseline_daily_avg);
        const baselineW = maxVal > 0 ? (metric.baseline_daily_avg / maxVal) * 100 : 0;
        const actualW = maxVal > 0 ? (metric.event_daily_avg / maxVal) * 100 : 0;

        return (
          <div
            key={idx}
            className={`grid grid-cols-[1.5fr_0.7fr_2fr_0.8fr] items-center px-4 py-3 border-t border-border ${idx === 0 ? "bg-emerald-50/50 dark:bg-emerald-950/10" : "bg-card"}`}
            style={{ opacity: isLowConf ? 0.5 : 1 }}
          >
            {/* Dimension */}
            <div className="text-sm font-medium text-foreground truncate pr-3">
              {toTitleCase(item.key || "(not set)")}
              {isLowConf && <span className="text-[9px] text-muted-foreground ml-1">(uncertain)</span>}
            </div>

            {/* Absolute delta */}
            <div className="text-right">
              <span className={`text-xs font-bold tabular-nums ${delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                {isNew ? "NEW" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`}
              </span>
            </div>

            {/* Metric bars */}
            <div className="space-y-1">
              {/* Baseline */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 rounded-full transition-all"
                    style={{ width: `${Math.max(baselineW, 1)}%` }}
                  />
                </div>
                <span className="text-[10px] tabular-nums text-muted-foreground w-12 text-right shrink-0">
                  {metric.baseline_daily_avg.toFixed(1)}
                </span>
              </div>
              {/* Actual */}
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${isPositive || isNew ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                  <div
                    className={`h-full rounded-full transition-all ${isPositive || isNew ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ width: `${Math.max(actualW, 1)}%` }}
                  />
                </div>
                <span className="text-[10px] tabular-nums font-semibold text-foreground w-12 text-right shrink-0">
                  {metric.event_daily_avg.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Uplift */}
            <div className="text-right">
              {isNew ? (
                <span className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  NEW
                </span>
              ) : metric.uplift_percent === 0 ? (
                <span className="text-muted-foreground text-xs">—</span>
              ) : (
                <span className={`text-xs font-bold tabular-nums ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                  {formatPercent(metric.uplift_percent)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
