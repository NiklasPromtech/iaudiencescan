import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Calendar,
  Edit2,
  Trash2,
  Megaphone,
} from "lucide-react";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { format } from "date-fns";
import { CreateTouchpointDialog } from "@/components/touchpoints/CreateTouchpointDialog";
import { EditTouchpointDialog } from "@/components/touchpoints/EditTouchpointDialog";
import { DeleteTouchpointDialog } from "@/components/touchpoints/DeleteTouchpointDialog";
import { useTouchpoints, useInvalidateTouchpoints, Touchpoint } from "@/hooks/use-dashboard-queries";
import { NoWebsiteState } from "@/components/dashboard/NoWebsiteState";

const Touchpoints = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTouchpoint, setEditingTouchpoint] = useState<Touchpoint | null>(null);
  const [deletingTouchpoint, setDeletingTouchpoint] = useState<Touchpoint | null>(null);
  
  const { selectedWebsite, loading: websiteLoading } = useSelectedWebsite();
  const invalidateTouchpoints = useInvalidateTouchpoints();

  const {
    data: touchpoints = [],
    isLoading: loading,
  } = useTouchpoints(selectedWebsite?.id);

  const handleSuccess = () => {
    if (selectedWebsite?.id) {
      invalidateTouchpoints(selectedWebsite.id);
    }
  };

  const formatTouchpointDate = (tp: Touchpoint) => {
    if (tp.event_type === "single" && tp.timestamp) {
      return format(new Date(tp.timestamp), "MMM d, yyyy 'at' h:mm a");
    }
    if (tp.event_type === "range" && tp.start_date && tp.end_date) {
      return `${format(new Date(tp.start_date), "MMM d")} - ${format(new Date(tp.end_date), "MMM d, yyyy")}`;
    }
    return "No date";
  };

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
            <h1 className="text-h2 text-foreground mb-2">Touchpoints</h1>
            <p className="text-p2 text-muted-foreground">
              Log marketing activities, events, and outreach to see their impact on your metrics.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Touchpoint
          </Button>
        </div>

        {/* Touchpoints List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : touchpoints.length === 0 ? (
          <Card className="p-12 border border-dashed border-border bg-muted/20">
            <div className="text-center">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-h3 text-foreground mb-2">No touchpoints yet</h3>
              <p className="text-p2 text-muted-foreground mb-6">
                Start logging your marketing activities to see how they correlate with your metrics.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first touchpoint
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {touchpoints.map((tp) => (
              <div
                key={tp.id}
                className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: tp.color }}
                    />
                    <div>
                      <h4 className="text-p1 font-medium text-foreground">{tp.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-p3 text-muted-foreground">
                          {formatTouchpointDate(tp)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {tp.event_type === "single" ? "Single event" : "Date range"}
                        </Badge>
                      </div>
                      {tp.notes && (
                        <p className="text-p3 text-muted-foreground mt-2 line-clamp-2">
                          {tp.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingTouchpoint(tp)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeletingTouchpoint(tp)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialogs */}
        <CreateTouchpointDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          websiteId={selectedWebsite?.id}
          onSuccess={handleSuccess}
        />

        {editingTouchpoint && (
          <EditTouchpointDialog
            open={!!editingTouchpoint}
            onOpenChange={(open) => !open && setEditingTouchpoint(null)}
            touchpoint={editingTouchpoint}
            onSuccess={handleSuccess}
          />
        )}

        {deletingTouchpoint && (
          <DeleteTouchpointDialog
            open={!!deletingTouchpoint}
            onOpenChange={(open) => !open && setDeletingTouchpoint(null)}
            touchpoint={deletingTouchpoint}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Touchpoints;
