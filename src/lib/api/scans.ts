import { getAuthToken, ANALYTICS_API_URL } from "./client";

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
  | "QUEUED" | "FETCHING_BALANCES" | "FETCHING_TRANSACTIONS"
  | "BUILDING_NETWORK" | "ENRICHING_SOCIALS" | "FETCHING_NEWS"
  | "FINALIZING" | "DONE";

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

export interface NewsArticle {
  title: string;
  url: string;
  source_name: string;
  source_domain: string;
  published_at: string;
  description: string | null;
  image_url: string | null;
}

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
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_logo_url: string | null;
  chain_name: string;
  transaction_count: number;
  unique_wallets: number;
  outgoing_count?: number;
  incoming_count?: number;
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
  if (!token) throw new Error("Not authenticated");

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
  if (!token) throw new Error("Not authenticated");

  const params = new URLSearchParams();
  
  if (typeof optionsOrWebsiteId === "object" && optionsOrWebsiteId !== null) {
    const options = optionsOrWebsiteId;
    if (options.websiteId) params.append("website_id", options.websiteId);
    if (options.limit) params.append("limit", String(options.limit));
    if (options.offset) params.append("offset", String(options.offset));
    if (options.include_archived) params.append("include_archived", "true");
  } else if (typeof optionsOrWebsiteId === "string") {
    params.append("website_id", optionsOrWebsiteId);
    if (limit) params.append("limit", String(limit));
    if (offset) params.append("offset", String(offset));
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`${ANALYTICS_API_URL}/scans${queryString}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function archiveScan(scanId: string): Promise<{ scan: Scan }> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}/archive`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function unarchiveScan(scanId: string): Promise<{ scan: Scan }> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}/unarchive`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function getScan(scanId: string): Promise<Scan> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
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
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/scans/${scanId}/results`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}
