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
      { symbol: "USDC", name: "USD Coin", handle: "@circle", marketCap: "$73.3B", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" },
      { symbol: "POL", name: "Polygon", handle: "@0xPolygon", marketCap: "$937M", logo: "https://coin-images.coingecko.com/coins/images/32440/large/pol.png" },
      { symbol: "PEPE", name: "Pepe", handle: "@pepecoineth", marketCap: "$3.2B", logo: "https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg" },
      { symbol: "T6900", name: "Token6900", handle: "@Token_6900", marketCap: "$749K", logo: "https://coin-images.coingecko.com/coins/images/68913/large/Token6900_Logo_200x200.png" },
      { symbol: "PORK", name: "PepeFork", handle: "@PorkCoinETH", marketCap: "$6.2M", logo: "https://coin-images.coingecko.com/coins/images/34913/large/pork.png" },
      { symbol: "SNORT", name: "Snorter", handle: "@SnorterToken", marketCap: "$1.9M", logo: "https://coin-images.coingecko.com/coins/images/70353/large/snort_400x400.jpg" },
      { symbol: "BEST", name: "Best Wallet", handle: "@BestWalletHQ", marketCap: "$8.2M", logo: "https://coin-images.coingecko.com/coins/images/70874/large/Logo_%283%29.png" },
      { symbol: "PNDC", name: "Pond Coin", handle: "@pond0x", marketCap: "$6.3M", logo: "https://coin-images.coingecko.com/coins/images/31215/large/pond-coin.jpeg" },
    ],
  },
  telegram: {
    label: "Telegram",
    count: 6,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    tokens: [
      { symbol: "POL", name: "Polygon", handle: "PolygonHQ", marketCap: "$937M", logo: "https://coin-images.coingecko.com/coins/images/32440/large/pol.png" },
      { symbol: "MATIC", name: "Matic Token", handle: "polygonofficial", marketCap: "$2.1B", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png" },
      { symbol: "SNORT", name: "Snorter", handle: "Snorter_token", marketCap: "$1.9M", logo: "https://coin-images.coingecko.com/coins/images/70353/large/snort_400x400.jpg" },
      { symbol: "BEST", name: "Best Wallet", handle: "Best_Wallet_Announcements", marketCap: "$8.2M", logo: "https://coin-images.coingecko.com/coins/images/70874/large/Logo_%283%29.png" },
      { symbol: "LINK", name: "Chainlink", handle: "chainlinkofficial", marketCap: "$5.8B", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
      { symbol: "ONDO", name: "Ondo Finance", handle: "ondofinance", marketCap: "$1.1B", logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png" },
    ],
  },
  discord: {
    label: "Discord",
    count: 5,
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    tokens: [
      { symbol: "POL", name: "Polygon", handle: "0xPolygonCommunity", marketCap: "$937M", logo: "https://coin-images.coingecko.com/coins/images/32440/large/pol.png" },
      { symbol: "BEST", name: "Best Wallet", handle: "bestwallet", marketCap: "$8.2M", logo: "https://coin-images.coingecko.com/coins/images/70874/large/Logo_%283%29.png" },
      { symbol: "ONDO", name: "Ondo Finance", handle: "Ondo DAO", marketCap: "$1.1B", logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png" },
      { symbol: "RESOLV", name: "Resolv", handle: "resolvcommunity", marketCap: "$28M" },
      { symbol: "EUL", name: "Euler Finance", handle: "euler.finance", marketCap: "$16.5M", logo: "https://assets.coingecko.com/coins/images/26149/small/YCvKDfl8_400x400.jpeg" },
    ],
  },
  reddit: {
    label: "Reddit",
    count: 3,
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    tokens: [
      { symbol: "POL", name: "Polygon", handle: "r/0xPolygon", marketCap: "$937M", logo: "https://coin-images.coingecko.com/coins/images/32440/large/pol.png" },
      { symbol: "MATIC", name: "Matic Token", handle: "r/0xPolygon", marketCap: "$2.1B", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png" },
      { symbol: "LINK", name: "Chainlink", handle: "r/Chainlink", marketCap: "$5.8B", logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png" },
    ],
  },
};

export const mockNewsArticles = [
  { symbol: "USDC", token: "USD Coin", title: "Circle Partners Polymarket to Integrate Native USDC, Eliminating Bridge Risk", source: "DeFi Rate", timeAgo: "1h ago", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" },
  { symbol: "USDC", token: "USD Coin", title: "Circle Mints 250M USDC on Solana to Expand Liquidity", source: "Crypto Economy", timeAgo: "3h ago", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" },
  { symbol: "POL", token: "Polygon", title: "Polygon Burns 25.9M POL to Cut Supply as Capital Inflows Rise", source: "AMBCrypto", timeAgo: "6h ago", logo: "https://coin-images.coingecko.com/coins/images/32440/large/pol.png" },
  { symbol: "MATIC", token: "Matic Token", title: "Polygon Labs Acquires Coinme to Build Stablecoin Payment Rails", source: "Blockchain News", timeAgo: "1d ago", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png" },
  { symbol: "PEPE", token: "Pepe", title: "Pepe Whale Moves 2.1T Tokens to Fresh Wallet Amid Price Rally", source: "CoinDesk", timeAgo: "1d ago", logo: "https://coin-images.coingecko.com/coins/images/29850/large/pepe-token.jpeg" },
  { symbol: "BEST", token: "Best Wallet", title: "Best Wallet Token Launch: What's Next After the Presale", source: "CryptoNews", timeAgo: "2d ago", logo: "https://coin-images.coingecko.com/coins/images/70874/large/Logo_%283%29.png" },
  { symbol: "SNORT", token: "Snorter", title: "Snorter Hits $5.5M With 3 Days Until Exchange Listings", source: "Blockchain Reporter", timeAgo: "3d ago", logo: "https://coin-images.coingecko.com/coins/images/70353/large/snort_400x400.jpg" },
  { symbol: "T6900", token: "Token6900", title: "TOKEN6900 Set to Explode — Could It Be the Next SPX6900?", source: "CoinSpeaker", timeAgo: "1w ago", logo: "https://coin-images.coingecko.com/coins/images/68913/large/Token6900_Logo_200x200.png" },
  { symbol: "PNDC", token: "Pond Coin", title: "Pond Coin: The Rising Star in the Crypto World", source: "Medium", timeAgo: "1w ago", logo: "https://coin-images.coingecko.com/coins/images/31215/large/pond-coin.jpeg" },
  { symbol: "PORK", token: "PepeFork", title: "PepeFork (PORK): A Meme Coin Forked from Pepe Gains Traction", source: "Bitget Academy", timeAgo: "2w ago", logo: "https://coin-images.coingecko.com/coins/images/34913/large/pork.png" },
];

export const mockBotSummary = [
  { label: "Bots", count: 2847, pct: 23.1, color: "text-destructive" },
  { label: "Humans", count: 8934, pct: 72.5, color: "text-primary" },
  { label: "Unknown", count: 546, pct: 4.4, color: "text-muted-foreground" },
];

export const mockPROutlets = [
  { name: "CoinSpeaker", articles: 8 },
  { name: "Blockchain Reporter", articles: 6 },
  { name: "CoinDesk", articles: 4 },
  { name: "CryptoNews", articles: 4 },
  { name: "99Bitcoins", articles: 3 },
  { name: "AMBCrypto", articles: 3 },
  { name: "Bitget Academy", articles: 2 },
  { name: "Seeking Alpha", articles: 2 },
];
