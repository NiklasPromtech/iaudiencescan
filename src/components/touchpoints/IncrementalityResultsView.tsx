import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Copy,
  Check,
  ArrowRight,
  Calendar,
  Target,
  DollarSign,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MetricData {
  expected: number;
  actual: number;
  incremental?: number;
  uplift_percent?: number;
  delta?: number;
}

interface BreakdownItem {
  key: string;
  expected: number;
  actual: number;
  incremental: number;
  uplift_percent: number;
}

export interface IncrementalityResult {
  success: boolean;
  event_name: string;
  windows: {
    baseline_start: string;
    baseline_end: string;
    event_start: string;
    event_end: string;
  };
  summary: {
    headline: string;
    incremental_cpa: number | null;
    verdict: "positive" | "negative" | "neutral";
    confidence_score: number;
  };
  metrics: Record<string, MetricData>;
  breakdowns?: Record<string, BreakdownItem[]>;
  insights?: string[];
}

interface IncrementalityResultsViewProps {
  result: IncrementalityResult;
}

export function IncrementalityResultsView({ result }: IncrementalityResultsViewProps) {
  const { summary, windows, metrics, breakdowns, insights } = result;
  const reportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const formatNumber = (n: number) => {
    if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const formatPercent = (n: number) => {
    const sign = n > 0 ? "+" : "";
    return `${sign}${n.toFixed(1)}%`;
  };

  const getVerdictConfig = (verdict: string) => {
    if (verdict === "positive") {
      return {
        icon: ThumbsUp,
        label: "DO MORE",
        sublabel: "This campaign delivered incremental value",
        bgClass: "bg-emerald-500/10 border-emerald-500/30",
        textClass: "text-emerald-500",
        iconBg: "bg-emerald-500",
      };
    }
    if (verdict === "negative") {
      return {
        icon: ThumbsDown,
        label: "DON'T REPEAT",
        sublabel: "This campaign did not deliver incremental value",
        bgClass: "bg-red-500/10 border-red-500/30",
        textClass: "text-red-500",
        iconBg: "bg-red-500",
      };
    }
    return {
      icon: AlertCircle,
      label: "INCONCLUSIVE",
      sublabel: "Not enough data to determine impact",
      bgClass: "bg-amber-500/10 border-amber-500/30",
      textClass: "text-amber-500",
      iconBg: "bg-amber-500",
    };
  };

  const verdictConfig = getVerdictConfig(summary.verdict);
  const VerdictIcon = verdictConfig.icon;

  const metricEntries = Object.entries(metrics);

  const handleCopyReport = async () => {
    const reportText = generateReportText();
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast.success("Report copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const generateReportText = () => {
    const lines = [
      `INCREMENTALITY REPORT: ${result.event_name}`,
      `${"=".repeat(50)}`,
      ``,
      `VERDICT: ${verdictConfig.label}`,
      `${summary.headline}`,
      `Confidence: ${Math.round(summary.confidence_score * 100)}%`,
      summary.incremental_cpa !== null ? `Incremental CPA: $${summary.incremental_cpa.toFixed(2)}` : "",
      ``,
      `ANALYSIS PERIOD`,
      `Baseline: ${windows.baseline_start} → ${windows.baseline_end}`,
      `Event: ${windows.event_start} → ${windows.event_end}`,
      ``,
      `KEY METRICS`,
      ...metricEntries.map(([key, data]) => {
        const incremental = data.incremental ?? data.delta ?? 0;
        const uplift = data.uplift_percent !== undefined ? formatPercent(data.uplift_percent) : "—";
        return `  ${key.replace(/_/g, " ")}: ${formatNumber(data.actual)} (${incremental > 0 ? "+" : ""}${formatNumber(incremental)}, ${uplift})`;
      }),
    ];

    if (breakdowns && Object.keys(breakdowns).length > 0) {
      lines.push(``, `BREAKDOWNS`);
      Object.entries(breakdowns).forEach(([dim, items]) => {
        lines.push(`  ${dim.replace(/_/g, " ")}:`);
        items.slice(0, 5).forEach((item) => {
          lines.push(`    ${item.key || "(none)"}: ${formatPercent(item.uplift_percent)} uplift`);
        });
      });
    }

    if (insights && insights.length > 0) {
      lines.push(``, `INSIGHTS`);
      insights.forEach((insight, i) => lines.push(`  ${i + 1}. ${insight}`));
    }

    return lines.filter(Boolean).join("\n");
  };

  return (
    <div className="space-y-6" ref={reportRef}>
      {/* Export Actions */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyReport}
          className="gap-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Report"}
        </Button>
      </div>

      {/* Executive Summary - The Big Verdict */}
      <div className={cn(
        "rounded-xl border-2 p-6",
        verdictConfig.bgClass
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center shrink-0",
            verdictConfig.iconBg
          )}>
            <VerdictIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={cn("text-2xl font-bold tracking-tight", verdictConfig.textClass)}>
              {verdictConfig.label}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {verdictConfig.sublabel}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl font-bold tabular-nums">
              {Math.round(summary.confidence_score * 100)}%
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Confidence
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="mt-4 pt-4 border-t border-current/10">
          <p className="text-foreground font-medium">
            {summary.headline}
          </p>
          {summary.incremental_cpa !== null && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Incremental CPA: <span className="font-semibold text-foreground">${summary.incremental_cpa.toFixed(2)}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Period */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">
            <Calendar className="h-3.5 w-3.5" />
            Baseline Period
          </div>
          <div className="font-medium text-sm">
            {windows.baseline_start} <ArrowRight className="inline h-3 w-3 mx-1" /> {windows.baseline_end}
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-2">
            <Target className="h-3.5 w-3.5" />
            Event Period
          </div>
          <div className="font-medium text-sm">
            {windows.event_start} <ArrowRight className="inline h-3 w-3 mx-1" /> {windows.event_end}
          </div>
        </div>
      </div>

      {/* Key Metrics - Visual Cards */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Key Metrics
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {metricEntries.map(([key, data]) => {
            const isRate = key.includes("rate");
            const incremental = data.incremental ?? data.delta ?? 0;
            const isPositive = incremental > 0;
            const isNegative = incremental < 0;
            
            return (
              <div
                key={key}
                className="rounded-lg border bg-card p-4 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {key.replace(/_/g, " ")}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold tabular-nums">
                      {isRate ? `${(data.actual * 100).toFixed(1)}%` : formatNumber(data.actual)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      vs {isRate ? `${(data.expected * 100).toFixed(1)}%` : formatNumber(data.expected)} expected
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className={cn(
                      "text-lg font-semibold tabular-nums",
                      isPositive ? "text-emerald-500" : isNegative ? "text-red-500" : "text-muted-foreground"
                    )}>
                      {isRate
                        ? `${incremental > 0 ? "+" : ""}${(incremental * 100).toFixed(1)}pp`
                        : `${incremental > 0 ? "+" : ""}${formatNumber(incremental)}`}
                    </div>
                    <div className="text-xs text-muted-foreground">incremental</div>
                  </div>
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    isPositive ? "bg-emerald-500/10" : isNegative ? "bg-red-500/10" : "bg-muted"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    ) : isNegative ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : (
                      <Minus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdowns */}
      {breakdowns && Object.keys(breakdowns).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Performance by Dimension</h4>
          {Object.entries(breakdowns).map(([dimension, items]) => (
            <div key={dimension} className="rounded-lg border bg-card overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 border-b">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {dimension.replace(/_/g, " ")}
                </span>
              </div>
              <div className="divide-y">
                {items.slice(0, 5).map((item) => (
                  <div key={item.key} className="px-4 py-3 flex items-center justify-between">
                    <span className="font-medium text-sm">{item.key || "(none)"}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(item.actual)} 
                        <span className="mx-1">vs</span>
                        {formatNumber(item.expected)}
                      </span>
                      <span className={cn(
                        "font-semibold text-sm tabular-nums min-w-[60px] text-right",
                        item.uplift_percent > 0 ? "text-emerald-500" : item.uplift_percent < 0 ? "text-red-500" : ""
                      )}>
                        {formatPercent(item.uplift_percent)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Key Insights</h4>
          <div className="rounded-lg border bg-card p-4">
            <ul className="space-y-2">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground shrink-0">{idx + 1}.</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}