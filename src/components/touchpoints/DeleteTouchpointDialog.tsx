import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Touchpoint } from "@/pages/Touchpoints";

interface DeleteTouchpointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  touchpoint: Touchpoint;
  onSuccess: () => void;
}

export function DeleteTouchpointDialog({
  open,
  onOpenChange,
  touchpoint,
  onSuccess,
}: DeleteTouchpointDialogProps) {
  const handleDelete = async () => {
    const { error } = await supabase
      .from("touchpoints")
      .delete()
      .eq("id", touchpoint.id);

    if (error) {
      toast.error("Failed to delete touchpoint");
      console.error(error);
      return;
    }

    toast.success("Touchpoint deleted");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete touchpoint?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{touchpoint.name}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
