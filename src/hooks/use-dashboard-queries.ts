import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listScans, listAudiences, listCostSources, Scan, Audience, CostSource } from "@/lib/api";

// Query key factories for consistent cache management
export const queryKeys = {
  scans: (websiteId: string, includeArchived?: boolean) => 
    ["scans", websiteId, includeArchived ?? false] as const,
  audiences: (websiteId: string) => ["audiences", websiteId] as const,
  touchpoints: (websiteId: string) => ["touchpoints", websiteId] as const,
  contracts: (websiteId: string) => ["contracts", websiteId] as const,
  costSources: (websiteId: string) => ["costSources", websiteId] as const,
};

// ============= SCANS =============
export function useScans(websiteId: string | undefined, includeArchived = false) {
  return useQuery({
    queryKey: queryKeys.scans(websiteId ?? "", includeArchived),
    queryFn: async () => {
      if (!websiteId) return [] as Scan[];
      const response = await listScans({ 
        websiteId, 
        include_archived: includeArchived 
      });
      return response.scans || [];
    },
    enabled: !!websiteId,
    // Poll every 5 seconds if any scan is processing
    refetchInterval: (query) => {
      const scans = query.state.data;
      const hasActiveScans = scans?.some(
        (s) => s.status === "PENDING" || s.status === "PROCESSING"
      );
      return hasActiveScans ? 5000 : false;
    },
  });
}

// ============= AUDIENCES =============
export function useAudiences(websiteId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.audiences(websiteId ?? ""),
    queryFn: async () => {
      if (!websiteId) return [] as Audience[];
      const response = await listAudiences(websiteId);
      return response.audiences;
    },
    enabled: !!websiteId,
  });
}

// ============= TOUCHPOINTS =============
export interface Touchpoint {
  id: string;
  website_id: string;
  user_id: string;
  name: string;
  event_type: "single" | "range";
  timestamp: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  color: string;
  cost_amount: number | null;
  cost_currency: string | null;
  created_at: string;
}

export function useTouchpoints(websiteId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.touchpoints(websiteId ?? ""),
    queryFn: async () => {
      if (!websiteId) return [] as Touchpoint[];
      const { data, error } = await supabase
        .from("touchpoints")
        .select("*")
        .eq("website_id", websiteId)
        .order("timestamp", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return (data || []) as Touchpoint[];
    },
    enabled: !!websiteId,
  });
}

// ============= CONTRACTS =============
export interface TokenContract {
  id: string;
  website_id: string;
  name: string;
  contract_address: string;
  chain: string;
  chain_id: string | null;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useContracts(websiteId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.contracts(websiteId ?? ""),
    queryFn: async () => {
      if (!websiteId) return [] as TokenContract[];
      const { data, error } = await supabase
        .from("website_tag_contracts")
        .select("*")
        .eq("website_id", websiteId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as TokenContract[];
    },
    enabled: !!websiteId,
  });
}

// ============= COST SOURCES =============
export function useCostSources(websiteId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.costSources(websiteId ?? ""),
    queryFn: async () => {
      if (!websiteId) return [] as CostSource[];
      const response = await listCostSources(websiteId);
      return response.cost_sources;
    },
    enabled: !!websiteId,
  });
}

// ============= CACHE INVALIDATION HELPERS =============
export function useInvalidateScans() {
  const queryClient = useQueryClient();
  return (websiteId: string) => {
    queryClient.invalidateQueries({ queryKey: ["scans", websiteId] });
  };
}

export function useInvalidateAudiences() {
  const queryClient = useQueryClient();
  return (websiteId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.audiences(websiteId) });
  };
}

export function useInvalidateTouchpoints() {
  const queryClient = useQueryClient();
  return (websiteId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.touchpoints(websiteId) });
  };
}

export function useInvalidateContracts() {
  const queryClient = useQueryClient();
  return (websiteId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.contracts(websiteId) });
  };
}

export function useInvalidateCostSources() {
  const queryClient = useQueryClient();
  return (websiteId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.costSources(websiteId) });
  };
}
