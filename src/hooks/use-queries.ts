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

const SEED_QUERIES = [
  {
    name: "Pageviews (last 14 days)",
    sql: `SELECT DATE(created_at) AS day, COUNT(*) AS views\nFROM pageviews\nWHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL {{days_back, "14"}} DAY)\nGROUP BY day\nORDER BY day`,
    display_type: "bar_chart",
    dash_col: 1,
    dash_row: 1,
    dash_w: 1,
    dash_h: 1,
    is_system: true,
  },
  {
    name: "Top Referrers",
    sql: `SELECT referrer, COUNT(*) AS visits\nFROM pageviews\nWHERE referrer IS NOT NULL AND referrer != ''\nGROUP BY referrer\nORDER BY visits DESC\nLIMIT {{limit, "20"}}`,
    display_type: "table",
    dash_col: 2,
    dash_row: 1,
    dash_w: 1,
    dash_h: 1,
    is_system: true,
  },
  {
    name: "Wallet Connections by Day",
    sql: `SELECT DATE(created_at) AS day, COUNT(*) AS connections\nFROM wallet_connections\nWHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL {{days_back, "14"}} DAY)\nGROUP BY day\nORDER BY day`,
    display_type: "line_chart",
    dash_col: 1,
    dash_row: 2,
    dash_w: 1,
    dash_h: 1,
    is_system: true,
  },
  {
    name: "Top Events",
    sql: `SELECT event_name, COUNT(*) AS occurrences\nFROM events\nGROUP BY event_name\nORDER BY occurrences DESC\nLIMIT {{limit, "20"}}`,
    display_type: "table",
    dash_col: 2,
    dash_row: 2,
    dash_w: 1,
    dash_h: 1,
    is_system: true,
  },
  {
    name: "Wallet List",
    sql: `SELECT wallet_id, type, first_seen, last_seen, visit_count\nFROM wallets\nORDER BY last_seen DESC\nLIMIT {{limit, "50"}}`,
    display_type: "table",
    dash_col: 1,
    dash_row: 3,
    dash_w: 2,
    dash_h: 1,
    is_system: true,
  },
  {
    name: "Top Wallet Balances",
    sql: `SELECT wallet_id, total_balance_usd, chains\nFROM wallet_balances\nWHERE total_balance_usd > 0\nORDER BY total_balance_usd DESC\nLIMIT {{limit, "20"}}`,
    display_type: "table",
    dash_col: 1,
    dash_row: 4,
    dash_w: 1,
    dash_h: 1,
    is_system: true,
  },
  {
    name: "Wallets by Chain",
    sql: `SELECT chain, COUNT(*) AS wallets\nFROM wallet_balances\nGROUP BY chain\nORDER BY wallets DESC`,
    display_type: "pie_chart",
    dash_col: 2,
    dash_row: 4,
    dash_w: 1,
    dash_h: 1,
    is_system: true,
  },
];

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
        .eq("website_id", websiteId)
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
      .eq("website_id", websiteId)
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
