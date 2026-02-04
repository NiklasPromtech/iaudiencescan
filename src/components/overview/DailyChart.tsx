import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import { Plus } from "lucide-react";
import { TableRow } from "@/lib/api";
import { CreateTouchpointDialog } from "@/components/touchpoints/CreateTouchpointDialog";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Touchpoint } from "@/pages/Touchpoints";
import { format, parseISO } from "date-fns";

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

// Define chart colors
const COLOR_LEFT = "hsl(var(--primary))";
const COLOR_RIGHT = "hsl(var(--foreground))";

export function DailyChart({ data, loading }: DailyChartProps) {
  const [metricLeft, setMetricLeft] = useState<MetricKey>("pageviews");
  const [metricRight, setMetricRight] = useState<MetricKey>("visitors_with_wallet_extension");
  const [createTouchpointOpen, setCreateTouchpointOpen] = useState(false);
  const { selectedWebsite } = useSelectedWebsite();

  // Fetch touchpoints for this website
  const { data: touchpoints = [], refetch: refetchTouchpoints } = useQuery({
    queryKey: ["touchpoints", selectedWebsite?.id],
    queryFn: async () => {
      if (!selectedWebsite?.id) return [];
      const { data, error } = await supabase
        .from("touchpoints")
        .select("*")
        .eq("website_id", selectedWebsite.id);
      if (error) throw error;
      return data as Touchpoint[];
    },
    enabled: !!selectedWebsite?.id,
  });

  const chartConfig = useMemo(() => {
    return {
      [metricLeft]: {
        label: METRIC_MAP[metricLeft]?.label ?? metricLeft,
        color: COLOR_LEFT,
      },
      [metricRight]: {
        label: METRIC_MAP[metricRight]?.label ?? metricRight,
        color: COLOR_RIGHT,
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

  // Get touchpoint lines that fall within the chart date range
  const touchpointLines = useMemo(() => {
    if (!chartData.length || !touchpoints.length) return [];
    
    return touchpoints
      .map((tp) => {
        const tpDate = tp.timestamp 
          ? format(parseISO(tp.timestamp), "yyyy-MM-dd")
          : tp.start_date;
        return {
          ...tp,
          dateKey: tpDate,
          label: formatDate(tpDate || ""),
        };
      })
      .filter((tp) => chartData.some((d) => d.date === tp.dateKey));
  }, [chartData, touchpoints]);

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
    <>
      <Card className="p-6 border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-h3 text-foreground">Daily Metrics</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setCreateTouchpointOpen(true)}
              title="Add touchpoint"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <MetricSelector
              value={metricLeft}
              onChange={(v) => setMetricLeft(v as MetricKey)}
              color={COLOR_LEFT}
              label="Left axis"
            />
            <MetricSelector
              value={metricRight}
              onChange={(v) => setMetricRight(v as MetricKey)}
              color={COLOR_RIGHT}
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
            <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
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
              {/* Touchpoint reference lines */}
              {touchpointLines.map((tp) => (
                <ReferenceLine
                  key={tp.id}
                  x={tp.label}
                  yAxisId="left"
                  stroke={tp.color}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: tp.name,
                    position: "top",
                    fill: tp.color,
                    fontSize: 10,
                  }}
                />
              ))}
              <Bar
                yAxisId="left"
                dataKey={metricLeft}
                fill={COLOR_LEFT}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey={metricRight}
                fill={COLOR_RIGHT}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </Card>

      <CreateTouchpointDialog
        open={createTouchpointOpen}
        onOpenChange={setCreateTouchpointOpen}
        websiteId={selectedWebsite?.id}
        onSuccess={() => refetchTouchpoints()}
      />
    </>
  );
}

interface MetricSelectorProps {
  value: MetricKey;
  onChange: (value: string) => void;
  color: string;
  label: string;
}

function MetricSelector({ value, onChange, color, label }: MetricSelectorProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span 
        className="h-3 w-3 rounded-sm flex-shrink-0" 
        style={{ backgroundColor: color }}
      />
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
