import { useState, useEffect } from "react";
import { format, differenceInDays, subDays, startOfDay } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export interface DateRangeValue {
  type: "preset" | "custom";
  days?: number;
  from?: Date;
  to?: Date;
  includeToday?: boolean;
}

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

const PRESETS = [
  { days: 0, label: "Today", includeToday: true },
  { days: 1, label: "Yesterday" },
  { days: 7, label: "Last 7 days", includeToday: true },
  { days: 14, label: "Last 14 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({
    from: value.from,
    to: value.to,
  });

  // Sync customRange when value changes externally
  useEffect(() => {
    if (value.from && value.to) {
      setCustomRange({ from: value.from, to: value.to });
    }
  }, [value.from, value.to]);

  const getDisplayLabel = () => {
    if (value.type === "preset") {
      const preset = PRESETS.find((p) => p.days === value.days && p.includeToday === value.includeToday);
      if (preset) return preset.label;
      if (value.days !== undefined) return `Last ${value.days} days`;
    }
    if (value.type === "custom" && value.from && value.to) {
      if (value.from.getTime() === value.to.getTime()) {
        return format(value.from, "MMM d, yyyy");
      }
      return `${format(value.from, "MMM d")} – ${format(value.to, "MMM d, yyyy")}`;
    }
    return "Select dates";
  };

  const handlePresetSelect = (days: number, includeToday?: boolean) => {
    onChange({ type: "preset", days, includeToday });
    setShowCustom(false);
    setOpen(false);
  };

  const handleCustomApply = () => {
    if (customRange.from && customRange.to) {
      const today = startOfDay(new Date());
      const toDate = startOfDay(customRange.to);
      const fromDate = startOfDay(customRange.from);
      
      // Calculate days from today to the start of the range
      // The API uses "last_full_days" which counts backwards from yesterday
      // So we need to calculate how many days ago the "from" date is
      const daysFromToday = differenceInDays(today, fromDate);
      const includeToday = toDate.getTime() === today.getTime();
      
      onChange({
        type: "custom",
        from: customRange.from,
        to: customRange.to,
        days: daysFromToday,
        includeToday,
      });
      setOpen(false);
      setShowCustom(false);
    }
  };

  const handleCustomRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      setCustomRange(range);
    }
  };

  const isPresetSelected = (preset: typeof PRESETS[0]) => {
    if (value.type !== "preset") return false;
    return value.days === preset.days && value.includeToday === preset.includeToday;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between text-left font-normal min-w-[180px]",
            !value && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {getDisplayLabel()}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background border border-border z-50" align="start">
        {!showCustom ? (
          <div className="p-2 space-y-1 min-w-[200px]">
            {PRESETS.map((preset) => (
              <button
                key={`${preset.days}-${preset.includeToday}`}
                onClick={() => handlePresetSelect(preset.days, preset.includeToday)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm rounded-none transition-colors",
                  "hover:bg-muted",
                  isPresetSelected(preset)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground"
                )}
              >
                {preset.label}
              </button>
            ))}
            <Separator className="my-2" />
            <button
              onClick={() => setShowCustom(true)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm rounded-none transition-colors hover:bg-muted",
                value.type === "custom" ? "bg-primary/10 text-primary font-medium" : "text-foreground"
              )}
            >
              Custom range...
            </button>
          </div>
        ) : (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowCustom(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
              <span className="text-sm font-medium">Custom Range</span>
            </div>
            <Calendar
              mode="range"
              selected={customRange as { from: Date; to: Date }}
              onSelect={handleCustomRangeSelect}
              numberOfMonths={2}
              disabled={(date) => date > new Date() || date < subDays(new Date(), 365)}
              className="pointer-events-auto"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {customRange.from && customRange.to ? (
                  <>
                    {format(customRange.from, "MMM d")} – {format(customRange.to, "MMM d, yyyy")}
                  </>
                ) : customRange.from ? (
                  <>
                    {format(customRange.from, "MMM d, yyyy")} → select end date
                  </>
                ) : (
                  "Select start and end dates"
                )}
              </div>
              <Button
                size="sm"
                onClick={handleCustomApply}
                disabled={!customRange.from || !customRange.to}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
