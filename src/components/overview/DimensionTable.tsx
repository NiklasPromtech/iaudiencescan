import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

interface DimensionTableProps {
  data: ApiTableRow[];
  loading: boolean;
  dimension: TableDimension;
  onDimensionChange: (dimension: TableDimension) => void;
  totalRows: number;
  showWalletColumns?: boolean;
  showConversionColumns?: boolean;
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

interface ColumnGroup {
  id: string;
  label: string;
  defaultVisible: boolean;
}

const COLUMN_GROUPS: ColumnGroup[] = [
  { id: "traffic", label: "Traffic", defaultVisible: true },
  { id: "engagement", label: "Engagement", defaultVisible: true },
  { id: "bots", label: "Bots", defaultVisible: false },
  { id: "wallets", label: "Wallets", defaultVisible: false },
  { id: "conversions", label: "Conversions", defaultVisible: false },
];

export function DimensionTable({
  data,
  loading,
  dimension,
  onDimensionChange,
  totalRows,
  showWalletColumns,
  showConversionColumns,
}: DimensionTableProps) {
  // Auto-show wallet/conversion columns if data exists
  const hasWalletData = data.some((row) => row.wallet_users !== null && row.wallet_users > 0);
  const hasConversionData = data.some((row) => row.converted_users !== null && row.converted_users > 0);

  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    COLUMN_GROUPS.forEach((g) => {
      if (g.defaultVisible) initial.add(g.id);
      if (g.id === "wallets" && (showWalletColumns || hasWalletData)) initial.add(g.id);
      if (g.id === "conversions" && (showConversionColumns || hasConversionData)) initial.add(g.id);
    });
    return initial;
  });

  const dimensionLabel = DIMENSION_OPTIONS.find((d) => d.value === dimension)?.label || dimension;

  const toggleGroup = (groupId: string) => {
    setVisibleGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const calcRate = (numerator: number | null, denominator: number): string => {
    if (numerator === null || denominator === 0) return "—";
    return `${Math.round((numerator / denominator) * 100)}%`;
  };

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

      {/* Column Group Toggles */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <span className="text-muted-foreground">Show:</span>
        {COLUMN_GROUPS.map((group) => (
          <div key={group.id} className="flex items-center gap-1.5">
            <Checkbox
              id={`group-${group.id}`}
              checked={visibleGroups.has(group.id)}
              onCheckedChange={() => toggleGroup(group.id)}
            />
            <Label
              htmlFor={`group-${group.id}`}
              className="text-sm font-normal cursor-pointer text-foreground"
            >
              {group.label}
            </Label>
          </div>
        ))}
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

                {/* Traffic Group */}
                {visibleGroups.has("traffic") && (
                  <>
                    <TableHead className="text-right font-medium">Visitors</TableHead>
                    <TableHead className="text-right font-medium border-r border-border/50">
                      Views
                    </TableHead>
                  </>
                )}

                {/* Engagement Group */}
                {visibleGroups.has("engagement") && (
                  <>
                    <TableHead className="text-right font-medium text-muted-foreground">10s</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground">30s</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground">60s</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground border-r border-border/50">
                      5m
                    </TableHead>
                  </>
                )}

                {/* Bots Group */}
                {visibleGroups.has("bots") && (
                  <TableHead className="text-right font-medium text-muted-foreground border-r border-border/50">
                    Bot %
                  </TableHead>
                )}

                {/* Wallets Group */}
                {visibleGroups.has("wallets") && (
                  <>
                    <TableHead className="text-right font-medium text-muted-foreground">Wallets</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground border-r border-border/50">
                      Rate
                    </TableHead>
                  </>
                )}

                {/* Conversions Group */}
                {visibleGroups.has("conversions") && (
                  <>
                    <TableHead className="text-right font-medium text-muted-foreground">Conv.</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground">Total</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const visitors = row.unique_visitors;

                return (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      {row.dim_value || "(not set)"}
                    </TableCell>

                    {/* Traffic Group */}
                    {visibleGroups.has("traffic") && (
                      <>
                        <TableCell className="text-right tabular-nums">
                          {visitors.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums border-r border-border/50">
                          {row.pageviews.toLocaleString()}
                        </TableCell>
                      </>
                    )}

                    {/* Engagement Group (rates) */}
                    {visibleGroups.has("engagement") && (
                      <>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {calcRate(row.stayed_10s, visitors)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {calcRate(row.stayed_30s, visitors)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {calcRate(row.stayed_60s, visitors)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground border-r border-border/50">
                          {calcRate(row.stayed_5m, visitors)}
                        </TableCell>
                      </>
                    )}

                    {/* Bots Group */}
                    {visibleGroups.has("bots") && (
                      <TableCell className="text-right tabular-nums text-muted-foreground border-r border-border/50">
                        {calcRate(row.bot_visitors, visitors)}
                      </TableCell>
                    )}

                    {/* Wallets Group */}
                    {visibleGroups.has("wallets") && (
                      <>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {row.wallet_users?.toLocaleString() ?? "—"}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground border-r border-border/50">
                          {calcRate(row.wallet_users, visitors)}
                        </TableCell>
                      </>
                    )}

                    {/* Conversions Group */}
                    {visibleGroups.has("conversions") && (
                      <>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {row.converted_users?.toLocaleString() ?? "—"}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {row.conversions_total?.toLocaleString() ?? "—"}
                        </TableCell>
                      </>
                    )}
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
