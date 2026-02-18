import {
  ScorecardResponse,
  TableRow,
  EventsTableRow,
  WalletsTableRow,
  WalletExtensionsRow,
  WalletDistributionRow,
  ClicksTableRow,
  HolderDataPoint,
  TableDimension,
} from "./api";
import { DateRangeValue } from "@/components/overview/DateRangePicker";
import { format, subDays } from "date-fns";

interface OverviewExportData {
  websiteName: string;
  dateRange: DateRangeValue;
  scorecard: ScorecardResponse["data"] | null;
  dailyRows: TableRow[];
  dimensionRows: TableRow[];
  dimensionName: TableDimension;
  eventsRows: EventsTableRow[];
  walletsRows: WalletsTableRow[];
  walletExtensionsRows: WalletExtensionsRow[];
  walletDistributionRows: WalletDistributionRow[];
  clicksRows: ClicksTableRow[];
  holderData: HolderDataPoint[];
  activeFilters?: Record<string, string | string[]>;
  // Comparison data (optional)
  compScorecard?: ScorecardResponse["data"] | null;
  compDailyRows?: TableRow[];
  compDimensionRows?: TableRow[];
  compEventsRows?: EventsTableRow[];
  compWalletsRows?: WalletsTableRow[];
  compWalletExtensionsRows?: WalletExtensionsRow[];
  compWalletDistributionRows?: WalletDistributionRow[];
  compClicksRows?: ClicksTableRow[];
  compHolderData?: HolderDataPoint[];
}

function num(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function usd(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function pct(n: number | null | undefined): string {
  if (n === null || n === undefined) return "–";
  return `${n.toFixed(1)}%`;
}

function delta(current: number | null | undefined, previous: number | null | undefined): string {
  if (current === null || current === undefined || previous === null || previous === undefined) return "";
  if (previous === 0) return current > 0 ? " (+∞)" : "";
  const change = ((current - previous) / Math.abs(previous)) * 100;
  const sign = change >= 0 ? "+" : "";
  return ` (${sign}${change.toFixed(0)}%)`;
}

function ppDelta(current: number | null, previous: number | null): string {
  if (current === null || previous === null) return "";
  const diff = current - previous;
  const sign = diff >= 0 ? "+" : "";
  return ` (${sign}${diff.toFixed(1)}pp)`;
}

function getDateLabel(dr: DateRangeValue): string {
  const today = new Date();
  if (dr.type === "custom" && dr.from && dr.to) {
    return `${format(dr.from, "MMM d")}–${format(dr.to, "MMM d yyyy")}`;
  }
  if (dr.includeToday && dr.days === 0) return format(today, "MMM d yyyy");
  const days = dr.days || 7;
  const from = dr.includeToday
    ? subDays(today, days - 1)
    : subDays(today, days);
  const to = dr.includeToday ? today : subDays(today, 1);
  return `${format(from, "MMM d")}–${format(to, "MMM d yyyy")}`;
}

function holderTotal(data: HolderDataPoint[]): number | null {
  if (!data || data.length === 0) return null;
  const latestDate = data.reduce((l, i) => (i.date > l ? i.date : l), data[0].date);
  return data.filter(i => i.date === latestDate).reduce((s, i) => s + i.holder_count, 0);
}

function bounceRate(pv: number, bc: number): number | null {
  return pv > 0 ? (bc / pv) * 100 : null;
}

// ── Formatters ──

function formatHeader(data: OverviewExportData): string[] {
  const lines: string[] = [];
  lines.push(`AudienceScan Overview | ${data.websiteName} | ${getDateLabel(data.dateRange)}`);
  if (data.activeFilters && Object.keys(data.activeFilters).length > 0) {
    const parts = Object.entries(data.activeFilters).map(([k, v]) =>
      `${k}=${Array.isArray(v) ? v.join(",") : v}`
    );
    lines.push(`Filters: ${parts.join(", ")}`);
  }
  lines.push("");
  return lines;
}

function formatScorecard(data: OverviewExportData): string[] {
  const s = data.scorecard;
  if (!s) return [];
  const cs = data.compScorecard;
  const lines: string[] = ["SCORECARD"];

  const br = bounceRate(s.pageviews, s.bounce_count);
  const cbr = cs ? bounceRate(cs.pageviews, cs.bounce_count) : null;

  lines.push(
    `Pageviews: ${num(s.pageviews)}${delta(s.pageviews, cs?.pageviews)}  ` +
    `Visitors: ${num(s.unique_visitors)}${delta(s.unique_visitors, cs?.unique_visitors)}  ` +
    `Bounce: ${br !== null ? pct(br) : "–"}${ppDelta(br, cbr)}`
  );

  // Engagement
  lines.push(
    `Stayed 10s: ${num(s.stayed_10s)}${delta(s.stayed_10s, cs?.stayed_10s)}  ` +
    `30s: ${num(s.stayed_30s)}${delta(s.stayed_30s, cs?.stayed_30s)}  ` +
    `60s: ${num(s.stayed_60s)}${delta(s.stayed_60s, cs?.stayed_60s)}  ` +
    `5m: ${num(s.stayed_5m)}${delta(s.stayed_5m, cs?.stayed_5m)}`
  );

  // Bots
  if (s.bot_visitors !== null) {
    lines.push(`Bots: ${num(s.bot_visitors)}${delta(s.bot_visitors, cs?.bot_visitors)} / ${num(s.bot_checked)} checked`);
  }

  // Wallets, extensions, conversions, holders
  const parts: string[] = [];
  if (s.wallet_users !== null) parts.push(`Wallets: ${num(s.wallet_users)}${delta(s.wallet_users, cs?.wallet_users)}`);
  if (s.visitors_with_wallet_extension !== null) parts.push(`Wallet Ext: ${num(s.visitors_with_wallet_extension)}${delta(s.visitors_with_wallet_extension, cs?.visitors_with_wallet_extension)}`);
  if (s.converted_users !== null) parts.push(`Conversions: ${num(s.converted_users)}${delta(s.converted_users, cs?.converted_users)}`);
  if (s.conversions_total !== null) parts.push(`Conv Total: ${num(s.conversions_total)}${delta(s.conversions_total, cs?.conversions_total)}`);
  const ht = holderTotal(data.holderData);
  const cht = data.compHolderData ? holderTotal(data.compHolderData) : null;
  if (ht !== null) parts.push(`Holders: ${num(ht)}${delta(ht, cht)}`);
  if (parts.length) lines.push(parts.join("  "));

  // Enrichment
  if (s.wallets_enriched !== null) {
    lines.push(
      `Enriched: ${num(s.wallets_enriched)}${delta(s.wallets_enriched, cs?.wallets_enriched)}/${num(s.wallet_users)} (${pct(s.percent_enriched)})  ` +
      `Median Bal: ${usd(s.median_balance_usd)}${delta(s.median_balance_usd, cs?.median_balance_usd)}  ` +
      `Total Bal: ${usd(s.total_balance_usd)}${delta(s.total_balance_usd, cs?.total_balance_usd)}`
    );
  }

  if (s.cost_total !== null) {
    lines.push(`Cost Total: ${usd(s.cost_total)}${delta(s.cost_total, cs?.cost_total)}`);
  }

  lines.push("");
  return lines;
}

function formatDailyTrend(data: OverviewExportData): string[] {
  if (data.dailyRows.length === 0) return [];
  const lines: string[] = ["DAILY TREND (date | visitors | wallets | conversions)"];
  const compMap = new Map((data.compDailyRows ?? []).map(r => [r.dim_value, r]));

  for (const r of data.dailyRows) {
    const cr = compMap.get(r.dim_value);
    let line = `${r.dim_value}: ${r.unique_visitors}${delta(r.unique_visitors, cr?.unique_visitors)}`;
    if (r.wallet_users !== null) line += ` | ${r.wallet_users}${delta(r.wallet_users, cr?.wallet_users)}`;
    if (r.converted_users !== null) line += ` | ${r.converted_users}${delta(r.converted_users, cr?.converted_users)}`;
    lines.push(line);
  }
  lines.push("");
  return lines;
}

function formatDimensionTable(data: OverviewExportData): string[] {
  if (data.dimensionRows.length === 0) return [];
  const dimLabel = data.dimensionName.replace(/_/g, " ").toUpperCase();
  const lines: string[] = [`TOP ${dimLabel} (source | pv | visitors | bounce% | wallets | conversions)`];
  const compMap = new Map((data.compDimensionRows ?? []).map(r => [r.dim_value, r]));

  for (const r of data.dimensionRows) {
    const cr = compMap.get(r.dim_value);
    const br = bounceRate(r.pageviews, r.bounce_count);
    const cbr = cr ? bounceRate(cr.pageviews, cr.bounce_count) : null;

    let line = `${r.dim_value}: pv ${num(r.pageviews)}${delta(r.pageviews, cr?.pageviews)}`;
    line += ` | ${num(r.unique_visitors)}${delta(r.unique_visitors, cr?.unique_visitors)}`;
    line += ` | bounce ${br !== null ? pct(br) : "–"}${ppDelta(br, cbr)}`;
    if (r.wallet_users !== null) line += ` | wallets ${r.wallet_users}${delta(r.wallet_users, cr?.wallet_users)}`;
    if (r.converted_users !== null) line += ` | conv ${r.converted_users}${delta(r.converted_users, cr?.converted_users)}`;
    if (r.wallets_enriched !== null) line += ` | enriched ${r.wallets_enriched}${delta(r.wallets_enriched, cr?.wallets_enriched)}`;
    if (r.median_balance_usd !== null) line += ` | med_bal ${usd(r.median_balance_usd)}${delta(r.median_balance_usd, cr?.median_balance_usd)}`;
    lines.push(line);
  }
  lines.push("");
  return lines;
}

function formatEvents(data: OverviewExportData): string[] {
  if (data.eventsRows.length === 0) return [];
  const lines: string[] = ["EVENTS (type | count | delta)"];
  const compMap = new Map((data.compEventsRows ?? []).map(r => [r.event_type, r]));
  for (const r of data.eventsRows) {
    const cr = compMap.get(r.event_type);
    lines.push(`${r.event_type}: ${num(r.event_count)}${delta(r.event_count, cr?.event_count)}`);
  }
  lines.push("");
  return lines;
}

function formatWalletActions(data: OverviewExportData): string[] {
  if (data.walletsRows.length === 0) return [];
  const lines: string[] = ["WALLET ACTIONS (action | count | delta)"];
  const compMap = new Map((data.compWalletsRows ?? []).map(r => [r.action_type, r]));
  for (const r of data.walletsRows) {
    const cr = compMap.get(r.action_type);
    lines.push(`${r.action_type}: ${num(r.action_count)}${delta(r.action_count, cr?.action_count)}`);
  }
  lines.push("");
  return lines;
}

function formatWalletExtensions(data: OverviewExportData): string[] {
  if (data.walletExtensionsRows.length === 0) return [];
  const lines: string[] = ["WALLET EXTENSIONS (type | count | delta)"];
  const compMap = new Map((data.compWalletExtensionsRows ?? []).map(r => [r.wallet_type, r]));
  for (const r of data.walletExtensionsRows) {
    const cr = compMap.get(r.wallet_type);
    lines.push(`${r.wallet_type}: ${num(r.count)}${delta(r.count, cr?.count)}`);
  }
  lines.push("");
  return lines;
}

function formatWalletDistribution(data: OverviewExportData): string[] {
  if (data.walletDistributionRows.length === 0) return [];
  const lines: string[] = ["WALLET DISTRIBUTION (tier | wallets | total_usd)"];
  const compMap = new Map((data.compWalletDistributionRows ?? []).map(r => [r.tier, r]));
  for (const r of data.walletDistributionRows) {
    const cr = compMap.get(r.tier);
    lines.push(`${r.tier}: ${r.wallet_count}${delta(r.wallet_count, cr?.wallet_count)} | ${usd(r.total_usd)}${delta(r.total_usd, cr?.total_usd)}`);
  }
  lines.push("");
  return lines;
}

function formatClicks(data: OverviewExportData): string[] {
  if (data.clicksRows.length === 0) return [];
  const lines: string[] = ["CLICKS (text | url | clicks | visitors)"];
  const compMap = new Map((data.compClicksRows ?? []).map(r => [`${r.click_text}|${r.href}`, r]));
  for (const r of data.clicksRows) {
    const cr = compMap.get(`${r.click_text}|${r.href}`);
    lines.push(`${r.click_text}: ${r.href} | ${num(r.click_count)}${delta(r.click_count, cr?.click_count)} | visitors ${num(r.unique_visitors)}${delta(r.unique_visitors, cr?.unique_visitors)}`);
  }
  lines.push("");
  return lines;
}

export function formatOverviewForAI(data: OverviewExportData): string {
  return [
    ...formatHeader(data),
    ...formatScorecard(data),
    ...formatDailyTrend(data),
    ...formatDimensionTable(data),
    ...formatEvents(data),
    ...formatWalletActions(data),
    ...formatWalletExtensions(data),
    ...formatWalletDistribution(data),
    ...formatClicks(data),
  ].join("\n").trim();
}
