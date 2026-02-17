import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = "https://api-wldojy4riq-uc.a.run.app";

async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Website types
export interface Website {
  id: string;
  name: string;
  base_url: string;
  status: "pending" | "verified" | "failed";
  tag_id: string;
  verified_at: string | null;
  created_at: string;
  archived_at: string | null;
}

export interface CreateWebsiteResponse {
  website: Website;
  verification: {
    method: string;
    meta_name: string;
    content: string;
    instructions: string;
  };
  tracking: {
    method: string;
    script_src: string;
    data_attribute: string;
    data_value: string;
    snippet: string;
  };
}

export interface VerifyWebsiteResponse {
  website: {
    id: string;
    status: "pending" | "verified" | "failed";
    verified_at: string | null;
  };
  verification_result: {
    checked_url: string;
    method: string;
    meta_name: string;
    expected_content: string;
    found: boolean;
    reason?: string;
  };
}

// API functions
export interface ListWebsitesOptions {
  status?: string;
  include_archived?: boolean;
}

export async function listWebsites(options?: ListWebsitesOptions): Promise<{ websites: Website[] }> {
  const params = new URLSearchParams();
  if (options?.status) params.append("status", options.status);
  if (options?.include_archived) params.append("include_archived", "true");
  const queryString = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ websites: Website[] }>(`/websites${queryString}`);
}

export async function archiveWebsite(websiteId: string): Promise<{ website: Website }> {
  return apiRequest<{ website: Website }>(`/websites/${websiteId}/archive`, {
    method: "PUT",
  });
}

export async function unarchiveWebsite(websiteId: string): Promise<{ website: Website }> {
  return apiRequest<{ website: Website }>(`/websites/${websiteId}/unarchive`, {
    method: "PUT",
  });
}

export async function createWebsite(name: string, base_url: string): Promise<CreateWebsiteResponse> {
  return apiRequest<CreateWebsiteResponse>("/websites", {
    method: "POST",
    body: JSON.stringify({ name, base_url }),
  });
}

export async function verifyWebsite(websiteId: string, url?: string): Promise<VerifyWebsiteResponse> {
  return apiRequest<VerifyWebsiteResponse>(`/websites/${websiteId}/verify`, {
    method: "POST",
    body: JSON.stringify(url ? { url } : {}),
  });
}

// Analytics types
export type RangeConfig = 
  | { type: "last_full_days"; days: number; timezone: string }
  | { type: "custom"; from: string; to: string; timezone: string };

export interface ScorecardRequest {
  tag_id: string;
  conversion_events?: string[];
  range: RangeConfig;
  filters?: Record<string, string[]>;
  cost?: {
    mode: "none" | "manual" | "auto";
  };
}

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

// Active filters type for the UI
export type ActiveFilters = Partial<Record<string, string[]>>;

// Filter option item with value and count
export interface FilterOptionItem {
  value: string;
  count: number;
}

// Filter options response from the new /api/analytics/filtering endpoint
export interface FilterOptionsResponse {
  success: boolean;
  tag_id: string;
  sources?: FilterOptionItem[];
  utm_source?: FilterOptionItem[];
  utm_medium?: FilterOptionItem[];
  utm_campaign?: FilterOptionItem[];
  utm_content?: FilterOptionItem[];
  utm_term?: FilterOptionItem[];
  countries?: FilterOptionItem[];
  conversion_events?: FilterOptionItem[];
  wallet_actions?: FilterOptionItem[];
  wallet_tiers?: FilterOptionItem[];
  cost_sources?: Array<{
    id: string;
    name: string;
    dimension: string;
  }>;
}

export interface FilterOptionsRequest {
  tag_id: string;
  range?: RangeConfig;
}

export async function fetchFilterOptions(request: FilterOptionsRequest): Promise<FilterOptionsResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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

export interface ScorecardResponse {
  success: boolean;
  tag_id: string;
  range: {
    from: string;
    to: string;
    timezone: string;
  };
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

// Table API types
export type TableDimension = 
  | "referrer_domain" 
  | "utm_source" 
  | "utm_medium" 
  | "utm_campaign" 
  | "utm_content" 
  | "utm_term" 
  | "date_day" 
  | "device_type" 
  | "browser" 
  | "os"
  | "country"
  | "time_on_site";

export interface TableRequest {
  tag_id: string;
  dimension: TableDimension;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  conversion_events?: string[];
  cost?: {
    mode: "none" | "utm" | "source" | "campaign";
    cost_source_id?: string;
  };
  pagination?: {
    limit?: number;
    offset?: number;
  };
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
  // Cost-per engagement fields (calculated client-side if not from API)
  cost_per_pageview: number | null;
  cost_per_stayed_10s: number | null;
  cost_per_stayed_30s: number | null;
  cost_per_stayed_60s: number | null;
  cost_per_stayed_5m: number | null;
  cost_per_wallet: number | null;
  // Wallet enrichment fields
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
  range: {
    from: string;
    to: string;
    timezone: string;
  };
  filters: Record<string, string[]>;
  conversion_events: string[];
  conversion_events_configured: boolean;
  cost: number | null;
  cost_configured: boolean;
  pagination: {
    limit: number;
    offset: number;
    total_rows: number;
  };
  rows: TableRow[];
}

const ANALYTICS_API_URL = "https://cdn.audiencescan.io/api";

// Tracking status types
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
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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

// Bot Analytics types
export interface BotAnalyticsRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  dimension?: TableDimension;
  limit?: number;
  offset?: number;
}

export interface BotSummary {
  total_visitors: number;
  bot_visitors: number;
  human_visitors: number;
  unknown_visitors: number;
  bot_pct: number;
  human_pct: number;
  unknown_pct: number;
}

export interface BotSignals {
  webdriver_count: number;
  headless_count: number;
  total_checked: number;
}

export interface RendererBreakdown {
  renderer: string;
  visitor_count: number;
  is_headless: boolean;
}

export interface BotDimensionRow {
  dim_value: string;
  total_visitors: number;
  bot_visitors: number;
  human_visitors: number;
  unknown_visitors: number;
  bot_pct: number;
}

export interface BotAnalyticsResponse {
  success: boolean;
  tag_id: string;
  range: { from: string; to: string; timezone: string };
  filters: Record<string, string[]>;
  summary: BotSummary;
  signals: BotSignals;
  renderer_breakdown: RendererBreakdown[];
  dimension: TableDimension | null;
  pagination: { limit: number; offset: number; total_rows: number };
  rows: BotDimensionRow[];
}

export async function fetchBotAnalytics(request: BotAnalyticsRequest): Promise<BotAnalyticsResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/bots`, {
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

// Utility: map table dimension to filter key
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

// Events Table types
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
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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

// Wallets Table types (actions breakdown)
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
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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

// Wallet Extensions types
export interface WalletExtensionsRequest {
  tag_id: string;
  range: RangeConfig;
  filters?: Record<string, string[]>;
}

export interface WalletExtensionsRow {
  wallet_type: string;
  count: number;
}

export interface WalletExtensionsResponse {
  success: boolean;
  total_with_extension?: number;
  rows: WalletExtensionsRow[];
  pagination?: { limit: number; offset: number; total_rows: number };
}

export async function fetchWalletExtensions(request: WalletExtensionsRequest): Promise<WalletExtensionsResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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

// Wallet Distribution types
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

// Clicks Table types
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

// Realtime Analytics types
export interface RealtimeResponse {
  success: boolean;
  tag_id: string;
  active_visitors: number;
  window_minutes: number;
  timestamp: string;
}

export async function fetchRealtimeVisitors(tagId: string, window?: number): Promise<RealtimeResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const params = window ? `?window=${window}` : "";
  const response = await fetch(`${ANALYTICS_API_URL}/analytics/realtime/${tagId}${params}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Wallet List types
export interface WalletRow {
  wallet_id: string;
  types: string[];
  first_seen: string;
  last_seen: string;
  visit_count: number;
  total_balance_usd?: number | null;
  chains?: string[];
  enriched_at?: string | null;
  enrichment_status?: "pending" | "processing" | "completed" | "failed" | null;
}

export interface WalletListRequest {
  tag_id: string;
  range: RangeConfig;
  types?: string[];
  chains?: string[];
  search?: string;
  filters?: Record<string, string[]>;
  balance?: {
    min?: number;
    max?: number;
  };
  sort_by?: "wallet_id" | "first_seen" | "last_seen" | "visit_count" | "total_balance_usd";
  sort_dir?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

// Common wallet action types
export const WALLET_ACTION_TYPES = [
  { value: "connected", label: "Connected" },
  { value: "manual", label: "Manual" },
  { value: "deposited", label: "Deposited" },
  { value: "withdrew", label: "Withdrew" },
  { value: "staked", label: "Staked" },
  { value: "unstaked", label: "Unstaked" },
  { value: "swapped", label: "Swapped" },
  { value: "minted", label: "Minted" },
  { value: "claimed", label: "Claimed" },
] as const;

export interface WalletSummary {
  total_wallets: number;
  total_balance_usd: number;
  median_balance_usd: number;
  wallets_with_zero_balance: number;
  wallets_not_enriched: number;
  wallets_enrichment_failed: number;
}

export interface WalletListResponse {
  success: boolean;
  rows: WalletRow[];
  summary?: WalletSummary;
  pagination: {
    limit: number;
    offset: number;
    total_rows: number;
  };
  filter_options?: FilterOptions;
}

// Audience types
export interface Audience {
  id: string;
  name: string;
  website_id: string;
  wallet_count: number;
  wallets: string[];
  created_at: string;
  updated_at: string;
}

export interface AudienceListResponse {
  audiences: Audience[];
}

export interface AudienceResponse {
  audience: Audience;
}

export interface CreateAudienceRequest {
  name: string;
  website_id: string;
  wallets: string[];
}

export interface UpdateAudienceRequest {
  name?: string;
  wallets?: string[];
}

// Wallet list function
export async function fetchWallets(request: WalletListRequest): Promise<WalletListResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/wallets`, {
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

// Audiences CRUD functions
export async function listAudiences(websiteId?: string): Promise<AudienceListResponse> {
  const params = websiteId ? `?website_id=${websiteId}` : "";
  return apiRequest<AudienceListResponse>(`/audiences${params}`);
}

export async function getAudience(id: string): Promise<AudienceResponse> {
  return apiRequest<AudienceResponse>(`/audiences/${id}`);
}

export async function createAudience(data: CreateAudienceRequest): Promise<AudienceResponse> {
  return apiRequest<AudienceResponse>("/audiences", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAudience(id: string, data: UpdateAudienceRequest): Promise<AudienceResponse> {
  return apiRequest<AudienceResponse>(`/audiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAudience(id: string): Promise<void> {
  await apiRequest<void>(`/audiences/${id}`, {
    method: "DELETE",
  });
}

// Scan types
export const SUPPORTED_CHAINS = [
  { value: "eth-mainnet", label: "Ethereum" },
  { value: "matic-mainnet", label: "Polygon" },
  { value: "bsc-mainnet", label: "BNB Chain" },
  { value: "arbitrum-mainnet", label: "Arbitrum" },
  { value: "optimism-mainnet", label: "Optimism" },
  { value: "avalanche-mainnet", label: "Avalanche" },
  { value: "base-mainnet", label: "Base" },
  { value: "solana-mainnet", label: "Solana" },
] as const;

export type SupportedChain = typeof SUPPORTED_CHAINS[number]["value"];

export type ScanStep =
  | "QUEUED"
  | "FETCHING_BALANCES"
  | "FETCHING_TRANSACTIONS"
  | "BUILDING_NETWORK"
  | "ENRICHING_SOCIALS"
  | "FETCHING_NEWS"
  | "FINALIZING"
  | "DONE";

export interface Scan {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  step: ScanStep;
  step_label: string;
  progress: number;
  wallet_count: number;
  processed_count: number;
  chain: string;
  name: string | null;
  audience_id: string | null;
  website_id: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
  archived_at: string | null;
}

// Scan results types
export interface ScanResultsNetworkNode {
  contract_address: string;
  contract_name: string;
  contract_ticker: string;
  chain_name: string;
  chain_display_name: string;
  logo_url: string;
  token_type: string;
  is_native_token: boolean;
  unique_wallets: number;
  total_balance: number;
  total_value_usd: number;
  avg_balance: number;
  avg_value_usd: number;
}

export interface ScanResultsNetworkEdge {
  source: string;
  target: string;
  weight: number;
}

// News article type for scan results
export interface NewsArticle {
  title: string;
  url: string;
  source_name: string;
  source_domain: string;
  published_at: string;
  description: string | null;
  image_url: string | null;
}

export interface ScanResultsTopToken {
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_logo_url: string | null;
  chain_name: string;
  transaction_count: number;
  unique_wallets: number;
  outgoing_count?: number;
  incoming_count?: number;
  // Social/targeting fields
  website?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  discord?: string | null;
  reddit?: string | null;
  description?: string | null;
  current_price_usd?: number | null;
  market_cap_usd?: number | null;
  news_count?: number;
  news_articles?: NewsArticle[];
  // Data source flags
  found_on_cg?: boolean;
  found_on_cmc?: boolean;
}

export interface ScanResultsNetworkNodeNew {
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_logo_url: string | null;
  chain_name: string;
  transaction_count: number;
  unique_wallets: number;
  outgoing_count: number;
  incoming_count: number;
  total_value: number;
}

export interface ScanResultsResponse {
  scan_id: string;
  status: string;
  enriched: boolean;
  wallets_processed: number;
  wallets_with_balance: number;
  transfers_found: number;
  tokens_found: number;
  tokens_enriched: number;
  top_tokens: ScanResultsTopToken[];
  network: {
    nodes: ScanResultsNetworkNodeNew[];
    edges: ScanResultsNetworkEdge[];
  };
  started_at: string;
  completed_at: string;
}

// Scan API functions
export interface CreateScanRequest {
  wallets: string[];
  chain: SupportedChain;
  name?: string;
  audience_id?: string;
  website_id?: string;
}

export interface CreateScanResponse {
  scan_id: string;
  status: string;
  wallet_count: number;
  chain: string;
  name: string | null;
  audience_id: string | null;
  created_at: string;
}

export interface ScansListResponse {
  scans: Scan[];
  total: number;
  limit: number;
  offset: number;
}

export async function createScan(data: CreateScanRequest): Promise<CreateScanResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/scans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export interface ListScansOptions {
  websiteId?: string;
  limit?: number;
  offset?: number;
  include_archived?: boolean;
}

export async function listScans(options?: ListScansOptions): Promise<ScansListResponse>;
export async function listScans(websiteId?: string, limit?: number, offset?: number): Promise<ScansListResponse>;
export async function listScans(
  optionsOrWebsiteId?: ListScansOptions | string,
  limit?: number,
  offset?: number
): Promise<ScansListResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const params = new URLSearchParams();
  
  // Handle both old and new API signatures
  if (typeof optionsOrWebsiteId === "object" && optionsOrWebsiteId !== null) {
    const options = optionsOrWebsiteId;
    if (options.websiteId) params.append("website_id", options.websiteId);
    if (options.limit) params.append("limit", String(options.limit));
    if (options.offset) params.append("offset", String(options.offset));
    if (options.include_archived) params.append("include_archived", "true");
  } else if (typeof optionsOrWebsiteId === "string") {
    // Legacy signature support
    params.append("website_id", optionsOrWebsiteId);
    if (limit) params.append("limit", String(limit));
    if (offset) params.append("offset", String(offset));
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`${ANALYTICS_API_URL}/scans${queryString}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function archiveScan(scanId: string): Promise<{ scan: Scan }> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}/archive`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function unarchiveScan(scanId: string): Promise<{ scan: Scan }> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}/unarchive`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function getScan(scanId: string): Promise<Scan> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.scan;
}

export async function getScanResults(scanId: string): Promise<ScanResultsResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}/results`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Wallet Enrichment types and function
export interface EnrichWalletsRequest {
  tag_id: string;
  wallets: string | string[];
}

export interface EnrichWalletsResponse {
  success: boolean;
  tag_id: string;
  total_requested: number;
  queued: number;
  already_queued: number;
  failed: number;
  details: {
    queued: string[];
    already_queued: string[];
    failed: string[];
  };
}

export async function enrichWallets(request: EnrichWalletsRequest): Promise<EnrichWalletsResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/wallets/enrich`, {
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

// Cost Source types
export type CostDimension = "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term" | "referrer_domain";

export interface CostSource {
  id: string;
  name: string;
  dimension: CostDimension;
  date_from: string;
  date_to: string;
  total_cost: number;
  created_at: string;
  updated_at: string;
}

export interface CostSourceWithDetails extends CostSource {
  costs: Array<{
    date: string;
    values: Record<string, number>;
  }>;
  dimension_values: string[];
}

export interface CostEntry {
  date: string;
  dimension_value: string;
  cost: number;
}

export interface CreateCostSourceRequest {
  tag_id: string;
  name: string;
  dimension: CostDimension;
  costs: CostEntry[];
}

export interface UpdateCostSourceRequest {
  tag_id: string;
  name?: string;
  costs: CostEntry[];
}

export interface CostSourceListResponse {
  success: boolean;
  cost_sources: CostSource[];
}

export interface CostSourceResponse {
  success: boolean;
  cost_source: CostSource;
}

export interface CostSourceDetailResponse {
  success: boolean;
  cost_source: CostSourceWithDetails;
}

// Cost Source API functions
export async function listCostSources(tagId: string): Promise<CostSourceListResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources?tag_id=${tagId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function getCostSource(id: string, tagId: string): Promise<CostSourceDetailResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources/${id}?tag_id=${tagId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function createCostSource(data: CreateCostSourceRequest): Promise<CostSourceResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function updateCostSource(id: string, data: UpdateCostSourceRequest): Promise<CostSourceResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function deleteCostSource(id: string, tagId: string): Promise<{ success: boolean; deleted: boolean }> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources/${id}?tag_id=${tagId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function downloadCostTemplate(
  tagId: string,
  dimension: CostDimension,
  from: string,
  to: string
): Promise<Blob> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const params = new URLSearchParams({
    tag_id: tagId,
    dimension,
    from,
    to,
  });

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-template?${params}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.blob();
}

// Website Sharing types
export interface WebsiteShare {
  id: string;
  website_id: string;
  email: string;
  user_id: string | null;
  shared_by_id: string;
  created_at: string;
}

export interface ShareWebsiteResponse {
  success: boolean;
  share_id: string;
  has_account: boolean;
  message: string;
}

export interface ListSharesResponse {
  success: boolean;
  shares: WebsiteShare[];
}

export interface AccessibleWebsitesResponse {
  success: boolean;
  websites: Website[];
}

// Share a website with an email
export async function shareWebsite(websiteId: string, email: string): Promise<ShareWebsiteResponse> {
  return apiRequest<ShareWebsiteResponse>(`/websites/${websiteId}/share`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// List shares for a website
export async function listWebsiteShares(websiteId: string): Promise<ListSharesResponse> {
  return apiRequest<ListSharesResponse>(`/websites/${websiteId}/shares`);
}

// Revoke a share
export async function revokeWebsiteShare(websiteId: string, shareId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/websites/${websiteId}/shares/${shareId}`, {
    method: "DELETE",
  });
}

// Get all websites user has access to (owned + shared)
export async function listAccessibleWebsites(): Promise<AccessibleWebsitesResponse> {
  return apiRequest<AccessibleWebsitesResponse>(`/websites/accessible`);
}

// Send invite email via edge function
export async function sendInviteEmail(
  email: string,
  websiteName: string,
  inviterName: string
): Promise<void> {
  const { error } = await supabase.functions.invoke("send-invite-email", {
    body: { email, websiteName, inviterName },
  });
  if (error) {
    console.error("Failed to send invite email:", error);
  }
}

// Holder Analytics types
export interface HolderDataPoint {
  date: string;
  holder_count: number;
  contract_address: string;
  chain_id: string;
}

export interface HoldersRequest {
  tag_id: string;
  contract_id?: string;
  range: {
    from: string;
    to: string;
  };
}

export interface HoldersResponse {
  success: boolean;
  data: HolderDataPoint[];
}

export async function fetchHoldersData(request: HoldersRequest): Promise<HoldersResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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

// Unified Overview endpoint types
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
  cost?: {
    mode: string;
    keys?: Record<string, string>;
    cost_source_id?: string;
  };
  table_date_day?: {
    sort?: { by: string; dir: string };
    limit?: number;
    offset?: number;
  };
  table_referrer_domain?: {
    sort?: { by: string; dir: string };
    limit?: number;
    offset?: number;
  };
  events_table?: {
    sort?: { by: string; dir: string };
    limit?: number;
    offset?: number;
  };
  wallets_table?: {
    sort?: { by: string; dir: string };
    limit?: number;
    offset?: number;
  };
  clicks_table?: {
    sort?: { by: string; dir: string };
    limit?: number;
    offset?: number;
  };
  wallet_distribution?: {
    sort?: { by: string; dir: string };
    limit?: number;
    offset?: number;
  };
  holders?: {
    contract_id?: string;
  };
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
}

export async function fetchOverview(request: OverviewRequest): Promise<OverviewResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

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

// ============= WALLET BALANCES =============
export interface WalletBalanceToken {
  contract_address: string;
  contract_name: string;
  contract_ticker: string;
  contract_decimals: string;
  token_type: string;
  is_spam: string;
  is_native_token: string;
  balance_raw: string;
  balance: string;
  quote_rate_usd: string;
  quote_usd: string;
  last_transferred_at: string | null;
  logo_url: string | null;
  chain_id: string;
  chain_name: string;
  chain_display_name: string;
}

export interface WalletEnrichment {
  enriched_at: string;
  total_balance_usd: number;
  token_count: number;
  tokens: WalletBalanceToken[];
}

export interface WalletBalanceResponse {
  wallet_address: string;
  website_id: string;
  enrichment_count: number;
  current_balance_usd: number;
  balance_history: number[];
  enrichments: WalletEnrichment[];
}

export async function fetchWalletBalances(walletAddress: string, websiteId: string): Promise<WalletBalanceResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/wallet-balances/${walletAddress}?website_id=${encodeURIComponent(websiteId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}
