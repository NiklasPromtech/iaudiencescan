import { useState } from "react";
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
import { CalendarIcon, Download, Upload, FileSpreadsheet } from "lucide-react";
import { format, subDays } from "date-fns";
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

type Step = "config" | "upload" | "review";

export function CreateCostSourceDialog({
  open,
  onOpenChange,
  websiteId,
  onSuccess,
}: CreateCostSourceDialogProps) {
  const [step, setStep] = useState<Step>("config");
  const [name, setName] = useState("");
  const [dimension, setDimension] = useState<CostDimension>("utm_source");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [parsedCosts, setParsedCosts] = useState<CostEntry[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [creating, setCreating] = useState(false);

  const resetForm = () => {
    setStep("config");
    setName("");
    setDimension("utm_source");
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
    setParsedCosts([]);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const handleDownloadTemplate = async () => {
    setDownloading(true);
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
      setStep("upload");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download template");
    } finally {
      setDownloading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const costs = parseCSV(text);
        setParsedCosts(costs);
        setStep("review");
        toast.success(`Parsed ${costs.length} cost entries`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to parse CSV");
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): CostEntry[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV must have a header row and at least one data row");
    }

    const headers = lines[0].split(",").map((h) => h.trim());
    if (headers[0].toLowerCase() !== "date") {
      throw new Error("First column must be 'date'");
    }

    const dimensionValues = headers.slice(1);
    const costs: CostEntry[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const date = values[0];

      for (let j = 1; j < values.length; j++) {
        const costValue = parseFloat(values[j]) || 0;
        if (costValue > 0) {
          costs.push({
            date,
            dimension_value: dimensionValues[j - 1],
            cost: costValue,
          });
        }
      }
    }

    return costs;
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (parsedCosts.length === 0) {
      toast.error("No cost entries to save");
      return;
    }

    setCreating(true);
    try {
      await createCostSource({
        tag_id: websiteId,
        name: name.trim(),
        dimension,
        costs: parsedCosts,
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

  const totalCost = parsedCosts.reduce((sum, c) => sum + c.cost, 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Cost Source</DialogTitle>
          <DialogDescription>
            {step === "config" && "Configure your cost data source and download a template."}
            {step === "upload" && "Upload your filled-in CSV with cost data."}
            {step === "review" && "Review your cost data before saving."}
          </DialogDescription>
        </DialogHeader>

        {step === "config" && (
          <div className="space-y-4">
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Costs will be matched to traffic by this dimension.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
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
                <span className="self-center text-muted-foreground">to</span>
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
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload your CSV file with filled-in costs
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Select CSV File
                  </span>
                </Button>
              </label>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep("config")}
            >
              ← Back to configuration
            </Button>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-semibold">{parsedCosts.length}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-semibold">
                  ${totalCost.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="max-h-48 overflow-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Value</th>
                    <th className="text-right p-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedCosts.slice(0, 20).map((cost, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{cost.date}</td>
                      <td className="p-2">{cost.dimension_value}</td>
                      <td className="p-2 text-right">${cost.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                  {parsedCosts.length > 20 && (
                    <tr className="border-t">
                      <td colSpan={3} className="p-2 text-center text-muted-foreground">
                        ... and {parsedCosts.length - 20} more entries
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep("upload")}
            >
              ← Back to upload
            </Button>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {step === "config" && (
            <>
              <Button
                variant="outline"
                disabled={!name.trim()}
                onClick={() => document.getElementById("csv-upload-direct")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const text = ev.target?.result as string;
                        const costs = parseCSV(text);
                        setParsedCosts(costs);
                        setStep("review");
                        toast.success(`Parsed ${costs.length} cost entries`);
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Failed to parse CSV");
                      }
                    };
                    reader.readAsText(file);
                  }
                  e.target.value = "";
                }}
                className="hidden"
                id="csv-upload-direct"
              />
              <Button onClick={handleDownloadTemplate} disabled={downloading || !name.trim()}>
                <Download className="h-4 w-4 mr-2" />
                {downloading ? "Downloading..." : "Download Template"}
              </Button>
            </>
          )}
          {step === "review" && (
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Saving..." : "Create Cost Source"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
