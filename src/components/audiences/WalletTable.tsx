import { WalletRow } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface WalletTableProps {
  wallets: WalletRow[];
  selectedWallets: string[];
  onSelectionChange: (wallets: string[]) => void;
  loading?: boolean;
}

export function WalletTable({
  wallets,
  selectedWallets,
  onSelectionChange,
  loading,
}: WalletTableProps) {
  const allSelected = wallets.length > 0 && wallets.every(w => selectedWallets.includes(w.wallet_id));
  const someSelected = wallets.some(w => selectedWallets.includes(w.wallet_id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection = [...new Set([...selectedWallets, ...wallets.map(w => w.wallet_id)])];
      onSelectionChange(newSelection);
    } else {
      const walletIds = new Set(wallets.map(w => w.wallet_id));
      onSelectionChange(selectedWallets.filter(id => !walletIds.has(id)));
    }
  };

  const handleSelectOne = (walletId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedWallets, walletId]);
    } else {
      onSelectionChange(selectedWallets.filter(id => id !== walletId));
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="border rounded-md">
        <div className="p-8 text-center text-muted-foreground">
          Loading wallets...
        </div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="border rounded-md">
        <div className="p-8 text-center text-muted-foreground">
          No wallets found matching your filters.
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) {
                    (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Wallet Address</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Last Seen</TableHead>
            <TableHead className="text-right">Visits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet) => (
            <TableRow key={wallet.wallet_id}>
              <TableCell>
                <Checkbox
                  checked={selectedWallets.includes(wallet.wallet_id)}
                  onCheckedChange={(checked) => handleSelectOne(wallet.wallet_id, !!checked)}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">
                {truncateAddress(wallet.wallet_id)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {wallet.types.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(wallet.last_seen), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {wallet.visit_count}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
