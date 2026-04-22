import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SavedQuery {
  id: string;
  user_id: string;
  name: string;
  sql: string;
  starred: boolean;
  on_dashboard: boolean;
  display_type: string;
  dash_col: number;
  dash_row: number;
  dash_w: number;
  dash_h: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export type QueryPatch = {
  name?: string;
  sql?: string;
  starred?: boolean;
  on_dashboard?: boolean;
  display_type?: string;
  dash_col?: number;
  dash_row?: number;
  dash_w?: number;
  dash_h?: number;
};

export function useQueries(websiteId?: string | null) {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueries = useCallback(async () => {
    if (!websiteId) {
      setQueries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: err } = await (supabase as any)
        .from("queries")
        .select("*")
        .or(`website_id.eq.${websiteId},is_system.eq.true`)
        .order("updated_at", { ascending: false });
      if (err) throw err;
      setQueries((data as SavedQuery[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load queries");
    } finally {
      setLoading(false);
    }
  }, [websiteId]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  const createQuery = useCallback(
    async (name: string, sql: string): Promise<SavedQuery> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: err } = await (supabase as any)
        .from("queries")
        .insert({ name, sql, user_id: user.id, website_id: websiteId ?? null })
        .select()
        .single();
      if (err) throw err;
      const created = data as unknown as SavedQuery;
      setQueries((prev) => [created, ...prev]);
      return created;
    },
    [websiteId]
  );

  const updateQuery = useCallback(
    async (id: string, patch: QueryPatch): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("queries")
        .update(patch)
        .eq("id", id);
      if (err) throw err;
      setQueries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
      );
    },
    []
  );

  const deleteQuery = useCallback(async (id: string): Promise<void> => {
    // Prevent deletion of system queries
    const target = queries.find((q) => q.id === id);
    if (target?.is_system) throw new Error("System queries cannot be deleted");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase as any)
      .from("queries")
      .delete()
      .eq("id", id);
    if (err) throw err;
    setQueries((prev) => prev.filter((q) => q.id !== id));
  }, [queries]);

  const fetchDashboardQueries = useCallback(async (): Promise<SavedQuery[]> => {
    if (!websiteId) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: err } = await (supabase as any)
      .from("queries")
      .select("*")
      .or(`website_id.eq.${websiteId},is_system.eq.true`)
      .eq("on_dashboard", true)
      .order("updated_at", { ascending: false });
    if (err) throw err;
    return (data as SavedQuery[]) ?? [];
  }, [websiteId]);

  /** Seed default dashboard queries if the user has none for this website. */
  const seedDefaultQueries = useCallback(async (): Promise<SavedQuery[]> => {
    if (!websiteId) return [];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Check if any queries exist at all
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count } = await (supabase as any)
      .from("queries")
      .select("id", { count: "exact", head: true })
      .eq("website_id", websiteId);

    if (count && count > 0) return [];

    const inserts = SEED_QUERIES.map((sq) => ({
      ...sq,
      user_id: user.id,
      website_id: websiteId,
      on_dashboard: true,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: err } = await (supabase as any)
      .from("queries")
      .insert(inserts)
      .select();
    if (err) throw err;
    const seeded = (data as SavedQuery[]) ?? [];
    setQueries(seeded);
    return seeded;
  }, [websiteId]);

  return {
    queries,
    loading,
    error,
    refetch: fetchQueries,
    createQuery,
    updateQuery,
    deleteQuery,
    fetchDashboardQueries,
    seedDefaultQueries,
  };
}
