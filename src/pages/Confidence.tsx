import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import logoWhite from "@/assets/audiencescan-logo-white.png";

interface ChainData {
  p: string;
  c: number;
}

interface SocialData {
  p: string;
  c: number;
}

interface CategoryData {
  n: string;
  c: number;
}

interface ConfidenceData {
  overall?: number;
  components?: {
    dataIntegrity?: number;
    behaviorQuality?: number;
    contextStrength?: number;
  };
}

interface ApiResponse {
  data: {
    chain: ChainData[];
    social: SocialData[];
    categories: CategoryData[];
    confidence: ConfidenceData;
    token: any[];
  };
}

const socialIcons: Record<string, string> = {
  twitter: "X",
  telegram: "send",
  discord: "forum",
  reddit: "reddit",
  youtube: "play_circle",
};

const chainColors: Record<string, string> = {
  ethereum: "#627EEA",
  "binance-smart-chain": "#F3BA2F",
  polygon: "#8247E5",
  avalanche: "#E84142",
  arbitrum: "#28A0F0",
  base: "#0052FF",
  optimism: "#FF0420",
  solana: "#9945FF",
};

const Confidence = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!studyId) return;
      try {
        const response = await fetch(
          `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result: ApiResponse = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/60">Loading scan data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">Error: {error || "No data"}</div>
      </div>
    );
  }

  const topChains = data.chain.slice(0, 10);
  const topSocials = data.social.slice(0, 5);
  const topCategories = data.categories.slice(0, 15);
  const maxChainCount = Math.max(...topChains.map((c) => c.c));
  const maxCategoryCount = Math.max(...topCategories.map((c) => c.c));

  return (
    <div className="min-h-screen bg-black text-white">
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-gradient-to-b from-black via-black/80 to-transparent">
        <img src={logoWhite} alt="AudienceScan" className="h-8" />
        <a
          href="https://app.audiencescan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-full text-sm font-medium transition-colors"
        >
          Launch App
        </a>
      </header>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[180px]" />
      </div>

      {/* Content */}
      <main className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto">
        {/* Overall Confidence */}
        <section className="mb-16 text-center">
          <p className="text-purple-400 text-sm tracking-widest uppercase mb-4">
            Scan Confidence
          </p>
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-4 border-purple-500/30 bg-purple-500/10 mb-6">
            <div className="text-center">
              <span className="text-5xl font-bold text-white">
                {data.confidence?.overall
                  ? Math.round(data.confidence.overall * 100)
                  : "N/A"}
              </span>
              <span className="text-2xl text-purple-400">%</span>
            </div>
          </div>
          <h1 className="text-3xl font-semibold mb-2">Overall Confidence Score</h1>
          <p className="text-white/50 max-w-md mx-auto">
            Based on data integrity, behavior quality, and context strength
          </p>
        </section>

        {/* Confidence Components */}
        {data.confidence?.components && (
          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Confidence Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Data Integrity", value: data.confidence.components.dataIntegrity, icon: "verified" },
                { label: "Behavior Quality", value: data.confidence.components.behaviorQuality, icon: "psychology" },
                { label: "Context Strength", value: data.confidence.components.contextStrength, icon: "hub" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
                >
                  <span className="material-icons-outlined text-purple-400 text-3xl mb-3">
                    {item.icon}
                  </span>
                  <div className="text-3xl font-bold mb-1">
                    {item.value ? Math.round(item.value * 100) : "N/A"}%
                  </div>
                  <p className="text-white/50 text-sm">{item.label}</p>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${(item.value || 0) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Presence */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-purple-400">share</span>
            Social Presence
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {topSocials.map((social) => (
              <div
                key={social.p}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex items-center gap-3"
              >
                <span className="material-icons-outlined text-2xl text-purple-400">
                  {socialIcons[social.p] || "public"}
                </span>
                <div>
                  <p className="capitalize font-medium">{social.p === "twitter" ? "X (Twitter)" : social.p}</p>
                  <p className="text-white/50 text-sm">{social.c.toFixed(1)}% coverage</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chain Distribution */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-purple-400">link</span>
            Chain Distribution
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="space-y-4">
              {topChains.map((chain) => {
                const percentage = (chain.c / maxChainCount) * 100;
                const color = chainColors[chain.p] || "#a855f7";
                return (
                  <div key={chain.p} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-white/70 capitalize truncate">
                      {chain.p.replace(/-/g, " ")}
                    </div>
                    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm text-white/50">
                      {chain.c.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-purple-400">category</span>
            Top Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {topCategories.map((category) => {
              const intensity = (category.c / maxCategoryCount) * 0.8 + 0.2;
              return (
                <div
                  key={category.n}
                  className="px-4 py-2 rounded-full border transition-all hover:scale-105"
                  style={{
                    backgroundColor: `rgba(168, 85, 247, ${intensity * 0.3})`,
                    borderColor: `rgba(168, 85, 247, ${intensity * 0.5})`,
                  }}
                >
                  <span className="text-sm font-medium">{category.n}</span>
                  <span className="text-xs text-white/50 ml-2">{category.c.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="text-center">
          <div className="inline-flex gap-8 bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
            <div>
              <p className="text-2xl font-bold text-purple-400">{data.token?.length || 0}</p>
              <p className="text-white/50 text-sm">Tokens Analyzed</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-purple-400">{data.chain?.length || 0}</p>
              <p className="text-white/50 text-sm">Chains Detected</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-purple-400">{data.categories?.length || 0}</p>
              <p className="text-white/50 text-sm">Categories Found</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Confidence;
