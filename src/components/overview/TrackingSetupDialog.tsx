import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Wallet, Target, Mail } from "lucide-react";

interface TrackingSetupDialogProps {
  type: "wallet" | "conversion";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CodeBlock = ({ code, label }: { code: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {label && (
        <p className="text-p4 text-muted-foreground mb-2">{label}</p>
      )}
      <div className="bg-muted/50 border border-border rounded-none p-4 font-mono text-sm text-foreground overflow-x-auto">
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-8 px-2"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export const TrackingSetupDialog = ({
  type,
  open,
  onOpenChange,
}: TrackingSetupDialogProps) => {
  if (type === "wallet") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-none bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-xl">Track Wallet Connections</DialogTitle>
            </div>
            <DialogDescription>
              Call this function when a user connects their wallet to track which visitors have wallets.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <CodeBlock
              label="Add this to your wallet connect callback:"
              code={`AudienceScan.trackWallet(
  '0x1234...',  // wallet address
  'connected'   // event type
);`}
            />

            <div>
              <p className="text-p3 font-medium text-foreground mb-3">
                Other event types you can use:
              </p>
              <ul className="space-y-2 text-p3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono text-sm">'staked'</span>
                  <span>— User staked tokens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono text-sm">'purchased'</span>
                  <span>— User made a purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-mono text-sm">'signed'</span>
                  <span>— User signed a transaction</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-p4 text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Need help? 
                <a 
                  href="mailto:support@audiencescan.io" 
                  className="text-primary hover:underline"
                >
                  support@audiencescan.io
                </a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-none bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">Track Conversion Events</DialogTitle>
          </div>
          <DialogDescription>
            Call this function when a user completes a key action like signing up or making a purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <CodeBlock
            label="Track a signup:"
            code={`AudienceScan.trackEvent(
  'Signed up',        // event name
  'user@email.com'    // user identifier
);`}
          />

          <CodeBlock
            label="Track a purchase with details:"
            code={`AudienceScan.trackEvent('Purchase', {
  amount: 99.99,
  currency: 'USD'
});`}
          />

          <div className="pt-4 border-t border-border">
            <p className="text-p4 text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Need help? 
              <a 
                href="mailto:support@audiencescan.io" 
                className="text-primary hover:underline"
              >
                support@audiencescan.io
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
