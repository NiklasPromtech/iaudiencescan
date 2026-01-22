import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, RefreshCw, Users, Wallet, Tags, Coins, Plus, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type InstallStatus = "not_installed" | "receiving" | "active";

interface Site {
  id: string;
  site_id: string;
  name: string;
  domain: string | null;
  status: InstallStatus;
}

const Install = () => {
  const [status, setStatus] = useState<InstallStatus>("not_installed");
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteDomain, setNewSiteDomain] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user's sites on mount
  useEffect(() => {
    const fetchSites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error loading sites",
          description: error.message,
          variant: "destructive",
        });
      } else if (data && data.length > 0) {
        setSites(data as Site[]);
        setSelectedSite(data[0] as Site);
        setStatus(data[0].status as InstallStatus);
      }
      setLoading(false);
    };

    fetchSites();
  }, [navigate, toast]);

  const generateSiteId = () => {
    return "as_" + Math.random().toString(36).substring(2, 10);
  };

  const handleCreateSite = async () => {
    if (!newSiteName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your webpage.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const siteId = generateSiteId();
    const { data, error } = await supabase
      .from("sites")
      .insert({
        user_id: user.id,
        site_id: siteId,
        name: newSiteName.trim(),
        domain: newSiteDomain.trim() || null,
        status: "not_installed",
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating site",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      const newSite = data as Site;
      setSites([newSite, ...sites]);
      setSelectedSite(newSite);
      setStatus("not_installed");
      setShowCreateForm(false);
      setNewSiteName("");
      setNewSiteDomain("");
      toast({
        title: "Webpage created",
        description: "Your tracking tag has been generated.",
      });
    }
    setCreating(false);
  };

  const siteId = selectedSite?.site_id || "";

  const trackingScript = `<!-- AudienceScan Tracking -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'as.start':
  new Date().getTime(),event:'as.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='asLayer'?'&l='+l:'';j.async=true;j.src=
  'https://cdn.audiencescan.io/as.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','asLayer','${siteId}');
</script>`;

  const gtmSnippet = `<script>
  window.asLayer = window.asLayer || [];
  window.asLayer.push({
    'as.siteId': '${siteId}',
    'as.start': new Date().getTime()
  });
</script>`;

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
    setVerifying(true);
    // Simulate verification - in production this would ping your /collect endpoint
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setVerifying(false);
    
    if (status === "not_installed") {
      toast({
        title: "No events detected yet",
        description: "Make sure the script is installed and visit your site.",
        variant: "destructive",
      });
    }
  };

  const handleDoLater = () => {
    navigate("/overview");
  };

  const getStatusBadge = () => {
    switch (status) {
      case "not_installed":
        return (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-muted-foreground/60" />
            Not installed
          </Badge>
        );
      case "receiving":
        return (
          <Badge variant="outline" className="border-primary/30 text-primary">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
            Receiving events
          </Badge>
        );
      case "active":
        return (
          <Badge variant="outline" className="border-primary/50 text-primary">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
            Active
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

  // No sites yet - show create form
  if (sites.length === 0 || showCreateForm) {
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
              Create your first webpage
            </h1>
            <p className="text-p1 text-muted-foreground">
              Add a webpage to start tracking visitor wallets and cohort intel.
            </p>
          </div>

          <Card className="border border-border shadow-elegant p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Webpage name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. My DeFi App"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain (optional)</Label>
                <Input
                  id="domain"
                  placeholder="e.g. mydefiapp.com"
                  value={newSiteDomain}
                  onChange={(e) => setNewSiteDomain(e.target.value)}
                />
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
                  Create webpage
                </Button>
                {sites.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              {sites.length === 0 && (
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
          {sites.length > 1 && (
            <p className="text-p3 text-muted-foreground mt-2">
              Tracking: <strong>{selectedSite?.name}</strong>
            </p>
          )}
        </div>

        {/* Installation Card */}
        <Card className="border border-border shadow-elegant mb-8">
          <Tabs defaultValue="website" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-muted/50">
              <TabsTrigger value="website" className="data-[state=active]:bg-background">
                Website
              </TabsTrigger>
              <TabsTrigger value="gtm" className="data-[state=active]:bg-background">
                GTM
              </TabsTrigger>
            </TabsList>

            <TabsContent value="website" className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-p2 text-foreground font-medium mb-2">
                    Paste this before <code className="bg-muted px-1.5 py-0.5 rounded text-p3">&lt;/head&gt;</code>
                  </p>
                  <div className="relative">
                    <pre className="bg-foreground text-primary-foreground p-4 rounded-lg text-p3 overflow-x-auto">
                      <code>{trackingScript}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopy(trackingScript)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Framework hints */}
                <details className="group">
                  <summary className="text-p3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Using Next.js or React?
                  </summary>
                  <div className="mt-3 pl-4 border-l-2 border-muted text-p3 text-muted-foreground space-y-2">
                    <p><strong>Next.js:</strong> Add to <code className="bg-muted px-1 rounded">_document.tsx</code> or use the <code className="bg-muted px-1 rounded">Script</code> component with <code className="bg-muted px-1 rounded">strategy="afterInteractive"</code></p>
                    <p><strong>React (CRA/Vite):</strong> Add directly to <code className="bg-muted px-1 rounded">index.html</code> in your public folder</p>
                  </div>
                </details>
              </div>
            </TabsContent>

            <TabsContent value="gtm" className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-p3 font-medium">1</span>
                    <div>
                      <p className="text-p2 text-foreground font-medium">Create a new Custom HTML tag</p>
                      <p className="text-p3 text-muted-foreground">In GTM, go to Tags → New → Custom HTML</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-p3 font-medium">2</span>
                    <div>
                      <p className="text-p2 text-foreground font-medium">Paste this snippet</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <pre className="bg-foreground text-primary-foreground p-4 rounded-lg text-p3 overflow-x-auto">
                    <code>{gtmSnippet}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(gtmSnippet)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-p3 font-medium">3</span>
                  <div>
                    <p className="text-p2 text-foreground font-medium">Set trigger to "All Pages"</p>
                    <p className="text-p3 text-muted-foreground">Publish your container when ready</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          <div className="p-6 pt-0 flex gap-3">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => handleCopy(trackingScript)}
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              Copy snippet
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Verify installation
            </Button>
          </div>
        </Card>

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

export default Install;
