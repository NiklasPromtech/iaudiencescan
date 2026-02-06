import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Copy,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Megaphone,
} from "lucide-react";
import {
  NewsSourceAggregate,
  copyToClipboard,
  downloadCSV,
} from "@/lib/export-utils";

interface PROutletsSectionProps {
  sources: NewsSourceAggregate[];
}

export const PROutletsSection = ({ sources }: PROutletsSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (sources.length === 0) return null;

  const handleCopyDomains = () => {
    const domains = sources.map((s) => s.domain);
    copyToClipboard(domains.join("\n"), `Copied ${domains.length} PR outlets`);
  };

  const handleExportCSV = () => {
    const headers = ["Domain", "Article Count", "Latest Article", "Sample URL"];
    const rows = sources.map((s) => [
      s.domain,
      s.article_count.toString(),
      s.latest_article,
      s.sample_url,
    ]);
    downloadCSV([headers, ...rows], "pr-outlets");
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    PR Opportunities
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {sources.length} media outlets covering these communities
                  </p>
                </div>
              </div>
              <div
                className="flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyDomains}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-muted-foreground border-l-2 border-purple-500/50 pl-3">
              These outlets write about projects your audience invests in. If
              they're here, maybe you should be too.
            </p>

            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {sources.map((source) => (
                <div
                  key={source.domain}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{source.domain}</span>
                    <span className="text-xs text-muted-foreground">
                      {source.article_count}{" "}
                      {source.article_count === 1 ? "article" : "articles"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity gap-1.5 h-7 text-xs"
                    onClick={() => window.open(`https://${source.domain}`, "_blank")}
                  >
                    Visit Site
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
