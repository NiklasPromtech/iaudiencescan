import { useState, useMemo } from "react";
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
import { Target, ChevronDown, ChevronUp } from "lucide-react";
import { EventsTableRow } from "@/lib/api";
import { format } from "date-fns";
import { calcDeltaPct, DeltaBadge } from "./MetricCell";

interface EventsTableProps {
  data: EventsTableRow[];
  loading: boolean;
  totalRows: number;
  hideHeader?: boolean;
  comparisonData?: EventsTableRow[];
}

const DEFAULT_VISIBLE_COUNT = 5;

export const EventsTable = ({ data, loading, totalRows, hideHeader, comparisonData }: EventsTableProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, HH:mm");
    } catch {
      return dateStr;
    }
  };

  const comparisonMap = useMemo(() => {
    if (!comparisonData?.length) return null;
    const map = new Map<string, EventsTableRow>();
    comparisonData.forEach(r => map.set(r.event_type, r));
    return map;
  }, [comparisonData]);

  const visibleData = isExpanded ? data : data.slice(0, DEFAULT_VISIBLE_COUNT);
  const hasMore = data.length > DEFAULT_VISIBLE_COUNT;
  const hiddenCount = data.length - DEFAULT_VISIBLE_COUNT;

  if (loading) {
    return (
      <div className={hideHeader ? "" : "py-4"}>
        {!hideHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <Skeleton className="h-6 w-32" />
          </div>
        )}
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
      <div className={hideHeader ? "" : "py-4"}>
        {!hideHeader && (
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-h3 text-foreground">Conversion Events</h3>
          </div>
        )}
        <p className="text-p2 text-muted-foreground">
          No conversion events tracked yet. Set up event tracking to see data here.
        </p>
      </div>
    );
  }

  return (
    <div className={hideHeader ? "" : "py-4"}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-h3 text-foreground">Conversion Events</h3>
          </div>
          <span className="text-p3 text-muted-foreground">
            {totalRows} event type{totalRows !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Event</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium text-right">Total</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium text-right">Unique Users</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium text-right">First Seen</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-medium text-right">Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleData.map((row) => (
              <TableRow key={row.event_type} className="border-border">
                <TableCell className="font-medium text-foreground">
                  {row.event_type}
                </TableCell>
                <TableCell className="font-mono text-right text-foreground tabular-nums">
                  <div className="flex items-baseline justify-end gap-1">
                    {row.event_count.toLocaleString()}
                    <DeltaBadge delta={calcDeltaPct(row.event_count, comparisonMap?.get(row.event_type)?.event_count)} />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-right text-foreground tabular-nums">
                  <div className="flex items-baseline justify-end gap-1">
                    {row.unique_users.toLocaleString()}
                    <DeltaBadge delta={calcDeltaPct(row.unique_users, comparisonMap?.get(row.event_type)?.unique_users)} />
                  </div>
                </TableCell>
                <TableCell className="font-mono text-right text-muted-foreground text-sm tabular-nums">
                  {formatDate(row.first_seen)}
                </TableCell>
                <TableCell className="font-mono text-right text-muted-foreground text-sm tabular-nums">
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
