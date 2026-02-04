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
import { useToast } from "@/hooks/use-toast";
import { TokenContract } from "@/pages/Contracts";
import { useState } from "react";

interface DeleteContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: TokenContract;
  onSuccess: () => void;
}

export const DeleteContractDialog = ({
  open,
  onOpenChange,
  contract,
  onSuccess,
}: DeleteContractDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("website_tag_contracts")
        .delete()
        .eq("id", contract.id);

      if (error) throw error;

      toast({
        title: "Contract Deleted",
        description: "Token contract has been removed",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete contract:", error);
      toast({
        title: "Error",
        description: "Failed to delete token contract",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Token Contract</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{contract.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
