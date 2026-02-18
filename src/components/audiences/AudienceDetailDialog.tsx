import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Audience,
  SUPPORTED_CHAINS,
  SupportedChain,
  createScan,
  fetchWallets,
  WalletRow,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import {
  Search,
  Users,
  Loader2,
  ExternalLink,
  Filter,
  AlertCircle,
  DollarSign,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AudienceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience: Audience | null;
  onScanSuccess: (scanId: string) => void;
}

// Chain display labels
const CHAIN_LABELS: Record<string, string> = {
  "eth-mainnet": "ETH",
  "matic-mainnet": "MATIC",
  "bsc-mainnet": "BSC",
  "arbitrum-mainnet": "ARB",
  "optimism-mainnet": "OP",
  "avalanche-mainnet": "AVAX",
  "base-mainnet": "BASE",
  "solana-mainnet": "SOL",
};

export function AudienceDetailDialog({
  open,
  onOpenChange,
  audience,
  onScanSuccess,
}: AudienceDetailDialogProps) {
  const { toast } = useToast();
  const { selectedWebsite } = useSelectedWebsite();
  const [search, setSearch] = useState("");
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(new Set());
  const [scanChain, setScanChain] = useState<SupportedChain | "">("");
  const [loading, setLoading] = useState(false);
  const [walletDataLoading, setWalletDataLoading] = useState(false);
  const [walletData, setWalletData] = useState<Map<string, WalletRow>>(new Map());

  // Filters
  const [filterChain, setFilterChain] = useState<string>("all");
  const [filterMinBalance, setFilterMinBalance] = useState<string>("");
  const [filterEnriched, setFilterEnriched] = useState<string>("all");

  // Reset state when dialog opens
  useEffect(() => {
    if (open && audience) {
      setSearch("");
      setSelectedWallets(new Set());
      setScanChain("");
      setFilterChain("all");
      setFilterMinBalance("");
      setFilterEnriched("all");
      fetchWalletData();
    }
  }, [open, audience?.id]);

  const fetchWalletData = async () => {
    if (!audience || !selectedWebsite?.tag_id) return;

    setWalletDataLoading(true);
    try {
      // Fetch wallet data for all audience wallets
      const response = await fetchWallets({
        tag_id: selectedWebsite.tag_id,
        range: {
          type: "custom",
          from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          to: new Date().toISOString().split("T")[0],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        search: undefined, // Get all
        limit: 1000,
      });

      // Map wallet addresses to their data
      const dataMap = new Map<string, WalletRow>();
      response.rows.forEach((row) => {
        const lowerWalletId = row.wallet_id.toLowerCase();
        if (audience.wallets.some((w) => w.toLowerCase() === lowerWalletId)) {
          dataMap.set(lowerWalletId, row);
        }
      });
      setWalletData(dataMap);
    } catch (err) {
      console.error("Failed to fetch wallet data:", err);
      toast({
        title: "Failed to load wallet data",
        description: "Showing addresses only",
        variant: "destructive",
      });
    } finally {
      setWalletDataLoading(false);
    }
  };

  // Get unique chains from wallet data
  const availableChains = useMemo(() => {
    const chains = new Set<string>();
    walletData.forEach((wallet) => {
      wallet.chains?.forEach((chain) => chains.add(chain));
    });
    return Array.from(chains).sort();
  }, [walletData]);

  // Apply filters
  const filteredWallets = useMemo(() => {
    const wallets = audience?.wallets || [];

    return wallets.filter((wallet) => {
      const lowerWallet = wallet.toLowerCase();

      // Search filter
      if (search && !lowerWallet.includes(search.toLowerCase())) {
        return false;
      }

      const data = walletData.get(lowerWallet);

      // Chain filter
      if (filterChain !== "all") {
        if (!data?.chains?.includes(filterChain)) {
          return false;
        }
      }

      // Balance filter
      if (filterMinBalance) {
        const minBal = parseFloat(filterMinBalance);
        if (!isNaN(minBal)) {
          if (!data?.total_balance_usd || data.total_balance_usd < minBal) {
            return false;
          }
        }
      }

      // Enrichment filter
      if (filterEnriched !== "all") {
        if (filterEnriched === "enriched") {
          if (data?.enrichment_status !== "completed") return false;
        } else if (filterEnriched === "not_enriched") {
          if (data?.enrichment_status === "completed") return false;
        } else if (filterEnriched === "has_balance") {
          if (!data?.total_balance_usd || data.total_balance_usd <= 0) return false;
        }
      }

      return true;
    });
  }, [audience?.wallets, search, walletData, filterChain, filterMinBalance, filterEnriched]);

  const handleToggleWallet = (wallet: string) => {
    setSelectedWallets((prev) => {
      const next = new Set(prev);
      if (next.has(wallet)) {
        next.delete(wallet);
      } else {
        next.add(wallet);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedWallets.size === filteredWallets.length) {
      setSelectedWallets(new Set());
    } else {
      setSelectedWallets(new Set(filteredWallets));
    }
  };

  const walletsToScan =
    selectedWallets.size > 0 ? Array.from(selectedWallets) : filteredWallets;

  const handleStartScan = async () => {
    if (!audience) return;

    setLoading(true);
    try {
      const response = await createScan({
        wallets: walletsToScan,
        chain: scanChain as SupportedChain,
        name: `Scan from "${audience.name}"${selectedWallets.size > 0 ? ` (${selectedWallets.size} selected)` : ""}`,
        audience_id: audience.id,
        website_id: audience.website_id,
      });

      toast({
        title: "Scan started",
        description: `Scanning ${walletsToScan.length} wallets on ${SUPPORTED_CHAINS.find((c) => c.value === scanChain)?.label}`,
      });

      onScanSuccess(response.scan_id);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create scan:", err);
      toast({
        title: "Failed to start scan",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatBalance = (balance: number | null | undefined) => {
    if (balance === null || balance === undefined) return null;
    if (balance === 0) return "$0";
    if (balance < 1) return `$${balance.toFixed(2)}`;
    if (balance < 1000) return `$${balance.toFixed(0)}`;
    if (balance < 1000000) return `$${(balance / 1000).toFixed(1)}k`;
    return `$${(balance / 1000000).toFixed(1)}M`;
  };

  const hasActiveFilters = filterChain !== "all" || filterMinBalance || filterEnriched !== "all";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {audience?.name}
          </DialogTitle>
          <DialogDescription>
            {audience?.wallet_count} wallets · Created{" "}
            {audience && formatDistanceToNow(new Date(audience.created_at), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wallets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>

            <Select value={filterChain} onValueChange={setFilterChain}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All chains</SelectItem>
                {availableChains.map((chain) => (
                  <SelectItem key={chain} value={chain}>
                    {CHAIN_LABELS[chain] || chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Min bal"
                value={filterMinBalance}
                onChange={(e) => setFilterMinBalance(e.target.value)}
                className="w-24 h-8 text-xs"
              />
            </div>

            <Select value={filterEnriched} onValueChange={setFilterEnriched}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All wallets</SelectItem>
                <SelectItem value="enriched">Enriched only</SelectItem>
                <SelectItem value="not_enriched">Not enriched</SelectItem>
                <SelectItem value="has_balance">Has balance</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setFilterChain("all");
                  setFilterMinBalance("");
                  setFilterEnriched("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Selection Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {hasActiveFilters ? (
                <>
                  <span className="font-medium text-foreground">{filteredWallets.length}</span> of{" "}
                  {audience?.wallet_count} match filters
                </>
              ) : (
                <>
                  <span className="font-medium text-foreground">{filteredWallets.length}</span> wallets
                </>
              )}
              {selectedWallets.size > 0 && (
                <span className="ml-2 text-primary">
                  ({selectedWallets.size} selected)
                </span>
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="h-7 text-xs"
            >
              {selectedWallets.size === filteredWallets.length && filteredWallets.length > 0
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          {/* Wallet List */}
          <ScrollArea className="h-[340px] border border-border rounded-md">
            <div className="p-2 space-y-1">
              {walletDataLoading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </div>
                  ))}
                </>
              ) : filteredWallets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  {hasActiveFilters
                    ? "No wallets match your filters"
                    : search
                      ? "No wallets match your search"
                      : "No wallets in this group"}
                </div>
              ) : (
                filteredWallets.map((wallet) => {
                  const data = walletData.get(wallet.toLowerCase());
                  return (
                    <label
                      key={wallet}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedWallets.has(wallet)}
                        onCheckedChange={() => handleToggleWallet(wallet)}
                      />
                      <code className="text-sm font-mono text-foreground">
                        {truncateAddress(wallet)}
                      </code>

                      {/* Wallet data columns */}
                      <div className="flex-1 flex items-center gap-4 justify-end">
                        {/* Chain badges */}
                        {data?.chains && data.chains.length > 0 && (
                          <div className="flex gap-1">
                            {data.chains.slice(0, 3).map((chain) => (
                              <Badge
                                key={chain}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {CHAIN_LABELS[chain] || chain}
                              </Badge>
                            ))}
                            {data.chains.length > 3 && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                +{data.chains.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Balance */}
                        {data?.enrichment_status === "completed" ? (
                          <span
                            className={`text-sm font-medium min-w-[60px] text-right ${
                              data.total_balance_usd && data.total_balance_usd > 0
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatBalance(data.total_balance_usd)}
                          </span>
                        ) : data?.enrichment_status === "failed" ? (
                          <span className="text-xs text-destructive min-w-[60px] text-right">
                            Failed
                          </span>
                        ) : data?.enrichment_status === "pending" ||
                          data?.enrichment_status === "processing" ? (
                          <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                            <Activity className="h-3 w-3 inline animate-pulse" /> Pending
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                            –
                          </span>
                        )}

                        {/* External link */}
                        <a
                          href={`https://etherscan.io/address/${wallet}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Scan Chain Selection */}
          <div className="flex items-center gap-3 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Scan on:</span>
            <Select value={scanChain || undefined} onValueChange={(v) => setScanChain(v as SupportedChain)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Will scan{" "}
            <Badge variant="secondary" className="font-mono">
              {walletsToScan.length}
            </Badge>{" "}
            wallets
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartScan} disabled={loading || walletsToScan.length === 0 || !scanChain}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find More Users
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
