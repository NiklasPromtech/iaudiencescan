import { apiRequest } from "./client";
import { supabase } from "@/integrations/supabase/client";

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
  return apiRequest<{ website: Website }>(`/websites/${websiteId}/archive`, { method: "PUT" });
}

export async function unarchiveWebsite(websiteId: string): Promise<{ website: Website }> {
  return apiRequest<{ website: Website }>(`/websites/${websiteId}/unarchive`, { method: "PUT" });
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

export async function shareWebsite(websiteId: string, email: string): Promise<ShareWebsiteResponse> {
  return apiRequest<ShareWebsiteResponse>(`/websites/${websiteId}/share`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function listWebsiteShares(websiteId: string): Promise<ListSharesResponse> {
  return apiRequest<ListSharesResponse>(`/websites/${websiteId}/shares`);
}

export async function revokeWebsiteShare(websiteId: string, shareId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/websites/${websiteId}/shares/${shareId}`, {
    method: "DELETE",
  });
}

export async function listAccessibleWebsites(): Promise<AccessibleWebsitesResponse> {
  return apiRequest<AccessibleWebsitesResponse>(`/websites/accessible`);
}

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
