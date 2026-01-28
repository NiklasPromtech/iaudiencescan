import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  Wallet,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  Target,
  Radio,
} from "lucide-react";
import { 
  fetchScorecard, 
  fetchTableData,
  fetchRealtimeVisitors,
  listCostSources,
  ScorecardResponse, 
  TableResponse, 
  TableDimension, 
  Website,
  RangeConfig,
  CostSource,
  DIMENSION_TO_FILTER,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { ScorecardFilters, ActiveFilters } from "@/components/overview/ScorecardFilters";
import { DailyChart } from "@/components/overview/DailyChart";
import { DimensionTable } from "@/components/overview/DimensionTable";
import { TrackingSetupDialog } from "@/components/overview/TrackingSetupDialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DateRangePicker, DateRangeValue } from "@/components/overview/DateRangePicker";

const Overview = () => {
  const navigate = useNavigate();
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

  const loadAllData = useCallback(async (filters: ActiveFilters, dimension: TableDimension, rangeConfig: RangeConfig) => {
    if (!selectedWebsite) return;

    setLoading(true);
    setChartLoading(true);
    setTableLoading(true);
    setError(null);

    const filtersParam = getFiltersParam(filters);

    try {
      // Fetch all data in parallel
      const [scorecardData, dailyChartData, dimensionTableData] = await Promise.all([
        fetchScorecard({
          tag_id: selectedWebsite.id,
          range: rangeConfig,
          filters: filtersParam,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension: "date_day",
          range: rangeConfig,
          filters: filtersParam,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension,
          range: rangeConfig,
          filters: filtersParam,
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
  }, [selectedWebsite, getFiltersParam]);

  const loadTableData = useCallback(async (dimension: TableDimension, filters: ActiveFilters, rangeConfig: RangeConfig) => {
    if (!selectedWebsite) return;

    setTableLoading(true);
    try {
      const data = await fetchTableData({
        tag_id: selectedWebsite.id,
        dimension,
        range: rangeConfig,
        filters: getFiltersParam(filters),
        cost: { mode: "none" },
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
      // Also load cost sources
      loadCostSources();
    }
  }, [selectedWebsite, dateRange]);

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
    loadAllData(newFilters, tableDimension, getRangeConfig());
  };

  const handleDimensionChange = (newDimension: TableDimension) => {
    setTableDimension(newDimension);
    setSelectedCostSourceId(null); // Reset cost source when dimension changes
    loadTableData(newDimension, activeFilters, getRangeConfig());
  };

  const handleCostSourceChange = (costSourceId: string | null) => {
    setSelectedCostSourceId(costSourceId);
    // TODO: Re-fetch table data with cost source if needed
  };

  const handleAddCostSource = () => {
    navigate("/attribution");
  };

  const handleDateRangeChange = (newDateRange: DateRangeValue) => {
    setDateRange(newDateRange);
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

  const data = scorecard?.data;
  const filterOptions = scorecard?.filter_options ?? null;

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
        <div className="container max-w-5xl py-8 px-4">
          {/* Header */}
          <div className="mb-8">
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

          {/* Realtime + Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* Realtime Visitors Card */}
            <Card className="p-5 border border-border bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-start justify-between mb-3">
                <span className="text-primary">
                  <Radio className="h-5 w-5" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary font-medium">Live</span>
                </span>
              </div>
              <p className="text-h2 text-foreground mb-1">
                {realtimeVisitors !== null ? realtimeVisitors.toLocaleString() : "—"}
              </p>
              <p className="text-p3 text-muted-foreground">
                Active now <span className="text-p4">(last 5 min)</span>
              </p>
            </Card>
            <StatCard
              label="Unique Visitors"
              value={loading ? null : (data?.unique_visitors?.toLocaleString() ?? "0")}
              sublabel={getDateRangeLabel()}
              icon={<Users className="h-5 w-5" />}
              loading={loading}
            />
            <StatCard
              label="Page Views"
              value={loading ? null : (data?.pageviews?.toLocaleString() ?? "0")}
              sublabel={getDateRangeLabel()}
              icon={<FileText className="h-5 w-5" />}
              loading={loading}
            />
            <StatCard
              label="Wallets Tracked"
              value={loading ? null : (data?.wallet_users?.toLocaleString() ?? null)}
              sublabel={getDateRangeLabel()}
              icon={<Wallet className="h-5 w-5" />}
              loading={loading}
              showSetup={!loading && data?.wallet_users === null}
              setupTitle="Track wallets"
              setupDescription="See wallet activity"
              onSetupClick={() => setWalletSetupOpen(true)}
            />
            <StatCard
              label="Conversions"
              value={loading ? null : (data?.converted_users?.toLocaleString() ?? null)}
              sublabel={getDateRangeLabel()}
              icon={<Target className="h-5 w-5" />}
              loading={loading}
              showSetup={!loading && data?.converted_users === null}
              setupTitle="Track conversions"
              setupDescription="Measure signups & more"
              onSetupClick={() => setConversionSetupOpen(true)}
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
              costSources={costSources}
              selectedCostSourceId={selectedCostSourceId}
              onCostSourceChange={handleCostSourceChange}
              onAddCostSource={handleAddCostSource}
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
        </div>
      </div>
    </DashboardLayout>
  );
};

interface StatCardProps {
  label: string;
  value: string | null;
  sublabel: string;
  icon: React.ReactNode;
  loading?: boolean;
  showSetup?: boolean;
  setupTitle?: string;
  setupDescription?: string;
  onSetupClick?: () => void;
}

const StatCard = ({ 
  label, 
  value, 
  sublabel, 
  icon, 
  loading,
  showSetup,
  setupTitle,
  setupDescription,
  onSetupClick,
}: StatCardProps) => {
  // Show setup prompt when value is null and showSetup is true
  if (showSetup) {
    return (
      <Card className="p-5 border border-border bg-muted/20 hover:bg-muted/30 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <span className="text-primary">{icon}</span>
        </div>
        <p className="text-p2 font-medium text-foreground mb-1">{setupTitle}</p>
        <p className="text-p4 text-muted-foreground mb-3">{setupDescription}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-primary border-primary/30 hover:bg-primary/10"
          onClick={onSetupClick}
        >
          Set up tracking →
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-5 border border-border">
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground">{icon}</span>
      </div>
      {loading ? (
        <Skeleton className="h-9 w-24 mb-1" />
      ) : (
        <p className="text-h2 text-foreground mb-1">{value ?? "0"}</p>
      )}
      <p className="text-p3 text-muted-foreground">
        {label} <span className="text-p4">({sublabel})</span>
      </p>
    </Card>
  );
};

export default Overview;
