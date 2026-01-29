import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TableRow } from "@/lib/api";

interface DailyChartProps {
  data: TableRow[];
  loading: boolean;
}

type MetricKey = keyof Omit<TableRow, "dim_value">;

interface MetricOption {
  key: MetricKey;
  label: string;
  color: string;
}

const METRIC_OPTIONS: MetricOption[] = [
  { key: "unique_visitors", label: "Unique Visitors", color: "hsl(var(--primary))" },
  { key: "pageviews", label: "Page Views", color: "hsl(var(--chart-2))" },
  { key: "visitors_with_wallet_extension", label: "Wallet Extensions", color: "hsl(var(--chart-3))" },
  { key: "wallet_users", label: "Wallet Users", color: "hsl(var(--chart-4))" },
  { key: "converted_users", label: "Converted Users", color: "hsl(var(--chart-5))" },
  { key: "conversions_total", label: "Total Conversions", color: "hsl(var(--accent))" },
  { key: "bounce_count", label: "Bounces", color: "hsl(var(--destructive))" },
  { key: "bot_visitors", label: "Bot Visitors", color: "hsl(var(--muted-foreground))" },
  { key: "stayed_10s", label: "Stayed 10s+", color: "hsl(var(--chart-2))" },
  { key: "stayed_30s", label: "Stayed 30s+", color: "hsl(var(--chart-3))" },
  { key: "stayed_60s", label: "Stayed 60s+", color: "hsl(var(--chart-4))" },
  { key: "stayed_5m", label: "Stayed 5m+", color: "hsl(var(--chart-5))" },
  { key: "wallets_enriched", label: "Wallets Enriched", color: "hsl(var(--primary))" },
  { key: "total_balance_usd", label: "Total Balance (USD)", color: "hsl(var(--chart-2))" },
];

const METRIC_MAP = Object.fromEntries(METRIC_OPTIONS.map((m) => [m.key, m]));

export function DailyChart({ data, loading }: DailyChartProps) {
  const [metric1, setMetric1] = useState<MetricKey>("unique_visitors");
  const [metric2, setMetric2] = useState<MetricKey>("pageviews");
  const [metric3, setMetric3] = useState<MetricKey>("visitors_with_wallet_extension");

  const chartConfig = useMemo(() => {
    return {
      [metric1]: {
        label: METRIC_MAP[metric1]?.label ?? metric1,
        color: "hsl(var(--primary))",
      },
      [metric2]: {
        label: METRIC_MAP[metric2]?.label ?? metric2,
        color: "hsl(var(--chart-2))",
      },
      [metric3]: {
        label: METRIC_MAP[metric3]?.label ?? metric3,
        color: "hsl(var(--chart-3))",
      },
    } satisfies ChartConfig;
  }, [metric1, metric2, metric3]);

  const chartData = useMemo(() => {
    return data
      .map((row) => ({
        date: row.dim_value,
        [metric1]: row[metric1] ?? 0,
        [metric2]: row[metric2] ?? 0,
        [metric3]: row[metric3] ?? 0,
        label: formatDate(row.dim_value),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data, metric1, metric2, metric3]);

  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-h3 text-foreground">Daily Metrics</h3>
        <div className="flex flex-wrap gap-2">
          <MetricSelector
            value={metric1}
            onChange={(v) => setMetric1(v as MetricKey)}
            colorClass="bg-primary"
          />
          <MetricSelector
            value={metric2}
            onChange={(v) => setMetric2(v as MetricKey)}
            colorClass="bg-chart-2"
          />
          <MetricSelector
            value={metric3}
            onChange={(v) => setMetric3(v as MetricKey)}
            colorClass="bg-chart-3"
          />
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey={metric1}
              fill={`var(--color-${metric1})`}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey={metric2}
              fill={`var(--color-${metric2})`}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey={metric3}
              fill={`var(--color-${metric3})`}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </Card>
  );
}

interface MetricSelectorProps {
  value: MetricKey;
  onChange: (value: string) => void;
  colorClass: string;
}

function MetricSelector({ value, onChange, colorClass }: MetricSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${colorClass}`} />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {METRIC_OPTIONS.map((option) => (
            <SelectItem key={option.key} value={option.key} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}
