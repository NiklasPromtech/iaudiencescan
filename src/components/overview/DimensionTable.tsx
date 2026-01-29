import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { TableRow as ApiTableRow, TableDimension, CostSource } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { MetricCell, ENGAGEMENT_THRESHOLDS } from "./MetricCell";
import { DimensionCell } from "./DimensionCell";

// Dimensions that support cost sources
const COST_SUPPORTED_DIMENSIONS: TableDimension[] = [
  "referrer_domain",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

interface DimensionTableProps {
  data: ApiTableRow[];
  loading: boolean;
  dimension: TableDimension;
  onDimensionChange: (dimension: TableDimension) => void;
  totalRows: number;
  showWalletColumns?: boolean;
  showConversionColumns?: boolean;
  onBotClick?: (dimValue: string) => void;
  onWalletClick?: (dimValue: string, walletCount: number) => void;
  costSources?: CostSource[];
  selectedCostSourceId?: string | null;
  onCostSourceChange?: (costSourceId: string | null) => void;
  onAddCostSource?: () => void;
}

const DIMENSION_OPTIONS: { value: TableDimension; label: string }[] = [
  { value: "date_day", label: "Date" },
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

// Map TableDimension to CostDimension
const DIMENSION_TO_COST_DIMENSION: Record<string, string> = {
  referrer_domain: "referrer_domain",
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term",
};

interface ColumnGroup {
  id: string;
  label: string;
  defaultVisible: boolean;
}

const COLUMN_GROUPS: ColumnGroup[] = [
  { id: "traffic", label: "Traffic", defaultVisible: true },
  { id: "engagement", label: "Engagement", defaultVisible: true },
  { id: "wallets", label: "Wallets", defaultVisible: false },
  { id: "conversions", label: "Conversions", defaultVisible: false },
];

// Helper to calculate cost-per if not provided by API
function calculateCostPer(costTotal: number | null, count: number | null): number | null {
  if (costTotal === null || count === null || count === 0) return null;
  return costTotal / count;
}

// Get rate color class based on thresholds
function getRateColorClass(
  rate: number | null,
  thresholds?: { good: number; warning: number }
): string {
  if (rate === null || !thresholds) return "text-muted-foreground";
  if (rate >= thresholds.good) return "text-emerald-500";
  if (rate >= thresholds.warning) return "text-amber-500";
  return "text-destructive";
}

// Wallet metric cell with consistent 3-row layout
interface WalletMetricCellProps {
  count: number | null;
  rate?: number | null;
  costPer?: number | null;
  cpb?: number | null;  // Cost per balance (for Avg Balance column)
  customValue?: string | null;  // For displaying formatted values like "$320"
  showCost?: boolean;
  rateThresholds?: { good: number; warning: number };
  onClick?: () => void;  // Optional click handler
}

function WalletMetricCell({
  count,
  rate,
  costPer,
  cpb,
  customValue,
  showCost = false,
  rateThresholds,
  onClick,
}: WalletMetricCellProps) {
  const rateColorClass = getRateColorClass(rate ?? null, rateThresholds);
  const isClickable = onClick && count !== null && count > 0;

  return (
    <div className="flex flex-col text-right">
      {/* Row 1: Count or custom value */}
      {isClickable ? (
        <button
          onClick={onClick}
          className="font-medium tabular-nums text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors text-right"
        >
          {count!.toLocaleString()}
        </button>
      ) : (
        <span className="font-medium tabular-nums text-foreground">
          {customValue !== undefined && customValue !== null
            ? customValue
            : count !== null && count !== undefined
              ? count.toLocaleString()
              : "—"}
        </span>
      )}
      
      {/* Row 2: Rate % */}
      <span className={cn("text-xs tabular-nums h-4", rate !== null && rate !== undefined ? rateColorClass : "text-muted-foreground")}>
        {rate !== null && rate !== undefined ? `${Math.round(rate)}%` : "—"}
      </span>
      
      {/* Row 3: Cost-per or CPB */}
      <span className={cn("text-xs tabular-nums h-4", showCost ? "text-muted-foreground" : "invisible")}>
        {showCost
          ? cpb !== null && cpb !== undefined
            ? `$${cpb.toFixed(2)}`
            : costPer !== null && costPer !== undefined
              ? `$${costPer.toFixed(2)}`
              : "—"
          : "—"}
      </span>
    </div>
  );
}

// Enrich row with calculated cost-per fields if missing
function enrichRowWithCostPer(row: ApiTableRow): ApiTableRow {
  const costTotal = row.cost_total;
  
  return {
    ...row,
    cost_per_pageview: row.cost_per_pageview ?? calculateCostPer(costTotal, row.pageviews),
    cost_per_stayed_10s: row.cost_per_stayed_10s ?? calculateCostPer(costTotal, row.stayed_10s),
    cost_per_stayed_30s: row.cost_per_stayed_30s ?? calculateCostPer(costTotal, row.stayed_30s),
    cost_per_stayed_60s: row.cost_per_stayed_60s ?? calculateCostPer(costTotal, row.stayed_60s),
    cost_per_stayed_5m: row.cost_per_stayed_5m ?? calculateCostPer(costTotal, row.stayed_5m),
    cost_per_wallet: row.cost_per_wallet ?? calculateCostPer(costTotal, row.wallet_users),
  };
}

export function DimensionTable({
  data,
  loading,
  dimension,
  onDimensionChange,
  totalRows,
  showWalletColumns,
  showConversionColumns,
  onBotClick,
  onWalletClick,
  costSources = [],
  selectedCostSourceId,
  onCostSourceChange,
  onAddCostSource,
}: DimensionTableProps) {
  // Filter cost sources for current dimension
  const costDimension = DIMENSION_TO_COST_DIMENSION[dimension];
  const matchingCostSources = costSources.filter(
    (cs) => cs.dimension === costDimension
  );
  const supportsCost = COST_SUPPORTED_DIMENSIONS.includes(dimension);
  const hasCostSource = selectedCostSourceId !== null && selectedCostSourceId !== "none";

  // Enrich data with calculated cost-per fields and sort appropriately
  const enrichedData = useMemo(() => {
    const enriched = data.map(row => enrichRowWithCostPer(row));
    
    // Sort by date ascending if date dimension, otherwise by pageviews descending
    if (dimension === "date_day") {
      return enriched.sort((a, b) => a.dim_value.localeCompare(b.dim_value));
    }
    return enriched.sort((a, b) => (b.pageviews ?? 0) - (a.pageviews ?? 0));
  }, [data, dimension]);

  // Auto-show wallet/conversion columns if data exists
  const hasWalletData = data.some((row) => 
    (row.wallet_users !== null && row.wallet_users > 0) ||
    (row.visitors_with_wallet_extension !== null && row.visitors_with_wallet_extension > 0) ||
    (row.wallets_enriched !== null && row.wallets_enriched > 0)
  );
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

  // Update visibility when data changes
  useEffect(() => {
    if (hasWalletData) {
      setVisibleGroups(prev => new Set([...prev, "wallets"]));
    }
    if (hasConversionData) {
      setVisibleGroups(prev => new Set([...prev, "conversions"]));
    }
  }, [hasWalletData, hasConversionData]);

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

  // Calculate rate as percentage
  const calcRate = (count: number | null, visitors: number): number | null => {
    if (count === null || visitors === 0) return null;
    return (count / visitors) * 100;
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
            <Skeleton key={i} className="h-16 w-full" />
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
            {hasCostSource && " • Cost data enabled"}
          </p>
        </div>
        <div className="flex items-center gap-2">
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

          {/* Cost Source Selector */}
          {supportsCost && (
            matchingCostSources.length > 0 ? (
              <Select 
                value={selectedCostSourceId || "none"} 
                onValueChange={(v) => onCostSourceChange?.(v === "none" ? null : v)}
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Select cost source" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  <SelectItem value="none">No cost data</SelectItem>
                  {matchingCostSources.map((cs) => (
                    <SelectItem key={cs.id} value={cs.id}>
                      {cs.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onAddCostSource}
                className="h-10 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add cost source
              </Button>
            )
          )}
        </div>
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

      {enrichedData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          No data available for this dimension
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-medium sticky left-0 bg-muted/50 z-10 w-[30%] min-w-[180px]">
                  {dimensionLabel}
                </TableHead>

                {/* Traffic Group - Views first, then Visitors */}
                {visibleGroups.has("traffic") && (
                  <>
                    <TableHead className="text-right font-medium min-w-[80px]">Views</TableHead>
                    <TableHead className="text-right font-medium min-w-[80px] border-r border-border/50">
                      Visitors
                    </TableHead>
                  </>
                )}

                {/* Engagement Group */}
                {visibleGroups.has("engagement") && (
                  <>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[70px]">10s</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[70px]">30s</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[70px]">60s</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[70px] border-r border-border/50">
                      5m
                    </TableHead>
                  </>
                )}

                {/* Wallets Group - Extensions, Wallets, Enriched, Avg Balance */}
                {visibleGroups.has("wallets") && (
                  <>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[90px] whitespace-nowrap">
                      Extensions
                    </TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[90px] whitespace-nowrap">
                      Wallets
                    </TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[90px] whitespace-nowrap">
                      Enriched
                    </TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[100px] whitespace-nowrap border-r border-border/50">
                      Avg Bal
                    </TableHead>
                  </>
                )}

                {/* Conversions Group */}
                {visibleGroups.has("conversions") && (
                  <>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[80px]">Conv.</TableHead>
                    <TableHead className="text-right font-medium text-muted-foreground min-w-[80px]">Total</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedData.map((row, index) => {
                const visitors = row.unique_visitors;

                return (
                  <TableRow 
                    key={index} 
                    className={cn(
                      "hover:bg-muted/30",
                      hasCostSource && "h-auto" // Taller rows when cost is shown
                    )}
                  >
                    {/* Dimension Cell with Grade + Bot Warning */}
                    <TableCell className="sticky left-0 bg-background z-10 py-3">
                      <DimensionCell 
                        row={row}
                        showGrade={true}
                        showCost={hasCostSource}
                        showBotRate={true}
                        onBotClick={onBotClick}
                      />
                    </TableCell>

                    {/* Traffic Group - Views first, then Visitors */}
                    {visibleGroups.has("traffic") && (
                      <>
                        <TableCell className="text-right py-3">
                          <MetricCell
                            count={row.pageviews}
                            rate={calcRate(row.pageviews, visitors)}
                            showRate={false}
                            showCost={hasCostSource}
                            costPer={row.cost_per_pageview}
                          />
                        </TableCell>
                        <TableCell className="text-right py-3 border-r border-border/50">
                          <MetricCell
                            count={visitors}
                            showRate={false}
                            showCost={hasCostSource}
                            costPer={row.cost_per_visitor}
                          />
                        </TableCell>
                      </>
                    )}

                    {/* Engagement Group */}
                    {visibleGroups.has("engagement") && (
                      <>
                        <TableCell className="text-right py-3">
                          <MetricCell
                            count={row.stayed_10s}
                            rate={calcRate(row.stayed_10s, visitors)}
                            showCost={hasCostSource}
                            costPer={row.cost_per_stayed_10s}
                            rateThresholds={ENGAGEMENT_THRESHOLDS}
                          />
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <MetricCell
                            count={row.stayed_30s}
                            rate={calcRate(row.stayed_30s, visitors)}
                            showCost={hasCostSource}
                            costPer={row.cost_per_stayed_30s}
                            rateThresholds={ENGAGEMENT_THRESHOLDS}
                          />
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <MetricCell
                            count={row.stayed_60s}
                            rate={calcRate(row.stayed_60s, visitors)}
                            showCost={hasCostSource}
                            costPer={row.cost_per_stayed_60s}
                            rateThresholds={ENGAGEMENT_THRESHOLDS}
                          />
                        </TableCell>
                        <TableCell className="text-right py-3 border-r border-border/50">
                          <MetricCell
                            count={row.stayed_5m}
                            rate={calcRate(row.stayed_5m, visitors)}
                            showCost={hasCostSource}
                            costPer={row.cost_per_stayed_5m}
                            rateThresholds={ENGAGEMENT_THRESHOLDS}
                          />
                        </TableCell>
                      </>
                    )}

                    {/* Wallets Group - Extensions, Wallets, Enriched, Avg Balance */}
                    {visibleGroups.has("wallets") && (
                      (() => {
                        const extensionsCount = row.visitors_with_wallet_extension;
                        const walletsCount = row.wallet_users;
                        const enrichedCount = row.wallets_enriched;
                        
                        // Extensions rate: extensions / visitors
                        const extensionsRate = calcRate(extensionsCount, visitors);
                        
                        // Wallets rate: wallets / extensions (how many with extension connected)
                        const walletsRate = extensionsCount && extensionsCount > 0
                          ? ((walletsCount ?? 0) / extensionsCount) * 100
                          : null;
                        
                        // Enriched rate: from API percent_enriched
                        const enrichedRate = row.percent_enriched;
                        
                        // Avg Balance: total_balance_usd / wallets_enriched
                        const avgBalance = enrichedCount && enrichedCount > 0 && row.total_balance_usd !== null
                          ? row.total_balance_usd / enrichedCount
                          : null;
                        
                        // CPB: cost / total_balance (only if cost source selected)
                        const cpb = hasCostSource && row.cost_total !== null && row.total_balance_usd !== null && row.total_balance_usd > 0
                          ? row.cost_total / row.total_balance_usd
                          : null;
                        
                        return (
                          <>
                            {/* Extensions: count + rate (% of visitors) */}
                            <TableCell className="text-right py-3">
                              <WalletMetricCell
                                count={extensionsCount}
                                rate={extensionsRate}
                                showCost={hasCostSource}
                                rateThresholds={{ good: 20, warning: 5 }}
                              />
                            </TableCell>
                            
                            {/* Wallets: count + rate (% of extensions that connected) */}
                            <TableCell className="text-right py-3">
                              <WalletMetricCell
                                count={walletsCount}
                                rate={walletsRate}
                                costPer={hasCostSource ? row.cost_per_wallet : undefined}
                                showCost={hasCostSource}
                                rateThresholds={{ good: 30, warning: 10 }}
                                onClick={walletsCount && walletsCount > 0 && onWalletClick 
                                  ? () => onWalletClick(row.dim_value, walletsCount) 
                                  : undefined}
                              />
                            </TableCell>
                            
                            {/* Enriched: count + percent_enriched */}
                            <TableCell className="text-right py-3">
                              <WalletMetricCell
                                count={enrichedCount}
                                rate={enrichedRate}
                                showCost={hasCostSource}
                                rateThresholds={{ good: 80, warning: 40 }}
                              />
                            </TableCell>
                            
                            {/* Avg Balance: amount + CPB (when cost source) */}
                            <TableCell className="text-right py-3 border-r border-border/50">
                              <WalletMetricCell
                                count={null}
                                customValue={avgBalance !== null ? `$${avgBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : null}
                                cpb={cpb}
                                showCost={hasCostSource}
                              />
                            </TableCell>
                          </>
                        );
                      })()
                    )}

                    {/* Conversions Group */}
                    {visibleGroups.has("conversions") && (
                      <>
                        <TableCell className="text-right py-3">
                          <MetricCell
                            count={row.converted_users}
                            rate={calcRate(row.converted_users, visitors)}
                            showCost={hasCostSource}
                            costPer={row.cost_per_conversion}
                            rateThresholds={{ good: 5, warning: 1 }}
                          />
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <MetricCell
                            count={row.conversions_total}
                            showRate={false}
                            showCost={false}
                          />
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
