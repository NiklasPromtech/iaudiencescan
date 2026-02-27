import { getAuthToken, ANALYTICS_API_URL } from "./client";

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
  costs: Array<{ date: string; values: Record<string, number> }>;
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

export async function listCostSources(tagId: string): Promise<CostSourceListResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources?tag_id=${tagId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function getCostSource(id: string, tagId: string): Promise<CostSourceDetailResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources/${id}?tag_id=${tagId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export async function createCostSource(data: CreateCostSourceRequest): Promise<CostSourceResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

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
  if (!token) throw new Error("Not authenticated");

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
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-sources/${id}?tag_id=${tagId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
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
  if (!token) throw new Error("Not authenticated");

  const params = new URLSearchParams({ tag_id: tagId, dimension, from, to });

  const response = await fetch(`${ANALYTICS_API_URL}/analytics/cost-template?${params}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
  }

  return response.blob();
}
