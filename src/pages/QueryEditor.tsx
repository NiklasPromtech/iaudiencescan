import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Play,
  Sparkles,
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertCircle,
  Columns,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  fetchQuerySchema,
  executeQuery,
  QuerySchemaTable,
  QuerySchemaColumn,
  QueryExecuteResponse,
} from "@/lib/api";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { useQueries } from "@/hooks/use-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Schema-driven Data Explorer ───────────────────────────────────────────────

const SchemaTableSection = ({
  table,
  onColumnClick,
}: {
  table: QuerySchemaTable;
  onColumnClick: (table: string, column: QuerySchemaColumn) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/40 transition-colors"
      >
        {open ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
        )}
        <Columns className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-mono text-[10px] font-semibold text-foreground truncate">
          {table.name}
        </span>
      </button>
      {open && (
        <div className="pb-1">
          {table.description && (
            <p className="px-8 pb-1.5 font-mono text-[9px] text-muted-foreground/70 leading-tight">
              {table.description}
            </p>
          )}
          {table.columns.map((col) => (
            <button
              key={col.name}
              onClick={() => onColumnClick(table.name, col)}
              className="w-full text-left px-8 py-1 flex items-start gap-2 hover:bg-muted/30 group transition-colors"
              title={col.description}
            >
              <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                {col.name}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/50 mt-px shrink-0">
                {col.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── SQL Editor with line numbers ──────────────────────────────────────────────

const PLACEHOLDER_SQL = `SELECT
  wallet_address,
  COUNT(*) AS tx_count,
  SUM(amount_usd) AS total_volume_usd
FROM audiencescan.transfers
WHERE block_date >= NOW() - INTERVAL '30' DAY
GROUP BY 1
ORDER BY 3 DESC
LIMIT 100`;

const SqlEditor = ({
  value,
  onChange,
  editorRef,
}: {
  value: string;
  onChange: (v: string) => void;
  editorRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split("\n").length || 1;

  const syncScroll = () => {
    if (editorRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  return (
    <div className="flex border border-border overflow-hidden font-mono text-xs leading-5 flex-1 min-h-0">
      {/* Gutter */}
      <div
        ref={gutterRef}
        className="bg-muted/50 border-r border-border text-muted-foreground select-none shrink-0 w-10 pt-3 pb-3"
        style={{ overflowY: "hidden" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="text-right pr-3 leading-5">
            {i + 1}
          </div>
        ))}
      </div>
      {/* Textarea */}
      <textarea
        ref={editorRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        className="flex-1 resize-none bg-background text-foreground p-3 focus:outline-none leading-5 font-mono text-xs"
        placeholder="-- Write your SQL query here..."
      />
    </div>
  );
};

// ── Prompt chips ──────────────────────────────────────────────────────────────

const PROMPT_CHIPS = [
  "Top 50 token holders by balance in the last 30 days",
  "Wallets that clicked an ad and then made an on-chain transfer",
  "Daily new wallet visits to my site this month",
  "Which wallets hold my token and also visited a competitor's site?",
  "Show wallet journeys from first ad click to first transaction",
];

// ── Main page ─────────────────────────────────────────────────────────────────

type SaveStatus = "idle" | "saving" | "saved";

export default function QueryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const { selectedWebsite } = useSelectedWebsite();
  const { createQuery, updateQuery } = useQueries();
  const { toast } = useToast();

  const [title, setTitle] = useState("New query");
  const [editingTitle, setEditingTitle] = useState(false);
  const [sql, setSql] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Query load state
  const [queryLoading, setQueryLoading] = useState(!isNew);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  // Track if this is the first load (don't auto-save on initial populate)
  const isFirstLoad = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Schema state
  const [schema, setSchema] = useState<QuerySchemaTable[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [explorerSearch, setExplorerSearch] = useState("");

  // Run state
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<QueryExecuteResponse | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // If navigated to /queries/new, create a DB row and redirect
  useEffect(() => {
    if (isNew) {
      createQuery("New query", "").then((q) => {
        navigate(`/queries/${q.id}`, { replace: true });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew]);

  // Load existing query from Supabase
  useEffect(() => {
    if (isNew || !id) return;
    setQueryLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("queries")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        isFirstLoad.current = true;
        setTitle(data.name ?? "New query");
        setSql(data.sql ?? "");
      }
      setQueryLoading(false);
    })();
  }, [id, isNew]);

  // Debounced auto-save whenever title or sql changes
  useEffect(() => {
    if (isNew || !id || queryLoading) return;
    if (isFirstLoad.current) {
      // Skip the save triggered by the initial population
      isFirstLoad.current = false;
      return;
    }
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await updateQuery(id, { name: title, sql });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("idle");
      }
    }, 1500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, sql]);

  // Load schema on mount
  const loadSchema = useCallback(async () => {
    setSchemaLoading(true);
    setSchemaError(null);
    try {
      const data = await fetchQuerySchema();
      setSchema(data.tables);
    } catch (err) {
      setSchemaError(err instanceof Error ? err.message : "Could not load schema");
    } finally {
      setSchemaLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchema();
  }, [loadSchema]);

  // Insert column reference into editor at cursor
  const handleColumnClick = useCallback(
    (tableName: string, col: QuerySchemaColumn) => {
      const ref = `${tableName}.${col.name}`;
      const ta = editorRef.current;
      if (!ta) {
        setSql((s) => s + ref);
        return;
      }
      const start = ta.selectionStart ?? sql.length;
      const end = ta.selectionEnd ?? sql.length;
      const next = sql.slice(0, start) + ref + sql.slice(end);
      setSql(next);
      // restore cursor after state update
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + ref.length, start + ref.length);
      }, 0);
    },
    [sql]
  );

  // Generate SQL from a natural language prompt
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("sql-generate", {
        body: { prompt, schema },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSql(data.sql ?? "");
      setPrompt("");
      setHasRun(false);
    } catch (err) {
      toast({
        title: "Couldn't generate query",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Execute the query
  const handleRun = async () => {
    if (!sql.trim() || isRunning) return;
    if (!selectedWebsite) return;

    setIsRunning(true);
    setRunError(null);
    setResults(null);
    setHasRun(true);

    try {
      const data = await executeQuery(selectedWebsite.id, sql);
      setResults(data);
    } catch (err) {
      setRunError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setIsRunning(false);
    }
  };

  // Filter schema by search
  const filteredSchema = explorerSearch
    ? schema.filter(
        (t) =>
          t.name.toLowerCase().includes(explorerSearch.toLowerCase()) ||
          t.columns.some((c) =>
            c.name.toLowerCase().includes(explorerSearch.toLowerCase())
          )
      )
    : schema;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-border px-4 py-2 flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate("/queries")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {queryLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : editingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              className="font-mono text-sm font-semibold bg-transparent border-b border-primary focus:outline-none text-foreground"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="font-mono text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              {title}
            </button>
          )}

          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            @audiencescan
          </span>

          {/* Save status */}
          {saveStatus === "saving" && (
            <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
              <Check className="h-2.5 w-2.5" />
              Saved
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {!selectedWebsite && (
              <span className="font-mono text-[10px] text-muted-foreground">
                No website selected
              </span>
            )}
            <Button
              onClick={handleRun}
              disabled={!sql.trim() || isRunning || !selectedWebsite || queryLoading}
              className="rounded-none h-8 px-4 text-xs font-mono uppercase tracking-widest gap-1.5"
            >
              {isRunning ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3 fill-current" />
              )}
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left — Data Explorer */}
          <div className="w-64 shrink-0 border-r border-border flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border shrink-0 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Data Explorer
              </p>
              {!schemaLoading && (
                <button
                  onClick={loadSchema}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Refresh schema"
                >
                  <RefreshCw className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="px-2 py-2 border-b border-border shrink-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  placeholder="Search tables & columns..."
                  className="pl-7 h-7 rounded-none text-[10px] font-mono"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {schemaLoading ? (
                <div className="px-3 py-4 flex flex-col gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              ) : schemaError ? (
                <div className="px-3 py-4 flex flex-col items-start gap-2">
                  <p className="font-mono text-[10px] text-destructive leading-tight">
                    Could not load schema
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground leading-tight">
                    {schemaError}
                  </p>
                  <button
                    onClick={loadSchema}
                    className="font-mono text-[10px] text-primary hover:underline"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredSchema.length === 0 ? (
                <div className="px-3 py-4">
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {explorerSearch ? "No matches" : "No tables available"}
                  </p>
                </div>
              ) : (
                filteredSchema.map((table) => (
                  <SchemaTableSection
                    key={table.name}
                    table={table}
                    onColumnClick={handleColumnClick}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right — Editor + Results */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* SQL Editor */}
            <div
              className="flex flex-col p-4 border-b border-border"
              style={{ height: "55%" }}
            >
              <SqlEditor value={sql} onChange={setSql} editorRef={editorRef} />
            </div>

            {/* Results / Get started */}
            <div className="flex-1 overflow-y-auto">
              {!hasRun ? (
                /* ── Prompt area ── */
                <div className="flex flex-col items-center gap-6 py-8 px-4">
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary/40" />
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Generate with a prompt
                    </p>
                  </div>

                  <div className="w-full max-w-lg flex gap-2">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                      placeholder="Describe what you want to query..."
                      className="rounded-none font-mono text-xs"
                    />
                    <Button
                      onClick={handleGenerate}
                      className="rounded-none shrink-0 font-mono text-xs uppercase tracking-widest gap-1.5"
                      disabled={!prompt.trim() || isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                    {PROMPT_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => setPrompt(chip)}
                        className="border border-border px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : isRunning ? (
                /* ── Running state ── */
                <div className="px-4 py-6 flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="font-mono text-xs text-muted-foreground">
                    Executing query...
                  </p>
                </div>
              ) : runError ? (
                /* ── Error state ── */
                <div className="p-4">
                  <div className="border border-destructive/40 bg-destructive/5">
                    <div className="px-4 py-2 border-b border-destructive/30 flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                      <p className="font-mono text-[10px] uppercase tracking-widest text-destructive">
                        Query error
                      </p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="font-mono text-xs text-destructive/80 whitespace-pre-wrap break-all">
                        {runError}
                      </p>
                    </div>
                  </div>
                </div>
              ) : results ? (
                /* ── Results table ── */
                <div className="p-4">
                  <div className="border border-border">
                    <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Results —{" "}
                        <span className="text-foreground">
                          {results.row_count} row
                          {results.row_count !== 1 ? "s" : ""}
                        </span>
                      </p>
                    </div>

                    {results.row_count === 0 ? (
                      <div className="px-6 py-10 text-center">
                        <p className="font-mono text-xs text-muted-foreground">
                          Query executed successfully. No rows returned.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {results.columns.map((col) => (
                                <TableHead
                                  key={col}
                                  className="font-mono text-[10px] uppercase tracking-widest h-9 px-4 whitespace-nowrap"
                                >
                                  {col}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.rows.map((row, ri) => (
                              <TableRow key={ri}>
                                {row.map((cell, ci) => (
                                  <TableCell
                                    key={ci}
                                    className="font-mono text-xs px-4 py-2 whitespace-nowrap"
                                  >
                                    {cell === null ? (
                                      <span className="text-muted-foreground">
                                        —
                                      </span>
                                    ) : (
                                      String(cell)
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </DashboardLayout>
  );
}
