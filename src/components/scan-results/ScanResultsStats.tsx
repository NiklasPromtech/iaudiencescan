import { Wallet, Coins, Users, Twitter } from "lucide-react";
import { ScanResultsResponse } from "@/lib/api";

interface ScanResultsStatsProps {
  results: ScanResultsResponse;
}

export const ScanResultsStats = ({ results }: ScanResultsStatsProps) => {
  const tokensWithSocials = results.top_tokens.filter(
    (t) => t.twitter || t.telegram || t.discord || t.reddit
  ).length;

  const stats = [
    { label: "Wallets", value: results.wallets_processed, icon: <Wallet className="h-4 w-4 text-primary" /> },
    { label: "Tokens Found", value: results.tokens_found, icon: <Coins className="h-4 w-4 text-blue-500" /> },
    { label: "Enriched", value: results.tokens_enriched, icon: <Users className="h-4 w-4 text-green-500" /> },
    { label: "Social Signals", value: tokensWithSocials, icon: <Twitter className="h-4 w-4 text-primary" /> },
  ];

  return (
    <div className="flex items-center divide-x divide-border border-b border-border pb-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2 px-6 first:pl-0">
          {stat.icon}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="font-mono text-lg font-bold tabular-nums">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
