import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Calendar } from "@/components/ui/calendar";
import {
  TrendingUp,
  CalendarIcon,
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { fetchFilterOptions, FilterOptionItem, FilterOptionsResponse } from "@/lib/api";
import { IncrementalityResultsView, type IncrementalityResult } from "@/components/touchpoints/IncrementalityResultsView";

const LOOK_WINDOW_OPTIONS = [
  { value: "6h", label: "6 hours" },
  { value: "12h", label: "12 hours" },
  { value: "24h", label: "24 hours" },
  { value: "2d", label: "2 days" },
  { value: "5d", label: "5 days" },
  { value: "7d", label: "7 days" },
  { value: "14d", label: "14 days" },
  { value: "30d", label: "30 days" },
];

const BREAKDOWN_OPTIONS = [
  { value: "conversion_event", label: "Conversion Event" },
  { value: "wallet_action", label: "Wallet Action" },
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

type FilterKey = "sources" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "countries" | "wallet_actions";

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
  { key: "wallet_actions", label: "Wallet Action" },
];

const EXCLUDE_FILTER_SECTIONS: FilterSection[] = [
  { key: "sources", label: "Source" },
  { key: "utm_source", label: "UTM Source" },
  { key: "wallet_actions", label: "Wallet Action" },
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

const Change = () => {
  const { selectedWebsite } = useSelectedWebsite();
  
  // Date selection
  const [eventDate, setEventDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [eventName, setEventName] = useState("");
  
  // Configuration state
  const [baselineDays, setBaselineDays] = useState(21);
  const [lookWindow, setLookWindow] = useState("24h");
  const [breakdowns, setBreakdowns] = useState<string[]>(["conversion_event", "wallet_action", "utm_source", "country"]);
  
  // Filter state
  const [includeFilters, setIncludeFilters] = useState<Record<FilterKey, string[]>>({
    sources: [],
    utm_source: [],
    utm_medium: [],
    utm_campaign: [],
    utm_content: [],
    utm_term: [],
    countries: [],
    wallet_actions: [],
  });
  const [excludeFilters, setExcludeFilters] = useState<Record<FilterKey, string[]>>({
    sources: [],
    utm_source: [],
    utm_medium: [],
    utm_campaign: [],
    utm_content: [],
    utm_term: [],
    countries: [],
    wallet_actions: [],
  });
  const [excludeBots, setExcludeBots] = useState(true);
  const [utmFree, setUtmFree] = useState(false);
  
  // Filter options from API
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse | null>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Results state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IncrementalityResult | null>(null);

  // Fetch filter options
  useEffect(() => {
    if (selectedWebsite?.tag_id && !filterOptions) {
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
  }, [selectedWebsite?.tag_id, filterOptions]);

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

  const getFilterOptionsForKey = (key: FilterKey): FilterOptionItem[] => {
    if (!filterOptions) return [];
    switch (key) {
      case "sources":
        return filterOptions.sources ?? [];
      case "utm_source":
        return filterOptions.utm_source ?? [];
      case "utm_medium":
        return filterOptions.utm_medium ?? [];
      case "utm_campaign":
        return filterOptions.utm_campaign ?? [];
      case "utm_content":
        return filterOptions.utm_content ?? [];
      case "utm_term":
        return filterOptions.utm_term ?? [];
      case "countries":
        return filterOptions.countries ?? [];
      case "wallet_actions":
        return filterOptions.wallet_actions ?? [];
      default:
        return [];
    }
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
        event_name: eventName || `Analysis ${format(eventDate, "MMM d, yyyy")}`,
        event_type: endDate ? "range" : "single",
        time: endDate 
          ? {
              start_date: format(eventDate, "yyyy-MM-dd"),
              end_date: format(endDate, "yyyy-MM-dd"),
            }
          : {
              timestamp: format(eventDate, "yyyy-MM-dd") + "T00:00:00Z",
            },
        baseline_days: baselineDays,
        look_window: lookWindow,
      };

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
    } catch (error) {
      console.error("Change analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const [viewMode, setViewMode] = useState<"basic" | "advanced">("basic");

  const totalIncludeFilters = Object.values(includeFilters).flat().length;
  const totalExcludeFilters = Object.values(excludeFilters).flat().length;

  if (!selectedWebsite) {
    return (
      <DashboardLayout>
        <div className="container max-w-4xl py-8 px-4">
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Please select a website first</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="border-primary/30 text-primary mb-3">
            <Sparkles className="h-3 w-3 mr-1.5" />
            Insights
          </Badge>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Measure Change
            </h1>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "basic" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewMode("basic")}
              >
                Basic
              </Button>
              <Button
                variant={viewMode === "advanced" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewMode("advanced")}
              >
                Advanced
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Quantify the incremental impact of any date or period. Compare performance against a baseline 
            to discover what actually moved the needle — because incremental is the only thing that matters.
          </p>
        </div>

        {/* Results View */}
        {results ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Analysis Results
              </h2>
              <Button variant="outline" onClick={() => setResults(null)}>
                New Analysis
              </Button>
            </div>
            <IncrementalityResultsView result={results} />
          </div>
        ) : (
          <div className="space-y-6">
            {viewMode === "basic" && (
              <Card className="bg-black min-h-[400px] flex items-center justify-center border-border/50">
                <p className="text-muted-foreground text-sm">Basic setup coming soon</p>
              </Card>
            )}

            {viewMode === "advanced" && <>
            {/* Hero Card - Date Selection */}
            <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-foreground mb-1">
                    What changed?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Pick a date or date range to analyze. We'll compare it against the baseline period before it.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Event Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Analysis Name (optional)</Label>
                  <Input
                    placeholder="e.g., Product launch, Campaign start..."
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Event Date / Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !eventDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={(date) => date && setEventDate(date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date (for range) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date (optional, for range)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Single day analysis"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date > new Date() || date < eventDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {endDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground"
                      onClick={() => setEndDate(undefined)}
                    >
                      Clear end date
                    </Button>
                  )}
                </div>

                {/* Look Window */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Look Window</Label>
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
                </div>
              </div>

              {/* Baseline Days Slider */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Baseline Period</Label>
                  <span className="text-sm text-muted-foreground">{baselineDays} days before event</span>
                </div>
                <Slider
                  value={[baselineDays]}
                  onValueChange={([v]) => setBaselineDays(v)}
                  min={2}
                  max={90}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  A longer baseline provides more stable "expected" values but may miss seasonal patterns.
                </p>
              </div>
            </Card>

            {/* Filters Card */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-foreground mb-4">Traffic Filters</h3>
              
              <div className="space-y-4">
                {/* Include Filters */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Include</span>
                    {totalIncludeFilters > 0 && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                        {totalIncludeFilters}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {loadingFilters ? (
                      <Skeleton className="h-7 w-24" />
                    ) : (
                      INCLUDE_FILTER_SECTIONS.map((section) => (
                        <MultiSelectFilter
                          key={section.key}
                          label={section.label}
                          options={getFilterOptionsForKey(section.key)}
                          selectedValues={includeFilters[section.key] || []}
                          onToggle={(value) => handleIncludeToggle(section.key, value)}
                          onSelectAll={(values) => handleIncludeSelectAll(section.key, values)}
                          onClear={() => handleIncludeClear(section.key)}
                          variant="include"
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Exclude Filters */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Exclude</span>
                    {totalExcludeFilters > 0 && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                        {totalExcludeFilters}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {loadingFilters ? (
                      <Skeleton className="h-7 w-24" />
                    ) : (
                      EXCLUDE_FILTER_SECTIONS.map((section) => (
                        <MultiSelectFilter
                          key={section.key}
                          label={section.label}
                          options={getFilterOptionsForKey(section.key)}
                          selectedValues={excludeFilters[section.key] || []}
                          onToggle={(value) => handleExcludeToggle(section.key, value)}
                          onSelectAll={(values) => handleExcludeSelectAll(section.key, values)}
                          onClear={() => handleExcludeClear(section.key)}
                          variant="exclude"
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={excludeBots}
                      onCheckedChange={(checked) => setExcludeBots(!!checked)}
                    />
                    <span className="text-sm">Exclude bots</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={utmFree}
                      onCheckedChange={(checked) => setUtmFree(!!checked)}
                    />
                    <span className="text-sm">Organic only (no UTM tags)</span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Breakdowns Card */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-foreground mb-2">Report Breakdowns</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Each selected breakdown gets a dedicated page in your report showing incremental lift by that dimension.
              </p>
              <div className="flex flex-wrap gap-2">
                {BREAKDOWN_OPTIONS.map((option) => {
                  const isSelected = breakdowns.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => toggleBreakdown(option.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm border transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Action Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Incrementality Report
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            {/* Educational Callout */}
            <Card className="p-5 bg-muted/30 border-muted">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Why Incremental Matters</h4>
                  <p className="text-sm text-muted-foreground">
                    Incremental metrics measure the TRUE impact of your efforts — the additional visitors, 
                    conversions, and wallet connections you gained BEYOND what would have happened naturally. 
                    Raw totals include organic activity. Incremental isolates your real contribution. 
                    This is what investors and executives care about.
                  </p>
                </div>
              </div>
            </Card>
            </>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Change;
