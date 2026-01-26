import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, AlertCircle } from "lucide-react";
import { Audience, Website, listAudiences } from "@/lib/api";
import { AudienceList } from "@/components/audiences/AudienceList";
import { AudienceDialog } from "@/components/audiences/AudienceDialog";
import { DeleteAudienceDialog } from "@/components/audiences/DeleteAudienceDialog";

const Audiences = () => {
  const navigate = useNavigate();
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAudience, setEditingAudience] = useState<Audience | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [audienceToDelete, setAudienceToDelete] = useState<Audience | null>(null);

  // Load selected website from localStorage
  useEffect(() => {
    const storedWebsite = localStorage.getItem("selectedWebsite");
    if (storedWebsite) {
      try {
        setSelectedWebsite(JSON.parse(storedWebsite));
      } catch {
        setSelectedWebsite(null);
      }
    }
  }, []);

  const fetchAudiences = useCallback(async () => {
    if (!selectedWebsite) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await listAudiences(selectedWebsite.id);
      setAudiences(response.audiences);
    } catch (err) {
      console.error("Failed to fetch audiences:", err);
      setError(err instanceof Error ? err.message : "Failed to load audiences");
    } finally {
      setLoading(false);
    }
  }, [selectedWebsite]);

  useEffect(() => {
    fetchAudiences();
  }, [fetchAudiences]);

  const handleCreateClick = () => {
    setEditingAudience(null);
    setDialogOpen(true);
  };

  const handleEditClick = (audience: Audience) => {
    setEditingAudience(audience);
    setDialogOpen(true);
  };

  const handleDeleteClick = (audience: Audience) => {
    setAudienceToDelete(audience);
    setDeleteDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    fetchAudiences();
  };

  // No website selected state
  if (!selectedWebsite) {
    return (
      <DashboardLayout>
        <div className="container max-w-5xl py-8 px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Audiences</h1>
            <p className="text-muted-foreground">
              Create and manage audience segments based on visitor behavior.
            </p>
          </div>

          <Card className="p-12 border border-dashed border-border text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No website selected</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Select a website to manage audiences for your tracked visitors.
            </p>
            <Button onClick={() => navigate("/install")}>
              Go to Websites
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="container max-w-5xl py-8 px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Audiences</h1>
            <p className="text-muted-foreground">
              Create and manage audience segments based on visitor behavior.
            </p>
          </div>

          <Card className="p-12 border border-destructive text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Failed to load audiences</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Button onClick={fetchAudiences}>
              Try Again
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Audiences</h1>
            <p className="text-muted-foreground">
              Create and manage audience segments for {selectedWebsite.name}
            </p>
          </div>
          <Button onClick={handleCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create Audience
          </Button>
        </div>

        {/* Audience List or Empty State */}
        {!loading && audiences.length === 0 ? (
          <Card className="p-12 border border-dashed border-border text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No audiences yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Create audience segments from your visitors based on engagement, wallet activity, conversions, and more.
            </p>
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first audience
            </Button>
          </Card>
        ) : (
          <AudienceList
            audiences={audiences}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}

        {/* Coming Soon Features */}
        {audiences.length > 0 && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <Card className="p-4 border border-border bg-muted/20">
              <h4 className="text-sm font-medium text-foreground mb-1">Behavioral segments</h4>
              <p className="text-xs text-muted-foreground">
                Filter by time on site, page views, bounce rate
              </p>
            </Card>
            <Card className="p-4 border border-border bg-muted/20">
              <h4 className="text-sm font-medium text-foreground mb-1">Wallet segments</h4>
              <p className="text-xs text-muted-foreground">
                Target by wallet activity, token holdings, transaction history
              </p>
            </Card>
            <Card className="p-4 border border-border bg-muted/20">
              <h4 className="text-sm font-medium text-foreground mb-1">Conversion segments</h4>
              <p className="text-xs text-muted-foreground">
                Build lookalikes from your best converting visitors
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {selectedWebsite && (
        <AudienceDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          audience={editingAudience}
          website={selectedWebsite}
          onSuccess={handleDialogSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteAudienceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        audience={audienceToDelete}
        onSuccess={handleDialogSuccess}
      />
    </DashboardLayout>
  );
};

export default Audiences;
