import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2, AlertCircle, LayoutGrid, ChevronsRight, ChevronsDown, MoreHorizontal, Pencil, EyeOff, Check, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table as TableIcon, Shapes } from "lucide-react";
import { toast } from "sonner";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { useQueries, SavedQuery } from "@/hooks/use-queries";
import { ReplaceWithQueryDialog } from "@/components/queries/ReplaceWithQueryDialog";
import { Replace, Plus } from "lucide-react";
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

function TileTable({ results, chartHeight }: { results: QueryExecuteResponse; chartHeight: number }) {
  return (
    <div className="overflow-auto border border-border" style={{ height: chartHeight }}>

      <Table className="text-[10px]">
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {results.columns.map((col) => {
              const rightAlign = results.rows.length > 0 && isNumeric(results.rows[0][results.columns.indexOf(col)]);
              return (
                <TableHead
                  key={col}
                  className={`font-mono text-[10px] uppercase tracking-widest font-medium whitespace-nowrap py-1.5 px-2 h-auto ${rightAlign ? "text-right" : ""}`}
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
                    className={`font-mono text-[10px] tabular-nums whitespace-nowrap py-1 px-2 ${num ? "text-right" : ""}`}
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
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#fill-${key})`}
              dot={{ r: 3, fill: palette[i % palette.length], strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
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
  const labelOffset = 8;

  const renderLabel = ({ name, value, cx: cxPx, cy: cyPx, midAngle, outerRadius: oR }: any) => {
    const RADIAN = Math.PI / 180;
    const x = cxPx + (oR + labelOffset) * Math.cos(-midAngle * RADIAN);
    const y = cyPx + (oR + labelOffset) * Math.sin(-midAngle * RADIAN);
    const anchor = x > cxPx ? "start" : "end";
    return (
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" style={{ fontSize: 10, fontFamily: "Space Mono, monospace", fill: "hsl(var(--foreground))" }}>
        {`${name}: ${value.toLocaleString()}`}
      </text>
    );
  };

  return (
    <div className="relative w-full" style={{ height: chartHeight }}>
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
            label={renderLabel}
            labelLine={false}
            isAnimationActive={false}
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

function DashboardTileCard({
  tile,
  onRerun,
  onRename,
  onRemove,
  onReplace,
  onChangeType,
}: {
  tile: DashboardTile;
  onRerun?: (values: Record<string, string>) => void;
  onRename?: (newName: string) => Promise<void>;
  onRemove?: () => Promise<void>;
  onReplace?: () => void;
  onChangeType?: (displayType: string) => Promise<void>;
}) {
  const { query, loading, error, results } = tile;
  const chartHeight = (query.dash_h || 1) * 160;
  const isSingleBlock = (query.dash_w || 1) === 1 && (query.dash_h || 1) === 1;
  const vars = parseVariables(query.sql);
  const defaults = buildDefaults(vars);
  const [varValues, setVarValues] = useState<Record<string, string>>(defaults);
  const hasRequiredVars = vars.length > 0 && !allVariablesSatisfied(vars, defaults);

  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(query.name);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === query.name) {
      setIsRenaming(false);
      setNameDraft(query.name);
      return;
    }
    try {
      await onRename?.(trimmed);
      toast.success("Renamed");
      setIsRenaming(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Rename failed");
    }
  };

  return (
    <div className="flex flex-col border border-border bg-card h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-border gap-2">
        {isRenaming ? (
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Input
              ref={renameInputRef}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") { setIsRenaming(false); setNameDraft(query.name); }
              }}
              className="h-6 rounded-none text-[10px] font-mono uppercase tracking-widest px-2"
            />
            <button onClick={commitRename} className="text-muted-foreground hover:text-primary p-0.5" title="Save">
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setIsRenaming(false); setNameDraft(query.name); }}
              className="text-muted-foreground hover:text-destructive p-0.5"
              title="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setNameDraft(query.name); setIsRenaming(true); }}
            title="Click to rename"
            className="font-mono text-[10px] uppercase tracking-widest font-medium truncate text-foreground text-left hover:text-primary transition-colors min-w-0 flex-1"
          >
            {query.name}
          </button>
        )}

        {!isRenaming && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-muted-foreground hover:text-primary transition-colors shrink-0 ml-2 p-0.5"
                title="Tile actions"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none font-mono text-[10px] uppercase tracking-widest min-w-[180px]">
              <DropdownMenuItem asChild>
                <Link to={`/queries/${query.id}`} className="flex items-center gap-2 cursor-pointer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in editor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setNameDraft(query.name); setIsRenaming(true); }} className="cursor-pointer">
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReplace?.()} className="cursor-pointer">
                <Replace className="h-3.5 w-3.5 mr-2" />
                Replace with query
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer font-mono text-[10px] uppercase tracking-widest">
                  <Shapes className="h-3.5 w-3.5 mr-2" />
                  Change type
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-none font-mono text-[10px] uppercase tracking-widest min-w-[160px]">
                    {[
                      { value: "table", label: "Table", Icon: TableIcon },
                      { value: "bar_chart", label: "Bar chart", Icon: BarChart3 },
                      { value: "line_chart", label: "Line chart", Icon: LineChartIcon },
                      ...(isSingleBlock ? [{ value: "pie_chart", label: "Pie chart", Icon: PieChartIcon }] : []),
                    ].map(({ value, label, Icon }) => {
                      const active = (query.display_type || "table") === value;
                      return (
                        <DropdownMenuItem
                          key={value}
                          onClick={async () => {
                            if (active) return;
                            try {
                              await onChangeType?.(value);
                              toast.success(`Changed to ${label}`);
                            } catch (e) {
                              toast.error(e instanceof Error ? e.message : "Change failed");
                            }
                          }}
                          className={`cursor-pointer ${active ? "text-primary" : ""}`}
                        >
                          <Icon className="h-3.5 w-3.5 mr-2" />
                          {label}
                          {active && <Check className="h-3 w-3 ml-auto" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await onRemove?.();
                    toast.success("Removed from dashboard");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Remove failed");
                  }
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <EyeOff className="h-3.5 w-3.5 mr-2" />
                Remove from dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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

      <div className="flex-1 min-h-0 p-3 overflow-hidden" style={{ height: chartHeight + 24 }}>
        {loading ? (
          <div className="flex flex-col gap-2 h-full items-center justify-center">
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
            {(!query.display_type || query.display_type === "table") && <TileTable results={results} chartHeight={chartHeight} />}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function QueryDashboard() {
  const { selectedWebsite } = useSelectedWebsite();
  const { queries: allQueries, fetchDashboardQueries, seedDefaultQueries, updateQuery } = useQueries(selectedWebsite?.id);
  const [tiles, setTiles] = useState<DashboardTile[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Replace dialog state. `tileIndex` is set when replacing an existing tile;
  // `slot` is set when filling an empty cell.
  const [replaceState, setReplaceState] = useState<{
    open: boolean;
    tileIndex: number | null;
    slot: { col: number; row: number; w: number; h: number } | null;
  }>({ open: false, tileIndex: null, slot: null });

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

  /** Replace tile at `tileIndex` OR pin a new tile into `slot` with the chosen query + display type. */
  const handleReplaceConfirm = useCallback(
    async (queryId: string, displayType: string) => {
      const { tileIndex, slot } = replaceState;
      const target = allQueries.find((q) => q.id === queryId);
      if (!target) return;

      try {
        if (tileIndex != null) {
          // Replacing an existing tile — preserve its grid position
          const existing = tiles[tileIndex];
          if (!existing) return;
          const { dash_col, dash_row, dash_w, dash_h } = existing.query;

          // 1. Demote the old tile from the dashboard
          await updateQuery(existing.query.id, { on_dashboard: false });
          // 2. Pin the new query into that slot
          const isPie = displayType === "pie_chart";
          const newW = isPie ? 1 : dash_w;
          const newH = isPie ? 1 : dash_h;
          await updateQuery(queryId, {
            on_dashboard: true,
            display_type: displayType,
            dash_col,
            dash_row,
            dash_w: newW,
            dash_h: newH,
          });

          const updatedQuery: SavedQuery = {
            ...target,
            on_dashboard: true,
            display_type: displayType,
            dash_col,
            dash_row,
            dash_w: newW,
            dash_h: newH,
          };
          setTiles((prev) =>
            prev.map((t, i) =>
              i === tileIndex ? { query: updatedQuery, loading: true, error: null, results: null } : t
            )
          );
          await runTile(updatedQuery, tileIndex);
          toast.success("Tile replaced");
        } else if (slot) {
          const isPie = displayType === "pie_chart";
          const newW = isPie ? 1 : slot.w;
          const newH = isPie ? 1 : slot.h;
          await updateQuery(queryId, {
            on_dashboard: true,
            display_type: displayType,
            dash_col: slot.col,
            dash_row: slot.row,
            dash_w: newW,
            dash_h: newH,
          });
          const newQuery: SavedQuery = {
            ...target,
            on_dashboard: true,
            display_type: displayType,
            dash_col: slot.col,
            dash_row: slot.row,
            dash_w: newW,
            dash_h: newH,
          };
          const newIdx = tiles.length;
          setTiles((prev) => [...prev, { query: newQuery, loading: true, error: null, results: null }]);
          await runTile(newQuery, newIdx);
          toast.success("Tile added");
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to update dashboard");
      }
    },
    [replaceState, allQueries, tiles, updateQuery, runTile]
  );

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
            <div className="flex flex-col items-center justify-center py-16 gap-6 text-center max-w-lg mx-auto">
              <LayoutGrid className="h-10 w-10 text-muted-foreground/20" />
              <div>
                <p className="font-mono text-sm text-foreground font-semibold uppercase tracking-widest">
                  Your dashboard is empty
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mt-2 leading-relaxed">
                  Pin queries to your dashboard to track what matters. Start with one of the default queries below, or create your own from scratch.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {[
                  { label: "Daily Pageviews", desc: "Traffic trends over the last 14 days" },
                  { label: "Visitor Wallet Breakdown", desc: "Total vs detected vs connected" },
                  { label: "Human vs Bot Traffic", desc: "See how much traffic is real" },
                  { label: "Top Referrers", desc: "Where your visitors come from" },
                ].map((card) => (
                  <Link
                    key={card.label}
                    to="/queries"
                    className="border border-border hover:border-primary/40 p-3 text-left transition-colors group"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest font-medium text-foreground group-hover:text-primary transition-colors">
                      {card.label}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground mt-1">{card.desc}</p>
                  </Link>
                ))}
              </div>
              <Link
                to="/queries"
                className="font-mono text-[10px] text-primary hover:underline uppercase tracking-widest"
              >
                Browse all queries →
              </Link>
            </div>
          ) : (
            <>
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gridTemplateRows: "repeat(4, minmax(0, auto))",
                }}
              >
                {tiles.map((tile, idx) => {
                  const { dash_col = 1, dash_row = 1, dash_w = 1, dash_h = 1 } = tile.query;
                  const tileHeight = (dash_h || 1) * 160 + 70;
                  return (
                    <div
                      key={tile.query.id}
                      className="overflow-hidden"
                      style={{
                        gridColumn: `${dash_col} / span ${dash_w}`,
                        gridRow: `${dash_row} / span ${dash_h}`,
                        maxHeight: tileHeight,
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
                        onRename={async (newName) => {
                          await updateQuery(tile.query.id, { name: newName });
                          setTiles((prev) =>
                            prev.map((t, i) => (i === idx ? { ...t, query: { ...t.query, name: newName } } : t))
                          );
                        }}
                        onRemove={async () => {
                          await updateQuery(tile.query.id, { on_dashboard: false });
                          setTiles((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        onReplace={() =>
                          setReplaceState({ open: true, tileIndex: idx, slot: null })
                        }
                        onChangeType={async (displayType) => {
                          await updateQuery(tile.query.id, { display_type: displayType });
                          setTiles((prev) =>
                            prev.map((t, i) =>
                              i === idx ? { ...t, query: { ...t.query, display_type: displayType } } : t
                            )
                          );
                        }}
                      />
                    </div>
                  );
                })}
                {/* Fill empty grid cells with placeholders + merge zones */}
                {(() => {
                  const occupied = new Set<string>();
                  tiles.forEach((t) => {
                    const { dash_col = 1, dash_row = 1, dash_w = 1, dash_h = 1 } = t.query;
                    for (let c = dash_col; c < dash_col + dash_w; c++) {
                      for (let r = dash_row; r < dash_row + dash_h; r++) {
                        occupied.add(`${c},${r}`);
                      }
                    }
                  });
                  // Always expose all 4 dashboard rows so users can see every available slot.
                  const maxRow = 4;
                  const empty = (c: number, r: number) => !occupied.has(`${c},${r}`) && r >= 1 && r <= maxRow;
                  const elements: React.ReactNode[] = [];

                  for (let r = 1; r <= maxRow; r++) {
                    for (let c = 1; c <= 2; c++) {
                      if (!empty(c, r)) continue;
                      const canMergeRight = c === 1 && empty(2, r);
                      const canMergeDown = empty(c, r + 1);

                      elements.push(
                        <div
                          key={`empty-${c}-${r}`}
                          className="relative border border-dashed border-border/50 group/cell"
                          style={{
                            gridColumn: `${c} / span 1`,
                            gridRow: `${r} / span 1`,
                            height: 160 + 70,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
                            <LayoutGrid className="h-4 w-4 text-muted-foreground/20 group-hover/cell:text-primary/40 transition-colors" />
                            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/30">
                              1 × 1 · Empty
                            </span>
                            <div className="flex items-center gap-1 opacity-60 group-hover/cell:opacity-100 transition-opacity">
                              <Link
                                to={`/queries?new=1&col=${c}&row=${r}&w=1&h=1`}
                                className="font-mono text-[9px] uppercase tracking-widest border border-border px-2 py-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center gap-1"
                                title="Create new query"
                              >
                                <Plus className="h-3 w-3" />
                                New
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplaceState({
                                    open: true,
                                    tileIndex: null,
                                    slot: { col: c, row: r, w: 1, h: 1 },
                                  })
                                }
                                className="font-mono text-[9px] uppercase tracking-widest border border-border px-2 py-1 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center gap-1"
                                title="Use existing query"
                              >
                                <Replace className="h-3 w-3" />
                                Existing
                              </button>
                            </div>
                          </div>

                          {/* Expand-right merge zone — New + Existing */}
                          {canMergeRight && (
                            <div
                              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/cell:opacity-100 transition-opacity flex flex-col items-center gap-1 bg-background/90 border border-border p-1"
                              title="Create full-width tile"
                            >
                              <ChevronsRight className="h-3 w-3 text-primary" />
                              <Link
                                to={`/queries?new=1&col=1&row=${r}&w=2&h=1`}
                                className="font-mono text-[8px] uppercase tracking-widest border border-border px-1.5 py-0.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center gap-1"
                                title="Create new full-width tile"
                              >
                                <Plus className="h-2.5 w-2.5" />
                                New
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplaceState({
                                    open: true,
                                    tileIndex: null,
                                    slot: { col: 1, row: r, w: 2, h: 1 },
                                  })
                                }
                                className="font-mono text-[8px] uppercase tracking-widest border border-border px-1.5 py-0.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center gap-1"
                                title="Use existing query as full-width tile"
                              >
                                <Replace className="h-2.5 w-2.5" />
                                Existing
                              </button>
                            </div>
                          )}

                          {/* Expand-down merge zone — New + Existing */}
                          {canMergeDown && (
                            <div
                              className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center gap-1 bg-background/90 border border-border p-1"
                              title="Create tall tile"
                            >
                              <ChevronsDown className="h-3 w-3 text-primary" />
                              <Link
                                to={`/queries?new=1&col=${c}&row=${r}&w=1&h=2`}
                                className="font-mono text-[8px] uppercase tracking-widest border border-border px-1.5 py-0.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center gap-1"
                                title="Create new tall tile"
                              >
                                <Plus className="h-2.5 w-2.5" />
                                New
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  setReplaceState({
                                    open: true,
                                    tileIndex: null,
                                    slot: { col: c, row: r, w: 1, h: 2 },
                                  })
                                }
                                className="font-mono text-[8px] uppercase tracking-widest border border-border px-1.5 py-0.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center gap-1"
                                title="Use existing query as tall tile"
                              >
                                <Replace className="h-2.5 w-2.5" />
                                Existing
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }
                  }
                  return elements;
                })()}
              </div>
            </>
          )}
        </div>
      </div>

      <ReplaceWithQueryDialog
        open={replaceState.open}
        onOpenChange={(open) =>
          setReplaceState((prev) =>
            open ? { ...prev, open } : { open: false, tileIndex: null, slot: null }
          )
        }
        queries={allQueries}
        excludeQueryIds={tiles.map((t) => t.query.id)}
        title={replaceState.tileIndex != null ? "Replace tile" : "Add tile from existing query"}
        onConfirm={handleReplaceConfirm}
      />
    </DashboardLayout>
  );
}
