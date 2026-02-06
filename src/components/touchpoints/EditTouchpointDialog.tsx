import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Touchpoint } from "@/hooks/use-dashboard-queries";

interface EditTouchpointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  touchpoint: Touchpoint;
  onSuccess: () => void;
}

const COLOR_OPTIONS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export function EditTouchpointDialog({
  open,
  onOpenChange,
  touchpoint,
  onSuccess,
}: EditTouchpointDialogProps) {
  const [name, setName] = useState(touchpoint.name);
  const [eventType, setEventType] = useState<"single" | "range">(touchpoint.event_type);
  const [timestamp, setTimestamp] = useState<Date | undefined>(
    touchpoint.timestamp ? parseISO(touchpoint.timestamp) : undefined
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    touchpoint.start_date ? parseISO(touchpoint.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    touchpoint.end_date ? parseISO(touchpoint.end_date) : undefined
  );
  const [notes, setNotes] = useState(touchpoint.notes || "");
  const [color, setColor] = useState(touchpoint.color);
  const [costAmount, setCostAmount] = useState<string>(
    touchpoint.cost_amount?.toString() || ""
  );
  const [costCurrency, setCostCurrency] = useState(touchpoint.cost_currency || "USD");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(touchpoint.name);
    setEventType(touchpoint.event_type);
    setTimestamp(touchpoint.timestamp ? parseISO(touchpoint.timestamp) : undefined);
    setStartDate(touchpoint.start_date ? parseISO(touchpoint.start_date) : undefined);
    setEndDate(touchpoint.end_date ? parseISO(touchpoint.end_date) : undefined);
    setNotes(touchpoint.notes || "");
    setColor(touchpoint.color);
    setCostAmount(touchpoint.cost_amount?.toString() || "");
    setCostCurrency(touchpoint.cost_currency || "USD");
  }, [touchpoint]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for the touchpoint");
      return;
    }

    if (eventType === "single" && !timestamp) {
      toast.error("Please select a date and time");
      return;
    }

    if (eventType === "range" && (!startDate || !endDate)) {
      toast.error("Please select a start and end date");
      return;
    }

    setSaving(true);

    const parsedCost = costAmount ? parseFloat(costAmount) : null;

    const { error } = await supabase
      .from("touchpoints")
      .update({
        name: name.trim(),
        event_type: eventType,
        timestamp: eventType === "single" ? timestamp?.toISOString() : null,
        start_date: eventType === "range" ? format(startDate!, "yyyy-MM-dd") : null,
        end_date: eventType === "range" ? format(endDate!, "yyyy-MM-dd") : null,
        notes: notes.trim() || null,
        color,
        cost_amount: parsedCost,
        cost_currency: parsedCost ? costCurrency : null,
      })
      .eq("id", touchpoint.id);

    setSaving(false);

    if (error) {
      toast.error("Failed to update touchpoint");
      console.error(error);
      return;
    }

    toast.success("Touchpoint updated");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Touchpoint</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              value={eventType}
              onValueChange={(v) => setEventType(v as "single" | "range")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="edit-single" />
                <Label htmlFor="edit-single" className="font-normal cursor-pointer">
                  Single event
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="edit-range" />
                <Label htmlFor="edit-range" className="font-normal cursor-pointer">
                  Date range
                </Label>
              </div>
            </RadioGroup>
          </div>

          {eventType === "single" ? (
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !timestamp && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {timestamp ? format(timestamp, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={timestamp}
                    onSelect={setTimestamp}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM d") : "Start"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM d") : "End"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    "w-7 h-7 rounded-full transition-all",
                    color === c && "ring-2 ring-offset-2 ring-primary"
                  )}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="edit-cost">Marketing Spend (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="edit-cost"
                type="number"
                placeholder="0.00"
                value={costAmount}
                onChange={(e) => setCostAmount(e.target.value)}
                className="flex-1"
                min="0"
                step="0.01"
              />
              <select
                value={costCurrency}
                onChange={(e) => setCostCurrency(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes (optional)</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
