import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Default metrics that appear if user hasn't customized
export const DEFAULT_STARRED_METRICS = [
  "unique_visitors",
  "pageviews",
  "wallet_users",
  "converted_users",
];

export function useStarredMetrics() {
  const [starredMetrics, setStarredMetrics] = useState<string[]>(DEFAULT_STARRED_METRICS);
  const [loading, setLoading] = useState(true);

  // Load starred metrics on mount
  useEffect(() => {
    const loadStarredMetrics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("starred_metrics")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profile?.starred_metrics && profile.starred_metrics.length > 0) {
          setStarredMetrics(profile.starred_metrics);
        }
      } catch (error) {
        console.error("Failed to load starred metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStarredMetrics();
  }, []);

  // Toggle a metric's starred state
  const toggleMetric = useCallback(async (metricKey: string) => {
    const newStarred = starredMetrics.includes(metricKey)
      ? starredMetrics.filter((m) => m !== metricKey)
      : [...starredMetrics, metricKey];

    // Optimistic update
    setStarredMetrics(newStarred);

    // Persist to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ starred_metrics: newStarred })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Failed to persist starred metrics:", error);
      // Revert on error
      setStarredMetrics(starredMetrics);
    }
  }, [starredMetrics]);

  // Check if a metric is starred
  const isStarred = useCallback((metricKey: string) => {
    return starredMetrics.includes(metricKey);
  }, [starredMetrics]);

  return {
    starredMetrics,
    toggleMetric,
    isStarred,
    loading,
  };
}
