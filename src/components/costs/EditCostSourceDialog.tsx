import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CostSource, CostSourceWithDetails, CostEntry, getCostSource, updateCostSource } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";

interface EditCostSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costSource: CostSource | null;
  websiteId: string;
  onSuccess: () => void;
}

const DIMENSION_LABELS: Record<string, string> = {
  utm_source: "UTM Source",
  utm_medium: "UTM Medium",
  utm_campaign: "UTM Campaign",
  utm_content: "UTM Content",
  utm_term: "UTM Term",
  referrer_domain: "Referrer",
};

export function EditCostSourceDialog({
  open,
  onOpenChange,
  costSource,
  websiteId,
  onSuccess,
}: EditCostSourceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<CostSourceWithDetails | null>(null);
  const [name, setName] = useState("");
  const [editedCosts, setEditedCosts] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (open && costSource) {
      loadDetails();
    }
  }, [open, costSource]);

  const loadDetails = async () => {
    if (!costSource) return;

    setLoading(true);
    try {
      const response = await getCostSource(costSource.id, websiteId);
      setDetails(response.cost_source);
      setName(response.cost_source.name);

      // Initialize edited costs from the loaded data
      const costs: Record<string, Record<string, number>> = {};
      response.cost_source.costs.forEach((row) => {
        costs[row.date] = row.values;
      });
      setEditedCosts(costs);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load cost source");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCostChange = (date: string, dimensionValue: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setEditedCosts((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [dimensionValue]: numValue,
      },
    }));
  };

  const handleSave = async () => {
    if (!costSource) return;

    setSaving(true);
    try {
      // Convert edited costs to array format
      const costs: CostEntry[] = [];
      Object.entries(editedCosts).forEach(([date, values]) => {
        Object.entries(values).forEach(([dimensionValue, cost]) => {
          if (cost > 0) {
            costs.push({ date, dimension_value: dimensionValue, cost });
          }
        });
      });

      await updateCostSource(costSource.id, {
        tag_id: websiteId,
        name: name.trim() || undefined,
        costs,
      });

      toast.success("Cost source updated");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update cost source");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setDetails(null);
      setEditedCosts({});
    }
    onOpenChange(isOpen);
  };

  const totalCost = Object.values(editedCosts).reduce(
    (sum, values) => sum + Object.values(values).reduce((s, v) => s + v, 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Cost Source</DialogTitle>
          <DialogDescription>
            Update the name or modify cost values.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : details ? (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Dimension</Label>
                <div className="mt-2">
                  <Badge variant="outline">
                    {DIMENSION_LABELS[details.dimension] || details.dimension}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Total</Label>
                <p className="text-lg font-semibold mt-1">
                  ${totalCost.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 sticky left-0 bg-muted/50">Date</th>
                    {details.dimension_values.map((value) => (
                      <th key={value} className="text-right p-2 min-w-[100px]">
                        {value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {details.costs.map((row) => (
                    <tr key={row.date} className="border-t">
                      <td className="p-2 sticky left-0 bg-background font-medium">
                        {format(new Date(row.date), "MMM d")}
                      </td>
                      {details.dimension_values.map((value) => (
                        <td key={value} className="p-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-8 text-right"
                            value={editedCosts[row.date]?.[value] ?? 0}
                            onChange={(e) =>
                              handleCostChange(row.date, value, e.target.value)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
