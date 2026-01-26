import { useState } from "react";
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
import { BotDimensionRow, TableDimension } from "@/lib/api";

interface BotDimensionTableProps {
  data: BotDimensionRow[];
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

export function BotDimensionTable({
  data,
  loading,
  dimension,
  onDimensionChange,
  totalRows,
}: BotDimensionTableProps) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
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
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-medium sticky left-0 bg-muted/50 z-10 min-w-[140px]">
                  {dimensionLabel}
                </TableHead>
                <TableHead className="text-right font-medium">Total</TableHead>
                <TableHead className="text-right font-medium">Bots</TableHead>
                <TableHead className="text-right font-medium">Humans</TableHead>
                <TableHead className="text-right font-medium">Unknown</TableHead>
                <TableHead className="text-right font-medium">Bot %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-medium sticky left-0 bg-background z-10">
                    {row.dim_value || "(not set)"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.total_visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-destructive">
                    {row.bot_visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-primary">
                    {row.human_visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {row.unknown_visitors.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {row.bot_pct.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
