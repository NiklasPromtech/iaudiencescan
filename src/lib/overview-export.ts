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

// ── Helpers ──

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

function bounceRate(pv: number, bc: number): number | null {
  return pv > 0 ? (bc / pv) * 100 : null;
}

/** Append a metric to parts array if non-null */
function m(parts: string[], label: string, val: number | null | undefined, compVal?: number | null | undefined, fmt: "num" | "usd" | "pct" = "num") {
  if (val === null || val === undefined) return;
  const formatted = fmt === "usd" ? usd(val) : fmt === "pct" ? pct(val) : num(val);
  parts.push(`${label} ${formatted}${delta(val, compVal)}`);
}

function getDateLabel(dr: DateRangeValue): string {
  const today = new Date();
  if (dr.type === "custom" && dr.from && dr.to) {
    return `${format(dr.from, "MMM d")}–${format(dr.to, "MMM d yyyy")}`;
  }
  if (dr.includeToday && dr.days === 0) return format(today, "MMM d yyyy");
  const days = dr.days || 7;
  const from = dr.includeToday ? subDays(today, days - 1) : subDays(today, days);
  const to = dr.includeToday ? today : subDays(today, 1);
  return `${format(from, "MMM d")}–${format(to, "MMM d yyyy")}`;
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

  // Traffic
  const traffic: string[] = [];
  m(traffic, "pv", s.pageviews, cs?.pageviews);
  m(traffic, "vis", s.unique_visitors, cs?.unique_visitors);
  traffic.push(`bounce ${br !== null ? pct(br) : "–"}${ppDelta(br, cbr)}`);
  lines.push(traffic.join(" | "));

  // Engagement
  const eng: string[] = [];
  m(eng, "stayed10s", s.stayed_10s, cs?.stayed_10s);
  m(eng, "stayed30s", s.stayed_30s, cs?.stayed_30s);
  m(eng, "stayed60s", s.stayed_60s, cs?.stayed_60s);
  m(eng, "stayed5m", s.stayed_5m, cs?.stayed_5m);
  if (eng.length) lines.push(eng.join(" | "));

  // Bots
  if (s.bot_visitors !== null) {
    lines.push(`bots ${num(s.bot_visitors)}${delta(s.bot_visitors, cs?.bot_visitors)} / ${num(s.bot_checked)} checked`);
  }

  // Wallets, extensions, conversions
  const conv: string[] = [];
  m(conv, "wallets", s.wallet_users, cs?.wallet_users);
  m(conv, "wallet_ext", s.visitors_with_wallet_extension, cs?.visitors_with_wallet_extension);
  m(conv, "conv", s.converted_users, cs?.converted_users);
  m(conv, "conv_tot", s.conversions_total, cs?.conversions_total);
  if (conv.length) lines.push(conv.join(" | "));

  // Enrichment
  const enrich: string[] = [];
  m(enrich, "enriched", s.wallets_enriched, cs?.wallets_enriched);
  if (s.percent_enriched !== null) enrich.push(`(${pct(s.percent_enriched)})`);
  m(enrich, "med_bal", s.median_balance_usd, cs?.median_balance_usd, "usd");
  m(enrich, "tot_bal", s.total_balance_usd, cs?.total_balance_usd, "usd");
  m(enrich, "not_enriched", (s as any).wallets_not_enriched, (cs as any)?.wallets_not_enriched);
  m(enrich, "enrich_failed", (s as any).wallets_enrichment_failed, (cs as any)?.wallets_enrichment_failed);
  if (enrich.length) lines.push(enrich.join(" | "));

  // Cost
  if (s.cost_total !== null) {
    lines.push(`cost_total ${usd(s.cost_total)}${delta(s.cost_total, cs?.cost_total)}`);
  }

  lines.push("");
  return lines;
}

/** Format a full TableRow into compact key-value pairs with deltas */
function formatTableRowMetrics(r: TableRow, cr?: TableRow): string {
  const p: string[] = [];
  const br = bounceRate(r.pageviews, r.bounce_count);
  const cbr = cr ? bounceRate(cr.pageviews, cr.bounce_count) : null;

  m(p, "pv", r.pageviews, cr?.pageviews);
  m(p, "vis", r.unique_visitors, cr?.unique_visitors);
  p.push(`bounce ${br !== null ? pct(br) : "–"}${ppDelta(br, cbr)}`);
  m(p, "stayed10s", r.stayed_10s, cr?.stayed_10s);
  m(p, "stayed30s", r.stayed_30s, cr?.stayed_30s);
  m(p, "stayed60s", r.stayed_60s, cr?.stayed_60s);
  m(p, "stayed5m", r.stayed_5m, cr?.stayed_5m);
  m(p, "bots", r.bot_visitors, cr?.bot_visitors);
  m(p, "bot_checked", r.bot_checked, cr?.bot_checked);
  m(p, "wallets", r.wallet_users, cr?.wallet_users);
  m(p, "conv", r.converted_users, cr?.converted_users);
  m(p, "conv_tot", r.conversions_total, cr?.conversions_total);
  m(p, "cost", r.cost_total, cr?.cost_total, "usd");
  m(p, "enriched", r.wallets_enriched, cr?.wallets_enriched);
  if (r.percent_enriched !== null) p.push(`enrich% ${pct(r.percent_enriched)}`);
  m(p, "med_bal", r.median_balance_usd, cr?.median_balance_usd, "usd");
  m(p, "tot_bal", r.total_balance_usd, cr?.total_balance_usd, "usd");
  m(p, "wallet_ext", r.visitors_with_wallet_extension, cr?.visitors_with_wallet_extension);

  return p.join(" | ");
}

function formatDailyTrend(data: OverviewExportData): string[] {
  if (data.dailyRows.length === 0) return [];
  const lines: string[] = ["DAILY TREND"];
  const compMap = new Map((data.compDailyRows ?? []).map(r => [r.dim_value, r]));

  for (const r of data.dailyRows) {
    const cr = compMap.get(r.dim_value);
    lines.push(`${r.dim_value}: ${formatTableRowMetrics(r, cr)}`);
  }
  lines.push("");
  return lines;
}

function formatDimensionTable(data: OverviewExportData): string[] {
  if (data.dimensionRows.length === 0) return [];
  const dimLabel = data.dimensionName.replace(/_/g, " ").toUpperCase();
  const lines: string[] = [`BY ${dimLabel}`];
  const compMap = new Map((data.compDimensionRows ?? []).map(r => [r.dim_value, r]));

  for (const r of data.dimensionRows) {
    const cr = compMap.get(r.dim_value);
    lines.push(`${r.dim_value}: ${formatTableRowMetrics(r, cr)}`);
  }
  lines.push("");
  return lines;
}

function formatEvents(data: OverviewExportData): string[] {
  if (data.eventsRows.length === 0) return [];
  const lines: string[] = ["EVENTS"];
  const compMap = new Map((data.compEventsRows ?? []).map(r => [r.event_type, r]));
  for (const r of data.eventsRows) {
    const cr = compMap.get(r.event_type);
    const p: string[] = [
      `count ${num(r.event_count)}${delta(r.event_count, cr?.event_count)}`,
      `users ${num(r.unique_users)}${delta(r.unique_users, cr?.unique_users)}`,
    ];
    if (r.first_seen) p.push(`first ${r.first_seen}`);
    if (r.last_seen) p.push(`last ${r.last_seen}`);
    lines.push(`${r.event_type}: ${p.join(" | ")}`);
  }
  lines.push("");
  return lines;
}

function formatWalletActions(data: OverviewExportData): string[] {
  if (data.walletsRows.length === 0) return [];
  const lines: string[] = ["WALLET ACTIONS"];
  const compMap = new Map((data.compWalletsRows ?? []).map(r => [r.action_type, r]));
  for (const r of data.walletsRows) {
    const cr = compMap.get(r.action_type);
    const p: string[] = [
      `count ${num(r.action_count)}${delta(r.action_count, cr?.action_count)}`,
      `unique ${num(r.unique_wallets)}${delta(r.unique_wallets, cr?.unique_wallets)}`,
    ];
    if (r.first_seen) p.push(`first ${r.first_seen}`);
    if (r.last_seen) p.push(`last ${r.last_seen}`);
    lines.push(`${r.action_type}: ${p.join(" | ")}`);
  }
  lines.push("");
  return lines;
}

function formatWalletExtensions(data: OverviewExportData): string[] {
  if (data.walletExtensionsRows.length === 0) return [];
  const lines: string[] = ["WALLET EXTENSIONS"];
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
  const lines: string[] = ["WALLET DISTRIBUTION"];
  const compMap = new Map((data.compWalletDistributionRows ?? []).map(r => [r.tier, r]));
  for (const r of data.walletDistributionRows) {
    const cr = compMap.get(r.tier);
    lines.push(`${r.tier}: ${r.wallet_count}${delta(r.wallet_count, cr?.wallet_count)} wallets | ${usd(r.total_usd)}${delta(r.total_usd, cr?.total_usd)} | ${pct(r.percentage)}`);
  }
  lines.push("");
  return lines;
}

function formatClicks(data: OverviewExportData): string[] {
  if (data.clicksRows.length === 0) return [];
  const lines: string[] = ["CLICKS"];
  const compMap = new Map((data.compClicksRows ?? []).map(r => [`${r.click_text}|${r.href}`, r]));
  for (const r of data.clicksRows) {
    const cr = compMap.get(`${r.click_text}|${r.href}`);
    lines.push(`${r.click_text}: ${r.href} (page: ${r.page_path}) | clicks ${num(r.click_count)}${delta(r.click_count, cr?.click_count)} | vis ${num(r.unique_visitors)}${delta(r.unique_visitors, cr?.unique_visitors)}`);
  }
  lines.push("");
  return lines;
}

function formatHolderTrend(data: OverviewExportData): string[] {
  if (!data.holderData || data.holderData.length === 0) return [];
  const lines: string[] = ["HOLDER TREND"];
  const compMap = new Map<string, number>();
  if (data.compHolderData) {
    for (const h of data.compHolderData) {
      const key = `${h.date}|${h.contract_address}`;
      compMap.set(key, (compMap.get(key) || 0) + h.holder_count);
    }
  }

  // Sort by date desc
  const sorted = [...data.holderData].sort((a, b) => b.date.localeCompare(a.date));
  for (const h of sorted) {
    const key = `${h.date}|${h.contract_address}`;
    const ch = compMap.get(key);
    const addr = h.contract_address.length > 10
      ? `${h.contract_address.slice(0, 6)}...${h.contract_address.slice(-4)}`
      : h.contract_address;
    lines.push(`${h.date}: ${h.chain_id} | ${addr} | ${num(h.holder_count)}${delta(h.holder_count, ch)}`);
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
    ...formatHolderTrend(data),
  ].join("\n").trim();
}
