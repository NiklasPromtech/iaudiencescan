import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";

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

type SortField = "dim_value" | "total_visitors" | "bot_visitors" | "human_visitors" | "unknown_visitors" | "bot_pct";
type SortDirection = "asc" | "desc";

const INITIAL_ROWS = 5;

export function BotDimensionTable({
  data,
  loading,
  dimension,
  onDimensionChange,
  totalRows,
}: BotDimensionTableProps) {
  const [expanded, setExpanded] = useState(false);
  const [sortField, setSortField] = useState<SortField>("total_visitors");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const dimensionLabel = DIMENSION_OPTIONS.find((d) => d.value === dimension)?.label || dimension;

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      // Handle null/empty dimension values
      if (sortField === "dim_value") {
        aVal = a.dim_value || "";
        bVal = b.dim_value || "";
        return sortDirection === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      }

      // Numeric sorting
      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [data, sortField, sortDirection]);

  const displayedData = expanded ? sortedData : sortedData.slice(0, INITIAL_ROWS);
  const hasMoreRows = sortedData.length > INITIAL_ROWS;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortableHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => {
    const isActive = sortField === field;
    return (
      <TableHead
        className={`font-mono text-[10px] uppercase tracking-widest font-medium cursor-pointer hover:bg-muted/70 transition-colors select-none ${className || ""}`}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-1">
          {children}
          {isActive ? (
            sortDirection === "asc" ? (
              <ChevronUp className="h-3.5 w-3.5 text-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-foreground" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
          )}
        </div>
      </TableHead>
    );
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

      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No data available for this dimension
        </div>
      ) : (
        <>
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <SortableHeader field="dim_value" className="sticky left-0 bg-muted/50 z-10 min-w-[140px]">
                    {dimensionLabel}
                  </SortableHeader>
                  <SortableHeader field="total_visitors" className="text-right">
                    Total
                  </SortableHeader>
                  <SortableHeader field="bot_visitors" className="text-right">
                    Bots
                  </SortableHeader>
                  <SortableHeader field="human_visitors" className="text-right">
                    Humans
                  </SortableHeader>
                  <SortableHeader field="unknown_visitors" className="text-right">
                    Unknown
                  </SortableHeader>
                  <SortableHeader field="bot_pct" className="text-right">
                    Bot %
                  </SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      {row.dim_value || "(not set)"}
                    </TableCell>
                    <TableCell className="font-mono text-right tabular-nums">
                      {row.total_visitors.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-right tabular-nums text-destructive">
                      {row.bot_visitors.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-right tabular-nums text-primary">
                      {row.human_visitors.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-right tabular-nums text-muted-foreground">
                      {row.unknown_visitors.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-right tabular-nums font-medium">
                      {row.bot_pct.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Show more/less toggle */}
          {hasMoreRows && (
            <div className="mt-3 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-muted-foreground hover:text-foreground"
              >
                {expanded ? (
                  <>
                    Show less
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View all {sortedData.length - INITIAL_ROWS} more
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
