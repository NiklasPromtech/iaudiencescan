import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, X, Loader2, ClipboardCopy } from "lucide-react";
import { formatOverviewForAI } from "@/lib/overview-export";
import { copyToClipboard } from "@/lib/export-utils";
import { 
  TableDimension,
  Website,
  DIMENSION_TO_FILTER,
  ActiveFilters,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { FilterDialog } from "@/components/overview/FilterDialog";

import { DailyChart } from "@/components/overview/DailyChart";
import { DimensionTable } from "@/components/overview/DimensionTable";
import { EventsTable } from "@/components/overview/EventsTable";
import { WalletsOverviewTable } from "@/components/overview/WalletsOverviewTable";
import { WalletExtensionsTable } from "@/components/overview/WalletExtensionsTable";
import { WalletDistributionTable } from "@/components/overview/WalletDistributionTable";
import { ClicksTable } from "@/components/overview/ClicksTable";
import { WalletHoldingsTable } from "@/components/overview/WalletHoldingsTable";
import { TrackingSetupDialog } from "@/components/overview/TrackingSetupDialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DateRangePicker, DateRangeValue } from "@/components/overview/DateRangePicker";
import { AudienceDialog, AudienceDialogInitialFilters } from "@/components/audiences/AudienceDialog";
import { WalletDetailDialog } from "@/components/wallets/WalletDetailDialog";
import { ScorecardChips } from "@/components/overview/ScorecardChips";
import { useStarredMetrics } from "@/hooks/use-starred-metrics";
import { NoWebsiteState } from "@/components/dashboard/NoWebsiteState";
import { ComparisonConfirmCard } from "@/components/overview/ComparisonConfirmCard";
import { useOverviewData } from "@/hooks/use-overview-data";

const Overview = () => {
  const navigate = useNavigate();
  const { starredMetrics, toggleMetric } = useStarredMetrics();

  // Audience dialog state
  const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
  const [audienceDialogFilters, setAudienceDialogFilters] = useState<AudienceDialogInitialFilters | undefined>(undefined);
  const [detailWalletAddress, setDetailWalletAddress] = useState<string | null>(null);

  const {
    selectedWebsite,
    websiteLoading,
    data,
    dailyData,
    tableData,
    tableDimension,
    setTableDimension,
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
    realtimeVisitors,
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
    activeFilters,
    setActiveFilters,
    dateRange,
    setDateRange,
    comparisonMode,
    setComparisonMode,
    comparisonData,
    walletSetupOpen,
    setWalletSetupOpen,
    conversionSetupOpen,
    setConversionSetupOpen,
    loadAllData,
    loadTableData,
    getRangeConfig,
    getDateRangeLabel,
    getPreviousRangeConfig,
    handleStartComparison,
    handleExitComparison,
    fetchComparisonTableData,
  } = useOverviewData();

  if (!websiteLoading && !selectedWebsite) {
    return (
      <DashboardLayout>
        <NoWebsiteState />
      </DashboardLayout>
    );
  }

  const handleFiltersChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    setTableDimension("referrer_domain");
    handleExitComparison();
    loadAllData(newFilters, "referrer_domain", getRangeConfig());
  };

  const handleDimensionChange = (newDimension: TableDimension) => {
    setTableDimension(newDimension);
    setSelectedCostSourceId(null);
    loadTableData(newDimension, activeFilters, getRangeConfig(), null);

    if (comparisonMode === "active" && comparisonData) {
      const { range: prevRange } = getPreviousRangeConfig();
      fetchComparisonTableData(newDimension, prevRange);
    }
  };

  const handleCostSourceChange = (costSourceId: string | null) => {
    setSelectedCostSourceId(costSourceId);
    loadTableData(tableDimension, activeFilters, getRangeConfig(), costSourceId);
  };

  const handleAddCostSource = () => {
    navigate("/costs");
  };

  const handleDateRangeChange = (newDateRange: DateRangeValue) => {
    setDateRange(newDateRange);
    handleExitComparison();
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
    const filterKey = DIMENSION_TO_FILTER[tableDimension];
    if (!filterKey) return;

    const combinedFilters: Record<string, string[]> = { ...activeFilters };
    combinedFilters[filterKey] = [dimValue];

    setAudienceDialogFilters({
      dateRange,
      filters: combinedFilters,
    });
    setAudienceDialogOpen(true);
  };

  const handleAudienceDialogSuccess = () => {
    navigate("/audiences");
  };

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
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="default"
                  className="h-10 text-xs font-mono border-dashed border-primary/40 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    const text = formatOverviewForAI({
                      websiteName: selectedWebsite?.name || "Unknown",
                      dateRange,
                      scorecard: data ?? null,
                      dailyRows: dailyData?.rows ?? [],
                      dimensionRows: tableData?.rows ?? [],
                      dimensionName: tableDimension,
                      eventsRows: eventsData?.rows ?? [],
                      walletsRows: walletsData?.rows ?? [],
                      walletExtensionsRows: walletExtensionsData?.rows ?? [],
                      walletDistributionRows: walletDistributionData?.rows ?? [],
                      clicksRows: clicksData?.rows ?? [],
                      holderData,
                      activeFilters,
                      compScorecard: comparisonData?.scorecard?.data?.data ?? null,
                      compDailyRows: comparisonData?.table_date_day?.data?.rows,
                      compDimensionRows: comparisonData?.table_referrer_domain?.data?.rows,
                      compEventsRows: comparisonData?.events?.data?.rows,
                      compWalletsRows: comparisonData?.wallets?.data?.rows,
                      compWalletExtensionsRows: comparisonData?.wallet_extensions?.data?.rows,
                      compWalletDistributionRows: comparisonData?.wallet_distribution?.data?.rows,
                      compClicksRows: comparisonData?.clicks?.data?.rows,
                      compHolderData: comparisonData?.holders?.data?.data,
                    });
                    copyToClipboard(text, "Copied overview data for AI");
                  }}
                >
                  <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                  Copy to AI
                </Button>
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

          {/* Compare periods button / confirm card */}
          <div className="mb-6">
            {comparisonMode === "idle" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setComparisonMode("confirming")}
                className="border-dashed border-primary/40 text-muted-foreground hover:text-foreground h-8 text-xs font-mono"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
                Compare to previous period
              </Button>
            )}
            {comparisonMode === "confirming" && (
              <ComparisonConfirmCard
                dateRangeLabel={getDateRangeLabel()}
                previousRangeLabel={getPreviousRangeConfig().label}
                activeFilters={activeFilters}
                onConfirm={handleStartComparison}
                onCancel={() => setComparisonMode("idle")}
              />
            )}
            {comparisonMode === "loading" && (
              <Button variant="outline" size="sm" disabled className="border-dashed border-primary/40 h-8 text-xs font-mono">
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Loading comparison…
              </Button>
            )}
            {comparisonMode === "active" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExitComparison}
                className="border-primary/40 text-primary hover:text-foreground h-8 text-xs font-mono"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Exit comparison
              </Button>
            )}
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
              comparisonData={
                comparisonMode === "active" && comparisonData?.scorecard?.data?.data
                  ? (() => {
                      const compScorecard = comparisonData.scorecard.data.data;
                      const compHolderData = comparisonData.holders?.data?.data;
                      if (compHolderData && compHolderData.length > 0) {
                        const latestDate = compHolderData.reduce((latest: string, item: any) => item.date > latest ? item.date : latest, compHolderData[0].date);
                        const latestDayData = compHolderData.filter((item: any) => item.date === latestDate);
                        const compHolderTotal = latestDayData.reduce((sum: number, item: any) => sum + item.holder_count, 0);
                        return { ...compScorecard, token_holders: compHolderTotal };
                      }
                      return compScorecard;
                    })()
                  : undefined
              }
            />
          </div>

          {/* Daily Traffic Chart */}
          <div className="mb-6">
            <DailyChart
              data={dailyData?.rows ?? []} 
              loading={chartLoading} 
              holderData={holderData}
              comparisonData={
                comparisonMode === "active" && comparisonData?.table_date_day?.data?.rows
                  ? comparisonData.table_date_day.data.rows
                  : undefined
              }
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
              comparisonRows={
                comparisonMode === "active" && comparisonData?.table_referrer_domain?.data?.rows
                  ? comparisonData.table_referrer_domain.data.rows
                  : undefined
              }
            />
          </div>

          {/* Events, Wallets & Extensions Tables */}
          <div className="border border-border mb-6">
            <Tabs defaultValue="events">
              <TabsList className="w-full grid grid-cols-6 border-b border-border bg-transparent p-0">
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
                <TabsTrigger value="holdings" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 px-4 py-3">
                  Wallet Holdings
                  <span className="ml-2 font-mono tabular-nums text-muted-foreground">({walletHoldingsData.length})</span>
                </TabsTrigger>
              </TabsList>
              <div className="p-4">
                <TabsContent value="events" className="mt-0">
                  <EventsTable
                    data={eventsData?.rows ?? []}
                    loading={eventsLoading}
                    totalRows={eventsData?.pagination?.total_rows ?? 0}
                    hideHeader
                    comparisonData={
                      comparisonMode === "active" && comparisonData?.events?.data?.rows
                        ? comparisonData.events.data.rows
                        : undefined
                    }
                  />
                </TabsContent>
                <TabsContent value="wallets" className="mt-0">
                  <WalletsOverviewTable
                    data={walletsData?.rows ?? []}
                    loading={walletsLoading}
                    totalRows={walletsData?.pagination?.total_rows ?? 0}
                    hideHeader
                    comparisonData={
                      comparisonMode === "active" && comparisonData?.wallets?.data?.rows
                        ? comparisonData.wallets.data.rows
                        : undefined
                    }
                  />
                </TabsContent>
                <TabsContent value="extensions" className="mt-0">
                  <WalletExtensionsTable
                    data={walletExtensionsData?.rows ?? []}
                    loading={walletExtensionsLoading}
                    totalRows={walletExtensionsData?.total_with_extension ?? walletExtensionsData?.rows?.length ?? 0}
                    hideHeader
                    comparisonData={
                      comparisonMode === "active" && comparisonData?.wallet_extensions?.data?.rows
                        ? comparisonData.wallet_extensions.data.rows
                        : undefined
                    }
                  />
                </TabsContent>
                <TabsContent value="distribution" className="mt-0">
                  <WalletDistributionTable
                    data={walletDistributionData?.rows ?? []}
                    loading={walletDistributionLoading}
                    totalRows={walletDistributionData?.rows?.length ?? 0}
                    hideHeader
                    comparisonData={
                      comparisonMode === "active" && comparisonData?.wallet_distribution?.data?.rows
                        ? comparisonData.wallet_distribution.data.rows
                        : undefined
                    }
                  />
                </TabsContent>
                <TabsContent value="clicks" className="mt-0">
                  <ClicksTable
                    data={clicksData?.rows ?? []}
                    loading={clicksLoading}
                    totalRows={clicksData?.pagination?.total_rows ?? 0}
                    hideHeader
                    comparisonData={
                      comparisonMode === "active" && comparisonData?.clicks?.data?.rows
                        ? comparisonData.clicks.data.rows
                        : undefined
                    }
                  />
                </TabsContent>
                <TabsContent value="holdings" className="mt-0">
                  <WalletHoldingsTable
                    data={walletHoldingsData}
                    loading={walletHoldingsLoading}
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
              onWalletClick={setDetailWalletAddress}
              initialFilters={audienceDialogFilters}
            />
          )}
          {selectedWebsite && (
            <WalletDetailDialog
              walletAddress={detailWalletAddress}
              websiteId={selectedWebsite.id}
              onOpenChange={() => setDetailWalletAddress(null)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
