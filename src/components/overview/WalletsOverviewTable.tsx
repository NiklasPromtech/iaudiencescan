import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet } from "lucide-react";
import { WalletsTableRow, WalletsTableSummary } from "@/lib/api";

interface WalletsOverviewTableProps {
  data: WalletsTableRow[];
  summary: WalletsTableSummary | null;
  loading: boolean;
  totalRows: number;
}

export const WalletsOverviewTable = ({ 
  data, 
  summary, 
  loading, 
  totalRows 
}: WalletsOverviewTableProps) => {
  const formatBalance = (balance: number | null) => {
    if (balance === null) return "—";
    return `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="text-h3 text-foreground">Top Wallets</h3>
        </div>
        <p className="text-p2 text-muted-foreground">
          No wallet data available yet. Track wallet connections to see data here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="text-h3 text-foreground">Top Wallets</h3>
        </div>
        <span className="text-p3 text-muted-foreground">
          {totalRows} wallet{totalRows !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-p4 text-muted-foreground mb-1">Total Wallets</p>
            <p className="text-h3 text-foreground">{summary.total_wallets.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-p4 text-muted-foreground mb-1">Total Balance</p>
            <p className="text-h3 text-foreground">{formatBalance(summary.total_balance_usd)}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-p4 text-muted-foreground mb-1">With Balance</p>
            <p className="text-h3 text-foreground">{summary.wallets_with_balance.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-p4 text-muted-foreground mb-1">Zero Balance</p>
            <p className="text-h3 text-foreground">{summary.wallets_zero_balance.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Wallet</TableHead>
              <TableHead className="text-muted-foreground font-medium">Types</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Visits</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Balance</TableHead>
              <TableHead className="text-muted-foreground font-medium">Chains</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.wallet_address} className="border-border">
                <TableCell className="font-mono text-sm text-foreground">
                  {truncateAddress(row.wallet_address)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.types.slice(0, 2).map((type) => (
                      <Badge 
                        key={type} 
                        variant="secondary" 
                        className="text-xs bg-muted text-muted-foreground"
                      >
                        {type}
                      </Badge>
                    ))}
                    {row.types.length > 2 && (
                      <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                        +{row.types.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {row.visit_count.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatBalance(row.total_balance_usd)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.chains.slice(0, 2).map((chain) => (
                      <Badge 
                        key={chain} 
                        variant="outline" 
                        className="text-xs border-border"
                      >
                        {chain}
                      </Badge>
                    ))}
                    {row.chains.length > 2 && (
                      <Badge variant="outline" className="text-xs border-border">
                        +{row.chains.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
