import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Copy,
  Check,
  ArrowRight,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Wallet,
  Target,
  BarChart3,
  Globe,
  Calendar,
  DollarSign,
  Percent,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// New VC-ready response structure
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
    event_period_visitors: number;
    incremental_visitors: number;
    visitor_uplift_percent: number;
    bounce_rate_baseline: number;
    bounce_rate_event: number;
  };
  insights: string[];
}

interface IncrementalityResultsViewProps {
  result: IncrementalityResult;
}

export function IncrementalityResultsView({ result }: IncrementalityResultsViewProps) {
  const { executive_summary, windows, conversion_funnel, wallet_funnel, daily_timeline, attribution, traffic_summary, insights } = result;
  const reportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    if (verdict === "highly_positive" || verdict === "positive") {
      return {
        label: verdict === "highly_positive" ? "STRONG POSITIVE IMPACT" : "POSITIVE IMPACT",
        sublabel: "This campaign delivered measurable incremental value",
        bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
        borderClass: "border-emerald-200 dark:border-emerald-800",
        textClass: "text-emerald-700 dark:text-emerald-400",
        badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      };
    }
    if (verdict === "highly_negative" || verdict === "negative") {
      return {
        label: verdict === "highly_negative" ? "NEGATIVE IMPACT" : "BELOW EXPECTATIONS",
        sublabel: "Campaign did not deliver expected incremental results",
        bgClass: "bg-red-50 dark:bg-red-950/30",
        borderClass: "border-red-200 dark:border-red-800",
        textClass: "text-red-700 dark:text-red-400",
        badgeClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      };
    }
    return {
      label: "INCONCLUSIVE",
      sublabel: "Insufficient data to determine campaign impact",
      bgClass: "bg-amber-50 dark:bg-amber-950/30",
      borderClass: "border-amber-200 dark:border-amber-800",
      textClass: "text-amber-700 dark:text-amber-400",
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    };
  };

  const verdictConfig = getVerdictConfig(executive_summary.verdict);

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
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `incrementality-report-${result.event_name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
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
      `Campaign: ${result.event_name}`,
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
      `• Confidence Score: ${Math.round(executive_summary.confidence_score * 100)}%`,
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

  // Calculate max for timeline chart
  const maxVisitors = Math.max(...daily_timeline.map(d => d.visitors), 1);

  return (
    <div className="space-y-1">
      {/* Export Actions - Outside the PDF area */}
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyReport}
          className="gap-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Text"}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleExportPDF}
          disabled={exporting}
          className="gap-2"
        >
          {exporting ? (
            <>
              <Download className="h-4 w-4 animate-pulse" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export PDF
            </>
          )}
        </Button>
      </div>

      {/* PDF Report Container */}
      <div 
        ref={reportRef} 
        className="bg-white dark:bg-zinc-900 rounded-lg border border-border overflow-hidden"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        {/* Report Header */}
        <div className="bg-zinc-900 dark:bg-zinc-950 text-white px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-zinc-400 mb-1">
                Incrementality Analysis Report
              </div>
              <h1 className="text-xl font-bold">{result.event_name}</h1>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-400">Analysis Period</div>
              <div className="text-sm font-medium">
                {windows.event_start} – {windows.event_end}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className={cn("px-6 py-5 border-b", verdictConfig.bgClass, verdictConfig.borderClass)}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className={cn("h-5 w-5", verdictConfig.textClass)} />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
              Executive Summary
            </h2>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2", verdictConfig.badgeClass)}>
                {verdictConfig.label}
              </div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {executive_summary.headline}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {verdictConfig.sublabel}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {Math.round(executive_summary.confidence_score * 100)}%
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wide">
                Confidence
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <MetricBox
              icon={Target}
              label="Incremental Conversions"
              value={formatNumber(executive_summary.total_incremental_conversions)}
              subvalue={formatPercent(executive_summary.conversion_uplift_percent)}
              positive={executive_summary.conversion_uplift_percent > 0}
            />
            <MetricBox
              icon={Wallet}
              label="Wallet Connections"
              value={formatNumber(executive_summary.total_incremental_wallet_connections)}
              subvalue={formatPercent(executive_summary.wallet_uplift_percent)}
              positive={executive_summary.wallet_uplift_percent > 0}
            />
            {executive_summary.cost_per_incremental_conversion !== null && (
              <MetricBox
                icon={DollarSign}
                label="Cost / Conversion"
                value={`$${executive_summary.cost_per_incremental_conversion.toFixed(2)}`}
              />
            )}
            {executive_summary.roi !== null && (
              <MetricBox
                icon={Percent}
                label="ROI"
                value={`${executive_summary.roi.toFixed(0)}%`}
                positive={executive_summary.roi > 0}
              />
            )}
          </div>
        </div>

        {/* Analysis Period */}
        <div className="px-6 py-4 border-b border-border bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-500">Baseline:</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                {windows.baseline_start} <ArrowRight className="inline h-3 w-3 mx-1" /> {windows.baseline_end}
              </span>
              {windows.baseline_days && (
                <span className="text-zinc-400">({windows.baseline_days} days)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-zinc-400" />
              <span className="text-zinc-500">Event:</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-200">
                {windows.event_start} <ArrowRight className="inline h-3 w-3 mx-1" /> {windows.event_end}
              </span>
              {windows.event_days && (
                <span className="text-zinc-400">({windows.event_days} days)</span>
              )}
            </div>
          </div>
        </div>

        {/* Funnels Section */}
        <div className="px-6 py-5 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            {conversion_funnel.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-zinc-400" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                    Conversion Funnel
                  </h3>
                </div>
                <div className="space-y-2">
                  {conversion_funnel.map((item, idx) => (
                    <FunnelRow
                      key={idx}
                      label={item.event || "Unknown"}
                      actual={item.actual}
                      expected={item.expected}
                      incremental={item.incremental}
                      upliftPercent={item.uplift_percent}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Wallet Funnel */}
            {wallet_funnel.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="h-4 w-4 text-zinc-400" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                    Wallet Funnel
                  </h3>
                </div>
                <div className="space-y-2">
                  {wallet_funnel.map((item, idx) => (
                    <FunnelRow
                      key={idx}
                      label={item.action || "Unknown"}
                      actual={item.actual}
                      expected={item.expected}
                      incremental={item.incremental}
                      upliftPercent={item.uplift_percent}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daily Timeline Chart */}
        {daily_timeline.length > 0 && (
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                Daily Timeline
              </h3>
              <div className="ml-auto flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-zinc-300 dark:bg-zinc-600" />
                  <span className="text-zinc-500">Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-zinc-500">Event</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-1 h-32">
              {daily_timeline.slice(-14).map((day, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={cn(
                      "w-full rounded-t transition-all",
                      day.period === "event" 
                        ? "bg-emerald-500" 
                        : "bg-zinc-300 dark:bg-zinc-600"
                    )}
                    style={{ height: `${(day.visitors / maxVisitors) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[9px] text-zinc-400 -rotate-45 origin-center">
                    {day.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attribution Section */}
        {attribution.top_sources.length > 0 && (
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                Attribution
              </h3>
            </div>
            <div className="space-y-2">
              {attribution.top_sources.map((source, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
                    {source.source}
                  </div>
                  <div className="flex-1 h-6 bg-zinc-100 dark:bg-zinc-800 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded"
                      style={{ width: `${source.percent_of_total}%` }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                      {formatNumber(source.incremental_conversions)}
                    </span>
                    <span className="text-zinc-400 ml-1">
                      ({source.percent_of_total.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        {insights.length > 0 && (
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                Key Insights
              </h3>
            </div>
            <ul className="space-y-2">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="text-zinc-400 font-mono">{idx + 1}.</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Traffic Summary (Appendix) */}
        <div className="px-6 py-5 bg-zinc-50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-zinc-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Appendix: Traffic Summary
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-zinc-500 text-xs">Baseline Daily Avg</div>
              <div className="font-semibold text-zinc-700 dark:text-zinc-200">
                {formatNumber(traffic_summary.baseline_daily_avg_visitors)} visitors
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs">Event Period Total</div>
              <div className="font-semibold text-zinc-700 dark:text-zinc-200">
                {formatNumber(traffic_summary.event_period_visitors)} visitors
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs">Incremental Visitors</div>
              <div className="font-semibold text-zinc-700 dark:text-zinc-200">
                {formatNumber(traffic_summary.incremental_visitors)} 
                <span className={cn(
                  "ml-1 text-xs",
                  traffic_summary.visitor_uplift_percent > 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  ({formatPercent(traffic_summary.visitor_uplift_percent)})
                </span>
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-xs">Bounce Rate Change</div>
              <div className="font-semibold text-zinc-700 dark:text-zinc-200">
                {traffic_summary.bounce_rate_baseline.toFixed(1)}% → {traffic_summary.bounce_rate_event.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-100 dark:bg-zinc-900 border-t border-border text-center">
          <p className="text-xs text-zinc-400">
            Generated by AudienceScan • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricBox({ 
  icon: Icon, 
  label, 
  value, 
  subvalue, 
  positive 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  subvalue?: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-zinc-400" />
        <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
        {subvalue && (
          <span className={cn(
            "text-sm font-medium",
            positive === true ? "text-emerald-600" : positive === false ? "text-red-600" : "text-zinc-500"
          )}>
            {subvalue}
          </span>
        )}
      </div>
    </div>
  );
}

function FunnelRow({
  label,
  actual,
  expected,
  incremental,
  upliftPercent,
}: {
  label: string;
  actual: number;
  expected: number;
  incremental: number;
  upliftPercent: number;
}) {
  const formatNumber = (n: number) => {
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const isPositive = incremental > 0;
  const isNegative = incremental < 0;

  return (
    <div className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-zinc-800 dark:text-zinc-200 truncate">{label}</div>
        <div className="text-xs text-zinc-500">
          {formatNumber(actual)} actual vs {formatNumber(expected)} expected
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className={cn(
            "font-semibold text-sm",
            isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-zinc-500"
          )}>
            {incremental > 0 ? "+" : ""}{formatNumber(incremental)}
          </div>
          <div className={cn(
            "text-xs",
            isPositive ? "text-emerald-500" : isNegative ? "text-red-500" : "text-zinc-400"
          )}>
            {upliftPercent > 0 ? "+" : ""}{upliftPercent.toFixed(1)}%
          </div>
        </div>
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          isPositive ? "bg-emerald-100 dark:bg-emerald-900/30" : isNegative ? "bg-red-100 dark:bg-red-900/30" : "bg-zinc-100 dark:bg-zinc-700"
        )}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          ) : isNegative ? (
            <TrendingDown className="h-4 w-4 text-red-600" />
          ) : (
            <Minus className="h-4 w-4 text-zinc-400" />
          )}
        </div>
      </div>
    </div>
  );
}
