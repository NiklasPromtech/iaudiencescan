import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterOptionsResponse, ActiveFilters, FilterOptionItem } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FilterKey = "sources" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "countries" | "conversion_events" | "wallet_actions" | "wallet_tiers";

interface FilterSection {
  key: FilterKey;
  label: string;
  customOrder?: string[];
}

const WALLET_TIER_ORDER = [
  "$0",
  "$1 - $100",
  "$100 - $1K",
  "$1K - $10K",
  "$10K - $100K",
  "$100K+",
  "Not enriched",
];

const WALLET_TIER_LABELS: Record<string, string> = {
  "$0": "Zero balance",
  "$1 - $100": "Micro",
  "$100 - $1K": "Small",
  "$1K - $10K": "Mid",
  "$10K - $100K": "Large",
  "$100K+": "Whale",
  "Not enriched": "Unknown",
};

const FILTER_SECTIONS: FilterSection[] = [
  { key: "sources", label: "Source" },
  { key: "utm_source", label: "UTM Source" },
  { key: "utm_medium", label: "Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "utm_content", label: "Content" },
  { key: "utm_term", label: "Term" },
  { key: "countries", label: "Country" },
  { key: "conversion_events", label: "Conversion" },
  { key: "wallet_actions", label: "Wallet Action" },
  { key: "wallet_tiers", label: "Wallet Tier", customOrder: WALLET_TIER_ORDER },
];

interface FilterButtonProps {
  label: string;
  options: FilterOptionItem[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onSelectAll: (values: string[]) => void;
  onClear: () => void;
  customOrder?: string[];
  renderCustomOption?: (option: FilterOptionItem, allOptions: FilterOptionItem[]) => React.ReactNode;
}

const FilterButton = ({
  label,
  options,
  selectedValues,
  onToggle,
  onSelectAll,
  onClear,
  customOrder,
  renderCustomOption,
}: FilterButtonProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const hasSelection = selectedValues.length > 0;

  const filteredOptions = useMemo(() => {
    let sorted: FilterOptionItem[];
    if (customOrder) {
      sorted = [...options].sort((a, b) => {
        const idxA = customOrder.indexOf(a.value);
        const idxB = customOrder.indexOf(b.value);
        return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
      });
    } else {
      sorted = [...options].sort((a, b) => b.count - a.count);
    }
    if (!search) return sorted.slice(0, 20);
    return sorted.filter((opt) =>
      opt.value.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);
  }, [options, search, customOrder]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2.5 gap-1 font-normal text-muted-foreground hover:text-foreground",
            hasSelection && "text-primary bg-primary/5 hover:bg-primary/10"
          )}
        >
          <span className="text-xs">{label}</span>
          {hasSelection && (
            <Badge
              variant="secondary"
              className="h-4 min-w-4 px-1 bg-primary/20 text-primary text-[10px]"
            >
              {selectedValues.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0" 
        align="start"
        sideOffset={4}
      >
        {/* Search + Select All */}
        <div className="p-3 border-b border-border space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {selectedValues.length} of {options.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                if (selectedValues.length === options.length) {
                  onClear();
                } else {
                  onSelectAll(options.map(o => o.value));
                }
              }}
            >
              {selectedValues.length === options.length ? "Deselect all" : "Select all"}
            </Button>
          </div>
        </div>

        {/* Options */}
        <ScrollArea className="h-auto" style={{ maxHeight: '16rem' }}>
          <div className="p-2">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {search ? "No matches found" : "No options available"}
              </p>
            ) : (
              <div className="space-y-0.5">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "relative flex items-center gap-2.5 px-2 py-1.5 rounded-none cursor-pointer transition-colors overflow-hidden",
                        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                      )}
                    >
                      {renderCustomOption ? (
                        <>
                          {renderCustomOption(option, filteredOptions)}
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggle(option.value)}
                            className="h-4 w-4 relative z-10"
                            style={{ position: 'absolute', left: 8 }}
                          />
                        </>
                      ) : (
                        <>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggle(option.value)}
                            className="h-4 w-4"
                          />
                          <span className="flex-1 text-sm truncate">
                            {option.value}
                          </span>
                          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                            {option.count.toLocaleString()}
                          </span>
                        </>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
            {!search && options.length > 15 && (
              <p className="text-xs text-muted-foreground text-center pt-2 pb-1">
                Type to search {options.length.toLocaleString()} values
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {hasSelection && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => {
                onClear();
              }}
            >
              Clear selection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

interface FilterDialogProps {
  filterOptions: FilterOptionsResponse | null;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  loading?: boolean;
}

export const FilterDialog = ({
  filterOptions,
  activeFilters,
  onFiltersChange,
  loading,
}: FilterDialogProps) => {
  // Pending filters (local state before applying)
  const [pendingFilters, setPendingFilters] = useState<ActiveFilters>(activeFilters);
  
  // Sync pending with active when active changes externally
  useEffect(() => {
    setPendingFilters(activeFilters);
  }, [activeFilters]);

  // Check if there are unapplied changes
  const hasChanges = useMemo(() => {
    const activeKeys = Object.keys(activeFilters);
    const pendingKeys = Object.keys(pendingFilters);
    if (activeKeys.length !== pendingKeys.length) return true;
    
    for (const key of pendingKeys) {
      const activeVals = activeFilters[key] || [];
      const pendingVals = pendingFilters[key] || [];
      if (activeVals.length !== pendingVals.length) return true;
      if (!activeVals.every(v => pendingVals.includes(v))) return true;
    }
    return false;
  }, [activeFilters, pendingFilters]);

  const handleToggle = (key: FilterKey, value: string) => {
    const currentValues = pendingFilters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newFilters = { ...pendingFilters };
    if (newValues.length === 0) {
      delete newFilters[key];
    } else {
      newFilters[key] = newValues;
    }
    setPendingFilters(newFilters);
  };

  const handleClear = (key: FilterKey) => {
    const newFilters = { ...pendingFilters };
    delete newFilters[key];
    setPendingFilters(newFilters);
  };

  const handleSelectAll = (key: FilterKey, values: string[]) => {
    const newFilters = { ...pendingFilters, [key]: values };
    setPendingFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(pendingFilters);
  };

  const handleClearAll = () => {
    setPendingFilters({});
    onFiltersChange({});
  };

  const handleRemoveFilter = (key: string, value: string) => {
    const currentValues = pendingFilters[key] || [];
    const newValues = currentValues.filter((v) => v !== value);

    const newFilters = { ...pendingFilters };
    if (newValues.length === 0) {
      delete newFilters[key];
    } else {
      newFilters[key] = newValues;
    }
    setPendingFilters(newFilters);
    // Also apply immediately when removing via badge
    onFiltersChange(newFilters);
  };

  // Get options per section — empty array if no data
  const sectionOptions = useMemo(() => {
    return FILTER_SECTIONS.map((section) => ({
      ...section,
      options: (filterOptions?.[section.key] as FilterOptionItem[] | undefined) || [],
    }));
  }, [filterOptions]);

  const totalPendingFilters = Object.values(pendingFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  // Flatten active (applied) filters into badges
  const activeFilterBadges = Object.entries(activeFilters).flatMap(([key, values]) =>
    (values || []).map((value) => ({ key, value }))
  );

  if (!filterOptions) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
    <div className="flex flex-wrap items-center gap-2">
      {/* Filter buttons - use pendingFilters for display */}
      {sectionOptions.map((section) => {
        const isEmpty = section.options.length === 0;
        if (isEmpty) {
          return (
            <Tooltip key={section.key}>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="h-7 px-2.5 gap-1 font-normal text-muted-foreground/50 cursor-not-allowed"
                  >
                    <span className="text-xs">{section.label}</span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">No {section.label.toLowerCase()} data available</p>
              </TooltipContent>
            </Tooltip>
          );
        }
        const walletTierRenderer = section.key === "wallet_tiers"
          ? (option: FilterOptionItem, allOptions: FilterOptionItem[]) => {
              const totalCount = allOptions.reduce((sum, o) => sum + o.count, 0);
              const percentage = totalCount > 0 ? (option.count / totalCount) * 100 : 0;
              const descriptor = WALLET_TIER_LABELS[option.value] || "";
              return (
                <>
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/5"
                    style={{ width: `${percentage}%` }}
                  />
                  <span className="relative z-10 flex items-center gap-2.5 pl-7 flex-1 min-w-0">
                    <span className="text-sm truncate">{option.value}</span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground/60 shrink-0 ml-auto">
                      {descriptor}
                    </span>
                  </span>
                  <span className="relative z-10 text-xs text-muted-foreground tabular-nums shrink-0">
                    {option.count.toLocaleString()}
                  </span>
                </>
              );
            }
          : undefined;
        return (
          <FilterButton
            key={section.key}
            label={section.label}
            options={section.options}
            selectedValues={pendingFilters[section.key] || []}
            onToggle={(value) => handleToggle(section.key, value)}
            onSelectAll={(values) => handleSelectAll(section.key, values)}
            onClear={() => handleClear(section.key)}
            customOrder={section.customOrder}
            renderCustomOption={walletTierRenderer}
          />
        );
      })}

      {/* Apply button - only show when there are unapplied changes */}
      {hasChanges && (
        <Button
          size="sm"
          className="h-7 px-3 gap-1.5"
          onClick={handleApply}
        >
          <Check className="h-3.5 w-3.5" />
          Apply
        </Button>
      )}

      {/* Active filter badges (applied filters) */}
      {activeFilterBadges.length > 0 && (
        <>
          <div className="h-4 w-px bg-border mx-1" />
          {activeFilterBadges.slice(0, 4).map(({ key, value }) => (
            <Badge
              key={`${key}-${value}`}
              variant="secondary"
              className="h-6 gap-1 pl-2 pr-1 bg-primary/10 text-primary hover:bg-primary/15"
            >
              <span className="text-xs truncate max-w-[100px]">{value}</span>
              <button
                onClick={() => handleRemoveFilter(key, value)}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {activeFilterBadges.length > 4 && (
            <Badge variant="secondary" className="h-6 px-2 bg-muted text-muted-foreground text-xs">
              +{activeFilterBadges.length - 4}
            </Badge>
          )}
          <button
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-foreground ml-1"
          >
            Clear
          </button>
        </>
      )}
    </div>
    </TooltipProvider>
  );
};
