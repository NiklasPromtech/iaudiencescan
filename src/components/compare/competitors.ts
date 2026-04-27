export type CellValue = { label: string; ok: boolean };

export type Competitor = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  migrationNote: string;
  rows: {
    walletConnects: CellValue;
    onChainHolders: CellValue;
    cookieless: CellValue;
    cookieBanner: CellValue;
    gdpr: CellValue;
    botFiltering: CellValue;
    clickText: CellValue;
    builtForWeb3: CellValue;
    freeTier: CellValue;
    setupTime: CellValue;
  };
};

const yes = (label = "Yes"): CellValue => ({ label, ok: true });
const no = (label = "No"): CellValue => ({ label, ok: false });

export const audienceScanRows: Competitor["rows"] = {
  walletConnects: yes(),
  onChainHolders: yes(),
  cookieless: yes(),
  cookieBanner: yes("Not needed"),
  gdpr: yes(),
  botFiltering: yes("Built-in"),
  clickText: yes(),
  builtForWeb3: yes(),
  freeTier: yes("20K pageviews / mo"),
  setupTime: yes("Under 5 min"),
};

export const competitors: Competitor[] = [
  {
    slug: "plausible",
    name: "Plausible",
    eyebrow: "Looking at Plausible?",
    tagline: "Privacy-first generic web analytics — no Web3 layer.",
    migrationNote:
      "Migrating from Plausible takes ~5 minutes. Drop in one snippet alongside or instead of Plausible.",
    rows: {
      walletConnects: no(),
      onChainHolders: no(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes("Basic"),
      clickText: no("Manual setup"),
      builtForWeb3: no(),
      freeTier: no("Trial only"),
      setupTime: yes("~5 min"),
    },
  },
  {
    slug: "fathom",
    name: "Fathom",
    eyebrow: "Coming from Fathom?",
    tagline: "Simple privacy analytics — no wallet or on-chain context.",
    migrationNote:
      "Fathom users can switch in minutes. Same drop-in script idea, with Web3 enrichment added.",
    rows: {
      walletConnects: no(),
      onChainHolders: no(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes("Basic"),
      clickText: no("Manual setup"),
      builtForWeb3: no(),
      freeTier: no("Trial only"),
      setupTime: yes("~5 min"),
    },
  },
  {
    slug: "simple-analytics",
    name: "Simple Analytics",
    eyebrow: "Considering Simple Analytics?",
    tagline: "Lightweight privacy analytics — Web2 only.",
    migrationNote:
      "Same simplicity, plus Web3 visibility. Swap the snippet and you're done.",
    rows: {
      walletConnects: no(),
      onChainHolders: no(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes("Basic"),
      clickText: no(),
      builtForWeb3: no(),
      freeTier: no("Trial only"),
      setupTime: yes("~5 min"),
    },
  },
  {
    slug: "matomo",
    name: "Matomo",
    eyebrow: "Evaluating Matomo?",
    tagline: "Powerful but heavy. Self-hosting and Web3 left to you.",
    migrationNote:
      "Skip the server, the upgrades, and the cookie banner. AudienceScan is hosted and Web3-aware.",
    rows: {
      walletConnects: no(),
      onChainHolders: no(),
      cookieless: yes("Optional"),
      cookieBanner: no("Often required"),
      gdpr: yes("With config"),
      botFiltering: yes(),
      clickText: yes("With config"),
      builtForWeb3: no(),
      freeTier: yes("Self-hosted"),
      setupTime: no("Hours"),
    },
  },
  {
    slug: "umami",
    name: "Umami",
    eyebrow: "Looking at Umami?",
    tagline: "Open-source privacy analytics — no Web3 enrichment.",
    migrationNote:
      "Same lightweight feel, with wallet connects and on-chain context added.",
    rows: {
      walletConnects: no(),
      onChainHolders: no(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes("Basic"),
      clickText: no("Manual setup"),
      builtForWeb3: no(),
      freeTier: yes("Self-hosted"),
      setupTime: no("Hours"),
    },
  },
  {
    slug: "cookie3",
    name: "Cookie3",
    eyebrow: "Comparing Cookie3?",
    tagline: "Web3 analytics — different focus and pricing model.",
    migrationNote:
      "Same Web3 lens, with a generous free tier and click-text tracking out of the box.",
    rows: {
      walletConnects: yes(),
      onChainHolders: yes(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes(),
      clickText: no(),
      builtForWeb3: yes(),
      freeTier: no("Limited"),
      setupTime: yes("~10 min"),
    },
  },
  {
    slug: "spindl",
    name: "Spindl",
    eyebrow: "Comparing Spindl?",
    tagline: "Attribution-focused. Lighter on day-to-day analytics.",
    migrationNote:
      "Use AudienceScan for the analytics layer — pageviews, clicks, wallets, all in one place.",
    rows: {
      walletConnects: yes(),
      onChainHolders: yes(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes("Basic"),
      clickText: no(),
      builtForWeb3: yes(),
      freeTier: no("Limited"),
      setupTime: yes("~10 min"),
    },
  },
  {
    slug: "absolute-labs",
    name: "Absolute Labs",
    eyebrow: "Comparing Absolute Labs?",
    tagline: "Enterprise wallet CRM — heavier setup, higher price point.",
    migrationNote:
      "Get wallet visibility without the enterprise contract. Free under 20K pageviews / month.",
    rows: {
      walletConnects: yes(),
      onChainHolders: yes(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes(),
      clickText: no(),
      builtForWeb3: yes(),
      freeTier: no("Enterprise"),
      setupTime: no("Days"),
    },
  },
  {
    slug: "addressable",
    name: "Addressable",
    eyebrow: "Comparing Addressable?",
    tagline: "Web3 ad targeting — narrower scope than full analytics.",
    migrationNote:
      "Run AudienceScan as your analytics base; export wallet audiences when you need them.",
    rows: {
      walletConnects: yes(),
      onChainHolders: yes(),
      cookieless: yes(),
      cookieBanner: yes("Not needed"),
      gdpr: yes(),
      botFiltering: yes(),
      clickText: no(),
      builtForWeb3: yes(),
      freeTier: no("Limited"),
      setupTime: yes("~10 min"),
    },
  },
  {
    slug: "dune",
    name: "Dune Analytics",
    eyebrow: "Coming from Dune?",
    tagline: "On-chain SQL dashboards — no website analytics.",
    migrationNote:
      "Dune covers on-chain. AudienceScan covers the website + wallet bridge in between.",
    rows: {
      walletConnects: yes("On-chain only"),
      onChainHolders: yes(),
      cookieless: yes("N/A"),
      cookieBanner: yes("N/A"),
      gdpr: yes("N/A"),
      botFiltering: no("N/A"),
      clickText: no("N/A"),
      builtForWeb3: yes(),
      freeTier: yes(),
      setupTime: no("SQL skills"),
    },
  },
  {
    slug: "ga4",
    name: "Google Analytics 4",
    eyebrow: "Coming from GA4?",
    tagline: "Generic web analytics — cookies, banners, no Web3 layer.",
    migrationNote:
      "Run alongside GA4 for ~5 minutes, then switch when you're convinced. Your historical GA data stays in Google.",
    rows: {
      walletConnects: no(),
      onChainHolders: no(),
      cookieless: no(),
      cookieBanner: no("Required"),
      gdpr: no("Manual setup"),
      botFiltering: no("Limited"),
      clickText: no(),
      builtForWeb3: no(),
      freeTier: yes("With limits"),
      setupTime: no("Hours"),
    },
  },
];

export const rowOrder: Array<{ key: keyof Competitor["rows"]; label: string }> = [
  { key: "walletConnects", label: "Wallet connects tracked" },
  { key: "onChainHolders", label: "On-chain holder data" },
  { key: "cookieless", label: "Cookieless tracking" },
  { key: "cookieBanner", label: "Cookie banner" },
  { key: "gdpr", label: "GDPR-ready out of the box" },
  { key: "botFiltering", label: "Bot filtering" },
  { key: "clickText", label: "Click-text tracking" },
  { key: "builtForWeb3", label: "Built specifically for Web3" },
  { key: "freeTier", label: "Free tier" },
  { key: "setupTime", label: "Setup time" },
];

export const getCompetitor = (slug: string | null): Competitor =>
  competitors.find((c) => c.slug === slug) ?? competitors[0];
