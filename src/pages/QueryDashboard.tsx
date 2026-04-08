import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2, AlertCircle, LayoutGrid } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { useQueries, SavedQuery } from "@/hooks/use-queries";
import { executeQuery, QueryExecuteResponse } from "@/lib/api";
import { parseVariables, buildDefaults, substituteVariables, allVariablesSatisfied } from "@/lib/query-variables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLOR_LEFT = "hsl(24 95% 53%)";   // Orange — primary
const COLOR_RIGHT = "hsl(168 53% 43%)"; // Teal — secondary
const EXTRA_COLORS = [
  "hsl(24 95% 70%)",    // Light orange
  "hsl(168 53% 60%)",   // Light teal
  "hsl(24 60% 40%)",    // Burnt orange
  "hsl(168 40% 30%)",   // Deep teal
  "hsl(30 90% 62%)",    // Amber
  "hsl(180 45% 50%)",   // Cyan-teal
  "hsl(15 80% 55%)",    // Coral
  "hsl(160 50% 45%)",   // Sea green
  "hsl(35 95% 50%)",    // Gold
  "hsl(190 55% 40%)",   // Steel teal
];

function buildChartConfig(keys: string[]): ChartConfig {
  const palette = [COLOR_LEFT, COLOR_RIGHT, ...EXTRA_COLORS];
  const config: ChartConfig = {};
  keys.forEach((key, i) => {
    config[key] = { label: key, color: palette[i % palette.length] };
  });
  return config;
}

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

function isNumeric(v: string | number | null): boolean {
  if (v === null) return false;
  return !isNaN(Number(v));
}

function ChartWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/10 font-medium">
        AudienceScan
      </span>
    </div>
  );
}

function TileTable({ results }: { results: QueryExecuteResponse }) {
  return (
    <div className="overflow-auto max-h-[300px] border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {results.columns.map((col) => {
              const rightAlign = results.rows.length > 0 && isNumeric(results.rows[0][results.columns.indexOf(col)]);
              return (
                <TableHead
                  key={col}
                  className={`font-mono text-[10px] uppercase tracking-widest font-medium whitespace-nowrap ${rightAlign ? "text-right" : ""}`}
                >
                  {col}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.rows.slice(0, 100).map((row, ri) => (
            <TableRow key={ri}>
              {row.map((cell, ci) => {
                const num = isNumeric(cell);
                return (
                  <TableCell
                    key={ci}
                    className={`font-mono text-xs tabular-nums whitespace-nowrap ${num ? "text-right" : ""}`}
                  >
                    {cell === null ? (
                      <span className="text-muted-foreground/40">null</span>
                    ) : num ? (
                      Number(cell).toLocaleString()
                    ) : (
                      String(cell)
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TileBarChart({ results, chartHeight }: { results: QueryExecuteResponse; chartHeight: number }) {
  const data = formatChartData(results);
  const xKey = results.columns[0];
  const barKeys = results.columns.slice(1);
  const config = buildChartConfig(barKeys);

  return (
    <div className="relative">
      <ChartWatermark />
      <ChartContainer config={config} className="w-full" style={{ height: chartHeight }}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {barKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={[3, 3, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function TileLineChart({ results, chartHeight }: { results: QueryExecuteResponse; chartHeight: number }) {
  const data = formatChartData(results);
  const xKey = results.columns[0];
  const lineKeys = results.columns.slice(1);
  const config = buildChartConfig(lineKeys);
  const palette = [COLOR_LEFT, COLOR_RIGHT, ...EXTRA_COLORS];

  return (
    <div className="relative">
      <ChartWatermark />
      <ChartContainer config={config} className="w-full" style={{ height: chartHeight }}>
        <AreaChart data={data}>
          <defs>
            {lineKeys.map((key, i) => (
              <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette[i % palette.length]} stopOpacity={0.2} />
                <stop offset="100%" stopColor={palette[i % palette.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {lineKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={palette[i % palette.length]}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#fill-${key})`}
              dot={{ r: 2.5, fill: palette[i % palette.length], strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

const PIE_COLORS = [COLOR_LEFT, COLOR_RIGHT, ...EXTRA_COLORS];

function TilePieChart({ results, chartHeight }: { results: QueryExecuteResponse; chartHeight: number }) {
  const data = results.rows.map((row, i) => ({
    name: String(row[0] ?? ""),
    value: Number(row[1] ?? 0),
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));
  const config: ChartConfig = {};
  data.forEach((d) => { config[d.name] = { label: d.name, color: d.fill }; });

  const radius = Math.min(chartHeight * 0.35, 100);

  return (
    <div className="relative">
      <ChartWatermark />
      <ChartContainer config={config} className="w-full" style={{ height: chartHeight }}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={radius}
            innerRadius={radius * 0.45}
            paddingAngle={3}
            cornerRadius={3}
            strokeWidth={2}
            stroke="hsl(var(--background))"
            label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
            labelLine={{ strokeWidth: 1, stroke: "hsl(var(--muted-foreground))" }}
            style={{ fontSize: 10, fontFamily: "Space Mono, monospace" }}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
}

function DashboardTileCard({ tile, onRerun }: { tile: DashboardTile; onRerun?: (values: Record<string, string>) => void }) {
  const { query, loading, error, results } = tile;
  const chartHeight = Math.max(180, (query.dash_h || 1) * 200);
  const vars = parseVariables(query.sql);
  const defaults = buildDefaults(vars);
  const [varValues, setVarValues] = useState<Record<string, string>>(defaults);
  const hasRequiredVars = vars.length > 0 && !allVariablesSatisfied(vars, defaults);

  return (
    <div className="flex flex-col border border-border bg-card h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <span className="font-mono text-[10px] uppercase tracking-widest font-medium truncate text-foreground">
          {query.name}
        </span>
        <Link
          to={`/queries/${query.id}`}
          className="text-muted-foreground hover:text-primary transition-colors shrink-0 ml-2"
          title="Open in editor"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Variable inputs for tiles with required (no-default) vars */}
      {hasRequiredVars && !loading && !results && (
        <div className="px-4 py-2 border-b border-border bg-muted/20 flex flex-wrap items-end gap-2">
          {vars.map((v) => (
            <div key={v.name} className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{v.name}</span>
              <Input
                value={varValues[v.name] ?? v.defaultValue ?? ""}
                onChange={(e) => setVarValues((prev) => ({ ...prev, [v.name]: e.target.value }))}
                className="h-6 w-24 rounded-none text-xs font-mono px-2"
              />
            </div>
          ))}
          <button
            onClick={() => onRerun?.(varValues)}
            className="font-mono text-[10px] uppercase tracking-widest text-primary hover:underline pb-0.5"
          >
            Run
          </button>
        </div>
      )}

      {/* Variable bar for tiles that auto-resolved */}
      {vars.length > 0 && !hasRequiredVars && (
        <div className="px-4 py-1.5 border-b border-border bg-muted/10 flex flex-wrap gap-3">
          {vars.map((v) => (
            <span key={v.name} className="font-mono text-[9px] text-muted-foreground">
              {v.name}: <span className="text-foreground">{defaults[v.name]}</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 p-3">
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
            {query.display_type === "bar_chart" && <TileBarChart results={results} chartHeight={chartHeight} />}
            {query.display_type === "line_chart" && <TileLineChart results={results} chartHeight={chartHeight} />}
            {query.display_type === "pie_chart" && <TilePieChart results={results} chartHeight={chartHeight} />}
            {(!query.display_type || query.display_type === "table") && <TileTable results={results} />}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function QueryDashboard() {
  const { selectedWebsite } = useSelectedWebsite();
  const { fetchDashboardQueries, seedDefaultQueries } = useQueries(selectedWebsite?.id);
  const [tiles, setTiles] = useState<DashboardTile[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const runTile = useCallback(async (q: SavedQuery, idx: number, varValues?: Record<string, string>) => {
    const vars = parseVariables(q.sql);
    const values = varValues ?? buildDefaults(vars);
    const resolvedSql = substituteVariables(q.sql, values);

    try {
      const res = await executeQuery(selectedWebsite!.id, resolvedSql);
      setTiles((prev) =>
        prev.map((t, i) => (i === idx ? { ...t, loading: false, results: res, error: null } : t))
      );
    } catch (err) {
      setTiles((prev) =>
        prev.map((t, i) =>
          i === idx ? { ...t, loading: false, error: err instanceof Error ? err.message : "Query failed" } : t
        )
      );
    }
  }, [selectedWebsite]);

  const loadAndRun = useCallback(async () => {
    if (!selectedWebsite) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    try {
      let dashQueries = await fetchDashboardQueries();
      if (dashQueries.length === 0) {
        // Try seeding default queries
        try {
          dashQueries = await seedDefaultQueries();
        } catch { /* ignore seed errors */ }
      }
      if (dashQueries.length === 0) {
        setTiles([]);
        setInitialLoading(false);
        return;
      }

      const initial: DashboardTile[] = dashQueries.map((q) => {
        const vars = parseVariables(q.sql);
        const defaults = buildDefaults(vars);
        const hasRequired = !allVariablesSatisfied(vars, defaults);
        return {
          query: q,
          loading: !hasRequired, // Don't auto-run tiles with required vars
          error: null,
          results: null,
        };
      });
      setTiles(initial);
      setInitialLoading(false);

      // Run tiles that can auto-resolve
      await Promise.allSettled(
        dashQueries.map(async (q, idx) => {
          const vars = parseVariables(q.sql);
          const defaults = buildDefaults(vars);
          if (!allVariablesSatisfied(vars, defaults)) return;
          await runTile(q, idx);
        })
      );
    } catch {
      setInitialLoading(false);
    }
  }, [selectedWebsite, fetchDashboardQueries, seedDefaultQueries, runTile]);

  useEffect(() => {
    loadAndRun();
  }, [loadAndRun]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
            Dashboard
          </h1>
          <span className="font-mono text-[10px] text-muted-foreground">
            {tiles.length} {tiles.length === 1 ? "tile" : "tiles"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {initialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-border p-4">
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
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
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateRows: "repeat(4, minmax(0, auto))",
              }}
            >
              {tiles.map((tile, idx) => {
                const { dash_col = 1, dash_row = 1, dash_w = 1, dash_h = 1 } = tile.query;
                return (
                  <div
                    key={tile.query.id}
                    style={{
                      gridColumn: `${dash_col} / span ${dash_w}`,
                      gridRow: `${dash_row} / span ${dash_h}`,
                    }}
                  >
                    <DashboardTileCard
                      tile={tile}
                      onRerun={(values) => {
                        setTiles((prev) =>
                          prev.map((t, i) => (i === idx ? { ...t, loading: true, error: null, results: null } : t))
                        );
                        runTile(tile.query, idx, values);
                      }}
                    />
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
