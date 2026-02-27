import { getAuthToken, ANALYTICS_API_URL } from "./client";
import type { RangeConfig, TableDimension } from "./analytics";

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
  if (!token) throw new Error("Not authenticated");

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
