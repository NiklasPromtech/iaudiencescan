import { useEffect, useMemo, useState } from "react";
import { Search, Table as TableIcon, BarChart3, LineChart, PieChart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { SavedQuery } from "@/hooks/use-queries";

const DISPLAY_TYPES = [
  { value: "table", label: "Table", Icon: TableIcon },
  { value: "bar_chart", label: "Bar", Icon: BarChart3 },
  { value: "line_chart", label: "Line", Icon: LineChart },
  { value: "pie_chart", label: "Pie", Icon: PieChart },
] as const;

export interface ReplaceWithQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queries: SavedQuery[];
  /** Queries currently pinned to the dashboard — shown as disabled (already used). */
  excludeQueryIds?: string[];
  /** Title shown in the dialog header. Defaults based on mode. */
  title?: string;
  /** Called with the chosen query and display type. */
  onConfirm: (queryId: string, displayType: string) => Promise<void> | void;
}

export function ReplaceWithQueryDialog({
  open,
  onOpenChange,
  queries,
  excludeQueryIds = [],
  title = "Choose a query",
  onConfirm,
}: ReplaceWithQueryDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [displayType, setDisplayType] = useState<string>("table");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedId(null);
      setDisplayType("table");
      setSubmitting(false);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return queries
      .filter((qi) => !q || qi.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [queries, search]);

  const selected = queries.find((q) => q.id === selectedId) ?? null;
  const canConfirm = !!selected && !!displayType && !submitting;

  const handleConfirm = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await onConfirm(selected.id, displayType);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none max-w-2xl p-0 gap-0">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="font-mono text-xs uppercase tracking-widest font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queries…"
              className="h-8 rounded-none pl-8 font-mono text-xs"
            />
          </div>
        </div>

        <ScrollArea className="max-h-[280px]">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                No queries found
              </div>
            ) : (
              filtered.map((q) => {
                const isExcluded = excludeQueryIds.includes(q.id);
                const isSelected = selectedId === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    disabled={isExcluded}
                    onClick={() => {
                      setSelectedId(q.id);
                      // Default display_type to whatever the query already has, falling back to table
                      setDisplayType(q.display_type || "table");
                    }}
                    className={cn(
                      "w-full text-left px-5 py-2.5 flex items-center justify-between gap-3 transition-colors",
                      isExcluded && "opacity-40 cursor-not-allowed",
                      !isExcluded && isSelected && "bg-primary/10",
                      !isExcluded && !isSelected && "hover:bg-muted/40"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-foreground truncate">{q.name}</p>
                      {q.is_system && (
                        <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                          System
                        </p>
                      )}
                    </div>
                    {isExcluded && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground shrink-0">
                        On dashboard
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>

        <div className="px-5 py-4 border-t border-border space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Display as
          </span>
          <div className="grid grid-cols-4 gap-1">
            {DISPLAY_TYPES.map(({ value, label, Icon }) => {
              const active = displayType === value;
              return (
                <button
                  key={value}
                  type="button"
                  disabled={!selected}
                  onClick={() => setDisplayType(value)}
                  className={cn(
                    "font-mono text-[10px] py-2 border border-border flex flex-col items-center gap-1 transition-colors uppercase tracking-widest",
                    !selected && "opacity-40 cursor-not-allowed",
                    selected && active && "bg-primary text-primary-foreground border-primary",
                    selected && !active && "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="px-5 py-3 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-none h-8 text-[10px] font-mono uppercase tracking-widest"
          >
            Cancel
          </Button>
          <Button
            disabled={!canConfirm}
            onClick={handleConfirm}
            className="rounded-none h-8 text-[10px] font-mono uppercase tracking-widest"
          >
            {submitting ? "Saving…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
