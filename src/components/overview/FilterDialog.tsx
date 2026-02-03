import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, Search, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterOptionsResponse, ActiveFilters, FilterOptionItem } from "@/lib/api";

type FilterKey = "sources" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "countries";

interface FilterSection {
  key: FilterKey;
  label: string;
}

const FILTER_SECTIONS: FilterSection[] = [
  { key: "sources", label: "Source" },
  { key: "utm_source", label: "UTM Source" },
  { key: "utm_medium", label: "UTM Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "utm_content", label: "Content" },
  { key: "utm_term", label: "Term" },
  { key: "countries", label: "Country" },
];

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
  const [open, setOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<ActiveFilters>({});
  const [activeTab, setActiveTab] = useState<FilterKey>("sources");
  const [searchTerm, setSearchTerm] = useState("");

  // Get available sections (those with data)
  const availableSections = useMemo(() => {
    return FILTER_SECTIONS.filter((section) => {
      const options = filterOptions?.[section.key] as FilterOptionItem[] | undefined;
      return options && Array.isArray(options) && options.length > 0;
    });
  }, [filterOptions]);

  // Sync pending filters with active filters when dialog opens
  useEffect(() => {
    if (open) {
      setPendingFilters({ ...activeFilters });
      setSearchTerm("");
      // Set first available tab
      if (availableSections.length > 0 && !availableSections.find(s => s.key === activeTab)) {
        setActiveTab(availableSections[0].key);
      }
    }
  }, [open, activeFilters, availableSections]);

  // Reset search when changing tabs
  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

  const handleToggle = (key: string, value: string) => {
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

  const handleApply = () => {
    onFiltersChange(pendingFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setPendingFilters({});
  };

  const handleRemoveActiveFilter = (key: string, value: string) => {
    const currentValues = activeFilters[key] || [];
    const newValues = currentValues.filter((v) => v !== value);

    const newFilters = { ...activeFilters };
    if (newValues.length === 0) {
      delete newFilters[key];
    } else {
      newFilters[key] = newValues;
    }
    onFiltersChange(newFilters);
  };

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  const totalPendingFilters = Object.values(pendingFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  // Get current tab's options
  const currentOptions = useMemo(() => {
    const rawOptions = filterOptions?.[activeTab] as FilterOptionItem[] | undefined;
    if (!rawOptions) return [];
    
    // Sort by count descending
    const sorted = [...rawOptions].sort((a, b) => b.count - a.count);
    
    // Filter by search
    if (searchTerm) {
      return sorted.filter((opt) =>
        opt.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return sorted;
  }, [filterOptions, activeTab, searchTerm]);

  const currentSelectedValues = pendingFilters[activeTab] || [];
  const currentLabel = FILTER_SECTIONS.find(s => s.key === activeTab)?.label || "";

  // Flatten active filters into badges
  const activeFilterBadges = Object.entries(activeFilters).flatMap(([key, values]) =>
    (values || []).map((value) => ({ key, value }))
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 gap-2",
            totalActiveFilters > 0 && "border-primary/50 bg-primary/5"
          )}
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {totalActiveFilters > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 min-w-5 px-1.5 bg-primary/20 text-primary text-xs"
            >
              {totalActiveFilters}
            </Badge>
          )}
        </Button>

        {/* Active filter badges */}
        {activeFilterBadges.map(({ key, value }) => (
          <Badge
            key={`${key}-${value}`}
            variant="secondary"
            className="h-7 gap-1 pl-2.5 pr-1.5 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <span className="text-xs truncate max-w-[150px]">{value}</span>
            <button
              onClick={() => handleRemoveActiveFilter(key, value)}
              className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {totalActiveFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onFiltersChange({})}
          >
            Clear all
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filter Data
            </DialogTitle>
          </DialogHeader>

          {availableSections.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No filter options available yet. Data will appear as traffic comes in.
              </p>
            </div>
          ) : (
            <div className="flex min-h-[400px]">
              {/* Left sidebar - categories */}
              <div className="w-44 border-r border-border bg-muted/30 py-2">
                {availableSections.map((section) => {
                  const count = pendingFilters[section.key]?.length || 0;
                  const isActive = activeTab === section.key;
                  
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveTab(section.key)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left",
                        isActive 
                          ? "bg-background text-foreground font-medium border-r-2 border-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      )}
                    >
                      <span>{section.label}</span>
                      {count > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="h-5 min-w-5 px-1.5 text-xs bg-primary/20 text-primary"
                        >
                          {count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right content - options */}
              <div className="flex-1 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${currentLabel.toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                </div>

                {/* Options list */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-1">
                    {currentOptions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        {searchTerm ? "No matches found" : "No options available"}
                      </p>
                    ) : (
                      currentOptions.slice(0, 50).map((option) => {
                        const isSelected = currentSelectedValues.includes(option.value);
                        return (
                          <label
                            key={option.value}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                              isSelected
                                ? "bg-primary/10"
                                : "hover:bg-muted/50"
                            )}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleToggle(activeTab, option.value)}
                              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className="flex-1 text-sm text-foreground truncate">
                              {option.value}
                            </span>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {option.count.toLocaleString()}
                            </span>
                          </label>
                        );
                      })
                    )}
                    {currentOptions.length > 50 && (
                      <p className="text-xs text-muted-foreground text-center pt-4">
                        Showing top 50 results. Use search to find more.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                onClick={handleClear}
                disabled={totalPendingFilters === 0}
                size="sm"
              >
                Clear all
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button onClick={handleApply} size="sm">
                  Apply
                  {totalPendingFilters > 0 && ` (${totalPendingFilters})`}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
