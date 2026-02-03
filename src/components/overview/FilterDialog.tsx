import { useState, useMemo } from "react";
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
import { X, Search } from "lucide-react";
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
  { key: "utm_medium", label: "Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "utm_content", label: "Content" },
  { key: "utm_term", label: "Term" },
  { key: "countries", label: "Country" },
];

interface FilterButtonProps {
  label: string;
  options: FilterOptionItem[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

const FilterButton = ({
  label,
  options,
  selectedValues,
  onToggle,
  onClear,
}: FilterButtonProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const hasSelection = selectedValues.length > 0;

  const filteredOptions = useMemo(() => {
    const sorted = [...options].sort((a, b) => b.count - a.count);
    if (!search) return sorted.slice(0, 20);
    return sorted.filter((opt) =>
      opt.value.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);
  }, [options, search]);

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
        {/* Search */}
        <div className="p-3 border-b border-border">
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
        </div>

        {/* Options */}
        <ScrollArea className="max-h-64">
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
                        "flex items-center gap-2.5 px-2 py-1.5 rounded cursor-pointer transition-colors",
                        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                      )}
                    >
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
  
  const handleToggle = (key: FilterKey, value: string) => {
    const currentValues = activeFilters[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newFilters = { ...activeFilters };
    if (newValues.length === 0) {
      delete newFilters[key];
    } else {
      newFilters[key] = newValues;
    }
    onFiltersChange(newFilters);
  };

  const handleClear = (key: FilterKey) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    onFiltersChange({});
  };

  const handleRemoveFilter = (key: string, value: string) => {
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

  // Get available sections (those with data)
  const availableSections = useMemo(() => {
    return FILTER_SECTIONS.filter((section) => {
      const options = filterOptions?.[section.key] as FilterOptionItem[] | undefined;
      return options && Array.isArray(options) && options.length > 0;
    });
  }, [filterOptions]);

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  // Flatten active filters into badges
  const activeFilterBadges = Object.entries(activeFilters).flatMap(([key, values]) =>
    (values || []).map((value) => ({ key, value }))
  );

  if (!filterOptions || availableSections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Filter buttons */}
      {availableSections.map((section) => (
        <FilterButton
          key={section.key}
          label={section.label}
          options={(filterOptions[section.key] as FilterOptionItem[]) || []}
          selectedValues={activeFilters[section.key] || []}
          onToggle={(value) => handleToggle(section.key, value)}
          onClear={() => handleClear(section.key)}
        />
      ))}

      {/* Active filter badges */}
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
  );
};
