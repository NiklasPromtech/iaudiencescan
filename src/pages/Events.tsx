import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Target,
  Plus,
  Copy,
  Check,
  Code,
  ChevronRight,
} from "lucide-react";
import { TrackingSetupDialog } from "@/components/overview/TrackingSetupDialog";

interface EventTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  onSetup: () => void;
  eventCount?: number;
}

const EventTypeCard = ({
  title,
  description,
  icon,
  examples,
  onSetup,
  eventCount,
}: EventTypeCardProps) => {
  return (
    <Card className="p-6 border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        {eventCount !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {eventCount} tracked
          </Badge>
        )}
      </div>

      <h3 className="text-h3 text-foreground mb-2">{title}</h3>
      <p className="text-p2 text-muted-foreground mb-4">{description}</p>

      <div className="mb-4">
        <p className="text-p4 text-muted-foreground mb-2">Examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Badge key={example} variant="outline" className="text-xs font-mono">
              {example}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full text-primary border-primary/30 hover:bg-primary/10"
        onClick={onSetup}
      >
        <Code className="h-4 w-4 mr-2" />
        View setup code
        <ChevronRight className="h-4 w-4 ml-auto" />
      </Button>
    </Card>
  );
};

const Events = () => {
  const [walletSetupOpen, setWalletSetupOpen] = useState(false);
  const [conversionSetupOpen, setConversionSetupOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 text-foreground mb-2">Event Manager</h1>
          <p className="text-p1 text-muted-foreground">
            Track wallet activity and conversion events from your visitors.
          </p>
        </div>

        {/* Event Types Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <EventTypeCard
            title="Wallet Events"
            description="Track when users connect wallets, stake tokens, make purchases, or sign transactions."
            icon={<Wallet className="h-5 w-5" />}
            examples={["connected", "staked", "purchased", "signed"]}
            onSetup={() => setWalletSetupOpen(true)}
          />

          <EventTypeCard
            title="Conversion Events"
            description="Track custom conversion events like signups, purchases, or any action that matters to your business."
            icon={<Target className="h-5 w-5" />}
            examples={["Signed up", "Purchase", "Newsletter"]}
            onSetup={() => setConversionSetupOpen(true)}
          />
        </div>

        {/* Quick Reference */}
        <Card className="p-6 border border-border mb-8">
          <h3 className="text-h3 text-foreground mb-4">Quick Reference</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-p3 text-muted-foreground mb-2">Track a wallet event:</p>
              <QuickCodeBlock code="AudienceScan.trackWallet('0x...', 'connected');" />
            </div>
            <div>
              <p className="text-p3 text-muted-foreground mb-2">Track a conversion event:</p>
              <QuickCodeBlock code="AudienceScan.trackEvent('Signed up', 'user@email.com');" />
            </div>
          </div>
        </Card>

        {/* Coming Soon */}
        <Card className="p-6 border border-dashed border-border bg-muted/20">
          <div className="flex items-center gap-3 mb-3">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-h3 text-foreground">More coming soon</h3>
          </div>
          <p className="text-p2 text-muted-foreground">
            Event filtering, custom event properties, and event-based cohort creation are on the roadmap.
          </p>
        </Card>

        {/* Setup Dialogs */}
        <TrackingSetupDialog
          type="wallet"
          open={walletSetupOpen}
          onOpenChange={setWalletSetupOpen}
        />
        <TrackingSetupDialog
          type="conversion"
          open={conversionSetupOpen}
          onOpenChange={setConversionSetupOpen}
        />
      </div>
    </DashboardLayout>
  );
};

const QuickCodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-sidebar border border-border rounded-lg p-3 pr-10 text-sm font-mono text-foreground overflow-x-auto">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default Events;
