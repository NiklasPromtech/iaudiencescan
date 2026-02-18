import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft, Network, Users, Newspaper, Globe, Download, FileText } from "lucide-react";
import { openReport } from "@/lib/report-export";
import {
  getScan,
  getScanResults,
  Scan,
  ScanResultsResponse,
  SUPPORTED_CHAINS,
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ScanResultsStats } from "@/components/scan-results/ScanResultsStats";
import { CommunitiesTab } from "@/components/scan-results/CommunitiesTab";
import { NewsFeedTab } from "@/components/scan-results/NewsFeedTab";
import { WebsitesTab } from "@/components/scan-results/WebsitesTab";
import { ExportCenterTab } from "@/components/scan-results/ExportCenterTab";
import { getPlatformCounts } from "@/lib/export-utils";

const ScanResults = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<Scan | null>(null);
  const [results, setResults] = useState<ScanResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("communities");

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

  const tokens = results?.top_tokens || [];
  const counts = useMemo(() => getPlatformCounts(tokens), [tokens]);

  return (
    <DashboardLayout>
      <div className="container max-w-[1600px] py-8 px-4">
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
          <div className="p-12 border border-destructive text-center">
            <div className="mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-destructive mx-auto" />
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
          </div>
        )}

        {/* Results Content */}
        {scan && results && !error && !loading && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className="-ml-2"
                onClick={() => navigate("/scans")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scan Details
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => openReport(scan, results)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/network/${scanId}`)}
                >
                  <Network className="h-4 w-4 mr-2" />
                  View Full Network
                </Button>
              </div>
            </div>

            {/* Title Section */}
            <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
                {scan.name || `Scan ${scan.id.slice(0, 8)}`}
              </h1>
              <p className="font-mono text-xs text-muted-foreground tracking-wide">
                {getChainLabel(scan.chain)} • {scan.wallet_count} wallets analyzed •{" "}
                {scan.completed_at
                  ? `Completed ${formatDistanceToNow(new Date(scan.completed_at), { addSuffix: true })}`
                  : "Processing..."}
              </p>
            </div>

            {/* Summary Stats */}
            <ScanResultsStats results={results} />

            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border border-border">
                <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
                  <TabsTrigger value="communities" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 data-[state=active]:shadow-none px-4 py-3 gap-2">
                    <Users className="h-4 w-4" />
                    Communities
                  </TabsTrigger>
                  <TabsTrigger value="news" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 data-[state=active]:shadow-none px-4 py-3 gap-2">
                    <Newspaper className="h-4 w-4" />
                    News
                    {counts.news > 0 && (
                      <span className="font-mono tabular-nums text-muted-foreground">{counts.news}</span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="websites" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 data-[state=active]:shadow-none px-4 py-3 gap-2">
                    <Globe className="h-4 w-4" />
                    Websites
                  </TabsTrigger>
                  <TabsTrigger value="export" className="font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 data-[state=active]:shadow-none px-4 py-3 gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="communities" className="mt-0 p-4">
                  <CommunitiesTab tokens={tokens} />
                </TabsContent>

                <TabsContent value="news" className="mt-0 p-4">
                  <NewsFeedTab tokens={tokens} />
                </TabsContent>

                <TabsContent value="websites" className="mt-0 p-4">
                  <WebsitesTab tokens={tokens} />
                </TabsContent>

                <TabsContent value="export" className="mt-0 p-4">
                  <ExportCenterTab tokens={tokens} scanName={scan.name || undefined} scan={scan} results={results} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScanResults;
