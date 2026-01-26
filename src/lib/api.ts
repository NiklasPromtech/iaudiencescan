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
    mode: "none" | "manual" | "auto";
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
