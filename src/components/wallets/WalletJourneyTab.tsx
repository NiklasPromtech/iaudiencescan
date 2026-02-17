import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Globe,
  Monitor,
  MousePointerClick,
  ArrowRightLeft,
  ChevronDown,
  MapPin,
  Calendar,
  Eye,
  Zap,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { WalletJourney } from "@/lib/api";
import { useState } from "react";

interface WalletJourneyTabProps {
  journey: WalletJourney;
}

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const truncateHash = (hash: string) =>
  hash.length <= 14 ? hash : `${hash.slice(0, 8)}…${hash.slice(-4)}`;

export function WalletJourneyTab({ journey }: WalletJourneyTabProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {/* Summary row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs border-b border-border pb-3">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">First seen:</span>
          <span className="font-mono font-semibold">
            {format(new Date(journey.first_seen), "MMM d, yyyy")}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">Last seen:</span>
          <span className="font-mono font-semibold">
            {formatDistanceToNow(new Date(journey.last_seen), { addSuffix: true })}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">Sessions:</span>
          <span className="font-mono font-semibold">{journey.total_sessions}</span>
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">Pageviews:</span>
          <span className="font-mono font-semibold">{journey.total_pageviews}</span>
        </span>
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">Events:</span>
          <span className="font-mono font-semibold">{journey.total_events}</span>
        </span>
      </div>

      {/* Quick badges */}
      <div className="flex flex-wrap gap-2">
        {journey.countries.map((c) => (
          <Badge key={c} variant="outline" className="text-[10px] gap-1 py-0.5">
            <MapPin className="h-2.5 w-2.5" /> {c}
          </Badge>
        ))}
        {journey.devices.map((d) => (
          <Badge key={d} variant="outline" className="text-[10px] gap-1 py-0.5">
            <Monitor className="h-2.5 w-2.5" /> {d}
          </Badge>
        ))}
        {journey.top_referrers.map((r) => (
          <Badge key={r} variant="outline" className="text-[10px] gap-1 py-0.5">
            <Globe className="h-2.5 w-2.5" /> {r}
          </Badge>
        ))}
      </div>

      {/* Sessions */}
      {journey.sessions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-primary" /> Sessions
          </h4>
          <div className="space-y-1">
            {journey.sessions.map((s) => (
              <Collapsible
                key={s.session_id}
                open={expandedSession === s.session_id}
                onOpenChange={(open) =>
                  setExpandedSession(open ? s.session_id : null)
                }
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between gap-2 text-xs px-3 py-2 rounded-sm border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-muted-foreground">
                        {format(new Date(s.started_at), "MMM d, HH:mm")}
                      </span>
                      <span className="font-medium truncate">{s.entry_page}</span>
                      {s.is_bounce && (
                        <Badge variant="destructive" className="text-[9px] py-0 px-1">
                          bounce
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-muted-foreground">
                        {s.page_count} pg · {formatDuration(s.duration_seconds)}
                      </span>
                      {s.referrer_domain && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                          {s.referrer_domain}
                        </Badge>
                      )}
                      <ChevronDown
                        className={`h-3 w-3 text-muted-foreground transition-transform ${
                          expandedSession === s.session_id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 py-2 text-[11px] space-y-1.5 bg-muted/20 rounded-b-sm border-x border-b border-border">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                      {s.country && (
                        <span>
                          📍 {s.city ? `${s.city}, ` : ""}
                          {s.country}
                        </span>
                      )}
                      {s.device_type && <span>💻 {s.device_type}</span>}
                      {s.browser && <span>🌐 {s.browser}</span>}
                      {s.os && <span>🖥️ {s.os}</span>}
                      {s.utm_source && (
                        <span>
                          utm: {s.utm_source}
                          {s.utm_medium ? `/${s.utm_medium}` : ""}
                          {s.utm_campaign ? ` (${s.utm_campaign})` : ""}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.pages.map((p, i) => (
                        <span key={i} className="inline-flex items-center">
                          <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono">
                            {p}
                          </code>
                          {i < s.pages.length - 1 && (
                            <span className="text-muted-foreground mx-0.5">→</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {/* Events */}
      {journey.events.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <MousePointerClick className="h-3.5 w-3.5 text-primary" /> Events
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-7 text-[10px]">Time</TableHead>
                <TableHead className="h-7 text-[10px]">Type</TableHead>
                <TableHead className="h-7 text-[10px]">Detail</TableHead>
                <TableHead className="h-7 text-[10px]">Page</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journey.events.map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="py-1 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                    {format(new Date(e.created_at), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className="py-1">
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                      {e.event_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1 text-[11px] max-w-[200px] truncate">
                    {e.click_text ? (
                      <span className="flex items-center gap-1">
                        {e.click_text}
                        {e.is_outbound && <ExternalLink className="h-2.5 w-2.5 text-muted-foreground" />}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-1 text-[11px] font-mono text-muted-foreground">
                    {e.page_path || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Wallet Actions */}
      {journey.wallet_actions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" /> Wallet Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {journey.wallet_actions.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[11px] border border-border rounded-sm px-2.5 py-1.5"
              >
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                  {a.type}
                </Badge>
                <span className="font-mono text-muted-foreground">
                  {format(new Date(a.created_at), "MMM d, HH:mm")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions */}
      {journey.transactions.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <ArrowRightLeft className="h-3.5 w-3.5 text-primary" /> Transactions
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-7 text-[10px]">Time</TableHead>
                <TableHead className="h-7 text-[10px]">Token</TableHead>
                <TableHead className="h-7 text-[10px]">Direction</TableHead>
                <TableHead className="h-7 text-[10px] text-right">Amount</TableHead>
                <TableHead className="h-7 text-[10px] text-right">Value</TableHead>
                <TableHead className="h-7 text-[10px]">Tx</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journey.transactions.map((tx, i) => (
                <TableRow key={i}>
                  <TableCell className="py-1 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                    {format(new Date(tx.block_signed_at), "MMM d, HH:mm")}
                  </TableCell>
                  <TableCell className="py-1 text-[11px] font-medium">
                    {tx.token_symbol}
                  </TableCell>
                  <TableCell className="py-1">
                    <Badge
                      variant={tx.transfer_direction === "incoming" ? "default" : "outline"}
                      className="text-[10px] py-0 px-1.5"
                    >
                      {tx.transfer_direction}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1 text-right text-[11px] font-mono tabular-nums">
                    {parseFloat(tx.transfer_value).toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
                  </TableCell>
                  <TableCell className="py-1 text-right text-[11px] font-mono tabular-nums font-medium">
                    {formatUsd(tx.quote_usd)}
                  </TableCell>
                  <TableCell className="py-1">
                    <a
                      href={`https://etherscan.io/tx/${tx.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
