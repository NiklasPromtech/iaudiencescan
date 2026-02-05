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
  Sparkles,
  FileText
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
        bgClass: "bg-emerald-50",
        borderClass: "border-emerald-200",
        textClass: "text-emerald-700",
        badgeBg: "#dcfce7",
        badgeText: "#166534",
      };
    }
    if (verdict === "highly_negative" || verdict === "negative") {
      return {
        label: verdict === "highly_negative" ? "NEGATIVE IMPACT" : "BELOW EXPECTATIONS",
        sublabel: "Campaign did not deliver expected incremental results",
        bgClass: "bg-red-50",
        borderClass: "border-red-200",
        textClass: "text-red-700",
        badgeBg: "#fee2e2",
        badgeText: "#991b1b",
      };
    }
    return {
      label: "INCONCLUSIVE",
      sublabel: "Insufficient data to determine campaign impact",
      bgClass: "bg-amber-50",
      borderClass: "border-amber-200",
      textClass: "text-amber-700",
      badgeBg: "#fef3c7",
      badgeText: "#92400e",
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
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: `incrementality-report-${result.event_name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
        },
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

      {/* PDF Report Container - Using inline styles for PDF compatibility */}
      <div 
        ref={reportRef} 
        style={{ 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          backgroundColor: '#ffffff',
          color: '#18181b',
          fontSize: '12px',
          lineHeight: '1.5',
        }}
      >
        {/* ==================== PAGE 1: COVER & EXECUTIVE SUMMARY ==================== */}
        <div style={{ pageBreakAfter: 'always', padding: '32px' }}>
          {/* Header Bar */}
          <div style={{ 
            backgroundColor: '#18181b', 
            color: '#ffffff', 
            padding: '24px 32px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
                  {result.event_name}
                </h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#a1a1aa' }}>Report Generated</div>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary Box */}
          <div style={{ 
            backgroundColor: verdictConfig.badgeBg, 
            border: `2px solid ${verdictConfig.badgeText}20`,
            borderRadius: '12px',
            padding: '28px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '16px',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#52525b',
              fontWeight: '600'
            }}>
              <FileText size={16} color="#52525b" />
              Executive Summary
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'inline-block',
                  backgroundColor: verdictConfig.badgeText,
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '12px'
                }}>
                  {verdictConfig.label}
                </div>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#18181b',
                  margin: '0 0 8px 0'
                }}>
                  {executive_summary.headline}
                </h2>
                <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>
                  {verdictConfig.sublabel}
                </p>
              </div>
              <div style={{ textAlign: 'center', marginLeft: '32px' }}>
                <div style={{ 
                  fontSize: '42px', 
                  fontWeight: '700', 
                  color: '#18181b',
                  lineHeight: 1
                }}>
                  {Math.round(executive_summary.confidence_score * 100)}%
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  color: '#71717a',
                  marginTop: '4px'
                }}>
                  Confidence
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <MetricCard
              label="Incremental Conversions"
              value={formatNumber(executive_summary.total_incremental_conversions)}
              subvalue={formatPercent(executive_summary.conversion_uplift_percent)}
              positive={executive_summary.conversion_uplift_percent > 0}
            />
            <MetricCard
              label="Wallet Connections"
              value={formatNumber(executive_summary.total_incremental_wallet_connections)}
              subvalue={formatPercent(executive_summary.wallet_uplift_percent)}
              positive={executive_summary.wallet_uplift_percent > 0}
            />
            {executive_summary.cost_per_incremental_conversion !== null && (
              <MetricCard
                label="Cost per Conversion"
                value={`$${executive_summary.cost_per_incremental_conversion.toFixed(2)}`}
              />
            )}
            {executive_summary.roi !== null && (
              <MetricCard
                label="Return on Investment"
                value={`${executive_summary.roi.toFixed(0)}%`}
                positive={executive_summary.roi > 0}
              />
            )}
          </div>

          {/* Analysis Period */}
          <div style={{ 
            backgroundColor: '#f4f4f5', 
            borderRadius: '8px',
            padding: '16px 20px'
          }}>
            <div style={{ 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              color: '#71717a',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Analysis Period
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '2px' }}>Baseline</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#18181b' }}>
                  {windows.baseline_start} → {windows.baseline_end}
                  <span style={{ color: '#71717a', marginLeft: '8px' }}>
                    ({windows.baseline_days || 'N/A'} days)
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '2px' }}>Event Period</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#18181b' }}>
                  {windows.event_start} → {windows.event_end}
                  <span style={{ color: '#71717a', marginLeft: '8px' }}>
                    ({windows.event_days || 'N/A'} days)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== PAGE 2: FUNNEL ANALYSIS ==================== */}
        {(conversion_funnel.length > 0 || wallet_funnel.length > 0) && (
          <div style={{ pageBreakAfter: 'always', padding: '32px' }}>
            <PageHeader title="Funnel Analysis" subtitle="Conversion and wallet activity breakdown" />
            
            {/* Conversion Funnel */}
            {conversion_funnel.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <SectionHeader icon="📊" title="Conversion Funnel" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {conversion_funnel.map((item, idx) => (
                    <FunnelRowPDF
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
              <div style={{ marginBottom: '32px' }}>
                <SectionHeader icon="👛" title="Wallet Funnel" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {wallet_funnel.map((item, idx) => (
                    <FunnelRowPDF
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
        )}

        {/* ==================== PAGE 3: TIMELINE & ATTRIBUTION ==================== */}
        <div style={{ pageBreakAfter: 'always', padding: '32px' }}>
          <PageHeader title="Performance Timeline" subtitle="Daily activity and traffic attribution" />
          
          {/* Timeline Chart */}
          {daily_timeline.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader icon="📈" title="Daily Timeline" />
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: '4px', 
                height: '120px',
                padding: '16px',
                backgroundColor: '#fafafa',
                borderRadius: '8px'
              }}>
                {daily_timeline.slice(-14).map((day, idx) => (
                  <div key={idx} style={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}>
                    <div
                      style={{ 
                        width: '100%',
                        backgroundColor: day.period === "event" ? '#10b981' : '#d4d4d8',
                        borderRadius: '4px 4px 0 0',
                        height: `${Math.max((day.visitors / maxVisitors) * 100, 5)}%`,
                        minHeight: '4px'
                      }}
                    />
                    <div style={{ 
                      fontSize: '8px', 
                      color: '#a1a1aa',
                      marginTop: '4px',
                      transform: 'rotate(-45deg)',
                      whiteSpace: 'nowrap'
                    }}>
                      {day.date.slice(5)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '12px',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#d4d4d8', borderRadius: '2px' }} />
                  <span style={{ color: '#71717a' }}>Baseline</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                  <span style={{ color: '#71717a' }}>Event Period</span>
                </div>
              </div>
            </div>
          )}

          {/* Attribution */}
          {attribution.top_sources.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader icon="🎯" title="Attribution" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {attribution.top_sources.map((source, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '100px', 
                      fontSize: '13px', 
                      fontWeight: '500',
                      color: '#18181b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {source.source}
                    </div>
                    <div style={{ 
                      flex: 1, 
                      height: '24px', 
                      backgroundColor: '#f4f4f5',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%',
                        width: `${source.percent_of_total}%`,
                        backgroundColor: '#3b82f6',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <div style={{ 
                      width: '80px', 
                      textAlign: 'right',
                      fontSize: '13px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#18181b' }}>
                        {formatNumber(source.incremental_conversions)}
                      </span>
                      <span style={{ color: '#a1a1aa', marginLeft: '4px' }}>
                        ({source.percent_of_total.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================== PAGE 4: INSIGHTS & APPENDIX ==================== */}
        <div style={{ padding: '32px' }}>
          <PageHeader title="Insights & Summary" subtitle="Key findings and traffic metrics" />
          
          {/* Key Insights */}
          {insights.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <SectionHeader icon="💡" title="Key Insights" />
              <div style={{ 
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                padding: '20px'
              }}>
                {insights.map((insight, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex',
                    gap: '12px',
                    padding: '10px 0',
                    borderBottom: idx < insights.length - 1 ? '1px solid #e4e4e7' : 'none'
                  }}>
                    <span style={{ 
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#a1a1aa',
                      minWidth: '20px'
                    }}>
                      {idx + 1}.
                    </span>
                    <span style={{ fontSize: '13px', color: '#18181b', lineHeight: '1.5' }}>
                      {insight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traffic Summary Appendix */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              fontSize: '11px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              color: '#a1a1aa',
              fontWeight: '600',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid #e4e4e7'
            }}>
              Appendix: Traffic Summary
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '16px' 
            }}>
              <AppendixStat 
                label="Baseline Daily Average" 
                value={`${formatNumber(traffic_summary.baseline_daily_avg_visitors)} visitors`} 
              />
              <AppendixStat 
                label="Event Period Total" 
                value={`${formatNumber(traffic_summary.event_period_visitors)} visitors`} 
              />
              <AppendixStat 
                label="Incremental Visitors" 
                value={`${formatNumber(traffic_summary.incremental_visitors)}`}
                subvalue={formatPercent(traffic_summary.visitor_uplift_percent)}
                positive={traffic_summary.visitor_uplift_percent > 0}
              />
              <AppendixStat 
                label="Bounce Rate Change" 
                value={`${traffic_summary.bounce_rate_baseline.toFixed(1)}% → ${traffic_summary.bounce_rate_event.toFixed(1)}%`} 
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #e4e4e7'
          }}>
            <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0 }}>
              Generated by AudienceScan • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== HELPER COMPONENTS FOR PDF ====================

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: '700', 
        color: '#18181b',
        margin: '0 0 4px 0'
      }}>
        {title}
      </h2>
      <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>
        {subtitle}
      </p>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '2px solid #18181b'
    }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{ 
        fontSize: '14px',
        fontWeight: '600',
        color: '#18181b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </span>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  subvalue, 
  positive 
}: { 
  label: string; 
  value: string; 
  subvalue?: string;
  positive?: boolean;
}) {
  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <div style={{ 
        fontSize: '11px', 
        color: '#71717a', 
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: '700', color: '#18181b' }}>
          {value}
        </span>
        {subvalue && (
          <span style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: positive ? '#059669' : '#dc2626'
          }}>
            {subvalue}
          </span>
        )}
      </div>
    </div>
  );
}

function FunnelRowPDF({
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
  const formatNum = (n: number) => {
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const isPositive = incremental > 0;

  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      padding: '14px 16px'
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#18181b', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '12px', color: '#71717a' }}>
          {formatNum(actual)} actual vs {formatNum(expected)} expected
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '700',
            color: isPositive ? '#059669' : '#dc2626'
          }}>
            {incremental > 0 ? '+' : ''}{formatNum(incremental)}
          </div>
          <div style={{ 
            fontSize: '12px',
            color: isPositive ? '#10b981' : '#ef4444'
          }}>
            {upliftPercent > 0 ? '+' : ''}{upliftPercent.toFixed(1)}%
          </div>
        </div>
        <div style={{ 
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: isPositive ? '#d1fae5' : '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isPositive ? (
            <TrendingUp size={16} color="#059669" />
          ) : (
            <TrendingDown size={16} color="#dc2626" />
          )}
        </div>
      </div>
    </div>
  );
}

function AppendixStat({ 
  label, 
  value,
  subvalue,
  positive
}: { 
  label: string; 
  value: string;
  subvalue?: string;
  positive?: boolean;
}) {
  return (
    <div style={{ padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
      <div style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#18181b' }}>
        {value}
        {subvalue && (
          <span style={{ 
            marginLeft: '6px',
            fontSize: '12px',
            color: positive ? '#059669' : '#dc2626'
          }}>
            ({subvalue})
          </span>
        )}
      </div>
    </div>
  );
}
