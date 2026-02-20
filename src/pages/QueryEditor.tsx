import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  Trash2,
  Pencil,
  Copy,
  Download,
  Wand2,
} from "lucide-react";
import { format as formatSql } from "sql-formatter";
import { downloadCSV } from "@/lib/export-utils";
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

// ── Tokenizer ─────────────────────────────────────────────────────────────────

type SqlToken = {
  type: "keyword" | "string" | "number" | "comment" | "other";
  text: string;
};

const SQL_KEYWORDS = new Set([
  "SELECT","FROM","WHERE","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS",
  "ON","AS","AND","OR","NOT","IN","IS","NULL","BETWEEN","LIKE","EXISTS",
  "GROUP","BY","ORDER","HAVING","LIMIT","OFFSET","DISTINCT","UNION","ALL",
  "INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","DROP",
  "ALTER","ADD","COLUMN","INDEX","WITH","CASE","WHEN","THEN","ELSE","END",
  "COUNT","SUM","AVG","MIN","MAX","COALESCE","DATE","TIMESTAMP","INTERVAL",
  "CAST","IF","IFNULL","NULLIF","ROW","OVER","PARTITION","ASC","DESC",
  "CURRENT_DATE","CURRENT_TIMESTAMP","TRUE","FALSE","LIKE","ILIKE",
]);

const normalizeSqlQuotes = (s: string) =>
  s
    .replace(/[\u2018\u2019\u02BC\u0060\u00B4]/g, "'") // curly/smart single quotes → '
    .replace(/[\u201C\u201D]/g, '"');                   // curly double quotes → "

function tokenizeSql(sql: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  let remaining = sql;

  const patterns: [SqlToken["type"], RegExp][] = [
    ["comment", /^--[^\n]*/],
    ["string",  /^'[^']*'|^"[^"]*"/],
    ["number",  /^\b\d+(\.\d+)?(e\d+)?\b/i],
    ["keyword", new RegExp(`^\\b(${[...SQL_KEYWORDS].join("|")})\\b`, "i")],
    ["other",   /^[\s\S]/],
  ];

  let prevChar = "";
  const isWordChar = (c: string) => /\w/.test(c);

  while (remaining.length > 0) {
    let matched = false;
    for (const [type, re] of patterns) {
      // Skip keyword matching if the previous character was a word char (we're mid-identifier)
      if (type === "keyword" && prevChar !== "" && isWordChar(prevChar)) continue;
      const m = remaining.match(re);
      if (m) {
        const text = m[0];
        // Merge consecutive "other" tokens
        if (type === "other" && tokens.length > 0 && tokens[tokens.length - 1].type === "other") {
          tokens[tokens.length - 1].text += text;
        } else {
          tokens.push({ type, text });
        }
        prevChar = text[text.length - 1];
        remaining = remaining.slice(text.length);
        matched = true;
        break;
      }
    }
    if (!matched) break; // safety
  }
  return tokens;
}

function renderTokens(tokens: SqlToken[]): React.ReactNode[] {
  return tokens.map((tok, i) => {
    if (tok.type === "keyword") {
      return (
        <span key={i} style={{ color: "#a78bfa" }}>
          {tok.text}
        </span>
      );
    }
    if (tok.type === "string" || tok.type === "number") {
      return (
        <span key={i} style={{ color: "#fb923c" }}>
          {tok.text}
        </span>
      );
    }
    if (tok.type === "comment") {
      return (
        <span key={i} style={{ color: "#6b7280", fontStyle: "italic" }}>
          {tok.text}
        </span>
      );
    }
    return <span key={i}>{tok.text}</span>;
  });
}

// ── Autocomplete helpers ───────────────────────────────────────────────────────

function getPartialWord(text: string, cursorPos: number): string {
  const before = text.slice(0, cursorPos);
  const match = before.match(/[\w.]+$/);
  return match ? match[0] : "";
}

function replacePartialWord(text: string, cursorPos: number, completion: string): [string, number] {
  const before = text.slice(0, cursorPos);
  const after = text.slice(cursorPos);
  const match = before.match(/[\w.]+$/);
  const partialLen = match ? match[0].length : 0;
  const newText = before.slice(0, before.length - partialLen) + completion + after;
  const newCursor = cursorPos - partialLen + completion.length;
  return [newText, newCursor];
}

// ── SqlEditor component ────────────────────────────────────────────────────────

interface AutocompleteState {
  show: boolean;
  matches: string[];
  selected: number;
  top: number;
  left: number;
}

const LINE_HEIGHT = 20; // px — matches leading-5 (1.25rem = 20px)
const CHAR_WIDTH = 7.2; // approx px for Space Mono 12px
const EDITOR_PADDING = 12; // p-3 = 12px

const SqlEditor = ({
  value,
  onChange,
  onKeyDownExtra,
  editorRef,
  schema,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDownExtra?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  editorRef: React.RefObject<HTMLTextAreaElement>;
  schema: QuerySchemaTable[];
}) => {
  const gutterRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split("\n").length || 1;

  // All autocomplete candidates from schema
  const candidates = useMemo(() => {
    const set = new Set<string>();
    for (const table of schema) {
      set.add(table.name);
      for (const col of table.columns) {
        set.add(col.name);
      }
    }
    return [...set].sort();
  }, [schema]);

  const [ac, setAc] = useState<AutocompleteState>({
    show: false, matches: [], selected: 0, top: 0, left: 0,
  });

  const syncScroll = () => {
    const ta = editorRef.current;
    if (!ta) return;
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
  };

  // Recompute autocomplete position & matches whenever value/cursor changes
  const updateAutocomplete = useCallback((ta: HTMLTextAreaElement) => {
    const cursor = ta.selectionStart;
    const partial = getPartialWord(value, cursor);
    if (partial.length < 2) {
      setAc((prev) => ({ ...prev, show: false }));
      return;
    }
    const lower = partial.toLowerCase();
    const matches = candidates.filter((c) => c.toLowerCase().startsWith(lower) && c !== partial);
    if (matches.length === 0) {
      setAc((prev) => ({ ...prev, show: false }));
      return;
    }

    // Calculate pixel position
    const textBefore = value.slice(0, cursor);
    const lines = textBefore.split("\n");
    const lineIndex = lines.length - 1;
    const colIndex = lines[lineIndex].length;
    const scrollTop = ta.scrollTop;

    const top = EDITOR_PADDING + (lineIndex + 1) * LINE_HEIGHT - scrollTop;
    const left = EDITOR_PADDING + colIndex * CHAR_WIDTH;

    setAc({ show: true, matches: matches.slice(0, 6), selected: 0, top, left });
  }, [value, candidates]);

  const acceptCompletion = useCallback((completionOverride?: string) => {
    const ta = editorRef.current;
    if (!ta) return;
    const completion = completionOverride ?? ac.matches[ac.selected];
    if (!completion) return;
    const [newSql, newCursor] = replacePartialWord(value, ta.selectionStart, completion);
    onChange(newSql);
    setAc((prev) => ({ ...prev, show: false }));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(newCursor, newCursor);
    }, 0);
  }, [ac, value, onChange, editorRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ac.show) {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        acceptCompletion();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setAc((prev) => ({ ...prev, selected: Math.min(prev.selected + 1, prev.matches.length - 1) }));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setAc((prev) => ({ ...prev, selected: Math.max(prev.selected - 1, 0) }));
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setAc((prev) => ({ ...prev, show: false }));
        return;
      }
    } else if (e.key === "Tab") {
      // Insert 2 spaces for indentation when no autocomplete
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const next = value.slice(0, start) + "  " + value.slice(end);
      onChange(next);
      setTimeout(() => {
        ta.setSelectionRange(start + 2, start + 2);
      }, 0);
      return;
    }
    onKeyDownExtra?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(normalizeSqlQuotes(e.target.value));
    // Schedule autocomplete update after state settles
    setTimeout(() => {
      if (editorRef.current) updateAutocomplete(editorRef.current);
    }, 0);
  };

  const handleClick = () => {
    if (editorRef.current) updateAutocomplete(editorRef.current);
  };

  const tokens = useMemo(() => tokenizeSql(value), [value]);

  return (
    <div ref={editorContainerRef} className="flex border border-border overflow-hidden font-mono text-xs leading-5 flex-1 min-h-0 relative">
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

      {/* Editor area: pre + textarea stacked */}
      <div className="flex-1 relative overflow-hidden">
        {/* Highlighted pre layer */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 p-3 font-mono text-xs leading-5 whitespace-pre overflow-hidden pointer-events-none m-0"
          style={{ tabSize: 2 }}
        >
          {renderTokens(tokens)}
          {/* trailing newline so height matches textarea */}
          {"\n"}
        </pre>

        {/* Transparent textarea on top */}
        <textarea
          ref={editorRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onScroll={syncScroll}
          spellCheck={false}
          className="absolute inset-0 w-full h-full resize-none bg-transparent p-3 focus:outline-none leading-5 font-mono text-xs"
          style={{ color: "transparent", caretColor: "hsl(var(--foreground))" }}
          placeholder="-- Write your SQL query here..."
        />

        {/* Autocomplete dropdown */}
        {ac.show && (
          <div
            className="absolute z-50 border border-border bg-popover text-popover-foreground shadow-md py-0.5 min-w-[160px]"
            style={{ top: ac.top, left: ac.left }}
            onMouseDown={(e) => e.preventDefault()} // keep textarea focused
          >
            {ac.matches.map((m, i) => (
              <div
                key={m}
                onMouseDown={() => acceptCompletion(m)}
                className={cn(
                  "px-3 py-1 font-mono text-xs cursor-pointer transition-colors",
                  i === ac.selected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/60"
                )}
              >
                {m}
              </div>
            ))}
            <div className="border-t border-border mt-0.5 px-3 py-0.5">
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
                Tab to complete · Esc to dismiss
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Sample queries ────────────────────────────────────────────────────────────

const SAMPLE_QUERIES: { label: string; sql: string }[] = [
  {
    label: "Visitors today",
    sql: `SELECT
  COUNT(DISTINCT visitor_hash) AS unique_visitors,
  COUNT(*)                     AS total_pageviews
FROM pageviews
WHERE DATE(created_at) = CURRENT_DATE()
  AND is_bot = false`,
  },
  {
    label: "Wallet connections today",
    sql: `SELECT
  COUNT(DISTINCT wallet_id) AS wallets_connected
FROM wallets
WHERE DATE(created_at) = CURRENT_DATE()`,
  },
  {
    label: "Top pages today",
    sql: `SELECT
  page_path,
  COUNT(DISTINCT visitor_hash) AS unique_visitors,
  COUNT(*)                     AS pageviews
FROM pageviews
WHERE DATE(created_at) = CURRENT_DATE()
  AND is_bot = false
GROUP BY 1
ORDER BY 3 DESC
LIMIT 20`,
  },
  {
    label: "Visitors that connected a wallet",
    sql: `SELECT
  COUNT(DISTINCT p.visitor_hash) AS visitors_with_wallet
FROM pageviews p
INNER JOIN wallets w ON w.visitor_hash = p.visitor_hash
WHERE DATE(p.created_at) = CURRENT_DATE()
  AND p.is_bot = false`,
  },
  {
    label: "Clicks by UTM source today",
    sql: `SELECT
  p.utm_source,
  COUNT(*) AS clicks
FROM events e
INNER JOIN pageviews p
  ON p.session_id = e.session_id
WHERE DATE(e.created_at) = CURRENT_DATE()
  AND e.event_type = 'click'
  AND p.utm_source IS NOT NULL
GROUP BY 1
ORDER BY 2 DESC
LIMIT 50`,
  },
  {
    label: "Clicks from utm_source=\"sample\" today",
    sql: `SELECT
  JSON_EXTRACT_SCALAR(e.event_data, '$.href')       AS href,
  JSON_EXTRACT_SCALAR(e.event_data, '$.click_text') AS click_text,
  COUNT(*)                                           AS clicks
FROM events e
INNER JOIN pageviews p
  ON p.session_id = e.session_id
WHERE DATE(e.created_at) = CURRENT_DATE()
  AND e.event_type = 'click'
  AND p.utm_source = 'sample'
GROUP BY 1, 2
ORDER BY 3 DESC
LIMIT 50`,
  },
  {
    label: "Top converting wallets this week",
    sql: `SELECT
  w.wallet_id                   AS wallet_address,
  COUNT(DISTINCT e.session_id)  AS conversion_events
FROM wallets w
INNER JOIN events e ON e.visitor_hash = w.visitor_hash
WHERE DATE(e.created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
  AND e.event_type != 'click'
  AND e.is_auto_tracked = false
GROUP BY 1
ORDER BY 2 DESC
LIMIT 50`,
  },
];

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
  const { createQuery, updateQuery, deleteQuery } = useQueries();
  const { toast } = useToast();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [title, setTitle] = useState("New query");
  const [editingTitle, setEditingTitle] = useState(false);
  const [sql, setSql] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [schemaCopied, setSchemaCopied] = useState(false);

  // Query load state
  const [queryLoading, setQueryLoading] = useState(!isNew);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  // skipNextSave: set to true before any injection so the next auto-save cycle is skipped.
  // sqlRef / titleRef: always hold the latest values so the debounced save avoids stale closures.
  const skipNextSave = useRef(true);
  const sqlRef = useRef(sql);
  const titleRef = useRef(title);
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

  // Resizable editor/results split
  const [editorHeightPx, setEditorHeightPx] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = ev.clientY - rect.top;
      const clamped = Math.max(120, Math.min(newHeight, rect.height - 120));
      setEditorHeightPx(clamped);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  // CSV export for results
  const handleDownloadCSV = useCallback(() => {
    if (!results) return;
    const data = [results.columns, ...results.rows.map((row) => row.map((cell) => String(cell ?? "")))];
    downloadCSV(data, `query-results-${Date.now()}`);
  }, [results]);

  // If navigated to /queries/new, create a DB row and redirect
  useEffect(() => {
    if (isNew) {
      createQuery("New query", "").then((q) => {
        navigate(`/queries/${q.id}`, { replace: true });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew]);

  // Keep refs in sync with state so debounced callbacks never read stale closures
  useEffect(() => { sqlRef.current = sql; }, [sql]);
  useEffect(() => { titleRef.current = title; }, [title]);

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
        // Block the auto-save that will fire when we call setTitle/setSql
        skipNextSave.current = true;
        setTitle(data.name ?? "New query");
        if (data.sql) {
          setSql(normalizeSqlQuotes(data.sql));
        } else {
          // Will be filled in once selectedWebsite is available — see effect below
          setSql("");
        }
      }
      setQueryLoading(false);
    })();
  }, [id, isNew]);

  // Once the query loads with no SQL and we know the tag_id, inject a sample query.
  // Reset when the query ID changes (e.g. redirect from /queries/new → /queries/UUID).
  const sampleInjected = useRef(false);
  useEffect(() => {
    sampleInjected.current = false;
  }, [id]);


  useEffect(() => {
    if (isNew || !id || queryLoading) return;
    if (skipNextSave.current) {
      // This save was triggered by an injection or initial load — skip it
      skipNextSave.current = false;
      return;
    }
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        // Read from refs to avoid stale closure capturing the old sql/title values
        await updateQuery(id, { name: titleRef.current, sql: sqlRef.current });
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

  // Copy schema to clipboard for use with external AI
  const handleCopySchema = useCallback(() => {
    if (!schema.length) return;
    const text = [
      "You are a SQL assistant for the AudienceScan analytics platform.",
      "Generate BigQuery-compatible SQL using only the tables and columns listed below.",
      "Return ONLY the SQL — no explanation, no markdown fences.",
      "",
      "## Schema",
      ...schema.map((t) => {
        const cols = t.columns
          .map((c) => `  - ${c.name} (${c.type})${c.description ? `: ${c.description}` : ""}`)
          .join("\n");
        return `### ${t.name}${t.description ? `\n${t.description}` : ""}\n${cols}`;
      }),
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setSchemaCopied(true);
      setTimeout(() => setSchemaCopied(false), 2000);
    });
  }, [schema]);

  // Generate SQL from a natural language prompt
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.functions.invoke("audiencescan-signal", {
        body: { action: "sql-generate", prompt, schema },
      });
      if (error) {
        // Try to extract a more specific message from the function response body
        let detail = "Please try again.";
        try {
          // FunctionsHttpError has a .context.responseBody or similar
          const ctx = (error as { context?: { responseBody?: string } }).context;
          if (ctx?.responseBody) {
            const parsed = JSON.parse(ctx.responseBody);
            detail = parsed.error ?? detail;
          }
        } catch (_e) { /* ignore parse errors */ }
        console.error("sql-generate error:", error, detail);
        throw new Error(detail);
      }
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

  // Delete the query
  const handleDelete = async () => {
    if (!id || isNew) return;
    try {
      await deleteQuery(id);
      navigate("/queries");
    } catch (err) {
      toast({
        title: "Couldn't delete query",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format SQL
  const handleFormat = () => {
    if (!sql.trim()) return;
    try {
      const formatted = formatSql(normalizeSqlQuotes(sql), {
        language: "bigquery",
        tabWidth: 2,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      });
      setSql(formatted);
    } catch {
      // If formatter fails, leave SQL unchanged
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
      const data = await executeQuery(selectedWebsite.id, normalizeSqlQuotes(sql));
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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setEditingTitle(false);
              }}
              className="font-mono text-sm font-semibold bg-transparent border-b border-primary focus:outline-none text-foreground min-w-0 max-w-xs"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              title="Click to rename"
              className="group flex items-center gap-1.5 font-mono text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              {title}
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
            </button>
          )}

          {selectedWebsite?.tag_id && (
            <button
              title="This is your website tag ID — include it in queries to filter data for this property"
              onClick={() => {
                navigator.clipboard.writeText(selectedWebsite.tag_id);
                toast({ description: `Copied tag ID: ${selectedWebsite.tag_id}` });
              }}
              className="flex items-center gap-1.5 border border-border bg-muted/40 px-2 py-0.5 hover:bg-muted transition-colors group"
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                tag_id
              </span>
              <span className="font-mono text-[10px] text-foreground font-semibold">
                {selectedWebsite.tag_id}
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                copy
              </span>
            </button>
          )}

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

            {/* Delete button — with inline confirmation */}
            {!isNew && (
              confirmDelete ? (
                <div className="flex items-center gap-1.5 border border-destructive/50 bg-destructive/5 px-2 py-1">
                  <span className="font-mono text-[10px] text-destructive">Delete?</span>
                  <button
                    onClick={handleDelete}
                    className="font-mono text-[10px] text-destructive hover:text-destructive/80 font-semibold transition-colors"
                  >
                    Yes
                  </button>
                  <span className="text-muted-foreground/40 font-mono text-[10px]">/</span>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  title="Delete query"
                  className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )
            )}

            <button
              onClick={handleFormat}
              disabled={!sql.trim() || queryLoading}
              title="Format SQL"
              className="h-8 px-3 flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border rounded-none hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Wand2 className="h-3 w-3" />
              Pretty
            </button>

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
          <div ref={containerRef} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* SQL Editor — resizable height */}
            <div
              className="flex flex-col p-4 gap-2 overflow-hidden shrink-0"
              style={{ height: editorHeightPx }}
            >
              {/* Sample query chips */}
              {selectedWebsite && (
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 shrink-0">
                    Samples:
                  </span>
                  {SAMPLE_QUERIES.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        skipNextSave.current = true;
                        setSql(s.sql);
                        setHasRun(false);
                      }}
                      className="border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              {/* Copy schema bar */}
              <div className="shrink-0 flex items-center gap-2 border border-border bg-muted/20 px-3 py-2">
                <Copy className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                <span className="flex-1 font-mono text-xs text-muted-foreground/70">
                  Use your preferred AI to write SQL — paste the schema as context
                </span>
                <button
                  onClick={handleCopySchema}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 transition-colors"
                >
                  {schemaCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {schemaCopied ? "Copied!" : "Copy Schema"}
                </button>
              </div>

              {/* SQL editor */}
              <SqlEditor value={sql} onChange={setSql} editorRef={editorRef} schema={schema} />
            </div>

            {/* Drag handle divider */}
            <div
              onMouseDown={handleDividerMouseDown}
              className="shrink-0 h-1.5 bg-border hover:bg-primary/30 cursor-row-resize transition-colors select-none flex items-center justify-center group"
              title="Drag to resize"
            >
              <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-70 transition-opacity">
                <div className="w-8 h-px bg-foreground rounded-full" />
                <div className="w-8 h-px bg-foreground rounded-full" />
              </div>
            </div>

            {/* Results area */}
            <div className="flex-1 overflow-y-auto">
              {!hasRun ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center px-4">
                  <Play className="h-6 w-6 text-muted-foreground/30" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Run your query to see results
                  </p>
                </div>
              ) : isRunning ? (
                /* ── Running state ── */
                <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Running…
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
                      <button
                        onClick={handleDownloadCSV}
                        className="flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-colors"
                        title="Download as CSV"
                      >
                        <Download className="h-3 w-3" />
                        CSV
                      </button>
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
