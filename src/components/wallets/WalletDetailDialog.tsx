import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, Coins, Layers, DollarSign, Clock, RefreshCw, Loader2 } from "lucide-react";
import { fetchWalletBalances, enrichWallets, WalletBalanceRow } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface WalletDetailDialogProps {
  walletAddress: string | null;
  websiteId: string;
  onOpenChange: (open: boolean) => void;
}

export function WalletDetailDialog({ walletAddress, websiteId, onOpenChange }: WalletDetailDialogProps) {
  const [rows, setRows] = useState<WalletBalanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBalances = useCallback(() => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    fetchWalletBalances(walletAddress, websiteId)
      .then((data) => setRows(data.filter((r) => r.is_spam !== "true")))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [walletAddress, websiteId]);

  useEffect(() => {
    if (!walletAddress) {
      setRows([]);
      setError(null);
      return;
    }
    loadBalances();
  }, [walletAddress, loadBalances]);

  const handleReEnrich = async () => {
    if (!walletAddress) return;
    setEnriching(true);
    try {
      const res = await enrichWallets({ tag_id: websiteId, wallets: walletAddress });
      if (res.success && res.queued > 0) {
        toast.success("Re-enrichment queued — data will refresh shortly.");
      } else if (res.already_queued > 0) {
        toast.info("Already in the enrichment queue.");
      } else {
        toast.error("Could not queue for enrichment.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to enrich");
    } finally {
      setEnriching(false);
    }
  };

  const formatUsd = (value: number, compact = false) => {
    if (compact && Math.abs(value) >= 1_000_000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatBalance = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num === 0) return "0";
    if (num < 0.0001) return "<0.0001";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(num);
  };

  const truncate = (addr: string) =>
    addr.length <= 12 ? addr : `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Derived stats
  const totalUsd = rows.reduce((sum, r) => sum + parseFloat(r.quote_usd || "0"), 0);
  const uniqueChains = new Set(rows.map((r) => r.chain_name)).size;
  const tokenCount = rows.length;

  // First / last transfer across all rows
  const transferDates = rows
    .map((r) => r.last_transferred_at)
    .filter(Boolean)
    .map((d) => new Date(d!).getTime());
  const firstTransfer = transferDates.length ? new Date(Math.min(...transferDates)) : null;
  const lastTransfer = transferDates.length ? new Date(Math.max(...transferDates)) : null;

  // Sort by value descending
  const sorted = [...rows].sort(
    (a, b) => parseFloat(b.quote_usd || "0") - parseFloat(a.quote_usd || "0")
  );

  return (
    <Dialog open={!!walletAddress} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 font-mono text-sm">
              {walletAddress && truncate(walletAddress)}
              {walletAddress && (
                <a
                  href={`https://etherscan.io/address/${walletAddress}#asset-multichain`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReEnrich}
              disabled={enriching}
              className="h-7 text-xs mr-6"
            >
              {enriching ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Re-enrich
            </Button>
          </div>
        </DialogHeader>

        {loading && (
          <div className="space-y-4">
            <div className="flex gap-6">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-24" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-destructive text-sm">{error}</div>
        )}

        {!loading && !error && rows.length > 0 && (
          <>
            {/* Top-line stats */}
            <div className="flex flex-wrap items-center divide-x divide-border border-b border-border pb-3 mb-1">
              {[
                {
                  label: "Total Balance",
                  value: formatUsd(totalUsd, true),
                  icon: <DollarSign className="h-4 w-4 text-primary" />,
                },
                {
                  label: "Tokens",
                  value: String(tokenCount),
                  icon: <Coins className="h-4 w-4 text-primary" />,
                },
                {
                  label: "Chains",
                  value: String(uniqueChains),
                  icon: <Layers className="h-4 w-4 text-primary" />,
                },
                ...(firstTransfer
                  ? [
                      {
                        label: "First Transfer",
                        value: formatDistanceToNow(firstTransfer, { addSuffix: true }),
                        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                      },
                    ]
                  : []),
                ...(lastTransfer
                  ? [
                      {
                        label: "Last Transfer",
                        value: formatDistanceToNow(lastTransfer, { addSuffix: true }),
                        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                      },
                    ]
                  : []),
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 px-5 first:pl-0 py-1">
                  {stat.icon}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="font-mono text-lg font-bold tabular-nums">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Balances table */}
            <div className="overflow-y-auto flex-1 -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Chain</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Last Transfer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((row, i) => (
                    <TableRow key={`${row.contract_address}-${row.chain_name}-${i}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.logo_url && (
                            <img
                              src={row.logo_url}
                              alt=""
                              className="h-5 w-5 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                          <span className="font-medium">{row.contract_ticker}</span>
                          <span className="text-muted-foreground text-xs hidden sm:inline truncate max-w-[140px]">
                            {row.contract_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {row.chain_display_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm">
                        {formatBalance(row.balance)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm tabular-nums">
                        {row.quote_rate_usd ? formatUsd(parseFloat(row.quote_rate_usd)) : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatUsd(parseFloat(row.quote_usd || "0"))}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                        {row.last_transferred_at
                          ? formatDistanceToNow(new Date(row.last_transferred_at), { addSuffix: true })
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {!loading && !error && rows.length === 0 && walletAddress && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No token balances found for this wallet
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
