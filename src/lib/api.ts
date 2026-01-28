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
export async function listWebsites(status?: string): Promise<{ websites: Website[] }> {
  const params = status ? `?status=${status}` : "";
  return apiRequest<{ websites: Website[] }>(`/websites${params}`);
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
  | "os";

export interface TableRequest {
  tag_id: string;
  dimension: TableDimension;
  range: RangeConfig;
  filters?: Record<string, string[]>;
  conversion_events?: string[];
  cost?: {
    mode: "none" | "cost_source";
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

export interface WalletSummary {
  total_wallets: number;
  total_balance_usd: number;
  wallets_with_zero_balance: number;
  wallets_not_enriched: number;
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

export interface ScanResultsTopToken {
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
  total_value_usd: number | null;
  avg_balance: number;
  avg_value_usd: number | null;
  // Enriched fields (may not be present)
  website?: string;
  twitter?: string;
  description?: string;
  current_price_usd?: number | null;
  market_cap_usd?: number | null;
  news_count?: number;
}

export interface ScanResultsResponse {
  total_wallets: number;
  wallets_with_balance: number;
  total_tokens: number;
  total_value_usd: number;
  top_tokens: ScanResultsTopToken[];
  token_network: {
    nodes: ScanResultsNetworkNode[];
    edges: ScanResultsNetworkEdge[];
  };
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

export async function listScans(limit?: number, offset?: number): Promise<ScansListResponse> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }

  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (offset) params.append("offset", String(offset));
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
