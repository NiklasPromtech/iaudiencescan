import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SavedQuery {
  id: string;
  user_id: string;
  name: string;
  sql: string;
  starred: boolean;
  created_at: string;
  updated_at: string;
}

export type QueryPatch = {
  name?: string;
  sql?: string;
  starred?: boolean;
};

export function useQueries() {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: err } = await (supabase as any)
        .from("queries")
        .select("*")
        .order("updated_at", { ascending: false });
      if (err) throw err;
      setQueries((data as SavedQuery[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load queries");
    } finally {
      setLoading(false);
    }
  }, []);

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
        .insert({ name, sql, user_id: user.id })
        .select()
        .single();
      if (err) throw err;
      const created = data as unknown as SavedQuery;
      setQueries((prev) => [created, ...prev]);
      return created;
    },
    []
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase as any)
      .from("queries")
      .delete()
      .eq("id", id);
    if (err) throw err;
    setQueries((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return {
    queries,
    loading,
    error,
    refetch: fetchQueries,
    createQuery,
    updateQuery,
    deleteQuery,
  };
}
