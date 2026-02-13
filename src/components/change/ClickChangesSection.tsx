import { useState, useMemo } from "react";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Link2 } from "lucide-react";
import type { ClickChangeItem } from "@/types/report-v2";

const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

const ClickChangesTable = ({ title, icon, items }: { title: string; icon: React.ReactNode; items: ClickChangeItem[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">{icon} {title}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Link Text</TableHead>
            <TableHead className="max-w-[200px]">URL</TableHead>
            <TableHead>Page</TableHead>
            <TableHead className="text-right">Baseline</TableHead>
            <TableHead className="text-right">Event</TableHead>
            <TableHead className="text-right">Δ</TableHead>
            <TableHead className="text-right">Δ%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="max-w-[180px]">
                <TooltipProvider>
                  <UiTooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium block truncate cursor-default">{item.click_text || "—"}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs break-all">
                      {item.click_text || "—"}
                    </TooltipContent>
                  </UiTooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <TooltipProvider>
                  <UiTooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate text-xs text-muted-foreground cursor-default">{item.href}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm break-all">
                      {item.href}
                    </TooltipContent>
                  </UiTooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="max-w-[140px]">
                <TooltipProvider>
                  <UiTooltip>
                    <TooltipTrigger asChild>
                      <span className="block truncate text-xs text-muted-foreground cursor-default">{item.page_path || "—"}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs break-all">
                      {item.page_path || "—"}
                    </TooltipContent>
                  </UiTooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right tabular-nums">{item.baseline_clicks}</TableCell>
              <TableCell className="text-right tabular-nums">{item.event_clicks}</TableCell>
              <TableCell className="text-right tabular-nums">
                <span className={item.delta > 0 ? "text-emerald-600" : item.delta < 0 ? "text-red-500" : ""}>
                  {item.delta > 0 ? "+" : ""}{item.delta}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <span className={item.delta_percent > 0 ? "text-emerald-600" : item.delta_percent < 0 ? "text-red-500" : ""}>
                  {fmtPct(item.delta_percent)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface ClickChangesSectionProps {
  outbound_click_gainers?: ClickChangeItem[];
  outbound_click_losers?: ClickChangeItem[];
  internal_click_gainers?: ClickChangeItem[];
  internal_click_losers?: ClickChangeItem[];
}

export const ClickChangesSection = ({
  outbound_click_gainers = [],
  outbound_click_losers = [],
  internal_click_gainers = [],
  internal_click_losers = [],
}: ClickChangesSectionProps) => {
  const allItems = [...outbound_click_gainers, ...outbound_click_losers, ...internal_click_gainers, ...internal_click_losers];
  
  const pagePaths = useMemo(() => {
    const paths = new Set(allItems.map((item) => item.page_path).filter(Boolean));
    return Array.from(paths).sort();
  }, [allItems]);

  const [selectedPage, setSelectedPage] = useState<string>("all");

  const filterItems = (items: ClickChangeItem[]) =>
    selectedPage === "all" ? items : items.filter((item) => item.page_path === selectedPage);

  if (allItems.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Click Changes</p>
        {pagePaths.length > 1 && (
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-[220px] h-8 text-xs rounded-none bg-background">
              <SelectValue placeholder="All Pages" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-popover z-50">
              <SelectItem value="all" className="text-xs">All Pages</SelectItem>
              {pagePaths.map((path) => (
                <SelectItem key={path} value={path} className="text-xs font-mono">
                  {path}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <ClickChangesTable title="Outbound Click Gainers" icon={<ExternalLink className="h-3.5 w-3.5 text-emerald-600" />} items={filterItems(outbound_click_gainers)} />
      <ClickChangesTable title="Outbound Click Losers" icon={<ExternalLink className="h-3.5 w-3.5 text-red-500" />} items={filterItems(outbound_click_losers)} />
      <ClickChangesTable title="Internal Click Gainers" icon={<Link2 className="h-3.5 w-3.5 text-emerald-600" />} items={filterItems(internal_click_gainers)} />
      <ClickChangesTable title="Internal Click Losers" icon={<Link2 className="h-3.5 w-3.5 text-red-500" />} items={filterItems(internal_click_losers)} />
    </div>
  );
};
