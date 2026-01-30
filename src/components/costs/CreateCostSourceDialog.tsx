import { useState, useEffect, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Download, Upload, FileSpreadsheet } from "lucide-react";
import { format, subDays, eachDayOfInterval, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CostDimension, CostEntry, downloadCostTemplate, createCostSource } from "@/lib/api";
import { toast } from "sonner";

interface CreateCostSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
  onSuccess: () => void;
}

const DIMENSION_OPTIONS: { value: CostDimension; label: string }[] = [
  { value: "utm_source", label: "UTM Source" },
  { value: "utm_medium", label: "UTM Medium" },
  { value: "utm_campaign", label: "UTM Campaign" },
  { value: "utm_content", label: "UTM Content" },
  { value: "utm_term", label: "UTM Term" },
  { value: "referrer_domain", label: "Referrer Domain" },
];

export function CreateCostSourceDialog({
  open,
  onOpenChange,
  websiteId,
  onSuccess,
}: CreateCostSourceDialogProps) {
  const [name, setName] = useState("");
  const [dimension, setDimension] = useState<CostDimension | "">("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Quick-add table state
  const [loading, setLoading] = useState(false);
  const [dimensionValues, setDimensionValues] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [editedCosts, setEditedCosts] = useState<Record<string, Record<string, number>>>({});
  const [fillAllValues, setFillAllValues] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setName("");
    setDimension("");
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
    setDimensionValues([]);
    setDates([]);
    setEditedCosts({});
    setFillAllValues({});
    setLoading(false);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  // Fetch dimension values when dimension/dateRange changes
  const fetchDimensionValues = useCallback(async () => {
    if (!dimension || !websiteId) return;

    setLoading(true);
    try {
      const blob = await downloadCostTemplate(
        websiteId,
        dimension,
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd")
      );
      const text = await blob.text();
      const lines = text.trim().split("\n");
      
      if (lines.length >= 1) {
        // Parse headers to get dimension values
        const headers = lines[0].split(",").map((h) => h.trim());
        const dimValues = headers.slice(1); // Skip "date" column
        setDimensionValues(dimValues);

        // Generate date rows from the date range
        const dateInterval = eachDayOfInterval({
          start: dateRange.from,
          end: dateRange.to,
        });
        const dateStrings = dateInterval.map((d) => format(d, "yyyy-MM-dd"));
        setDates(dateStrings);

        // Initialize costs from the CSV if it has data
        const costs: Record<string, Record<string, number>> = {};
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim());
          const date = values[0];
          costs[date] = {};
          for (let j = 1; j < values.length; j++) {
            costs[date][dimValues[j - 1]] = parseFloat(values[j]) || 0;
          }
        }

        // Fill in any missing dates with zeros
        dateStrings.forEach((date) => {
          if (!costs[date]) {
            costs[date] = {};
            dimValues.forEach((v) => (costs[date][v] = 0));
          }
        });

        setEditedCosts(costs);
        setFillAllValues({});
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load dimension values");
      setDimensionValues([]);
    } finally {
      setLoading(false);
    }
  }, [dimension, dateRange, websiteId]);

  useEffect(() => {
    if (dimension && open) {
      fetchDimensionValues();
    }
  }, [dimension, dateRange, fetchDimensionValues, open]);

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

  const handleFillAllChange = (dimensionValue: string, value: string) => {
    setFillAllValues((prev) => ({
      ...prev,
      [dimensionValue]: value,
    }));
  };

  const handleApplyFillAll = (dimensionValue: string) => {
    const value = parseFloat(fillAllValues[dimensionValue]) || 0;
    setEditedCosts((prev) => {
      const updated = { ...prev };
      dates.forEach((date) => {
        if (!updated[date]) updated[date] = {};
        updated[date][dimensionValue] = value;
      });
      return updated;
    });
    toast.success(`Applied $${value} to all dates for ${dimensionValue}`);
  };

  const handleDownloadTemplate = async () => {
    if (!dimension) {
      toast.error("Please select a dimension first");
      return;
    }

    try {
      const blob = await downloadCostTemplate(
        websiteId,
        dimension,
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd")
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cost-template-${dimension}-${format(dateRange.from, "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Template downloaded! Fill in your costs and upload.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download template");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        // Merge dimension values
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

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (!dimension) {
      toast.error("Please select a dimension");
      return;
    }

    // Convert edited costs to array format
    const costs: CostEntry[] = [];
    Object.entries(editedCosts).forEach(([date, values]) => {
      Object.entries(values).forEach(([dimensionValue, cost]) => {
        if (cost > 0) {
          costs.push({ date, dimension_value: dimensionValue, cost });
        }
      });
    });

    if (costs.length === 0) {
      toast.error("Please add at least one cost entry");
      return;
    }

    setCreating(true);
    try {
      await createCostSource({
        tag_id: websiteId,
        name: name.trim(),
        dimension,
        costs,
      });

      toast.success("Cost source created successfully");
      handleClose(false);
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create cost source");
    } finally {
      setCreating(false);
    }
  };

  const totalCost = Object.values(editedCosts).reduce(
    (sum, values) => sum + Object.values(values).reduce((s, v) => s + v, 0),
    0
  );

  const hasDimensionData = dimensionValues.length > 0 && dates.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Cost Source</DialogTitle>
          <DialogDescription>
            Configure your cost data source. Select a dimension to see available values and enter costs.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Config row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., January 2026 Spend"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Dimension</Label>
              <Select value={dimension} onValueChange={(v) => setDimension(v as CostDimension)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dimension..." />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, from: date }))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">to</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.to, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange((prev) => ({ ...prev, to: date }))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* CSV buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("csv-upload-create")?.click()}
              disabled={!dimension}
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload CSV
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload-create"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              disabled={!dimension}
            >
              <Download className="h-4 w-4 mr-1" />
              Download Template
            </Button>
            {hasDimensionData && (
              <div className="ml-auto text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">${totalCost.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Quick Add Table */}
          {!dimension ? (
            <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-lg">
              <div className="text-center p-8">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Select a dimension above to see available values and enter costs
                </p>
              </div>
            </div>
          ) : loading ? (
            <div className="flex-1 border rounded-md p-4 space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : dimensionValues.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-lg">
              <div className="text-center p-8">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No {DIMENSION_OPTIONS.find(o => o.value === dimension)?.label || dimension} values found in your traffic for this date range.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Try a different date range or upload a CSV with your values.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left p-2 sticky left-0 bg-muted/50 z-20 min-w-[100px]">Date</th>
                    {dimensionValues.map((value) => (
                      <th key={value} className="text-right p-2 min-w-[120px]">
                        {value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Fill all row */}
                  <tr className="border-t bg-muted/30">
                    <td className="p-2 sticky left-0 bg-muted/30 z-10 text-xs text-muted-foreground font-medium">
                      Fill all dates →
                    </td>
                    {dimensionValues.map((value) => (
                      <td key={value} className="p-1">
                        <div className="flex gap-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            className="h-7 text-right text-xs flex-1"
                            value={fillAllValues[value] || ""}
                            onChange={(e) => handleFillAllChange(value, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleApplyFillAll(value);
                              }
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleApplyFillAll(value)}
                            disabled={!fillAllValues[value]}
                          >
                            Apply
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Date rows */}
                  {dates.map((date) => (
                    <tr key={date} className="border-t">
                      <td className="p-2 sticky left-0 bg-background z-10 font-medium">
                        {format(parseISO(date), "MMM d")}
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
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={creating || !name.trim() || !dimension || totalCost === 0}
          >
            {creating ? "Creating..." : "Create Cost Source"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
