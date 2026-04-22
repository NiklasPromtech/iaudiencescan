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

// Module-level guard to prevent concurrent seeding (e.g., React StrictMode double-effect)
const seedInFlight = new Map<string, Promise<SavedQuery[]>>();

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
      .eq("website_id", websiteId)
      .eq("on_dashboard", true)
      .order("updated_at", { ascending: false });
    if (err) throw err;
    return (data as SavedQuery[]) ?? [];
  }, [websiteId]);

  /** Seed default dashboard queries if the user has none for this website. */
  const seedDefaultQueries = useCallback(async (): Promise<SavedQuery[]> => {
    if (!websiteId) return [];
    const existing = seedInFlight.get(websiteId);
    if (existing) return existing;

    const promise = (async (): Promise<SavedQuery[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch the canonical system templates (global, not tied to any website)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: templates, error: tplErr } = await (supabase as any)
        .from("queries")
        .select("*")
        .eq("is_system", true)
        .is("website_id", null);
      if (tplErr) throw tplErr;
      if (!templates || templates.length === 0) return [];

      // Check if user already has copies of these templates for this website
      const templateNames = (templates as SavedQuery[]).map((t) => t.name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existingCopies } = await (supabase as any)
        .from("queries")
        .select("*")
        .eq("website_id", websiteId)
        .in("name", templateNames);

      const existingByName = new Map<string, SavedQuery>(
        ((existingCopies as SavedQuery[]) ?? []).map((q) => [q.name, q])
      );

      // Re-pin existing copies that are off-dashboard
      const toRepin = (templates as SavedQuery[])
        .map((tpl) => {
          const existing = existingByName.get(tpl.name);
          if (!existing || existing.on_dashboard) return null;
          return { existing, tpl };
        })
        .filter((x): x is { existing: SavedQuery; tpl: SavedQuery } => x !== null);

      if (toRepin.length > 0) {
        await Promise.all(
          toRepin.map(({ existing, tpl }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (supabase as any)
              .from("queries")
              .update({
                on_dashboard: true,
                dash_col: tpl.dash_col,
                dash_row: tpl.dash_row,
                dash_w: tpl.dash_w,
                dash_h: tpl.dash_h,
                display_type: tpl.display_type,
              })
              .eq("id", existing.id)
          )
        );
      }

      // Insert new copies only for templates that have no existing copy
      const inserts = (templates as SavedQuery[])
        .filter((tpl) => !existingByName.has(tpl.name))
        .map((tpl) => ({
          name: tpl.name,
          sql: tpl.sql,
          display_type: tpl.display_type,
          dash_col: tpl.dash_col,
          dash_row: tpl.dash_row,
          dash_w: tpl.dash_w,
          dash_h: tpl.dash_h,
          on_dashboard: true,
          user_id: user.id,
          website_id: websiteId,
          is_system: false,
          starred: false,
        }));

      if (inserts.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: err } = await (supabase as any)
          .from("queries")
          .insert(inserts);
        if (err) throw err;
      }

      // Re-fetch the resulting dashboard queries
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: finalDash } = await (supabase as any)
        .from("queries")
        .select("*")
        .eq("website_id", websiteId)
        .eq("on_dashboard", true)
        .order("updated_at", { ascending: false });
      const seeded = (finalDash as SavedQuery[]) ?? [];
      setQueries((prev) => {
        const map = new Map(prev.map((q) => [q.id, q]));
        seeded.forEach((q) => map.set(q.id, q));
        return Array.from(map.values());
      });
      return seeded;
    })().finally(() => {
      seedInFlight.delete(websiteId);
    });

    seedInFlight.set(websiteId, promise);
    return promise;
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
