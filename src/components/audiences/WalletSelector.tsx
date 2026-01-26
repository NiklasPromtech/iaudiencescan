import { useState, useEffect, useCallback } from "react";
import { format, subDays, startOfDay, differenceInDays } from "date-fns";
import { WalletRow, WalletListRequest, fetchWallets, RangeConfig, FilterOptions } from "@/lib/api";
import { WalletTable } from "./WalletTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Search, ChevronDown, Loader2, Filter, X, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletSelectorProps {
  websiteId: string;
  selectedWallets: string[];
  onSelectionChange: (wallets: string[]) => void;
}

interface ActiveFilters {
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

interface DateRangeValue {
  type: "preset" | "custom";
  days?: number;
  from?: Date;
  to?: Date;
  includeToday?: boolean;
}

const WALLET_TYPES = ["connected", "staked", "purchased", "signed"];
const PAGE_SIZE = 50;

const DATE_PRESETS = [
  { days: 0, label: "Today", includeToday: true },
  { days: 1, label: "Yesterday" },
  { days: 7, label: "Last 7 days" },
  { days: 14, label: "Last 14 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
];

const FILTER_CONFIGS: { key: keyof FilterOptions; label: string }[] = [
  { key: "sources", label: "Source" },
  { key: "utm_source", label: "UTM Source" },
  { key: "utm_medium", label: "UTM Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "utm_content", label: "Content" },
  { key: "utm_term", label: "Term" },
  { key: "devices", label: "Device" },
  { key: "browsers", label: "Browser" },
  { key: "os", label: "OS" },
  { key: "bot_status", label: "Bot Status" },
];

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
  if (!options || options.length === 0) return null;

  const hasSelection = selectedValues.length > 0;

  return (
    <Popover>
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
        <div className="p-2 border-b border-border">
          <p className="text-sm font-medium text-foreground">{label}</p>
        </div>
        <ScrollArea className="max-h-64">
          <div className="p-2 space-y-1">
            {options.map((option) => {
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
            })}
          </div>
        </ScrollArea>
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

const DateRangePicker = ({
  value,
  onChange,
}: {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({
    from: value.from,
    to: value.to,
  });

  useEffect(() => {
    if (value.from && value.to) {
      setCustomRange({ from: value.from, to: value.to });
    }
  }, [value.from, value.to]);

  const getDisplayLabel = () => {
    if (value.type === "preset") {
      const preset = DATE_PRESETS.find((p) => p.days === value.days && p.includeToday === value.includeToday);
      if (preset) return preset.label;
      if (value.days !== undefined) return `Last ${value.days} days`;
    }
    if (value.type === "custom" && value.from && value.to) {
      if (value.from.getTime() === value.to.getTime()) {
        return format(value.from, "MMM d, yyyy");
      }
      return `${format(value.from, "MMM d")} – ${format(value.to, "MMM d, yyyy")}`;
    }
    return "Select dates";
  };

  const handlePresetSelect = (days: number, includeToday?: boolean) => {
    onChange({ type: "preset", days, includeToday });
    setShowCustom(false);
    setOpen(false);
  };

  const handleCustomApply = () => {
    if (customRange.from && customRange.to) {
      const today = startOfDay(new Date());
      const toDate = startOfDay(customRange.to);
      const fromDate = startOfDay(customRange.from);
      const daysFromToday = differenceInDays(today, fromDate);
      const includeToday = toDate.getTime() === today.getTime();
      
      onChange({
        type: "custom",
        from: customRange.from,
        to: customRange.to,
        days: daysFromToday,
        includeToday,
      });
      setOpen(false);
      setShowCustom(false);
    }
  };

  const isPresetSelected = (preset: typeof DATE_PRESETS[0]) => {
    if (value.type !== "preset") return false;
    return value.days === preset.days && value.includeToday === preset.includeToday;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 justify-between text-left font-normal min-w-[140px]",
            !value && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            {getDisplayLabel()}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background border border-border z-50" align="start">
        {!showCustom ? (
          <div className="p-2 space-y-1 min-w-[180px]">
            {DATE_PRESETS.map((preset) => (
              <button
                key={`${preset.days}-${preset.includeToday}`}
                onClick={() => handlePresetSelect(preset.days, preset.includeToday)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm rounded-md transition-colors",
                  "hover:bg-muted",
                  isPresetSelected(preset)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
            <Separator className="my-2" />
            <button
              onClick={() => setShowCustom(true)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm rounded-md transition-colors hover:bg-muted",
                value.type === "custom" ? "bg-primary/10 text-primary font-medium" : "text-foreground"
              )}
            >
              Custom range...
            </button>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowCustom(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
              <span className="text-sm font-medium">Custom Range</span>
            </div>
            <Calendar
              mode="range"
              selected={customRange as { from: Date; to: Date }}
              onSelect={(range) => range && setCustomRange(range)}
              numberOfMonths={2}
              disabled={(date) => date > new Date() || date < subDays(new Date(), 365)}
              className="pointer-events-auto"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {customRange.from && customRange.to ? (
                  <>
                    {format(customRange.from, "MMM d")} – {format(customRange.to, "MMM d, yyyy")}
                  </>
                ) : customRange.from ? (
                  <>
                    {format(customRange.from, "MMM d, yyyy")} → select end date
                  </>
                ) : (
                  "Select start and end dates"
                )}
              </div>
              <Button
                size="sm"
                onClick={handleCustomApply}
                disabled={!customRange.from || !customRange.to}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export function WalletSelector({
  websiteId,
  selectedWallets,
  onSelectionChange,
}: WalletSelectorProps) {
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"last_seen" | "first_seen" | "visit_count">("last_seen");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [offset, setOffset] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // New filter states
  const [dateRange, setDateRange] = useState<DateRangeValue>({ type: "preset", days: 7 });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setOffset(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const buildRangeConfig = useCallback((): RangeConfig => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (dateRange.type === "custom" && dateRange.from && dateRange.to) {
      return {
        type: "custom",
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
        timezone,
      };
    }
    
    // Handle "Today" preset
    if (dateRange.includeToday && dateRange.days === 0) {
      const today = format(new Date(), "yyyy-MM-dd");
      return {
        type: "custom",
        from: today,
        to: today,
        timezone,
      };
    }
    
    return {
      type: "last_full_days",
      days: dateRange.days ?? 7,
      timezone,
    };
  }, [dateRange]);

  const loadWallets = useCallback(async (append = false) => {
    if (!websiteId) return;

    setLoading(true);
    try {
      const range = buildRangeConfig();

      const request: WalletListRequest = {
        tag_id: websiteId,
        range,
        sort_by: sortBy,
        sort_dir: sortDir,
        limit: PAGE_SIZE,
        offset: append ? offset : 0,
      };

      if (debouncedSearch) {
        request.search = debouncedSearch;
      }

      if (types.length > 0) {
        request.types = types;
      }

      // Add active filters
      const filtersToSend: Record<string, string[]> = {};
      Object.entries(activeFilters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          filtersToSend[key] = values;
        }
      });
      if (Object.keys(filtersToSend).length > 0) {
        request.filters = filtersToSend;
      }

      const response = await fetchWallets(request);
      
      if (append) {
        setWallets(prev => [...prev, ...response.rows]);
      } else {
        setWallets(response.rows);
      }
      
      setTotalRows(response.pagination.total_rows);
      setHasMore(response.pagination.offset + response.rows.length < response.pagination.total_rows);
      
      // Update filter options if available
      if (response.filter_options) {
        setFilterOptions(response.filter_options);
      }
    } catch (error) {
      console.error("Failed to fetch wallets:", error);
    } finally {
      setLoading(false);
    }
  }, [websiteId, debouncedSearch, types, sortBy, sortDir, offset, activeFilters, buildRangeConfig]);

  // Initial load and filter changes
  useEffect(() => {
    setOffset(0);
    loadWallets(false);
  }, [websiteId, debouncedSearch, types, sortBy, sortDir, dateRange, activeFilters]);

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    loadWallets(true);
  };

  const handleTypeToggle = (type: string) => {
    setTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleFilterToggle = (key: keyof FilterOptions, value: string) => {
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
    setActiveFilters(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setTypes([]);
  };

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, arr) => sum + (arr?.length || 0),
    0
  ) + types.length;

  const availableFilters = FILTER_CONFIGS.filter(
    (config) =>
      filterOptions?.[config.key] && filterOptions[config.key].length > 0
  );

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_seen">Last Seen</SelectItem>
            <SelectItem value="first_seen">First Seen</SelectItem>
            <SelectItem value="visit_count">Visits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        {/* Wallet Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-8 border-border bg-background hover:bg-muted/50",
                types.length > 0 && "border-primary/50 bg-primary/5"
              )}
            >
              Type {types.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1.5 bg-primary/20 text-primary text-xs">
                  {types.length}
                </Badge>
              )}
              <ChevronDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover">
            {WALLET_TYPES.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={types.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              >
                {type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dynamic Filters from API */}
        {availableFilters.map((config) => (
          <FilterDropdown
            key={config.key}
            filterKey={config.key}
            label={config.label}
            options={filterOptions?.[config.key] || []}
            selectedValues={activeFilters[config.key] || []}
            onToggle={handleFilterToggle}
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

      {/* Selection Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Selected: {selectedWallets.length} wallets</span>
        <span>
          Showing {wallets.length} of {totalRows}
        </span>
      </div>

      <WalletTable
        wallets={wallets}
        selectedWallets={selectedWallets}
        onSelectionChange={onSelectionChange}
        loading={loading && wallets.length === 0}
      />

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
