import { Card } from "@/components/ui/card";
import { Wallet, Coins, Users, Twitter } from "lucide-react";
import { ScanResultsResponse } from "@/lib/api";

interface ScanResultsStatsProps {
  results: ScanResultsResponse;
}

export const ScanResultsStats = ({ results }: ScanResultsStatsProps) => {
  const tokensWithSocials = results.top_tokens.filter(
    (t) => t.twitter || t.telegram || t.discord || t.reddit
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wallets</p>
            <p className="text-2xl font-semibold">{results.wallets_processed}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Coins className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tokens Found</p>
            <p className="text-2xl font-semibold">{results.tokens_found}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Enriched</p>
            <p className="text-2xl font-semibold">{results.tokens_enriched}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Twitter className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Social Signals</p>
            <p className="text-2xl font-semibold">{tokensWithSocials}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
