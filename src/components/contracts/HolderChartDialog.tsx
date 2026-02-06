import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { fetchHoldersData, HolderDataPoint } from "@/lib/api";
import { Loader2, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HolderChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: {
    id: string;
    name: string;
    contract_address: string;
    chain: string;
  };
  tagId: string;
}

export const HolderChartDialog = ({
  open,
  onOpenChange,
  contract,
  tagId,
}: HolderChartDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HolderDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && contract && tagId) {
      fetchData();
    }
  }, [open, contract?.id, tagId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const today = new Date();
      const from = format(subDays(today, 6), "yyyy-MM-dd");
      const to = format(today, "yyyy-MM-dd");

      const response = await fetchHoldersData({
        tag_id: tagId,
        contract_id: contract.id,
        range: { from, to },
      });

      setData(response.data || []);
    } catch (err) {
      console.error("Failed to fetch holder data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    return data
      .map((d) => ({
        date: d.date,
        holders: d.holder_count,
        formattedDate: format(new Date(d.date), "MMM d"),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const latest = chartData[chartData.length - 1]?.holders ?? 0;
    const first = chartData[0]?.holders ?? 0;
    const change = latest - first;
    const changePercent = first > 0 ? ((change / first) * 100).toFixed(1) : "0";
    
    return { latest, change, changePercent };
  }, [chartData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {contract.name} - Token Holders
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Last 7 days holder count
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={fetchData}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No holder data available yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Holder counts are synced daily
              </p>
            </div>
          ) : (
            <>
              {/* Stats row */}
              {stats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Current Holders
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {stats.latest.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      7-Day Change
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {stats.change > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : stats.change < 0 ? (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      ) : (
                        <Minus className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span
                        className={`text-2xl font-bold ${
                          stats.change > 0
                            ? "text-green-500"
                            : stats.change < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stats.change > 0 ? "+" : ""}
                        {stats.change.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({stats.change >= 0 ? "+" : ""}
                        {stats.changePercent}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="formattedDate"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                      tickFormatter={(v) => v.toLocaleString()}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [
                        value.toLocaleString(),
                        "Holders",
                      ]}
                      labelFormatter={(label) => label}
                    />
                    <Line
                      type="monotone"
                      dataKey="holders"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
