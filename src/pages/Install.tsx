import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, Copy, RefreshCw, Users, Wallet, Tags, Coins, Plus, Globe, ChevronDown, Share2, ArrowRight, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { listWebsites, createWebsite, verifyWebsite, Website, CreateWebsiteResponse } from "@/lib/api";
import { WebsiteShareDialog } from "@/components/websites/WebsiteShareDialog";

type InstallStatus = "pending" | "verified" | "failed";

const Install = () => {
  const [status, setStatus] = useState<InstallStatus>("pending");
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [trackingSnippet, setTrackingSnippet] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareWebsite, setShareWebsite] = useState<Website | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user's websites on mount
  useEffect(() => {
    const fetchWebsites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const response = await listWebsites();
        if (response.websites && response.websites.length > 0) {
          setWebsites(response.websites);
          
          // Check for persisted selection in database
          const { data: profile } = await supabase
            .from("profiles")
            .select("last_selected_website_id")
            .eq("user_id", user.id)
            .maybeSingle();

          // Find the persisted website or fall back to first
          let websiteToSelect = response.websites[0];
          if (profile?.last_selected_website_id) {
            const persisted = response.websites.find(w => w.id === profile.last_selected_website_id);
            if (persisted) {
              websiteToSelect = persisted;
            }
          }
          
          // Don't auto-expand any website - keep all collapsed by default
          // Just store in localStorage for other pages
          setStatus(websiteToSelect.status);
          localStorage.setItem("selectedWebsiteId", websiteToSelect.id);
          localStorage.setItem("selectedWebsite", JSON.stringify(websiteToSelect));
        }
      } catch (error) {
        console.error("Error fetching websites:", error);
        // If API fails, show create form
      }
      setLoading(false);
    };

    fetchWebsites();
  }, [navigate]);

  const handleCreateSite = async () => {
    if (!newSiteName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your webpage.",
        variant: "destructive",
      });
      return;
    }

    if (!newSiteUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter the base URL for your webpage.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
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
      
      toast({
        title: "Webpage created",
        description: "Your tracking tag has been generated.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create website";
      toast({
        title: "Error creating site",
        description: `${errorMessage}. Please contact support at support@audiencescan.io for assistance.`,
        variant: "destructive",
      });
    }
    setCreating(false);
  };

  const tagId = selectedWebsite?.tag_id || "";

  // GTM snippet using the tag_id
  const gtmSnippet = `<script>
  window.asLayer = window.asLayer || [];
  window.asLayer.push({
    'as.siteId': '${selectedWebsite?.id || ""}',
    'as.tagId': '${tagId}',
    'as.start': new Date().getTime()
  });
</script>`;

  const handleSelectWebsite = async (website: Website) => {
    // Toggle: if clicking the already-selected website, collapse it
    if (selectedWebsite?.id === website.id) {
      setSelectedWebsite(null);
      return;
    }

    // Store selected website in localStorage for overview page
    localStorage.setItem("selectedWebsiteId", website.id);
    localStorage.setItem("selectedWebsite", JSON.stringify(website));
    
    // Persist to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ last_selected_website_id: website.id })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Failed to persist website selection:", error);
    }
    
    // Expand and show code/share options
    setSelectedWebsite(website);
    setStatus(website.status);
    setTrackingSnippet(
      `<script src="https://cdn.audiencescan.io/track.js" data-site-id="${website.id}" defer></script>`
    );
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The tracking snippet has been copied.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (!selectedWebsite) return;
    
    setVerifying(true);
    try {
      const response = await verifyWebsite(selectedWebsite.id);
      
      if (response.verification_result.found) {
        setStatus("verified");
        // Update the website in our local state
        setWebsites(websites.map(w => 
          w.id === selectedWebsite.id 
            ? { ...w, status: "verified" as const, verified_at: response.website.verified_at }
            : w
        ));
        setSelectedWebsite({ 
          ...selectedWebsite, 
          status: "verified", 
          verified_at: response.website.verified_at 
        });
        toast({
          title: "Verification successful!",
          description: "Your tracking script is installed correctly.",
        });
        // Auto-redirect to overview after successful verification
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
      toast({
        title: "Verification failed",
        description: error.message || "Could not verify installation",
        variant: "destructive",
      });
    }
    setVerifying(false);
  };

  const handleDoLater = () => {
    navigate("/overview");
  };

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-muted-foreground/60" />
            Pending verification
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="outline" className="border-primary/50 text-primary">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
            Verified
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="border-destructive/50 text-destructive">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-destructive" />
            Verification failed
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // No websites yet - show create form
  if (websites.length === 0 || showCreateForm) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container max-w-lg py-12 px-4">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-h2 text-foreground mb-3">
              Add your website
            </h1>
            <p className="text-p1 text-muted-foreground">
              Enter your website details to start tracking visitor wallets and cohort intel.
            </p>
          </div>

          <Card className="border border-border shadow-elegant p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Website name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. My DeFi App"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Website URL *</Label>
                <Input
                  id="url"
                  placeholder="e.g. https://mydefiapp.com"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                />
                <p className="text-p4 text-muted-foreground">
                  We'll check this URL to verify your installation
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleCreateSite}
                  disabled={creating}
                >
                  {creating ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  Create website
                </Button>
                {websites.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              {websites.length === 0 && (
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={handleDoLater}
                >
                  Do this later
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-3xl py-12 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            {getStatusBadge()}
          </div>
          <h1 className="text-h2 text-foreground mb-3">
            Install AudienceScan Tracking
          </h1>
          <p className="text-p1 text-muted-foreground">
            Install the script to start capturing visitor wallets and cohort intel.
          </p>
        </div>

        {/* Your Websites Section - with integrated installation instructions */}
        {websites.length > 0 && (
          <Card className="border border-border shadow-elegant mb-8">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-p1 font-medium text-foreground">Your Websites</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add new
              </Button>
            </div>
            <div className="divide-y divide-border">
              {websites.map((website) => (
                <WebsiteListItemWithTag
                  key={website.id}
                  website={website}
                  isSelected={selectedWebsite?.id === website.id}
                  onSelect={handleSelectWebsite}
                  trackingSnippet={website.id === selectedWebsite?.id ? trackingSnippet : `<script src="https://cdn.audiencescan.io/track.js" data-site-id="${website.id}" defer></script>`}
                  gtmSnippet={`<script>
  window.asLayer = window.asLayer || [];
  window.asLayer.push({
    'as.siteId': '${website.id}',
    'as.tagId': '${website.tag_id}',
    'as.start': new Date().getTime()
  });
</script>`}
                  onCopy={handleCopy}
                  onVerify={handleVerify}
                  copied={copied}
                  verifying={verifying}
                  onShare={(w) => {
                    setShareWebsite(w);
                    setShareDialogOpen(true);
                  }}
                  onGoToData={(w) => {
                    localStorage.setItem("selectedWebsiteId", w.id);
                    localStorage.setItem("selectedWebsite", JSON.stringify(w));
                    navigate("/overview");
                  }}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Do this later */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={handleDoLater}
          >
            Do this later
          </Button>
        </div>

        {/* Teaser Cards */}
        <div className="space-y-4">
          <p className="text-p2 text-muted-foreground text-center">
            What you'll see once data arrives
          </p>
          <div className="grid grid-cols-2 gap-4">
            <TeaserCard
              icon={<Users className="h-5 w-5" />}
              title="Visitors today"
              value="—"
            />
            <TeaserCard
              icon={<Wallet className="h-5 w-5" />}
              title="Wallets detected"
              subtitle="last 24h"
              value="—"
            />
            <TeaserCard
              icon={<Tags className="h-5 w-5" />}
              title="Top on-chain categories"
              value="—"
            />
            <TeaserCard
              icon={<Coins className="h-5 w-5" />}
              title="Top token overlap"
              value="—"
            />
          </div>
          <p className="text-p3 text-muted-foreground/60 text-center italic">
            Waiting for data…
          </p>
        </div>
      </div>

      {/* Share Dialog */}
      {shareWebsite && (
        <WebsiteShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          websiteId={shareWebsite.id}
          websiteName={shareWebsite.name}
        />
      )}
    </div>
  );
};

interface TeaserCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value: string;
}

const TeaserCard = ({ icon, title, subtitle, value }: TeaserCardProps) => (
  <Card className="p-4 border border-border/50 bg-muted/30">
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground/40">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-p3 text-muted-foreground/60 truncate">
          {title}
          {subtitle && <span className="text-p4 ml-1">({subtitle})</span>}
        </p>
        <p className="text-h3 text-muted-foreground/40 mt-1">{value}</p>
      </div>
    </div>
  </Card>
);

interface WebsiteListItemWithTagProps {
  website: Website;
  isSelected: boolean;
  onSelect: (website: Website) => void;
  trackingSnippet: string;
  gtmSnippet: string;
  onCopy: (text: string) => void;
  onVerify: () => void;
  copied: boolean;
  verifying: boolean;
  onShare: (website: Website) => void;
  onGoToData: (website: Website) => void;
}

const WebsiteListItemWithTag = ({ 
  website, 
  isSelected, 
  onSelect, 
  trackingSnippet, 
  gtmSnippet, 
  onCopy, 
  onVerify,
  copied,
  verifying,
  onShare,
  onGoToData
}: WebsiteListItemWithTagProps) => {
  const [allCopied, setAllCopied] = useState(false);

  // All tracking code snippets
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

  // Generate full instructions for developer/AI
  const generateFullInstructions = () => {
    return `=== AudienceScan Tracking Setup ===

STEP 1: Install Main Tracking Script
-------------------------------------
Add this before </head> in your HTML:

${trackingSnippet}

(If using GTM, create a Custom HTML tag instead:)
${gtmSnippet}


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

  const getWebsiteStatusBadge = () => {
    switch (website.status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground text-xs">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
            Pending
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="outline" className="border-primary/50 text-primary text-xs">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary" />
            Verified
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="border-destructive/50 text-destructive text-xs">
            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-destructive" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Collapsible open={isSelected}>
      <CollapsibleTrigger asChild>
        <div
          className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-muted/50 ${
            isSelected ? "bg-primary/5" : ""
          }`}
          onClick={() => onSelect(website)}
        >
          <div className="flex-shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              isSelected ? "bg-primary/10" : "bg-muted"
            }`}>
              <Globe className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-p2 font-medium truncate ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
              {website.name}
            </p>
            <p className="text-p4 text-muted-foreground/70 truncate">
              {website.base_url}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getWebsiteStatusBadge()}
            {website.status === "verified" && (
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs bg-primary hover:bg-primary/90"
                onClick={(e) => { e.stopPropagation(); onGoToData(website); }}
              >
                Go to data
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            )}
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isSelected ? "rotate-180" : ""}`} />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-0 border-t border-border/50 bg-muted/30">
          <div className="pt-4 space-y-6">

            {/* Step 1: Main Tag */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium">1</span>
                <p className="text-p3 text-foreground font-medium">
                  Install main tracking script
                </p>
              </div>
              <Tabs defaultValue="website" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-muted/50">
                  <TabsTrigger value="website" className="data-[state=active]:bg-background text-sm">
                    Website
                  </TabsTrigger>
                  <TabsTrigger value="gtm" className="data-[state=active]:bg-background text-sm">
                    GTM
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="website" className="pt-3">
                  <div className="space-y-2">
                    <p className="text-p4 text-muted-foreground">
                      Paste before <code className="bg-muted px-1.5 py-0.5 rounded text-p4">&lt;/head&gt;</code>
                    </p>
                    <div className="relative">
                      <pre className="bg-foreground text-primary-foreground p-3 rounded-lg text-p4 overflow-x-auto">
                        <code>{trackingSnippet}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={(e) => { e.stopPropagation(); onCopy(trackingSnippet); }}
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gtm" className="pt-3">
                  <div className="space-y-2">
                    <p className="text-p4 text-muted-foreground">Create a Custom HTML tag, trigger on All Pages</p>
                    <div className="relative">
                      <pre className="bg-foreground text-primary-foreground p-3 rounded-lg text-p4 overflow-x-auto">
                        <code>{gtmSnippet}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={(e) => { e.stopPropagation(); onCopy(gtmSnippet); }}
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Step 2: Wallet Tracking - IMPORTANT */}
            <div className="space-y-3 p-4 -mx-4 bg-primary/5 border border-primary/20 rounded-lg relative overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-medium">2</span>
                  <p className="text-p3 text-foreground font-medium">
                    Track wallet events
                    <span className="text-primary font-normal ml-1">(recommended)</span>
                  </p>
                </div>
                <p className="text-p4 text-muted-foreground mt-2 mb-3">
                  To get the most out of AudienceScan Analytics, track wallet interactions on your site.
                </p>
                <div className="relative">
                  <pre className="bg-foreground text-primary-foreground p-3 rounded-lg text-p4 overflow-x-auto whitespace-pre-wrap">
                    <code>{walletTrackingSnippet}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={(e) => { e.stopPropagation(); onCopy(walletTrackingSnippet); }}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 3: Conversion Events */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs font-medium">3</span>
                <p className="text-p3 text-foreground font-medium">
                  Track conversion events
                  <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </p>
              </div>
              <div className="relative">
                <pre className="bg-foreground text-primary-foreground p-3 rounded-lg text-p4 overflow-x-auto whitespace-pre-wrap">
                  <code>{conversionEventSnippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={(e) => { e.stopPropagation(); onCopy(conversionEventSnippet); }}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={(e) => { e.stopPropagation(); handleCopyAll(); }}
              >
                {allCopied ? <Check className="mr-2 h-3 w-3" /> : <FileText className="mr-2 h-3 w-3" />}
                Copy all instructions for developer / AI
              </Button>
              <div className="flex gap-3">
                {website.status !== "verified" && (
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={(e) => { e.stopPropagation(); onVerify(); }}
                    disabled={verifying}
                  >
                    {verifying ? (
                      <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-3 w-3" />
                    )}
                    Verify installation
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); onShare(website); }}
                >
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
