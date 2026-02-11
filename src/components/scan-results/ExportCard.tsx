import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import { copyToClipboard, downloadCSV } from "@/lib/export-utils";

interface ExportCardProps {
  title: string;
  subtitle: string;
  count: number;
  icon: React.ReactNode;
  getData: () => string[];
  getCSVData?: () => string[][];
  filename: string;
}

export const ExportCard = ({
  title,
  subtitle,
  count,
  icon,
  getData,
  getCSVData,
  filename,
}: ExportCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const data = getData();
    const success = await copyToClipboard(
      data.join("\n"),
      `Copied ${count} ${subtitle}`
    );
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCSV = () => {
    if (getCSVData) {
      downloadCSV(getCSVData(), filename);
    } else {
      const data = getData();
      const csvData = [[title], ...data.map((item) => [item])];
      downloadCSV(csvData, filename);
    }
  };

  if (count === 0) return null;

  return (
    <div className="py-3 border-b border-border flex items-center gap-3">
      <div className="text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">
          {count} {subtitle}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          CSV
        </Button>
      </div>
    </div>
  );
};
