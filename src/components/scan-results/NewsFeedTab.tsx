import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download, Search, Newspaper } from "lucide-react";
import { ScanResultsTopToken } from "@/lib/api";
import { NewsArticleCard } from "./NewsArticleCard";
import { PROutletsSection } from "./PROutletsSection";
import {
  aggregateNewsArticles,
  aggregateNewsSources,
  filterNewsByRecency,
  copyToClipboard,
  downloadCSV,
  AggregatedNewsArticle,
} from "@/lib/export-utils";

interface NewsFeedTabProps {
  tokens: ScanResultsTopToken[];
}

export const NewsFeedTab = ({ tokens }: NewsFeedTabProps) => {
  const [recency, setRecency] = useState<"all" | "24h" | "7d" | "30d">("all");
  const [search, setSearch] = useState("");
  const [groupByToken, setGroupByToken] = useState(false);

  // Aggregate news sources for PR section
  const newsSources = useMemo(() => aggregateNewsSources(tokens), [tokens]);

  // Aggregate and filter news
  const allArticles = useMemo(() => aggregateNewsArticles(tokens), [tokens]);

  const filteredArticles = useMemo(() => {
    let articles = filterNewsByRecency(allArticles, recency);

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.description?.toLowerCase().includes(searchLower) ||
          a.token_name.toLowerCase().includes(searchLower) ||
          a.source_domain.toLowerCase().includes(searchLower)
      );
    }

    return articles;
  }, [allArticles, recency, search]);

  // Group by token if needed
  const groupedArticles = useMemo(() => {
    if (!groupByToken) return null;

    const groups: Record<string, AggregatedNewsArticle[]> = {};
    filteredArticles.forEach((article) => {
      const key = article.token_name;
      if (!groups[key]) groups[key] = [];
      groups[key].push(article);
    });

    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [filteredArticles, groupByToken]);

  const handleCopyURLs = () => {
    const urls = filteredArticles.map((a) => a.url);
    copyToClipboard(urls.join("\n"), `Copied ${urls.length} news URLs`);
  };

  const handleExportCSV = () => {
    const headers = ["Token", "Title", "URL", "Source", "Published", "Description"];
    const rows = filteredArticles.map((a) => [
      a.token_name,
      a.title,
      a.url,
      a.source_domain,
      a.published_at,
      a.description || "",
    ]);
    downloadCSV([headers, ...rows], "news-articles");
  };

  const tokenCount = new Set(filteredArticles.map((a) => a.token_name)).size;

  return (
    <div className="space-y-6">
      {/* PR Opportunities Section */}
      <PROutletsSection sources={newsSources} />
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-amber-500" />
            News Feed
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredArticles.length} articles from {tokenCount} communities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyURLs} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy URLs
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs text-muted-foreground mb-1.5 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Time Period</Label>
            <Select value={recency} onValueChange={(v) => setRecency(v as typeof recency)}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">View</Label>
            <Select
              value={groupByToken ? "grouped" : "chronological"}
              onValueChange={(v) => setGroupByToken(v === "grouped")}
            >
              <SelectTrigger className="w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chronological">Chronological</SelectItem>
                <SelectItem value="grouped">Group by Token</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Articles List */}
      {filteredArticles.length === 0 ? (
        <Card className="p-12 text-center">
          <Newspaper className="h-12 w-12 mx-auto opacity-30 mb-4" />
          <p className="text-muted-foreground">
            {allArticles.length === 0
              ? "No news articles found for these communities."
              : "No articles match your current filters."}
          </p>
        </Card>
      ) : groupByToken && groupedArticles ? (
        <div className="space-y-6">
          {groupedArticles.map(([tokenName, articles]) => (
            <div key={tokenName}>
              <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                {articles[0].token_logo_url && (
                  <img
                    src={articles[0].token_logo_url}
                    alt={tokenName}
                    className="h-5 w-5 rounded-full"
                  />
                )}
                {tokenName}
                <span className="text-muted-foreground">({articles.length} articles)</span>
              </h3>
              <div className="space-y-3">
                {articles.map((article, idx) => (
                  <NewsArticleCard key={`${article.url}-${idx}`} article={article} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article, idx) => (
            <NewsArticleCard key={`${article.url}-${idx}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
