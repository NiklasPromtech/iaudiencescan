import type { Grade } from "@/components/overview/InvestmentGrade";

export const mockScorecard = [
  { label: "Visitors", value: "12,847" },
  { label: "With Extension", value: "4,231" },
  { label: "Wallets Connected", value: "892" },
  { label: "Median Balance", value: "$2,400" },
  { label: "Bot Rate", value: "23%", highlight: true },
];

export const mockDimensionRows: {
  source: string; visitors: string; extensions: string; wallets: string; avgBalance: string; botRate: string; grade: Grade;
}[] = [
  { source: "twitter_ads", visitors: "3,412", extensions: "1,204", wallets: "312", avgBalance: "$3,800", botRate: "8%", grade: "A" },
  { source: "telegram_promo", visitors: "2,891", extensions: "987", wallets: "241", avgBalance: "$1,900", botRate: "12%", grade: "B" },
  { source: "kol_campaign", visitors: "2,134", extensions: "402", wallets: "89", avgBalance: "$6,200", botRate: "41%", grade: "D" },
  { source: "organic", visitors: "2,508", extensions: "1,102", wallets: "198", avgBalance: "$4,100", botRate: "3%", grade: "A+" },
  { source: "coindesk_banner", visitors: "1,902", extensions: "536", wallets: "52", avgBalance: "$820", botRate: "67%", grade: "F" },
];

export const mockCostRows = [
  { source: "twitter_ads", spend: "$2,500", wallets: "34", cpa: "$73.52", cpb: "$12.40" },
  { source: "kol_campaign", spend: "$1,000", wallets: "8", cpa: "$125.00", cpb: "$45.20" },
  { source: "telegram_promo", spend: "$500", wallets: "22", cpa: "$22.72", cpb: "$8.10" },
];

export const mockScanResults = {
  xHandles: [
    { handle: "@whale_trader", followers: "142K" },
    { handle: "@defi_degen", followers: "89K" },
    { handle: "@nft_collector", followers: "67K" },
    { handle: "@eth_maxi", followers: "54K" },
  ],
  telegram: [
    { name: "DeFi Alpha Chat", members: "12.4K" },
    { name: "Whale Alerts", members: "8.2K" },
    { name: "Token Traders Hub", members: "6.1K" },
  ],
  prOutlets: [
    { name: "CoinDesk", type: "Tier 1" },
    { name: "The Block", type: "Tier 1" },
    { name: "Decrypt", type: "Tier 2" },
    { name: "CryptoSlate", type: "Tier 2" },
  ],
};

export const mockDailyChart = [
  { date: "Jan 27", views: 1842, extensions: 612 },
  { date: "Jan 28", views: 2105, extensions: 734 },
  { date: "Jan 29", views: 1678, extensions: 589 },
  { date: "Jan 30", views: 3412, extensions: 1204, touchpoint: "KOL Campaign Launch" },
  { date: "Jan 31", views: 2891, extensions: 987 },
  { date: "Feb 1", views: 1456, extensions: 498 },
  { date: "Feb 2", views: 1203, extensions: 421 },
];

export const mockHolderTrend = Array.from({ length: 30 }, (_, i) => {
  const base = 8200;
  const growth = i * 35 + (i > 19 ? (i - 19) * 60 : 0);
  const noise = Math.sin(i * 1.5) * 80;
  return {
    day: `Day ${i + 1}`,
    holders: Math.round(base + growth + noise),
    ...(i === 20 ? { event: "Exchange Listing" } : {}),
  };
});

export const mockPlatformTokens = {
  twitter: {
    label: "X / Twitter",
    count: 8,
    color: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    tokens: [
      { symbol: "LINK", name: "Chainlink", handle: "@chainlink", marketCap: "$8.2B" },
      { symbol: "AAVE", name: "Aave", handle: "@aabornyakov", marketCap: "$1.4B" },
      { symbol: "UNI", name: "Uniswap", handle: "@uniswap", marketCap: "$5.8B" },
      { symbol: "ARB", name: "Arbitrum", handle: "@arbitrum", marketCap: "$2.1B" },
    ],
  },
  telegram: {
    label: "Telegram",
    count: 6,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    tokens: [
      { symbol: "RNDR", name: "Render", handle: "render_network", marketCap: "$3.2B" },
      { symbol: "OP", name: "Optimism", handle: "optimism", marketCap: "$1.8B" },
      { symbol: "MATIC", name: "Polygon", handle: "polygonofficial", marketCap: "$4.1B" },
    ],
  },
  reddit: {
    label: "Reddit",
    count: 4,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    tokens: [
      { symbol: "ETH", name: "Ethereum", handle: "r/ethereum", marketCap: "$280B" },
      { symbol: "SOL", name: "Solana", handle: "r/solana", marketCap: "$62B" },
      { symbol: "ATOM", name: "Cosmos", handle: "r/cosmosnetwork", marketCap: "$2.8B" },
    ],
  },
  discord: {
    label: "Discord",
    count: 3,
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    tokens: [
      { symbol: "LDO", name: "Lido", handle: "Lido DAO", marketCap: "$1.6B" },
      { symbol: "MKR", name: "Maker", handle: "MakerDAO", marketCap: "$1.2B" },
      { symbol: "CRV", name: "Curve", handle: "Curve Finance", marketCap: "$0.5B" },
    ],
  },
};

export const mockNewsArticles = [
  { symbol: "LINK", token: "Chainlink", title: "Chainlink Expands Cross-Chain Services to Base Network", source: "CoinDesk", timeAgo: "2h ago" },
  { symbol: "UNI", token: "Uniswap", title: "Uniswap Labs Proposes New Fee Structure for V4", source: "The Block", timeAgo: "6h ago" },
  { symbol: "ARB", token: "Arbitrum", title: "Arbitrum DAO Approves $50M Gaming Catalyst Fund", source: "Decrypt", timeAgo: "1d ago" },
  { symbol: "AAVE", token: "Aave", title: "Aave Deploys Lending Markets on zkSync Era", source: "CryptoSlate", timeAgo: "2d ago" },
];

export const mockBotSummary = [
  { label: "Bots", count: 2847, pct: 23.1, color: "text-destructive" },
  { label: "Humans", count: 8934, pct: 72.5, color: "text-primary" },
  { label: "Unknown", count: 546, pct: 4.4, color: "text-muted-foreground" },
];

export const mockPROutlets = [
  { name: "CoinDesk", articles: 14 },
  { name: "The Block", articles: 9 },
  { name: "Decrypt", articles: 7 },
];
