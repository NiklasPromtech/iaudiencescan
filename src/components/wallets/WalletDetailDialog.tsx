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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ExternalLink, Coins, Layers, DollarSign, Clock, RefreshCw, Loader2, ChevronDown, History, Route } from "lucide-react";
import { fetchWalletBalances, enrichWallets, WalletBalanceResponse } from "@/lib/api";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { WalletJourneyTab } from "./WalletJourneyTab";

interface WalletDetailDialogProps {
  walletAddress: string | null;
  websiteId: string;
  onOpenChange: (open: boolean) => void;
}

export function WalletDetailDialog({ walletAddress, websiteId, onOpenChange }: WalletDetailDialogProps) {
  const [data, setData] = useState<WalletBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("balances");

  const loadBalances = useCallback(() => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    fetchWalletBalances(walletAddress, websiteId)
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [walletAddress, websiteId]);

  useEffect(() => {
    if (!walletAddress) {
      setData(null);
      setError(null);
      setHistoryOpen(false);
      setActiveTab("balances");
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

  const latestEnrichment = data?.enrichments?.[0] ?? null;
  const allTokens = latestEnrichment?.tokens?.filter((t) => t.is_spam !== "true") ?? [];
  const tokens = allTokens.filter((t) => parseFloat(t.quote_usd || "0") >= 1);
  const dustCount = allTokens.length - tokens.length;
  const totalUsd = latestEnrichment?.total_balance_usd ?? 0;
  const tokenCount = latestEnrichment?.token_count ?? allTokens.length;
  const uniqueChains = new Set(tokens.map((t) => t.chain_name)).size;

  const transferDates = allTokens
    .map((t) => t.last_transferred_at)
    .filter(Boolean)
    .map((d) => new Date(d!).getTime());
  const firstTransfer = transferDates.length ? new Date(Math.min(...transferDates)) : null;
  const lastTransfer = transferDates.length ? new Date(Math.max(...transferDates)) : null;

  const sorted = [...tokens].sort(
    (a, b) => parseFloat(b.quote_usd || "0") - parseFloat(a.quote_usd || "0")
  );

  const hasJourney = !!data?.journey;

  return (
    <Dialog open={!!walletAddress} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col top-[5%] translate-y-0 data-[state=open]:slide-in-from-top-2">
        <DialogHeader>
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
        </DialogHeader>

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-destructive text-sm">{error}</div>
        )}

        {!loading && !error && (tokens.length > 0 || hasJourney) && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
            <TabsList className="w-fit">
              <TabsTrigger value="balances" className="text-xs gap-1.5">
                <Coins className="h-3 w-3" /> Balances
              </TabsTrigger>
              {hasJourney && (
                <TabsTrigger value="journey" className="text-xs gap-1.5">
                  <Route className="h-3 w-3" /> Journey
                  <Badge variant="secondary" className="text-[9px] py-0 px-1 ml-0.5">
                    {data!.journey!.total_sessions}
                  </Badge>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="balances" className="flex flex-col flex-1 min-h-0 mt-3">
              {/* Compact stats row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs border-b border-border pb-2 mb-1">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Balance (USD):</span>
                  <span className="font-mono font-semibold">{formatUsd(totalUsd, true)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Tokens:</span>
                  <span className="font-mono font-semibold">{tokenCount}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Chains:</span>
                  <span className="font-mono font-semibold">{uniqueChains}</span>
                </span>
                {firstTransfer && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">First:</span>
                    <span className="font-mono font-semibold">{formatDistanceToNow(firstTransfer, { addSuffix: true })}</span>
                  </span>
                )}
                {lastTransfer && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Last:</span>
                    <span className="font-mono font-semibold">{formatDistanceToNow(lastTransfer, { addSuffix: true })}</span>
                  </span>
                )}
              </div>

              {/* Enrichment history collapsible */}
              {data && data.enrichments.length > 1 && (
                <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1">
                      <History className="h-3 w-3" />
                      <span>{data.enrichment_count} enrichments</span>
                      <ChevronDown className={`h-3 w-3 transition-transform ${historyOpen ? "rotate-180" : ""}`} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border border-border rounded-sm mb-2 max-h-32 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="text-left px-3 py-1.5 font-medium">Enriched At</th>
                            <th className="text-right px-3 py-1.5 font-medium">Balance</th>
                            <th className="text-right px-3 py-1.5 font-medium">Tokens</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.enrichments.map((e, i) => (
                            <tr key={e.enriched_at} className={`border-b border-border last:border-0 ${i === 0 ? "bg-muted/30" : ""}`}>
                              <td className="px-3 py-1.5 font-mono">
                                {format(new Date(e.enriched_at), "MMM d, HH:mm")}
                                {i === 0 && <Badge variant="outline" className="ml-2 text-[10px] py-0 px-1">latest</Badge>}
                              </td>
                              <td className="text-right px-3 py-1.5 font-mono tabular-nums">
                                {formatUsd(e.total_balance_usd, true)}
                              </td>
                              <td className="text-right px-3 py-1.5 font-mono tabular-nums">
                                {e.token_count}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReEnrich}
                      disabled={enriching}
                      className="h-6 text-[11px] text-muted-foreground hover:text-foreground px-2 mb-1"
                    >
                      {enriching ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      Re-enrich wallet
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Balances table */}
              {tokens.length > 0 ? (
                <div className="overflow-y-auto flex-1 -mx-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-8 text-xs">Token</TableHead>
                        <TableHead className="h-8 text-xs">Chain</TableHead>
                        <TableHead className="h-8 text-xs text-right">Balance</TableHead>
                        <TableHead className="h-8 text-xs text-right">Price</TableHead>
                        <TableHead className="h-8 text-xs text-right">Value</TableHead>
                        <TableHead className="h-8 text-xs text-right">Last Transfer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sorted.map((row, i) => (
                        <TableRow key={`${row.contract_address}-${row.chain_name}-${i}`}>
                          <TableCell className="py-1.5">
                            <div className="flex items-center gap-1.5">
                              {row.logo_url && (
                                <img
                                  src={row.logo_url}
                                  alt=""
                                  className="h-4 w-4 rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              )}
                              <span className="font-medium text-xs">{row.contract_ticker}</span>
                              <span className="text-muted-foreground text-[11px] hidden sm:inline truncate max-w-[120px]">
                                {row.contract_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-1.5">
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 whitespace-nowrap">
                              {row.chain_display_name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-xs py-1.5">
                            {formatBalance(row.balance)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-xs tabular-nums py-1.5">
                            {row.quote_rate_usd ? formatUsd(parseFloat(row.quote_rate_usd)) : "—"}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums text-xs py-1.5">
                            {formatUsd(parseFloat(row.quote_usd || "0"))}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-xs whitespace-nowrap py-1.5">
                            {row.last_transferred_at
                              ? formatDistanceToNow(new Date(row.last_transferred_at), { addSuffix: true })
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No token balances found for this wallet
                </div>
              )}
              {dustCount > 0 && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  {dustCount} token{dustCount > 1 ? "s" : ""} under $1 hidden
                </p>
              )}
            </TabsContent>

            {hasJourney && (
              <TabsContent value="journey" className="overflow-y-auto flex-1 mt-3">
                <WalletJourneyTab journey={data!.journey!} />
              </TabsContent>
            )}
          </Tabs>
        )}

        {!loading && !error && tokens.length === 0 && !hasJourney && walletAddress && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No token balances found for this wallet
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
