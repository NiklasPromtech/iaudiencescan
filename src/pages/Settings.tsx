import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  CreditCard,
  User,
  ChevronRight,
  ExternalLink,
  LogOut,
  Key,
  FlaskConical,
  DollarSign,
  Users,
  Megaphone,
  FileCode2,
  Search,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("selectedWebsiteId");
    localStorage.removeItem("selectedWebsite");
    navigate("/auth");
  };

  const settingsSections = [
    {
      title: "Websites",
      description: "Manage your tracked websites and installation",
      icon: Globe,
      action: () => navigate("/install"),
      badge: null,
    },
    {
      title: "AI Assistant Access",
      description: "Generate API keys for external AI tools",
      icon: Key,
      action: () => navigate("/settings/api-keys"),
      badge: null,
    },
    {
      title: "Subscription",
      description: "View your plan and billing details",
      icon: CreditCard,
      action: null,
      badge: "Coming soon",
    },
    {
      title: "Account",
      description: "Update your profile and preferences",
      icon: User,
      action: null,
      badge: "Coming soon",
    },
  ];

  const labsFeatures = [
    {
      title: "Cost Sources",
      description: "Import ad-spend and other cost data to calculate blended ROI across channels.",
      icon: DollarSign,
      url: "/costs",
    },
    {
      title: "Wallet Groups",
      description: "Segment wallets into named audiences for targeted analysis and exports.",
      icon: Users,
      url: "/audiences",
    },
    {
      title: "Touchpoints",
      description: "Define marketing touchpoints to measure attribution and incrementality.",
      icon: Megaphone,
      url: "/touchpoints",
    },
    {
      title: "Token Contracts",
      description: "Track on-chain token contracts and monitor holder trends over time.",
      icon: FileCode2,
      url: "/contracts",
    },
    {
      title: "Audience Scans",
      description: "Run deep scans on audiences to discover communities, websites, and targeting signals.",
      icon: Search,
      url: "/scans",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container max-w-3xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 text-foreground mb-2">Settings</h1>
          <p className="text-p1 text-muted-foreground">
            Manage your account, websites, and subscription.
          </p>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          {settingsSections.map((section) => (
            <Card
              key={section.title}
              className={`p-4 border border-border ${
                section.action
                  ? "hover:border-primary/30 cursor-pointer transition-colors"
                  : "opacity-60"
              }`}
              onClick={section.action || undefined}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-muted">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-p1 font-medium text-foreground">{section.title}</h3>
                    {section.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-p3 text-muted-foreground">{section.description}</p>
                </div>
                {section.action && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Labs Section */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h2 className="text-h3 text-foreground">Labs</h2>
            <Badge variant="outline" className="text-xs border-primary/40 text-primary">
              Alpha
            </Badge>
          </div>

          <Alert className="mb-4 border-primary/20 bg-primary/5">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-p3 text-muted-foreground">
              These features are experimental and actively being developed. Expect rough edges — things may break or change without notice.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {labsFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="p-4 border border-border hover:border-primary/30 cursor-pointer transition-colors"
                onClick={() => navigate(feature.url)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-p1 font-medium text-foreground">{feature.title}</h3>
                      <Badge variant="outline" className="text-[10px] border-muted-foreground/30 text-muted-foreground">
                        Experimental
                      </Badge>
                    </div>
                    <p className="text-p3 text-muted-foreground">{feature.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <Card
          className="mt-6 p-4 border border-border hover:border-destructive/30 cursor-pointer transition-colors"
          onClick={handleSignOut}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-destructive/10">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="text-p1 font-medium text-foreground">Sign out</h3>
              <p className="text-p3 text-muted-foreground">Sign out of your AudienceScan account</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Help Link */}
        <Card className="mt-4 p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-p2 font-medium text-foreground">Need help?</h3>
              <p className="text-p4 text-muted-foreground">
                Contact us at support@audiencescan.io
              </p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
