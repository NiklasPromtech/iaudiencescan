import { useState } from "react";
import { NoWebsiteState } from "@/components/dashboard/NoWebsiteState";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, FileCode2, Trash2, Pencil, BarChart3 } from "lucide-react";
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
import { HolderChartDialog } from "@/components/contracts/HolderChartDialog";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { useContracts, useInvalidateContracts, TokenContract } from "@/hooks/use-dashboard-queries";

const Contracts = () => {
  const { toast } = useToast();
  const { selectedWebsite, loading: websiteLoading } = useSelectedWebsite();
  const invalidateContracts = useInvalidateContracts();
  
  const {
    data: contracts = [],
    isLoading: loading,
  } = useContracts(selectedWebsite?.id);
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [holderDialogOpen, setHolderDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<TokenContract | null>(null);

  const handleSuccess = () => {
    if (selectedWebsite?.id) {
      invalidateContracts(selectedWebsite.id);
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

  const handleViewHolders = (contract: TokenContract) => {
    setSelectedContract(contract);
    setHolderDialogOpen(true);
  };

  if (!websiteLoading && !selectedWebsite) {
    return (
      <DashboardLayout>
        <NoWebsiteState />
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
                  <TableHead className="w-[130px]">Actions</TableHead>
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewHolders(contract)}
                          title="View holder chart"
                        >
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(contract)}
                          title="Edit contract"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contract)}
                          title="Delete contract"
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
        websiteId={selectedWebsite.id}
        onSuccess={handleSuccess}
      />

      {selectedContract && (
        <>
          <EditContractDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            contract={selectedContract}
            onSuccess={handleSuccess}
          />
          <DeleteContractDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            contract={selectedContract}
            onSuccess={handleSuccess}
          />
          {selectedWebsite.tag_id && (
            <HolderChartDialog
              open={holderDialogOpen}
              onOpenChange={setHolderDialogOpen}
              contract={selectedContract}
              tagId={selectedWebsite.tag_id}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Contracts;
