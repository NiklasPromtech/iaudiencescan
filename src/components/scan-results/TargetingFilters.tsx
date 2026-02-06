import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TargetingFiltersProps {
  minMarketCap: number | null;
  setMinMarketCap: (value: number | null) => void;
  minTransactions: number | null;
  setMinTransactions: (value: number | null) => void;
  sortBy: "wallets" | "market_cap" | "transactions";
  setSortBy: (value: "wallets" | "market_cap" | "transactions") => void;
  // New filter options
  hasNews?: boolean | null;
  setHasNews?: (value: boolean | null) => void;
  hasWebsite?: boolean | null;
  setHasWebsite?: (value: boolean | null) => void;
  platformFilter?: "all" | "twitter" | "telegram" | "reddit" | "discord";
  setPlatformFilter?: (value: "all" | "twitter" | "telegram" | "reddit" | "discord") => void;
}

export const TargetingFilters = ({
  minMarketCap,
  setMinMarketCap,
  minTransactions,
  setMinTransactions,
  sortBy,
  setSortBy,
  hasNews,
  setHasNews,
  hasWebsite,
  setHasWebsite,
  platformFilter,
  setPlatformFilter,
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

      {/* New filters - only show if props are provided */}
      {setPlatformFilter && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Platform</Label>
          <Select 
            value={platformFilter || "all"} 
            onValueChange={(v) => setPlatformFilter(v as typeof platformFilter)}
          >
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border z-50">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="twitter">X / Twitter</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="discord">Discord</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {setHasNews && (
        <div className="flex items-center gap-2 h-9 pb-0.5">
          <Switch
            id="has-news"
            checked={hasNews === true}
            onCheckedChange={(checked) => setHasNews(checked ? true : null)}
          />
          <Label htmlFor="has-news" className="text-xs text-muted-foreground cursor-pointer">
            Has News
          </Label>
        </div>
      )}

      {setHasWebsite && (
        <div className="flex items-center gap-2 h-9 pb-0.5">
          <Switch
            id="has-website"
            checked={hasWebsite === true}
            onCheckedChange={(checked) => setHasWebsite(checked ? true : null)}
          />
          <Label htmlFor="has-website" className="text-xs text-muted-foreground cursor-pointer">
            Has Website
          </Label>
        </div>
      )}
    </div>
  );
};
