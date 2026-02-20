import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Play,
  Sparkles,
  ArrowLeft,
  Database,
  Table2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ── Data Explorer tree ────────────────────────────────────────────────────────

const explorerSections = [
  {
    label: "AudienceScan data",
    icon: Database,
    items: [
      "Prices & metadata",
      "DEX trading",
      "Transfers & balances",
      "Labels & identity",
      "Gas & fees",
      "More curated data",
    ],
  },
  {
    label: "My data",
    icon: Table2,
    items: ["Uploads", "Materialized views"],
  },
  {
    label: "Blockchain data",
    icon: Database,
    items: ["Decoded projects", "Raw blockchain data"],
  },
];

const ExplorerSection = ({
  label,
  icon: Icon,
  items,
}: (typeof explorerSections)[0]) => {
  const [open, setOpen] = useState(true);
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
        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-semibold">
          {label}
        </span>
      </button>
      {open && (
        <div className="pb-1">
          {items.map((item) => (
            <button
              key={item}
              className="w-full text-left px-8 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            >
              {item}
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
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split("\n").length;

  const syncScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex border border-border overflow-hidden font-mono text-xs leading-5 flex-1 min-h-0">
      {/* Gutter */}
      <div
        ref={gutterRef}
        className="bg-muted/50 border-r border-border text-muted-foreground select-none overflow-hidden shrink-0 w-10 pt-3 pb-3"
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
        ref={textareaRef}
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
  "Find all wallets that interacted with Uniswap in the last 7 days",
  "Show top 100 wallets by ETH balance",
  "List wallets that deposited into a CEX this month",
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function QueryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [title, setTitle] = useState(isNew ? "New query" : "People that deposited into CEX");
  const [editingTitle, setEditingTitle] = useState(false);
  const [sql, setSql] = useState(isNew ? "" : PLACEHOLDER_SQL);
  const [prompt, setPrompt] = useState("");
  const [hasRun, setHasRun] = useState(false);
  const [explorerSearch, setExplorerSearch] = useState("");

  const handleRun = () => {
    if (!sql.trim()) return;
    setHasRun(true);
  };

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

          {editingTitle ? (
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

          <div className="ml-auto">
            <Button
              onClick={handleRun}
              disabled={!sql.trim()}
              className="rounded-none h-8 px-4 text-xs font-mono uppercase tracking-widest gap-1.5"
            >
              <Play className="h-3 w-3 fill-current" />
              Run
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left — Data Explorer */}
          <div className="w-64 shrink-0 border-r border-border flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border shrink-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Data Explorer
              </p>
            </div>
            <div className="px-2 py-2 border-b border-border shrink-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  placeholder="Search datasets..."
                  className="pl-7 h-7 rounded-none text-[10px] font-mono"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {explorerSections.map((section) => (
                <ExplorerSection key={section.label} {...section} />
              ))}
            </div>
          </div>

          {/* Right — Editor + Results */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* SQL Editor */}
            <div className="flex flex-col p-4 border-b border-border" style={{ height: "55%" }}>
              <SqlEditor value={sql} onChange={setSql} />
            </div>

            {/* Results / Get started */}
            <div className="flex-1 overflow-y-auto p-4">
              {hasRun ? (
                <div className="border border-border">
                  <div className="px-4 py-2 border-b border-border bg-muted/30">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Results — 0 rows
                    </p>
                  </div>
                  <div className="px-6 py-10 text-center">
                    <p className="font-mono text-xs text-muted-foreground">
                      Query executed. No results returned.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 py-8">
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
                      placeholder="Describe what you want to query..."
                      className="rounded-none font-mono text-xs"
                    />
                    <Button
                      className="rounded-none shrink-0 font-mono text-xs uppercase tracking-widest"
                      disabled={!prompt.trim()}
                    >
                      Generate
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
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
