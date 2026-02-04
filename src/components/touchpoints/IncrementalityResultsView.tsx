import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, Lightbulb, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

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

const verdictColors = {
  positive: "text-green-500",
  negative: "text-red-500",
  neutral: "text-muted-foreground",
};

const verdictBgColors = {
  positive: "bg-green-500/10 border-green-500/20",
  negative: "bg-red-500/10 border-red-500/20",
  neutral: "bg-muted/50 border-border",
};

const VerdictIcon = ({ verdict }: { verdict: string }) => {
  if (verdict === "positive") return <TrendingUp className="h-5 w-5 text-green-500" />;
  if (verdict === "negative") return <TrendingDown className="h-5 w-5 text-red-500" />;
  return <Minus className="h-5 w-5 text-muted-foreground" />;
};

export function IncrementalityResultsView({ result }: IncrementalityResultsViewProps) {
  const { summary, windows, metrics, breakdowns, insights } = result;

  const formatNumber = (n: number) => {
    if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const formatPercent = (n: number) => {
    const sign = n > 0 ? "+" : "";
    return `${sign}${n.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className={cn("p-6 border", verdictBgColors[summary.verdict])}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <VerdictIcon verdict={summary.verdict} />
            <div>
              <h3 className={cn("text-xl font-semibold", verdictColors[summary.verdict])}>
                {summary.headline}
              </h3>
              {summary.incremental_cpa !== null && (
                <p className="text-sm text-muted-foreground mt-1">
                  <DollarSign className="h-3.5 w-3.5 inline mr-1" />
                  Incremental CPA: <span className="font-medium text-foreground">${summary.incremental_cpa.toFixed(2)}</span>
                </p>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {Math.round(summary.confidence_score * 100)}% confidence
          </Badge>
        </div>
      </Card>

      {/* Date Windows */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Baseline: {windows.baseline_start} → {windows.baseline_end}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Event: {windows.event_start} → {windows.event_end}</span>
        </div>
      </div>

      {/* Metrics Table */}
      <div>
        <h4 className="text-sm font-medium mb-3">Key Metrics</h4>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Expected</TableHead>
                <TableHead className="text-right">Actual</TableHead>
                <TableHead className="text-right">Incremental</TableHead>
                <TableHead className="text-right">Uplift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(metrics).map(([key, data]) => {
                const isRate = key.includes("rate");
                const incremental = data.incremental ?? data.delta ?? 0;
                const isPositive = incremental > 0;
                
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium capitalize">
                      {key.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {isRate ? `${(data.expected * 100).toFixed(1)}%` : formatNumber(data.expected)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isRate ? `${(data.actual * 100).toFixed(1)}%` : formatNumber(data.actual)}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-medium",
                      isPositive ? "text-green-500" : incremental < 0 ? "text-red-500" : ""
                    )}>
                      {isRate
                        ? `${incremental > 0 ? "+" : ""}${(incremental * 100).toFixed(1)}pp`
                        : `${incremental > 0 ? "+" : ""}${formatNumber(incremental)}`}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right",
                      isPositive ? "text-green-500" : (data.uplift_percent ?? 0) < 0 ? "text-red-500" : ""
                    )}>
                      {data.uplift_percent !== undefined ? formatPercent(data.uplift_percent) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Breakdowns */}
      {breakdowns && Object.keys(breakdowns).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Breakdowns</h4>
          {Object.entries(breakdowns).map(([dimension, items]) => (
            <div key={dimension} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-2 border-b">
                <span className="text-sm font-medium capitalize">{dimension.replace(/_/g, " ")}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Expected</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Incremental</TableHead>
                    <TableHead className="text-right">Uplift</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.slice(0, 10).map((item) => (
                    <TableRow key={item.key}>
                      <TableCell className="font-medium">{item.key || "(none)"}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatNumber(item.expected)}
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(item.actual)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        item.incremental > 0 ? "text-green-500" : item.incremental < 0 ? "text-red-500" : ""
                      )}>
                        {item.incremental > 0 ? "+" : ""}{formatNumber(item.incremental)}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right",
                        item.uplift_percent > 0 ? "text-green-500" : item.uplift_percent < 0 ? "text-red-500" : ""
                      )}>
                        {formatPercent(item.uplift_percent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Insights
          </h4>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-2">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
