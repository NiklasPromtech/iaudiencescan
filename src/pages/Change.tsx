import { useState, useMemo, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  TrendingUp,
  CalendarIcon,
  Loader2,
  Sparkles,
  ArrowRight,
  Trophy,
  Copy,
  Download,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, addDays, differenceInDays, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { NoWebsiteState } from "@/components/dashboard/NoWebsiteState";
import { fetchTrackingStatus, type TrackingStatusResponse } from "@/lib/api";
import { ReportV2ResultsView, type ReportV2ResultsViewHandle } from "@/components/change/ReportV2ResultsView";
import { TimelineRangeChart } from "@/components/overview/TimelineRangeChart";
import type { ReportV2Response } from "@/types/report-v2";

const REPORT_V2_URL = "https://api.audiencescan.xyz/analytics/report/v2";

const Change = () => {
  const { selectedWebsite, loading: websiteLoading } = useSelectedWebsite();

  // Advanced mode state
  const [eventDate, setEventDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [eventName, setEventName] = useState("");
  const [baselineStrategy, setBaselineStrategy] = useState<string>("rolling_14_day_preceding");
  const [excludeBots, setExcludeBots] = useState(true);

  // Results state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ReportV2Response | null>(null);
  const resultsRef = useRef<ReportV2ResultsViewHandle>(null);

  // Basic view state
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatusResponse | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [basicRange, setBasicRange] = useState<[number, number] | null>(null);
  const [basicExcludeBots, setBasicExcludeBots] = useState(true);

  // Fetch tracking status for basic mode
  useEffect(() => {
    if (selectedWebsite?.tag_id) {
      setLoadingTracking(true);
      fetchTrackingStatus(selectedWebsite.tag_id)
        .then((data) => {
          setTrackingStatus(data);
          const breakdownLen = data.daily_breakdown?.length ?? 0;
          if (breakdownLen > 1) {
            const minStart = Math.min(7, breakdownLen - 1);
            setBasicRange([minStart, breakdownLen - 1]);
          } else {
            const first = parseISO(data.first_tracked_at);
            const last = parseISO(data.last_tracked_at);
            const maxOffset = differenceInDays(last, first);
            const minStart = Math.min(7, maxOffset);
            setBasicRange([minStart, maxOffset]);
          }
        })
        .catch((err) => console.error("Failed to fetch tracking status:", err))
        .finally(() => setLoadingTracking(false));
    }
  }, [selectedWebsite?.tag_id]);

  // Basic mode computed values
  const basicFirstDate = trackingStatus ? parseISO(trackingStatus.first_tracked_at) : null;
  const basicLastDate = trackingStatus ? parseISO(trackingStatus.last_tracked_at) : null;
  const basicMaxOffset = trackingStatus?.daily_breakdown?.length
    ? trackingStatus.daily_breakdown.length - 1
    : basicFirstDate && basicLastDate ? differenceInDays(basicLastDate, basicFirstDate) : 0;

  const basicStartDate = useMemo(() => {
    if (!basicRange) return null;
    if (trackingStatus?.daily_breakdown?.[basicRange[0]]) {
      return parseISO(trackingStatus.daily_breakdown[basicRange[0]].date);
    }
    return basicFirstDate ? addDays(basicFirstDate, basicRange[0]) : null;
  }, [basicRange, trackingStatus, basicFirstDate]);

  const basicEndDate = useMemo(() => {
    if (!basicRange) return null;
    if (trackingStatus?.daily_breakdown?.[basicRange[1]]) {
      return parseISO(trackingStatus.daily_breakdown[basicRange[1]].date);
    }
    return basicFirstDate ? addDays(basicFirstDate, basicRange[1]) : null;
  }, [basicRange, trackingStatus, basicFirstDate]);

  const callV2Api = async (eventStart: string, eventEnd: string, excludeBotsFlag: boolean, strategy?: string) => {
    if (!selectedWebsite?.id) {
      toast.error("No website selected");
      return;
    }
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) { toast.error("You must be logged in"); setLoading(false); return; }

      const payload: Record<string, unknown> = {
        website_id: selectedWebsite.id,
        event_start: eventStart,
        event_end: eventEnd,
        exclude_bots: excludeBotsFlag,
      };
      if (strategy) payload.baseline_strategy = strategy;

      const response = await fetch(REPORT_V2_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(await response.text() || "Failed to generate report");
      const data: ReportV2Response = await response.json();
      if (!data.success) throw new Error(data.errors?.join(", ") || "Report generation failed");
      setResults(data);
    } catch (error) {
      console.error("Report v2 error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleBasicAnalyze = () => {
    if (!basicStartDate || !basicEndDate) {
      toast.error("No date range selected");
      return;
    }
    callV2Api(format(basicStartDate, "yyyy-MM-dd"), format(basicEndDate, "yyyy-MM-dd"), basicExcludeBots);
  };

  const handleAdvancedAnalyze = () => {
    const start = format(eventDate, "yyyy-MM-dd");
    const end = endDate ? format(endDate, "yyyy-MM-dd") : start;
    callV2Api(start, end, excludeBots, baselineStrategy);
  };

  const [viewMode, setViewMode] = useState<"basic" | "advanced">("basic");

  if (!websiteLoading && !selectedWebsite) {
    return (
      <DashboardLayout>
        <NoWebsiteState />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8 px-4">
        {/* Header - hidden when results are showing */}
        {!results && (
          <div className="mb-8">
            <Badge variant="outline" className="border-primary/30 text-primary mb-3">
              <Sparkles className="h-3 w-3 mr-1.5" />
              Insights
            </Badge>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-semibold text-foreground">
                Measure Change
              </h1>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === "basic" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setViewMode("basic")}
                >
                  Basic
                </Button>
                <Button
                  variant={viewMode === "advanced" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setViewMode("advanced")}
                >
                  Advanced
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Quantify the impact of any date or period. Compare performance against a baseline
              to discover what actually moved the needle.
            </p>
          </div>
        )}

        {/* Results View */}
        {results ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-5 py-3.5 shadow-sm">
              <h2 className="text-lg font-semibold flex items-center gap-2.5 text-foreground">
                <Trophy className="h-5 w-5 text-primary" />
                Analysis Results
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => resultsRef.current?.handleCopyReport()}>
                  <Copy className="h-3.5 w-3.5" /> Copy Text
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => resultsRef.current?.handleExportPDF()}>
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setResults(null)}>
                  <RotateCcw className="h-3.5 w-3.5" /> New Analysis
                </Button>
              </div>
            </div>
            <ReportV2ResultsView ref={resultsRef} result={results} hideActions />
          </div>
        ) : (
          <div className="space-y-6">
            {/* ===== BASIC MODE ===== */}
            {viewMode === "basic" && (
              <Card className="p-6 border-border/50">
                {loadingTracking ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : !trackingStatus ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    Unable to load tracking data. Make sure your website is set up and tracking.
                  </p>
                ) : basicRange && basicFirstDate && basicLastDate ? (
                  <div className="space-y-6">
                    {trackingStatus?.daily_breakdown && trackingStatus.daily_breakdown.length > 1 ? (
                      <TimelineRangeChart
                        dailyBreakdown={trackingStatus.daily_breakdown}
                        range={basicRange}
                        onRangeChange={(val) => setBasicRange(val)}
                        maxOffset={trackingStatus.daily_breakdown.length - 1}
                        firstDate={basicFirstDate!}
                      />
                    ) : (
                      <>
                        <div>
                          <h3 className="text-sm font-medium text-foreground mb-1">Select Date Range</h3>
                          <p className="text-xs text-muted-foreground">
                            Drag the handles to choose the period you want to analyze.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{format(basicFirstDate!, "MMM d, yyyy")}</span>
                            <span>{format(basicLastDate!, "MMM d, yyyy")}</span>
                          </div>
                          <Slider
                            value={basicRange}
                            onValueChange={(val) => setBasicRange(val as [number, number])}
                            min={0}
                            max={basicMaxOffset}
                            step={1}
                            minStepsBetweenThumbs={1}
                          />
                          <div className="flex justify-center gap-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">Start: </span>
                              <span className="font-medium text-foreground">
                                {basicStartDate ? format(basicStartDate, "MMM d, yyyy") : "—"}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">End: </span>
                              <span className="font-medium text-foreground">
                                {basicEndDate ? format(basicEndDate, "MMM d, yyyy") : "—"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={basicExcludeBots}
                        onCheckedChange={(checked) => setBasicExcludeBots(!!checked)}
                      />
                      <span className="text-sm">Exclude bot traffic</span>
                    </label>

                    <Button size="lg" className="w-full" onClick={handleBasicAnalyze} disabled={loading}>
                      {loading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                      ) : (
                        <>Get Insights <ArrowRight className="h-4 w-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                ) : null}
              </Card>
            )}

            {/* ===== ADVANCED MODE ===== */}
            {viewMode === "advanced" && (
              <>
                <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-foreground mb-1">What changed?</h2>
                      <p className="text-sm text-muted-foreground">
                        Pick a date or date range to analyze. We'll compare it against the baseline period.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Analysis Name */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Analysis Name (optional)</Label>
                      <Input
                        placeholder="e.g., Product launch, Campaign start..."
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                      />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={eventDate}
                            onSelect={(date) => date && setEventDate(date)}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">End Date (optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Single day analysis"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => date > new Date() || date < eventDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {endDate && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground" onClick={() => setEndDate(undefined)}>
                          Clear end date
                        </Button>
                      )}
                    </div>

                    {/* Baseline Strategy */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Baseline Strategy</Label>
                      <Select value={baselineStrategy} onValueChange={setBaselineStrategy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rolling_14_day_preceding">Rolling 14-day preceding</SelectItem>
                          <SelectItem value="immediate_previous_same_length">Same length preceding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Exclude bots */}
                  <div className="mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={excludeBots} onCheckedChange={(checked) => setExcludeBots(!!checked)} />
                      <span className="text-sm">Exclude bot traffic</span>
                    </label>
                  </div>
                </Card>

                {/* Action Button */}
                <Button size="lg" className="w-full" onClick={handleAdvancedAnalyze} disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    <>Generate Report <ArrowRight className="h-4 w-4 ml-2" /></>
                  )}
                </Button>

                {/* Educational Callout */}
                <Card className="p-5 bg-muted/30 border-muted">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Why Measure Change?</h4>
                      <p className="text-sm text-muted-foreground">
                        This report compares your event period against a baseline to surface real impact —
                        KPI shifts, wallet quality changes, behavior differences, and statistical anomalies.
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Change;
