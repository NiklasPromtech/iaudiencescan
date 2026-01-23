import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

const chartConfig = {
  unique_visitors: {
    label: "Unique Visitors",
    color: "hsl(var(--primary))",
  },
  pageviews: {
    label: "Page Views",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export function DailyChart({ data, loading }: DailyChartProps) {
  const chartData = useMemo(() => {
    return data
      .map((row) => ({
        date: row.dim_value,
        unique_visitors: row.unique_visitors,
        pageviews: row.pageviews,
        // Format date for display
        label: formatDate(row.dim_value),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 text-foreground">Daily Traffic</h3>
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
              dataKey="unique_visitors"
              fill="var(--color-unique_visitors)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </Card>
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
