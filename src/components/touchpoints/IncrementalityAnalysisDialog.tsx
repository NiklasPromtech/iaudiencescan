import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, TrendingUp, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { IncrementalityResultsView, type IncrementalityResult } from "./IncrementalityResultsView";

interface TouchpointForAnalysis {
  id: string;
  name: string;
  event_type: string;
  timestamp: string | null;
  start_date: string | null;
  end_date: string | null;
  cost_amount?: number | null;
  cost_currency?: string | null;
}

interface IncrementalityAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  touchpoint: TouchpointForAnalysis | null;
}

const LOOK_WINDOW_OPTIONS = [
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "12h", label: "12 hours" },
  { value: "24h", label: "24 hours" },
  { value: "2d", label: "2 days" },
  { value: "5d", label: "5 days" },
  { value: "7d", label: "7 days" },
];

const BREAKDOWN_OPTIONS = [
  { value: "utm_source", label: "UTM Source" },
  { value: "utm_medium", label: "UTM Medium" },
  { value: "utm_campaign", label: "UTM Campaign" },
  { value: "utm_content", label: "UTM Content" },
  { value: "utm_term", label: "UTM Term" },
  { value: "country", label: "Country" },
  { value: "region", label: "Region" },
  { value: "city", label: "City" },
  { value: "referrer_domain", label: "Referrer Domain" },
];

export function IncrementalityAnalysisDialog({
  open,
  onOpenChange,
  touchpoint,
}: IncrementalityAnalysisDialogProps) {
  const { selectedWebsite } = useSelectedWebsite();
  
  // Configuration state
  const [baselineDays, setBaselineDays] = useState(21);
  const [lookWindow, setLookWindow] = useState("24h");
  const [breakdowns, setBreakdowns] = useState<string[]>([]);
  
  // Filter state
  const [includeUtmSource, setIncludeUtmSource] = useState("");
  const [includeUtmMedium, setIncludeUtmMedium] = useState("");
  const [includeCountries, setIncludeCountries] = useState("");
  const [excludeUtmSource, setExcludeUtmSource] = useState("");
  const [excludeBots, setExcludeBots] = useState(true);
  
  // Results state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IncrementalityResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  if (!touchpoint) return null;

  const toggleBreakdown = (value: string) => {
    setBreakdowns((prev) =>
      prev.includes(value)
        ? prev.filter((b) => b !== value)
        : [...prev, value]
    );
  };

  const parseCommaSeparated = (value: string): string[] => {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const handleAnalyze = async () => {
    if (!selectedWebsite?.tag_id) {
      toast.error("No website selected");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        toast.error("You must be logged in");
        setLoading(false);
        return;
      }

      // Build request payload
      const payload: Record<string, unknown> = {
        tag_id: selectedWebsite.tag_id,
        event_name: touchpoint.name,
        event_type: touchpoint.event_type,
        time: {
          timestamp: touchpoint.timestamp,
          start_date: touchpoint.start_date,
          end_date: touchpoint.end_date,
        },
        baseline_days: baselineDays,
        look_window: lookWindow,
      };

      // Add cost if present
      if (touchpoint.cost_amount && touchpoint.cost_amount > 0) {
        payload.cost = {
          amount: touchpoint.cost_amount,
          currency: touchpoint.cost_currency || "USD",
        };
      }

      // Build filters
      const filters: Record<string, Record<string, string[]>> = {
        include: {},
        exclude: {},
      };

      const incUtmSource = parseCommaSeparated(includeUtmSource);
      const incUtmMedium = parseCommaSeparated(includeUtmMedium);
      const incCountries = parseCommaSeparated(includeCountries);
      const excUtmSource = parseCommaSeparated(excludeUtmSource);

      if (incUtmSource.length) filters.include.utm_source = incUtmSource;
      if (incUtmMedium.length) filters.include.utm_medium = incUtmMedium;
      if (incCountries.length) filters.include.countries = incCountries;
      if (excUtmSource.length) filters.exclude.utm_source = excUtmSource;
      if (excludeBots) filters.exclude.bot_status = ["bot"];

      if (Object.keys(filters.include).length || Object.keys(filters.exclude).length) {
        payload.filters = filters;
      }

      // Add breakdowns
      if (breakdowns.length) {
        payload.breakdowns = breakdowns;
      }

      const response = await fetch("https://cdn.audiencescan.io/api/analytics/incrementality/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate report");
      }

      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Incrementality analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const handleClose = () => {
    setShowResults(false);
    setResults(null);
    onOpenChange(false);
  };

  // Show results view
  if (showResults && results) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Uplift Report: {touchpoint.name}
            </DialogTitle>
          </DialogHeader>
          <IncrementalityResultsView result={results} />
          <DialogFooter>
            <Button variant="outline" onClick={handleBack}>
              Back to Configuration
            </Button>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Configuration view
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Analyze: {touchpoint.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Baseline Days */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Baseline Period</Label>
              <span className="text-sm font-medium text-foreground">{baselineDays} days</span>
            </div>
            <Slider
              value={[baselineDays]}
              onValueChange={(v) => setBaselineDays(v[0])}
              min={7}
              max={90}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Days before the event to establish your "normal" traffic baseline
            </p>
          </div>

          {/* Look Window (only for single events) */}
          {touchpoint.event_type === "single" && (
            <div className="space-y-2">
              <Label>Measurement Window</Label>
              <Select value={lookWindow} onValueChange={setLookWindow}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOOK_WINDOW_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How long after the event to measure the impact
              </p>
            </div>
          )}

          {/* Breakdowns */}
          <div className="space-y-3">
            <Label>Breakdown By (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {BREAKDOWN_OPTIONS.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={breakdowns.includes(opt.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleBreakdown(opt.value)}
                >
                  {opt.label}
                  {breakdowns.includes(opt.value) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              See which sources/countries drove the most incremental traffic
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-sm font-medium">Filters (optional)</Label>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inc-utm-source" className="text-xs text-muted-foreground">
                  Include UTM Sources
                </Label>
                <Input
                  id="inc-utm-source"
                  placeholder="twitter, producthunt"
                  value={includeUtmSource}
                  onChange={(e) => setIncludeUtmSource(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inc-utm-medium" className="text-xs text-muted-foreground">
                  Include UTM Mediums
                </Label>
                <Input
                  id="inc-utm-medium"
                  placeholder="social, email"
                  value={includeUtmMedium}
                  onChange={(e) => setIncludeUtmMedium(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="inc-countries" className="text-xs text-muted-foreground">
                  Include Countries
                </Label>
                <Input
                  id="inc-countries"
                  placeholder="US, GB, DE"
                  value={includeCountries}
                  onChange={(e) => setIncludeCountries(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exc-utm-source" className="text-xs text-muted-foreground">
                  Exclude UTM Sources
                </Label>
                <Input
                  id="exc-utm-source"
                  placeholder="spam-referrer"
                  value={excludeUtmSource}
                  onChange={(e) => setExcludeUtmSource(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="exclude-bots"
                checked={excludeBots}
                onCheckedChange={(checked) => setExcludeBots(!!checked)}
              />
              <Label htmlFor="exclude-bots" className="text-sm font-normal cursor-pointer">
                Exclude bot traffic
              </Label>
            </div>
          </div>

          {/* Cost info */}
          {touchpoint.cost_amount && touchpoint.cost_amount > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <span className="text-muted-foreground">Marketing spend: </span>
              <span className="font-medium">
                {touchpoint.cost_currency || "USD"}{" "}
                {touchpoint.cost_amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                This will be used to calculate your incremental CPA
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Uplift Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
