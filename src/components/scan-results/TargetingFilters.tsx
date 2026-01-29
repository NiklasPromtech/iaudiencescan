import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TargetingFiltersProps {
  minMarketCap: number | null;
  setMinMarketCap: (value: number | null) => void;
  minTransactions: number | null;
  setMinTransactions: (value: number | null) => void;
  sortBy: "wallets" | "market_cap" | "transactions";
  setSortBy: (value: "wallets" | "market_cap" | "transactions") => void;
}

export const TargetingFilters = ({
  minMarketCap,
  setMinMarketCap,
  minTransactions,
  setMinTransactions,
  sortBy,
  setSortBy,
}: TargetingFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Min Market Cap ($)</Label>
        <Input
          type="number"
          placeholder="e.g. 1000000"
          className="w-36 h-9"
          value={minMarketCap ?? ""}
          onChange={(e) => setMinMarketCap(e.target.value ? Number(e.target.value) : null)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Min Transactions</Label>
        <Input
          type="number"
          placeholder="e.g. 5"
          className="w-28 h-9"
          value={minTransactions ?? ""}
          onChange={(e) => setMinTransactions(e.target.value ? Number(e.target.value) : null)}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Sort By</Label>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border z-50">
            <SelectItem value="wallets">Wallets</SelectItem>
            <SelectItem value="market_cap">Market Cap</SelectItem>
            <SelectItem value="transactions">Transactions</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
