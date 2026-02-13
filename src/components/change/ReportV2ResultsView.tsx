import { forwardRef, useImperativeHandle, useRef } from "react";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle, TrendingUp, TrendingDown, Minus, ChevronDown,
  Wallet, Activity, Eye, BarChart3, ShieldAlert, ExternalLink, Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type {
  ReportV2Response, KpiMetric, DimensionRow, DimensionMetric, ClickChangeItem,
} from "@/types/report-v2";

export interface ReportV2ResultsViewHandle {
  handleCopyReport: () => void;
  handleExportPDF: () => void;
}

interface Props {
  result: ReportV2Response;
  hideActions?: boolean;
}

const fmt = (v: number, suffix = "") => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M${suffix}`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(1)}K${suffix}`;
  return `${Number.isInteger(v) ? v : v.toFixed(2)}${suffix}`;
};

const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

const DeltaArrow = ({ delta }: { delta: number }) => {
  if (delta > 0) return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
  if (delta < 0) return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const KPI_LABELS: Record<string, { label: string; suffix: string; invert?: boolean }> = {
  sessions: { label: "Sessions", suffix: "" },
  unique_visitors: { label: "Unique Visitors", suffix: "" },
  bounce_rate: { label: "Bounce Rate", suffix: "%", invert: true },
  wallet_detect_rate: { label: "Wallet Detect Rate", suffix: "%" },
  wallet_connect_rate: { label: "Wallet Connect Rate", suffix: "%" },
  conversion_rate: { label: "Conversion Rate", suffix: "%" },
  avg_session_duration_seconds: { label: "Avg Session Duration", suffix: "s" },
};

const KpiCard = ({ metricKey, metric }: { metricKey: string; metric: KpiMetric }) => {
  const info = KPI_LABELS[metricKey] || { label: metricKey, suffix: "" };
  const isPositive = info.invert ? metric.delta < 0 : metric.delta > 0;

  return (
    <Card className="relative overflow-hidden">
      {metric.low_confidence && (
        <div className="absolute top-2 right-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        </div>
      )}
      <CardContent className="p-4 space-y-1">
        <p className="text-xs text-muted-foreground font-medium">{info.label}</p>
        <p className="text-xl font-semibold tabular-nums">
          {fmt(metric.event, info.suffix)}
        </p>
        <div className="flex items-center gap-1.5 text-sm">
          <DeltaArrow delta={info.invert ? -metric.delta : metric.delta} />
          <span className={cn(
            "font-medium tabular-nums",
            isPositive ? "text-emerald-600" : metric.delta === 0 ? "text-muted-foreground" : "text-red-500",
          )}>
            {fmtPct(metric.delta_percent)}
          </span>
          <span className="text-muted-foreground text-xs">vs {fmt(metric.baseline, info.suffix)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const WALLET_STAT_LABELS: Record<string, string> = {
  median_usd: "Median",
  p75_usd: "P75",
  p90_usd: "P90",
  max_usd: "Max",
  whale_count: "Whales",
};

const DIM_METRIC_KEYS = ["sessions", "wallet_connect_rate", "conversion_rate", "bounce_rate"] as const;

const MetricDelta = ({ metric }: { metric: DimensionMetric | undefined }) => {
  if (!metric) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="flex items-center gap-1 tabular-nums text-sm">
      {fmt(metric.event)}
      <span className={cn(
        "text-xs",
        metric.delta > 0 ? "text-emerald-600" : metric.delta < 0 ? "text-red-500" : "text-muted-foreground",
      )}>
        ({fmtPct(metric.delta_percent)})
      </span>
    </span>
  );
};

const ClickChangesTable = ({ title, icon, items }: { title: string; icon: React.ReactNode; items: ClickChangeItem[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">{icon} {title}</p>
      <Table>
        <TableHeader>
          <TableRow>
             <TableHead>Link Text</TableHead>
             <TableHead className="max-w-[200px]">URL</TableHead>
             <TableHead>Page</TableHead>
             <TableHead className="text-right">Baseline</TableHead>
             <TableHead className="text-right">Event</TableHead>
             <TableHead className="text-right">Δ</TableHead>
             <TableHead className="text-right">Δ%</TableHead>
           </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="max-w-[180px]">
                <TooltipProvider>
                  <UiTooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium block truncate cursor-default">{item.click_text || "—"}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs break-all">
                      {item.click_text || "—"}
                    </TooltipContent>
                  </UiTooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <TooltipProvider>
                  <UiTooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate text-xs text-muted-foreground cursor-default">{item.href}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm break-all">
                      {item.href}
                    </TooltipContent>
                  </UiTooltip>
                </TooltipProvider>
              </TableCell>
               <TableCell className="max-w-[140px]">
                 <TooltipProvider>
                   <UiTooltip>
                     <TooltipTrigger asChild>
                       <span className="block truncate text-xs text-muted-foreground cursor-default">{item.page_path || "—"}</span>
                     </TooltipTrigger>
                     <TooltipContent side="top" className="max-w-xs break-all">
                       {item.page_path || "—"}
                     </TooltipContent>
                   </UiTooltip>
                 </TooltipProvider>
               </TableCell>
               <TableCell className="text-right tabular-nums">{item.baseline_clicks}</TableCell>
              <TableCell className="text-right tabular-nums">{item.event_clicks}</TableCell>
              <TableCell className="text-right tabular-nums">
                <span className={item.delta > 0 ? "text-emerald-600" : item.delta < 0 ? "text-red-500" : ""}>
                  {item.delta > 0 ? "+" : ""}{item.delta}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <span className={item.delta_percent > 0 ? "text-emerald-600" : item.delta_percent < 0 ? "text-red-500" : ""}>
                  {fmtPct(item.delta_percent)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export const ReportV2ResultsView = forwardRef<ReportV2ResultsViewHandle, Props>(
  ({ result }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      handleCopyReport() {
        const el = containerRef.current;
        if (!el) return;
        const text = el.innerText;
        navigator.clipboard.writeText(text);
      },
      handleExportPDF() {
        window.print();
      },
    }));

    const { windows, guardrails, kpi_overview, wallet_distribution_shift, behavior_changes, dimension_performance, contribution_to_change, anomaly_candidates } = result;

    const failedGuardrails = Object.entries(guardrails)
      .filter(([k, v]) => k !== "overall_low_confidence" && typeof v === "object" && !v.met)
      .map(([k, v]) => ({ name: k.replace(/_/g, " "), ...(v as { threshold: number; actual: number }) }));

    return (
      <div ref={containerRef} className="space-y-6 print:space-y-4">
        {/* Guardrails */}
        {failedGuardrails.length > 0 && (
          <Alert variant="destructive" className="border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 [&>svg]:text-amber-600">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Data Quality Warning</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-sm">
                {failedGuardrails.map((g) => (
                  <li key={g.name}>
                    <span className="capitalize">{g.name}</span>: {g.actual} (threshold: {g.threshold})
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Windows */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
            Baseline: {format(parseISO(windows.baseline_start), "MMM d")} – {format(parseISO(windows.baseline_end), "MMM d, yyyy")} ({windows.baseline_days}d)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            Event: {format(parseISO(windows.event_start), "MMM d")} – {format(parseISO(windows.event_end), "MMM d, yyyy")} ({windows.event_days}d)
          </div>
        </div>

        {/* KPI Overview */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> KPI Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(kpi_overview).map(([key, metric]) => (
              <KpiCard key={key} metricKey={key} metric={metric} />
            ))}
          </div>
        </div>

        {/* Wallet Distribution Shift */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" /> Wallet Distribution Shift
              {wallet_distribution_shift.low_confidence && (
                <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">Low Confidence</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Percentile stats */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(WALLET_STAT_LABELS).map(([key, label]) => {
                const m = wallet_distribution_shift[key as keyof typeof wallet_distribution_shift] as KpiMetric | undefined;
                if (!m || typeof m !== "object" || !("baseline" in m)) return null;
                return (
                  <div key={key} className="text-center">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold tabular-nums">${fmt(m.event)}</p>
                    <p className={cn("text-xs tabular-nums", m.delta > 0 ? "text-emerald-600" : m.delta < 0 ? "text-red-500" : "text-muted-foreground")}>
                      {fmtPct(m.delta_percent)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bucket chart */}
            {wallet_distribution_shift.buckets?.length > 0 && (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wallet_distribution_shift.buckets} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                    <Legend />
                    <Bar dataKey="baseline_percent" name="Baseline" fill="hsl(var(--muted-foreground))" opacity={0.4} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="event_percent" name="Event" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Behavior Changes & Click Changes */}
        {(behavior_changes.items.length > 0 || behavior_changes.outbound_click_gainers?.length || behavior_changes.outbound_click_losers?.length || behavior_changes.internal_click_gainers?.length || behavior_changes.internal_click_losers?.length) && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" /> Behavior Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {behavior_changes.items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Behavior</TableHead>
                      <TableHead className="text-right">Baseline</TableHead>
                      <TableHead className="text-right">Event</TableHead>
                      <TableHead className="text-right">Δ</TableHead>
                      <TableHead className="text-right">Δ%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...behavior_changes.items]
                      .sort((a, b) => Math.abs(b.delta_percent) - Math.abs(a.delta_percent))
                      .map((item) => (
                        <TableRow key={item.behavior}>
                          <TableCell className="font-medium">{item.behavior.replace(/_/g, " ")}</TableCell>
                          <TableCell className="text-right tabular-nums">{item.baseline_rate.toFixed(1)}%</TableCell>
                          <TableCell className="text-right tabular-nums">{item.event_rate.toFixed(1)}%</TableCell>
                          <TableCell className="text-right tabular-nums">
                            <span className={item.delta > 0 ? "text-emerald-600" : item.delta < 0 ? "text-red-500" : ""}>
                              {item.delta > 0 ? "+" : ""}{item.delta.toFixed(1)}pp
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            <span className={item.delta_percent > 0 ? "text-emerald-600" : item.delta_percent < 0 ? "text-red-500" : ""}>
                              {fmtPct(item.delta_percent)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
              <ClickChangesTable title="Outbound Click Gainers" icon={<ExternalLink className="h-3.5 w-3.5 text-emerald-600" />} items={behavior_changes.outbound_click_gainers || []} />
              <ClickChangesTable title="Outbound Click Losers" icon={<ExternalLink className="h-3.5 w-3.5 text-red-500" />} items={behavior_changes.outbound_click_losers || []} />
              <ClickChangesTable title="Internal Click Gainers" icon={<Link2 className="h-3.5 w-3.5 text-emerald-600" />} items={behavior_changes.internal_click_gainers || []} />
              <ClickChangesTable title="Internal Click Losers" icon={<Link2 className="h-3.5 w-3.5 text-red-500" />} items={behavior_changes.internal_click_losers || []} />
            </CardContent>
          </Card>
        )}

        {/* Dimension Performance */}
        {dimension_performance && Object.keys(dimension_performance).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Dimension Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {Object.entries(dimension_performance).map(([dim, rows]) => {
                if (!rows || rows.length === 0) return null;
                return (
                  <Collapsible key={dim}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-2.5 px-1 text-sm font-medium hover:bg-muted/50 rounded transition-colors [&[data-state=open]>svg]:rotate-180">
                      <span className="capitalize">{dim.replace(/_/g, " ")}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Value</TableHead>
                            {DIM_METRIC_KEYS.map((mk) => (
                              <TableHead key={mk} className="text-right capitalize">{mk.replace(/_/g, " ")}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(rows as DimensionRow[]).map((row) => (
                            <TableRow key={row.dimension_value}>
                              <TableCell className="font-medium max-w-[200px] truncate">{row.dimension_value}</TableCell>
                              {DIM_METRIC_KEYS.map((mk) => (
                                <TableCell key={mk} className="text-right">
                                  <MetricDelta metric={row[mk] as DimensionMetric | undefined} />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Contribution to Change */}
        {contribution_to_change.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contribution to Change</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dimension</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right">Δ</TableHead>
                    <TableHead className="text-right">Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contribution_to_change
                    .sort((a, b) => b.contribution_percent - a.contribution_percent)
                    .map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="capitalize">{item.dimension.replace(/_/g, " ")}</TableCell>
                        <TableCell className="font-medium max-w-[160px] truncate">{item.dimension_value}</TableCell>
                        <TableCell className="capitalize">{item.metric.replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          <span className={item.absolute_delta > 0 ? "text-emerald-600" : item.absolute_delta < 0 ? "text-red-500" : ""}>
                            {item.absolute_delta > 0 ? "+" : ""}{item.absolute_delta.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">{item.contribution_percent.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Anomaly Candidates */}
        {anomaly_candidates.length > 0 && (
          <Card className="border-amber-200 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Anomaly Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {anomaly_candidates
                  .sort((a, b) => b.score - a.score)
                  .map((a, i) => (
                    <div key={i} className="rounded border border-amber-200/60 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-800/40 p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{a.dimension_value}</span>
                        <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700">
                          score {a.score.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {a.dimension.replace(/_/g, " ")} · {a.metric.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm tabular-nums">
                        {a.baseline_value.toFixed(1)} → {a.event_value.toFixed(1)}{" "}
                        <span className={a.absolute_delta > 0 ? "text-emerald-600" : "text-red-500"}>
                          ({a.absolute_delta > 0 ? "+" : ""}{a.absolute_delta.toFixed(1)})
                        </span>
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

ReportV2ResultsView.displayName = "ReportV2ResultsView";
