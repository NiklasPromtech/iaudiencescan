import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Search, RefreshCw, ExternalLink } from "lucide-react";
import { listScans, Scan, SUPPORTED_CHAINS } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useSelectedWebsite } from "@/hooks/use-selected-website";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
};

const Scans = () => {
  const navigate = useNavigate();
  const { selectedWebsite, loading: websiteLoading } = useSelectedWebsite();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScans = useCallback(async () => {
    if (!selectedWebsite?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await listScans(selectedWebsite.id);
      setScans(response.scans || []);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
      setError(err instanceof Error ? err.message : "Failed to load scans");
    } finally {
      setLoading(false);
    }
  }, [selectedWebsite?.id]);

  useEffect(() => {
    if (!websiteLoading && selectedWebsite?.id) {
      fetchScans();
    }
  }, [fetchScans, websiteLoading, selectedWebsite?.id]);

  // Auto-refresh when any scan is processing
  useEffect(() => {
    const hasActiveScans = scans.some(
      (s) => s.status === "PENDING" || s.status === "PROCESSING"
    );
    if (hasActiveScans && !loading) {
      const interval = setInterval(fetchScans, 5000);
      return () => clearInterval(interval);
    }
  }, [scans, loading, fetchScans]);

  const getChainLabel = (chain: string) => {
    return SUPPORTED_CHAINS.find((c) => c.value === chain)?.label || chain;
  };

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Scans</h1>
            <p className="text-muted-foreground">
              View and track your audience scans
            </p>
          </div>
          <Button variant="outline" onClick={fetchScans} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-12 border border-destructive text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to load scans</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Button onClick={fetchScans}>Try Again</Button>
          </Card>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scans.length === 0 && (
          <Card className="p-12 border border-dashed border-border text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No scans yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Start a scan from one of your audiences to find more users like them.
            </p>
            <Button onClick={() => navigate("/audiences")}>Go to Audiences</Button>
          </Card>
        )}

        {/* Scan List */}
        {!loading && !error && scans.length > 0 && (
          <div className="space-y-3">
            {scans.map((scan) => (
              <Card
                key={scan.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/scans/${scan.id}`)}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {scan.name || `Scan ${scan.id.slice(0, 8)}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {scan.wallet_count} wallets · {getChainLabel(scan.chain)} ·{" "}
                          {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={statusColors[scan.status] || ""}>
                        {scan.status}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  {/* Progress for active scans */}
                  {(scan.status === "PROCESSING" || scan.status === "PENDING") && (
                    <div className="mt-3 ml-14">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{scan.step_label || "Queued"}</span>
                        <span>{Math.round((scan.progress || 0) * 100)}%</span>
                      </div>
                      <Progress value={(scan.progress || 0) * 100} className="h-1" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Scans;
