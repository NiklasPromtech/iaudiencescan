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
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TableRow } from "@/lib/api";

interface DailyChartProps {
  data: TableRow[];
  loading: boolean;
}

type MetricKey = keyof Omit<TableRow, "dim_value">;

interface MetricOption {
  key: MetricKey;
  label: string;
}

const METRIC_OPTIONS: MetricOption[] = [
  { key: "unique_visitors", label: "Unique Visitors" },
  { key: "pageviews", label: "Page Views" },
  { key: "visitors_with_wallet_extension", label: "Wallet Extensions" },
  { key: "wallet_users", label: "Wallet Users" },
  { key: "converted_users", label: "Converted Users" },
  { key: "conversions_total", label: "Total Conversions" },
  { key: "bounce_count", label: "Bounces" },
  { key: "bot_visitors", label: "Bot Visitors" },
  { key: "stayed_10s", label: "Stayed 10s+" },
  { key: "stayed_30s", label: "Stayed 30s+" },
  { key: "stayed_60s", label: "Stayed 60s+" },
  { key: "stayed_5m", label: "Stayed 5m+" },
  { key: "wallets_enriched", label: "Wallets Enriched" },
  { key: "total_balance_usd", label: "Total Balance (USD)" },
];

const METRIC_MAP = Object.fromEntries(METRIC_OPTIONS.map((m) => [m.key, m]));

export function DailyChart({ data, loading }: DailyChartProps) {
  const [metricLeft, setMetricLeft] = useState<MetricKey>("pageviews");
  const [metricRight, setMetricRight] = useState<MetricKey>("visitors_with_wallet_extension");

  const chartConfig = useMemo(() => {
    return {
      [metricLeft]: {
        label: METRIC_MAP[metricLeft]?.label ?? metricLeft,
        color: "hsl(var(--primary))",
      },
      [metricRight]: {
        label: METRIC_MAP[metricRight]?.label ?? metricRight,
        color: "hsl(var(--chart-3))",
      },
    } satisfies ChartConfig;
  }, [metricLeft, metricRight]);

  const chartData = useMemo(() => {
    return data
      .map((row) => ({
        date: row.dim_value,
        [metricLeft]: row[metricLeft] ?? 0,
        [metricRight]: row[metricRight] ?? 0,
        label: formatDate(row.dim_value),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data, metricLeft, metricRight]);

  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-36" />
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
        <div className="flex flex-wrap gap-3">
          <MetricSelector
            value={metricLeft}
            onChange={(v) => setMetricLeft(v as MetricKey)}
            colorClass="bg-primary"
            label="Left axis"
          />
          <MetricSelector
            value={metricRight}
            onChange={(v) => setMetricRight(v as MetricKey)}
            colorClass="bg-chart-3"
            label="Right axis"
          />
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ComposedChart data={chartData} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            {/* Left Y-Axis for first metric */}
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
              stroke="hsl(var(--primary))"
            />
            {/* Right Y-Axis for second metric */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => value.toLocaleString()}
              stroke="hsl(var(--chart-3))"
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              yAxisId="left"
              dataKey={metricLeft}
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey={metricRight}
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ChartContainer>
      )}
    </Card>
  );
}

interface MetricSelectorProps {
  value: MetricKey;
  onChange: (value: string) => void;
  colorClass: string;
  label: string;
}

function MetricSelector({ value, onChange, colorClass, label }: MetricSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${colorClass}`} />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[150px] text-xs bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
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
