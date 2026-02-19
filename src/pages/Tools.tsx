import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, RotateCcw, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const utmFields = [
  { key: "source", label: "utm_source", placeholder: "e.g. twitter, telegram, google" },
  { key: "medium", label: "utm_medium", placeholder: "e.g. cpc, social, email" },
  { key: "campaign", label: "utm_campaign", placeholder: "e.g. retargeting-q1" },
  { key: "content", label: "utm_content", placeholder: "e.g. blue-ad-v2" },
  { key: "term", label: "utm_term", placeholder: "e.g. blockchain analytics" },
] as const;

type UtmKeys = typeof utmFields[number]["key"];

const emptyUtms: Record<UtmKeys, string> = { source: "", medium: "", campaign: "", content: "", term: "" };

const Tools = () => {
  const { toast } = useToast();
  const [baseUrl, setBaseUrl] = useState("");
  const [utms, setUtms] = useState<Record<UtmKeys, string>>({ ...emptyUtms });

  const generatedUrl = useMemo(() => {
    if (!baseUrl.trim()) return "";
    try {
      const raw = baseUrl.trim();
      const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      utmFields.forEach(({ key, label }) => {
        const val = utms[key].trim();
        if (val) url.searchParams.set(label, val);
      });
      return url.toString();
    } catch {
      return "";
    }
  }, [baseUrl, utms]);

  const handleCopy = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    toast({ title: "Copied!", description: "UTM link copied to clipboard." });
  };

  const handleReset = () => {
    setBaseUrl("");
    setUtms({ ...emptyUtms });
  };

  const setUtm = (key: UtmKeys, value: string) =>
    setUtms((prev) => ({ ...prev, [key]: value }));

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl">
        <h1 className="font-mono text-lg font-semibold uppercase tracking-wider text-foreground mb-1">Tools</h1>
        <p className="text-sm text-muted-foreground mb-6">Utilities to help manage your marketing campaigns.</p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LinkIcon className="h-4 w-4" />
              UTM Generator
            </CardTitle>
            <CardDescription>Build a campaign URL with UTM parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Base URL */}
            <div className="space-y-1.5">
              <Label htmlFor="base-url" className="font-mono text-xs uppercase tracking-wider">
                Website URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="base-url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://yoursite.com/landing"
              />
            </div>

            {/* UTM fields */}
            {utmFields.map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="font-mono text-xs uppercase tracking-wider">
                  {label}
                </Label>
                <Input
                  id={key}
                  value={utms[key]}
                  onChange={(e) => setUtm(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}

            {/* Generated URL preview */}
            {generatedUrl && (
              <div className="mt-4 space-y-1.5">
                <Label className="font-mono text-xs uppercase tracking-wider">Generated URL</Label>
                <div className="rounded border border-border bg-muted/40 p-3 break-all text-xs font-mono text-foreground select-all">
                  {generatedUrl}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleCopy} disabled={!generatedUrl} className="gap-2">
                <Copy className="h-3.5 w-3.5" />
                Copy URL
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Tools;
