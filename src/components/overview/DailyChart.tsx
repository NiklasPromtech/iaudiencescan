import { useMemo, useState, useRef } from "react";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Plus } from "lucide-react";
import { TableRow, HolderDataPoint } from "@/lib/api";
import { CreateTouchpointDialog } from "@/components/touchpoints/CreateTouchpointDialog";
import { TouchpointDetailsDialog, type TouchpointDetails } from "@/components/touchpoints/TouchpointDetailsDialog";
import { TouchpointListDialog } from "@/components/touchpoints/TouchpointListDialog";
import { TouchpointMarkers, type TouchpointForChart } from "@/components/overview/TouchpointMarkers";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Touchpoint } from "@/hooks/use-dashboard-queries";
import { format, parseISO } from "date-fns";

// Extended row type that includes holder data
interface ExtendedTableRow extends TableRow {
  holder_count?: number | null;
}

interface DailyChartProps {
  data: TableRow[];
  loading: boolean;
  holderData?: HolderDataPoint[];
}

type MetricKey = keyof Omit<ExtendedTableRow, "dim_value">;

interface MetricOption {
  key: MetricKey;
  label: string;
}

const METRIC_OPTIONS: MetricOption[] = [
  { key: "unique_visitors", label: "Unique Visitors" },
  { key: "pageviews", label: "Page Views" },
  { key: "visitors_with_wallet_extension", label: "Wallet Extensions" },
  { key: "wallet_users", label: "Wallet Users" },
  { key: "holder_count", label: "Token Holders" },
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
const COLOR_RIGHT = "hsl(170, 70%, 45%)";

export function DailyChart({ data, loading, holderData = [] }: DailyChartProps) {
  const [metricLeft, setMetricLeft] = useState<MetricKey>("pageviews");
  const [metricRight, setMetricRight] = useState<MetricKey>("visitors_with_wallet_extension");
  const [createTouchpointOpen, setCreateTouchpointOpen] = useState(false);
  const [detailsTouchpoint, setDetailsTouchpoint] = useState<TouchpointDetails | null>(null);
  const [listDialogTouchpoints, setListDialogTouchpoints] = useState<TouchpointForChart[]>([]);
  const [listDialogDate, setListDialogDate] = useState<string>("");
  const chartContainerRef = useRef<HTMLDivElement>(null);
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

  // Merge holder data into daily data
  const mergedData = useMemo((): ExtendedTableRow[] => {
    if (!holderData.length) return data;
    
    // Create a map of date -> holder_count (sum if multiple contracts)
    const holdersByDate = new Map<string, number>();
    holderData.forEach((h) => {
      const existing = holdersByDate.get(h.date) || 0;
      holdersByDate.set(h.date, existing + h.holder_count);
    });
    
    // Merge into data rows
    return data.map((row) => ({
      ...row,
      holder_count: holdersByDate.get(row.dim_value) ?? null,
    }));
  }, [data, holderData]);

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
    return mergedData
      .map((row) => ({
        date: row.dim_value,
        [metricLeft]: row[metricLeft] ?? 0,
        [metricRight]: row[metricRight] ?? 0,
        label: formatDate(row.dim_value),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [mergedData, metricLeft, metricRight]);

  // Get chart date keys for positioning
  const chartDates = useMemo(() => chartData.map((d) => d.date), [chartData]);

  // Get touchpoints mapped to chart dates
  // For range events, only include once with first visible date as dateKey
  const touchpointsForChart = useMemo((): TouchpointForChart[] => {
    if (!chartData.length || !touchpoints.length) return [];
    
    const result: TouchpointForChart[] = [];
    const chartDateSet = new Set(chartData.map(d => d.date));
    
    touchpoints.forEach((tp) => {
      if (tp.event_type === "single") {
        // Single events: use timestamp date
        const tpDate = tp.timestamp 
          ? format(parseISO(tp.timestamp), "yyyy-MM-dd")
          : tp.start_date;
        if (tpDate && chartDateSet.has(tpDate)) {
          result.push({
            id: tp.id,
            name: tp.name,
            event_type: tp.event_type,
            timestamp: tp.timestamp,
            start_date: tp.start_date,
            end_date: tp.end_date,
            notes: tp.notes,
            color: tp.color,
            cost_amount: tp.cost_amount,
            cost_currency: tp.cost_currency,
            dateKey: tpDate,
          });
        }
      } else {
        // Range events: include once, spans calculated in TouchpointMarkers
        if (tp.start_date) {
          const startDate = parseISO(tp.start_date);
          const endDate = tp.end_date ? parseISO(tp.end_date) : startDate;
          let firstVisibleDate: string | null = null;
          
          let currentDate = startDate;
          while (currentDate <= endDate) {
            const dateKey = format(currentDate, "yyyy-MM-dd");
            if (chartDateSet.has(dateKey) && !firstVisibleDate) {
              firstVisibleDate = dateKey;
              break;
            }
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          if (firstVisibleDate) {
            result.push({
              id: tp.id,
              name: tp.name,
              event_type: tp.event_type,
              timestamp: tp.timestamp,
              start_date: tp.start_date,
              end_date: tp.end_date,
              notes: tp.notes,
              color: tp.color,
              cost_amount: tp.cost_amount,
              cost_currency: tp.cost_currency,
              dateKey: firstVisibleDate,
            });
          }
        }
      }
    });
    
    return result;
  }, [chartData, touchpoints]);

  const handleTouchpointClick = (tp: TouchpointForChart) => {
    setDetailsTouchpoint(tp);
  };

  const handleMultipleTouchpointsClick = (tps: TouchpointForChart[], dateKey: string) => {
    setListDialogTouchpoints(tps);
    setListDialogDate(dateKey);
  };

  if (loading) {
    return (
      <div className="py-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-36" />
          </div>
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="py-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-h3 text-foreground">Daily Metrics</h3>
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
          <div ref={chartContainerRef}>
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
                <Bar
                  yAxisId="left"
                  dataKey={metricLeft}
                  fill={COLOR_LEFT}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey={metricRight}
                  fill={COLOR_RIGHT}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            
            {/* Touchpoint markers row below chart */}
            <TouchpointMarkers
              touchpoints={touchpointsForChart}
              chartDates={chartDates}
              onTouchpointClick={handleTouchpointClick}
              onMultipleTouchpointsClick={handleMultipleTouchpointsClick}
              onAddTouchpoint={() => setCreateTouchpointOpen(true)}
            />
          </div>
        )}
      </div>

      <CreateTouchpointDialog
        open={createTouchpointOpen}
        onOpenChange={setCreateTouchpointOpen}
        websiteId={selectedWebsite?.id}
        onSuccess={() => refetchTouchpoints()}
      />

      <TouchpointDetailsDialog
        open={!!detailsTouchpoint}
        onOpenChange={(open) => !open && setDetailsTouchpoint(null)}
        touchpoint={detailsTouchpoint}
      />

      <TouchpointListDialog
        open={listDialogTouchpoints.length > 0}
        onOpenChange={(open) => !open && setListDialogTouchpoints([])}
        touchpoints={listDialogTouchpoints}
        dateKey={listDialogDate}
        onSelect={handleTouchpointClick}
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
