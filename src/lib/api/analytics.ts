import { getAuthToken, ANALYTICS_API_URL } from "./client";
import type { CostSource } from "./costs";

// Range config
export type RangeConfig = 
  | { type: "last_full_days"; days: number; timezone: string }
  | { type: "custom"; from: string; to: string; timezone: string };

// Filter types
export interface FilterOptions {
  sources: string[];
  utm_source: string[];
  utm_medium: string[];
  utm_campaign: string[];
  utm_content: string[];
  utm_term: string[];
  devices: string[];
  browsers: string[];
  os: string[];
  countries: string[];
  bot_status: string[];
  conversion_events: string[];
  wallet_types?: string[];
  wallet_chains?: string[];
}

export type ActiveFilters = Partial<Record<string, string[]>>;

export interface FilterOptionItem {
  value: string;
  count: number;
}

export interface FilterOptionsResponse {
  success: boolean;
  tag_id: string;
  sources?: FilterOptionItem[] | string[];
  utm_source?: FilterOptionItem[] | string[];
  utm_medium?: FilterOptionItem[] | string[];
  utm_campaign?: FilterOptionItem[] | string[];
  utm_content?: FilterOptionItem[] | string[];
  utm_term?: FilterOptionItem[] | string[];
  countries?: FilterOptionItem[] | string[];
  conversion_events?: FilterOptionItem[] | string[];
  wallet_actions?: FilterOptionItem[] | string[];
  wallet_tiers?: FilterOptionItem[] | string[];
  cost_sources?: Array<{ id: string; name: string; dimension: string }>;
}

export interface FilterOptionsRequest {
  tag_id: string;
  range?: RangeConfig;
}

export async function fetchFilterOptions(request: FilterOptionsRequest): Promise<FilterOptionsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/filtering`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Scorecard types
export interface ScorecardRequest {
  tag_id: string;
  conversion_events?: string[];
  range: RangeConfig;
  filters?: Record<string, string[]>;
  cost?: { mode: "none" | "manual" | "auto" };
}

export interface ScorecardResponse {
  success: boolean;
  tag_id: string;
  range: { from: string; to: string; timezone: string };
  filters: Record<string, string[]>;
  filter_options: FilterOptions;
  conversion_events: string[];
  conversion_events_configured: boolean;
  cost: number | null;
  cost_configured: boolean;
  data: {
    pageviews: number;
    unique_visitors: number;
    bounce_count: number;
    stayed_10s: number;
    stayed_30s: number;
    stayed_60s: number;
    stayed_5m: number;
    wallet_users: number | null;
    converted_users: number | null;
    conversions_total: number | null;
    bot_visitors: number | null;
    bot_checked: number | null;
    cost_total: number | null;
    wallets_enriched: number | null;
    percent_enriched: number | null;
    total_balance_usd: number | null;
    median_balance_usd: number | null;
    wallets_not_enriched: number | null;
    wallets_enrichment_failed: number | null;
    visitors_with_wallet_extension: number | null;
    token_holders: number | null;
  };
}

// Table types
export type TableDimension = 
  | "referrer_domain" | "utm_source" | "utm_medium" | "utm_campaign" 
  | "utm_content" | "utm_term" | "date_day" | "device_type" 
  | "browser" | "os" | "country" | "time_on_site";

export interface TableRequest {
  tag_id: string;
  dimension: TableDimension;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  conversion_events?: string[];
  cost?: { mode: "none" | "utm" | "source" | "campaign"; cost_source_id?: string };
  pagination?: { limit?: number; offset?: number };
}

export interface TableRow {
  dim_value: string;
  pageviews: number;
  unique_visitors: number;
  wallet_users: number | null;
  converted_users: number | null;
  conversions_total: number | null;
  bounce_count: number;
  bot_visitors: number | null;
  bot_checked: number | null;
  stayed_10s: number;
  stayed_30s: number;
  stayed_60s: number;
  stayed_5m: number;
  cost_total: number | null;
  cost_per_visitor: number | null;
  cost_per_conversion: number | null;
  cost_per_pageview: number | null;
  cost_per_stayed_10s: number | null;
  cost_per_stayed_30s: number | null;
  cost_per_stayed_60s: number | null;
  cost_per_stayed_5m: number | null;
  cost_per_wallet: number | null;
  wallets_enriched: number | null;
  percent_enriched: number | null;
  total_balance_usd: number | null;
  median_balance_usd: number | null;
  visitors_with_wallet_extension: number | null;
}

export interface TableResponse {
  success: boolean;
  tag_id: string;
  dimension: TableDimension;
  range: { from: string; to: string; timezone: string };
  filters: Record<string, string[]>;
  conversion_events: string[];
  conversion_events_configured: boolean;
  cost: number | null;
  cost_configured: boolean;
  pagination: { limit: number; offset: number; total_rows: number };
  rows: TableRow[];
}

// Tracking status
export interface DailyBreakdownItem {
  date: string;
  pageviews: number;
  events: number;
  wallets: number;
  total: number;
}

export interface TrackingStatusResponse {
  success: boolean;
  tag_id: string;
  is_tracking: boolean;
  first_tracked_at: string;
  last_tracked_at: string;
  days_active: number;
  total_tracked?: number;
  daily_breakdown?: DailyBreakdownItem[];
}

export async function fetchTrackingStatus(tagId: string): Promise<TrackingStatusResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/tracking-status/${tagId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchScorecard(request: ScorecardRequest): Promise<ScorecardResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/scorecard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchTableData(request: TableRequest): Promise<TableResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Dimension to filter mapping
export const DIMENSION_TO_FILTER: Partial<Record<TableDimension, keyof FilterOptions>> = {
  referrer_domain: "sources",
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_content: "utm_content",
  utm_term: "utm_term",
  device_type: "devices",
  browser: "browsers",
  os: "os",
  country: "countries",
};

// Events Table
export interface EventsTableRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  sort?: { by: "event_count" | "unique_users" | "first_seen" | "last_seen"; dir: "asc" | "desc" };
  pagination?: { limit?: number; offset?: number };
}

export interface EventsTableRow {
  event_type: string;
  event_count: number;
  unique_users: number;
  first_seen: string;
  last_seen: string;
}

export interface EventsTableResponse {
  success: boolean;
  rows: EventsTableRow[];
  pagination: { limit: number; offset: number; total_rows: number };
}

export async function fetchEventsTable(request: EventsTableRequest): Promise<EventsTableResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Wallets Table (actions breakdown)
export interface WalletsTableRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  sort?: { by: "action_count" | "unique_wallets" | "first_seen" | "last_seen"; dir: "asc" | "desc" };
  pagination?: { limit?: number; offset?: number };
}

export interface WalletsTableRow {
  action_type: string;
  action_count: number;
  unique_wallets: number;
  first_seen: string;
  last_seen: string;
}

export interface WalletsTableResponse {
  success: boolean;
  rows: WalletsTableRow[];
  pagination: { limit: number; offset: number; total_rows: number };
}

export async function fetchWalletsTable(request: WalletsTableRequest): Promise<WalletsTableResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/wallets-table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Wallet Extensions
export interface WalletExtensionsRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
}

export interface WalletExtensionsRow {
  wallet_type: string;
  count: number;
  unique_visitors?: number;
}

export interface WalletExtensionsResponse {
  success: boolean;
  total_with_extension?: number;
  rows: WalletExtensionsRow[];
  pagination?: { limit: number; offset: number; total_rows: number };
}

export async function fetchWalletExtensions(request: WalletExtensionsRequest): Promise<WalletExtensionsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/wallet-extensions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Wallet Distribution
export interface WalletDistributionRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  sort?: { by: "wallet_count" | "total_usd" | "tier_order" | "percentage"; dir: "asc" | "desc" };
  pagination?: { limit?: number; offset?: number };
}

export interface WalletDistributionRow {
  tier: string;
  wallet_count: number;
  total_usd: number;
  percentage: number;
  tier_order: number;
}

export interface WalletDistributionResponse {
  success: boolean;
  rows: WalletDistributionRow[];
  pagination?: { limit: number; offset: number; total_rows: number };
}

export async function fetchWalletDistribution(request: WalletDistributionRequest): Promise<WalletDistributionResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/wallet-distribution`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Clicks Table
export interface ClicksTableRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  sort?: { by: "click_count" | "unique_visitors" | "click_text" | "href" | "page_path"; dir: "asc" | "desc" };
  pagination?: { limit?: number; offset?: number };
}

export interface ClicksTableRow {
  click_text: string;
  href: string;
  page_path: string;
  click_count: number;
  unique_visitors: number;
}

export interface ClicksTableResponse {
  success: boolean;
  rows: ClicksTableRow[];
  pagination?: { limit: number; offset: number; total_rows: number };
}

export async function fetchClicksTable(request: ClicksTableRequest): Promise<ClicksTableResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/clicks-table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Realtime
export interface RealtimeResponse {
  success: boolean;
  tag_id: string;
  active_visitors: number;
  window_minutes: number;
  timestamp: string;
}

export async function fetchRealtimeVisitors(tagId: string, window?: number): Promise<RealtimeResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const params = window ? `?window=${window}` : "";
  const response = await fetch(`${ANALYTICS_API_URL}/analytics/realtime/${tagId}${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Holder Analytics
export interface HolderDataPoint {
  date: string;
  holder_count: number;
  contract_address: string;
  chain_id: string;
}

export interface HoldersRequest {
  tag_id: string;
  contract_id?: string;
  range: { from: string; to: string };
}

export interface HoldersResponse {
  success: boolean;
  data: HolderDataPoint[];
}

export async function fetchHoldersData(request: HoldersRequest): Promise<HoldersResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/holders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Unified Overview endpoint
export interface SubResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export interface OverviewRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  conversion_events?: string[];
  cost?: { mode: string; keys?: Record<string, string>; cost_source_id?: string };
  table_date_day?: { sort?: { by: string; dir: string }; limit?: number; offset?: number };
  table_referrer_domain?: { sort?: { by: string; dir: string }; limit?: number; offset?: number };
  events_table?: { sort?: { by: string; dir: string }; limit?: number; offset?: number };
  wallets_table?: { sort?: { by: string; dir: string }; limit?: number; offset?: number };
  clicks_table?: { sort?: { by: string; dir: string }; limit?: number; offset?: number };
  wallet_distribution?: { sort?: { by: string; dir: string }; limit?: number; offset?: number };
  holders?: { contract_id?: string };
}

export interface OverviewResponse {
  success: boolean;
  tag_id: string;
  scorecard: SubResult<ScorecardResponse>;
  table_date_day: SubResult<TableResponse>;
  table_referrer_domain: SubResult<TableResponse>;
  filtering: SubResult<FilterOptionsResponse>;
  cost_sources: SubResult<{ cost_sources: CostSource[] }>;
  events: SubResult<EventsTableResponse>;
  wallets: SubResult<WalletsTableResponse>;
  wallet_extensions: SubResult<WalletExtensionsResponse>;
  wallet_distribution: SubResult<WalletDistributionResponse>;
  clicks: SubResult<ClicksTableResponse>;
  holders: SubResult<HoldersResponse>;
  wallet_holdings: SubResult<WalletHoldingsResponse>;
}

// Wallet Holdings
export interface WalletHoldingItem {
  chain_display_name: string;
  contract_name: string;
  logo_url: string | null;
  total_quote_usd: number;
  unique_wallets?: number;
}

export interface WalletHoldingsResponse {
  items: WalletHoldingItem[];
}

export async function fetchOverview(request: OverviewRequest): Promise<OverviewResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/overview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}
