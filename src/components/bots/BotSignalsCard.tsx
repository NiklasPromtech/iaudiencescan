import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Monitor, Activity } from "lucide-react";
import { BotSignals } from "@/lib/api";

interface BotSignalsCardProps {
  signals: BotSignals | null;
  loading: boolean;
}

export function BotSignalsCard({ signals, loading }: BotSignalsCardProps) {
  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </Card>
    );
  }

  const totalChecked = signals?.total_checked ?? 0;
  const webdriverPct = totalChecked > 0 
    ? ((signals?.webdriver_count ?? 0) / totalChecked * 100).toFixed(1) 
    : "0.0";
  const headlessPct = totalChecked > 0 
    ? ((signals?.headless_count ?? 0) / totalChecked * 100).toFixed(1) 
    : "0.0";

  const signalRows = [
    {
      label: "WebDriver Detected",
      value: signals?.webdriver_count ?? 0,
      pct: webdriverPct,
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
    },
    {
      label: "Headless Browser",
      value: signals?.headless_count ?? 0,
      pct: headlessPct,
      icon: <Monitor className="h-4 w-4 text-primary" />,
    },
    {
      label: "Total Checked",
      value: totalChecked,
      pct: null,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <Card className="p-6 border border-border">
      <h3 className="text-h3 text-foreground mb-4">Detection Signals</h3>
      <div className="space-y-3">
        {signalRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
          >
            <div className="flex items-center gap-2">
              {row.icon}
              <span className="font-mono text-sm text-foreground">{row.label}</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-medium text-foreground tabular-nums">
                {row.value.toLocaleString()}
              </span>
              {row.pct !== null && (
                <span className="font-mono text-xs text-muted-foreground ml-2">
                  ({row.pct}% of checked)
                </span>
              )}
              {row.pct === null && (
                <span className="font-mono text-xs text-muted-foreground ml-2">
                  visitors
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
