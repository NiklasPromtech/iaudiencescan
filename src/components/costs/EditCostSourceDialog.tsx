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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CostSource, CostSourceWithDetails, CostEntry, getCostSource, updateCostSource } from "@/lib/api";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { CalendarIcon, Download, Upload, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [dates, setDates] = useState<string[]>([]);
  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
  const [addDateOpen, setAddDateOpen] = useState(false);

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
      setDimensionValues(response.cost_source.dimension_values);

      // Initialize dates and edited costs from the loaded data
      const loadedDates = response.cost_source.costs.map((row) => row.date);
      setDates(loadedDates);

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

  const handleAddDate = (date: Date | undefined) => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    if (dates.includes(dateStr)) {
      toast.error("Date already exists");
      return;
    }
    // Add date and sort
    const newDates = [...dates, dateStr].sort();
    setDates(newDates);
    // Initialize empty values for the new date
    const emptyValues: Record<string, number> = {};
    dimensionValues.forEach((v) => (emptyValues[v] = 0));
    setEditedCosts((prev) => ({ ...prev, [dateStr]: emptyValues }));
    setAddDateOpen(false);
    toast.success(`Added ${format(date, "MMM d, yyyy")}`);
  };

  const handleDownloadCSV = () => {
    if (!details) return;
    // Build CSV
    const headers = ["date", ...dimensionValues];
    const rows = dates.map((date) => {
      const values = dimensionValues.map((v) => editedCosts[date]?.[v] ?? 0);
      return [date, ...values].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "cost-source"}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const handleUploadCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split("\n");
        if (lines.length < 2) {
          throw new Error("CSV must have a header row and at least one data row");
        }

        const headers = lines[0].split(",").map((h) => h.trim());
        if (headers[0].toLowerCase() !== "date") {
          throw new Error("First column must be 'date'");
        }

        const csvDimensionValues = headers.slice(1);
        const newDates: string[] = [];
        const newCosts: Record<string, Record<string, number>> = {};

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          const date = values[0];
          newDates.push(date);
          newCosts[date] = {};
          for (let j = 1; j < values.length; j++) {
            newCosts[date][csvDimensionValues[j - 1]] = parseFloat(values[j]) || 0;
          }
        }

        // Merge new dimension values if any
        const allDimValues = Array.from(new Set([...dimensionValues, ...csvDimensionValues]));
        setDimensionValues(allDimValues);

        // Merge dates
        const allDates = Array.from(new Set([...dates, ...newDates])).sort();
        setDates(allDates);

        // Merge costs
        setEditedCosts((prev) => {
          const merged = { ...prev };
          Object.entries(newCosts).forEach(([date, values]) => {
            merged[date] = { ...(merged[date] || {}), ...values };
          });
          return merged;
        });

        toast.success(`Imported ${newDates.length} dates from CSV`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to parse CSV");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
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
      setDates([]);
      setDimensionValues([]);
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

            {/* Action buttons for CSV and adding dates */}
            <div className="flex items-center gap-2">
              <Popover open={addDateOpen} onOpenChange={setAddDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={handleAddDate}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                <Download className="h-4 w-4 mr-1" />
                Download CSV
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("edit-csv-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleUploadCSV}
                className="hidden"
                id="edit-csv-upload"
              />
            </div>

            <div className="flex-1 overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 sticky left-0 bg-muted/50">Date</th>
                    {dimensionValues.map((value) => (
                      <th key={value} className="text-right p-2 min-w-[100px]">
                        {value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dates.map((date) => (
                    <tr key={date} className="border-t">
                      <td className="p-2 sticky left-0 bg-background font-medium">
                        {format(new Date(date), "MMM d")}
                      </td>
                      {dimensionValues.map((value) => (
                        <td key={value} className="p-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-8 text-right"
                            value={editedCosts[date]?.[value] ?? 0}
                            onChange={(e) =>
                              handleCostChange(date, value, e.target.value)
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
