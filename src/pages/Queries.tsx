import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Star, Search, ChevronDown, Plus, Database, AlertCircle, Trash2, LayoutGrid, Clock, Check, Minus, Lock, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQueries } from "@/hooks/use-queries";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { formatDistanceToNow } from "date-fns";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";

type SortField = "Updated date" | "Name";
type SortDir = "Descending" | "Ascending";

export default function Queries() {
  const navigate = useNavigate();
  const { selectedWebsite } = useSelectedWebsite();
  const { queries, loading, error, createQuery, updateQuery, deleteQuery } = useQueries(selectedWebsite?.id);
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("Updated date");
  const [sortDir, setSortDir] = useState<SortDir>("Descending");
  const [creating, setCreating] = useState(false);
  const [scheduledQueryIds, setScheduledQueryIds] = useState<Set<string>>(new Set());

  // Fetch which queries have active schedules
  useEffect(() => {
    if (!queries.length) return;
    const fetchSchedules = async () => {
      try {
        const queryIds = queries.map((q) => q.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: err } = await (supabase as any)
          .from("scheduled_reports")
          .select("query_id")
          .in("query_id", queryIds)
          .eq("enabled", true);
        if (!err && data) {
          setScheduledQueryIds(new Set(data.map((r: { query_id: string }) => r.query_id)));
        }
      } catch (_e) {
        // scheduled_reports table may not exist yet — ignore
      }
    };
    fetchSchedules();
  }, [queries]);

  const handleNewQuery = async () => {
    setCreating(true);
    try {
      const q = await createQuery("New query", "");
      navigate(`/queries/${q.id}`);
    } catch (err) {
      setCreating(false);
      toast({
        title: "Couldn't create query",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStar = async (e: React.MouseEvent, id: string, current: boolean) => {
    e.stopPropagation();
    await updateQuery(id, { starred: !current });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteQuery(id);
      toast({ title: "Query deleted" });
    } catch (err) {
      toast({
        title: "Couldn't delete query",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const filtered = queries
    .filter((q) => q.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "Name") {
        const cmp = a.name.localeCompare(b.name);
        return sortDir === "Ascending" ? cmp : -cmp;
      }
      // "Updated date" — DB already returns DESC; for ascending flip
      if (sortDir === "Ascending") {
        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      }
      return 0; // DB order is already descending
    });

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Page header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <h1 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
            Queries
          </h1>
          <Button
            onClick={handleNewQuery}
            disabled={creating}
            className="rounded-none h-8 px-3 text-xs font-mono uppercase tracking-widest gap-1.5"
          >
            <Plus className="h-3 w-3" />
            {creating ? "Creating..." : "New query"}
          </Button>
        </div>

        {/* Toolbar */}
        <div className="border-b border-border px-6 py-3 flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queries..."
              className="pl-8 h-8 rounded-none text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Sort by:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-none h-8 px-3 text-xs font-mono gap-1.5"
                >
                  {sortField}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none" align="end">
                <DropdownMenuItem
                  className="font-mono text-xs"
                  onClick={() => setSortField("Updated date")}
                >
                  Updated date
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-mono text-xs"
                  onClick={() => setSortField("Name")}
                >
                  Name
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-none h-8 px-3 text-xs font-mono gap-1.5"
                >
                  {sortDir}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none" align="end">
                <DropdownMenuItem
                  className="font-mono text-xs"
                  onClick={() => setSortDir("Descending")}
                >
                  Descending
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-mono text-xs"
                  onClick={() => setSortDir("Ascending")}
                >
                  Ascending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Query rows */}
        <div className="flex-1 overflow-auto">
          {/* Column headers */}
          {!loading && !error && filtered.length > 0 && (
            <div className="flex items-center gap-4 px-6 py-2 border-b border-border bg-muted/20">
              <div className="w-4 shrink-0" /> {/* icon spacer */}
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Name</span>
              </div>
              <div className="w-16 text-center shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Dashboard</span>
              </div>
              <div className="w-16 text-center shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Schedule</span>
              </div>
              <div className="w-16 text-center shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Starred</span>
              </div>
              <div className="w-8 shrink-0" /> {/* delete spacer */}
            </div>
          )}

          {loading ? (
            /* Loading skeletons */
            <div className="flex flex-col">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 border-b border-border"
                >
                  <Skeleton className="h-4 w-4 shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-56" />
                    <Skeleton className="h-2.5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-4 shrink-0" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-6 py-16 flex flex-col items-center gap-3">
              <AlertCircle className="h-8 w-8 text-muted-foreground/30" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Queries unavailable
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/60 max-w-xs text-center">
                The query storage isn&apos;t set up yet. Run the SQL migration in Supabase to get started.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-16 flex flex-col items-center gap-3">
              <Database className="h-8 w-8 text-muted-foreground/30" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {search ? "No queries match your search" : "No queries yet"}
              </p>
              {!search && (
                <p className="font-mono text-[10px] text-muted-foreground/60">
                  Click &quot;New query&quot; to get started
                </p>
              )}
            </div>
          ) : (
            filtered.map((query) => (
              <div
                key={query.id}
                onClick={() => navigate(`/queries/${query.id}`)}
                className="flex items-center gap-4 px-6 py-4 border-b border-border hover:bg-muted/30 cursor-pointer group transition-colors"
              >
                <Terminal className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-semibold text-foreground truncate">
                    {query.name}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    Modified{" "}
                    {formatDistanceToNow(new Date(query.updated_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {/* Dashboard status */}
                <div className="w-16 flex justify-center shrink-0">
                  {query.on_dashboard ? (
                    <LayoutGrid className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground/30" />
                  )}
                </div>
                {/* Schedule status */}
                <div className="w-16 flex justify-center shrink-0">
                  {scheduledQueryIds.has(query.id) ? (
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-muted-foreground/30" />
                  )}
                </div>
                {/* Starred */}
                <div className="w-16 flex justify-center shrink-0">
                  <button
                    onClick={(e) => handleToggleStar(e, query.id, query.starred)}
                    className="p-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        query.starred && "fill-primary text-primary"
                      )}
                    />
                  </button>
                </div>
                <button
                  onClick={(e) => handleDelete(e, query.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 w-8 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Toaster />
    </DashboardLayout>
  );
}
