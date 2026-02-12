import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, Copy, RefreshCw, Plus, Globe, ChevronDown, Share2, ArrowRight, FileText, Archive, ArchiveRestore, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSelectedWebsite } from "@/hooks/use-selected-website";
import { supabase } from "@/integrations/supabase/client";
import { listWebsites, createWebsite, verifyWebsite, archiveWebsite, unarchiveWebsite, Website, CreateWebsiteResponse } from "@/lib/api";
import { WebsiteShareDialog } from "@/components/websites/WebsiteShareDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type InstallStatus = "pending" | "verified" | "failed";

const Install = () => {
  const [status, setStatus] = useState<InstallStatus>("pending");
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [trackingSnippet, setTrackingSnippet] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareWebsite, setShareWebsite] = useState<Website | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectWebsite: contextSelectWebsite } = useSelectedWebsite();

  useEffect(() => {
    const fetchWebsites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const response = await listWebsites({ include_archived: showArchived });
        if (response.websites && response.websites.length > 0) {
          setWebsites(response.websites);
          
          const { data: profile } = await supabase
            .from("profiles")
            .select("last_selected_website_id")
            .eq("user_id", user.id)
            .maybeSingle();

          let websiteToSelect = response.websites[0];
          if (profile?.last_selected_website_id) {
            const persisted = response.websites.find(w => w.id === profile.last_selected_website_id);
            if (persisted) {
              websiteToSelect = persisted;
            }
          }
          
          setStatus(websiteToSelect.status);
          localStorage.setItem("selectedWebsiteId", websiteToSelect.id);
          localStorage.setItem("selectedWebsite", JSON.stringify(websiteToSelect));
        }
      } catch (error) {
        console.error("Error fetching websites:", error);
      }
      setLoading(false);
    };

    fetchWebsites();
  }, [navigate, showArchived]);

  const handleArchive = async (website: Website) => {
    try {
      await archiveWebsite(website.id);
      setWebsites(websites.filter(w => w.id !== website.id));
      if (selectedWebsite?.id === website.id) {
        setSelectedWebsite(null);
      }
      toast({
        title: "Website archived",
        description: `${website.name} has been archived.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to archive",
        description: error.message || "Could not archive website",
        variant: "destructive",
      });
    }
  };

  const handleUnarchive = async (website: Website) => {
    try {
      await unarchiveWebsite(website.id);
      setWebsites(websites.map(w => 
        w.id === website.id ? { ...w, archived_at: null } : w
      ));
      toast({
        title: "Website restored",
        description: `${website.name} has been restored.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to restore",
        description: error.message || "Could not restore website",
        variant: "destructive",
      });
    }
  };

  const handleCreateSite = async () => {
    if (!newSiteName.trim()) {
      toast({ title: "Name required", description: "Please enter a name for your webpage.", variant: "destructive" });
      return;
    }
    if (!newSiteUrl.trim()) {
      toast({ title: "URL required", description: "Please enter the base URL for your webpage.", variant: "destructive" });
      return;
    }

    let formattedUrl = newSiteUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setCreating(true);
    try {
      const response: CreateWebsiteResponse = await createWebsite(newSiteName.trim(), formattedUrl);
      const newWebsite = response.website;
      setWebsites([newWebsite, ...websites]);
      setSelectedWebsite(newWebsite);
      setStatus("pending");
      setTrackingSnippet(response.tracking.snippet);
      setShowCreateForm(false);
      setNewSiteName("");
      setNewSiteUrl("");
      toast({ title: "Webpage created", description: "Your tracking tag has been generated." });
    } catch (error: any) {
      toast({
        title: "Error creating site",
        description: `${error.message || "Failed to create website"}. Please contact support at support@audiencescan.io for assistance.`,
        variant: "destructive",
      });
    }
    setCreating(false);
  };

  const handleSelectWebsite = async (website: Website) => {
    if (selectedWebsite?.id === website.id) {
      setSelectedWebsite(null);
      return;
    }
    localStorage.setItem("selectedWebsiteId", website.id);
    localStorage.setItem("selectedWebsite", JSON.stringify(website));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ last_selected_website_id: website.id }).eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Failed to persist website selection:", error);
    }
    setSelectedWebsite(website);
    setStatus(website.status);
    setTrackingSnippet(
      `// Main tracking tag
<script src="https://cdn.audiencescan.io/track.js?id=${website.id}" defer></script>`
    );
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard", description: "The tracking snippet has been copied." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!selectedWebsite) return;
    setVerifying(true);
    try {
      const response = await verifyWebsite(selectedWebsite.id);
      if (response.verification_result.found) {
        setStatus("verified");
        setWebsites(websites.map(w => 
          w.id === selectedWebsite.id 
            ? { ...w, status: "verified" as const, verified_at: response.website.verified_at }
            : w
        ));
        setSelectedWebsite({ ...selectedWebsite, status: "verified", verified_at: response.website.verified_at });
        toast({ title: "Verification successful!", description: "Your tracking script is installed correctly." });
        setTimeout(() => navigate("/overview"), 1500);
      } else {
        toast({
          title: "Not verified yet",
          description: response.verification_result.reason === "meta_tag_not_found" 
            ? "The tracking script was not found on your page."
            : "Make sure the script is installed and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({ title: "Verification failed", description: error.message || "Could not verify installation", variant: "destructive" });
    }
    setVerifying(false);
  };

  const handleDoLater = () => navigate("/overview");

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const activeWebsites = websites.filter(w => !w.archived_at);
  const archivedWebsites = websites.filter(w => w.archived_at);

  // No websites — show create form inside layout
  if ((activeWebsites.length === 0 && archivedWebsites.length === 0) || showCreateForm) {
    return (
      <DashboardLayout>
        <div className="container max-w-lg py-8 px-4">
          <div className="mb-8">
            <h1 className="text-h2 text-foreground mb-2">Websites</h1>
            <p className="text-p1 text-muted-foreground">
              Add a website to start tracking visitor wallets and cohort intel.
            </p>
          </div>

          <Card className="border border-border p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Website name</Label>
                <Input id="name" placeholder="e.g. My DeFi App" value={newSiteName} onChange={(e) => setNewSiteName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Website URL</Label>
                <Input id="url" placeholder="e.g. https://mydefiapp.com" value={newSiteUrl} onChange={(e) => setNewSiteUrl(e.target.value)} />
                <p className="text-p4 text-muted-foreground">We'll check this URL to verify your installation</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={handleCreateSite} disabled={creating}>
                  {creating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create website
                </Button>
                {websites.length > 0 && (
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                )}
              </div>
              {websites.length === 0 && (
                <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleDoLater}>Do this later</Button>
              )}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container max-w-3xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-h2 text-foreground mb-1">Websites</h1>
            <p className="text-p2 text-muted-foreground">
              Manage your tracked websites and tracking installation.
            </p>
          </div>
          <Button size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add website
          </Button>
        </div>

        {/* Website list */}
        <div className="border border-border divide-y divide-border">
          {activeWebsites.map((website) => (
            <WebsiteListItemWithTag
              key={website.id}
              website={website}
              isSelected={selectedWebsite?.id === website.id}
              onSelect={handleSelectWebsite}
              trackingSnippet={website.id === selectedWebsite?.id ? trackingSnippet : `<script src="https://cdn.audiencescan.io/track.js?id=${website.id}" defer></script>`}
              onCopy={handleCopy}
              onVerify={handleVerify}
              copied={copied}
              verifying={verifying}
              onShare={(w) => { setShareWebsite(w); setShareDialogOpen(true); }}
              onGoToData={async (w) => {
                await contextSelectWebsite({
                  id: w.id,
                  name: w.name,
                  base_url: w.base_url,
                  tag_id: w.tag_id,
                  status: w.status,
                });
                navigate("/overview");
              }}
              onArchive={handleArchive}
            />
          ))}
        </div>

        {/* Archived */}
        {showArchived && archivedWebsites.length > 0 && (
          <div className="border border-border divide-y divide-border mt-6 opacity-60">
            <div className="p-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Archived</span>
            </div>
            {archivedWebsites.map((website) => (
              <div key={website.id} className="p-4 flex items-center gap-4">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-p2 font-medium text-muted-foreground truncate">{website.name}</p>
                  <p className="text-p4 text-muted-foreground/70 truncate">{website.base_url}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleUnarchive(website)}>
                  <ArchiveRestore className="h-4 w-4 mr-1" />
                  Restore
                </Button>
              </div>
            ))}
          </div>
        )}

        {(archivedWebsites.length > 0 || showArchived) && (
          <div className="mt-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setShowArchived(!showArchived)}>
              <Archive className="h-4 w-4 mr-2" />
              {showArchived ? "Hide archived" : `Show archived (${archivedWebsites.length})`}
            </Button>
          </div>
        )}
      </div>

      {shareWebsite && (
        <WebsiteShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          websiteId={shareWebsite.id}
          websiteName={shareWebsite.name}
        />
      )}
    </DashboardLayout>
  );
};

// --- Sub-components ---

interface WebsiteListItemWithTagProps {
  website: Website;
  isSelected: boolean;
  onSelect: (website: Website) => void;
  trackingSnippet: string;
  onCopy: (text: string) => void;
  onVerify: () => void;
  copied: boolean;
  verifying: boolean;
  onShare: (website: Website) => void;
  onGoToData: (website: Website) => void;
  onArchive: (website: Website) => void;
}

const WebsiteListItemWithTag = ({ 
  website, isSelected, onSelect, trackingSnippet, onCopy, onVerify, copied, verifying, onShare, onGoToData, onArchive
}: WebsiteListItemWithTagProps) => {
  const [allCopied, setAllCopied] = useState(false);

  const walletTrackingSnippet = `// Track wallet events
AudienceScan.trackWallet(
  'WALLET_ADDRESS',  // e.g. '0x1234...'
  'EVENT_TYPE'       // 'connected' | 'staked' | 'purchased' | 'signed'
);`;

  const conversionEventSnippet = `// Track conversion events (sign up, purchase, etc.)
AudienceScan.trackEvent(
  'EVENT_NAME',     // e.g. 'Signed up', 'Purchase'
  'USER_ID'         // optional: email or user identifier
);

// With additional data:
AudienceScan.trackEvent('Purchase', {
  amount: 99.99,
  currency: 'USD'
});`;

  const generateFullInstructions = () => {
    return `=== AudienceScan Tracking Setup ===

STEP 1: Install Main Tracking Script
-------------------------------------
Add this before </head> in your HTML:

${trackingSnippet}


STEP 2: Track Wallet Events (Recommended)
-----------------------------------------
To get the most out of AudienceScan, track wallet interactions:

${walletTrackingSnippet}


STEP 3: Track Conversion Events (Optional)
------------------------------------------
Call this when users complete key actions:

${conversionEventSnippet}


Need help? Contact support@audiencescan.io`;
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generateFullInstructions());
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const statusConfig: Record<string, { label: string; className: string; dotClass: string }> = {
    pending: { label: "PENDING", className: "border-muted-foreground/30 text-muted-foreground", dotClass: "bg-muted-foreground/60" },
    verified: { label: "VERIFIED", className: "border-primary/50 text-primary", dotClass: "bg-primary" },
    failed: { label: "FAILED", className: "border-destructive/50 text-destructive", dotClass: "bg-destructive" },
  };

  const sc = statusConfig[website.status] || statusConfig.pending;

  return (
    <Collapsible open={isSelected}>
      <CollapsibleTrigger asChild>
        <div
          className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-muted/30 ${isSelected ? "bg-muted/20" : ""}`}
          onClick={() => onSelect(website)}
        >
          <Globe className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-p2 font-medium truncate ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
              {website.name}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground/60 truncate">{website.base_url}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge variant="outline" className={`${sc.className} font-mono text-[10px] tracking-widest h-7 flex items-center`}>
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${sc.dotClass}`} />
              {sc.label}
            </Badge>
            {website.status === "verified" && (
              <Button
                size="sm"
                className="h-7 px-3 font-mono text-[10px] uppercase tracking-widest"
                onClick={(e) => { e.stopPropagation(); onGoToData(website); }}
              >
                Data <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(website); }}>
                  <Share2 className="h-4 w-4 mr-2" />Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(website); }}>
                  <Archive className="h-4 w-4 mr-2" />Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isSelected ? "rotate-180" : ""}`} />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/10">
          <div className="pt-4 space-y-6">

            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-primary border border-primary/30 px-2 py-0.5">STEP 1</span>
                <span className="text-p3 text-foreground font-medium">Install main tracking script</span>
              </div>
              <p className="text-p4 text-muted-foreground">
                Paste before <code className="bg-muted px-1.5 py-0.5 text-p4 font-mono">&lt;/head&gt;</code>
              </p>
              <div className="relative">
                <pre className="bg-foreground text-primary-foreground p-3 pr-12 text-p4 overflow-x-auto whitespace-pre-wrap font-mono">
                  <code>{trackingSnippet}</code>
                </pre>
                <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); onCopy(trackingSnippet); }}>
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Step 2 — highlighted */}
            <div className="space-y-3 p-4 -mx-4 bg-primary/5 border-y border-primary/20 relative overflow-hidden">
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-primary border border-primary/30 px-2 py-0.5">STEP 2</span>
                  <span className="text-p3 text-foreground font-medium">
                    Track wallet events <span className="text-primary font-normal ml-1">(recommended)</span>
                  </span>
                </div>
                <p className="text-p4 text-muted-foreground mt-2 mb-3">
                  Track wallet interactions on your site for richer analytics.
                </p>
                <div className="relative">
                  <pre className="bg-foreground text-primary-foreground p-3 pr-12 text-p4 overflow-x-auto whitespace-pre-wrap font-mono">
                    <code>{walletTrackingSnippet}</code>
                  </pre>
                  <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); onCopy(walletTrackingSnippet); }}>
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground border border-border px-2 py-0.5">STEP 3</span>
                <span className="text-p3 text-foreground font-medium">
                  Track conversion events <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </span>
              </div>
              <div className="relative">
                <pre className="bg-foreground text-primary-foreground p-3 pr-12 text-p4 overflow-x-auto whitespace-pre-wrap font-mono">
                  <code>{conversionEventSnippet}</code>
                </pre>
                <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); onCopy(conversionEventSnippet); }}>
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <Button size="sm" variant="outline" className="w-full font-mono text-[10px] uppercase tracking-widest" onClick={(e) => { e.stopPropagation(); handleCopyAll(); }}>
                {allCopied ? <Check className="mr-2 h-3 w-3" /> : <FileText className="mr-2 h-3 w-3" />}
                Copy all instructions
              </Button>
              <div className="flex gap-3">
                {website.status !== "verified" && (
                  <Button size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); onVerify(); }} disabled={verifying}>
                    {verifying ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
                    Verify installation
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onShare(website); }}>
                  <Share2 className="h-3 w-3 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Install;
