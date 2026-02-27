import { getAuthToken, ANALYTICS_API_URL } from "./client";
import type { RangeConfig, FilterOptions } from "./analytics";

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
  balance?: { min?: number; max?: number };
  sort_by?: "wallet_id" | "first_seen" | "last_seen" | "visit_count" | "total_balance_usd";
  sort_dir?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

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
  pagination: { limit: number; offset: number; total_rows: number };
  filter_options?: FilterOptions;
}

export async function fetchWallets(request: WalletListRequest): Promise<WalletListResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

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

// Wallet Enrichment
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
  if (!token) throw new Error("Not authenticated");

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

// Wallet Balances & Journey
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

export interface WalletJourneySession {
  session_id: string;
  started_at: string;
  duration_seconds: number;
  is_bounce: boolean;
  page_count: number;
  entry_page: string;
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
}

export interface WalletJourneyEvent {
  event_type: string;
  created_at: string;
  click_text: string | null;
  href: string | null;
  page_path: string | null;
  is_outbound: boolean | null;
  event_data: Record<string, unknown> | null;
}

export interface WalletJourneyAction {
  type: string;
  created_at: string;
  visitor_hash: string;
}

export interface WalletJourneyTransaction {
  chain_name: string;
  tx_hash: string;
  block_signed_at: string;
  from_address: string;
  to_address: string;
  token_name: string;
  token_symbol: string;
  transfer_direction: string;
  transfer_value: string;
  quote_usd: number;
}

export interface WalletJourney {
  visitor_hashes: string[];
  first_seen: string;
  last_seen: string;
  total_sessions: number;
  total_pageviews: number;
  total_events: number;
  countries: string[];
  devices: string[];
  top_referrers: string[];
  top_utm_sources: string[];
  sessions: WalletJourneySession[];
  events: WalletJourneyEvent[];
  wallet_actions: WalletJourneyAction[];
  transactions: WalletJourneyTransaction[];
}

export interface WalletBalanceResponse {
  wallet_address: string;
  website_id: string;
  enrichment_count: number;
  current_balance_usd: number;
  balance_history: number[];
  enrichments: WalletEnrichment[];
  journey?: WalletJourney;
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
