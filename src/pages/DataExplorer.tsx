import { useState, useEffect, useCallback } from "react";
import { Database, ChevronDown, ChevronRight, Loader2, AlertCircle, Columns } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchQuerySchema,
  executeQuery,
  QuerySchemaTable,
  QueryExecuteResponse,
} from "@/lib/api";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function isNumeric(v: string | number | null): boolean {
  if (v === null) return false;
  return !isNaN(Number(v));
}

function TablePreview({
  table,
  websiteId,
}: {
  table: QuerySchemaTable;
  websiteId: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QueryExecuteResponse | null>(null);

  const loadPreview = useCallback(async () => {
    if (results || loading) return;
    setLoading(true);
    setError(null);
    try {
      const sql = `SELECT * FROM ${table.name} ORDER BY created_at DESC LIMIT 10`;
      const data = await executeQuery(websiteId, sql);
      setResults(data);
    } catch (err) {
      // Retry without ORDER BY created_at in case column doesn't exist
      try {
        const sql = `SELECT * FROM ${table.name} LIMIT 10`;
        const data = await executeQuery(websiteId, sql);
        setResults(data);
      } catch (err2) {
        setError(err2 instanceof Error ? err2.message : "Failed to load preview");
      }
    } finally {
      setLoading(false);
    }
  }, [table.name, websiteId, results, loading]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !results && !loading) {
      loadPreview();
    }
  };

  return (
    <div className="border border-border">
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
        <Columns className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-mono text-xs font-semibold text-foreground">
          {table.name}
        </span>
        {table.description && (
          <span className="font-mono text-[10px] text-muted-foreground truncate">
            — {table.description}
          </span>
        )}
        <span className="ml-auto font-mono text-[10px] text-muted-foreground shrink-0">
          {table.columns.length} cols
        </span>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-border">
          {/* Column schema */}
          <div className="px-4 py-2 bg-muted/20 border-b border-border">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {table.columns.map((col) => (
                <span key={col.name} className="font-mono text-[10px] text-muted-foreground">
                  <span className="text-foreground">{col.name}</span>
                  <span className="text-muted-foreground/50 ml-1">{col.type}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Data preview */}
          <div className="p-3">
            {loading ? (
              <div className="flex items-center gap-2 py-4 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="font-mono text-[10px] text-muted-foreground">Loading preview…</span>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 py-4 justify-center">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="font-mono text-[10px] text-destructive">{error}</span>
              </div>
            ) : results && results.rows.length > 0 ? (
              <div className="overflow-auto max-h-[300px] border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      {results.columns.map((col) => (
                        <TableHead
                          key={col}
                          className="font-mono text-[10px] uppercase tracking-widest font-medium whitespace-nowrap"
                        >
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.rows.map((row, ri) => (
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
            ) : results ? (
              <p className="font-mono text-[10px] text-muted-foreground text-center py-4">
                Table is empty
              </p>
            ) : null}

            {results && results.rows.length > 0 && (
              <p className="font-mono text-[10px] text-muted-foreground mt-2">
                Showing {results.rows.length} of {results.row_count} rows
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DataExplorer() {
  const { selectedWebsite } = useSelectedWebsite();
  const [schema, setSchema] = useState<QuerySchemaTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchQuerySchema()
      .then((data) => setSchema(data.tables))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load schema"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <Database className="h-4 w-4 text-muted-foreground" />
          <h1 className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
            Data Explorer
          </h1>
          <span className="font-mono text-[10px] text-muted-foreground">
            {schema.length} {schema.length === 1 ? "table" : "tables"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border border-border p-4">
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
              <p className="font-mono text-xs text-muted-foreground">{error}</p>
            </div>
          ) : schema.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Database className="h-10 w-10 text-muted-foreground/30" />
              <p className="font-mono text-sm text-foreground font-semibold">No tables found</p>
              <p className="font-mono text-xs text-muted-foreground">
                Schema data is not available yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {schema.map((table) => (
                <TablePreview
                  key={table.name}
                  table={table}
                  websiteId={selectedWebsite?.id ?? ""}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
