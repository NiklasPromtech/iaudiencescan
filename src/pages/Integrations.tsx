import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, ShieldCheck, Copy, Terminal, Key, Bot, Chrome, ExternalLink, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateApiKeyDialog } from "@/components/settings/CreateApiKeyDialog";
import { ApiKeyList } from "@/components/settings/ApiKeyList";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
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
  const { selectedWebsite } = useSelectedWebsite();
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [expanded, setExpanded] = useState<Section>(null);

  const copyPrompt = () => {
    navigator.clipboard.writeText(buildPrompt());
    toast.success("Copied to clipboard — paste it into your AI assistant");
  };

  const copyTagId = () => {
    if (selectedWebsite?.tag_id) {
      navigator.clipboard.writeText(selectedWebsite.tag_id);
      toast.success("Tag ID copied to clipboard");
    }
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

        {/* Website Tag ID */}
        {selectedWebsite?.tag_id && (
          <Card className="mb-6 p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-p3 text-muted-foreground mb-0.5">Website Tag ID</p>
                <p className="font-mono text-sm text-foreground">{selectedWebsite.tag_id}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyTagId}>
                <Copy className="h-3.5 w-3.5 mr-2" />
                Copy
              </Button>
            </div>
          </Card>
        )}

        {/* API Keys — free-standing */}
        <Card className="mb-6 border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-p1 font-medium text-foreground">API Keys</h3>
            </div>
            <Button onClick={() => setCreateOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>
          <p className="text-p3 text-muted-foreground mb-4">
            API keys are used by all integrations below — AI assistants, Telegram bot, and the browser extension.
          </p>
          <ApiKeyList refreshKey={refreshKey} />
        </Card>

        <div className="space-y-3">
          {/* ── AI Assistant Card ── */}
          <Card
            className="border border-border overflow-hidden cursor-pointer transition-colors hover:border-primary/30"
            onClick={() => toggle("ai")}
          >
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Terminal className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-p1 font-medium text-foreground">AI Assistant</h3>
                <p className="text-p3 text-muted-foreground">
                  Use an API key with ChatGPT, Claude, or any AI tool to query your analytics.
                </p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === "ai" ? "rotate-90" : ""}`}
              />
            </div>

            {expanded === "ai" && (
              <div className="border-t border-border px-4 py-5 space-y-4" onClick={(e) => e.stopPropagation()}>
                <p className="text-p3 text-muted-foreground">
                  Give your AI assistant an API key and this instruction:
                </p>
                <div className="bg-muted p-3 font-mono text-xs text-foreground">
                  <pre className="whitespace-pre-wrap">{`curl -H "Authorization: Bearer YOUR_API_KEY" ${INFO_ENDPOINT}`}</pre>
                </div>
                <p className="text-p3 text-muted-foreground">
                  That single request returns everything it needs — every endpoint, filter, dimension, and workflow.
                </p>
                <Button variant="outline" size="sm" onClick={copyPrompt}>
                  <Copy className="h-3.5 w-3.5 mr-2" />
                  Copy prompt for AI
                </Button>
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
                <p className="text-p2 font-medium text-foreground">Direct messages</p>
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
                      Send an API key to link your account.
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

                <div className="border-t border-border pt-4">
                  <p className="text-p2 font-medium text-foreground mb-3">Private groups</p>
                  <p className="text-p2 text-foreground mb-2">
                    The bot can also be invited to closed private groups. To activate it, type:
                  </p>
                  <div className="bg-muted p-3 font-mono text-xs text-foreground mb-2">
                    /setkey [your API key]
                  </div>
                  <p className="text-p2 text-foreground mb-3">
                    Then for any question about your analytics, mention <strong>{TELEGRAM_BOT}</strong> followed by your question.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(TELEGRAM_BOT);
                      toast.success("Handle copied to clipboard");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy handle {TELEGRAM_BOT}
                  </Button>
                  <div className="mt-4 p-3 border border-destructive/30 bg-destructive/5 rounded-md">
                    <p className="text-p3 text-destructive">
                      <strong>Security note:</strong> Only use <code>/setkey</code> in groups you trust. The API key is visible in chat and can be copied by any group member. After the bot confirms the connection, delete the message containing your key.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* ── Browser Extension Card ── */}
          <Card
            id="extension"
            className="border border-border overflow-hidden cursor-pointer transition-colors hover:border-primary/30 scroll-mt-24"
            onClick={() => toggle("extension")}
          >
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">
                <Chrome className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-p1 font-medium text-foreground">Browser Extension</h3>
                <p className="text-p3 text-muted-foreground">
                  Overlay live click counts on every button while you browse your own site.
                </p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-muted-foreground transition-transform ${expanded === "extension" ? "rotate-90" : ""}`}
              />
            </div>

            {expanded === "extension" && (
              <div className="border-t border-border px-4 py-5 space-y-4" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" onClick={handleDownloadExtension} disabled={downloading}>
                  <Download className="h-3.5 w-3.5 mr-2" />
                  {downloading ? "Downloading…" : "Download extension (.zip)"}
                </Button>

                <div className="space-y-3">
                  {[
                    "Unzip the file somewhere stable — don't unzip then delete. Chrome loads the extension from that folder.",
                    <>Open <code className="font-mono text-xs bg-muted px-1.5 py-0.5">chrome://extensions</code> in Chrome.</>,
                    "Toggle Developer mode on in the top-right.",
                    <>Click <strong>Load unpacked</strong> and select the <code className="font-mono text-xs bg-muted px-1.5 py-0.5">audiencescan-extension</code> folder.</>,
                    <>Pin the extension, open the popup, and paste your <strong>API key</strong> and <strong>Tag ID</strong> (shown above).</>,
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-p1 font-mono text-primary font-bold mt-0.5">{i + 1}</span>
                      <p className="text-p2 text-foreground">{step}</p>
                    </div>
                  ))}
                </div>

                <p className="text-p3 text-muted-foreground italic">
                  Works in all Chromium browsers (Chrome, Brave, Arc, Edge). One-click Chrome Web Store install coming soon.
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
