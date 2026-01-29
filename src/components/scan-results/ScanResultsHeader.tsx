import { Button } from "@/components/ui/button";
import { ArrowLeft, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Scan, SUPPORTED_CHAINS } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface ScanResultsHeaderProps {
  scan: Scan;
  scanId: string;
}

export const ScanResultsHeader = ({ scan, scanId }: ScanResultsHeaderProps) => {
  const navigate = useNavigate();

  const getChainLabel = (chain: string) => {
    return SUPPORTED_CHAINS.find((c) => c.value === chain)?.label || chain;
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="-ml-2"
          onClick={() => navigate(`/scans/${scanId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Scan Details
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/network/${scanId}`)}
        >
          <Network className="h-4 w-4 mr-2" />
          View Full Network
        </Button>
      </div>

      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {scan.name || `Scan ${scan.id.slice(0, 8)}`}
        </h1>
        <p className="text-muted-foreground">
          {getChainLabel(scan.chain)} • {scan.wallet_count} wallets analyzed •{" "}
          {scan.completed_at
            ? `Completed ${formatDistanceToNow(new Date(scan.completed_at), { addSuffix: true })}`
            : "Processing..."}
        </p>
      </div>
    </div>
  );
};
