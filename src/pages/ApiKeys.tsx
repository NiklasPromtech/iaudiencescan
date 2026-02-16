import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, ShieldCheck, Copy, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateApiKeyDialog } from "@/components/settings/CreateApiKeyDialog";
import { ApiKeyList } from "@/components/settings/ApiKeyList";
import { toast } from "sonner";

const INFO_ENDPOINT = "https://cdn.audiencescan.io/auth/info";

const buildPrompt = () =>
  `You have read-only access to my AudienceScan analytics. To get started, call the info endpoint with your API key:

curl -H "Authorization: Bearer <API_KEY>" ${INFO_ENDPOINT}

That single request returns every available endpoint, filter, dimension, and workflow you need. Follow the instructions it returns.`;

const ApiKeys = () => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const copyPrompt = () => {
    navigator.clipboard.writeText(buildPrompt());
    toast.success("Copied to clipboard — paste it into your AI assistant");
  };

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

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-h2 text-foreground mb-1">AI Assistant Access</h1>
            <p className="text-p2 text-muted-foreground">
              Generate API keys so external AI tools can read your analytics data.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create API Key
          </Button>
        </div>

        {/* Key List */}
        <ApiKeyList refreshKey={refreshKey} />

        {/* How it works */}
        <Card className="mt-8 p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-p1 font-medium text-foreground">How your AI assistant uses this</h3>
          </div>
          <p className="text-p3 text-muted-foreground mb-4">
            Give your AI assistant the API key and this instruction:
          </p>
          <div className="bg-muted rounded-none p-3 font-mono text-xs text-foreground mb-4">
            <pre className="whitespace-pre-wrap">{`curl -H "Authorization: Bearer YOUR_API_KEY" ${INFO_ENDPOINT}`}</pre>
          </div>
          <p className="text-p3 text-muted-foreground mb-4">
            That single request returns everything it needs — every endpoint, filter, dimension, and workflow.
          </p>
          <Button variant="outline" size="sm" onClick={copyPrompt}>
            <Copy className="h-3.5 w-3.5 mr-2" />
            Copy prompt for AI
          </Button>
        </Card>

        {/* Security */}
        <Card className="mt-4 p-5 border border-border">
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

export default ApiKeys;
