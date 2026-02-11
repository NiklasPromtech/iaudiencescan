import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Puzzle, ChevronDown, ChevronUp } from "lucide-react";
import { WalletExtensionsRow } from "@/lib/api";

interface WalletExtensionsTableProps {
  data: WalletExtensionsRow[];
  loading: boolean;
  totalRows: number;
}

const DEFAULT_VISIBLE_COUNT = 5;

export const WalletExtensionsTable = ({ 
  data, 
  loading, 
  totalRows 
}: WalletExtensionsTableProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleData = isExpanded ? data : data.slice(0, DEFAULT_VISIBLE_COUNT);
  const hasMore = data.length > DEFAULT_VISIBLE_COUNT;
  const hiddenCount = data.length - DEFAULT_VISIBLE_COUNT;

  if (loading) {
    return (
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <Puzzle className="h-5 w-5 text-primary" />
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
          <Puzzle className="h-5 w-5 text-primary" />
          <h3 className="text-h3 text-foreground">Wallet Extensions</h3>
        </div>
        <p className="text-p2 text-muted-foreground">
          No wallet extension data available yet. Connect wallet tracking to see data here.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Puzzle className="h-5 w-5 text-primary" />
          <h3 className="text-h3 text-foreground">Wallet Extensions</h3>
        </div>
        <span className="text-p3 text-muted-foreground">
          {totalRows} extension{totalRows !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Wallet Type</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleData.map((row) => (
              <TableRow key={row.wallet_type} className="border-border">
                <TableCell className="font-medium text-foreground">
                  {row.wallet_type}
                </TableCell>
                <TableCell className="text-right text-foreground font-medium">
                  {row.count?.toLocaleString() ?? "—"}
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
