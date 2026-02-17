import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Globe, Monitor, MousePointerClick, ArrowRightLeft, ChevronDown,
  MapPin, Calendar, Eye, Zap, ExternalLink, Radio,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { WalletJourney, WalletJourneyEvent, WalletJourneyAction, WalletJourneySession } from "@/lib/api";
import { useState, useMemo } from "react";

interface WalletJourneyTabProps {
  journey: WalletJourney;
}

// --- helpers ---

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);

// --- session merging ---

interface MergedSession {
  session_id: string;
  started_at: string;
  duration_seconds: number;
  is_bounce: boolean;
  page_count: number;
  entry_page: string;
  exit_page: string;
  referrer_domain: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  pages: string[];
  session_count: number;
}

function mergeSessions(sessions: WalletJourneySession[]): MergedSession[] {
  if (sessions.length === 0) return [];

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
  );

  const MERGE_GAP = 1800; // 30 minutes in seconds
  const groups: MergedSession[] = [];

  let current: MergedSession = sessionToMerged(sorted[0]);

  for (let i = 1; i < sorted.length; i++) {
    const s = sorted[i];
    const sStartMs = new Date(s.started_at).getTime();
    const currentEndMs =
      new Date(current.started_at).getTime() + current.duration_seconds * 1000;
    const latestEndMs = Math.max(
      currentEndMs,
      new Date(current.started_at).getTime() + (current.pages.length > 0 ? MERGE_GAP * 1000 : 0)
    );

    if (sStartMs <= latestEndMs) {
      // Merge into current group
  // Deduplicate consecutive pages
  const lastPage = current.pages[current.pages.length - 1];
  const newPages = s.pages.filter((p, i) => i === 0 ? p !== lastPage : p !== s.pages[i - 1]);
  current.pages = [...current.pages, ...newPages];
      current.page_count += s.page_count;
      const newEndMs = new Date(s.started_at).getTime() + Math.max(s.duration_seconds, 0) * 1000;
      current.duration_seconds = Math.round(
        (Math.max(newEndMs, currentEndMs) - new Date(current.started_at).getTime()) / 1000
      );
      current.is_bounce = false;
      current.exit_page = s.pages[s.pages.length - 1] || s.entry_page;
      current.session_count += 1;
      // Fill missing metadata from later sessions
      current.referrer_domain = current.referrer_domain || s.referrer_domain;
      current.utm_source = current.utm_source || s.utm_source;
      current.utm_medium = current.utm_medium || s.utm_medium;
      current.utm_campaign = current.utm_campaign || s.utm_campaign;
      current.country = current.country || s.country;
      current.region = current.region || s.region;
      current.city = current.city || s.city;
      current.device_type = current.device_type || s.device_type;
      current.browser = current.browser || s.browser;
      current.os = current.os || s.os;
    } else {
      groups.push(current);
      current = sessionToMerged(s);
    }
  }
  groups.push(current);
  return groups;
}

function sessionToMerged(s: WalletJourneySession): MergedSession {
  return {
    ...s,
    exit_page: s.pages[s.pages.length - 1] || s.entry_page,
    session_count: 1,
  };
}

// --- timeline types ---

type NestedItem =
  | { kind: "event"; data: WalletJourneyEvent; ts: number }
  | { kind: "action"; data: WalletJourneyAction; ts: number };

type TimelineItem =
  | { type: "session"; ts: number; session: MergedSession; nested: NestedItem[] }
  | { type: "standalone"; ts: number; event: WalletJourneyEvent };

// --- timeline builder ---

function buildTimeline(journey: WalletJourney): TimelineItem[] {
  const SESSION_MIN_WINDOW = 1800; // 30 min in seconds

  // Step 1: merge nearby sessions
  const mergedSessions = mergeSessions(journey.sessions);

  type SessionTimelineItem = { type: "session"; ts: number; session: MergedSession; nested: NestedItem[]; _endMs: number };

  // Build session windows
  const sessionItems: SessionTimelineItem[] = mergedSessions.map((s) => {
    const startMs = new Date(s.started_at).getTime();
    const windowSec = Math.max(s.duration_seconds, SESSION_MIN_WINDOW);
    const endMs = startMs + windowSec * 1000;
    return { type: "session" as const, ts: startMs, session: s, nested: [], _endMs: endMs };
  });

  // Track which events/actions are claimed
  const claimedEvents = new Set<number>();
  const claimedActions = new Set<number>();

  // Match ALL events (including wallet_detected) to sessions
  journey.events.forEach((e, idx) => {
    const eMs = new Date(e.created_at).getTime();
    for (const item of sessionItems) {
      if (eMs >= item.ts && eMs <= item._endMs) {
        item.nested.push({ kind: "event", data: e, ts: eMs });
        claimedEvents.add(idx);
        break;
      }
    }
  });

  // Match wallet actions to sessions
  journey.wallet_actions.forEach((a, idx) => {
    const aMs = new Date(a.created_at).getTime();
    for (const item of sessionItems) {
      if (aMs >= item.ts && aMs <= item._endMs) {
        item.nested.push({ kind: "action", data: a, ts: aMs });
        claimedActions.add(idx);
        break;
      }
    }
  });

  // Sort nested items within each session
  sessionItems.forEach((item) => {
    item.nested.sort((a, b) => a.ts - b.ts);
  });

  // Standalone items: unclaimed events + unclaimed actions
  const standaloneItems: TimelineItem[] = [];

  journey.events.forEach((e, idx) => {
    if (!claimedEvents.has(idx)) {
      standaloneItems.push({
        type: "standalone",
        ts: new Date(e.created_at).getTime(),
        event: e,
      });
    }
  });

  journey.wallet_actions.forEach((a, idx) => {
    if (!claimedActions.has(idx)) {
      standaloneItems.push({
        type: "standalone",
        ts: new Date(a.created_at).getTime(),
        event: {
          event_type: a.type,
          created_at: a.created_at,
          click_text: null,
          href: null,
          page_path: null,
          is_outbound: null,
          event_data: {},
        } as WalletJourneyEvent,
      });
    }
  });

  // Clean up internal property and return sorted
  const cleaned: TimelineItem[] = sessionItems.map(({ _endMs, ...rest }) => rest);
  return [...cleaned, ...standaloneItems].sort((a, b) => a.ts - b.ts);
}

// --- sub-components ---

function NestedItemRow({ item }: { item: NestedItem }) {
  const time = format(new Date(item.ts), "HH:mm");

  if (item.kind === "action") {
    return (
      <div className="flex items-center gap-2 text-[11px] py-0.5">
        <span className="font-mono text-muted-foreground w-10 shrink-0">{time}</span>
        <ArrowRightLeft className="h-3 w-3 text-primary shrink-0" />
        <span>Wallet {item.data.type}</span>
      </div>
    );
  }

  const e = item.data;
  const walletData = e.event_data as Record<string, any> | undefined;
  const wallets = walletData?.wallets_detected as string[] | undefined;

  // Build human-readable description
  let icon: React.ReactNode;
  let description: React.ReactNode;

  switch (e.event_type) {
    case "wallet_detected":
      icon = <Radio className="h-3 w-3 text-primary shrink-0" />;
      description = (
        <span>
          Wallet detected
          {wallets && wallets.length > 0 && (
            <span className="text-muted-foreground ml-1">— {wallets.join(", ")}</span>
          )}
        </span>
      );
      break;
    case "click":
      icon = <MousePointerClick className="h-3 w-3 text-primary shrink-0" />;
      description = (
        <span className="flex items-center gap-1 min-w-0">
          Clicked{e.click_text ? <> "<span className="font-medium truncate">{e.click_text}</span>"</> : ""}
          {e.page_path && <span className="font-mono text-muted-foreground ml-1 shrink-0">{e.page_path}</span>}
          {e.is_outbound && <ExternalLink className="h-2.5 w-2.5 text-muted-foreground shrink-0" />}
        </span>
      );
      break;
    case "pageview":
      icon = <Eye className="h-3 w-3 text-primary shrink-0" />;
      description = (
        <span>
          Viewed <span className="font-mono">{e.page_path || "—"}</span>
        </span>
      );
      break;
    case "conversion":
      icon = <Zap className="h-3 w-3 text-primary shrink-0" />;
      description = (
        <span>
          Conversion{e.click_text ? `: ${e.click_text}` : ""}
          {e.page_path && <span className="font-mono text-muted-foreground ml-1">{e.page_path}</span>}
        </span>
      );
      break;
    default:
      icon = <Zap className="h-3 w-3 text-muted-foreground shrink-0" />;
      description = (
        <span>
          {e.event_type}
          {e.click_text && <span className="ml-1">"{e.click_text}"</span>}
          {e.page_path && <span className="font-mono text-muted-foreground ml-1">{e.page_path}</span>}
        </span>
      );
  }

  return (
    <div className="flex items-center gap-2 text-[11px] py-0.5 min-w-0">
      <span className="font-mono text-muted-foreground w-10 shrink-0">{time}</span>
      {icon}
      {description}
    </div>
  );
}

function StandaloneRow({ event }: { event: WalletJourneyEvent }) {
  const walletData = event.event_data as Record<string, any> | undefined;
  const wallets = walletData?.wallets_detected as string[] | undefined;
  return (
    <div className="relative pl-6">
      {/* Dot */}
      <div className="absolute left-[4px] top-3 w-[7px] h-[7px] rounded-full border-2 border-primary bg-background" />
      <div className="flex items-center gap-2 text-xs px-3 py-2 border border-border">
        <span className="font-mono text-muted-foreground">
          {format(new Date(event.created_at), "MMM d, HH:mm")}
        </span>
        <Badge variant="outline" className="text-[10px] py-0 px-1.5">
          {event.event_type}
        </Badge>
        <Badge variant="secondary" className="text-[9px] py-0 px-1">
          <Radio className="h-2.5 w-2.5 mr-0.5" /> script
        </Badge>
        {wallets && wallets.length > 0 && (
          <span className="text-muted-foreground text-[11px]">{wallets.join(", ")}</span>
        )}
      </div>
    </div>
  );
}

// --- main component ---

export function WalletJourneyTab({ journey }: WalletJourneyTabProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const timeline = useMemo(() => buildTimeline(journey), [journey]);

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

      {/* Timeline with visual connector */}
      {timeline.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-primary" /> Timeline
          </h4>
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-1">
              {timeline.map((item, idx) => {
                const isLast = idx === timeline.length - 1;

                if (item.type === "standalone") {
                  return <StandaloneRow key={`standalone-${idx}`} event={item.event} />;
                }

                const s = item.session;
                const showArrow = s.session_count > 1 && s.entry_page !== s.exit_page;

                return (
                  <div key={s.session_id} className="relative pl-6">
                    {/* Filled dot */}
                    <div className="absolute left-[4px] top-3 w-[7px] h-[7px] rounded-full bg-primary" />

                    <Collapsible
                      open={expandedSession === s.session_id}
                      onOpenChange={(open) => setExpandedSession(open ? s.session_id : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center justify-between gap-2 text-xs px-3 py-2 border border-border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-muted-foreground">
                              {format(new Date(s.started_at), "MMM d, HH:mm")}
                            </span>
                            <span className="font-medium truncate">
                              {s.entry_page}
                              {showArrow && (
                                <span className="text-muted-foreground"> → {s.exit_page}</span>
                              )}
                            </span>
                            {s.is_bounce && s.session_count === 1 && (
                              <Badge variant="destructive" className="text-[9px] py-0 px-1">bounce</Badge>
                            )}
                            {item.nested.length > 0 && (
                              <Badge variant="secondary" className="text-[9px] py-0 px-1">
                                {item.nested.length} event{item.nested.length !== 1 ? "s" : ""}
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
                        <div className="px-3 py-2 text-[11px] space-y-2 bg-muted/20 border-x border-b border-border">
                          {/* Session metadata */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                            {s.country && (
                              <span>📍 {s.city ? `${s.city}, ` : ""}{s.country}</span>
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
                            {s.session_count > 1 && (
                              <span className="text-primary font-medium">
                                {s.session_count} sessions merged
                              </span>
                            )}
                          </div>

                          {/* Nested events & actions */}
                          {item.nested.length > 0 && (
                            <div className="space-y-1 border-l-2 border-primary/20 pl-2">
                              {item.nested.map((n, ni) => (
                                <NestedItemRow key={ni} item={n} />
                              ))}
                            </div>
                          )}

                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}
            </div>
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
                  <TableCell className="py-1 text-[11px] font-medium">{tx.token_symbol}</TableCell>
                  <TableCell className="py-1">
                    <Badge
                      variant={tx.transfer_direction === "incoming" ? "default" : "outline"}
                      className="text-[10px] py-0 px-1.5"
                    >
                      {tx.transfer_direction}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-1 text-right text-[11px] font-mono tabular-nums">
                    {parseFloat(tx.transfer_value).toLocaleString(undefined, { maximumFractionDigits: 4 })}
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
