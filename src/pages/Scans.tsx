import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Search, RefreshCw, ExternalLink, Archive, ArchiveRestore, MoreHorizontal } from "lucide-react";
import { archiveScan, unarchiveScan, Scan, SUPPORTED_CHAINS } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { useToast } from "@/hooks/use-toast";
import { useScans, useInvalidateScans } from "@/hooks/use-dashboard-queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoWebsiteState } from "@/components/dashboard/NoWebsiteState";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
};

const Scans = () => {
  const navigate = useNavigate();
  const { selectedWebsite, loading: websiteLoading } = useSelectedWebsite();
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const invalidateScans = useInvalidateScans();

  const { 
    data: scans = [], 
    isLoading: loading, 
    isFetching,
    error,
    refetch 
  } = useScans(selectedWebsite?.id, showArchived);

  const handleArchive = async (scan: Scan, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await archiveScan(scan.id);
      if (selectedWebsite?.id) {
        invalidateScans(selectedWebsite.id);
      }
      toast({
        title: "Scan archived",
        description: `${scan.name || `Scan ${scan.id.slice(0, 8)}`} has been archived.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to archive",
        description: error.message || "Could not archive scan",
        variant: "destructive",
      });
    }
  };

  const handleUnarchive = async (scan: Scan, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await unarchiveScan(scan.id);
      if (selectedWebsite?.id) {
        invalidateScans(selectedWebsite.id);
      }
      toast({
        title: "Scan restored",
        description: `${scan.name || `Scan ${scan.id.slice(0, 8)}`} has been restored.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to restore",
        description: error.message || "Could not restore scan",
        variant: "destructive",
      });
    }
  };

  const getChainLabel = (chain: string) => {
    return SUPPORTED_CHAINS.find((c) => c.value === chain)?.label || chain;
  };

  const activeScans = scans.filter(s => !s.archived_at);
  const archivedScans = scans.filter(s => s.archived_at);

  if (!websiteLoading && !selectedWebsite) {
    return (
      <DashboardLayout>
        <NoWebsiteState />
      </DashboardLayout>
    );
  }

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
          <div className="flex items-center gap-2">
            {archivedScans.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className="text-muted-foreground"
              >
                <Archive className="h-4 w-4 mr-2" />
                {showArchived ? "Hide archived" : `Archived (${archivedScans.length})`}
              </Button>
            )}
            <Button variant="outline" onClick={() => refetch()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="p-12 border border-destructive text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to load scans</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
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
        {!loading && !error && activeScans.length === 0 && !showArchived && (
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
        {!loading && !error && activeScans.length > 0 && (
          <div className="space-y-3">
            {activeScans.map((scan) => (
              <div
                key={scan.id}
                className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleArchive(scan, e)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              </div>
            ))}
          </div>
        )}

        {/* Archived Scans */}
        {!loading && !error && showArchived && archivedScans.length > 0 && (
          <div className="space-y-3 mt-8">
            <h2 className="text-lg font-medium text-muted-foreground mb-4">Archived Scans</h2>
            {archivedScans.map((scan) => (
              <div
                key={scan.id}
                className="px-4 py-3 border-b border-border opacity-60 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground">
                        {scan.name || `Scan ${scan.id.slice(0, 8)}`}
                      </h3>
                      <p className="text-sm text-muted-foreground/70">
                        {scan.wallet_count} wallets · {getChainLabel(scan.chain)} ·{" "}
                        {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleUnarchive(scan, e)}
                  >
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Scans;
