import React from "react";
import { Newspaper, ExternalLink } from "lucide-react";
import { mockNewsArticles, mockPROutlets } from "./mock-data";

const TokenAvatar = ({ symbol, logo }: { symbol: string; logo?: string }) => {
  const [imgError, setImgError] = React.useState(false);
  if (logo && !imgError) {
    return <img src={logo} alt={symbol} className="w-8 h-8 rounded-full shrink-0 object-cover" onError={() => setImgError(true)} />;
  }
  return (
    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
      {symbol.slice(0, 2)}
    </span>
  );
};

export const MockNewsFeed = () => (
  <div className="pt-10">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Aggregated News Intelligence
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Every article mentioning the tokens your audience holds — aggregated, searchable, and exportable for PR outreach.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_240px] gap-6">
        {/* Articles */}
        <div className="space-y-3">
          {mockNewsArticles.map((article) => (
            <div key={article.title} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4 hover:shadow-sm transition-shadow">
              <TokenAvatar symbol={article.symbol} logo={article.logo} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug mb-1">{article.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/70">{article.token}</span>
                  <span>·</span>
                  <span>{article.source}</span>
                  <span>·</span>
                  <span>{article.timeAgo}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {/* PR Outlets sidebar */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-primary" />
            PR Outlets
          </h4>
          <div className="space-y-3">
            {mockPROutlets.map((outlet) => (
              <div key={outlet.name} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{outlet.name}</span>
                <span className="text-xs text-muted-foreground">{outlet.articles} articles</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
            Export all outlet contacts for targeted PR campaigns
          </p>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">Aggregated news feed — filter by recency, search, or export for PR outreach</p>
    </div>
  </div>
);
