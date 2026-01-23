import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableRow as ApiTableRow, TableDimension } from "@/lib/api";

interface DimensionTableProps {
  data: ApiTableRow[];
  loading: boolean;
  dimension: TableDimension;
  onDimensionChange: (dimension: TableDimension) => void;
  totalRows: number;
}

const DIMENSION_OPTIONS: { value: TableDimension; label: string }[] = [
  { value: "referrer_domain", label: "Referrer" },
  { value: "utm_source", label: "UTM Source" },
  { value: "utm_medium", label: "UTM Medium" },
  { value: "utm_campaign", label: "UTM Campaign" },
  { value: "utm_content", label: "UTM Content" },
  { value: "utm_term", label: "UTM Term" },
  { value: "device_type", label: "Device" },
  { value: "browser", label: "Browser" },
  { value: "os", label: "Operating System" },
];

export function DimensionTable({
  data,
  loading,
  dimension,
  onDimensionChange,
  totalRows,
}: DimensionTableProps) {
  const dimensionLabel = DIMENSION_OPTIONS.find((d) => d.value === dimension)?.label || dimension;

  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-h3 text-foreground">Breakdown by {dimensionLabel}</h3>
          <p className="text-p4 text-muted-foreground mt-1">
            {totalRows} total {totalRows === 1 ? "row" : "rows"}
          </p>
        </div>
        <Select value={dimension} onValueChange={(v) => onDimensionChange(v as TableDimension)}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Select dimension" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            {DIMENSION_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No data available for this dimension
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-medium">{dimensionLabel}</TableHead>
                <TableHead className="text-right font-medium">Visitors</TableHead>
                <TableHead className="text-right font-medium">Page Views</TableHead>
                <TableHead className="text-right font-medium">Bounce Rate</TableHead>
                <TableHead className="text-right font-medium">Engaged (30s+)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const bounceRate = row.unique_visitors > 0
                  ? Math.round((row.bounce_count / row.unique_visitors) * 100)
                  : 0;
                const engagedRate = row.unique_visitors > 0
                  ? Math.round((row.stayed_30s / row.unique_visitors) * 100)
                  : 0;

                return (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {row.dim_value || "(not set)"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.unique_visitors.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.pageviews.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {bounceRate}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {engagedRate}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
