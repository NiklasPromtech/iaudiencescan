import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Globe,
  CreditCard,
  User,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "Websites",
      description: "Manage your tracked websites and installation",
      icon: Globe,
      action: () => navigate("/install"),
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

        {/* Help Link */}
        <Card className="mt-8 p-4 border border-border">
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
