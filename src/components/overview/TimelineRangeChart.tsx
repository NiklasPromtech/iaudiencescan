import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Eye, Zap, Wallet } from "lucide-react";
import type { DailyBreakdownItem } from "@/lib/api";

interface TimelineRangeChartProps {
  dailyBreakdown: DailyBreakdownItem[];
  range: [number, number];
  onRangeChange: (range: [number, number]) => void;
  maxOffset: number;
  firstDate: Date;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="rounded-none border border-border/50 bg-popover px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground mb-1.5">
        {format(parseISO(data.date), "MMM d, yyyy")}
      </p>
      <div className="space-y-1 text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Eye className="h-3 w-3" />
          <span>{data.pageviews.toLocaleString()} pageviews</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Zap className="h-3 w-3" />
          <span>{data.events.toLocaleString()} events</span>
        </p>
        <p className="flex items-center gap-1.5">
          <Wallet className="h-3 w-3" />
          <span>{data.wallets.toLocaleString()} wallets</span>
        </p>
      </div>
    </div>
  );
};

export const TimelineRangeChart = ({
  dailyBreakdown,
  range,
  onRangeChange,
  maxOffset,
  firstDate,
}: TimelineRangeChartProps) => {
  const [activeMetric, setActiveMetric] = useState<"pageviews" | "events" | "wallets">("pageviews");

  // Enrich data with index for reference area matching
  const chartData = useMemo(
    () => dailyBreakdown.map((d, i) => ({ ...d, idx: i })),
    [dailyBreakdown]
  );

  // Summary stats for selected range
  const selectedStats = useMemo(() => {
    const slice = dailyBreakdown.slice(range[0], range[1] + 1);
    return {
      days: slice.length,
      pageviews: slice.reduce((s, d) => s + d.pageviews, 0),
      events: slice.reduce((s, d) => s + d.events, 0),
      wallets: slice.reduce((s, d) => s + d.wallets, 0),
    };
  }, [dailyBreakdown, range]);

  const startDate = dailyBreakdown[range[0]]?.date;
  const endDate = dailyBreakdown[range[1]]?.date;

  // X-axis tick formatter — show ~5 ticks
  const tickFormatter = (date: string) => {
    try {
      return format(parseISO(date), "MMM d");
    } catch {
      return date;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          Select your analysis period
        </h3>
        <p className="text-xs text-muted-foreground">
          Drag the handles to choose the period you want to analyze. Hover the
          chart to see daily traffic.
        </p>
      </div>

      {/* Metric switcher */}
      <div className="flex gap-1">
        {([
          { key: "pageviews", label: "Pageviews", icon: Eye },
          { key: "events", label: "Events", icon: Zap },
          { key: "wallets", label: "Wallets", icon: Wallet },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveMetric(key)}
            className={`inline-flex items-center gap-1.5 rounded-none px-3 py-1 text-xs font-medium transition-colors ${
              activeMetric === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Area chart */}
      <div className="w-full h-[140px] -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
          >
            <defs>
              <linearGradient id="pageviewGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="selectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tickFormatter={tickFormatter}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />

            {/* Muted base area */}
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke="hsl(var(--muted-foreground) / 0.3)"
              strokeWidth={1.5}
              fill="url(#pageviewGradient)"
              animationDuration={600}
            />

            {/* Highlighted selected range */}
            {startDate && endDate && (
              <ReferenceArea
                x1={startDate}
                x2={endDate}
                fill="hsl(var(--primary))"
                fillOpacity={0.12}
                stroke="hsl(var(--primary))"
                strokeOpacity={0.3}
                strokeDasharray="3 3"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Slider aligned beneath chart */}
      <div className="px-1">
        <Slider
          value={range}
          onValueChange={(val) => onRangeChange(val as [number, number])}
          min={0}
          max={maxOffset}
          step={1}
          minStepsBetweenThumbs={1}
        />
      </div>

      {/* Date labels */}
      <div className="flex justify-between items-start px-1">
        <div className="text-xs text-muted-foreground">
          {dailyBreakdown[0] &&
            format(parseISO(dailyBreakdown[0].date), "MMM d")}
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <span className="text-muted-foreground text-xs">Start</span>
            <p className="font-medium text-foreground text-sm">
              {startDate ? format(parseISO(startDate), "MMM d, yyyy") : "—"}
            </p>
          </div>
          <div className="text-center">
            <span className="text-muted-foreground text-xs">End</span>
            <p className="font-medium text-foreground text-sm">
              {endDate ? format(parseISO(endDate), "MMM d, yyyy") : "—"}
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {dailyBreakdown.length > 0 &&
            format(
              parseISO(dailyBreakdown[dailyBreakdown.length - 1].date),
              "MMM d"
            )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground bg-muted/30 rounded-none py-2.5 px-4">
        <span className="font-medium text-foreground">
          {selectedStats.days} days
        </span>
        <span className="mx-1">·</span>
        <span>
          <span className="font-medium text-foreground tabular-nums">
            {selectedStats.pageviews.toLocaleString()}
          </span>{" "}
          pageviews
        </span>
        <span className="mx-1">·</span>
        <span>
          <span className="font-medium text-foreground tabular-nums">
            {selectedStats.events.toLocaleString()}
          </span>{" "}
          events
        </span>
        <span className="mx-1">·</span>
        <span>
          <span className="font-medium text-foreground tabular-nums">
            {selectedStats.wallets.toLocaleString()}
          </span>{" "}
          wallets
        </span>
      </div>

      {/* Baseline info */}
      <p className="text-xs text-muted-foreground text-center">
        Baseline: {range[0]} days before start date
      </p>
    </div>
  );
};
