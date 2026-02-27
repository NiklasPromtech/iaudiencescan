import { useEffect, useState, useCallback } from "react";
import { format, differenceInDays, subDays, parseISO } from "date-fns";
import {
  fetchOverview,
  fetchTableData,
  fetchRealtimeVisitors,
  ScorecardResponse,
  TableResponse,
  TableDimension,
  RangeConfig,
  CostSource,
  EventsTableResponse,
  WalletsTableResponse,
  WalletExtensionsResponse,
  WalletDistributionResponse,
  ClicksTableResponse,
  FilterOptionsResponse,
  ActiveFilters,
  HolderDataPoint,
  WalletHoldingItem,
  OverviewResponse,
} from "@/lib/api";
import { DateRangeValue } from "@/components/overview/DateRangePicker";
import { useSelectedWebsite } from "@/hooks/use-selected-website";

export function useOverviewData() {
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
  const [walletHoldingsData, setWalletHoldingsData] = useState<WalletHoldingItem[]>([]);
  const [walletHoldingsLoading, setWalletHoldingsLoading] = useState(true);

  // Comparison state
  const [comparisonMode, setComparisonMode] = useState<"idle" | "confirming" | "loading" | "active">("idle");
  const [comparisonData, setComparisonData] = useState<OverviewResponse | null>(null);

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

    if (dateRange.type === "custom" && dateRange.from && dateRange.to) {
      return {
        type: "custom",
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd"),
        timezone,
      };
    }

    if (dateRange.includeToday && dateRange.days !== undefined) {
      if (dateRange.days === 0) {
        return { type: "custom", from: todayStr, to: todayStr, timezone };
      }
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - dateRange.days + 1);
      return {
        type: "custom",
        from: format(fromDate, "yyyy-MM-dd"),
        to: todayStr,
        timezone,
      };
    }

    return {
      type: "last_full_days",
      days: dateRange.days || 7,
      timezone,
    };
  }, [dateRange, timezone]);

  const getPreviousRangeConfig = useCallback((): { range: RangeConfig; label: string } => {
    const currentRange = getRangeConfig();

    if (currentRange.type === "custom") {
      const from = parseISO(currentRange.from);
      const to = parseISO(currentRange.to);
      const daysDiff = differenceInDays(to, from) + 1;
      const prevTo = subDays(from, 1);
      const prevFrom = subDays(from, daysDiff);
      return {
        range: {
          type: "custom",
          from: format(prevFrom, "yyyy-MM-dd"),
          to: format(prevTo, "yyyy-MM-dd"),
          timezone: currentRange.timezone,
        },
        label: `${format(prevFrom, "MMM d")} – ${format(prevTo, "MMM d")}`,
      };
    }

    const days = currentRange.days;
    const today = new Date();
    const currentTo = subDays(today, 1);
    const currentFrom = subDays(today, days);
    const prevTo = subDays(currentFrom, 1);
    const prevFrom = subDays(currentFrom, days);
    return {
      range: {
        type: "custom",
        from: format(prevFrom, "yyyy-MM-dd"),
        to: format(prevTo, "yyyy-MM-dd"),
        timezone: currentRange.timezone,
      },
      label: `${format(prevFrom, "MMM d")} – ${format(prevTo, "MMM d")}`,
    };
  }, [getRangeConfig]);

  const handleStartComparison = useCallback(async () => {
    if (!selectedWebsite) return;
    setComparisonMode("loading");

    const { conversion_events: convEvents, ...restFilters } = activeFilters;
    const filtersParam = getFiltersParam(restFilters);
    const conversionEvents = convEvents?.length ? convEvents : undefined;
    const { range: prevRange } = getPreviousRangeConfig();

    try {
      const response = await fetchOverview({
        tag_id: selectedWebsite.id,
        range: prevRange,
        filters: filtersParam,
        conversion_events: conversionEvents,
        cost: { mode: "none" },
        table_referrer_domain: {
          sort: { by: "pageviews", dir: "desc" },
          limit: 50,
        },
        events_table: {
          sort: { by: "event_count", dir: "desc" },
          limit: 10,
        },
        wallets_table: {
          sort: { by: "action_count", dir: "desc" },
          limit: 10,
        },
        wallet_distribution: {
          sort: { by: "tier_order", dir: "asc" },
        },
        clicks_table: {
          sort: { by: "click_count", dir: "desc" },
          limit: 20,
        },
      });
      setComparisonData(response);
      setComparisonMode("active");
    } catch (err) {
      console.error("Comparison fetch failed:", err);
      setComparisonMode("idle");
    }
  }, [selectedWebsite, activeFilters, getFiltersParam, getPreviousRangeConfig]);

  const handleExitComparison = useCallback(() => {
    setComparisonMode("idle");
    setComparisonData(null);
  }, []);

  const loadAllData = useCallback(async (
    filters: ActiveFilters,
    dimension: TableDimension,
    rangeConfig: RangeConfig
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
    setWalletHoldingsLoading(true);
    setFilterOptionsLoading(true);
    setError(null);

    const { conversion_events: convEvents, ...restFilters } = filters;
    const filtersParam = getFiltersParam(restFilters);
    const conversionEvents = convEvents?.length ? convEvents : undefined;

    try {
      const response = await fetchOverview({
        tag_id: selectedWebsite.id,
        range: rangeConfig,
        filters: filtersParam,
        conversion_events: conversionEvents,
        cost: { mode: "none" },
        table_referrer_domain: {
          sort: { by: "pageviews", dir: "desc" },
          limit: 50,
        },
        events_table: {
          sort: { by: "event_count", dir: "desc" },
          limit: 10,
        },
        wallets_table: {
          sort: { by: "action_count", dir: "desc" },
          limit: 10,
        },
        wallet_distribution: {
          sort: { by: "tier_order", dir: "asc" },
        },
        clicks_table: {
          sort: { by: "click_count", dir: "desc" },
          limit: 20,
        },
      });

      if (response.scorecard.success && response.scorecard.data) {
        setScorecard(response.scorecard.data);
      } else {
        setError(response.scorecard.error || "Failed to load scorecard");
      }

      if (response.table_date_day.success && response.table_date_day.data) {
        setDailyData(response.table_date_day.data);
      }

      if (response.table_referrer_domain.success && response.table_referrer_domain.data) {
        setTableData(response.table_referrer_domain.data);
      }

      if (response.filtering.success && response.filtering.data) {
        setFilterOptions(response.filtering.data);
      }

      if (response.cost_sources.success && response.cost_sources.data) {
        setCostSources(response.cost_sources.data.cost_sources);
      }

      if (response.events.success && response.events.data) {
        setEventsData(response.events.data);
      }

      if (response.wallets.success && response.wallets.data) {
        setWalletsData(response.wallets.data);
      }

      if (response.wallet_extensions.success && response.wallet_extensions.data) {
        setWalletExtensionsData(response.wallet_extensions.data);
      }

      if (response.wallet_distribution.success && response.wallet_distribution.data) {
        setWalletDistributionData(response.wallet_distribution.data);
      }

      if (response.clicks.success && response.clicks.data) {
        setClicksData(response.clicks.data);
      }

      if (response.wallet_holdings?.success && response.wallet_holdings?.data) {
        setWalletHoldingsData(response.wallet_holdings.data.items || []);
      } else {
        setWalletHoldingsData([]);
      }

      if (response.holders.success && response.holders.data) {
        setHolderData(response.holders.data.data || []);
      } else {
        setHolderData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
      setChartLoading(false);
      setTableLoading(false);
      setEventsLoading(false);
      setWalletsLoading(false);
      setWalletExtensionsLoading(false);
      setWalletDistributionLoading(false);
      setClicksLoading(false);
      setWalletHoldingsLoading(false);
      setFilterOptionsLoading(false);
    }
  }, [selectedWebsite, getFiltersParam]);

  const loadTableData = useCallback(async (
    dimension: TableDimension,
    filters: ActiveFilters,
    rangeConfig: RangeConfig,
    costSourceId: string | null = null
  ) => {
    if (!selectedWebsite) return;

    setTableLoading(true);
    const { conversion_events: convEvents, ...restFilters } = filters;
    const conversionEvents = convEvents?.length ? convEvents : undefined;
    try {
      const data = await fetchTableData({
        tag_id: selectedWebsite.id,
        dimension,
        range: rangeConfig,
        filters: getFiltersParam(restFilters),
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

  useEffect(() => {
    if (selectedWebsite) {
      loadAllData(activeFilters, tableDimension, getRangeConfig());
    }
  }, [selectedWebsite, dateRange]);

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

    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, [selectedWebsite]);

  // Calculate token holders from the latest day's data
  const tokenHoldersTotal = (() => {
    if (!holderData || holderData.length === 0) return null;
    const latestDate = holderData.reduce((latest, item) => {
      return item.date > latest ? item.date : latest;
    }, holderData[0].date);
    const latestDayData = holderData.filter(item => item.date === latestDate);
    return latestDayData.reduce((sum, item) => sum + item.holder_count, 0);
  })();

  // Merge token holders into scorecard data
  const data = scorecard?.data ? {
    ...scorecard.data,
    token_holders: tokenHoldersTotal,
  } : null;

  const conversionEvents = filterOptions?.conversion_events ?? [];

  const fetchComparisonTableData = async (
    dimension: TableDimension,
    prevRange: RangeConfig
  ) => {
    if (!selectedWebsite) return;
    const { conversion_events: convEvents, ...restFilters } = activeFilters;
    try {
      const fetchedData = await fetchTableData({
        tag_id: selectedWebsite.id,
        dimension,
        range: prevRange,
        filters: getFiltersParam(restFilters),
        conversion_events: convEvents?.length ? convEvents : undefined,
        cost: { mode: "none" },
        pagination: { limit: 50 },
      });
      setComparisonData(prev => prev ? {
        ...prev,
        table_referrer_domain: { success: true, data: fetchedData }
      } : null);
    } catch (err) {
      console.error("Comparison table fetch failed:", err);
    }
  };

  return {
    // Website
    selectedWebsite,
    websiteLoading,
    // Data
    scorecard,
    dailyData,
    tableData,
    tableDimension,
    setTableDimension,
    data,
    holderData,
    eventsData,
    walletsData,
    walletExtensionsData,
    walletDistributionData,
    clicksData,
    walletHoldingsData,
    filterOptions,
    costSources,
    selectedCostSourceId,
    setSelectedCostSourceId,
    conversionEvents,
    realtimeVisitors,
    // Loading states
    loading,
    chartLoading,
    tableLoading,
    eventsLoading,
    walletsLoading,
    walletExtensionsLoading,
    walletDistributionLoading,
    clicksLoading,
    walletHoldingsLoading,
    filterOptionsLoading,
    error,
    // Filters
    activeFilters,
    setActiveFilters,
    // Date range
    dateRange,
    setDateRange,
    // Comparison
    comparisonMode,
    setComparisonMode,
    comparisonData,
    // Setup dialogs
    walletSetupOpen,
    setWalletSetupOpen,
    conversionSetupOpen,
    setConversionSetupOpen,
    // Actions
    loadAllData,
    loadTableData,
    getRangeConfig,
    getDateRangeLabel,
    getPreviousRangeConfig,
    getFiltersParam,
    handleStartComparison,
    handleExitComparison,
    fetchComparisonTableData,
  };
}
