import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { 
  Copy,
  Check,
  Download,
  TrendingUp,
  TrendingDown,
  FileText,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Users,
  Wallet,
  Target,
  Globe,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import audienceScanLogo from "@/assets/audiencescan-logo-dark.png";
import { CountryMapChart } from "./CountryMapChart";

// ==================== INTERFACES ====================

interface FunnelItem {
  event?: string;
  action?: string;
  baseline_daily_avg: number;
  event_period_total: number;
  expected: number;
  actual: number;
  incremental: number;
  uplift_percent: number;
}

interface TimelineDay {
  date: string;
  period: "baseline" | "event";
  visitors: number;
  conversions: number;
  wallet_connections: number;
}

interface AttributionSource {
  source: string;
  incremental_conversions: number;
  percent_of_total: number;
}

interface BreakdownMetric {
  baseline_daily_avg: number;
  event_daily_avg: number;
  uplift_percent: number;
}

interface BreakdownItem {
  key: string;
  visitors?: BreakdownMetric;
  conversions?: BreakdownMetric;
  wallets?: BreakdownMetric;
  // Legacy flat fields (backward compat)
  baseline_total?: number;
  event_total?: number;
  expected?: number;
  actual?: number;
  incremental?: number;
  uplift_percent?: number;
}

export interface IncrementalityResult {
  success: boolean;
  event_name: string;
  windows: {
    baseline_start: string;
    baseline_end: string;
    event_start: string;
    event_end: string;
    baseline_days?: number;
    event_days?: number;
  };
  cost?: {
    amount: number;
    currency: string;
  } | null;
  executive_summary: {
    headline: string;
    total_incremental_conversions: number;
    total_incremental_wallet_connections: number;
    conversion_uplift_percent: number;
    wallet_uplift_percent: number;
    cost_per_incremental_conversion: number | null;
    roi: number | null;
    verdict: "highly_positive" | "positive" | "neutral" | "negative" | "highly_negative";
    confidence_score: number;
  };
  conversion_funnel: FunnelItem[];
  wallet_funnel: FunnelItem[];
  daily_timeline: TimelineDay[];
  attribution: {
    top_sources: AttributionSource[];
  };
  traffic_summary: {
    baseline_daily_avg_visitors: number;
    baseline_daily_avg_pageviews?: number;
    event_period_visitors: number;
    event_period_pageviews?: number;
    incremental_visitors: number;
    visitor_uplift_percent: number;
    bounce_rate_baseline: number;
    bounce_rate_event: number;
  };
  token_holders?: {
    has_data: boolean;
    total_baseline_holders: number;
    total_event_holders: number;
    total_holder_change: number;
    total_holder_change_percent: number;
    contracts: any[];
  };
  insights: string[];
  breakdowns?: {
    country?: BreakdownItem[];
    utm_source?: BreakdownItem[];
    utm_medium?: BreakdownItem[];
    utm_campaign?: BreakdownItem[];
    utm_content?: BreakdownItem[];
    utm_term?: BreakdownItem[];
    region?: BreakdownItem[];
    city?: BreakdownItem[];
    referrer_domain?: BreakdownItem[];
    conversion_event?: BreakdownItem[];
    wallet_action?: BreakdownItem[];
  };
}

interface IncrementalityResultsViewProps {
  result: IncrementalityResult;
  hideActions?: boolean;
}

export interface IncrementalityResultsViewHandle {
  handleCopyReport: () => Promise<void>;
  handleExportPDF: () => Promise<void>;
}

// ==================== MAIN COMPONENT ====================

export const IncrementalityResultsView = forwardRef<IncrementalityResultsViewHandle, IncrementalityResultsViewProps>(function IncrementalityResultsView({ result, hideActions }, ref) {
  const { executive_summary, windows, conversion_funnel, wallet_funnel, daily_timeline, attribution, traffic_summary, insights, breakdowns } = result;
  const reportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [openBreakdowns, setOpenBreakdowns] = useState<Record<string, boolean>>({ utm_source: true });

  useImperativeHandle(ref, () => ({
    handleCopyReport,
    handleExportPDF,
  }));

  // Utility functions
  const formatNumber = (n: number) => {
    if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const formatPercent = (n: number, baselineZero?: boolean) => {
    if (baselineZero) return "NEW";
    const sign = n > 0 ? "+" : "";
    return `${sign}${n.toFixed(1)}%`;
  };

  const getConfidenceReason = (score: number, baselineDays?: number) => {
    if (score < 0.5 && baselineDays !== undefined && baselineDays < 7) {
      return `Limited — short baseline (${baselineDays}d)`;
    }
    if (score < 0.5) return "Limited — high variance in baseline";
    if (score < 0.7) return "Moderate — extend period for stronger signal";
    return "Strong statistical signal";
  };

  const cleanInsight = (insight: string): string => {
    return insight.replace(
      /(\d+(?:\.\d+)?)% of (new wallet connections|wallets?) converted/gi,
      (_, pct) => {
        const num = parseFloat(pct);
        if (num > 100) return `${(num / 100).toFixed(1)} conversions per new wallet connection`;
        return `${pct}% of new wallet connections converted`;
      }
    );
  };

  const confidenceReason = getConfidenceReason(executive_summary.confidence_score, windows.baseline_days);
  const confidenceScore = Math.round(executive_summary.confidence_score * 100);
  const confidenceColor = executive_summary.confidence_score >= 0.7 ? '#059669' : executive_summary.confidence_score >= 0.4 ? '#f59e0b' : '#dc2626';
  const confidenceDotClass = executive_summary.confidence_score >= 0.7 ? 'bg-emerald-500' : executive_summary.confidence_score >= 0.4 ? 'bg-amber-500' : 'bg-red-500';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getVerdictConfig = (verdict: string) => {
    if (verdict === "highly_positive" || verdict === "positive") {
      return {
        label: verdict === "highly_positive" ? "STRONG POSITIVE IMPACT" : "POSITIVE IMPACT",
        sublabel: "This period delivered measurable incremental value beyond baseline expectations",
        badgeBg: "#166534",
        summaryBg: "#dcfce7",
        badgeClass: "bg-emerald-800 text-white",
        heroBorderClass: "border-emerald-200",
        heroBgClass: "bg-emerald-50/50",
        recommendation: "Repeat this approach. The incremental metrics demonstrate strong unit economics worth scaling."
      };
    }
    if (verdict === "highly_negative" || verdict === "negative") {
      return {
        label: verdict === "highly_negative" ? "NEGATIVE IMPACT" : "BELOW EXPECTATIONS",
        sublabel: "This period did not deliver expected incremental results above baseline",
        badgeBg: "#991b1b",
        summaryBg: "#fee2e2",
        badgeClass: "bg-red-800 text-white",
        heroBorderClass: "border-red-200",
        heroBgClass: "bg-red-50/50",
        recommendation: "Reconsider this approach. The period did not generate meaningful incremental value above what would have happened naturally."
      };
    }
    return {
      label: "INCONCLUSIVE",
      sublabel: "Insufficient data to determine if the period generated incremental impact",
      badgeBg: "#92400e",
      summaryBg: "#fef3c7",
      badgeClass: "bg-amber-800 text-white",
      heroBorderClass: "border-amber-200",
      heroBgClass: "bg-amber-50/50",
      recommendation: "Gather more data before drawing conclusions. Consider extending the analysis period or increasing baseline sample size."
    };
  };

  const verdictConfig = getVerdictConfig(executive_summary.verdict);

  const analysisPeriodText = `Baseline: ${formatDate(windows.baseline_start)} – ${formatDate(windows.baseline_end)} (${windows.baseline_days || 'N/A'}d)  •  Event: ${formatDate(windows.event_start)} – ${formatDate(windows.event_end)} (${windows.event_days || 'N/A'}d)`;

  const breakdownPages = breakdowns ? Object.entries(breakdowns).filter(([_, items]) => items && items.length > 0) : [];
  const totalPages = 3 + breakdownPages.length + 1;
  let currentPage = 0;

  const handleCopyReport = async () => {
    const reportText = generateReportText();
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast.success("Report copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [0.35, 0.45, 0.5, 0.45],
        filename: `incrementality-report-${result.event_name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      await html2pdf().set(opt).from(reportRef.current).save();
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const generateReportText = () => {
    const lines = [
      `INCREMENTALITY ANALYSIS REPORT`,
      `Period: ${result.event_name}`,
      `${"=".repeat(60)}`,
      ``,
      `EXECUTIVE SUMMARY`,
      `${"-".repeat(40)}`,
      `Verdict: ${verdictConfig.label}`,
      `${executive_summary.headline}`,
      ``,
      `Key Metrics:`,
      `• Incremental Conversions: ${formatNumber(executive_summary.total_incremental_conversions)} (${formatPercent(executive_summary.conversion_uplift_percent)} uplift)`,
      `• Incremental Wallet Connections: ${formatNumber(executive_summary.total_incremental_wallet_connections)} (${formatPercent(executive_summary.wallet_uplift_percent)} uplift)`,
      executive_summary.cost_per_incremental_conversion !== null ? `• Cost per Incremental Conversion: $${executive_summary.cost_per_incremental_conversion.toFixed(2)}` : "",
      executive_summary.roi !== null ? `• ROI: ${executive_summary.roi.toFixed(1)}%` : "",
      `• Confidence Score: ${confidenceScore}% — ${confidenceReason}`,
      ``,
      `ANALYSIS PERIOD`,
      `${"-".repeat(40)}`,
      `Baseline: ${windows.baseline_start} to ${windows.baseline_end} (${windows.baseline_days || 'N/A'} days)`,
      `Event: ${windows.event_start} to ${windows.event_end} (${windows.event_days || 'N/A'} days)`,
      ``,
    ];

    if (conversion_funnel.length > 0) {
      lines.push(`CONVERSION FUNNEL`, `${"-".repeat(40)}`);
      conversion_funnel.forEach(item => {
        lines.push(`• ${item.event}: ${formatNumber(item.actual)} actual vs ${formatNumber(item.expected)} expected (${formatPercent(item.uplift_percent)} uplift)`);
      });
      lines.push(``);
    }

    if (wallet_funnel.length > 0) {
      lines.push(`WALLET FUNNEL`, `${"-".repeat(40)}`);
      wallet_funnel.forEach(item => {
        lines.push(`• ${item.action}: ${formatNumber(item.actual)} actual vs ${formatNumber(item.expected)} expected (${formatPercent(item.uplift_percent)} uplift)`);
      });
      lines.push(``);
    }

    if (attribution.top_sources.length > 0) {
      lines.push(`ATTRIBUTION`, `${"-".repeat(40)}`);
      attribution.top_sources.forEach(source => {
        lines.push(`• ${source.source}: ${formatNumber(source.incremental_conversions)} conversions (${source.percent_of_total.toFixed(1)}% of total)`);
      });
      lines.push(``);
    }

    if (insights.length > 0) {
      lines.push(`KEY INSIGHTS`, `${"-".repeat(40)}`);
      insights.forEach((insight, i) => lines.push(`${i + 1}. ${insight}`));
      lines.push(``);
    }

    lines.push(
      `TRAFFIC SUMMARY`,
      `${"-".repeat(40)}`,
      `• Baseline Daily Avg Visitors: ${formatNumber(traffic_summary.baseline_daily_avg_visitors)}`,
      `• Event Period Visitors: ${formatNumber(traffic_summary.event_period_visitors)}`,
      `• Incremental Visitors: ${formatNumber(traffic_summary.incremental_visitors)} (${formatPercent(traffic_summary.visitor_uplift_percent)})`,
      `• Bounce Rate: ${traffic_summary.bounce_rate_baseline.toFixed(1)}% → ${traffic_summary.bounce_rate_event.toFixed(1)}%`,
    );

    return lines.filter(Boolean).join("\n");
  };

  const maxVisitors = Math.max(...daily_timeline.map(d => d.visitors), 1);
  const hasCostMetrics = executive_summary.cost_per_incremental_conversion !== null || executive_summary.roi !== null;

  const breakdownConfig: { key: keyof NonNullable<typeof breakdowns>; title: string; icon: typeof Globe }[] = [
    { key: 'utm_source', title: 'UTM Source', icon: Target },
    { key: 'utm_medium', title: 'UTM Medium', icon: Target },
    { key: 'utm_campaign', title: 'UTM Campaign', icon: Target },
    { key: 'utm_content', title: 'UTM Content', icon: Target },
    { key: 'utm_term', title: 'UTM Term', icon: Target },
    { key: 'country', title: 'Country', icon: Globe },
    { key: 'region', title: 'Region', icon: Globe },
    { key: 'city', title: 'City', icon: Globe },
    { key: 'referrer_domain', title: 'Referrer Domain', icon: Globe },
    { key: 'conversion_event', title: 'Conversion Event', icon: Zap },
    { key: 'wallet_action', title: 'Wallet Action', icon: Wallet },
  ];

  // Combine conversion + wallet funnel for "What Changed"
  const allFunnelItems = [
    ...conversion_funnel.map(f => ({ label: f.event || "Unknown", ...f })),
    ...wallet_funnel.map(f => ({ label: f.action || "Unknown", ...f })),
  ];

  const toggleBreakdown = (key: string) => {
    setOpenBreakdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-1">
      {!hideActions && (
        <div className="flex justify-end gap-2 mb-4 print:hidden">
          <Button variant="outline" size="sm" onClick={handleCopyReport} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Text"}
          </Button>
          <Button variant="default" size="sm" onClick={handleExportPDF} disabled={exporting} className="gap-2">
            {exporting ? (
              <><Download className="h-4 w-4 animate-pulse" />Exporting...</>
            ) : (
              <><Download className="h-4 w-4" />Export PDF</>
            )}
          </Button>
        </div>
      )}

      {/* ==================== ON-SCREEN DASHBOARD VIEW ==================== */}
      <div className="print:hidden space-y-4">
        
        {/* HERO CARD */}
        <div className={`rounded-xl border-2 ${verdictConfig.heroBorderClass} ${verdictConfig.heroBgClass} p-5`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${verdictConfig.badgeClass}`}>
                {verdictConfig.label}
              </span>
              <h2 className="text-lg font-semibold text-foreground mt-2 leading-snug">
                {executive_summary.headline}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(windows.event_start)} – {formatDate(windows.event_end)} ({windows.event_days}d)
                <span className="mx-1.5">·</span>
                Baseline: {windows.baseline_days}d
                {result.cost && (
                  <><span className="mx-1.5">·</span>${result.cost.amount.toLocaleString()} {result.cost.currency}</>
                )}
              </p>
            </div>
            <div className="text-center shrink-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className={`w-2.5 h-2.5 rounded-full ${confidenceDotClass}`} />
                <span className="text-2xl font-bold text-foreground tabular-nums">{confidenceScore}%</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Confidence</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[140px]">{confidenceReason}</div>
            </div>
          </div>
        </div>

        {/* METRIC GRID */}
        <div className={`grid gap-3 ${hasCostMetrics ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
          <DashboardMetricCard
            label="Incr. Conversions"
            value={`${executive_summary.total_incremental_conversions >= 0 ? '+' : ''}${formatNumber(executive_summary.total_incremental_conversions)}`}
            change={formatPercent(executive_summary.conversion_uplift_percent)}
            positive={executive_summary.conversion_uplift_percent > 0}
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <DashboardMetricCard
            label="Incr. Wallets"
            value={`${executive_summary.total_incremental_wallet_connections >= 0 ? '+' : ''}${formatNumber(executive_summary.total_incremental_wallet_connections)}`}
            change={formatPercent(executive_summary.wallet_uplift_percent)}
            positive={executive_summary.wallet_uplift_percent > 0}
            icon={<Wallet className="h-4 w-4" />}
          />
          {executive_summary.cost_per_incremental_conversion !== null && (
            <DashboardMetricCard
              label="Cost / Incr. Conv."
              value={`$${executive_summary.cost_per_incremental_conversion.toFixed(2)}`}
              icon={<Target className="h-4 w-4" />}
            />
          )}
          {executive_summary.roi !== null && (
            <DashboardMetricCard
              label="ROI"
              value={`${executive_summary.roi.toFixed(0)}%`}
              positive={executive_summary.roi > 0}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          )}
        </div>

        {/* WHAT CHANGED */}
        {allFunnelItems.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">What Changed</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allFunnelItems.map((item, idx) => {
                const maxVal = Math.max(item.expected, item.actual) || 1;
                const expectedW = (item.expected / maxVal) * 100;
                const actualW = (item.actual / maxVal) * 100;
                const isNew = item.expected === 0 && item.actual > 0;
                const isPositive = item.incremental > 0;
                return (
                  <div key={idx} className="rounded-lg bg-muted/30 px-3 py-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground truncate">{item.label}</span>
                      <span className={`text-xs font-bold tabular-nums ${isNew ? 'text-blue-600' : isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isNew ? 'NEW' : formatPercent(item.uplift_percent)}
                      </span>
                    </div>
                    {/* Mini comparison bars */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground w-12 shrink-0">Expected</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${expectedW}%` }} />
                        </div>
                        <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">{formatNumber(item.expected)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-emerald-600 font-semibold w-12 shrink-0">Actual</span>
                        <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${actualW}%` }} />
                        </div>
                        <span className="text-[10px] tabular-nums font-semibold text-foreground w-8 text-right">{formatNumber(item.actual)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* DAILY SPARKLINE */}
        {daily_timeline.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Daily Traffic</h3>
            <div className="flex items-end gap-[2px] h-[80px]">
              {daily_timeline.map((day, idx) => {
                const isEvent = day.period === "event";
                const barH = Math.max((day.visitors / maxVisitors) * 100, 6);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div
                      className={`w-full rounded-t transition-colors ${isEvent ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                      style={{ height: `${barH}%`, minHeight: '3px' }}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-popover border border-border rounded px-2 py-1 text-[10px] shadow-lg whitespace-nowrap z-10">
                      <div className="font-medium">{day.date.slice(5)}</div>
                      <div>{day.visitors} visitors · {day.conversions} conv</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-muted-foreground">{daily_timeline[0]?.date.slice(5)}</span>
              <div className="flex gap-3 text-[9px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-zinc-300 inline-block" />Baseline</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Period</span>
              </div>
              <span className="text-[9px] text-muted-foreground">{daily_timeline[daily_timeline.length - 1]?.date.slice(5)}</span>
            </div>
          </div>
        )}

        {/* TOP SOURCES */}
        {attribution.top_sources.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top Sources</h3>
            <div className="space-y-2">
              {attribution.top_sources.slice(0, 5).map((source, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground w-28 truncate shrink-0">{source.source}</span>
                  <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded"
                      style={{ width: `${Math.max(source.percent_of_total, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs tabular-nums text-foreground font-medium w-16 text-right shrink-0">
                    {formatNumber(source.incremental_conversions)} <span className="text-muted-foreground">({source.percent_of_total.toFixed(0)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BREAKDOWNS (Accordion) */}
        {breakdownConfig.map(({ key, title, icon: Icon }) => {
          const data = breakdowns?.[key];
          if (!data || data.length === 0) return null;
          const isOpen = openBreakdowns[key] || false;
          const sorted = [...data].sort((a, b) => {
            const aU = a.visitors?.uplift_percent ?? a.uplift_percent ?? 0;
            const bU = b.visitors?.uplift_percent ?? b.uplift_percent ?? 0;
            return bU - aU;
          }).slice(0, 10);

          return (
            <div key={key} className="rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => toggleBreakdown(key)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{title}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{data.length}</span>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-border">
                  {key === 'country' && (
                    <div className="mt-3 mb-3">
                      <CountryMapChart data={sorted.map(d => ({
                        key: d.key,
                        incremental: Math.round((d.visitors?.event_daily_avg ?? 0) - (d.visitors?.baseline_daily_avg ?? 0)),
                        uplift_percent: d.visitors?.uplift_percent ?? 0,
                        baseline_total: Math.round(d.visitors?.baseline_daily_avg ?? 0),
                        actual: Math.round(d.visitors?.event_daily_avg ?? 0),
                      }))} formatNumber={formatNumber} formatPercent={formatPercent} />
                    </div>
                  )}
                  <div className="mt-3">
                    <BreakdownTable data={sorted} formatNumber={formatNumber} formatPercent={formatPercent} />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* INSIGHTS */}
        {insights.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Insights</h3>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="text-primary font-bold tabular-nums shrink-0">{idx + 1}.</span>
                  <span className="text-foreground leading-relaxed">{cleanInsight(insight)}</span>
                </div>
              ))}
            </div>
            {/* Recommendation */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="h-3.5 w-3.5 text-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Recommendation</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{verdictConfig.recommendation}</p>
            </div>
          </div>
        )}

        {/* METHODOLOGY (collapsed) */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => toggleBreakdown('_methodology')}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Methodology & Traffic Summary</span>
            {openBreakdowns['_methodology'] ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </button>
          {openBreakdowns['_methodology'] && (
            <div className="px-4 pb-4 border-t border-border space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-muted/50 px-3 py-2">
                  <div className="text-[10px] text-muted-foreground">Baseline Daily Avg</div>
                  <div className="text-sm font-semibold text-foreground">{formatNumber(traffic_summary.baseline_daily_avg_visitors)} visitors</div>
                </div>
                <div className="rounded bg-muted/50 px-3 py-2">
                  <div className="text-[10px] text-muted-foreground">Period Total</div>
                  <div className="text-sm font-semibold text-foreground">{formatNumber(traffic_summary.event_period_visitors)} visitors</div>
                </div>
                <div className="rounded bg-muted/50 px-3 py-2">
                  <div className="text-[10px] text-muted-foreground">Incremental Visitors</div>
                  <div className="text-sm font-semibold text-foreground">+{formatNumber(traffic_summary.incremental_visitors)} <span className="text-emerald-600 text-xs">{formatPercent(traffic_summary.visitor_uplift_percent)}</span></div>
                </div>
                <div className="rounded bg-muted/50 px-3 py-2">
                  <div className="text-[10px] text-muted-foreground">Bounce Rate</div>
                  <div className="text-sm font-semibold text-foreground">{traffic_summary.bounce_rate_baseline.toFixed(1)}% → {traffic_summary.bounce_rate_event.toFixed(1)}%</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This report uses <strong>incrementality analysis</strong> to measure the causal impact of marketing activities. 
                We compare observed behavior during the selected period against expected behavior based on historical baseline.
                The baseline period was {windows.baseline_days} days ({formatDate(windows.baseline_start)} – {formatDate(windows.baseline_end)}).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== HIDDEN PDF REPORT CONTAINER ==================== */}
      <div 
        ref={reportRef} 
        className="hidden"
        style={{ 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          backgroundColor: '#ffffff',
          color: '#18181b',
          fontSize: '12px',
          lineHeight: '1.5',
        }}
      >
        {/* ==================== PAGE 1: COVER & EXECUTIVE SUMMARY ==================== */}
        <div style={{ pageBreakAfter: 'always', padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
          {/* Header Bar with Branding */}
          <div style={{ 
            backgroundColor: '#18181b', 
            color: '#ffffff', 
            padding: '20px 24px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ 
                  fontSize: '10px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px', 
                  color: '#a1a1aa',
                  marginBottom: '4px'
                }}>
                  Incrementality Analysis Report
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>
                  {result.event_name}
                </h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <img 
                  src={audienceScanLogo} 
                  alt="AudienceScan" 
                  style={{ height: '24px', filter: 'brightness(0) invert(1)', marginBottom: '4px' }}
                />
                <div style={{ fontSize: '10px', color: '#a1a1aa' }}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Box */}
          <div style={{ 
            backgroundColor: verdictConfig.summaryBg, 
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '14px',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#52525b',
              fontWeight: '600'
            }}>
              <FileText size={14} color="#52525b" />
              Executive Summary
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: verdictConfig.badgeBg,
                  color: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px'
                }}>
                  {verdictConfig.label}
                </div>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#18181b',
                  margin: '0 0 6px 0',
                  lineHeight: '1.3'
                }}>
                  {executive_summary.headline}
                </h2>
                <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
                  {verdictConfig.sublabel}
                </p>
              </div>
              
              {/* Confidence Gauge */}
              <div style={{ 
                textAlign: 'center', 
                marginLeft: '24px',
                padding: '16px 20px',
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: '10px',
                minWidth: '100px'
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#18181b', lineHeight: 1 }}>
                  {confidenceScore}%
                </div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#52525b', marginTop: '8px', fontWeight: '600' }}>
                  Confidence
                </div>
                <div style={{ marginTop: '8px', height: '4px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${confidenceScore}%`, height: '100%', backgroundColor: confidenceColor, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '9px', color: '#52525b', marginTop: '8px', lineHeight: '1.4', maxWidth: '140px' }}>
                  {confidenceReason}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <MetricCard label="Incremental Conversions" value={`${executive_summary.total_incremental_conversions >= 0 ? '+' : ''}${formatNumber(executive_summary.total_incremental_conversions)}`} subvalue={formatPercent(executive_summary.conversion_uplift_percent)} positive={executive_summary.conversion_uplift_percent > 0} flex="1 1 calc(50% - 6px)" />
            <MetricCard label="Incremental Wallets" value={`${executive_summary.total_incremental_wallet_connections >= 0 ? '+' : ''}${formatNumber(executive_summary.total_incremental_wallet_connections)}`} subvalue={formatPercent(executive_summary.wallet_uplift_percent)} positive={executive_summary.wallet_uplift_percent > 0} flex="1 1 calc(50% - 6px)" />
            {executive_summary.cost_per_incremental_conversion !== null && (
              <MetricCard label="Cost per Incremental Conversion" value={`$${executive_summary.cost_per_incremental_conversion.toFixed(2)}`} flex="1 1 calc(50% - 6px)" />
            )}
            {executive_summary.roi !== null && (
              <MetricCard label="Return on Investment" value={`${executive_summary.roi.toFixed(0)}%`} positive={executive_summary.roi > 0} flex="1 1 calc(50% - 6px)" />
            )}
          </div>

          {/* Analysis Period */}
          <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '16px 20px', border: '1px solid #e4e4e7', marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a1a1aa', fontWeight: '600', marginBottom: '12px' }}>Analysis Period</div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '2px' }}>Baseline</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#18181b' }}>
                  {formatDate(windows.baseline_start)} – {formatDate(windows.baseline_end)}
                  <span style={{ fontWeight: '400', color: '#71717a', marginLeft: '6px' }}>({windows.baseline_days} days)</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '2px' }}>Selected Period</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#18181b' }}>
                  {formatDate(windows.event_start)} – {formatDate(windows.event_end)}
                  <span style={{ fontWeight: '400', color: '#71717a', marginLeft: '6px' }}>({windows.event_days} days)</span>
                </div>
              </div>
              {result.cost && (
                <div>
                  <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '2px' }}>Investment</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#18181b' }}>${result.cost.amount.toLocaleString()} {result.cost.currency}</div>
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <PageFooter analysisPeriod={analysisPeriodText} pageNumber={++currentPage} totalPages={totalPages} />
        </div>

        {/* ==================== PAGE 2: THE INCREMENTAL STORY ==================== */}
        {(conversion_funnel.length > 0 || wallet_funnel.length > 0) && (
          <div style={{ pageBreakAfter: 'always', padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
            <ReportPageHeader title="The Incremental Story" subtitle="Measuring true impact beyond baseline expectations" eventName={result.event_name} />
            
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '18px 20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Lightbulb size={16} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af', marginBottom: '6px' }}>Why Incremental Matters</div>
                  <p style={{ fontSize: '11px', color: '#3b82f6', margin: 0, lineHeight: '1.6' }}>
                    Incremental metrics measure the <strong>TRUE</strong> impact of your period – the additional conversions and wallet connections you gained <strong>BEYOND</strong> what would have happened naturally. Raw totals include organic activity. Incremental isolates your marketing's real contribution. <strong>This is what investors care about.</strong>
                  </p>
                </div>
              </div>
            </div>
            
            {conversion_funnel.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <SectionHeader title="Conversion Events" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {conversion_funnel.map((item, idx) => (
                    <FunnelComparisonBar key={idx} label={item.event || "Unknown"} expected={item.expected} actual={item.actual} incremental={item.incremental} upliftPercent={item.uplift_percent} />
                  ))}
                </div>
              </div>
            )}

            {wallet_funnel.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <SectionHeader title="Wallet Activity" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {wallet_funnel.map((item, idx) => (
                    <FunnelComparisonBar key={idx} label={item.action || "Unknown"} expected={item.expected} actual={item.actual} incremental={item.incremental} upliftPercent={item.uplift_percent} />
                  ))}
                </div>
              </div>
            )}

            <div style={{ flex: 1 }} />
            <PageFooter analysisPeriod={analysisPeriodText} pageNumber={++currentPage} totalPages={totalPages} />
          </div>
        )}

        {/* ==================== PAGE 3: TIMELINE & ATTRIBUTION ==================== */}
        <div style={{ pageBreakAfter: 'always', padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
          <ReportPageHeader title="Timeline & Attribution" subtitle="Daily performance and traffic source breakdown" eventName={result.event_name} />
          
          {daily_timeline.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <SectionHeader title="Daily Performance" />
              <div style={{ padding: '20px 16px 12px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #e4e4e7' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px', marginBottom: '8px' }}>
                  {daily_timeline.slice(-14).map((day, idx) => {
                    const isEvent = day.period === "event";
                    const barHeight = Math.max((day.visitors / maxVisitors) * 100, 8);
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '8px', fontWeight: '600', color: isEvent ? '#059669' : '#71717a', marginBottom: '4px', whiteSpace: 'nowrap' }}>{formatNumber(day.visitors)}</div>
                        <div style={{ width: '100%', maxWidth: '36px', background: isEvent ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' : 'linear-gradient(180deg, #a1a1aa 0%, #71717a 100%)', borderRadius: '4px 4px 0 0', height: `${barHeight}%`, minHeight: '6px', boxShadow: isEvent ? '0 2px 4px rgba(16, 185, 129, 0.3)' : 'none', position: 'relative' }}>
                          {barHeight > 30 && (
                            <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{day.conversions}</div>
                          )}
                        </div>
                        <div style={{ fontSize: '8px', color: isEvent ? '#059669' : '#a1a1aa', fontWeight: isEvent ? '600' : '400', marginTop: '6px', whiteSpace: 'nowrap' }}>{day.date.slice(5)}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', paddingTop: '12px', borderTop: '1px solid #e4e4e7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                    <div style={{ width: '14px', height: '14px', background: 'linear-gradient(180deg, #a1a1aa 0%, #71717a 100%)', borderRadius: '3px' }} />
                    <span style={{ color: '#52525b', fontWeight: '500' }}>Baseline Period</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                    <div style={{ width: '14px', height: '14px', background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', borderRadius: '3px' }} />
                    <span style={{ color: '#52525b', fontWeight: '500' }}>Selected Period</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {attribution.top_sources.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <SectionHeader title="Traffic Attribution" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {attribution.top_sources.slice(0, 8).map((source, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '120px', fontSize: '13px', fontWeight: '500', color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{source.source}</div>
                    <div style={{ flex: 1, height: '22px', backgroundColor: '#e4e4e7', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(source.percent_of_total, 2)}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                        {source.percent_of_total > 15 && (
                          <span style={{ fontSize: '10px', fontWeight: '600', color: '#fff' }}>{source.percent_of_total.toFixed(0)}%</span>
                        )}
                      </div>
                    </div>
                    <div style={{ width: '100px', textAlign: 'right', fontSize: '12px' }}>
                      <span style={{ fontWeight: '600', color: '#18181b' }}>{formatNumber(source.incremental_conversions)}</span>
                      <span style={{ color: '#71717a', marginLeft: '4px' }}>({source.percent_of_total.toFixed(0)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ flex: 1 }} />
          <PageFooter analysisPeriod={analysisPeriodText} pageNumber={++currentPage} totalPages={totalPages} />
        </div>

        {/* ==================== BREAKDOWN PAGES (Dynamic) ==================== */}
        {breakdownConfig.map(({ key, title }) => {
          const data = breakdowns?.[key];
          if (!data || data.length === 0) return null;
          const sortedData = [...data].sort((a, b) => {
            const aUplift = a.visitors?.uplift_percent ?? a.uplift_percent ?? 0;
            const bUplift = b.visitors?.uplift_percent ?? b.uplift_percent ?? 0;
            return bUplift - aUplift;
          }).slice(0, 10);
          const topPerformer = sortedData[0];
          const topVisitorUplift = topPerformer?.visitors?.uplift_percent ?? topPerformer?.uplift_percent ?? 0;
          const topVisitorEventAvg = topPerformer?.visitors?.event_daily_avg ?? 0;
          
          return (
            <div key={key} style={{ pageBreakAfter: 'always', padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
              <ReportPageHeader title={`Breakdown: ${title}`} subtitle={`Incremental performance by ${title.toLowerCase()}`} eventName={result.event_name} />
              
              {topPerformer && topVisitorUplift > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <TrendingUp size={18} color="#059669" />
                  <div>
                    <span style={{ fontWeight: '600', color: '#166534' }}>{topPerformer.key}</span>
                    <span style={{ color: '#15803d' }}>{' '}drove the most incremental traffic with{' '}</span>
                    <span style={{ fontWeight: '700', color: '#166534' }}>{topVisitorEventAvg.toFixed(1)}/day avg ({topPerformer.visitors?.baseline_daily_avg === 0 ? 'NEW' : `+${topVisitorUplift.toFixed(1)}%`})</span>
                  </div>
                </div>
              )}
              
              {key === 'country' && (
                <CountryMapChart data={sortedData.map(d => ({
                  key: d.key,
                  incremental: Math.round((d.visitors?.event_daily_avg ?? 0) - (d.visitors?.baseline_daily_avg ?? 0)),
                  uplift_percent: d.visitors?.uplift_percent ?? 0,
                  baseline_total: Math.round(d.visitors?.baseline_daily_avg ?? 0),
                  actual: Math.round(d.visitors?.event_daily_avg ?? 0),
                }))} formatNumber={formatNumber} formatPercent={formatPercent} />
              )}
              
              <BreakdownTable data={sortedData} formatNumber={formatNumber} formatPercent={formatPercent} />
              <div style={{ flex: 1 }} />
              <PageFooter analysisPeriod={analysisPeriodText} pageNumber={++currentPage} totalPages={totalPages} />
            </div>
          );
        })}

        {/* ==================== FINAL PAGE: INSIGHTS & APPENDIX ==================== */}
        <div style={{ padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
          <ReportPageHeader title="Insights & Methodology" subtitle="Key findings and analysis framework" eventName={result.event_name} />
          
          {insights.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <SectionHeader title="Key Insights" />
              <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '16px 20px', border: '1px solid #e4e4e7' }}>
                {insights.map((insight, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: idx < insights.length - 1 ? '1px solid #e4e4e7' : 'none' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: '#3b82f6', minWidth: '24px' }}>{idx + 1}.</span>
                    <span style={{ fontSize: '12px', color: '#18181b', lineHeight: '1.5' }}>{cleanInsight(insight)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ backgroundColor: verdictConfig.summaryBg, borderRadius: '8px', padding: '18px 20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ArrowRight size={16} color="#18181b" />
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#18181b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommendation</span>
            </div>
            <p style={{ fontSize: '12px', color: '#18181b', margin: 0, lineHeight: '1.6' }}>{verdictConfig.recommendation}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a1a1aa', fontWeight: '600', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #e4e4e7' }}>Appendix: Traffic Summary</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <AppendixStat label="Baseline Daily Average" value={`${formatNumber(traffic_summary.baseline_daily_avg_visitors)} visitors`} />
              <AppendixStat label="Event Period Total" value={`${formatNumber(traffic_summary.event_period_visitors)} visitors`} />
              <AppendixStat label="Incremental Visitors" value={`+${formatNumber(traffic_summary.incremental_visitors)}`} subvalue={formatPercent(traffic_summary.visitor_uplift_percent)} positive={traffic_summary.visitor_uplift_percent > 0} />
              <AppendixStat label="Bounce Rate Change" value={`${traffic_summary.bounce_rate_baseline.toFixed(1)}% → ${traffic_summary.bounce_rate_event.toFixed(1)}%`} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a1a1aa', fontWeight: '600', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #e4e4e7' }}>Methodology</div>
            <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '16px 20px', border: '1px solid #e4e4e7', fontSize: '11px', color: '#52525b', lineHeight: '1.7' }}>
              <p style={{ margin: '0 0 12px 0' }}>
                This report uses <strong>incrementality analysis</strong> to measure the causal impact of marketing activities. We compare observed behavior during the selected period against expected behavior based on historical baseline.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div><strong>Baseline Period:</strong> {windows.baseline_days} days ({formatDate(windows.baseline_start)} – {formatDate(windows.baseline_end)})</div>
                <div><strong>Selected Period:</strong> {windows.event_days} days ({formatDate(windows.event_start)} – {formatDate(windows.event_end)})</div>
                <div><strong>Incremental:</strong> Actual - Expected</div>
                <div><strong>Confidence:</strong> Statistical significance of the observed lift</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ paddingTop: '20px', borderTop: '2px solid #18181b', marginTop: '16px', textAlign: 'center' }}>
            <img src={audienceScanLogo} alt="AudienceScan" style={{ height: '28px', marginBottom: '8px' }} />
            <div style={{ fontSize: '10px', color: '#71717a' }}>Generated by AudienceScan  •  audiencescan.io</div>
            <div style={{ fontSize: '9px', color: '#a1a1aa', marginTop: '4px' }}>
              Report generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontSize: '9px', color: '#a1a1aa', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e4e4e7' }}>
              {analysisPeriodText}  •  Page {++currentPage} of {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// ==================== DASHBOARD HELPER COMPONENTS ====================

function DashboardMetricCard({ label, value, change, positive, icon }: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3.5">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-foreground tabular-nums">{value}</span>
        {change && (
          <span className={`text-xs font-semibold tabular-nums ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

// ==================== PDF HELPER COMPONENTS ====================

function ReportPageHeader({ title, subtitle, eventName }: { title: string; subtitle: string; eventName: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #18181b' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#18181b', margin: '0 0 4px 0' }}>{title}</h2>
        <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '10px', color: '#a1a1aa', marginBottom: '2px' }}>{eventName}</div>
        <img src={audienceScanLogo} alt="AudienceScan" style={{ height: '18px', opacity: 0.7 }} />
      </div>
    </div>
  );
}

function PageFooter({ analysisPeriod, pageNumber, totalPages }: { analysisPeriod: string; pageNumber: number; totalPages: number }) {
  return (
    <div style={{ paddingTop: '16px', borderTop: '1px solid #e4e4e7', marginTop: '16px' }}>
      <div style={{ fontSize: '9px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{analysisPeriod}</span>
        <span style={{ fontWeight: '500' }}>Page {pageNumber} of {totalPages}</span>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '2px solid #18181b' }}>
      <span style={{ fontSize: '13px', fontWeight: '700', color: '#18181b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
    </div>
  );
}

function MetricCard({ label, value, subvalue, positive, flex = '1 1 auto' }: { label: string; value: string; subvalue?: string; positive?: boolean; flex?: string }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '14px 16px', flex }}>
      <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '26px', fontWeight: '700', color: '#18181b', lineHeight: 1 }}>{value}</span>
        {subvalue && (
          <span style={{ fontSize: '13px', fontWeight: '600', color: positive ? '#059669' : '#dc2626' }}>{subvalue}</span>
        )}
      </div>
    </div>
  );
}

function FunnelComparisonBar({ label, expected, actual, incremental, upliftPercent }: { label: string; expected: number; actual: number; incremental: number; upliftPercent: number }) {
  const formatNum = (n: number) => {
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };
  const isPositive = incremental > 0;
  const maxValue = Math.max(expected, actual) || 1;
  const expectedWidth = (expected / maxValue) * 100;
  const actualWidth = (actual / maxValue) * 100;

  return (
    <div style={{ backgroundColor: '#fafafa', borderRadius: '10px', padding: '16px 18px', border: '1px solid #e4e4e7' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#18181b' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: isPositive ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '16px' }}>
          {isPositive ? <TrendingUp size={14} color="#059669" /> : <TrendingDown size={14} color="#dc2626" />}
          <span style={{ fontSize: '13px', fontWeight: '700', color: isPositive ? '#166534' : '#991b1b' }}>{incremental > 0 ? '+' : ''}{formatNum(incremental)}</span>
          <span style={{ fontSize: '11px', color: isPositive ? '#15803d' : '#dc2626' }}>({expected === 0 && actual > 0 ? 'NEW' : `${upliftPercent > 0 ? '+' : ''}${upliftPercent.toFixed(1)}%`})</span>
        </div>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: '#71717a', width: '70px', fontWeight: '500' }}>EXPECTED</span>
          <div style={{ flex: 1, height: '20px', backgroundColor: '#e4e4e7', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${expectedWidth}%`, background: 'linear-gradient(90deg, #a1a1aa 0%, #71717a 100%)', borderRadius: '4px' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#52525b', width: '50px', textAlign: 'right' }}>{formatNum(expected)}</span>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: '#059669', width: '70px', fontWeight: '600' }}>ACTUAL</span>
          <div style={{ flex: 1, height: '20px', backgroundColor: '#d1fae5', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${actualWidth}%`, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: '4px' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669', width: '50px', textAlign: 'right' }}>{formatNum(actual)}</span>
        </div>
      </div>
    </div>
  );
}

function BreakdownTable({ data, formatNumber, formatPercent }: { data: BreakdownItem[]; formatNumber: (n: number) => string; formatPercent: (n: number, baselineZero?: boolean) => string }) {
  const hasNewFormat = data.length > 0 && data[0].visitors !== undefined;

  if (!hasNewFormat) {
    return (
      <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', backgroundColor: '#f4f4f5', padding: '10px 16px', fontSize: '10px', fontWeight: '600', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <div>Dimension</div>
          <div style={{ textAlign: 'right' }}>Baseline</div>
          <div style={{ textAlign: 'right' }}>Actual</div>
          <div style={{ textAlign: 'right' }}>Incremental</div>
          <div style={{ textAlign: 'right' }}>Uplift</div>
        </div>
        {data.map((item, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 16px', fontSize: '12px', borderTop: '1px solid #e4e4e7', backgroundColor: idx === 0 ? '#f0fdf4' : '#ffffff' }}>
            <div style={{ fontWeight: idx === 0 ? '600' : '500', color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.key || '(not set)'}</div>
            <div style={{ textAlign: 'right', color: '#71717a' }}>{formatNumber(item.baseline_total ?? 0)}</div>
            <div style={{ textAlign: 'right', color: '#18181b', fontWeight: '500' }}>{formatNumber(item.actual ?? 0)}</div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: (item.incremental ?? 0) > 0 ? '#059669' : (item.incremental ?? 0) < 0 ? '#dc2626' : '#71717a' }}>{(item.incremental ?? 0) > 0 ? '+' : ''}{formatNumber(item.incremental ?? 0)}</div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: (item.uplift_percent ?? 0) > 0 ? '#059669' : (item.uplift_percent ?? 0) < 0 ? '#dc2626' : '#71717a' }}>{formatPercent(item.uplift_percent ?? 0)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr 0.8fr)', backgroundColor: '#f4f4f5', padding: '10px 16px', fontSize: '10px', fontWeight: '600', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.5px', gap: '4px' }}>
        <div>Dimension</div>
        <div style={{ textAlign: 'right' }}>Visitors/day</div>
        <div style={{ textAlign: 'right' }}>Uplift</div>
        <div style={{ textAlign: 'right' }}>Conv/day</div>
        <div style={{ textAlign: 'right' }}>Uplift</div>
        <div style={{ textAlign: 'right' }}>Wallets/day</div>
        <div style={{ textAlign: 'right' }}>Uplift</div>
      </div>
      {data.map((item, idx) => {
        const zero = { baseline_daily_avg: 0, event_daily_avg: 0, uplift_percent: 0 };
        const v = item.visitors ?? zero;
        const c = item.conversions ?? zero;
        const w = item.wallets ?? zero;
        return (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr 0.8fr)', padding: '10px 16px', fontSize: '11px', borderTop: '1px solid #e4e4e7', backgroundColor: idx === 0 ? '#f0fdf4' : '#ffffff', gap: '4px', alignItems: 'center' }}>
            <div style={{ fontWeight: idx === 0 ? '600' : '500', color: '#18181b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.key || '(not set)'}</div>
            <div style={{ textAlign: 'right', color: '#18181b' }}>
              <span style={{ fontWeight: '500' }}>{v.event_daily_avg.toFixed(1)}</span>
              <span style={{ color: '#a1a1aa', fontSize: '9px', marginLeft: '2px' }}>({v.baseline_daily_avg.toFixed(1)})</span>
            </div>
            <UpliftCell value={v.uplift_percent} isNew={v.baseline_daily_avg === 0 && v.event_daily_avg > 0} />
            <div style={{ textAlign: 'right', color: '#18181b' }}>
              <span style={{ fontWeight: '500' }}>{c.event_daily_avg.toFixed(1)}</span>
              <span style={{ color: '#a1a1aa', fontSize: '9px', marginLeft: '2px' }}>({c.baseline_daily_avg.toFixed(1)})</span>
            </div>
            <UpliftCell value={c.uplift_percent} isNew={c.baseline_daily_avg === 0 && c.event_daily_avg > 0} />
            <div style={{ textAlign: 'right', color: '#18181b' }}>
              <span style={{ fontWeight: '500' }}>{w.event_daily_avg.toFixed(1)}</span>
              <span style={{ color: '#a1a1aa', fontSize: '9px', marginLeft: '2px' }}>({w.baseline_daily_avg.toFixed(1)})</span>
            </div>
            <UpliftCell value={w.uplift_percent} isNew={w.baseline_daily_avg === 0 && w.event_daily_avg > 0} />
          </div>
        );
      })}
    </div>
  );
}

function UpliftCell({ value, isNew }: { value: number; isNew: boolean }) {
  if (isNew) return <div style={{ textAlign: 'right' }}><span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '10px', fontSize: '9px', fontWeight: '700' }}>NEW</span></div>;
  if (value === 0) return <div style={{ textAlign: 'right', color: '#a1a1aa', fontSize: '10px' }}>—</div>;
  return <div style={{ textAlign: 'right', fontSize: '10px', fontWeight: '600', color: value > 0 ? '#059669' : '#dc2626' }}>{value > 0 ? '+' : ''}{value.toFixed(1)}%</div>;
}

function AppendixStat({ label, value, subvalue, positive }: { label: string; value: string; subvalue?: string; positive?: boolean }) {
  return (
    <div style={{ padding: '12px 14px', backgroundColor: '#fafafa', borderRadius: '6px', border: '1px solid #e4e4e7' }}>
      <div style={{ fontSize: '10px', color: '#a1a1aa', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#18181b' }}>
        {value}
        {subvalue && <span style={{ marginLeft: '6px', fontSize: '11px', color: positive ? '#059669' : '#dc2626' }}>({subvalue})</span>}
      </div>
    </div>
  );
}
