import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletDistributionRow } from "@/lib/api";

interface WalletDistributionTableProps {
  data: WalletDistributionRow[];
  loading: boolean;
  totalRows: number;
  hideHeader?: boolean;
}

export const WalletDistributionTable = ({ data, loading, totalRows, hideHeader }: WalletDistributionTableProps) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No wallet distribution data available</p>
      </div>
    );
  }

  return (
    <div>
      {!hideHeader && (
        <h3 className="text-sm font-medium text-foreground mb-3">Wallet Distribution</h3>
      )}
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Tier</TableHead>
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-right">Wallets</TableHead>
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-right">Total USD</TableHead>
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.tier} className="border-border">
              <TableCell className="text-sm font-medium text-foreground">{row.tier}</TableCell>
              <TableCell className="text-sm tabular-nums text-foreground text-right">{row.wallet_count.toLocaleString()}</TableCell>
              <TableCell className="text-sm tabular-nums text-foreground text-right">
                ${row.total_usd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </TableCell>
              <TableCell className="text-sm tabular-nums text-muted-foreground text-right">
                {row.percentage.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
