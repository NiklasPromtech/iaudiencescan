import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Wallet,
  DollarSign,
  Users,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Link as LinkIcon,
} from "lucide-react";
import { fetchWallets, enrichWallets, WalletRow, WalletSummary, SUPPORTED_CHAINS } from "@/lib/api";
import { formatDistanceToNow, format, subDays, startOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { DateRangePicker, DateRangeValue } from "@/components/overview/DateRangePicker";

const PAGE_SIZE = 50;

export default function Wallets() {
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"total_balance_usd" | "last_seen" | "visit_count">("total_balance_usd");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [minBalance, setMinBalance] = useState<string>("");
  const [maxBalance, setMaxBalance] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeValue>({ type: "preset", days: 0, includeToday: true });
  const [enrichingWallets, setEnrichingWallets] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleEnrichWallet = async (walletId: string) => {
    const storedWebsite = localStorage.getItem("selectedWebsite");
    if (!storedWebsite) return;

    const website = JSON.parse(storedWebsite);
    setEnrichingWallets(prev => new Set(prev).add(walletId));

    try {
      const response = await enrichWallets({
        tag_id: website.id,
        wallets: walletId,
      });

      if (response.success && response.queued > 0) {
        toast({
          title: "Enrichment queued",
          description: "Wallet data will be enriched shortly.",
        });
      } else if (response.already_queued > 0) {
        toast({
          title: "Already queued",
          description: "This wallet is already in the enrichment queue.",
        });
      } else {
        toast({
          title: "Enrichment failed",
          description: "Could not queue wallet for enrichment.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to enrich wallet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enrich wallet",
        variant: "destructive",
      });
    } finally {
      setEnrichingWallets(prev => {
        const next = new Set(prev);
        next.delete(walletId);
        return next;
      });
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadWallets = useCallback(async () => {
    const storedWebsite = localStorage.getItem("selectedWebsite");
    if (!storedWebsite) return;

    const website = JSON.parse(storedWebsite);
    setLoading(true);

    try {
      const balanceFilter: { min?: number; max?: number } = {};
      if (minBalance) balanceFilter.min = parseFloat(minBalance);
      if (maxBalance) balanceFilter.max = parseFloat(maxBalance);

      // Build range config based on dateRange state
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const today = startOfDay(new Date());
      
      let rangeConfig: any;
      
      if (dateRange.includeToday || dateRange.days === 0) {
        // For "Today" or when includeToday is true, use custom format with explicit dates
        const fromDate = dateRange.days ? subDays(today, dateRange.days) : today;
        rangeConfig = {
          type: "custom",
          from: format(fromDate, "yyyy-MM-dd"),
          to: format(today, "yyyy-MM-dd"),
          timezone,
        };
      } else {
        // For standard presets without today, use last_full_days
        rangeConfig = {
          type: "last_full_days",
          days: dateRange.days || 7,
          timezone,
        };
      }

      const response = await fetchWallets({
        tag_id: website.id,
        range: rangeConfig,
        search: debouncedSearch || undefined,
        balance: Object.keys(balanceFilter).length > 0 ? balanceFilter : undefined,
        sort_by: sortBy,
        sort_dir: sortDir,
        limit: PAGE_SIZE,
        offset: currentPage * PAGE_SIZE,
      });

      setWallets(response.rows);
      setSummary(response.summary || null);
      setTotalRows(response.pagination.total_rows);
    } catch (error) {
      console.error("Failed to load wallets:", error);
      toast({
        title: "Error loading wallets",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, sortDir, minBalance, maxBalance, currentPage, dateRange, toast]);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: number | null | undefined) => {
    if (balance === null || balance === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  const getChainLabel = (chainValue: string) => {
    const chain = SUPPORTED_CHAINS.find(c => c.value === chainValue);
    return chain?.label || chainValue;
  };

  const totalPages = Math.ceil(totalRows / PAGE_SIZE);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
    setCurrentPage(0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet Data</h1>
          <p className="text-muted-foreground">
            View and analyze wallet addresses collected from your website visitors
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading && !summary ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  {summary?.total_wallets.toLocaleString() || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading && !summary ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatBalance(summary?.total_balance_usd)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zero Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading && !summary ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {summary?.wallets_with_zero_balance.toLocaleString() || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Enriched with $0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Enriched</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading && !summary ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {summary?.wallets_not_enriched.toLocaleString() || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Pending enrichment</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Date Range</label>
                <DateRangePicker
                  value={dateRange}
                  onChange={(value) => {
                    setDateRange(value);
                    setCurrentPage(0);
                  }}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-1.5 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by wallet address..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="w-32">
                <label className="text-sm font-medium mb-1.5 block">Min Balance</label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={minBalance}
                  onChange={(e) => {
                    setMinBalance(e.target.value);
                    setCurrentPage(0);
                  }}
                />
              </div>

              <div className="w-32">
                <label className="text-sm font-medium mb-1.5 block">Max Balance</label>
                <Input
                  type="number"
                  placeholder="No max"
                  value={maxBalance}
                  onChange={(e) => {
                    setMaxBalance(e.target.value);
                    setCurrentPage(0);
                  }}
                />
              </div>

              <div className="w-40">
                <label className="text-sm font-medium mb-1.5 block">Sort By</label>
                <Select value={sortBy} onValueChange={(v) => handleSort(v as typeof sortBy)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total_balance_usd">Balance</SelectItem>
                    <SelectItem value="last_seen">Last Seen</SelectItem>
                    <SelectItem value="visit_count">Visits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Types</TableHead>
                  <TableHead>Chains</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                  <TableHead className="text-right">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : wallets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No wallets found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  wallets.map((wallet) => (
                    <TableRow key={wallet.wallet_id}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          {truncateAddress(wallet.wallet_id)}
                          <a
                            href={`https://etherscan.io/address/${wallet.wallet_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <LinkIcon className="h-3 w-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {wallet.types.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {wallet.chains?.map((chain) => (
                            <Badge key={chain} variant="outline" className="text-xs">
                              {getChainLabel(chain)}
                            </Badge>
                          )) || <span className="text-muted-foreground text-sm">—</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {wallet.total_balance_usd === null || wallet.total_balance_usd === undefined ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEnrichWallet(wallet.wallet_id)}
                            disabled={enrichingWallets.has(wallet.wallet_id)}
                            className="h-7 text-xs"
                          >
                            {enrichingWallets.has(wallet.wallet_id) ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <RefreshCw className="h-3 w-3 mr-1" />
                            )}
                            Enrich
                          </Button>
                        ) : (
                          formatBalance(wallet.total_balance_usd)
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {wallet.visit_count}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(wallet.last_seen), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {currentPage * PAGE_SIZE + 1}-{Math.min((currentPage + 1) * PAGE_SIZE, totalRows)} of {totalRows.toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
