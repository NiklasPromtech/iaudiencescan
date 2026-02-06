import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  MessageCircle,
  Globe,
  Newspaper,
  Link,
  Database,
  Download,
  Copy,
  Check,
  Megaphone,
} from "lucide-react";
import { ScanResultsTopToken } from "@/lib/api";
import { ExportCard } from "./ExportCard";
import {
  formatPlatformHandles,
  formatWebsiteURLs,
  formatNewsURLs,
  formatAllSocialURLs,
  formatFullExportCSV,
  formatFullExportJSON,
  formatNewsSourceDomains,
  downloadCSV,
  copyToClipboard,
  getPlatformCounts,
} from "@/lib/export-utils";

interface ExportCenterTabProps {
  tokens: ScanResultsTopToken[];
  scanName?: string;
}

export const ExportCenterTab = ({ tokens, scanName }: ExportCenterTabProps) => {
  const [copiedJSON, setCopiedJSON] = useState(false);

  const counts = useMemo(() => getPlatformCounts(tokens), [tokens]);
  const websiteURLs = useMemo(() => formatWebsiteURLs(tokens), [tokens]);
  const newsURLs = useMemo(() => formatNewsURLs(tokens), [tokens]);
  const socialURLs = useMemo(() => formatAllSocialURLs(tokens), [tokens]);
  const prOutlets = useMemo(() => formatNewsSourceDomains(tokens), [tokens]);

  const handleFullCSVExport = () => {
    const data = formatFullExportCSV(tokens);
    const filename = scanName ? `${scanName.toLowerCase().replace(/\s+/g, "-")}-full-export` : "scan-full-export";
    downloadCSV(data, filename);
  };

  const handleCopyJSON = async () => {
    const json = formatFullExportJSON(tokens);
    const success = await copyToClipboard(json, "Copied full dataset as JSON");
    if (success) {
      setCopiedJSON(true);
      setTimeout(() => setCopiedJSON(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Export Center</h2>
        <p className="text-sm text-muted-foreground">
          Download your outreach data in multiple formats
        </p>
      </div>

      {/* Platform Handles */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
          Platform Handles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ExportCard
            title="X / Twitter"
            subtitle="handles"
            count={counts.twitter}
            icon={<Twitter className="h-5 w-5" />}
            getData={() => formatPlatformHandles(tokens, "twitter")}
            filename="twitter-handles"
          />
          <ExportCard
            title="Telegram"
            subtitle="channels"
            count={counts.telegram}
            icon={<MessageCircle className="h-5 w-5" />}
            getData={() => formatPlatformHandles(tokens, "telegram")}
            filename="telegram-channels"
          />
          <ExportCard
            title="Reddit"
            subtitle="subreddits"
            count={counts.reddit}
            icon={<Globe className="h-5 w-5" />}
            getData={() => formatPlatformHandles(tokens, "reddit")}
            filename="reddit-subreddits"
          />
          <ExportCard
            title="Discord"
            subtitle="servers"
            count={counts.discord}
            icon={<MessageCircle className="h-5 w-5" />}
            getData={() => formatPlatformHandles(tokens, "discord")}
            filename="discord-servers"
          />
        </div>
      </div>

      {/* URLs */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
          URLs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ExportCard
            title="Project Websites"
            subtitle="URLs"
            count={websiteURLs.length}
            icon={<Globe className="h-5 w-5" />}
            getData={() => websiteURLs}
            filename="project-websites"
          />
          <ExportCard
            title="News Article URLs"
            subtitle="URLs"
            count={newsURLs.length}
            icon={<Newspaper className="h-5 w-5" />}
            getData={() => newsURLs}
            filename="news-articles"
          />
          <ExportCard
            title="Social Profiles"
            subtitle="URLs"
            count={socialURLs.length}
            icon={<Link className="h-5 w-5" />}
            getData={() => socialURLs}
            filename="social-profiles"
          />
          <ExportCard
            title="PR Outlets"
            subtitle="domains"
            count={prOutlets.length}
            icon={<Megaphone className="h-5 w-5" />}
            getData={() => prOutlets}
            filename="pr-outlets"
          />
        </div>
      </div>

      {/* Full Export */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
          Full Export
        </h3>
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Download Complete Dataset</h4>
              <p className="text-sm text-muted-foreground mb-4">
                All {tokens.length} tokens with metadata, socials, news, and URLs
              </p>
              <div className="flex gap-3">
                <Button onClick={handleFullCSVExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
                <Button variant="outline" onClick={handleCopyJSON} className="gap-2">
                  {copiedJSON ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy as JSON
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
