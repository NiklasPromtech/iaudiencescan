import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Terminal, ShieldCheck, Copy, BookOpen, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateApiKeyDialog } from "@/components/settings/CreateApiKeyDialog";
import { ApiKeyList } from "@/components/settings/ApiKeyList";
import { toast } from "sonner";

const API_BASE_URL = "https://cdn.audiencescan.io/auth";

const AI_PROMPT_BLOCK = `You have read-only access to my AudienceScan analytics data via the API below.

## Authentication
Include the API key as a Bearer token in every request:
  Authorization: Bearer <API_KEY>

## Base URL
${API_BASE_URL}

## Available Endpoints

### GET Scorecard
POST ${API_BASE_URL}/analytics/scorecard
Returns high-level performance metrics (visitors, sessions, conversions, etc.) for the selected date range.

Request body:
{
  "range": {
    "type": "last_full_days",
    "days": 7,
    "timezone": "UTC"
  }
}

### GET Table Breakdown
POST ${API_BASE_URL}/analytics/table
Returns a dimension breakdown table (by source, campaign, country, etc.) for the selected date range.

Request body:
{
  "range": {
    "type": "last_full_days",
    "days": 7,
    "timezone": "UTC"
  },
  "dimension": "source"
}

## Important
- You have READ-ONLY access. No data can be modified, deleted, or written through this API.
- The data returned belongs to the website linked to this API key. You cannot access other websites' data.
- Keep the API key confidential. Anyone with this key can view the analytics data for this website.`;

const ApiKeys = () => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const copyPromptBlock = () => {
    navigator.clipboard.writeText(AI_PROMPT_BLOCK);
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

        {/* Security Notice */}
        <Card className="mb-6 p-4 border border-destructive/30 bg-destructive/5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="text-p2 font-medium text-foreground mb-1">Read-only access</h3>
              <p className="text-p3 text-muted-foreground">
                API keys grant <strong>read-only</strong> access to the analytics data for the linked website. 
                No data can be modified, deleted, or written. However, anyone with the key can view 
                your website's analytics — treat it like a password.
              </p>
            </div>
          </div>
        </Card>

        {/* Key List */}
        <ApiKeyList refreshKey={refreshKey} />

        {/* Copy-paste AI Prompt Block */}
        <Card className="mt-8 p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Copy className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-p1 font-medium text-foreground">Send to your AI</h3>
            </div>
            <Button variant="outline" size="sm" onClick={copyPromptBlock}>
              <Copy className="h-3.5 w-3.5 mr-2" />
              Copy prompt
            </Button>
          </div>
          <p className="text-p3 text-muted-foreground mb-3">
            Copy the block below and paste it into your AI assistant (e.g. ChatGPT, Claude, OpenClaw). 
            Replace <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;API_KEY&gt;</code> with your actual key.
          </p>
          <div className="bg-muted rounded p-3 font-mono text-xs text-foreground overflow-x-auto max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{AI_PROMPT_BLOCK}</pre>
          </div>
        </Card>

        {/* Endpoint Reference */}
        <Card className="mt-4 p-5 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-p1 font-medium text-foreground">Endpoint Reference</h3>
          </div>

          {/* Scorecard */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">POST</span>
              <code className="text-sm text-foreground">/analytics/scorecard</code>
            </div>
            <p className="text-p3 text-muted-foreground mb-2">
              Returns high-level metrics: visitors, sessions, conversions, and more.
            </p>
            <div className="bg-muted rounded p-3 font-mono text-xs text-foreground overflow-x-auto">
              <pre>{`curl ${API_BASE_URL}/analytics/scorecard \\
  -H "Authorization: Bearer as_k_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"range":{"type":"last_full_days","days":7,"timezone":"UTC"}}'`}</pre>
            </div>
          </div>

          {/* Table */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">POST</span>
              <code className="text-sm text-foreground">/analytics/table</code>
            </div>
            <p className="text-p3 text-muted-foreground mb-2">
              Returns a breakdown table by dimension (source, campaign, country, etc.).
            </p>
            <div className="bg-muted rounded p-3 font-mono text-xs text-foreground overflow-x-auto">
              <pre>{`curl ${API_BASE_URL}/analytics/table \\
  -H "Authorization: Bearer as_k_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"range":{"type":"last_full_days","days":7,"timezone":"UTC"},"dimension":"source"}'`}</pre>
            </div>
          </div>
        </Card>

        {/* Security Details */}
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
              <span><strong>Scoped to one website</strong> — each key is locked to the website it was created for. It cannot access other websites' data.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Revocable</strong> — you can revoke a key at any time and it stops working immediately.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-destructive font-bold">•</span>
              <span><strong>Keep it private</strong> — anyone with this key can view your analytics data. Don't share it publicly.</span>
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
