import { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/audiencescan-signal`;

const AI = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = useCallback(async (
    messagesToSend: Message[],
    onDelta: (deltaText: string) => void,
    onDone: () => void
  ) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: messagesToSend,
        scanContext: mockScanContext 
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        throw new Error("Rate limits exceeded. Please try again later.");
      }
      if (resp.status === 402) {
        throw new Error("Payment required. Please add funds to continue.");
      }
      throw new Error(errorData.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat(
        [...messages, userMsg],
        (chunk) => upsertAssistant(chunk),
        () => setIsLoading(false)
      );
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
      });
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      // Bold text
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
      // Table rows
      if (line.startsWith('|')) {
        return <p key={idx} className="font-mono text-xs text-white/70">{line}</p>;
      }
      // List items
      if (line.startsWith('- ')) {
        return <p key={idx} className="pl-2">• {line.slice(2)}</p>;
      }
      // Numbered lists
      if (line.match(/^\d+\./)) {
        return <p key={idx} className="pl-2">{line}</p>;
      }
      // Headers
      if (line.startsWith('### ')) {
        return <p key={idx} className="font-semibold text-white mt-2">{line.slice(4)}</p>;
      }
      if (line.startsWith('## ')) {
        return <p key={idx} className="font-bold text-white mt-3">{line.slice(3)}</p>;
      }
      return <p key={idx}>{line || '\u00A0'}</p>;
    });
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
                {messages.length === 0 && (
                  <div className="text-center py-12 text-white/40">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Ask me about your scan data</p>
                    <p className="text-sm">Try: "Which playbook steps should I prioritize?"</p>
                  </div>
                )}
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
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-white/5 border border-white/10 text-white/90"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {renderMessageContent(message.content)}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
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
              Powered by Lovable AI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AI;
