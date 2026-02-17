import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, X } from "lucide-react";
import { ActiveFilters } from "@/lib/api";

interface ComparisonConfirmCardProps {
  dateRangeLabel: string;
  previousRangeLabel: string;
  activeFilters: ActiveFilters;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ComparisonConfirmCard({
  dateRangeLabel,
  previousRangeLabel,
  activeFilters,
  onConfirm,
  onCancel,
}: ComparisonConfirmCardProps) {
  const filterEntries = Object.entries(activeFilters).filter(
    ([_, v]) => v && v.length > 0
  );

  return (
    <div className="border border-dashed border-primary/40 bg-muted/30 p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-foreground font-medium">
            Compare <span className="font-mono text-primary">{dateRangeLabel}</span> against{" "}
            <span className="font-mono text-muted-foreground">{previousRangeLabel}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            We'll fetch data for both periods and show the change across all metrics.
          </p>
        </div>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground p-1">
          <X className="h-4 w-4" />
        </button>
      </div>

      {filterEntries.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">
            Filters:
          </span>
          {filterEntries.map(([key, values]) =>
            values!.map((v) => (
              <Badge
                key={`${key}-${v}`}
                variant="outline"
                className="text-[11px] font-mono px-2 py-0.5"
              >
                {key}={v}
              </Badge>
            ))
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onConfirm} className="h-8 text-xs font-mono">
          <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
          Run Comparison
        </Button>
        <button
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground font-mono"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
