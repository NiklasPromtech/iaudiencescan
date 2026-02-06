import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, FileCode2, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CreateContractDialog } from "@/components/contracts/CreateContractDialog";
import { EditContractDialog } from "@/components/contracts/EditContractDialog";
import { DeleteContractDialog } from "@/components/contracts/DeleteContractDialog";

export interface TokenContract {
  id: string;
  website_id: string;
  name: string;
  contract_address: string;
  chain: string;
  chain_id: string | null;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

const Contracts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<TokenContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<TokenContract | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedWebsite");
    if (stored) {
      const website = JSON.parse(stored);
      setSelectedWebsiteId(website.id);
    }
  }, []);

  useEffect(() => {
    if (selectedWebsiteId) {
      fetchContracts();
    }
  }, [selectedWebsiteId]);

  const fetchContracts = async () => {
    if (!selectedWebsiteId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("website_tag_contracts")
        .select("*")
        .eq("website_id", selectedWebsiteId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      toast({
        title: "Error",
        description: "Failed to load token contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contract: TokenContract) => {
    setSelectedContract(contract);
    setEditDialogOpen(true);
  };

  const handleDelete = (contract: TokenContract) => {
    setSelectedContract(contract);
    setDeleteDialogOpen(true);
  };

  if (!selectedWebsiteId) {
    return (
      <DashboardLayout>
        <div className="p-6 flex flex-col items-center justify-center h-[60vh] text-center">
          <FileCode2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Website Selected</h2>
          <p className="text-muted-foreground mb-4">
            Please select a website from the dropdown to manage token contracts.
          </p>
          <Button onClick={() => navigate("/install")}>Go to Install</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Token Contracts</h1>
            <p className="text-muted-foreground">
              Track on-chain activity from specific token contracts
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Contract
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-lg">
            <FileCode2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No token contracts added yet</p>
            <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Contract
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contract Address</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {contract.contract_address.slice(0, 10)}...{contract.contract_address.slice(-8)}
                      </code>
                    </TableCell>
                    <TableCell className="capitalize">{contract.chain}</TableCell>
                    <TableCell>
                      {contract.start_date 
                        ? format(new Date(contract.start_date), "MMM d, yyyy")
                        : "-"
                      }
                    </TableCell>
                    <TableCell>
                      {format(new Date(contract.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(contract)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contract)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateContractDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        websiteId={selectedWebsiteId}
        onSuccess={fetchContracts}
      />

      {selectedContract && (
        <>
          <EditContractDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            contract={selectedContract}
            onSuccess={fetchContracts}
          />
          <DeleteContractDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            contract={selectedContract}
            onSuccess={fetchContracts}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default Contracts;
