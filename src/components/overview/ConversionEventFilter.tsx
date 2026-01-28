import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target } from "lucide-react";

interface ConversionEventFilterProps {
  availableEvents: string[];
  selectedEvent: string | null;
  onEventChange: (event: string | null) => void;
  loading?: boolean;
}

export const ConversionEventFilter = ({
  availableEvents,
  selectedEvent,
  onEventChange,
  loading,
}: ConversionEventFilterProps) => {
  if (loading || availableEvents.length === 0) {
    return null;
  }

  const handleChange = (value: string) => {
    onEventChange(value === "all" ? null : value);
  };

  return (
    <Select
      value={selectedEvent ?? "all"}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[180px] h-9 bg-background border-border">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="All conversions" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-popover border-border z-50">
        <SelectItem value="all">All conversions</SelectItem>
        {availableEvents.map((event) => (
          <SelectItem key={event} value={event}>
            {event}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
