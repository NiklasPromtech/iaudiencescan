import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from "date-fns";
import type { TouchpointForChart } from "@/components/overview/TouchpointMarkers";

interface TouchpointListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  touchpoints: TouchpointForChart[];
  dateKey: string;
  onSelect: (touchpoint: TouchpointForChart) => void;
}

export function TouchpointListDialog({
  open,
  onOpenChange,
  touchpoints,
  dateKey,
  onSelect,
}: TouchpointListDialogProps) {
  const formattedDate = dateKey
    ? format(parseISO(dateKey), "EEEE, MMMM d, yyyy")
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">
            Touchpoints on {formattedDate}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1 py-2">
          {touchpoints.map((tp) => (
            <button
              key={tp.id}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              onClick={() => {
                onSelect(tp);
                onOpenChange(false);
              }}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: tp.color || "#8b5cf6" }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{tp.name}</p>
                {tp.notes && (
                  <p className="text-xs text-muted-foreground truncate">
                    {tp.notes}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
