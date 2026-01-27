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
import { CostSource, deleteCostSource } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteCostSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costSource: CostSource | null;
  websiteId: string;
  onSuccess: () => void;
}

export function DeleteCostSourceDialog({
  open,
  onOpenChange,
  costSource,
  websiteId,
  onSuccess,
}: DeleteCostSourceDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!costSource) return;

    setDeleting(true);
    try {
      await deleteCostSource(costSource.id, websiteId);
      toast.success("Cost source deleted");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete cost source");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Cost Source</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{costSource?.name}"? This will remove
            all cost data associated with this source. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
