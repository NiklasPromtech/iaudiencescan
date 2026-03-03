import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2, AlertCircle, LayoutGrid } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { useQueries, SavedQuery } from "@/hooks/use-queries";
import { executeQuery, QueryExecuteResponse } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent-foreground))",
  "hsl(142 71% 45%)",
  "hsl(48 96% 53%)",
  "hsl(280 65% 60%)",
  "hsl(200 70% 55%)",
];

interface DashboardTile {
  query: SavedQuery;
  loading: boolean;
  error: string | null;
  results: QueryExecuteResponse | null;
}

function formatChartData(results: QueryExecuteResponse) {
  return results.rows.map((row) => {
    const obj: Record<string, string | number | null> = {};
    results.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

function TileTable({ results }: { results: QueryExecuteResponse }) {
  return (
    <div className="overflow-auto max-h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            {results.columns.map((col) => (
              <TableHead key={col} className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.rows.slice(0, 100).map((row, ri) => (
            <TableRow key={ri}>
              {row.map((cell, ci) => (
                <TableCell key={ci} className="font-mono text-xs whitespace-nowrap">
                  {cell === null ? <span className="text-muted-foreground/40">null</span> : String(cell)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TileBarChart({ results }: { results: QueryExecuteResponse }) {
  const data = formatChartData(results);
  const xKey = results.columns[0];
  const barKeys = results.columns.slice(1);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }} />
        <YAxis tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }} />
        <Tooltip contentStyle={{ fontFamily: "Space Mono, monospace", fontSize: 11 }} />
        {barKeys.length > 1 && <Legend />}
        {barKeys.map((key, i) => (
          <Bar key={key} dataKey={key} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function TileLineChart({ results }: { results: QueryExecuteResponse }) {
  const data = formatChartData(results);
  const xKey = results.columns[0];
  const lineKeys = results.columns.slice(1);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }} />
        <YAxis tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }} />
        <Tooltip contentStyle={{ fontFamily: "Space Mono, monospace", fontSize: 11 }} />
        {lineKeys.length > 1 && <Legend />}
        {lineKeys.map((key, i) => (
          <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

function TilePieChart({ results }: { results: QueryExecuteResponse }) {
  const data = results.rows.map((row) => ({
    name: String(row[0] ?? ""),
    value: Number(row[1] ?? 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontFamily: "Space Mono, monospace", fontSize: 11 }} />
        <Legend wrapperStyle={{ fontFamily: "Space Mono, monospace", fontSize: 10 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function DashboardTileCard({ tile }: { tile: DashboardTile }) {
  const { query, loading, error, results } = tile;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="font-mono text-xs uppercase tracking-widest truncate">
          {query.name}
        </CardTitle>
        <Link
          to={`/queries/${query.id}`}
          className="text-muted-foreground hover:text-primary transition-colors shrink-0 ml-2"
          title="Open in editor"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {loading ? (
          <div className="flex flex-col gap-2 py-8 items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground">Running query…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-2 py-8 items-center text-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span className="font-mono text-[10px] text-destructive max-w-[300px]">{error}</span>
          </div>
        ) : results ? (
          <>
            {query.display_type === "bar_chart" && <TileBarChart results={results} />}
            {query.display_type === "line_chart" && <TileLineChart results={results} />}
            {query.display_type === "pie_chart" && <TilePieChart results={results} />}
            {(!query.display_type || query.display_type === "table") && <TileTable results={results} />}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function QueryDashboard() {
  const { selectedWebsite } = useSelectedWebsite();
  const { fetchDashboardQueries } = useQueries(selectedWebsite?.id);
  const [tiles, setTiles] = useState<DashboardTile[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadAndRun = useCallback(async () => {
    if (!selectedWebsite) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    try {
      const dashQueries = await fetchDashboardQueries();
      if (dashQueries.length === 0) {
        setTiles([]);
        setInitialLoading(false);
        return;
      }
      // Set tiles with loading state
      const initial: DashboardTile[] = dashQueries.map((q) => ({
        query: q,
        loading: true,
        error: null,
        results: null,
      }));
      setTiles(initial);
      setInitialLoading(false);

      // Execute all in parallel
      await Promise.allSettled(
        dashQueries.map(async (q, idx) => {
          try {
            const res = await executeQuery(selectedWebsite.id, q.sql);
            setTiles((prev) =>
              prev.map((t, i) => (i === idx ? { ...t, loading: false, results: res } : t))
            );
          } catch (err) {
            setTiles((prev) =>
              prev.map((t, i) =>
                i === idx ? { ...t, loading: false, error: err instanceof Error ? err.message : "Query failed" } : t
              )
            );
          }
        })
      );
    } catch {
      setInitialLoading(false);
    }
  }, [selectedWebsite, fetchDashboardQueries]);

  useEffect(() => {
    loadAndRun();
  }, [loadAndRun]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
            Query Dashboard
          </h1>
          <span className="font-mono text-[10px] text-muted-foreground">
            {tiles.length} {tiles.length === 1 ? "tile" : "tiles"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {initialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-4 w-32" /></CardHeader>
                  <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
                </Card>
              ))}
            </div>
          ) : tiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <LayoutGrid className="h-10 w-10 text-muted-foreground/30" />
              <div>
                <p className="font-mono text-sm text-foreground font-semibold">No dashboard tiles yet</p>
                <p className="font-mono text-xs text-muted-foreground mt-1 max-w-md">
                  Open a query in the editor and check "Add to dash" to pin it here. Choose how to display it — as a table, bar chart, line chart, or pie chart.
                </p>
              </div>
              <Link
                to="/queries"
                className="font-mono text-xs text-primary hover:underline uppercase tracking-widest"
              >
                Go to Queries →
              </Link>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateRows: "repeat(4, minmax(280px, auto))",
              }}
            >
              {tiles.map((tile) => {
                const { dash_col = 1, dash_row = 1, dash_w = 1, dash_h = 1 } = tile.query;
                return (
                  <div
                    key={tile.query.id}
                    style={{
                      gridColumn: `${dash_col} / span ${dash_w}`,
                      gridRow: `${dash_row} / span ${dash_h}`,
                    }}
                  >
                    <DashboardTileCard tile={tile} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
