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
import { RendererBreakdown as RendererBreakdownType } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

interface RendererBreakdownProps {
  data: RendererBreakdownType[];
  loading: boolean;
}

export function RendererBreakdown({ data, loading }: RendererBreakdownProps) {
  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6 border border-border">
        <h3 className="text-h3 text-foreground mb-4">Renderer Breakdown</h3>
        <div className="h-[100px] flex items-center justify-center text-muted-foreground">
          No renderer data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-border">
      <h3 className="text-h3 text-foreground mb-4">Renderer Breakdown</h3>
      <p className="text-p3 text-muted-foreground mb-4">
        GPU renderer distribution helps identify headless browsers
      </p>
      <div className="rounded-md border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest font-medium">Renderer</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-right font-medium">Visitors</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-center font-medium w-[80px]">Flag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/30">
                <TableCell className="font-medium max-w-[300px] truncate" title={row.renderer}>
                  {row.renderer || "(unknown)"}
                </TableCell>
                <TableCell className="font-mono text-right tabular-nums">
                  {row.visitor_count.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  {row.is_headless && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Headless
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
