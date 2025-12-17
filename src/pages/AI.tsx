import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Mock scan context for demo
const mockScanContext = {
  scan_summary: {
    scan_id: "demo_abc123",
    created_at: "2025-12-17",
    target: { type: "token", value: "IOTX" },
    sample_size: { tokens: 120, totalUniqueWalletsTransacted: 4800 }
  },
  confidence: {
    overall: 0.74,
    components: { dataIntegrity: 0.78, behaviorQuality: 0.63, contextStrength: 0.71 },
    diagnostics: { sourceCoverage: { both: 80, onlyCG: 20, onlyCMC: 15, neither: 5 } }
  },
  chain_top: [
    { p: "ethereum", c: 691 },
    { p: "polygon", c: 423 },
    { p: "arbitrum", c: 287 }
  ],
  social_top: [
    { p: "twitter", c: 719 },
    { p: "telegram", c: 534 },
    { p: "discord", c: 312 }
  ],
  categories_top: [
    { n: "DeFi", c: 273 },
    { n: "DePIN", c: 198 },
    { n: "AI Agents", c: 156 }
  ],
  token_shortlist: [
    {
      ticker: "IOTX",
      logo: "https://assets.coingecko.com/coins/images/3334/small/iotex-logo.png",
      socials: { x: "iotex_io", telegram: "IoTeXGroup", reddit: "IoTeX", youtube: "", discord: "" },
      tags: ["DePIN", "AI Agents", "Ethereum Ecosystem"],
      activity: { uniqueWalletsTransacted: 120, transactionsPerWallet: 1.4, activitySpanDays: 124, chainCoherence: 0.71 },
      confidence: {
        overall: 0.67,
        components: { dataIntegrity: 0.82, behaviorQuality: 0.54, contextStrength: 0.65 },
        signals: { sourceCoverage: "both", sourceAgreement: 0.83, identityConsistency: 0.75 }
      }
    },
    {
      ticker: "FET",
      logo: "https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg",
      socials: { x: "Fetch_ai", telegram: "fetch_ai", reddit: "FetchAI_Community", youtube: "", discord: "fetchai" },
      tags: ["AI Agents", "DeFi", "Ethereum Ecosystem"],
      activity: { uniqueWalletsTransacted: 98, transactionsPerWallet: 2.1, activitySpanDays: 89, chainCoherence: 0.68 },
      confidence: {
        overall: 0.72,
        components: { dataIntegrity: 0.79, behaviorQuality: 0.61, contextStrength: 0.76 },
        signals: { sourceCoverage: "both", sourceAgreement: 0.91, identityConsistency: 0.82 }
      }
    }
  ]
};

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm AudienceScan Signal. I can help you turn your scan data into a concrete marketing strategy using the AudienceScan Strategy Playbook.\n\nI can see you have scan data loaded with **120 tokens** from **4,800 unique wallets**. The overall confidence is **74%** which is solid.\n\nWhat would you like to know? For example:\n- Which playbook steps should I prioritize?\n- What channels look strongest for this audience?\n- Which tokens should I focus on for partnerships?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response (demo mode)
    setTimeout(() => {
      const response = generateDemoResponse(userMessage);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const generateDemoResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes("prioritize") || q.includes("playbook") || q.includes("steps")) {
      return `Based on your scan data, here's my prioritized recommendation:\n\n**High Priority (Strong signals)**\n1. **X Advertising** - 719 tokens have X presence, highest social signal\n2. **Telegram Campaigns** - 534 tokens with Telegram, second strongest channel\n3. **KOL Outreach** - DePIN and AI Agents categories are hot, good KOL ecosystem\n\n**Medium Priority**\n4. **Google/DV360** - Can target crypto-intent audiences broadly\n5. **Reddit Campaigns** - Some presence but not dominant\n\n**Skip for now**\n- YouTube campaigns (weak signal in this scan)\n- Discord-focused outreach (312 is relatively low)\n\nWant me to drill into any of these?`;
    }
    
    if (q.includes("channel") || q.includes("strongest") || q.includes("platform")) {
      return `**Channel Analysis from your scan:**\n\n| Channel | Signal Strength | Recommendation |\n|---------|-----------------|----------------|\n| X/Twitter | 🟢 719 tokens | Primary channel - run ads + DMs |\n| Telegram | 🟢 534 tokens | Strong - run ads + community outreach |\n| Discord | 🟡 312 tokens | Secondary - monitor, don't lead with |\n| Reddit | 🟡 Moderate | Worth testing with r/CryptoCurrency |\n| YouTube | 🔴 Weak | Skip unless budget allows |\n\nYour audience is clearly **X and Telegram heavy**. I'd allocate 60% of effort to X, 30% to Telegram, 10% to testing other channels.`;
    }
    
    if (q.includes("token") || q.includes("partner") || q.includes("focus")) {
      return `**Top tokens to focus on for partnerships:**\n\n1. **$IOTX** (IoTeX)\n   - Confidence: 67% ✓\n   - Strong X presence (@iotex_io)\n   - Tags: DePIN, AI Agents\n   - Why: High wallet overlap, active community\n\n2. **$FET** (Fetch.ai)\n   - Confidence: 72% ✓\n   - Active across X, Telegram, Discord\n   - Tags: AI Agents, DeFi\n   - Why: Higher confidence score, strong socials\n\n**Outreach approach:**\n- Start with community managers, not founders\n- Reference the wallet overlap data as conversation starter\n- Propose co-marketing, not token swaps initially`;
    }
    
    if (q.includes("confidence") || q.includes("reliable") || q.includes("trust")) {
      return `**Confidence breakdown for this scan:**\n\n**Overall: 74%** - This is solid, you can act on these signals.\n\n| Component | Score | Meaning |\n|-----------|-------|--------|\n| Data Integrity | 78% | Source data is clean |\n| Behavior Quality | 63% | Some noise in wallet patterns |\n| Context Strength | 71% | Good category/chain coherence |\n\n**Source coverage:**\n- 80% tokens found in both CoinGecko + CMC ✓\n- 20% only in CoinGecko\n- 15% only in CMC\n- 5% in neither (low-cap or new)\n\n**Bottom line:** Trust the top signals. Be cautious with tokens showing <60% individual confidence.`;
    }
    
    return `I can help you with:\n\n1. **Playbook prioritization** - Which of the 10 steps to run based on your data\n2. **Channel analysis** - Where your audience is most active\n3. **Token partnerships** - Which projects to approach first\n4. **Confidence interpretation** - How much to trust each signal\n\nWhat would you like to explore?`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-4 flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col max-w-5xl">
          {/* Header */}
          <div className="text-center py-6 border-b border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">AudienceScan Signal</h1>
            </div>
            <p className="text-white/50 text-sm">On-chain strategy assistant for Web3 marketing teams</p>
          </div>

          {/* Scan Context Summary */}
          <div className="py-4 border-b border-white/10">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-white/50">Target:</span>{" "}
                <span className="text-white font-medium">${mockScanContext.scan_summary.target.value}</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-white/50">Tokens:</span>{" "}
                <span className="text-white font-medium">{mockScanContext.scan_summary.sample_size.tokens}</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-white/50">Wallets:</span>{" "}
                <span className="text-white font-medium">{mockScanContext.scan_summary.sample_size.totalUniqueWalletsTransacted.toLocaleString()}</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
                <span className="text-white/50">Confidence:</span>{" "}
                <span className="text-violet-300 font-medium">{(mockScanContext.confidence.overall * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0 py-4">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-white/5 border border-white/10 text-white/90"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content.split('\n').map((line, idx) => {
                          // Simple markdown-like rendering
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={idx} className="font-semibold text-white">{line.slice(2, -2)}</p>;
                          }
                          if (line.includes('**')) {
                            const parts = line.split(/\*\*(.*?)\*\*/g);
                            return (
                              <p key={idx}>
                                {parts.map((part, pIdx) => 
                                  pIdx % 2 === 1 ? <strong key={pIdx} className="text-white">{part}</strong> : part
                                )}
                              </p>
                            );
                          }
                          if (line.startsWith('|')) {
                            return <p key={idx} className="font-mono text-xs text-white/70">{line}</p>;
                          }
                          if (line.startsWith('- ')) {
                            return <p key={idx} className="pl-2">• {line.slice(2)}</p>;
                          }
                          if (line.match(/^\d+\./)) {
                            return <p key={idx} className="pl-2">{line}</p>;
                          }
                          return <p key={idx}>{line || '\u00A0'}</p>;
                        })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask about your scan data..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-violet-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-center text-white/30 text-xs mt-3">
              Demo mode • Responses are simulated
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AI;
