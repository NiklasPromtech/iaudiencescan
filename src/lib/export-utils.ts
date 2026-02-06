import { toast } from "sonner";
import { ScanResultsTopToken, NewsArticle } from "./api";

/**
 * Download data as a CSV file
 */
export function downloadCSV(data: string[][], filename: string): void {
  const csvContent = data
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma, newline, or quote
          const escaped = String(cell ?? "").replace(/"/g, '""');
          return /[,\n"]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success(`Downloaded ${filename}.csv`);
}

/**
 * Copy text to clipboard with toast feedback
 */
export async function copyToClipboard(
  text: string,
  successMessage: string
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    toast.error("Failed to copy to clipboard");
    return false;
  }
}

/**
 * Format platform handles for export
 */
export function formatPlatformHandles(
  tokens: ScanResultsTopToken[],
  platform: "twitter" | "telegram" | "reddit" | "discord"
): string[] {
  return tokens
    .map((t) => {
      const handle = t[platform];
      if (!handle) return null;

      switch (platform) {
        case "twitter":
          return handle.startsWith("@") ? handle : `@${handle}`;
        case "reddit":
          return handle.startsWith("r/") ? handle : `r/${handle}`;
        default:
          return handle;
      }
    })
    .filter((h): h is string => h !== null && h.trim() !== "");
}

/**
 * Get platform handles with full URLs for export
 */
export function formatPlatformURLs(
  tokens: ScanResultsTopToken[],
  platform: "twitter" | "telegram" | "reddit" | "discord"
): string[] {
  const baseUrls = {
    twitter: "https://x.com/",
    telegram: "https://t.me/",
    reddit: "https://reddit.com/r/",
    discord: "https://discord.gg/",
  };

  return tokens
    .map((t) => {
      const handle = t[platform];
      if (!handle || handle.trim() === "") return null;
      return `${baseUrls[platform]}${handle}`;
    })
    .filter((url): url is string => url !== null);
}

/**
 * Get all news article URLs from tokens
 */
export function formatNewsURLs(tokens: ScanResultsTopToken[]): string[] {
  return tokens
    .flatMap((t) => t.news_articles || [])
    .map((article) => article.url)
    .filter((url, index, self) => self.indexOf(url) === index); // Unique URLs
}

/**
 * Get all project website URLs
 */
export function formatWebsiteURLs(tokens: ScanResultsTopToken[]): string[] {
  return tokens
    .map((t) => t.website)
    .filter((url): url is string => url !== null && url !== undefined && url.trim() !== "")
    .filter((url, index, self) => self.indexOf(url) === index); // Unique URLs
}

/**
 * Get all social profile URLs combined
 */
export function formatAllSocialURLs(tokens: ScanResultsTopToken[]): string[] {
  const platforms: ("twitter" | "telegram" | "reddit" | "discord")[] = [
    "twitter",
    "telegram",
    "reddit",
    "discord",
  ];

  const urls: string[] = [];
  platforms.forEach((platform) => {
    urls.push(...formatPlatformURLs(tokens, platform));
  });

  return [...new Set(urls)]; // Unique
}

/**
 * Format full dataset for CSV export
 */
export function formatFullExportCSV(tokens: ScanResultsTopToken[]): string[][] {
  const headers = [
    "Token Name",
    "Symbol",
    "Address",
    "Chain",
    "Website",
    "Twitter",
    "Telegram",
    "Reddit",
    "Discord",
    "Market Cap (USD)",
    "Price (USD)",
    "Unique Wallets",
    "Transaction Count",
    "News Count",
    "Description",
  ];

  const rows = tokens.map((t) => [
    t.token_name,
    t.token_symbol,
    t.token_address,
    t.chain_name,
    t.website || "",
    t.twitter ? `@${t.twitter}` : "",
    t.telegram || "",
    t.reddit ? `r/${t.reddit}` : "",
    t.discord || "",
    t.market_cap_usd?.toString() || "",
    t.current_price_usd?.toString() || "",
    t.unique_wallets.toString(),
    t.transaction_count.toString(),
    (t.news_count || 0).toString(),
    t.description || "",
  ]);

  return [headers, ...rows];
}

/**
 * Format data as JSON string for export
 */
export function formatFullExportJSON(tokens: ScanResultsTopToken[]): string {
  return JSON.stringify(tokens, null, 2);
}

/**
 * Aggregate all news articles from tokens with token context
 */
export interface AggregatedNewsArticle extends NewsArticle {
  token_name: string;
  token_symbol: string;
  token_logo_url: string | null;
}

export function aggregateNewsArticles(
  tokens: ScanResultsTopToken[]
): AggregatedNewsArticle[] {
  const articles: AggregatedNewsArticle[] = [];

  tokens.forEach((token) => {
    if (token.news_articles) {
      token.news_articles.forEach((article) => {
        articles.push({
          ...article,
          token_name: token.token_name,
          token_symbol: token.token_symbol,
          token_logo_url: token.token_logo_url,
        });
      });
    }
  });

  // Sort by published date (most recent first)
  return articles.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

/**
 * Filter news articles by recency
 */
export function filterNewsByRecency(
  articles: AggregatedNewsArticle[],
  recency: "all" | "24h" | "7d" | "30d"
): AggregatedNewsArticle[] {
  if (recency === "all") return articles;

  const now = new Date();
  const cutoff = new Date();

  switch (recency) {
    case "24h":
      cutoff.setHours(now.getHours() - 24);
      break;
    case "7d":
      cutoff.setDate(now.getDate() - 7);
      break;
    case "30d":
      cutoff.setDate(now.getDate() - 30);
      break;
  }

  return articles.filter(
    (article) => new Date(article.published_at) >= cutoff
  );
}

/**
 * Get platform counts summary
 */
export function getPlatformCounts(tokens: ScanResultsTopToken[]) {
  return {
    twitter: tokens.filter((t) => t.twitter && t.twitter.trim() !== "").length,
    telegram: tokens.filter((t) => t.telegram && t.telegram.trim() !== "").length,
    reddit: tokens.filter((t) => t.reddit && t.reddit.trim() !== "").length,
    discord: tokens.filter((t) => t.discord && t.discord.trim() !== "").length,
    websites: tokens.filter((t) => t.website && t.website.trim() !== "").length,
    news: tokens.reduce((acc, t) => acc + (t.news_count || 0), 0),
  };
}

/**
 * Format market cap for display
 */
export function formatMarketCap(cap: number | null | undefined): string | null {
  if (!cap) return null;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(1)}M`;
  if (cap >= 1e3) return `$${(cap / 1e3).toFixed(0)}K`;
  return `$${cap.toFixed(0)}`;
}
