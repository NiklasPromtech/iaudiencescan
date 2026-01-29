import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowLeft, RefreshCw, Search, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getScan, Scan, SUPPORTED_CHAINS } from "@/lib/api";
import { format, formatDistanceToNow } from "date-fns";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  PENDING: {
    icon: <Clock className="h-5 w-5" />,
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    label: "Pending",
  },
  PROCESSING: {
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    label: "Processing",
  },
  COMPLETED: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    label: "Completed",
  },
  FAILED: {
    icon: <XCircle className="h-5 w-5" />,
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Failed",
  },
};

const ScanDetail = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScan = useCallback(async () => {
    if (!scanId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getScan(scanId);
      setScan(response);
    } catch (err) {
      console.error("Failed to fetch scan:", err);
      setError(err instanceof Error ? err.message : "Failed to load scan details");
    } finally {
      setLoading(false);
    }
  }, [scanId]);

  useEffect(() => {
    fetchScan();
  }, [fetchScan]);

  // Auto-refresh for pending/processing scans
  useEffect(() => {
    if (scan?.status === "PENDING" || scan?.status === "PROCESSING") {
      const interval = setInterval(fetchScan, 5000);
      return () => clearInterval(interval);
    }
  }, [scan?.status, fetchScan]);

  // Auto-redirect to results when scan completes
  useEffect(() => {
    if (scan?.status === "COMPLETED" && scanId) {
      navigate(`/scans/${scanId}/results`);
    }
  }, [scan?.status, scanId, navigate]);

  const getChainLabel = (chain: string) => {
    return SUPPORTED_CHAINS.find((c) => c.value === chain)?.label || chain;
  };

  const status = scan ? statusConfig[scan.status] : null;

  return (
    <DashboardLayout>
      <div className="container max-w-3xl py-8 px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => navigate("/scans")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scans
        </Button>

        {/* Loading State */}
        {loading && !scan && (
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-12 border border-destructive text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to load scan</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/scans")}>
                Back to Scans
              </Button>
              <Button onClick={fetchScan}>Try Again</Button>
            </div>
          </Card>
        )}

        {/* Scan Details */}
        {scan && !error && (
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      {scan.name || `Scan ${scan.id.slice(0, 8)}`}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      ID: {scan.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status && (
                    <Badge variant="outline" className={`${status.color} flex items-center gap-1.5`}>
                      {status.icon}
                      {status.label}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchScan}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Progress Bar (for processing) */}
              {(scan.status === "PROCESSING" || scan.status === "PENDING") && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">
                    {scan.step_label || "Queued"}
                  </p>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round((scan.progress || 0) * 100)}%</span>
                  </div>
                  <Progress value={(scan.progress || 0) * 100} />
                </div>
              )}

              {/* Error Message */}
              {scan.status === "FAILED" && scan.error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{scan.error}</p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Wallets</p>
                  <p className="text-2xl font-semibold">{scan.wallet_count}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Chain</p>
                  <p className="text-2xl font-semibold">{getChainLabel(scan.chain)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Started</p>
                  <p className="text-lg font-medium">
                    {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-lg font-medium">
                    {scan.completed_at
                      ? formatDistanceToNow(new Date(scan.completed_at), { addSuffix: true })
                      : "—"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Details Card */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Details</h2>
              <dl className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Scan ID</dt>
                  <dd className="font-mono text-sm">{scan.id}</dd>
                </div>
                {scan.audience_id && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Source Audience</dt>
                    <dd className="font-mono text-sm">{scan.audience_id}</dd>
                  </div>
                )}
                {scan.website_id && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <dt className="text-muted-foreground">Website ID</dt>
                    <dd className="font-mono text-sm">{scan.website_id}</dd>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-border">
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{format(new Date(scan.created_at), "PPpp")}</dd>
                </div>
                {scan.completed_at && (
                  <div className="flex justify-between py-2">
                    <dt className="text-muted-foreground">Completed</dt>
                    <dd>{format(new Date(scan.completed_at), "PPpp")}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {/* Results Link (when completed) */}
            {scan.status === "COMPLETED" && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Scan Complete</h3>
                    <p className="text-sm text-muted-foreground">
                      View the results and insights from this scan
                    </p>
                  </div>
                  <Button onClick={() => navigate(`/scans/${scan.id}/results`)}>
                    View Results
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScanDetail;
