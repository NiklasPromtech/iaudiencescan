import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { 
  fetchScorecard, 
  fetchTableData,
  fetchRealtimeVisitors,
  fetchEventsTable,
  fetchWalletsTable,
  fetchWalletExtensions,
  listCostSources,
  fetchFilterOptions,
  ScorecardResponse, 
  TableResponse, 
  TableDimension, 
  Website,
  RangeConfig,
  CostSource,
  EventsTableResponse,
  WalletsTableResponse,
  WalletExtensionsResponse,
  FilterOptionsResponse,
  ActiveFilters,
  DIMENSION_TO_FILTER,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { FilterDialog } from "@/components/overview/FilterDialog";
import { PrimaryFilters } from "@/components/overview/PrimaryFilters";
import { DailyChart } from "@/components/overview/DailyChart";
import { DimensionTable } from "@/components/overview/DimensionTable";
import { EventsTable } from "@/components/overview/EventsTable";
import { WalletsOverviewTable } from "@/components/overview/WalletsOverviewTable";
import { WalletExtensionsTable } from "@/components/overview/WalletExtensionsTable";
import { TrackingSetupDialog } from "@/components/overview/TrackingSetupDialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DateRangePicker, DateRangeValue } from "@/components/overview/DateRangePicker";
import { AudienceDialog, AudienceDialogInitialFilters } from "@/components/audiences/AudienceDialog";
import { ScorecardChips } from "@/components/overview/ScorecardChips";
import { useStarredMetrics } from "@/hooks/use-starred-metrics";

const Overview = () => {
  const navigate = useNavigate();
  const { starredMetrics, toggleMetric } = useStarredMetrics();
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [scorecard, setScorecard] = useState<ScorecardResponse | null>(null);
  const [dailyData, setDailyData] = useState<TableResponse | null>(null);
  const [tableData, setTableData] = useState<TableResponse | null>(null);
  const [tableDimension, setTableDimension] = useState<TableDimension>("referrer_domain");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [walletSetupOpen, setWalletSetupOpen] = useState(false);
  const [conversionSetupOpen, setConversionSetupOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangeValue>({ type: "preset", days: 7, includeToday: true });
  const [realtimeVisitors, setRealtimeVisitors] = useState<number | null>(null);
  const [costSources, setCostSources] = useState<CostSource[]>([]);
  const [selectedCostSourceId, setSelectedCostSourceId] = useState<string | null>(null);
  const [selectedConversionEvent, setSelectedConversionEvent] = useState<string | null>(null);
  const [selectedWalletAction, setSelectedWalletAction] = useState<string | null>(null);
  const [eventsData, setEventsData] = useState<EventsTableResponse | null>(null);
  const [walletsData, setWalletsData] = useState<WalletsTableResponse | null>(null);
  const [walletExtensionsData, setWalletExtensionsData] = useState<WalletExtensionsResponse | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [walletExtensionsLoading, setWalletExtensionsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptionsResponse | null>(null);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
  
  // Audience dialog state
  const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
  const [audienceDialogFilters, setAudienceDialogFilters] = useState<AudienceDialogInitialFilters | undefined>(undefined);

  useEffect(() => {
    // Load selected website from localStorage
    const storedWebsite = localStorage.getItem("selectedWebsite");
    if (storedWebsite) {
      try {
        const website = JSON.parse(storedWebsite) as Website;
        setSelectedWebsite(website);
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
      ? Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v && v.length > 0)
        ) as Record<string, string[]>
      : undefined;
  }, []);

  const getDateRangeLabel = useCallback(() => {
    if (dateRange.includeToday && dateRange.days === 0) {
      return "today";
    }
    if (dateRange.type === "preset" && dateRange.days === 1) {
      return "yesterday";
    }
    if (dateRange.type === "preset" && dateRange.days) {
      return `last ${dateRange.days} days`;
    }
    return `selected period`;
  }, [dateRange]);

  const getRangeConfig = useCallback((): RangeConfig => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    
    // Custom date range (calendar selection)
    if (dateRange.type === "custom" && dateRange.from && dateRange.to) {
      return {
        type: "custom",
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
        timezone,
      };
    }
    
    // Preset with includeToday: calculate from (days ago) to today
    if (dateRange.includeToday && dateRange.days !== undefined) {
      // For "Today" preset (days: 0)
      if (dateRange.days === 0) {
        return {
          type: "custom",
          from: todayStr,
          to: todayStr,
          timezone,
        };
      }
      
      // For multi-day presets like "Last 7 days" including today
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - dateRange.days + 1);
      return {
        type: "custom",
        from: format(fromDate, "yyyy-MM-dd"),
        to: todayStr,
        timezone,
      };
    }
    
    // For standard presets (excluding today), use last_full_days
    return {
      type: "last_full_days",
      days: dateRange.days || 7,
      timezone,
    };
  }, [dateRange, timezone]);

  const loadAllData = useCallback(async (
    filters: ActiveFilters, 
    dimension: TableDimension, 
    rangeConfig: RangeConfig,
    conversionEvent: string | null
  ) => {
    if (!selectedWebsite) return;

    setLoading(true);
    setChartLoading(true);
    setTableLoading(true);
    setEventsLoading(true);
    setWalletsLoading(true);
    setWalletExtensionsLoading(true);
    setError(null);

    const filtersParam = getFiltersParam(filters);
    const conversionEvents = conversionEvent ? [conversionEvent] : undefined;

    try {
      // Fetch core data in parallel - these are critical
      const [scorecardData, dailyChartData, dimensionTableData] = await Promise.all([
        fetchScorecard({
          tag_id: selectedWebsite.id,
          range: rangeConfig,
          filters: filtersParam,
          conversion_events: conversionEvents,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension: "date_day",
          range: rangeConfig,
          filters: filtersParam,
          conversion_events: conversionEvents,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension,
          range: rangeConfig,
          filters: filtersParam,
          conversion_events: conversionEvents,
          cost: { mode: "none" },
          pagination: { limit: 50 },
        }),
      ]);

      setScorecard(scorecardData);
      setDailyData(dailyChartData);
      setTableData(dimensionTableData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
      setChartLoading(false);
      setTableLoading(false);
    }

    // Fetch optional data separately - these can fail without breaking the dashboard
    try {
      const eventsTableData = await fetchEventsTable({
        tag_id: selectedWebsite.id,
        range: rangeConfig,
        filters: filtersParam,
        sort: { by: "event_count", dir: "desc" },
        pagination: { limit: 10 },
      });
      setEventsData(eventsTableData);
    } catch (err) {
      console.error("Failed to load events data:", err);
    } finally {
      setEventsLoading(false);
    }

    try {
      const walletsTableData = await fetchWalletsTable({
        tag_id: selectedWebsite.id,
        range: rangeConfig,
        filters: filtersParam,
        sort: { by: "action_count", dir: "desc" },
        pagination: { limit: 10 },
      });
      setWalletsData(walletsTableData);
    } catch (err) {
      console.error("Failed to load wallets data:", err);
    } finally {
      setWalletsLoading(false);
    }

    // Fetch wallet extensions data
    try {
      const walletExtensionsTableData = await fetchWalletExtensions({
        tag_id: selectedWebsite.id,
        range: rangeConfig,
        filters: filtersParam,
      });
      setWalletExtensionsData(walletExtensionsTableData);
    } catch (err) {
      console.error("Failed to load wallet extensions data:", err);
    } finally {
      setWalletExtensionsLoading(false);
    }
  }, [selectedWebsite, getFiltersParam]);

  const loadTableData = useCallback(async (
    dimension: TableDimension, 
    filters: ActiveFilters, 
    rangeConfig: RangeConfig,
    conversionEvent: string | null,
    costSourceId: string | null = null
  ) => {
    if (!selectedWebsite) return;

    setTableLoading(true);
    const conversionEvents = conversionEvent ? [conversionEvent] : undefined;
    try {
      const data = await fetchTableData({
        tag_id: selectedWebsite.id,
        dimension,
        range: rangeConfig,
        filters: getFiltersParam(filters),
        conversion_events: conversionEvents,
        cost: costSourceId 
          ? { mode: "utm", cost_source_id: costSourceId }
          : { mode: "none" },
        pagination: { limit: 50 },
      });
      setTableData(data);
    } catch (err) {
      console.error("Failed to load table data:", err);
    } finally {
      setTableLoading(false);
    }
  }, [selectedWebsite, getFiltersParam]);

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    if (!selectedWebsite) return;
    setFilterOptionsLoading(true);
    try {
      const response = await fetchFilterOptions({
        tag_id: selectedWebsite.id,
        range: getRangeConfig(),
      });
      setFilterOptions(response);
    } catch (err) {
      console.error("Failed to load filter options:", err);
    } finally {
      setFilterOptionsLoading(false);
    }
  }, [selectedWebsite, getRangeConfig]);

  useEffect(() => {
    if (selectedWebsite) {
      loadAllData(activeFilters, tableDimension, getRangeConfig(), selectedConversionEvent);
      // Also load cost sources and filter options
      loadCostSources();
      loadFilterOptions();
    }
  }, [selectedWebsite, dateRange, selectedConversionEvent]);

  // Load cost sources
  const loadCostSources = useCallback(async () => {
    if (!selectedWebsite) return;
    try {
      const response = await listCostSources(selectedWebsite.id);
      setCostSources(response.cost_sources);
    } catch (err) {
      console.error("Failed to load cost sources:", err);
    }
  }, [selectedWebsite]);

  // Realtime visitors polling
  useEffect(() => {
    if (!selectedWebsite) return;

    const fetchRealtime = async () => {
      try {
        const response = await fetchRealtimeVisitors(selectedWebsite.id, 5);
        setRealtimeVisitors(response.active_visitors);
      } catch (err) {
        console.error("Failed to fetch realtime:", err);
        setRealtimeVisitors(null);
      }
    };

    // Fetch immediately
    fetchRealtime();

    // Poll every 30 seconds
    const interval = setInterval(fetchRealtime, 30000);

    return () => clearInterval(interval);
  }, [selectedWebsite]);

  const handleFiltersChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    loadAllData(newFilters, tableDimension, getRangeConfig(), selectedConversionEvent);
  };

  const handleDimensionChange = (newDimension: TableDimension) => {
    setTableDimension(newDimension);
    setSelectedCostSourceId(null); // Reset cost source when dimension changes
    loadTableData(newDimension, activeFilters, getRangeConfig(), selectedConversionEvent, null);
  };

  const handleCostSourceChange = (costSourceId: string | null) => {
    setSelectedCostSourceId(costSourceId);
    // Re-fetch table data with the selected cost source
    loadTableData(tableDimension, activeFilters, getRangeConfig(), selectedConversionEvent, costSourceId);
  };

  const handleAddCostSource = () => {
    navigate("/attribution");
  };

  const handleDateRangeChange = (newDateRange: DateRangeValue) => {
    setDateRange(newDateRange);
  };

  const handleConversionEventChange = (event: string | null) => {
    setSelectedConversionEvent(event);
  };

  const handleBotClick = (dimValue: string) => {
    const params = new URLSearchParams();
    params.set("dim", tableDimension);
    params.set("val", dimValue);
    params.set("range", JSON.stringify(dateRange));
    if (Object.keys(activeFilters).length > 0) {
      params.set("filters", JSON.stringify(activeFilters));
    }
    navigate(`/bots?${params.toString()}`);
  };

  const handleWalletClick = (dimValue: string, _walletCount: number) => {
    // Map the table dimension to filter key
    const filterKey = DIMENSION_TO_FILTER[tableDimension];
    if (!filterKey) return;

    // Build filters combining current activeFilters with the clicked dimension value
    const combinedFilters: Record<string, string[]> = { ...activeFilters };
    combinedFilters[filterKey] = [dimValue];

    setAudienceDialogFilters({
      dateRange,
      filters: combinedFilters,
    });
    setAudienceDialogOpen(true);
  };

  const handleAudienceDialogSuccess = () => {
    // Navigate to audiences page after successful creation
    navigate("/audiences");
  };

  const data = scorecard?.data;
  const conversionEvents = filterOptions?.conversion_events ?? [];

  const suggestedCohorts = [
    {
      id: 1,
      name: "High-intent visitors",
      description: "Stayed 60s+",
      size: data?.stayed_60s ?? 0,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Engaged visitors",
      description: "Stayed 30s+",
      size: data?.stayed_30s ?? 0,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "Wallet connected",
      description: "Connected a wallet",
      size: data?.wallet_users ?? 0,
      icon: <Zap className="h-4 w-4" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="bg-gradient-subtle min-h-full">
        <div className="container max-w-7xl py-8 px-4">
          {/* Header */}
          <div className="mb-6">
            <Badge variant="outline" className="border-primary/30 text-primary mb-3">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
              {selectedWebsite?.name || "Loading..."}
            </Badge>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-h2 text-foreground mb-2">Overview</h1>
                <p className="text-p1 text-muted-foreground">
                  Here's what we're seeing so far.
                </p>
              </div>
              {/* Primary row: Date + Conversion + Wallet Action */}
              <div className="flex items-center gap-2 flex-wrap">
                <PrimaryFilters
                  conversionEvents={filterOptions?.conversion_events ?? []}
                  walletActions={filterOptions?.wallet_actions ?? []}
                  selectedConversionEvent={selectedConversionEvent}
                  selectedWalletAction={selectedWalletAction}
                  onConversionEventChange={handleConversionEventChange}
                  onWalletActionChange={setSelectedWalletAction}
                  loading={filterOptionsLoading}
                />
                <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
              </div>
            </div>
          </div>

          {error && (
            <Card className="p-4 mb-6 border-destructive bg-destructive/10">
              <p className="text-destructive text-sm">{error}</p>
            </Card>
          )}

          {/* Secondary row: Dimension filters */}
          <div className="mb-6">
            <FilterDialog
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onFiltersChange={handleFiltersChange}
              loading={filterOptionsLoading}
            />
          </div>

          {/* Compact Scorecard Chips */}
          <div className="mb-8">
            <ScorecardChips
              data={data ?? null}
              loading={loading}
              realtimeVisitors={realtimeVisitors}
              starredMetrics={starredMetrics}
              onToggleStar={toggleMetric}
              dateRangeLabel={getDateRangeLabel()}
            />
          </div>

          {/* Daily Traffic Chart */}
          <div className="mb-8">
            <DailyChart data={dailyData?.rows ?? []} loading={chartLoading} />
          </div>

          <div className="mb-8">
            <DimensionTable
              data={tableData?.rows ?? []}
              loading={tableLoading}
              dimension={tableDimension}
              onDimensionChange={handleDimensionChange}
              totalRows={tableData?.pagination?.total_rows ?? 0}
              showWalletColumns={data?.wallet_users !== null}
              showConversionColumns={data?.converted_users !== null}
              onBotClick={handleBotClick}
              onWalletClick={handleWalletClick}
              costSources={costSources}
              selectedCostSourceId={selectedCostSourceId}
              onCostSourceChange={handleCostSourceChange}
              onAddCostSource={handleAddCostSource}
            />
          </div>

          {/* Events, Wallets & Extensions Tables */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <EventsTable
              data={eventsData?.rows ?? []}
              loading={eventsLoading}
              totalRows={eventsData?.pagination?.total_rows ?? 0}
            />
            <WalletsOverviewTable
              data={walletsData?.rows ?? []}
              loading={walletsLoading}
              totalRows={walletsData?.pagination?.total_rows ?? 0}
            />
            <WalletExtensionsTable
              data={walletExtensionsData?.rows ?? []}
              loading={walletExtensionsLoading}
              totalRows={walletExtensionsData?.pagination?.total_rows ?? 0}
            />
          </div>

          {/* Cohort Suggestions */}
          <Card className="p-6 border border-border mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-h3 text-foreground">Suggested Cohorts</h3>
            </div>
            <p className="text-p2 text-muted-foreground mb-6">
              Auto-generated based on your early traffic patterns
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {suggestedCohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    {cohort.icon}
                    <span className="text-p2 font-medium text-foreground">{cohort.name}</span>
                  </div>
                  <p className="text-p3 text-muted-foreground mb-3">{cohort.description}</p>
                  <p className="text-p4 text-muted-foreground">
                    <span className="text-foreground font-medium">{cohort.size}</span> visitors
                  </p>
                </div>
              ))}
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Create your first audience
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>

          {/* Setup Dialogs */}
          <TrackingSetupDialog
            type="wallet"
            open={walletSetupOpen}
            onOpenChange={setWalletSetupOpen}
          />
          <TrackingSetupDialog
            type="conversion"
            open={conversionSetupOpen}
            onOpenChange={setConversionSetupOpen}
          />

          {/* Create Audience Dialog */}
          {selectedWebsite && (
            <AudienceDialog
              open={audienceDialogOpen}
              onOpenChange={setAudienceDialogOpen}
              audience={null}
              website={selectedWebsite}
              onSuccess={handleAudienceDialogSuccess}
              initialFilters={audienceDialogFilters}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
