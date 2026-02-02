import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Filter, X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  sources: string[];
  utm_source: string[];
  utm_medium: string[];
  utm_campaign: string[];
  utm_content: string[];
  utm_term: string[];
  devices: string[];
  browsers: string[];
  os: string[];
  countries: string[];
  bot_status: string[];
}

export interface ActiveFilters {
  sources?: string[];
  utm_source?: string[];
  utm_medium?: string[];
  utm_campaign?: string[];
  utm_content?: string[];
  utm_term?: string[];
  devices?: string[];
  browsers?: string[];
  os?: string[];
  countries?: string[];
  bot_status?: string[];
}

interface FilterConfig {
  key: keyof FilterOptions;
  label: string;
  icon?: string;
}

const FILTER_CONFIGS: FilterConfig[] = [
  { key: "sources", label: "Source" },
  { key: "utm_source", label: "UTM Source" },
  { key: "utm_medium", label: "UTM Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "utm_content", label: "Content" },
  { key: "utm_term", label: "Term" },
  { key: "devices", label: "Device" },
  { key: "browsers", label: "Browser" },
  { key: "os", label: "OS" },
  { key: "countries", label: "Country" },
  { key: "bot_status", label: "Bot Status" },
];

interface ScorecardFiltersProps {
  filterOptions: FilterOptions | null;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  loading?: boolean;
}

const FilterDropdown = ({
  filterKey,
  label,
  options,
  selectedValues,
  onToggle,
}: {
  filterKey: keyof FilterOptions;
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (key: keyof FilterOptions, value: string) => void;
}) => {
  const [search, setSearch] = useState("");
  
  if (!options || options.length === 0) return null;

  const hasSelection = selectedValues.length > 0;
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover onOpenChange={() => setSearch("")}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-border bg-background hover:bg-muted/50",
            hasSelection && "border-primary/50 bg-primary/5"
          )}
        >
          <span className="text-sm">{label}</span>
          {hasSelection && (
            <Badge
              variant="secondary"
              className="ml-1.5 h-5 min-w-5 px-1.5 bg-primary/20 text-primary text-xs"
            >
              {selectedValues.length}
            </Badge>
          )}
          <ChevronDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 bg-popover border-border z-50"
        align="start"
      >
        <div className="p-2 border-b border-border space-y-2">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 text-sm bg-background"
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <div className="p-2 space-y-1">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No results found
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggle(filterKey, option)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-foreground truncate">
                      {option}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
        {hasSelection && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                selectedValues.forEach((v) => onToggle(filterKey, v));
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

export const ScorecardFilters = ({
  filterOptions,
  activeFilters,
  onFiltersChange,
  loading,
}: ScorecardFiltersProps) => {
  const handleToggle = (key: keyof FilterOptions, value: string) => {
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

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  );

  const availableFilters = FILTER_CONFIGS.filter(
    (config) =>
      filterOptions?.[config.key] && filterOptions[config.key].length > 0
  );

  if (!filterOptions || availableFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      {availableFilters.map((config) => (
        <FilterDropdown
          key={config.key}
          filterKey={config.key}
          label={config.label}
          options={filterOptions[config.key]}
          selectedValues={activeFilters[config.key] || []}
          onToggle={handleToggle}
        />
      ))}

      {totalActiveFilters > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
          onClick={clearAllFilters}
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Clear all
          <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
            {totalActiveFilters}
          </Badge>
        </Button>
      )}
    </div>
  );
};
