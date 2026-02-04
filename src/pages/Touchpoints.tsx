import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { format } from "date-fns";
import { CreateTouchpointDialog } from "@/components/touchpoints/CreateTouchpointDialog";
import { EditTouchpointDialog } from "@/components/touchpoints/EditTouchpointDialog";
import { DeleteTouchpointDialog } from "@/components/touchpoints/DeleteTouchpointDialog";

export interface Touchpoint {
  id: string;
  website_id: string;
  user_id: string;
  name: string;
  event_type: "single" | "range";
  timestamp: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  color: string;
  cost_amount: number | null;
  cost_currency: string | null;
  created_at: string;
}

const Touchpoints = () => {
  const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTouchpoint, setEditingTouchpoint] = useState<Touchpoint | null>(null);
  const [deletingTouchpoint, setDeletingTouchpoint] = useState<Touchpoint | null>(null);
  
  const { selectedWebsite } = useSelectedWebsite();

  const fetchTouchpoints = async () => {
    if (!selectedWebsite?.id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("touchpoints")
      .select("*")
      .eq("website_id", selectedWebsite.id)
      .order("timestamp", { ascending: false, nullsFirst: false });

    if (!error && data) {
      setTouchpoints(data as Touchpoint[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTouchpoints();
  }, [selectedWebsite?.id]);

  const formatTouchpointDate = (tp: Touchpoint) => {
    if (tp.event_type === "single" && tp.timestamp) {
      return format(new Date(tp.timestamp), "MMM d, yyyy 'at' h:mm a");
    }
    if (tp.event_type === "range" && tp.start_date && tp.end_date) {
      return `${format(new Date(tp.start_date), "MMM d")} - ${format(new Date(tp.end_date), "MMM d, yyyy")}`;
    }
    return "No date";
  };

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
              <Card
                key={tp.id}
                className="p-4 border border-border hover:border-primary/30 transition-colors"
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
              </Card>
            ))}
          </div>
        )}

        {/* Dialogs */}
        <CreateTouchpointDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          websiteId={selectedWebsite?.id}
          onSuccess={fetchTouchpoints}
        />

        {editingTouchpoint && (
          <EditTouchpointDialog
            open={!!editingTouchpoint}
            onOpenChange={(open) => !open && setEditingTouchpoint(null)}
            touchpoint={editingTouchpoint}
            onSuccess={fetchTouchpoints}
          />
        )}

        {deletingTouchpoint && (
          <DeleteTouchpointDialog
            open={!!deletingTouchpoint}
            onOpenChange={(open) => !open && setDeletingTouchpoint(null)}
            touchpoint={deletingTouchpoint}
            onSuccess={fetchTouchpoints}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Touchpoints;
