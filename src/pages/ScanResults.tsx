import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Wallet,
  Coins,
  Users,
  Twitter,
  Globe,
  Newspaper,
  ChevronDown,
  ChevronUp,
  Network,
} from "lucide-react";
import {
  getScan,
  getScanResults,
  Scan,
  ScanResultsResponse,
  ScanResultsTopToken,
  SUPPORTED_CHAINS,
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

const DEFAULT_VISIBLE_TOKENS = 5;

const ScanResults = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<Scan | null>(null);
  const [results, setResults] = useState<ScanResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTokensExpanded, setIsTokensExpanded] = useState(false);
  const [isTargetingExpanded, setIsTargetingExpanded] = useState(false);

  const fetchData = useCallback(async () => {
    if (!scanId) return;

    setLoading(true);
    setError(null);
    try {
      const [scanData, resultsData] = await Promise.all([
        getScan(scanId),
        getScanResults(scanId),
      ]);
      setScan(scanData);
      setResults(resultsData);
    } catch (err) {
      console.error("Failed to fetch scan results:", err);
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setLoading(false);
    }
  }, [scanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getChainLabel = (chain: string) => {
    return SUPPORTED_CHAINS.find((c) => c.value === chain)?.label || chain;
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price == null || price === 0) return "—";
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (cap: number | null | undefined) => {
    if (cap == null || cap === 0) return "—";
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    if (cap >= 1e3) return `$${(cap / 1e3).toFixed(2)}K`;
    return `$${cap.toFixed(2)}`;
  };

  // Get tokens with social data for targeting opportunities
  const tokensWithSocials = results?.top_tokens.filter(
    (t) => t.twitter || t.website
  ) || [];

  const visibleTopTokens = isTokensExpanded
    ? results?.top_tokens || []
    : (results?.top_tokens || []).slice(0, DEFAULT_VISIBLE_TOKENS);

  const visibleTargetingTokens = isTargetingExpanded
    ? tokensWithSocials
    : tokensWithSocials.slice(0, DEFAULT_VISIBLE_TOKENS);

  return (
    <DashboardLayout>
      <div className="container max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="-ml-2"
            onClick={() => navigate(`/scans/${scanId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scan Details
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/network/${scanId}`)}
          >
            <Network className="h-4 w-4 mr-2" />
            View Full Network
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-64" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-12 border border-destructive text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Failed to load results
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/scans")}>
                Back to Scans
              </Button>
              <Button onClick={fetchData}>Try Again</Button>
            </div>
          </Card>
        )}

        {/* Results Content */}
        {scan && results && !error && !loading && (
          <div className="space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {scan.name || `Scan ${scan.id.slice(0, 8)}`}
              </h1>
              <p className="text-muted-foreground">
                {getChainLabel(scan.chain)} • {scan.wallet_count} wallets analyzed •{" "}
                {scan.completed_at
                  ? `Completed ${formatDistanceToNow(new Date(scan.completed_at), { addSuffix: true })}`
                  : "Processing..."}
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wallets</p>
                    <p className="text-2xl font-semibold">
                      {results.wallets_processed}
                    </p>
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
                    <p className="text-2xl font-semibold">
                      {results.tokens_enriched}
                    </p>
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
                    <p className="text-2xl font-semibold">
                      {tokensWithSocials.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Top Tokens Table */}
            <Card className="p-6">
              <h2 className="text-lg font-medium mb-4">Top Tokens</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead className="text-right">Wallets</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleTopTokens.map((token) => (
                    <TableRow key={token.token_address}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {token.token_logo_url ? (
                            <img
                              src={token.token_logo_url}
                              alt={token.token_symbol}
                              className="h-8 w-8 rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <Coins className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{token.token_symbol}</p>
                            {token.token_name && (
                              <p className="text-xs text-muted-foreground">
                                {token.token_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {token.unique_wallets ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(token.current_price_usd)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMarketCap(token.market_cap_usd)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(results?.top_tokens?.length || 0) > DEFAULT_VISIBLE_TOKENS && (
                <div className="pt-4 border-t mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTokensExpanded(!isTokensExpanded)}
                    className="w-full text-muted-foreground"
                  >
                    {isTokensExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        View all {(results?.top_tokens?.length || 0) - DEFAULT_VISIBLE_TOKENS} more
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>

            {/* Targeting Opportunities */}
            {tokensWithSocials.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-medium mb-4">Targeting Opportunities</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Tokens with social presence that can be used for targeting
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead>Twitter</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead className="text-right">News</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleTargetingTokens.map((token) => (
                      <TableRow key={token.token_address}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {token.token_logo_url ? (
                              <img
                                src={token.token_logo_url}
                                alt={token.token_symbol}
                                className="h-8 w-8 rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <Coins className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="font-medium">{token.token_symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {token.twitter ? (
                            <a
                              href={`https://twitter.com/${token.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Twitter className="h-4 w-4" />
                              @{token.twitter}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {token.website ? (
                            <a
                              href={token.website.startsWith("http") ? token.website : `https://${token.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Globe className="h-4 w-4" />
                              {new URL(token.website.startsWith("http") ? token.website : `https://${token.website}`).hostname}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {token.news_count > 0 ? (
                            <Badge variant="secondary" className="gap-1">
                              <Newspaper className="h-3 w-3" />
                              {token.news_count}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {tokensWithSocials.length > DEFAULT_VISIBLE_TOKENS && (
                  <div className="pt-4 border-t mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsTargetingExpanded(!isTargetingExpanded)}
                      className="w-full text-muted-foreground"
                    >
                      {isTargetingExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          View all {tokensWithSocials.length - DEFAULT_VISIBLE_TOKENS} more
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ScanResults;
