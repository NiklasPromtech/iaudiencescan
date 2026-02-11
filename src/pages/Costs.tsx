import { useState } from "react";
import { NoWebsiteState } from "@/components/dashboard/NoWebsiteState";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, RefreshCw } from "lucide-react";
import { CostSource } from "@/lib/api";
import { CostSourceList } from "@/components/costs/CostSourceList";
import { CreateCostSourceDialog } from "@/components/costs/CreateCostSourceDialog";
import { EditCostSourceDialog } from "@/components/costs/EditCostSourceDialog";
import { DeleteCostSourceDialog } from "@/components/costs/DeleteCostSourceDialog";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { useCostSources, useInvalidateCostSources } from "@/hooks/use-dashboard-queries";

const Costs = () => {
  const { selectedWebsite, loading: websiteLoading } = useSelectedWebsite();
  const invalidateCostSources = useInvalidateCostSources();

  const {
    data: costSources = [],
    isLoading: loading,
    isFetching,
    error,
  } = useCostSources(selectedWebsite?.id);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCostSource, setSelectedCostSource] = useState<CostSource | null>(null);

  const handleSuccess = () => {
    if (selectedWebsite?.id) {
      invalidateCostSources(selectedWebsite.id);
    }
  };

  const handleEdit = (costSource: CostSource) => {
    setSelectedCostSource(costSource);
    setEditDialogOpen(true);
  };

  const handleDelete = (costSource: CostSource) => {
    setSelectedCostSource(costSource);
    setDeleteDialogOpen(true);
  };

  const hasData = costSources.length > 0;

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
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-h2 text-foreground mb-2">Attribution</h1>
              {isFetching && !loading && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <p className="text-p1 text-muted-foreground">
              Add cost data to calculate ROI for your campaigns by UTM parameters.
            </p>
          </div>
          {hasData && (
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Cost Source
            </Button>
          )}
        </div>

        {error && (
          <Card className="p-4 mb-8 border-destructive bg-destructive/10">
            <p className="text-destructive text-sm">
              {error instanceof Error ? error.message : "Failed to load cost sources"}
            </p>
          </Card>
        )}

        {/* Cost Source List or Empty State */}
        {loading ? (
          <CostSourceList
            costSources={[]}
            loading={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : hasData ? (
          <CostSourceList
            costSources={costSources}
            loading={false}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Card className="p-12 border border-dashed border-border text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-h3 text-foreground mb-2">No cost sources yet</h3>
            <p className="text-p2 text-muted-foreground mb-6 max-w-md mx-auto">
              Upload or enter cost data to see ROI metrics alongside your traffic data. Match costs to UTM campaigns.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Cost Source
            </Button>
          </Card>
        )}

        {/* How it works */}
        <Card className="mt-8 p-6 border border-border">
          <h3 className="text-h3 text-foreground mb-4">How cost attribution works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-h2 text-primary mb-2">1</div>
              <h4 className="text-p2 font-medium text-foreground mb-1">Add cost data</h4>
              <p className="text-p4 text-muted-foreground">
                Download a CSV template, fill in your spend, and upload it back
              </p>
            </div>
            <div>
              <div className="text-h2 text-primary mb-2">2</div>
              <h4 className="text-p2 font-medium text-foreground mb-1">Match to traffic</h4>
              <p className="text-p4 text-muted-foreground">
                We automatically match costs to visitors by utm_source, utm_medium, utm_campaign
              </p>
            </div>
            <div>
              <div className="text-h2 text-primary mb-2">3</div>
              <h4 className="text-p2 font-medium text-foreground mb-1">See ROI</h4>
              <p className="text-p4 text-muted-foreground">
                View cost per visitor, cost per conversion, and ROAS in your overview
              </p>
            </div>
          </div>
        </Card>

        {/* Dialogs */}
        {selectedWebsite && (
          <>
            <CreateCostSourceDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
              websiteId={selectedWebsite.id}
              onSuccess={handleSuccess}
            />
            <EditCostSourceDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              costSource={selectedCostSource}
              websiteId={selectedWebsite.id}
              onSuccess={handleSuccess}
            />
            <DeleteCostSourceDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              costSource={selectedCostSource}
              websiteId={selectedWebsite.id}
              onSuccess={handleSuccess}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Costs;
