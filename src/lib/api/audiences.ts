import { apiRequest } from "./client";

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
