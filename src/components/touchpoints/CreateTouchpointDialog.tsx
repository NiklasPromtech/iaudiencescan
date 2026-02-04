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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateTouchpointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId?: string;
  onSuccess: () => void;
  defaultDate?: Date;
}

const COLOR_OPTIONS = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
];

export function CreateTouchpointDialog({
  open,
  onOpenChange,
  websiteId,
  onSuccess,
  defaultDate,
}: CreateTouchpointDialogProps) {
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState<"single" | "range">("single");
  const [timestamp, setTimestamp] = useState<Date | undefined>(defaultDate);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [costAmount, setCostAmount] = useState<string>("");
  const [costCurrency, setCostCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !websiteId) {
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

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("You must be logged in");
      setSaving(false);
      return;
    }

    const parsedCost = costAmount ? parseFloat(costAmount) : null;

    const { error } = await supabase.from("touchpoints").insert({
      website_id: websiteId,
      user_id: userData.user.id,
      name: name.trim(),
      event_type: eventType,
      timestamp: eventType === "single" ? timestamp?.toISOString() : null,
      start_date: eventType === "range" ? format(startDate!, "yyyy-MM-dd") : null,
      end_date: eventType === "range" ? format(endDate!, "yyyy-MM-dd") : null,
      notes: notes.trim() || null,
      color,
      cost_amount: parsedCost,
      cost_currency: parsedCost ? costCurrency : null,
    });

    setSaving(false);

    if (error) {
      toast.error("Failed to create touchpoint");
      console.error(error);
      return;
    }

    toast.success("Touchpoint created");
    onOpenChange(false);
    resetForm();
    onSuccess();
  };

  const resetForm = () => {
    setName("");
    setEventType("single");
    setTimestamp(defaultDate);
    setStartDate(undefined);
    setEndDate(undefined);
    setNotes("");
    setColor(COLOR_OPTIONS[0]);
    setCostAmount("");
    setCostCurrency("USD");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Touchpoint</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Product Hunt Launch, CEO on Podcast"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              value={eventType}
              onValueChange={(v) => setEventType(v as "single" | "range")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="font-normal cursor-pointer">
                  Single event
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range" className="font-normal cursor-pointer">
                  Date range
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Selection */}
          {eventType === "single" ? (
            <div className="space-y-2">
              <Label>Date & Time</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
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
                      onSelect={(date) => {
                        if (date) {
                          // Preserve the time if already set
                          const hours = timestamp?.getHours() ?? 12;
                          const minutes = timestamp?.getMinutes() ?? 0;
                          date.setHours(hours, minutes, 0, 0);
                          setTimestamp(date);
                        } else {
                          setTimestamp(undefined);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  className="w-[120px]"
                  value={timestamp ? format(timestamp, "HH:mm") : ""}
                  onChange={(e) => {
                    if (e.target.value && timestamp) {
                      const [hours, minutes] = e.target.value.split(":").map(Number);
                      const newDate = new Date(timestamp);
                      newDate.setHours(hours, minutes, 0, 0);
                      setTimestamp(newDate);
                    } else if (e.target.value && !timestamp) {
                      // If no date selected, use today
                      const today = new Date();
                      const [hours, minutes] = e.target.value.split(":").map(Number);
                      today.setHours(hours, minutes, 0, 0);
                      setTimestamp(today);
                    }
                  }}
                  placeholder="HH:MM"
                />
              </div>
              <p className="text-xs text-muted-foreground">Time is optional</p>
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

          {/* Color */}
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
            <Label htmlFor="cost">Marketing Spend (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="cost"
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
            <p className="text-xs text-muted-foreground">
              Used to calculate cost per incremental visitor
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional context..."
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
            {saving ? "Saving..." : "Add Touchpoint"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
