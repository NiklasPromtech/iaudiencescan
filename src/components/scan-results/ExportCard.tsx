import { useState } from "react";
import { Card } from "@/components/ui/card";
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
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">
            {count} {subtitle}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1 gap-2"
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
          className="flex-1 gap-2"
        >
          <Download className="h-4 w-4" />
          CSV
        </Button>
      </div>
    </Card>
  );
};
