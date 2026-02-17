import { useMemo } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletDistributionRow } from "@/lib/api";
import { calcDeltaPct, DeltaBadge } from "./MetricCell";

interface WalletDistributionTableProps {
  data: WalletDistributionRow[];
  loading: boolean;
  totalRows: number;
  hideHeader?: boolean;
  comparisonData?: WalletDistributionRow[];
}

export const WalletDistributionTable = ({ data, loading, totalRows, hideHeader, comparisonData }: WalletDistributionTableProps) => {
  const comparisonMap = useMemo(() => {
    if (!comparisonData?.length) return null;
    const map = new Map<string, WalletDistributionRow>();
    comparisonData.forEach(r => map.set(r.tier, r));
    return map;
  }, [comparisonData]);
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
              <TableCell className="text-sm tabular-nums text-foreground text-right">
                <div className="flex items-baseline justify-end gap-1">
                  {row.wallet_count.toLocaleString()}
                  <DeltaBadge delta={calcDeltaPct(row.wallet_count, comparisonMap?.get(row.tier)?.wallet_count)} />
                </div>
              </TableCell>
              <TableCell className="text-sm tabular-nums text-foreground text-right">
                <div className="flex items-baseline justify-end gap-1">
                  ${row.total_usd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  <DeltaBadge delta={calcDeltaPct(row.total_usd, comparisonMap?.get(row.tier)?.total_usd)} />
                </div>
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
