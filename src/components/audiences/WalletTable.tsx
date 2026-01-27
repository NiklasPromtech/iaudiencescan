import { WalletRow, SUPPORTED_CHAINS } from "@/lib/api";
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
import { Link as LinkIcon } from "lucide-react";

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

  const formatBalance = (balance: number | null | undefined) => {
    if (balance === null || balance === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  const getChainLabel = (chainValue: string) => {
    const chain = SUPPORTED_CHAINS.find(c => c.value === chainValue);
    return chain?.label || chainValue;
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
    <div className="border rounded-md overflow-x-auto">
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
            <TableHead>Chains</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Visits</TableHead>
            <TableHead className="text-right">Last Seen</TableHead>
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
                <div className="flex items-center gap-2">
                  {truncateAddress(wallet.wallet_id)}
                  <a
                    href={`https://etherscan.io/address/${wallet.wallet_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="h-3 w-3" />
                  </a>
                </div>
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
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {wallet.chains?.map((chain) => (
                    <Badge key={chain} variant="outline" className="text-xs">
                      {getChainLabel(chain)}
                    </Badge>
                  )) || <span className="text-muted-foreground text-sm">—</span>}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {wallet.enrichment_status === "completed" || wallet.total_balance_usd !== null
                  ? formatBalance(wallet.total_balance_usd ?? 0)
                  : <span className="text-muted-foreground text-sm">Not enriched</span>
                }
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {wallet.visit_count}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                {formatDistanceToNow(new Date(wallet.last_seen), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
