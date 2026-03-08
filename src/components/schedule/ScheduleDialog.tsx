import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useScheduledReports, ScheduledReport } from "@/hooks/use-scheduled-reports";
import {
  Loader2,
  Plus,
  X,
  Send,
  Trash2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Common timezones ─────────────────────────────────────────────────────────
const TIMEZONES = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Dubai",
  "Australia/Sydney",
];

// ── Frequency presets ────────────────────────────────────────────────────────
type Frequency = "daily" | "weekly" | "custom";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCron(freq: Frequency, hour: number, minute: number, dayOfWeek: number): string {
  if (freq === "daily") return `${minute} ${hour} * * *`;
  if (freq === "weekly") return `${minute} ${hour} * * ${dayOfWeek}`;
  return `${minute} ${hour} * * *`; // default for custom
}

function parseCron(cron: string): { freq: Frequency; hour: number; minute: number; dayOfWeek: number } {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return { freq: "daily", hour: 7, minute: 0, dayOfWeek: 1 };
  const minute = parseInt(parts[0], 10) || 0;
  const hour = parseInt(parts[1], 10) || 7;
  const dow = parts[4];
  if (dow === "*") return { freq: "daily", hour, minute, dayOfWeek: 1 };
  return { freq: "weekly", hour, minute, dayOfWeek: parseInt(dow, 10) || 1 };
}

function getBrowserTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONES.includes(tz) ? tz : "UTC";
  } catch {
    return "UTC";
  }
}

// ── Props ────────────────────────────────────────────────────────────────────
interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryId: string;
  queryName: string;
  websiteId: string;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  queryId,
  queryName,
  websiteId,
}: ScheduleDialogProps) {
  const { toast } = useToast();
  const {
    loading: hookLoading,
    fetchForQuery,
    createReport,
    updateReport,
    deleteReport,
    testReport,
  } = useScheduledReports();

  // State
  const [existing, setExisting] = useState<ScheduledReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [timezone, setTimezone] = useState(getBrowserTimezone());
  const [customCron, setCustomCron] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [endsAt, setEndsAt] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Load existing schedule on open
  const loadExisting = useCallback(async () => {
    setLoadingReport(true);
    try {
      const report = await fetchForQuery(queryId);
      setExisting(report);
      if (report) {
        setRecipients(report.recipients);
        const parsed = parseCron(report.cron_expression);
        setFrequency(parsed.freq);
        setHour(parsed.hour);
        setMinute(parsed.minute);
        setDayOfWeek(parsed.dayOfWeek);
        setTimezone(report.timezone);
        setEnabled(report.enabled);
        setEndsAt(report.ends_at ? report.ends_at.slice(0, 10) : "");
        if (parsed.freq === "custom") setCustomCron(report.cron_expression);
      } else {
        setRecipients([]);
        setEmailInput("");
        setFrequency("weekly");
        setHour(7);
        setMinute(0);
        setDayOfWeek(1);
        setTimezone(getBrowserTimezone());
        setEnabled(true);
        setEndsAt("");
        setCustomCron("");
      }
    } catch (err) {
      console.error("Failed to load schedule:", err);
    } finally {
      setLoadingReport(false);
    }
  }, [fetchForQuery, queryId]);

  useEffect(() => {
    if (open) loadExisting();
  }, [open, loadExisting]);

  // Add email
  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ description: "Enter a valid email address", variant: "destructive" });
      return;
    }
    if (recipients.includes(email)) {
      toast({ description: "Email already added" });
      return;
    }
    setRecipients((prev) => [...prev, email]);
    setEmailInput("");
  };

  const removeEmail = (email: string) => {
    setRecipients((prev) => prev.filter((e) => e !== email));
  };

  // Save
  const handleSave = async () => {
    if (recipients.length === 0) {
      toast({ description: "Add at least one recipient", variant: "destructive" });
      return;
    }

    const cron =
      frequency === "custom" ? customCron : buildCron(frequency, hour, minute, dayOfWeek);

    setIsSaving(true);
    try {
      if (existing) {
        await updateReport(existing.id, {
          recipients,
          cron_expression: cron,
          timezone,
          enabled,
          ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        });
        toast({ description: "Schedule updated" });
      } else {
        const report = await createReport({
          queryId,
          websiteId,
          recipients,
          cronExpression: cron,
          timezone,
          endsAt: endsAt ? new Date(endsAt).toISOString() : null,
        });
        setExisting(report);
        toast({ description: "Schedule created" });
      }
    } catch (err) {
      toast({
        title: "Couldn't save schedule",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Test
  const handleTest = async () => {
    if (!existing) {
      toast({ description: "Save the schedule first, then test it.", variant: "destructive" });
      return;
    }
    setIsTesting(true);
    try {
      await testReport(existing.id);
      toast({
        description: `Test email sent to ${recipients.join(", ")}`,
      });
    } catch (err) {
      toast({
        title: "Test failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!existing) return;
    setIsDeleting(true);
    try {
      await deleteReport(existing.id);
      setExisting(null);
      toast({ description: "Schedule deleted" });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Couldn't delete schedule",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-sm">
            <Clock className="h-4 w-4" />
            Schedule Report
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-muted-foreground">
            Send "{queryName}" results + AI insights on a schedule.
          </DialogDescription>
        </DialogHeader>

        {loadingReport ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Recipients */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Recipients
              </label>
              <div className="flex gap-2">
                <Input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEmail();
                    }
                  }}
                  placeholder="email@example.com"
                  className="flex-1 font-mono text-xs h-8"
                  autoComplete="off"
                />
                <Button
                  onClick={addEmail}
                  variant="outline"
                  className="h-8 px-2 shrink-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {recipients.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted border border-border font-mono text-[10px] text-foreground"
                    >
                      {email}
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Frequency
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(["daily", "weekly", "custom"] as Frequency[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "font-mono text-[10px] py-1.5 border border-border transition-colors capitalize",
                      frequency === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Day of week (weekly) */}
              {frequency === "weekly" && (
                <div className="flex gap-1">
                  {DAYS_OF_WEEK.map((day, i) => (
                    <button
                      key={day}
                      onClick={() => setDayOfWeek(i)}
                      className={cn(
                        "flex-1 font-mono text-[9px] py-1 border border-border transition-colors",
                        dayOfWeek === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                      )}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              {/* Time picker */}
              {frequency !== "custom" && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">at</span>
                  <select
                    value={hour}
                    onChange={(e) => setHour(Number(e.target.value))}
                    className="font-mono text-xs bg-background border border-border px-2 py-1 h-8"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <span className="font-mono text-xs text-muted-foreground">:</span>
                  <select
                    value={minute}
                    onChange={(e) => setMinute(Number(e.target.value))}
                    className="font-mono text-xs bg-background border border-border px-2 py-1 h-8"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom cron */}
              {frequency === "custom" && (
                <Input
                  value={customCron}
                  onChange={(e) => setCustomCron(e.target.value)}
                  placeholder="0 7 * * 1 (min hour dom mon dow)"
                  className="font-mono text-xs h-8"
                />
              )}
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full font-mono text-xs bg-background border border-border px-3 py-1.5 h-8"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Expires */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Run until <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <Input
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="font-mono text-xs h-8"
              />
            </div>

            {/* Enabled toggle (only when editing) */}
            {existing && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Enabled
                </span>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              {existing && (
                <Button
                  onClick={handleTest}
                  disabled={isTesting || hookLoading}
                  variant="outline"
                  className="h-8 gap-1.5 font-mono text-[10px] uppercase tracking-widest"
                >
                  {isTesting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                  Test Now
                </Button>
              )}

              <div className="flex-1" />

              {existing && (
                confirmDelete ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="font-mono text-[10px] text-destructive hover:text-destructive/80 font-semibold"
                    >
                      {isDeleting ? "..." : "Yes, delete"}
                    </button>
                    <span className="text-muted-foreground/40 font-mono text-[10px]">/</span>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="font-mono text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                    title="Delete schedule"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )
              )}

              <Button
                onClick={handleSave}
                disabled={isSaving || hookLoading || recipients.length === 0}
                className="h-8 gap-1.5 font-mono text-[10px] uppercase tracking-widest"
              >
                {isSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {existing ? "Update" : "Save Schedule"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
