import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Copy,
  Check,
  Download,
  TrendingUp,
  TrendingDown,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import audienceScanLogo from "@/assets/audiencescan-logo-dark.png";

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
        badgeBg: "#166534",
        summaryBg: "#dcfce7",
      };
    }
    if (verdict === "highly_negative" || verdict === "negative") {
      return {
        label: verdict === "highly_negative" ? "NEGATIVE IMPACT" : "BELOW EXPECTATIONS",
        sublabel: "Campaign did not deliver expected incremental results",
        badgeBg: "#991b1b",
        summaryBg: "#fee2e2",
      };
    }
    return {
      label: "INCONCLUSIVE",
      sublabel: "Insufficient data to determine campaign impact",
      badgeBg: "#92400e",
      summaryBg: "#fef3c7",
    };
  };

  const verdictConfig = getVerdictConfig(executive_summary.verdict);

  // Build analysis period string for footer
  const analysisPeriodText = `Baseline: ${windows.baseline_start} → ${windows.baseline_end} (${windows.baseline_days || 'N/A'} days)  |  Event: ${windows.event_start} → ${windows.event_end} (${windows.event_days || 'N/A'} days)`;

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
        margin: [0.3, 0.4, 0.5, 0.4],
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

  // Check if we have cost metrics to determine layout
  const hasCostMetrics = executive_summary.cost_per_incremental_conversion !== null || executive_summary.roi !== null;

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
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <div style={{ 
                textAlign: 'center', 
                marginLeft: '24px',
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderRadius: '8px'
              }}>
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: '700', 
                  color: '#18181b',
                  lineHeight: 1
                }}>
                  {Math.round(executive_summary.confidence_score * 100)}%
                </div>
                <div style={{ 
                  fontSize: '9px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.5px',
                  color: '#52525b',
                  marginTop: '6px',
                  fontWeight: '600'
                }}>
                  Confidence
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics - Always 2 rows max with flexbox */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <MetricCard
              label="Incremental Conversions"
              value={formatNumber(executive_summary.total_incremental_conversions)}
              subvalue={formatPercent(executive_summary.conversion_uplift_percent)}
              positive={executive_summary.conversion_uplift_percent > 0}
              flex={hasCostMetrics ? '1 1 calc(50% - 6px)' : '1 1 calc(50% - 6px)'}
            />
            <MetricCard
              label="Wallet Connections"
              value={formatNumber(executive_summary.total_incremental_wallet_connections)}
              subvalue={formatPercent(executive_summary.wallet_uplift_percent)}
              positive={executive_summary.wallet_uplift_percent > 0}
              flex={hasCostMetrics ? '1 1 calc(50% - 6px)' : '1 1 calc(50% - 6px)'}
            />
            {executive_summary.cost_per_incremental_conversion !== null && (
              <MetricCard
                label="Cost per Conversion"
                value={`$${executive_summary.cost_per_incremental_conversion.toFixed(2)}`}
                flex="1 1 calc(50% - 6px)"
              />
            )}
            {executive_summary.roi !== null && (
              <MetricCard
                label="Return on Investment"
                value={`${executive_summary.roi.toFixed(0)}%`}
                positive={executive_summary.roi > 0}
                flex="1 1 calc(50% - 6px)"
              />
            )}
          </div>

          {/* Spacer to push footer down */}
          <div style={{ flex: 1 }} />

          {/* Page Footer */}
          <PageFooter analysisPeriod={analysisPeriodText} />
        </div>

        {/* ==================== PAGE 2: FUNNEL ANALYSIS ==================== */}
        {(conversion_funnel.length > 0 || wallet_funnel.length > 0) && (
          <div style={{ pageBreakAfter: 'always', padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
            <PageHeader title="Funnel Analysis" subtitle="Conversion and wallet activity breakdown" />
            
            {/* Conversion Funnel */}
            {conversion_funnel.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
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
              <div style={{ marginBottom: '28px' }}>
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

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Page Footer */}
            <PageFooter analysisPeriod={analysisPeriodText} />
          </div>
        )}

        {/* ==================== PAGE 3: TIMELINE & ATTRIBUTION ==================== */}
        <div style={{ pageBreakAfter: 'always', padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
          <PageHeader title="Performance Timeline" subtitle="Daily activity and traffic attribution" />
          
          {/* Timeline Chart */}
          {daily_timeline.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <SectionHeader icon="📈" title="Daily Timeline" />
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-end', 
                gap: '3px', 
                height: '140px',
                padding: '16px 12px',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                border: '1px solid #e4e4e7'
              }}>
                {daily_timeline.slice(-14).map((day, idx) => {
                  const isEvent = day.period === "event";
                  const barHeight = Math.max((day.visitors / maxVisitors) * 100, 8);
                  
                  return (
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
                          maxWidth: '32px',
                          background: isEvent 
                            ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' 
                            : 'linear-gradient(180deg, #a1a1aa 0%, #71717a 100%)',
                          borderRadius: '3px 3px 0 0',
                          height: `${barHeight}%`,
                          minHeight: '6px',
                          boxShadow: isEvent ? '0 2px 4px rgba(16, 185, 129, 0.3)' : 'none'
                        }}
                      />
                      <div style={{ 
                        fontSize: '8px', 
                        color: isEvent ? '#059669' : '#a1a1aa',
                        fontWeight: isEvent ? '600' : '400',
                        marginTop: '6px',
                        whiteSpace: 'nowrap'
                      }}>
                        {day.date.slice(5)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                marginTop: '12px',
                justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <div style={{ 
                    width: '14px', 
                    height: '14px', 
                    background: 'linear-gradient(180deg, #a1a1aa 0%, #71717a 100%)',
                    borderRadius: '3px' 
                  }} />
                  <span style={{ color: '#52525b', fontWeight: '500' }}>Baseline Period</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <div style={{ 
                    width: '14px', 
                    height: '14px', 
                    background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                    borderRadius: '3px' 
                  }} />
                  <span style={{ color: '#52525b', fontWeight: '500' }}>Event Period</span>
                </div>
              </div>
            </div>
          )}

          {/* Attribution */}
          {attribution.top_sources.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <SectionHeader icon="🎯" title="Attribution" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {attribution.top_sources.map((source, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '120px', 
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
                      height: '20px', 
                      backgroundColor: '#e4e4e7',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%',
                        width: `${Math.max(source.percent_of_total, 2)}%`,
                        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <div style={{ 
                      width: '90px', 
                      textAlign: 'right',
                      fontSize: '12px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#18181b' }}>
                        {formatNumber(source.incremental_conversions)}
                      </span>
                      <span style={{ color: '#71717a', marginLeft: '4px' }}>
                        ({source.percent_of_total.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Page Footer */}
          <PageFooter analysisPeriod={analysisPeriodText} />
        </div>

        {/* ==================== PAGE 4: INSIGHTS & APPENDIX ==================== */}
        <div style={{ padding: '24px 28px', minHeight: '9.5in', display: 'flex', flexDirection: 'column' }}>
          <PageHeader title="Insights & Summary" subtitle="Key findings and traffic metrics" />
          
          {/* Key Insights */}
          {insights.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <SectionHeader icon="💡" title="Key Insights" />
              <div style={{ 
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                padding: '16px 20px',
                border: '1px solid #e4e4e7'
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
                      fontSize: '11px',
                      color: '#a1a1aa',
                      minWidth: '20px'
                    }}>
                      {idx + 1}.
                    </span>
                    <span style={{ fontSize: '12px', color: '#18181b', lineHeight: '1.5' }}>
                      {insight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traffic Summary Appendix */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ 
              fontSize: '10px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              color: '#a1a1aa',
              fontWeight: '600',
              marginBottom: '14px',
              paddingBottom: '8px',
              borderBottom: '1px solid #e4e4e7'
            }}>
              Appendix: Traffic Summary
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '12px' 
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

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Page Footer */}
          <PageFooter analysisPeriod={analysisPeriodText} showBranding />
        </div>
      </div>
    </div>
  );
}

// ==================== HELPER COMPONENTS FOR PDF ====================

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: '700', 
        color: '#18181b',
        margin: '0 0 4px 0'
      }}>
        {title}
      </h2>
      <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
        {subtitle}
      </p>
    </div>
  );
}

function PageFooter({ analysisPeriod, showBranding = false }: { analysisPeriod: string; showBranding?: boolean }) {
  return (
    <div style={{ 
      paddingTop: '16px',
      borderTop: '1px solid #e4e4e7',
      marginTop: '16px'
    }}>
      <div style={{ 
        fontSize: '9px', 
        color: '#a1a1aa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{analysisPeriod}</span>
        {showBranding && (
          <span style={{ fontWeight: '500' }}>
            Powered by AudienceScan
          </span>
        )}
      </div>
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
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <span style={{ 
        fontSize: '13px',
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
  positive,
  flex = '1 1 auto'
}: { 
  label: string; 
  value: string; 
  subvalue?: string;
  positive?: boolean;
  flex?: string;
}) {
  return (
    <div style={{ 
      backgroundColor: '#ffffff',
      border: '1px solid #e4e4e7',
      borderRadius: '8px',
      padding: '14px 16px',
      flex
    }}>
      <div style={{ 
        fontSize: '10px', 
        color: '#71717a', 
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '6px'
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '26px', fontWeight: '700', color: '#18181b', lineHeight: 1 }}>
          {value}
        </span>
        {subvalue && (
          <span style={{ 
            fontSize: '13px', 
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
      padding: '12px 14px',
      border: '1px solid #e4e4e7'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#18181b', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '11px', color: '#71717a' }}>
          {formatNum(actual)} actual vs {formatNum(expected)} expected
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            fontSize: '15px', 
            fontWeight: '700',
            color: isPositive ? '#059669' : '#dc2626',
            lineHeight: 1
          }}>
            {incremental > 0 ? '+' : ''}{formatNum(incremental)}
          </div>
          <div style={{ 
            fontSize: '11px',
            color: isPositive ? '#10b981' : '#ef4444',
            marginTop: '2px'
          }}>
            {upliftPercent > 0 ? '+' : ''}{upliftPercent.toFixed(1)}%
          </div>
        </div>
        <div style={{ 
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: isPositive ? '#d1fae5' : '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isPositive ? (
            <TrendingUp size={14} color="#059669" />
          ) : (
            <TrendingDown size={14} color="#dc2626" />
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
    <div style={{ padding: '12px 14px', backgroundColor: '#fafafa', borderRadius: '6px', border: '1px solid #e4e4e7' }}>
      <div style={{ fontSize: '10px', color: '#a1a1aa', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#18181b' }}>
        {value}
        {subvalue && (
          <span style={{ 
            marginLeft: '6px',
            fontSize: '11px',
            color: positive ? '#059669' : '#dc2626'
          }}>
            ({subvalue})
          </span>
        )}
      </div>
    </div>
  );
}
