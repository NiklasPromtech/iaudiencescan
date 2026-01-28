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
import { WalletsTableRow } from "@/lib/api";
import { format, parseISO } from "date-fns";

interface WalletsOverviewTableProps {
  data: WalletsTableRow[];
  loading: boolean;
  totalRows: number;
}

export const WalletsOverviewTable = ({ 
  data, 
  loading, 
  totalRows 
}: WalletsOverviewTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, HH:mm");
    } catch {
      return "—";
    }
  };

  const formatActionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <Skeleton className="h-6 w-32" />
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
          <h3 className="text-h3 text-foreground">Wallet Actions</h3>
        </div>
        <p className="text-p2 text-muted-foreground">
          No wallet action data available yet. Track wallet connections to see data here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="text-h3 text-foreground">Wallet Actions</h3>
        </div>
        <span className="text-p3 text-muted-foreground">
          {totalRows} action type{totalRows !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Action Type</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Count</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Unique Wallets</TableHead>
              <TableHead className="text-muted-foreground font-medium">First Seen</TableHead>
              <TableHead className="text-muted-foreground font-medium">Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.action_type} className="border-border">
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className="bg-muted text-muted-foreground"
                  >
                    {formatActionType(row.action_type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-foreground font-medium">
                  {row.action_count.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {row.unique_wallets.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(row.first_seen)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(row.last_seen)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
