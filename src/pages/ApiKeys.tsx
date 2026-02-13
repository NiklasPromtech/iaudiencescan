import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Key, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateApiKeyDialog } from "@/components/settings/CreateApiKeyDialog";
import { ApiKeyList } from "@/components/settings/ApiKeyList";

const SUPABASE_URL = "https://wksyyydmgpcaxdijalqf.supabase.co";

const ApiKeys = () => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const proxyBaseUrl = `${SUPABASE_URL}/functions/v1/api-proxy`;

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
              Generate API keys so external AI tools can query your data.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create API Key
          </Button>
        </div>

        {/* Key List */}
        <ApiKeyList refreshKey={refreshKey} />

        {/* Usage Instructions */}
        <Card className="mt-8 p-5 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-p1 font-medium text-foreground">How to use</h3>
          </div>
          <p className="text-p3 text-muted-foreground mb-3">
            Give your API key to your AI assistant (e.g. OpenClaw). It will make
            authenticated requests to your data using:
          </p>
          <div className="bg-muted rounded p-3 font-mono text-xs text-foreground overflow-x-auto">
            <pre>{`curl ${proxyBaseUrl}/analytics/scorecard \\
  -H "Authorization: Bearer as_k_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"tag_id":"YOUR_TAG_ID","range":{"type":"last_full_days","days":7,"timezone":"UTC"}}'`}</pre>
          </div>
          <p className="text-p4 text-muted-foreground mt-3">
            Supported endpoints: <code>/analytics/scorecard</code>,{" "}
            <code>/analytics/table</code>, <code>/analytics/bots</code>,{" "}
            <code>/analytics/tracking-status/*</code>
          </p>
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
