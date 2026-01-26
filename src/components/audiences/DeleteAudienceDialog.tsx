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
import { Audience, deleteAudience } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface DeleteAudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience: Audience | null;
  onSuccess: () => void;
}

export function DeleteAudienceDialog({
  open,
  onOpenChange,
  audience,
  onSuccess,
}: DeleteAudienceDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!audience) return;

    setDeleting(true);
    try {
      await deleteAudience(audience.id);
      toast({
        title: "Audience deleted",
        description: `"${audience.name}" has been deleted.`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete audience:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete audience",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Audience?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{audience?.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
