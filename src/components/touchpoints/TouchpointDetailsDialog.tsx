import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, FileText, Pencil, Trash2 } from "lucide-react";

export interface TouchpointDetails {
  id: string;
  name: string;
  event_type: string;
  timestamp: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  color: string | null;
}

interface TouchpointDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  touchpoint: TouchpointDetails | null;
  onEdit?: (touchpoint: TouchpointDetails) => void;
  onDelete?: (touchpoint: TouchpointDetails) => void;
}

export function TouchpointDetailsDialog({
  open,
  onOpenChange,
  touchpoint,
  onEdit,
  onDelete,
}: TouchpointDetailsDialogProps) {
  if (!touchpoint) return null;

  const formatDateTime = () => {
    if (touchpoint.event_type === "single" && touchpoint.timestamp) {
      const date = parseISO(touchpoint.timestamp);
      return format(date, "PPP 'at' h:mm a");
    }
    if (touchpoint.start_date && touchpoint.end_date) {
      return `${format(parseISO(touchpoint.start_date), "MMM d")} – ${format(parseISO(touchpoint.end_date), "MMM d, yyyy")}`;
    }
    if (touchpoint.start_date) {
      return format(parseISO(touchpoint.start_date), "PPP");
    }
    return "No date specified";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: touchpoint.color || "#8b5cf6" }}
            />
            <DialogTitle className="text-lg">{touchpoint.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Date/Time */}
          <div className="flex items-start gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground min-w-[80px]">
              {touchpoint.event_type === "single" ? (
                <Clock className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              <span>{touchpoint.event_type === "single" ? "Time" : "Period"}</span>
            </div>
            <span className="text-foreground">{formatDateTime()}</span>
          </div>

          {/* Notes */}
          {touchpoint.notes && (
            <div className="flex items-start gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground min-w-[80px]">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{touchpoint.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(touchpoint)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(touchpoint)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
