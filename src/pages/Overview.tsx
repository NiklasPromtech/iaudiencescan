import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  fetchScorecard, 
  fetchTableData,
  fetchRealtimeVisitors,
  fetchEventsTable,
  fetchWalletsTable,
  fetchWalletExtensions,
  fetchWalletDistribution,
  fetchClicksTable,
  listCostSources,
  fetchFilterOptions,
  fetchHoldersData,
  ScorecardResponse, 
  TableResponse, 
  TableDimension, 
  Website,
  RangeConfig,
  CostSource,
  EventsTableResponse,
  WalletsTableResponse,
  WalletExtensionsResponse,
  WalletDistributionResponse,
  ClicksTableResponse,
  FilterOptionsResponse,
  ActiveFilters,
  DIMENSION_TO_FILTER,
  HolderDataPoint,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { FilterDialog } from "@/components/overview/FilterDialog";
import { PrimaryFilters } from "@/components/overview/PrimaryFilters";
import { DailyChart } from "@/components/overview/DailyChart";
import { DimensionTable } from "@/components/overview/DimensionTable";
import { EventsTable } from "@/components/overview/EventsTable";
import { WalletsOverviewTable } from "@/components/overview/WalletsOverviewTable";
import { WalletExtensionsTable } from "@/components/overview/WalletExtensionsTable";
import { WalletDistributionTable } from "@/components/overview/WalletDistributionTable";
import { ClicksTable } from "@/components/overview/ClicksTable";
import { TrackingSetupDialog } from "@/components/overview/TrackingSetupDialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DateRangePicker, DateRangeValue } from "@/components/overview/DateRangePicker";
import { AudienceDialog, AudienceDialogInitialFilters } from "@/components/audiences/AudienceDialog";
import { ScorecardChips } from "@/components/overview/ScorecardChips";
import { useStarredMetrics } from "@/hooks/use-starred-metrics";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { NoWebsiteState } from "@/components/dashboard/NoWebsiteState";

const Overview = () => {
  const navigate = useNavigate();
  const { starredMetrics, toggleMetric } = useStarredMetrics();
  const { selectedWebsite, loading: websiteLoading } = useSelectedWebsite();
  
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
  const [holderData, setHolderData] = useState<HolderDataPoint[]>([]);
  const [walletDistributionData, setWalletDistributionData] = useState<WalletDistributionResponse | null>(null);
  const [walletDistributionLoading, setWalletDistributionLoading] = useState(true);
  const [clicksData, setClicksData] = useState<ClicksTableResponse | null>(null);
  const [clicksLoading, setClicksLoading] = useState(true);
  
  // Audience dialog state
  const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
  const [audienceDialogFilters, setAudienceDialogFilters] = useState<AudienceDialogInitialFilters | undefined>(undefined);

  // Show empty state when no website is selected (handled below after hooks)

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
    conversionEvent: string | null,
    walletAction: string | null
  ) => {
    if (!selectedWebsite) return;

    setLoading(true);
    setChartLoading(true);
    setTableLoading(true);
    setEventsLoading(true);
    setWalletsLoading(true);
    setWalletExtensionsLoading(true);
    setWalletDistributionLoading(true);
    setClicksLoading(true);
    setError(null);

    const filtersParam = getFiltersParam(filters);
    const conversionEvents = conversionEvent ? [conversionEvent] : undefined;
    const walletActionsFilter = walletAction ? [walletAction] : undefined;
    
    // Merge wallet_actions into filters if set
    const mergedFilters = walletActionsFilter 
      ? { ...filtersParam, wallet_actions: walletActionsFilter }
      : filtersParam;

    try {
      // Fetch core data in parallel - these are critical
      const [scorecardData, dailyChartData, dimensionTableData] = await Promise.all([
        fetchScorecard({
          tag_id: selectedWebsite.id,
          range: rangeConfig,
          filters: mergedFilters,
          conversion_events: conversionEvents,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension: "date_day",
          range: rangeConfig,
          filters: mergedFilters,
          conversion_events: conversionEvents,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension,
          range: rangeConfig,
          filters: mergedFilters,
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
        filters: mergedFilters,
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
        filters: mergedFilters,
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
        filters: mergedFilters,
      });
      setWalletExtensionsData(walletExtensionsTableData);
    } catch (err) {
      console.error("Failed to load wallet extensions data:", err);
    } finally {
      setWalletExtensionsLoading(false);
    }

    // Fetch wallet distribution data
    try {
      const walletDistData = await fetchWalletDistribution({
        tag_id: selectedWebsite.id,
        range: rangeConfig,
        filters: mergedFilters,
        sort: { by: "tier_order", dir: "asc" },
      });
      setWalletDistributionData(walletDistData);
    } catch (err) {
      console.error("Failed to load wallet distribution data:", err);
    } finally {
      setWalletDistributionLoading(false);
    }

    // Fetch clicks table data
    try {
      const clicksTableData = await fetchClicksTable({
        tag_id: selectedWebsite.id,
        range: rangeConfig,
        filters: mergedFilters,
        sort: { by: "click_count", dir: "desc" },
        pagination: { limit: 20 },
      });
      setClicksData(clicksTableData);
    } catch (err) {
      console.error("Failed to load clicks data:", err);
    } finally {
      setClicksLoading(false);
    }

    try {
      const rangeFrom = rangeConfig.type === "custom" 
        ? rangeConfig.from 
        : format(new Date(Date.now() - (rangeConfig.days * 24 * 60 * 60 * 1000)), "yyyy-MM-dd");
      const rangeTo = rangeConfig.type === "custom"
        ? rangeConfig.to
        : format(new Date(), "yyyy-MM-dd");
      
      const holdersResponse = await fetchHoldersData({
        tag_id: selectedWebsite.id,
        range: { from: rangeFrom, to: rangeTo },
      });
      setHolderData(holdersResponse.data || []);
    } catch (err) {
      console.error("Failed to load holder data:", err);
      setHolderData([]);
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
      loadAllData(activeFilters, tableDimension, getRangeConfig(), selectedConversionEvent, selectedWalletAction);
      // Also load cost sources and filter options
      loadCostSources();
      loadFilterOptions();
    }
  }, [selectedWebsite, dateRange, selectedConversionEvent, selectedWalletAction]);

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

  if (!websiteLoading && !selectedWebsite) {
    return (
      <DashboardLayout>
        <NoWebsiteState />
      </DashboardLayout>
    );
  }

  const handleFiltersChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    loadAllData(newFilters, tableDimension, getRangeConfig(), selectedConversionEvent, selectedWalletAction);
    loadFilterOptions();
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

  // Calculate token holders from the latest day's data (sum across all contracts)
  const tokenHoldersTotal = (() => {
    if (!holderData || holderData.length === 0) return null;
    
    // Find the most recent date in the data
    const latestDate = holderData.reduce((latest, item) => {
      return item.date > latest ? item.date : latest;
    }, holderData[0].date);
    
    // Sum holder_count for all contracts on the latest date
    const latestDayData = holderData.filter(item => item.date === latestDate);
    return latestDayData.reduce((sum, item) => sum + item.holder_count, 0);
  })();

  // Merge token holders into scorecard data
  const data = scorecard?.data ? {
    ...scorecard.data,
    token_holders: tokenHoldersTotal,
  } : null;
  const conversionEvents = filterOptions?.conversion_events ?? [];

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
          <div className="mb-6">
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
          <div className="mb-6">
            <DailyChart
              data={dailyData?.rows ?? []} 
              loading={chartLoading} 
              holderData={holderData}
            />
          </div>

          <div className="mb-6">
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
          <div className="border border-border mb-6">
            <Tabs defaultValue="events">
              <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
                <TabsTrigger value="events" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 px-4 py-3">
                  Conversion Events
                  <span className="ml-2 font-mono tabular-nums text-muted-foreground">({eventsData?.pagination?.total_rows ?? 0})</span>
                </TabsTrigger>
                <TabsTrigger value="wallets" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 px-4 py-3">
                  Wallet Actions
                  <span className="ml-2 font-mono tabular-nums text-muted-foreground">({walletsData?.pagination?.total_rows ?? 0})</span>
                </TabsTrigger>
                <TabsTrigger value="extensions" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 px-4 py-3">
                  Wallet Extensions
                  <span className="ml-2 font-mono tabular-nums text-muted-foreground">({walletExtensionsData?.total_with_extension ?? walletExtensionsData?.rows?.length ?? 0})</span>
                </TabsTrigger>
                <TabsTrigger value="distribution" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 px-4 py-3">
                  Wallet Distribution
                  <span className="ml-2 font-mono tabular-nums text-muted-foreground">({walletDistributionData?.rows?.length ?? 0})</span>
                </TabsTrigger>
                <TabsTrigger value="clicks" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 px-4 py-3">
                  Clicks
                  <span className="ml-2 font-mono tabular-nums text-muted-foreground">({clicksData?.pagination?.total_rows ?? 0})</span>
                </TabsTrigger>
              </TabsList>
              <div className="p-4">
                <TabsContent value="events" className="mt-0">
                  <EventsTable
                    data={eventsData?.rows ?? []}
                    loading={eventsLoading}
                    totalRows={eventsData?.pagination?.total_rows ?? 0}
                    hideHeader
                  />
                </TabsContent>
                <TabsContent value="wallets" className="mt-0">
                  <WalletsOverviewTable
                    data={walletsData?.rows ?? []}
                    loading={walletsLoading}
                    totalRows={walletsData?.pagination?.total_rows ?? 0}
                    hideHeader
                  />
                </TabsContent>
                <TabsContent value="extensions" className="mt-0">
                  <WalletExtensionsTable
                    data={walletExtensionsData?.rows ?? []}
                    loading={walletExtensionsLoading}
                    totalRows={walletExtensionsData?.total_with_extension ?? walletExtensionsData?.rows?.length ?? 0}
                    hideHeader
                  />
                </TabsContent>
                <TabsContent value="distribution" className="mt-0">
                  <WalletDistributionTable
                    data={walletDistributionData?.rows ?? []}
                    loading={walletDistributionLoading}
                    totalRows={walletDistributionData?.rows?.length ?? 0}
                    hideHeader
                  />
                </TabsContent>
                <TabsContent value="clicks" className="mt-0">
                  <ClicksTable
                    data={clicksData?.rows ?? []}
                    loading={clicksLoading}
                    totalRows={clicksData?.pagination?.total_rows ?? 0}
                    hideHeader
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>


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
              website={selectedWebsite as Website}
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
