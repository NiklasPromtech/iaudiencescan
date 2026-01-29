import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, subDays } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DateRangePicker, DateRangeValue } from "@/components/overview/DateRangePicker";
import { ScorecardFilters, ActiveFilters } from "@/components/overview/ScorecardFilters";
import { BotSummaryCards } from "@/components/bots/BotSummaryCards";
import { BotSignalsCard } from "@/components/bots/BotSignalsCard";
import { RendererBreakdown } from "@/components/bots/RendererBreakdown";
import { BotDimensionTable } from "@/components/bots/BotDimensionTable";
import {
  fetchBotAnalytics,
  fetchScorecard,
  BotAnalyticsResponse,
  TableDimension,
  Website,
  RangeConfig,
  DIMENSION_TO_FILTER,
  FilterOptions,
} from "@/lib/api";

const Bots = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse URL params
  const initialDim = searchParams.get("dim") as TableDimension | null;
  const initialVal = searchParams.get("val");
  const initialRangeStr = searchParams.get("range");
  const initialFiltersStr = searchParams.get("filters");

  // State
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [botData, setBotData] = useState<BotAnalyticsResponse | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [tableDimension, setTableDimension] = useState<TableDimension>(
    initialDim || "referrer_domain"
  );
  
  const [dateRange, setDateRange] = useState<DateRangeValue>(() => {
    if (initialRangeStr) {
      try {
        return JSON.parse(initialRangeStr);
      } catch {
        return { type: "preset", days: 7 };
      }
    }
    return { type: "preset", days: 7 };
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    let base: ActiveFilters = {};
    if (initialFiltersStr) {
      try {
        base = JSON.parse(initialFiltersStr);
      } catch {
        base = {};
      }
    }
    // Add the clicked dimension value as a filter
    if (initialDim && initialVal) {
      const filterKey = DIMENSION_TO_FILTER[initialDim];
      if (filterKey) {
        base[filterKey] = [...(base[filterKey] || []), initialVal];
      }
    }
    return base;
  });

  // Load website from localStorage
  useEffect(() => {
    const storedWebsite = localStorage.getItem("selectedWebsite");
    if (storedWebsite) {
      try {
        setSelectedWebsite(JSON.parse(storedWebsite) as Website);
      } catch {
        navigate("/install");
      }
    } else {
      navigate("/install");
    }
  }, [navigate]);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const getFiltersParam = useCallback((filters: ActiveFilters) => {
    return Object.keys(filters).length > 0
      ? (Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v && v.length > 0)
        ) as Record<string, string[]>)
      : undefined;
  }, []);

  const getRangeConfig = useCallback((): RangeConfig => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    
    // Handle custom date range
    if (dateRange.type === "custom" && dateRange.from && dateRange.to) {
      return {
        type: "custom",
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
        timezone,
      };
    }
    
    // Handle presets with includeToday (e.g., "Last 7 days" including today)
    if (dateRange.includeToday) {
      const days = dateRange.days || 0;
      // For "Last 7 days" including today: from = today - 6, to = today (7 days total)
      const fromDate = days > 0 ? subDays(today, days - 1) : today;
      return {
        type: "custom",
        from: format(fromDate, "yyyy-MM-dd"),
        to: todayStr,
        timezone,
      };
    }
    
    // Standard rolling window (excludes today)
    return {
      type: "last_full_days",
      days: dateRange.days || 7,
      timezone,
    };
  }, [dateRange, timezone]);

  const loadData = useCallback(async (
    filters: ActiveFilters,
    dimension: TableDimension,
    rangeConfig: RangeConfig
  ) => {
    if (!selectedWebsite) return;

    setLoading(true);
    setError(null);

    const filtersParam = getFiltersParam(filters);

    try {
      // Fetch bot analytics and filter options in parallel
      const [botResponse, scorecardResponse] = await Promise.all([
        fetchBotAnalytics({
          tag_id: selectedWebsite.id,
          range: rangeConfig,
          filters: filtersParam,
          dimension,
          limit: 50,
          offset: 0,
        }),
        fetchScorecard({
          tag_id: selectedWebsite.id,
          range: rangeConfig,
          filters: filtersParam,
          cost: { mode: "none" },
        }),
      ]);

      setBotData(botResponse);
      setFilterOptions(scorecardResponse.filter_options);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bot analytics");
    } finally {
      setLoading(false);
    }
  }, [selectedWebsite, getFiltersParam]);

  const loadTableData = useCallback(async (
    dimension: TableDimension,
    filters: ActiveFilters,
    rangeConfig: RangeConfig
  ) => {
    if (!selectedWebsite) return;

    setLoading(true);
    try {
      const response = await fetchBotAnalytics({
        tag_id: selectedWebsite.id,
        range: rangeConfig,
        filters: getFiltersParam(filters),
        dimension,
        limit: 50,
        offset: 0,
      });
      setBotData(response);
    } catch (err) {
      console.error("Failed to load table data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedWebsite, getFiltersParam]);

  // Initial load
  useEffect(() => {
    if (selectedWebsite) {
      loadData(activeFilters, tableDimension, getRangeConfig());
    }
  }, [selectedWebsite]);

  // Sync URL params when filters/range change
  const updateUrlParams = useCallback((filters: ActiveFilters, range: DateRangeValue) => {
    const params = new URLSearchParams();
    params.set("dim", tableDimension);
    params.set("range", JSON.stringify(range));
    if (Object.keys(filters).length > 0) {
      params.set("filters", JSON.stringify(filters));
    }
    setSearchParams(params, { replace: true });
  }, [tableDimension, setSearchParams]);

  const handleFiltersChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    updateUrlParams(newFilters, dateRange);
    loadData(newFilters, tableDimension, getRangeConfig());
  };

  const handleDimensionChange = (newDimension: TableDimension) => {
    setTableDimension(newDimension);
    loadTableData(newDimension, activeFilters, getRangeConfig());
  };

  const handleDateRangeChange = (newDateRange: DateRangeValue) => {
    setDateRange(newDateRange);
    updateUrlParams(activeFilters, newDateRange);
  };

  // Reload data when date range changes
  useEffect(() => {
    if (selectedWebsite && !loading) {
      loadData(activeFilters, tableDimension, getRangeConfig());
    }
  }, [dateRange]);

  // Build context label for what we're analyzing
  const getContextLabel = () => {
    if (!initialDim || !initialVal) return null;
    const dimLabel = {
      referrer_domain: "Referrer",
      utm_source: "UTM Source",
      utm_medium: "UTM Medium",
      utm_campaign: "UTM Campaign",
      utm_content: "UTM Content",
      utm_term: "UTM Term",
      device_type: "Device",
      browser: "Browser",
      os: "OS",
    }[initialDim];
    return `${dimLabel}: ${initialVal}`;
  };

  const contextLabel = getContextLabel();

  return (
    <DashboardLayout>
      <div className="bg-gradient-subtle min-h-full">
        <div className="container max-w-7xl py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/overview")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Overview
            </Button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-h2 text-foreground mb-2">Bot Analytics</h1>
                {contextLabel && (
                  <p className="text-p2 text-muted-foreground">
                    Analyzing traffic from: <span className="text-foreground">{contextLabel}</span>
                  </p>
                )}
                {!contextLabel && (
                  <p className="text-p2 text-muted-foreground">
                    Deep dive into bot traffic patterns
                  </p>
                )}
              </div>
              <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
            </div>
          </div>

          {error && (
            <Card className="p-4 mb-8 border-destructive bg-destructive/10">
              <p className="text-destructive text-sm">{error}</p>
            </Card>
          )}

          {/* Filters */}
          <div className="mb-6">
            <ScorecardFilters
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onFiltersChange={handleFiltersChange}
              loading={loading}
            />
          </div>

          {/* Summary Cards */}
          <div className="mb-8">
            <BotSummaryCards summary={botData?.summary ?? null} loading={loading} />
          </div>

          {/* Detection Signals */}
          <div className="mb-8">
            <BotSignalsCard signals={botData?.signals ?? null} loading={loading} />
          </div>

          {/* Renderer Breakdown */}
          <div className="mb-8">
            <RendererBreakdown data={botData?.renderer_breakdown ?? []} loading={loading} />
          </div>

          {/* Dimension Table */}
          <div className="mb-8">
            <BotDimensionTable
              data={botData?.rows ?? []}
              loading={loading}
              dimension={tableDimension}
              onDimensionChange={handleDimensionChange}
              totalRows={botData?.pagination?.total_rows ?? 0}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Bots;
