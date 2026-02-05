import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Loader2, TrendingUp, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { IncrementalityResultsView, type IncrementalityResult } from "./IncrementalityResultsView";
import { fetchFilterOptions, FilterOptionItem, FilterOptionsResponse } from "@/lib/api";

interface TouchpointForAnalysis {
  id: string;
  name: string;
  event_type: string;
  timestamp: string | null;
  start_date: string | null;
  end_date: string | null;
  cost_amount?: number | null;
  cost_currency?: string | null;
}

interface IncrementalityAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  touchpoint: TouchpointForAnalysis | null;
}

const LOOK_WINDOW_OPTIONS = [
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "12h", label: "12 hours" },
  { value: "24h", label: "24 hours" },
  { value: "2d", label: "2 days" },
  { value: "5d", label: "5 days" },
  { value: "7d", label: "7 days" },
];

const BREAKDOWN_OPTIONS = [
  { value: "utm_source", label: "UTM Source" },
  { value: "utm_medium", label: "UTM Medium" },
  { value: "utm_campaign", label: "UTM Campaign" },
  { value: "utm_content", label: "UTM Content" },
  { value: "utm_term", label: "UTM Term" },
  { value: "country", label: "Country" },
  { value: "region", label: "Region" },
  { value: "city", label: "City" },
  { value: "referrer_domain", label: "Referrer Domain" },
];

type FilterKey = "sources" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "countries";

interface FilterSection {
  key: FilterKey;
  label: string;
}

const INCLUDE_FILTER_SECTIONS: FilterSection[] = [
  { key: "sources", label: "Source" },
  { key: "utm_source", label: "UTM Source" },
  { key: "utm_medium", label: "Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "countries", label: "Country" },
];

const EXCLUDE_FILTER_SECTIONS: FilterSection[] = [
  { key: "sources", label: "Source" },
  { key: "utm_source", label: "UTM Source" },
];

interface MultiSelectFilterProps {
  label: string;
  options: FilterOptionItem[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onSelectAll: (values: string[]) => void;
  onClear: () => void;
  variant?: "include" | "exclude";
}

const MultiSelectFilter = ({
  label,
  options,
  selectedValues,
  onToggle,
  onSelectAll,
  onClear,
  variant = "include",
}: MultiSelectFilterProps) => {
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

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setSearch("");
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2.5 gap-1 font-normal text-muted-foreground hover:text-foreground",
            hasSelection && variant === "include" && "text-primary bg-primary/5 hover:bg-primary/10",
            hasSelection && variant === "exclude" && "text-destructive bg-destructive/5 hover:bg-destructive/10"
          )}
        >
          <span className="text-xs">{label}</span>
          {hasSelection && (
            <Badge
              variant="secondary"
              className={cn(
                "h-4 min-w-4 px-1 text-[10px]",
                variant === "include" && "bg-primary/20 text-primary",
                variant === "exclude" && "bg-destructive/20 text-destructive"
              )}
            >
              {selectedValues.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-popover z-50" align="start" sideOffset={4}>
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
              {selectedValues.length} selected
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
        <ScrollArea className="max-h-48">
          <div className="p-2">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {search ? "No matches found" : "No options"}
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
                      <span className="flex-1 text-sm truncate">{option.value}</span>
                      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                        {option.count.toLocaleString()}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
        {hasSelection && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={onClear}
            >
              Clear selection
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export function IncrementalityAnalysisDialog({
  open,
  onOpenChange,
  touchpoint,
}: IncrementalityAnalysisDialogProps) {
  const { selectedWebsite } = useSelectedWebsite();
  
  // Configuration state
  const [baselineDays, setBaselineDays] = useState(21);
  const [lookWindow, setLookWindow] = useState("24h");
  const [breakdowns, setBreakdowns] = useState<string[]>([]);
  
  // Filter state
  const [includeFilters, setIncludeFilters] = useState<Record<FilterKey, string[]>>({
    sources: [],
    utm_source: [],
    utm_medium: [],
    utm_campaign: [],
    utm_content: [],
    utm_term: [],
    countries: [],
  });
  const [excludeFilters, setExcludeFilters] = useState<Record<FilterKey, string[]>>({
    sources: [],
    utm_source: [],
    utm_medium: [],
    utm_campaign: [],
    utm_content: [],
    utm_term: [],
    countries: [],
  });
  const [excludeBots, setExcludeBots] = useState(true);
  const [utmFree, setUtmFree] = useState(false);
  
  // Filter options from API
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Results state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IncrementalityResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Fetch filter options when dialog opens
  useEffect(() => {
    if (open && selectedWebsite?.tag_id && !filterOptions) {
      setLoadingFilters(true);
      fetchFilterOptions({
        tag_id: selectedWebsite.tag_id,
        range: {
          type: "last_full_days",
          days: 90,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      })
        .then(setFilterOptions)
        .catch(() => {})
        .finally(() => setLoadingFilters(false));
    }
  }, [open, selectedWebsite?.tag_id, filterOptions]);

  if (!touchpoint) return null;

  const toggleBreakdown = (value: string) => {
    setBreakdowns((prev) =>
      prev.includes(value)
        ? prev.filter((b) => b !== value)
        : [...prev, value]
    );
  };

  const handleIncludeToggle = (key: FilterKey, value: string) => {
    setIncludeFilters(prev => {
      const current = prev[key] || [];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleIncludeSelectAll = (key: FilterKey, values: string[]) => {
    setIncludeFilters(prev => ({ ...prev, [key]: values }));
  };

  const handleIncludeClear = (key: FilterKey) => {
    setIncludeFilters(prev => ({ ...prev, [key]: [] }));
  };

  const handleExcludeToggle = (key: FilterKey, value: string) => {
    setExcludeFilters(prev => {
      const current = prev[key] || [];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleExcludeSelectAll = (key: FilterKey, values: string[]) => {
    setExcludeFilters(prev => ({ ...prev, [key]: values }));
  };

  const handleExcludeClear = (key: FilterKey) => {
    setExcludeFilters(prev => ({ ...prev, [key]: [] }));
  };

  const handleAnalyze = async () => {
    if (!selectedWebsite?.tag_id) {
      toast.error("No website selected");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        toast.error("You must be logged in");
        setLoading(false);
        return;
      }

      // Build request payload
      const payload: Record<string, unknown> = {
        tag_id: selectedWebsite.tag_id,
        event_name: touchpoint.name,
        event_type: touchpoint.event_type,
        time: {
          timestamp: touchpoint.timestamp,
          start_date: touchpoint.start_date,
          end_date: touchpoint.end_date,
        },
        baseline_days: baselineDays,
        look_window: lookWindow,
      };

      // Add cost if present
      if (touchpoint.cost_amount && touchpoint.cost_amount > 0) {
        payload.cost = {
          amount: touchpoint.cost_amount,
          currency: touchpoint.cost_currency || "USD",
        };
      }

      // Build filters
      const filters: Record<string, unknown> = {};
      const include: Record<string, string[]> = {};
      const exclude: Record<string, string[]> = {};

      // Add utm_free filter
      if (utmFree) {
        filters.utm_free = true;
      }

      // Build include filters
      Object.entries(includeFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          include[key] = values;
        }
      });

      // Build exclude filters
      Object.entries(excludeFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          exclude[key] = values;
        }
      });

      if (excludeBots) {
        exclude.bot_status = ["bot"];
      }

      if (Object.keys(include).length > 0) {
        filters.include = include;
      }
      if (Object.keys(exclude).length > 0) {
        filters.exclude = exclude;
      }

      if (Object.keys(filters).length > 0) {
        payload.filters = filters;
      }

      // Add breakdowns
      if (breakdowns.length) {
        payload.breakdowns = breakdowns;
      }

      const response = await fetch("https://cdn.audiencescan.io/api/analytics/incrementality/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate report");
      }

      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Incrementality analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const handleClose = () => {
    setShowResults(false);
    setResults(null);
    onOpenChange(false);
  };

  // Show results view
  if (showResults && results) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Uplift Report: {touchpoint.name}
            </DialogTitle>
          </DialogHeader>
          <IncrementalityResultsView result={results} />
          <DialogFooter>
            <Button variant="outline" onClick={handleBack}>
              Back to Configuration
            </Button>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Configuration view
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Analyze: {touchpoint.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Baseline Days */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Baseline Period</Label>
              <span className="text-sm font-medium text-foreground">{baselineDays} days</span>
            </div>
            <Slider
              value={[baselineDays]}
              onValueChange={(v) => setBaselineDays(v[0])}
              min={2}
              max={90}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Days before the event to establish your "normal" traffic baseline (min 2)
            </p>
          </div>

          {/* Look Window (only for single events) */}
          {touchpoint.event_type === "single" && (
            <div className="space-y-2">
              <Label>Measurement Window</Label>
              <Select value={lookWindow} onValueChange={setLookWindow}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOOK_WINDOW_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How long after the event to measure the impact
              </p>
            </div>
          )}

          {/* Breakdowns */}
          <div className="space-y-3">
            <Label>Breakdown By (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {BREAKDOWN_OPTIONS.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={breakdowns.includes(opt.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleBreakdown(opt.value)}
                >
                  {opt.label}
                  {breakdowns.includes(opt.value) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              See which sources/countries drove the most incremental traffic
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Filters (optional)</Label>
              {loadingFilters && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            
            {/* UTM Free toggle */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="utm-free"
                checked={utmFree}
                onCheckedChange={(checked) => setUtmFree(!!checked)}
              />
              <Label htmlFor="utm-free" className="text-sm font-normal cursor-pointer">
                Organic traffic only (no UTM parameters)
              </Label>
            </div>

            {/* Include Filters */}
            {!utmFree && filterOptions && (
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Include</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {INCLUDE_FILTER_SECTIONS.map((section) => {
                    const options = (filterOptions[section.key] as FilterOptionItem[]) || [];
                    if (options.length === 0) return null;
                    return (
                      <MultiSelectFilter
                        key={`include-${section.key}`}
                        label={section.label}
                        options={options}
                        selectedValues={includeFilters[section.key] || []}
                        onToggle={(value) => handleIncludeToggle(section.key, value)}
                        onSelectAll={(values) => handleIncludeSelectAll(section.key, values)}
                        onClear={() => handleIncludeClear(section.key)}
                        variant="include"
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Exclude Filters */}
            {filterOptions && (
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Exclude</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {EXCLUDE_FILTER_SECTIONS.map((section) => {
                    const options = (filterOptions[section.key] as FilterOptionItem[]) || [];
                    if (options.length === 0) return null;
                    return (
                      <MultiSelectFilter
                        key={`exclude-${section.key}`}
                        label={section.label}
                        options={options}
                        selectedValues={excludeFilters[section.key] || []}
                        onToggle={(value) => handleExcludeToggle(section.key, value)}
                        onSelectAll={(values) => handleExcludeSelectAll(section.key, values)}
                        onClear={() => handleExcludeClear(section.key)}
                        variant="exclude"
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                id="exclude-bots"
                checked={excludeBots}
                onCheckedChange={(checked) => setExcludeBots(!!checked)}
              />
              <Label htmlFor="exclude-bots" className="text-sm font-normal cursor-pointer">
                Exclude bot traffic
              </Label>
            </div>
          </div>

          {/* Cost info */}
          {touchpoint.cost_amount && touchpoint.cost_amount > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <span className="text-muted-foreground">Marketing spend: </span>
              <span className="font-medium">
                {touchpoint.cost_currency || "USD"}{" "}
                {touchpoint.cost_amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                This will be used to calculate your incremental CPA
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Uplift Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
