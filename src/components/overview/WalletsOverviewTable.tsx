import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet, ChevronDown, ChevronUp } from "lucide-react";
import { WalletsTableRow } from "@/lib/api";
import { format, parseISO } from "date-fns";

interface WalletsOverviewTableProps {
  data: WalletsTableRow[];
  loading: boolean;
  totalRows: number;
}

const DEFAULT_VISIBLE_COUNT = 5;

export const WalletsOverviewTable = ({ 
  data, 
  loading, 
  totalRows 
}: WalletsOverviewTableProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const visibleData = isExpanded ? data : data.slice(0, DEFAULT_VISIBLE_COUNT);
  const hasMore = data.length > DEFAULT_VISIBLE_COUNT;
  const hiddenCount = data.length - DEFAULT_VISIBLE_COUNT;

  if (loading) {
    return (
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="text-h3 text-foreground">Wallet Actions</h3>
        </div>
        <p className="text-p2 text-muted-foreground">
          No wallet action data available yet. Track wallet connections to see data here.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
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
            {visibleData.map((row) => (
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

      {hasMore && (
        <div className="mt-4 pt-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                View all {hiddenCount} more
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
