import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, Network } from "lucide-react";
import {
  getScan,
  getScanResults,
  Scan,
  ScanResultsResponse,
  SUPPORTED_CHAINS,
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ScanResultsStats } from "@/components/scan-results/ScanResultsStats";
import { TargetingFilters } from "@/components/scan-results/TargetingFilters";
import { PlatformTargetingCard } from "@/components/scan-results/PlatformTargetingCard";
import { XAdsIntegration } from "@/components/scan-results/XAdsIntegration";

const ScanResults = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<Scan | null>(null);
  const [results, setResults] = useState<ScanResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [minMarketCap, setMinMarketCap] = useState<number | null>(null);
  const [minTransactions, setMinTransactions] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"wallets" | "market_cap" | "transactions">("wallets");

  const fetchData = useCallback(async () => {
    if (!scanId) return;

    setLoading(true);
    setError(null);
    try {
      const [scanData, resultsData] = await Promise.all([
        getScan(scanId),
        getScanResults(scanId),
      ]);
      setScan(scanData);
      setResults(resultsData);
    } catch (err) {
      console.error("Failed to fetch scan results:", err);
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [scanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getChainLabel = (chain: string) => {
    return SUPPORTED_CHAINS.find((c) => c.value === chain)?.label || chain;
  };

  // Filter and sort tokens
  const filteredTokens = useMemo(() => {
    if (!results?.top_tokens) return [];

    let tokens = [...results.top_tokens];

    // Apply filters
    if (minMarketCap !== null) {
      tokens = tokens.filter((t) => (t.market_cap_usd ?? 0) >= minMarketCap);
    }
    if (minTransactions !== null) {
      tokens = tokens.filter((t) => (t.transaction_count ?? 0) >= minTransactions);
    }

    // Sort
    tokens.sort((a, b) => {
      switch (sortBy) {
        case "market_cap":
          return (b.market_cap_usd ?? 0) - (a.market_cap_usd ?? 0);
        case "transactions":
          return (b.transaction_count ?? 0) - (a.transaction_count ?? 0);
        case "wallets":
        default:
          return (b.unique_wallets ?? 0) - (a.unique_wallets ?? 0);
      }
    });

    return tokens;
  }, [results?.top_tokens, minMarketCap, minTransactions, sortBy]);

  return (
    <DashboardLayout>
      <div className="container max-w-6xl py-8 px-4">
        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-64" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-12 border border-destructive text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Failed to load results
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/scans")}>
                Back to Scans
              </Button>
              <Button onClick={fetchData}>Try Again</Button>
            </div>
          </Card>
        )}

        {/* Results Content */}
        {scan && results && !error && !loading && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="-ml-2"
                onClick={() => navigate(`/scans/${scanId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scan Details
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/network/${scanId}`)}
              >
                <Network className="h-4 w-4 mr-2" />
                View Full Network
              </Button>
            </div>

            {/* Title Section */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Targeting Opportunities
              </h1>
              <p className="text-muted-foreground">
                {scan.name || `Scan ${scan.id.slice(0, 8)}`} • {getChainLabel(scan.chain)} • {scan.wallet_count} wallets analyzed •{" "}
                {scan.completed_at
                  ? `Completed ${formatDistanceToNow(new Date(scan.completed_at), { addSuffix: true })}`
                  : "Processing..."}
              </p>
            </div>

            {/* Summary Stats */}
            <ScanResultsStats results={results} />

            {/* X Ads Integration CTA */}
            <XAdsIntegration tokens={filteredTokens} scanId={scanId!} />

            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Filter Communities</h3>
                  <p className="text-xs text-muted-foreground">
                    Narrow down to high-value targeting opportunities
                  </p>
                </div>
                <TargetingFilters
                  minMarketCap={minMarketCap}
                  setMinMarketCap={setMinMarketCap}
                  minTransactions={minTransactions}
                  setMinTransactions={setMinTransactions}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              </div>
            </Card>

            {/* Platform Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformTargetingCard platform="twitter" tokens={filteredTokens} />
              <PlatformTargetingCard platform="telegram" tokens={filteredTokens} />
              <PlatformTargetingCard platform="reddit" tokens={filteredTokens} />
              <PlatformTargetingCard platform="discord" tokens={filteredTokens} />
            </div>

            {/* Empty State for Filtered Results */}
            {filteredTokens.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No communities match your current filters. Try adjusting the minimum market cap or transactions.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setMinMarketCap(null);
                    setMinTransactions(null);
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScanResults;
