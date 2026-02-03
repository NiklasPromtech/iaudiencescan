import { useState, useEffect } from "react";
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
import { Filter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterOptionsResponse, ActiveFilters } from "@/lib/api";

interface FilterSection {
  key: keyof Omit<FilterOptionsResponse, "success" | "tag_id" | "cost_sources">;
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
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  // Sync pending filters with active filters when dialog opens
  useEffect(() => {
    if (open) {
      setPendingFilters({ ...activeFilters });
      setSearchTerms({});
    }
  }, [open, activeFilters]);

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

  const availableSections = FILTER_SECTIONS.filter((section) => {
    const options = filterOptions?.[section.key];
    return options && Array.isArray(options) && options.length > 0;
  });

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
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Data
              {totalPendingFilters > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {totalPendingFilters} selected
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-6 py-4">
              {availableSections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No filter options available yet. Data will appear as traffic comes in.
                </p>
              ) : (
                availableSections.map((section) => {
                  const options = filterOptions?.[section.key] as string[] | undefined;
                  if (!options || options.length === 0) return null;

                  const searchTerm = searchTerms[section.key] || "";
                  const filteredOptions = options.filter((opt) =>
                    opt.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  const selectedValues = pendingFilters[section.key] || [];

                  return (
                    <div key={section.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">
                          {section.label}
                        </h4>
                        {selectedValues.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {selectedValues.length} selected
                          </Badge>
                        )}
                      </div>

                      {options.length > 5 && (
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            placeholder={`Search ${section.label.toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) =>
                              setSearchTerms((prev) => ({
                                ...prev,
                                [section.key]: e.target.value,
                              }))
                            }
                            className="h-8 pl-8 text-sm"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                          <p className="text-xs text-muted-foreground col-span-full py-2">
                            No matches found
                          </p>
                        ) : (
                          filteredOptions.map((option) => {
                            const isSelected = selectedValues.includes(option);
                            return (
                              <label
                                key={option}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors text-sm",
                                  isSelected
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-border hover:bg-muted/50"
                                )}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    handleToggle(section.key, option)
                                  }
                                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <span className="truncate text-foreground">
                                  {option}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="ghost"
              onClick={handleClear}
              disabled={totalPendingFilters === 0}
              className="flex-1 sm:flex-none"
            >
              Clear
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 sm:flex-none"
            >
              Apply Filters
              {totalPendingFilters > 0 && ` (${totalPendingFilters})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
