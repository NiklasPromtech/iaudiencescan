import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  FileText,
  ExternalLink,
  Wallet,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react";

const Overview = () => {
  // Mock data - in production this would come from API
  const trafficData = {
    sessions: 1247,
    pageviews: 3892,
    topReferrers: [
      { source: "twitter.com", visits: 423 },
      { source: "google.com", visits: 318 },
      { source: "discord.gg", visits: 156 },
    ],
  };

  const walletData = {
    detected: 847,
    enriched: 312,
    queued: 535,
    progress: 37,
  };

  const suggestedCohorts = [
    {
      id: 1,
      name: "High-intent visitors",
      description: "Viewed pricing page",
      size: 234,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Repeat visitors",
      description: "3+ sessions this week",
      size: 156,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "DeFi active",
      description: "Wallets with DeFi activity",
      size: 89,
      icon: <Zap className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="border-primary/30 text-primary mb-3">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
            Data flowing
          </Badge>
          <h1 className="text-h2 text-foreground mb-2">Overview</h1>
          <p className="text-p1 text-muted-foreground">
            Your Day 0 dashboard — here's what we're seeing so far.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Sessions"
            value={trafficData.sessions.toLocaleString()}
            sublabel="today"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            label="Page Views"
            value={trafficData.pageviews.toLocaleString()}
            sublabel="today"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            label="Wallets Detected"
            value={walletData.detected.toLocaleString()}
            sublabel="total"
            icon={<Wallet className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Referrers */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 text-foreground">Top Referrers</h3>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {trafficData.topReferrers.map((ref, i) => (
                <div key={ref.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-p3 text-muted-foreground w-4">{i + 1}</span>
                    <span className="text-p2 text-foreground">{ref.source}</span>
                  </div>
                  <span className="text-p2 text-muted-foreground font-medium">
                    {ref.visits}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Wallet Enrichment Progress */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 text-foreground">Wallet Enrichment</h3>
              <Badge variant="secondary" className="text-p4">
                {walletData.progress}% complete
              </Badge>
            </div>
            <Progress value={walletData.progress} className="h-2 mb-4" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-h3 text-foreground">{walletData.detected}</p>
                <p className="text-p4 text-muted-foreground">Detected</p>
              </div>
              <div>
                <p className="text-h3 text-primary">{walletData.enriched}</p>
                <p className="text-p4 text-muted-foreground">Enriched</p>
              </div>
              <div>
                <p className="text-h3 text-muted-foreground">{walletData.queued}</p>
                <p className="text-p4 text-muted-foreground">Queued</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Cohort Suggestions */}
        <Card className="p-6 border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-h3 text-foreground">Suggested Cohorts</h3>
          </div>
          <p className="text-p2 text-muted-foreground mb-6">
            Auto-generated based on your early traffic patterns
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {suggestedCohorts.map((cohort) => (
              <div
                key={cohort.id}
                className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2 text-primary">
                  {cohort.icon}
                  <span className="text-p2 font-medium text-foreground">{cohort.name}</span>
                </div>
                <p className="text-p3 text-muted-foreground mb-3">{cohort.description}</p>
                <p className="text-p4 text-muted-foreground">
                  <span className="text-foreground font-medium">{cohort.size}</span> visitors
                </p>
              </div>
            ))}
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90">
            Create your first audience
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, sublabel, icon }: StatCardProps) => (
  <Card className="p-5 border border-border">
    <div className="flex items-start justify-between mb-3">
      <span className="text-muted-foreground">{icon}</span>
    </div>
    <p className="text-h2 text-foreground mb-1">{value}</p>
    <p className="text-p3 text-muted-foreground">
      {label} <span className="text-p4">({sublabel})</span>
    </p>
  </Card>
);

export default Overview;
