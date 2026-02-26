import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-mono text-xs uppercase tracking-widest">Token</TableHead>
          <TableHead className="font-mono text-xs uppercase tracking-widest">Chain</TableHead>
          <TableHead className="font-mono text-xs uppercase tracking-widest text-right">Total Value (USD)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
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
            <TableCell className="font-mono text-xs text-muted-foreground">
              {item.chain_display_name}
            </TableCell>
            <TableCell className="font-mono text-xs tabular-nums text-right">
              {formatUsd(item.total_quote_usd)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
