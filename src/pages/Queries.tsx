import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Star, Search, ChevronDown, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const mockQueries = [
  {
    id: "1",
    name: "People that deposited into CEX",
    author: "audiencescan",
    updatedAt: "2 hours ago",
    starred: false,
  },
  {
    id: "2",
    name: "All Known EVM CEX Addresses",
    author: "audiencescan",
    updatedAt: "1 day ago",
    starred: true,
  },
  {
    id: "3",
    name: "Wallets holding > 1 ETH with DeFi activity",
    author: "audiencescan",
    updatedAt: "3 days ago",
    starred: false,
  },
  {
    id: "4",
    name: "Token holders that bridge from Ethereum to L2",
    author: "audiencescan",
    updatedAt: "1 week ago",
    starred: false,
  },
];

type SortField = "Updated date" | "Name";
type SortDir = "Descending" | "Ascending";

export default function Queries() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("Updated date");
  const [sortDir, setSortDir] = useState<SortDir>("Descending");
  const [starred, setStarred] = useState<Record<string, boolean>>(
    Object.fromEntries(mockQueries.map((q) => [q.id, q.starred]))
  );

  const filtered = mockQueries
    .filter((q) => q.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "Name") {
        return sortDir === "Ascending"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0; // keep mock order for Updated date
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
            onClick={() => navigate("/queries/new")}
            className="rounded-none h-8 px-3 text-xs font-mono uppercase tracking-widest gap-1.5"
          >
            <Plus className="h-3 w-3" />
            New query
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
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                No queries found
              </p>
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
                    @{query.author} &bull; modified {query.updatedAt}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStarred((prev) => ({ ...prev, [query.id]: !prev[query.id] }));
                  }}
                  className="p-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      starred[query.id] && "fill-primary text-primary"
                    )}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
