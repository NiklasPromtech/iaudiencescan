import { useState, useEffect, useCallback } from "react";
import { WalletRow, WalletListRequest, fetchWallets, RangeConfig } from "@/lib/api";
import { WalletTable } from "./WalletTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Loader2 } from "lucide-react";

interface WalletSelectorProps {
  websiteId: string;
  selectedWallets: string[];
  onSelectionChange: (wallets: string[]) => void;
}

const WALLET_TYPES = ["connected", "staked", "purchased", "signed"];
const PAGE_SIZE = 50;

export function WalletSelector({
  websiteId,
  selectedWallets,
  onSelectionChange,
}: WalletSelectorProps) {
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"last_seen" | "first_seen" | "visit_count">("last_seen");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [offset, setOffset] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadWallets = useCallback(async (append = false) => {
    if (!websiteId) return;

    setLoading(true);
    try {
      const range: RangeConfig = {
        type: "last_full_days",
        days: 90,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const request: WalletListRequest = {
        tag_id: websiteId,
        range,
        sort_by: sortBy,
        sort_dir: sortDir,
        limit: PAGE_SIZE,
        offset: append ? offset : 0,
      };

      if (debouncedSearch) {
        request.search = debouncedSearch;
      }

      if (types.length > 0) {
        request.types = types;
      }

      const response = await fetchWallets(request);
      
      if (append) {
        setWallets(prev => [...prev, ...response.rows]);
      } else {
        setWallets(response.rows);
      }
      
      setTotalRows(response.pagination.total_rows);
      setHasMore(response.pagination.offset + response.rows.length < response.pagination.total_rows);
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    } finally {
      setLoading(false);
    }
  }, [websiteId, debouncedSearch, types, sortBy, sortDir, offset]);

  // Initial load and filter changes
  useEffect(() => {
    setOffset(0);
    loadWallets(false);
  }, [websiteId, debouncedSearch, types, sortBy, sortDir]);

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    loadWallets(true);
  };

  const handleTypeToggle = (type: string) => {
    setTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[120px]">
              Type {types.length > 0 && `(${types.length})`}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            {WALLET_TYPES.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={types.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_seen">Last Seen</SelectItem>
            <SelectItem value="first_seen">First Seen</SelectItem>
            <SelectItem value="visit_count">Visits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Selected: {selectedWallets.length} wallets</span>
        <span>
          Showing {wallets.length} of {totalRows}
        </span>
      </div>

      <WalletTable
        wallets={wallets}
        selectedWallets={selectedWallets}
        onSelectionChange={onSelectionChange}
        loading={loading && wallets.length === 0}
      />

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
