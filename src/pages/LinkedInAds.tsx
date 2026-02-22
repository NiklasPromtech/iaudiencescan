import { ArrowLeft, Bot, User, HelpCircle, Check, X, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/audiencescan-icon.png";

const ads = [
  {
    num: 1,
    headline: "23% of your Web3 traffic is bots",
    body: "We analyzed 4.2 million clicks across 31 Web3 campaigns. Nearly 1 in 4 visitors wasn't human. If you're paying per click, you're lighting money on fire.",
    cta: "Find out your bot rate — free",
    visual: "bot-donut",
  },
  {
    num: 2,
    headline: "We helped a client claim $25,000 back from a publisher",
    body: "Their campaign looked great on paper — 40K clicks, low CPC. Our bot detection showed 38% were non-human. They took the data to the publisher and got a $25K credit.",
    cta: "See how bot detection works",
    visual: "testimonial",
  },
  {
    num: 3,
    headline: "What if your CPA was based on real wallets — not bot clicks?",
    body: "Most Web3 teams report CPA using raw click data. Strip out bots, and your real CPA could be 2–3× higher. Or lower — if you're actually good at this.",
    cta: "Get your real CPA",
    visual: "cpa-compare",
  },
  {
    num: 4,
    headline: "Your token holders also follow these 18 X accounts",
    body: "We scan your on-chain holders, map their social footprint, and surface the exact communities they're in. Target where your buyers already pay attention.",
    cta: "Run your first scan free",
    visual: "x-handles",
  },
  {
    num: 5,
    headline: "It's like Google Analytics — but it actually works for Web3",
    body: "GA can't connect wallets to sessions. It can't detect bots. It can't show you which campaign drove token holders. We can.",
    cta: "Free to start. No credit card.",
    visual: "ga-compare",
  },
  {
    num: 6,
    headline: "Stop optimizing for clicks. Start optimizing for wallets.",
    body: "Clicks don't buy tokens. Wallets do. AudienceScan ties every campaign touchpoint to real wallet activity so you know what's actually working.",
    cta: "See wallet-level analytics",
    visual: "gradient-text",
  },
  {
    num: 7,
    headline: "We found 6 Telegram groups where your next buyers already hang out",
    body: "Our audience scan maps your holders' community memberships. Stop guessing where to post — we'll show you the exact groups with the highest overlap.",
    cta: "Find your communities",
    visual: "telegram-groups",
  },
  {
    num: 8,
    headline: "Free Web3 analytics with bot detection. No, really.",
    body: "Install our pixel, get traffic analytics, bot detection, and wallet tracking — all at $0. Upgrade when you need audience scans and custom queries.",
    cta: "Start free today",
    visual: "pricing",
  },
  {
    num: 9,
    headline: "Your $2,000/mo ad budget? $460 of it goes to bots.",
    body: "That's the average we see across Web3 campaigns. Some are worse. The first step is knowing your number. The second step is fixing it.",
    cta: "Find out how much you're wasting",
    visual: "waste-bar",
  },
  {
    num: 10,
    headline: "Query your own data. Export to CSV. No SQL experience needed.",
    body: "Our query workspace lets you slice your analytics data however you want. Filter by wallet, campaign, date range — then export. Your data, your way.",
    cta: "Try the query workspace",
    visual: "sql-snippet",
  },
];

/* ---------- visual sub-components ---------- */

const BotDonutVisual = () => {
  const data = [
    { label: "Bots", count: 966, pct: 23, color: "hsl(0, 84%, 60%)" },
    { label: "Humans", count: 2814, pct: 67, color: "hsl(var(--primary))" },
    { label: "Unknown", count: 420, pct: 10, color: "hsl(170, 70%, 45%)" },
  ];
  const total = data.reduce((s, d) => s + d.count, 0);
  const r = 36, c = 2 * Math.PI * r;
  let cum = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width="90" height="90" viewBox="0 0 90 90">
        {data.map((d, i) => {
          const pct = d.count / total;
          const dash = pct * c;
          const offset = -cum * c;
          cum += pct;
          return <circle key={i} cx="45" cy="45" r={r} fill="none" stroke={d.color} strokeWidth="9" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={offset} transform="rotate(-90 45 45)" />;
        })}
      </svg>
      <div className="flex flex-col gap-1 text-xs font-mono">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.label}</span>
            <span className="ml-auto tabular-nums text-foreground">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialVisual = () => (
  <div className="border border-border p-4 bg-muted/30">
    <p className="text-sm italic text-muted-foreground">"We took the bot report to the publisher and received a $25,000 credit within 2 weeks."</p>
    <p className="text-xs font-mono text-primary mt-2">— Head of Growth, DeFi Protocol</p>
  </div>
);

const CPACompareVisual = () => (
  <div className="grid grid-cols-2 gap-3 font-mono text-center">
    <div className="border border-border p-3 bg-muted/20">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Reported CPA</p>
      <p className="text-2xl font-bold text-foreground mt-1">$4.20</p>
    </div>
    <div className="border border-primary/50 p-3 bg-primary/5">
      <p className="text-xs text-primary uppercase tracking-widest">Real CPA</p>
      <p className="text-2xl font-bold text-primary mt-1">$6.80</p>
    </div>
  </div>
);

const XHandlesVisual = () => {
  const handles = [
    { name: "@VitalikButerin", followers: "5.2M" },
    { name: "@CryptoCapo_", followers: "812K" },
    { name: "@DefiIgnas", followers: "443K" },
    { name: "@0xMert_", followers: "389K" },
  ];
  return (
    <div className="space-y-1.5 font-mono text-xs">
      {handles.map(h => (
        <div key={h.name} className="flex justify-between border-b border-border/50 pb-1">
          <span className="text-primary">{h.name}</span>
          <span className="text-muted-foreground tabular-nums">{h.followers}</span>
        </div>
      ))}
      <p className="text-muted-foreground text-[10px]">+ 14 more accounts →</p>
    </div>
  );
};

const GACompareVisual = () => (
  <div className="space-y-2 text-sm">
    {[
      { feature: "Wallet ↔ session linking", ga: false, us: true },
      { feature: "Bot detection", ga: false, us: true },
      { feature: "On-chain attribution", ga: false, us: true },
    ].map(row => (
      <div key={row.feature} className="flex items-center gap-3 font-mono text-xs">
        <span className="flex-1 text-muted-foreground">{row.feature}</span>
        <X className="h-3.5 w-3.5 text-destructive" />
        <Check className="h-3.5 w-3.5 text-primary" />
      </div>
    ))}
    <div className="flex justify-end gap-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest pr-0.5">
      <span>GA</span>
      <span>AS</span>
    </div>
  </div>
);

const GradientTextVisual = () => (
  <div className="bg-gradient-primary p-6 flex items-center justify-center">
    <p className="text-2xl font-bold text-white text-center leading-tight">Clicks ≠ Customers.<br />Wallets = Truth.</p>
  </div>
);

const TelegramGroupsVisual = () => {
  const groups = [
    { name: "DeFi Alpha Hunters", members: "18.4K" },
    { name: "Airdrop Strategies", members: "42.1K" },
    { name: "NFT Whales Chat", members: "9.8K" },
  ];
  return (
    <div className="space-y-1.5 font-mono text-xs">
      {groups.map(g => (
        <div key={g.name} className="flex items-center gap-2 border-b border-border/50 pb-1">
          <MessageSquare className="h-3 w-3 text-[hsl(200,80%,55%)]" />
          <span className="text-foreground">{g.name}</span>
          <span className="ml-auto text-muted-foreground tabular-nums">{g.members}</span>
        </div>
      ))}
      <p className="text-muted-foreground text-[10px]">+ 3 more groups →</p>
    </div>
  );
};

const PricingVisual = () => (
  <div className="border border-primary/40 p-4 text-center">
    <p className="text-3xl font-bold font-mono text-primary">$0</p>
    <p className="text-xs text-muted-foreground mt-1 font-mono">/ month</p>
    <div className="mt-3 space-y-1 text-xs text-muted-foreground text-left font-mono">
      {["Traffic analytics", "Bot detection", "Wallet tracking", "Unlimited sessions"].map(f => (
        <div key={f} className="flex items-center gap-2"><Check className="h-3 w-3 text-primary" />{f}</div>
      ))}
    </div>
  </div>
);

const WasteBarVisual = () => (
  <div className="space-y-2">
    <div className="flex h-8 w-full overflow-hidden font-mono text-xs">
      <div className="bg-destructive/80 flex items-center justify-center text-white" style={{ width: "23%" }}>$460</div>
      <div className="bg-primary flex items-center justify-center text-white" style={{ width: "77%" }}>$1,540</div>
    </div>
    <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
      <span>Wasted on bots</span>
      <span>Effective spend</span>
    </div>
  </div>
);

const SQLSnippetVisual = () => (
  <div className="bg-muted/40 border border-border p-3 font-mono text-[11px] text-muted-foreground leading-relaxed">
    <span className="text-primary">SELECT</span> campaign, <span className="text-primary">COUNT</span>(wallet) as holders<br />
    <span className="text-primary">FROM</span> touchpoints<br />
    <span className="text-primary">WHERE</span> event = <span className="text-[hsl(170,70%,45%)]">'token_purchase'</span><br />
    <span className="text-primary">GROUP BY</span> campaign<br />
    <span className="text-primary">ORDER BY</span> holders <span className="text-primary">DESC</span>
  </div>
);

const visualMap: Record<string, React.FC> = {
  "bot-donut": BotDonutVisual,
  testimonial: TestimonialVisual,
  "cpa-compare": CPACompareVisual,
  "x-handles": XHandlesVisual,
  "ga-compare": GACompareVisual,
  "gradient-text": GradientTextVisual,
  "telegram-groups": TelegramGroupsVisual,
  pricing: PricingVisual,
  "waste-bar": WasteBarVisual,
  "sql-snippet": SQLSnippetVisual,
};

/* ---------- main page ---------- */

const LinkedInAds = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold font-bai">LinkedIn Ad Test Concepts</h1>
          <p className="text-xs text-muted-foreground font-mono">10 hooks · internal reference</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {ads.map((ad) => {
          const Visual = visualMap[ad.visual];
          return (
            <div key={ad.num} className="border border-border bg-card flex flex-col">
              {/* LinkedIn post header */}
              <div className="flex items-center gap-3 p-4 pb-2">
                <img src={logoIcon} alt="AudienceScan" className="h-10 w-10 rounded-full object-contain" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">AudienceScan</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Promoted · Ad {ad.num}/10</p>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 pb-3">
                <p className="text-sm font-bold text-foreground mb-1">{ad.headline}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{ad.body}</p>
              </div>

              {/* Visual */}
              <div className="px-4 pb-4">
                {Visual && <Visual />}
              </div>

              {/* CTA */}
              <div className="mt-auto border-t border-border p-4">
                <Button className="w-full" size="sm">
                  {ad.cta}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LinkedInAds;
