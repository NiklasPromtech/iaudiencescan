import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, ShieldCheck, Copy, Terminal, Key, Bot, Chrome, ExternalLink, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateApiKeyDialog } from "@/components/settings/CreateApiKeyDialog";
import { ApiKeyList } from "@/components/settings/ApiKeyList";
import { toast } from "sonner";

const INFO_ENDPOINT = "https://cdn.audiencescan.io/auth/info";
const TELEGRAM_BOT = "@AudienceScanAnalyticsBot";
const TELEGRAM_BOT_URL = "https://t.me/AudienceScanAnalyticsBot";

const buildPrompt = () =>
  `You have read-only access to my AudienceScan analytics. To get started, call the info endpoint with your API key:

curl -H "Authorization: Bearer <API_KEY>" ${INFO_ENDPOINT}

That single request returns every available endpoint, filter, dimension, and workflow you need. Follow the instructions it returns.`;

type Section = "ai" | "telegram" | "extension" | null;

const Integrations = () => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expanded, setExpanded] = useState<Section>(null);

  const copyPrompt = () => {
    navigator.clipboard.writeText(buildPrompt());
    toast.success("Copied to clipboard — paste it into your AI assistant");
  };

  const toggle = (s: Section) => setExpanded((prev) => (prev === s ? null : s));

  return (
    <DashboardLayout>
      <div className="container max-w-3xl py-8 px-4">
        {/* Header */}
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </button>

        <div className="mb-8">
          <h1 className="text-h2 text-foreground mb-1">Integrations</h1>
          <p className="text-p2 text-muted-foreground">
            Connect external tools to your AudienceScan data.
          </p>
        </div>

        <div className="space-y-3">
          {/* ── AI Assistant Card ── */}
          <Card
            className="border border-border overflow-hidden cursor-pointer transition-colors hover:border-primary/30"
            onClick={() => toggle("ai")}
          >
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Key className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-p1 font-medium text-foreground">AI Assistant</h3>
                <p className="text-p3 text-muted-foreground">
                  Generate API keys so AI tools like ChatGPT or Claude can read your analytics.
                </p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === "ai" ? "rotate-90" : ""}`}
              />
            </div>

            {expanded === "ai" && (
              <div className="border-t border-border px-4 py-5 space-y-5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <p className="text-p2 text-muted-foreground">Your API keys</p>
                  <Button onClick={() => setCreateOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
                <ApiKeyList refreshKey={refreshKey} />

                {/* How it works */}
                <div className="border border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-p2 font-medium text-foreground">How it works</h4>
                  </div>
                  <p className="text-p3 text-muted-foreground mb-3">
                    Give your AI assistant the API key and this instruction:
                  </p>
                  <div className="bg-muted p-3 font-mono text-xs text-foreground mb-3">
                    <pre className="whitespace-pre-wrap">{`curl -H "Authorization: Bearer YOUR_API_KEY" ${INFO_ENDPOINT}`}</pre>
                  </div>
                  <p className="text-p3 text-muted-foreground mb-3">
                    That single request returns everything it needs — every endpoint, filter, dimension, and workflow.
                  </p>
                  <Button variant="outline" size="sm" onClick={copyPrompt}>
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy prompt for AI
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* ── Telegram Bot Card ── */}
          <Card
            className="border border-border overflow-hidden cursor-pointer transition-colors hover:border-primary/30"
            onClick={() => toggle("telegram")}
          >
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Bot className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-p1 font-medium text-foreground">Telegram Bot</h3>
                <p className="text-p3 text-muted-foreground">
                  Get analytics and alerts directly in Telegram via {TELEGRAM_BOT}.
                </p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === "telegram" ? "rotate-90" : ""}`}
              />
            </div>

            {expanded === "telegram" && (
              <div className="border-t border-border px-4 py-5 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-p1 font-mono text-primary font-bold mt-0.5">1</span>
                    <p className="text-p2 text-foreground">
                      Open the bot in Telegram and tap <strong>Start</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-p1 font-mono text-primary font-bold mt-0.5">2</span>
                    <p className="text-p2 text-foreground">
                      Send an API key (create one in the AI Assistant section above) to link your account.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-p1 font-mono text-primary font-bold mt-0.5">3</span>
                    <p className="text-p2 text-foreground">
                      Ask questions about your analytics — the bot has the same read access as your AI assistant.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    Open {TELEGRAM_BOT}
                  </a>
                </Button>
              </div>
            )}
          </Card>

          {/* ── Browser Extension Card ── */}
          <Card
            className="border border-border overflow-hidden cursor-pointer transition-colors hover:border-primary/30"
            onClick={() => toggle("extension")}
          >
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Chrome className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-p1 font-medium text-foreground">Browser Extension</h3>
                <p className="text-p3 text-muted-foreground">
                  See AudienceScan data while browsing — overlay analytics on any page.
                </p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === "extension" ? "rotate-90" : ""}`}
              />
            </div>

            {expanded === "extension" && (
              <div className="border-t border-border px-4 py-5 space-y-3" onClick={(e) => e.stopPropagation()}>
                <p className="text-p2 text-muted-foreground">
                  Download and install the AudienceScan browser extension for Chrome, Brave, Arc, or any Chromium browser.
                </p>
                <p className="text-p3 text-muted-foreground italic">
                  Download link coming soon.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Security */}
        <Card className="mt-8 p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-p1 font-medium text-foreground">Security</h3>
          </div>
          <ul className="space-y-2 text-p3 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Read-only</strong> — API keys cannot modify, delete, or write any data.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Scoped to one website</strong> — each key is locked to the website it was created for.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Revocable</strong> — revoke a key at any time and it stops working immediately.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-destructive font-bold">•</span>
              <span><strong>Keep it private</strong> — anyone with this key can view your analytics data.</span>
            </li>
          </ul>
        </Card>

        <CreateApiKeyDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Integrations;
