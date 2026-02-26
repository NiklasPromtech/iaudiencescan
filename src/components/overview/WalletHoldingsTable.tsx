import { useState, useMemo } from "react";
import { Loader2, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { WalletHoldingItem } from "@/lib/api";

function formatUsd(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

interface WalletHoldingsTableProps {
  data: WalletHoldingItem[];
  loading: boolean;
  hideHeader?: boolean;
}

export const WalletHoldingsTable = ({ data, loading, hideHeader }: WalletHoldingsTableProps) => {
  const [selectedChain, setSelectedChain] = useState("all");

  const filteredByValue = useMemo(
    () => data.filter((item) => item.total_quote_usd > 50).sort((a, b) => b.total_quote_usd - a.total_quote_usd),
    [data]
  );

  const chains = useMemo(() => {
    const map = new Map<string, number>();
    filteredByValue.forEach((item) => {
      map.set(item.chain_display_name, (map.get(item.chain_display_name) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filteredByValue]);

  const displayData = useMemo(
    () => selectedChain === "all" ? filteredByValue : filteredByValue.filter((item) => item.chain_display_name === selectedChain),
    [filteredByValue, selectedChain]
  );

  const showChainColumn = selectedChain === "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-12 text-muted-foreground font-mono text-xs">
        No wallet holdings data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Info className="h-3.5 w-3.5" />
        <span className="font-mono text-[11px]">Filtered to tokens with holdings over $50 USD</span>
      </div>

      {chains.length > 1 && (
        <Tabs value={selectedChain} onValueChange={setSelectedChain}>
          <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="h-7 rounded-full border border-border px-3 py-1 font-mono text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
            >
              All Chains
              <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px] rounded-full">
                {filteredByValue.length}
              </Badge>
            </TabsTrigger>
            {chains.map(([chain, count]) => (
              <TabsTrigger
                key={chain}
                value={chain}
                className="h-7 rounded-full border border-border px-3 py-1 font-mono text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
              >
                {chain}
                <Badge variant="secondary" className="ml-1.5 h-4 px-1.5 text-[10px] rounded-full">
                  {count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-mono text-xs uppercase tracking-widest">Token</TableHead>
            {showChainColumn && (
              <TableHead className="font-mono text-xs uppercase tracking-widest">Chain</TableHead>
            )}
            <TableHead className="font-mono text-xs uppercase tracking-widest text-right">Holders</TableHead>
            <TableHead className="font-mono text-xs uppercase tracking-widest text-right">Total Value (USD)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((item, i) => (
            <TableRow key={`${item.contract_name}-${item.chain_display_name}-${i}`}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {item.logo_url && (
                    <img
                      src={item.logo_url}
                      alt={item.contract_name}
                      className="h-5 w-5 rounded-full"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <span className="font-mono text-xs">{item.contract_name}</span>
                </div>
              </TableCell>
              {showChainColumn && (
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.chain_display_name}
                </TableCell>
              )}
              <TableCell className="font-mono text-xs tabular-nums text-right text-muted-foreground">
                {item.unique_wallets != null ? item.unique_wallets.toLocaleString() : "—"}
              </TableCell>
              <TableCell className="font-mono text-xs tabular-nums text-right">
                {formatUsd(item.total_quote_usd)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
