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

export function formatOverviewForAI(data: OverviewExportData): string {
  const lines: string[] = [];
  const s = data.scorecard;
  const cs = data.compScorecard;
  const hasComp = !!cs;

  // Header
  lines.push(`AudienceScan Overview | ${data.websiteName} | ${getDateLabel(data.dateRange)}`);
  lines.push("");

  // Scorecard
  if (s) {
    lines.push("SCORECARD");
    const bounceRate = s.pageviews > 0 ? (s.bounce_count / s.pageviews) * 100 : null;
    const cBounceRate = cs && cs.pageviews > 0 ? (cs.bounce_count / cs.pageviews) * 100 : null;

    lines.push(
      `Pageviews: ${num(s.pageviews)}${delta(s.pageviews, cs?.pageviews)}  ` +
      `Visitors: ${num(s.unique_visitors)}${delta(s.unique_visitors, cs?.unique_visitors)}  ` +
      `Bounce: ${bounceRate !== null ? pct(bounceRate) : "–"}${bounceRate !== null && cBounceRate !== null ? ` (${(bounceRate - cBounceRate) >= 0 ? "+" : ""}${(bounceRate - cBounceRate).toFixed(1)}pp)` : ""}`
    );

    if (s.wallet_users !== null || s.converted_users !== null) {
      let line2 = "";
      if (s.wallet_users !== null) line2 += `Wallets: ${num(s.wallet_users)}${delta(s.wallet_users, cs?.wallet_users)}  `;
      if (s.converted_users !== null) line2 += `Conversions: ${num(s.converted_users)}${delta(s.converted_users, cs?.converted_users)}  `;
      const ht = holderTotal(data.holderData);
      const cht = data.compHolderData ? holderTotal(data.compHolderData) : null;
      if (ht !== null) line2 += `Holders: ${num(ht)}${delta(ht, cht)}`;
      if (line2.trim()) lines.push(line2.trim());
    }

    if (s.wallets_enriched !== null) {
      let line3 = `Enriched: ${num(s.wallets_enriched)}/${num(s.wallet_users)} (${pct(s.percent_enriched)})  `;
      line3 += `Median Bal: ${usd(s.median_balance_usd)}  Total Bal: ${usd(s.total_balance_usd)}`;
      lines.push(line3);
    }

    lines.push("");
  }

  // Daily trend (compact – skip if no rows)
  if (data.dailyRows.length > 0) {
    lines.push("DAILY TREND (date | visitors | wallets | conversions)");
    const compMap = new Map((data.compDailyRows ?? []).map(r => [r.dim_value, r]));
    for (const r of data.dailyRows) {
      const d = r.dim_value; // date string
      let line = `${d}: ${r.unique_visitors}`;
      if (r.wallet_users !== null) line += ` | ${r.wallet_users}`;
      if (r.converted_users !== null) line += ` | ${r.converted_users}`;
      lines.push(line);
    }
    lines.push("");
  }

  // Dimension table
  if (data.dimensionRows.length > 0) {
    const dimLabel = data.dimensionName.replace(/_/g, " ").toUpperCase();
    lines.push(`TOP ${dimLabel} (source | visitors | wallets | bounce%)`);
    const compMap = new Map((data.compDimensionRows ?? []).map(r => [r.dim_value, r]));
    for (const r of data.dimensionRows.slice(0, 20)) {
      const cr = compMap.get(r.dim_value);
      const br = r.pageviews > 0 ? ((r.bounce_count / r.pageviews) * 100).toFixed(0) + "%" : "–";
      let line = `${r.dim_value}: ${num(r.unique_visitors)}${delta(r.unique_visitors, cr?.unique_visitors)}`;
      if (r.wallet_users !== null) line += ` | ${r.wallet_users}`;
      line += ` | ${br}`;
      lines.push(line);
    }
    lines.push("");
  }

  // Events
  if (data.eventsRows.length > 0) {
    lines.push("EVENTS (type | count | delta)");
    const compMap = new Map((data.compEventsRows ?? []).map(r => [r.event_type, r]));
    for (const r of data.eventsRows) {
      const cr = compMap.get(r.event_type);
      lines.push(`${r.event_type}: ${num(r.event_count)}${delta(r.event_count, cr?.event_count)}`);
    }
    lines.push("");
  }

  // Wallet actions
  if (data.walletsRows.length > 0) {
    lines.push("WALLET ACTIONS (action | count | delta)");
    const compMap = new Map((data.compWalletsRows ?? []).map(r => [r.action_type, r]));
    for (const r of data.walletsRows) {
      const cr = compMap.get(r.action_type);
      lines.push(`${r.action_type}: ${num(r.action_count)}${delta(r.action_count, cr?.action_count)}`);
    }
    lines.push("");
  }

  // Wallet extensions
  if (data.walletExtensionsRows.length > 0) {
    lines.push("WALLET EXTENSIONS (type | count)");
    for (const r of data.walletExtensionsRows) {
      lines.push(`${r.wallet_type}: ${num(r.count)}`);
    }
    lines.push("");
  }

  // Wallet distribution
  if (data.walletDistributionRows.length > 0) {
    lines.push("WALLET DISTRIBUTION (tier | wallets | total_usd)");
    const compMap = new Map((data.compWalletDistributionRows ?? []).map(r => [r.tier, r]));
    for (const r of data.walletDistributionRows) {
      const cr = compMap.get(r.tier);
      lines.push(`${r.tier}: ${r.wallet_count}${delta(r.wallet_count, cr?.wallet_count)} | ${usd(r.total_usd)}`);
    }
    lines.push("");
  }

  // Clicks
  if (data.clicksRows.length > 0) {
    lines.push("CLICKS (text | url | count | delta)");
    const compMap = new Map((data.compClicksRows ?? []).map(r => [`${r.click_text}|${r.href}`, r]));
    for (const r of data.clicksRows.slice(0, 20)) {
      const cr = compMap.get(`${r.click_text}|${r.href}`);
      lines.push(`${r.click_text}: ${r.href} | ${num(r.click_count)}${delta(r.click_count, cr?.click_count)}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}
