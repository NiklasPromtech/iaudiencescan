import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  ExternalLink,
  Wallet,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";
import { 
  fetchScorecard, 
  fetchTableData, 
  ScorecardResponse, 
  TableResponse, 
  TableDimension, 
  Website 
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { ScorecardFilters, ActiveFilters } from "@/components/overview/ScorecardFilters";
import { DailyChart } from "@/components/overview/DailyChart";
import { DimensionTable } from "@/components/overview/DimensionTable";

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

  const loadAllData = useCallback(async (filters: ActiveFilters, dimension: TableDimension) => {
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
          range: { type: "last_full_days", days: 7, timezone },
          filters: filtersParam,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension: "date_day",
          range: { type: "last_full_days", days: 7, timezone },
          filters: filtersParam,
          cost: { mode: "none" },
        }),
        fetchTableData({
          tag_id: selectedWebsite.id,
          dimension,
          range: { type: "last_full_days", days: 7, timezone },
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
  }, [selectedWebsite, timezone, getFiltersParam]);

  const loadTableData = useCallback(async (dimension: TableDimension, filters: ActiveFilters) => {
    if (!selectedWebsite) return;

    setTableLoading(true);
    try {
      const data = await fetchTableData({
        tag_id: selectedWebsite.id,
        dimension,
        range: { type: "last_full_days", days: 7, timezone },
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
  }, [selectedWebsite, timezone, getFiltersParam]);

  useEffect(() => {
    if (selectedWebsite) {
      loadAllData(activeFilters, tableDimension);
    }
  }, [selectedWebsite]);

  const handleFiltersChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    loadAllData(newFilters, tableDimension);
  };

  const handleDimensionChange = (newDimension: TableDimension) => {
    setTableDimension(newDimension);
    loadTableData(newDimension, activeFilters);
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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="border-primary/30 text-primary mb-3">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
            {selectedWebsite?.name || "Loading..."}
          </Badge>
          <h1 className="text-h2 text-foreground mb-2">Overview</h1>
          <p className="text-p1 text-muted-foreground">
            Last 7 days — here's what we're seeing so far.
          </p>
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

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Unique Visitors"
            value={loading ? null : (data?.unique_visitors?.toLocaleString() ?? "0")}
            sublabel="last 7 days"
            icon={<Users className="h-5 w-5" />}
            loading={loading}
          />
          <StatCard
            label="Page Views"
            value={loading ? null : (data?.pageviews?.toLocaleString() ?? "0")}
            sublabel="last 7 days"
            icon={<FileText className="h-5 w-5" />}
            loading={loading}
          />
          <StatCard
            label="Wallets Connected"
            value={loading ? null : (data?.wallet_users?.toLocaleString() ?? "—")}
            sublabel="last 7 days"
            icon={<Wallet className="h-5 w-5" />}
            loading={loading}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Engagement Stats */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 text-foreground">Engagement</h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-p2 text-foreground">Stayed 10s+</span>
                  <span className="text-p2 text-muted-foreground font-medium">
                    {data?.stayed_10s?.toLocaleString() ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-p2 text-foreground">Stayed 30s+</span>
                  <span className="text-p2 text-muted-foreground font-medium">
                    {data?.stayed_30s?.toLocaleString() ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-p2 text-foreground">Stayed 60s+</span>
                  <span className="text-p2 text-muted-foreground font-medium">
                    {data?.stayed_60s?.toLocaleString() ?? "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-p2 text-foreground">Stayed 5m+</span>
                  <span className="text-p2 text-muted-foreground font-medium">
                    {data?.stayed_5m?.toLocaleString() ?? "—"}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Bounce Rate */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 text-foreground">Bounce Rate</h3>
              <Badge variant="secondary" className="text-p4">
                {loading ? "..." : data?.unique_visitors 
                  ? `${Math.round((data.bounce_count / data.unique_visitors) * 100)}%`
                  : "—"}
              </Badge>
            </div>
            {loading ? (
              <Skeleton className="h-2 mb-4" />
            ) : (
              <Progress 
                value={data?.unique_visitors 
                  ? (data.bounce_count / data.unique_visitors) * 100 
                  : 0} 
                className="h-2 mb-4" 
              />
            )}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-h3 text-foreground">
                  {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : data?.bounce_count?.toLocaleString() ?? "—"}
                </p>
                <p className="text-p4 text-muted-foreground">Bounced</p>
              </div>
              <div>
                <p className="text-h3 text-primary">
                  {loading ? <Skeleton className="h-8 w-16 mx-auto" /> : data?.unique_visitors?.toLocaleString() ?? "—"}
                </p>
                <p className="text-p4 text-muted-foreground">Total Visitors</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Traffic Chart */}
        <div className="mb-8">
          <DailyChart data={dailyData?.rows ?? []} loading={chartLoading} />
        </div>

        {/* Dimension Breakdown Table */}
        <div className="mb-8">
          <DimensionTable
            data={tableData?.rows ?? []}
            loading={tableLoading}
            dimension={tableDimension}
            onDimensionChange={handleDimensionChange}
            totalRows={tableData?.pagination?.total_rows ?? 0}
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
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | null;
  sublabel: string;
  icon: React.ReactNode;
  loading?: boolean;
}

const StatCard = ({ label, value, sublabel, icon, loading }: StatCardProps) => (
  <Card className="p-5 border border-border">
    <div className="flex items-start justify-between mb-3">
      <span className="text-muted-foreground">{icon}</span>
    </div>
    {loading ? (
      <Skeleton className="h-9 w-24 mb-1" />
    ) : (
      <p className="text-h2 text-foreground mb-1">{value}</p>
    )}
    <p className="text-p3 text-muted-foreground">
      {label} <span className="text-p4">({sublabel})</span>
    </p>
  </Card>
);

export default Overview;
