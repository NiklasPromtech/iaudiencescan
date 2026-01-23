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
