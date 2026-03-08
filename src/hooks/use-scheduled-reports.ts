import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ScheduledReport {
  id: string;
  query_id: string;
  user_id: string;
  website_id: string;
  recipients: string[];
  cron_expression: string;
  timezone: string;
  enabled: boolean;
  ends_at: string | null;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ScheduledReportPatch = {
  recipients?: string[];
  cron_expression?: string;
  timezone?: string;
  enabled?: boolean;
  ends_at?: string | null;
};

export function useScheduledReports() {
  const [loading, setLoading] = useState(false);

  const fetchForQuery = useCallback(async (queryId: string): Promise<ScheduledReport | null> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("scheduled_reports")
      .select("*")
      .eq("query_id", queryId)
      .maybeSingle();
    if (error) throw error;
    return data as ScheduledReport | null;
  }, []);

  const createReport = useCallback(
    async (params: {
      queryId: string;
      websiteId: string;
      recipients: string[];
      cronExpression: string;
      timezone: string;
      endsAt?: string | null;
    }): Promise<ScheduledReport> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("scheduled_reports")
          .insert({
            query_id: params.queryId,
            user_id: user.id,
            website_id: params.websiteId,
            recipients: params.recipients,
            cron_expression: params.cronExpression,
            timezone: params.timezone,
            ends_at: params.endsAt ?? null,
          })
          .select()
          .single();
        if (error) throw error;
        return data as unknown as ScheduledReport;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateReport = useCallback(
    async (id: string, patch: ScheduledReportPatch): Promise<void> => {
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from("scheduled_reports")
          .update({ ...patch, updated_at: new Date().toISOString() })
          .eq("id", id);
        if (error) throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("scheduled_reports")
        .delete()
        .eq("id", id);
      if (error) throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const testReport = useCallback(async (reportId: string): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-scheduled-report?test=true&report_id=${reportId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Test failed: ${res.status}`);
    }
  }, []);

  return {
    loading,
    fetchForQuery,
    createReport,
    updateReport,
    deleteReport,
    testReport,
  };
}
