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
    count: 7,
    color: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    tokens: [
      { symbol: "LINK", name: "Chainlink", handle: "@chainlink", marketCap: "$5.8B", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
      { symbol: "ONDO", name: "Ondo Finance", handle: "@OndoFinance", marketCap: "$1.1B", logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png" },
      { symbol: "XAUT", name: "Tether Gold", handle: "@tethergold", marketCap: "$2.5B", logo: "https://assets.coingecko.com/coins/images/10481/small/Tether_Gold.png" },
      { symbol: "PAXG", name: "Paxos Gold", handle: "@paxosglobal", marketCap: "$2.2B", logo: "https://assets.coingecko.com/coins/images/9519/small/paxg.PNG" },
    ],
  },
  telegram: {
    label: "Telegram",
    count: 5,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    tokens: [
      { symbol: "LINK", name: "Chainlink", handle: "chainlinkofficial", marketCap: "$5.8B", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
      { symbol: "ONDO", name: "Ondo Finance", handle: "ondofinance", marketCap: "$1.1B", logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png" },
      { symbol: "NUSD", name: "Neutrl USD", handle: "NeutrlOfficial", marketCap: "$226M" },
    ],
  },
  discord: {
    label: "Discord",
    count: 4,
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    tokens: [
      { symbol: "ONDO", name: "Ondo Finance", handle: "Ondo DAO", marketCap: "$1.1B", logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png" },
      { symbol: "RESOLV", name: "Resolv", handle: "resolvcommunity", marketCap: "$28M" },
      { symbol: "EUL", name: "Euler Finance", handle: "euler.finance", marketCap: "$16.5M", logo: "https://assets.coingecko.com/coins/images/26149/small/YCvKDfl8_400x400.jpeg" },
    ],
  },
  reddit: {
    label: "Reddit",
    count: 1,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    tokens: [
      { symbol: "LINK", name: "Chainlink", handle: "r/Chainlink", marketCap: "$5.8B", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
    ],
  },
};
export const mockNewsArticles = [
  { symbol: "USDC", token: "USD Coin", title: "Circle Partners Polymarket to Integrate Native USDC, Eliminating Bridge Risk", source: "CoinSpeaker", timeAgo: "1h ago", logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png" },
  { symbol: "XAUT", token: "Tether Gold", title: "$150M Investment in Tether Gold.com: XAUt Integration", source: "COINOTAG", timeAgo: "3h ago", logo: "https://assets.coingecko.com/coins/images/10481/small/Tether_Gold.png" },
  { symbol: "ONDO", token: "Ondo Finance", title: "MetaMask Partners Ondo Finance to Integrate Tokenized US Stocks, ETFs", source: "CoinSpeaker", timeAgo: "1d ago", logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png" },
  { symbol: "LINK", token: "Chainlink", title: "Morph Integrates Chainlink CCIP As Exclusive Cross-Chain Standard", source: "Blockchain Reporter", timeAgo: "1d ago", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
  { symbol: "PAXG", token: "Paxos Gold", title: "Paxos Gold (PAXG) sees record $248 million inflow in January", source: "CoinDesk", timeAgo: "1w ago", logo: "https://assets.coingecko.com/coins/images/9519/small/paxg.PNG" },
];

export const mockBotSummary = [
  { label: "Bots", count: 2847, pct: 23.1, color: "text-destructive" },
  { label: "Humans", count: 8934, pct: 72.5, color: "text-primary" },
  { label: "Unknown", count: 546, pct: 4.4, color: "text-muted-foreground" },
];

export const mockPROutlets = [
  { name: "CoinSpeaker", articles: 6 },
  { name: "CoinDesk", articles: 4 },
  { name: "Blockchain Reporter", articles: 3 },
  { name: "Seeking Alpha", articles: 2 },
  { name: "Benzinga", articles: 2 },
];
