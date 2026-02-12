import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Download, Search, ExternalLink, Globe, ArrowUpDown } from "lucide-react";
import { ScanResultsTopToken } from "@/lib/api";
import { copyToClipboard, downloadCSV, formatMarketCap } from "@/lib/export-utils";

interface WebsitesTabProps {
  tokens: ScanResultsTopToken[];
}

type SortField = "name" | "market_cap" | "news_count" | "transactions";
type SortDir = "asc" | "desc";

export const WebsitesTab = ({ tokens }: WebsitesTabProps) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("market_cap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Filter tokens with websites
  const tokensWithWebsites = useMemo(() => {
    return tokens.filter((t) => t.website && t.website.trim() !== "");
  }, [tokens]);

  // Apply search and sorting
  const filteredTokens = useMemo(() => {
    let result = [...tokensWithWebsites];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.token_name.toLowerCase().includes(searchLower) ||
          t.website?.toLowerCase().includes(searchLower) ||
          t.twitter?.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case "name":
          aVal = a.token_name.toLowerCase();
          bVal = b.token_name.toLowerCase();
          break;
        case "market_cap":
          aVal = a.market_cap_usd ?? 0;
          bVal = b.market_cap_usd ?? 0;
          break;
        case "news_count":
          aVal = a.news_count ?? 0;
          bVal = b.news_count ?? 0;
          break;
        case "transactions":
          aVal = a.transaction_count ?? 0;
          bVal = b.transaction_count ?? 0;
          break;
        default:
          return 0;
      }

      if (typeof aVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return sortDir === "asc" ? aVal - (bVal as number) : (bVal as number) - aVal;
    });

    return result;
  }, [tokensWithWebsites, search, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleCopyWebsites = () => {
    const urls = filteredTokens.map((t) => t.website).filter(Boolean) as string[];
    copyToClipboard(urls.join("\n"), `Copied ${urls.length} website URLs`);
  };

  const handleExportCSV = () => {
    const headers = ["Token", "Website", "Twitter", "News Count", "Market Cap", "Transactions"];
    const rows = filteredTokens.map((t) => [
      t.token_name,
      t.website || "",
      t.twitter ? `@${t.twitter}` : "",
      (t.news_count || 0).toString(),
      t.market_cap_usd?.toString() || "",
      t.transaction_count.toString(),
    ]);
    downloadCSV([headers, ...rows], "websites-outreach");
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 px-2 -ml-2 font-medium"
    >
      {label}
      <ArrowUpDown
        className={`ml-1 h-3 w-3 ${sortField === field ? "opacity-100" : "opacity-40"}`}
      />
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest flex items-center gap-2">
            <Globe className="h-4 w-4 text-green-500" />
            Websites & Outreach List
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            {tokensWithWebsites.length} project websites found
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyWebsites} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy All URLs
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, website, or Twitter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {filteredTokens.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <Globe className="h-12 w-12 mx-auto opacity-30 mb-4" />
          <p className="text-muted-foreground">
            {tokensWithWebsites.length === 0
              ? "No project websites found in this scan."
              : "No websites match your search."}
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-mono text-xs uppercase tracking-widest">
                  <SortButton field="name" label="Token" />
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-widest">Website</TableHead>
                <TableHead className="w-[120px] font-mono text-xs uppercase tracking-widest">Twitter</TableHead>
                <TableHead className="w-[80px] font-mono text-xs uppercase tracking-widest">
                  <SortButton field="news_count" label="News" />
                </TableHead>
                <TableHead className="w-[100px] font-mono text-xs uppercase tracking-widest">
                  <SortButton field="market_cap" label="Mcap" />
                </TableHead>
                <TableHead className="w-[80px] font-mono text-xs uppercase tracking-widest">
                  <SortButton field="transactions" label="Txns" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((token) => (
                <TableRow key={token.token_address}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {token.token_logo_url ? (
                        <img
                          src={token.token_logo_url}
                          alt={token.token_symbol}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {token.token_symbol?.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium truncate">{token.token_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={token.website || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      {token.website?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    {token.twitter ? (
                      <a
                        href={`https://x.com/${token.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-muted-foreground hover:text-foreground text-sm"
                      >
                        @{token.twitter.slice(0, 12)}
                        {token.twitter.length > 12 ? "..." : ""}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {token.news_count && token.news_count > 0 ? (
                      <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                        {token.news_count}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm tabular-nums">
                      {formatMarketCap(token.market_cap_usd) || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm tabular-nums text-muted-foreground">
                      {token.transaction_count.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
