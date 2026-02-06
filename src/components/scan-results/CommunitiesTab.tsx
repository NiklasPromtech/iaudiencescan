import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanResultsTopToken } from "@/lib/api";
import { PlatformTargetingCard } from "./PlatformTargetingCard";
import { TargetingFilters } from "./TargetingFilters";
import { SummaryBadges } from "./SummaryBadges";
import { getPlatformCounts } from "@/lib/export-utils";

interface CommunitiesTabProps {
  tokens: ScanResultsTopToken[];
}

export const CommunitiesTab = ({ tokens }: CommunitiesTabProps) => {
  // Filters
  const [minMarketCap, setMinMarketCap] = useState<number | null>(null);
  const [minTransactions, setMinTransactions] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"wallets" | "market_cap" | "transactions">("wallets");
  const [hasNews, setHasNews] = useState<boolean | null>(null);
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null);
  const [platformFilter, setPlatformFilter] = useState<"all" | "twitter" | "telegram" | "reddit" | "discord">("all");

  // Filter and sort tokens
  const filteredTokens = useMemo(() => {
    let result = [...tokens];

    // Apply filters
    if (minMarketCap !== null) {
      result = result.filter((t) => (t.market_cap_usd ?? 0) >= minMarketCap);
    }
    if (minTransactions !== null) {
      result = result.filter((t) => (t.transaction_count ?? 0) >= minTransactions);
    }
    if (hasNews === true) {
      result = result.filter((t) => (t.news_count ?? 0) > 0);
    }
    if (hasWebsite === true) {
      result = result.filter((t) => t.website && t.website.trim() !== "");
    }
    if (platformFilter !== "all") {
      result = result.filter((t) => {
        const handle = t[platformFilter];
        return handle && handle.trim() !== "";
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "market_cap":
          return (b.market_cap_usd ?? 0) - (a.market_cap_usd ?? 0);
        case "transactions":
          return (b.transaction_count ?? 0) - (a.transaction_count ?? 0);
        case "wallets":
        default:
          return (b.unique_wallets ?? 0) - (a.unique_wallets ?? 0);
      }
    });

    return result;
  }, [tokens, minMarketCap, minTransactions, sortBy, hasNews, hasWebsite, platformFilter]);

  const counts = useMemo(() => getPlatformCounts(filteredTokens), [filteredTokens]);

  const clearFilters = () => {
    setMinMarketCap(null);
    setMinTransactions(null);
    setHasNews(null);
    setHasWebsite(null);
    setPlatformFilter("all");
  };

  const hasActiveFilters = minMarketCap !== null || minTransactions !== null || 
    hasNews !== null || hasWebsite !== null || platformFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Summary Badges */}
      <SummaryBadges counts={counts} />

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-medium text-sm mb-1">Filter Communities</h3>
            <p className="text-xs text-muted-foreground">
              Narrow down to high-value targeting opportunities
            </p>
          </div>
          <TargetingFilters
            minMarketCap={minMarketCap}
            setMinMarketCap={setMinMarketCap}
            minTransactions={minTransactions}
            setMinTransactions={setMinTransactions}
            sortBy={sortBy}
            setSortBy={setSortBy}
            hasNews={hasNews}
            setHasNews={setHasNews}
            hasWebsite={hasWebsite}
            setHasWebsite={setHasWebsite}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
          />
        </div>
      </Card>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformTargetingCard platform="twitter" tokens={filteredTokens} />
        <PlatformTargetingCard platform="telegram" tokens={filteredTokens} />
        <PlatformTargetingCard platform="reddit" tokens={filteredTokens} />
        <PlatformTargetingCard platform="discord" tokens={filteredTokens} />
      </div>

      {/* Empty State for Filtered Results */}
      {filteredTokens.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No communities match your current filters. Try adjusting the filters.
          </p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};
