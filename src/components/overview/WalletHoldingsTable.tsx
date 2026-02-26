import { useState, useMemo, useEffect, useCallback } from "react";
import { Loader2, Info, ShieldCheck, List } from "lucide-react";
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
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [validLogos, setValidLogos] = useState<Set<string>>(new Set());
  const [logosChecked, setLogosChecked] = useState(false);

  const filteredByValue = useMemo(
    () => data.filter((item) => item.total_quote_usd > 50).sort((a, b) => (b.unique_wallets ?? 0) - (a.unique_wallets ?? 0)),
    [data]
  );

  // Pre-validate logo URLs by attempting to load each image
  useEffect(() => {
    if (!filteredByValue.length) { setLogosChecked(true); return; }
    const urls = new Set(filteredByValue.map((item) => item.logo_url).filter(Boolean) as string[]);
    if (!urls.size) { setLogosChecked(true); return; }

    const valid = new Set<string>();
    let remaining = urls.size;

    const done = () => {
      remaining--;
      if (remaining <= 0) {
        setValidLogos(valid);
        setLogosChecked(true);
      }
    };

    urls.forEach((url) => {
      const img = new Image();
      img.onload = () => { valid.add(url); done(); };
      img.onerror = () => { done(); };
      img.src = url;
    });
  }, [filteredByValue]);

  const filteredByIcon = useMemo(
    () => showAll ? filteredByValue : filteredByValue.filter((item) => item.logo_url && validLogos.has(item.logo_url)),
    [filteredByValue, showAll, validLogos]
  );

  const chains = useMemo(() => {
    const map = new Map<string, number>();
    filteredByIcon.forEach((item) => {
      map.set(item.chain_display_name, (map.get(item.chain_display_name) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [filteredByIcon]);

  const displayData = useMemo(
    () => selectedChain === "all" ? filteredByIcon : filteredByIcon.filter((item) => item.chain_display_name === selectedChain),
    [filteredByIcon, selectedChain]
  );

  const DEFAULT_ROWS = 10;
  const visibleData = expanded ? displayData : displayData.slice(0, DEFAULT_ROWS);
  const hasMore = displayData.length > DEFAULT_ROWS;

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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px]">Filtered to tokens with holdings over $50 USD</span>
        </div>
        <div className="flex items-center gap-1 border border-border rounded-full p-0.5">
          <button
            onClick={() => setShowAll(false)}
            className={`flex items-center gap-1 h-6 px-2.5 rounded-full font-mono text-[11px] transition-colors ${!showAll ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ShieldCheck className="h-3 w-3" />
            Verified
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`flex items-center gap-1 h-6 px-2.5 rounded-full font-mono text-[11px] transition-colors ${showAll ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-3 w-3" />
            All
          </button>
        </div>
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
                {filteredByIcon.length}
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
          {visibleData.map((item, i) => (
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

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-center font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md"
        >
          {expanded ? "Show less" : `View all ${displayData.length} rows`}
        </button>
      )}
    </div>
  );
};
