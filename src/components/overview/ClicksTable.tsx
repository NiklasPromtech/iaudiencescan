import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClicksTableRow } from "@/lib/api";

interface ClicksTableProps {
  data: ClicksTableRow[];
  loading: boolean;
  totalRows: number;
  hideHeader?: boolean;
}

const TruncatedCell = ({ value, maxWidth = "200px" }: { value: string; maxWidth?: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="block truncate" style={{ maxWidth }}>{value || "—"}</span>
      </TooltipTrigger>
      {value && value.length > 25 && (
        <TooltipContent side="top" className="max-w-sm break-all">
          <p className="text-xs">{value}</p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

export const ClicksTable = ({ data, loading, totalRows, hideHeader }: ClicksTableProps) => {
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
        <p className="text-sm text-muted-foreground">No click data available</p>
      </div>
    );
  }

  return (
    <div>
      {!hideHeader && (
        <h3 className="text-sm font-medium text-foreground mb-3">Clicks</h3>
      )}
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Link Text</TableHead>
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground">URL</TableHead>
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Page</TableHead>
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-right">Clicks</TableHead>
            <TableHead className="text-xs font-mono uppercase tracking-widest text-muted-foreground text-right">Visitors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i} className="border-border">
              <TableCell className="text-sm text-foreground">
                <TruncatedCell value={row.click_text} />
              </TableCell>
              <TableCell className="text-sm text-foreground">
                <TruncatedCell value={row.href} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <TruncatedCell value={row.page_path} maxWidth="150px" />
              </TableCell>
              <TableCell className="text-sm tabular-nums text-foreground text-right">{row.click_count.toLocaleString()}</TableCell>
              <TableCell className="text-sm tabular-nums text-foreground text-right">{row.unique_visitors.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
