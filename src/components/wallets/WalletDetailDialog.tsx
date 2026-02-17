import { useState, useEffect } from "react";
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
import { ExternalLink, Coins, Layers, DollarSign } from "lucide-react";
import { fetchWalletBalances, WalletBalancesResponse, SUPPORTED_CHAINS } from "@/lib/api";

interface WalletDetailDialogProps {
  walletAddress: string | null;
  onOpenChange: (open: boolean) => void;
}

export function WalletDetailDialog({ walletAddress, onOpenChange }: WalletDetailDialogProps) {
  const [data, setData] = useState<WalletBalancesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchWalletBalances(walletAddress)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [walletAddress]);

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

  const formatTokenBalance = (value: number) => {
    if (value === 0) return "0";
    if (value < 0.0001) return "<0.0001";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const getChainLabel = (chainValue: string) => {
    const chain = SUPPORTED_CHAINS.find((c) => c.value === chainValue);
    return chain?.label || chainValue;
  };

  const truncate = (addr: string) =>
    addr.length <= 12 ? addr : `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Dialog open={!!walletAddress} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
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

        {data && !loading && (
          <>
            {/* Top-line stats */}
            <div className="flex items-center divide-x divide-border border-b border-border pb-3 mb-1">
              {[
                {
                  label: "Total Balance",
                  value: formatUsd(data.total_balance_usd, true),
                  icon: <DollarSign className="h-4 w-4 text-primary" />,
                },
                {
                  label: "Tokens",
                  value: String(data.token_count ?? data.balances.length),
                  icon: <Coins className="h-4 w-4 text-primary" />,
                },
                {
                  label: "Chains",
                  value: String(data.chain_count ?? new Set(data.balances.map((b) => b.chain)).size),
                  icon: <Layers className="h-4 w-4 text-primary" />,
                },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 px-5 first:pl-0">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.balances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No token balances found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.balances
                      .sort((a, b) => b.balance_usd - a.balance_usd)
                      .map((b, i) => (
                        <TableRow key={`${b.contract_address}-${b.chain}-${i}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {b.logo_url && (
                                <img
                                  src={b.logo_url}
                                  alt=""
                                  className="h-5 w-5 rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              )}
                              <span className="font-medium">{b.token_symbol}</span>
                              <span className="text-muted-foreground text-xs hidden sm:inline">
                                {b.token_name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {getChainLabel(b.chain)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono tabular-nums text-sm">
                            {formatTokenBalance(b.balance)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm tabular-nums">
                            {b.price_usd ? formatUsd(b.price_usd) : "—"}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatUsd(b.balance_usd)}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
