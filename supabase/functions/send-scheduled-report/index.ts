// v5 – getUser auth fix
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const API_PROXY_SERVICE_KEY = Deno.env.get("API_PROXY_SERVICE_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const API_BASE_URL = "https://api-wldojy4riq-uc.a.run.app";

// ── Cron expression matcher ──────────────────────────────────────────────────
function cronMatchesNow(cron: string, now: Date): boolean {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return false;

  const [minP, hourP, domP, monP, dowP] = parts;
  const minute = now.getMinutes();
  const hour = now.getHours();
  const dom = now.getDate();
  const month = now.getMonth() + 1;
  const dow = now.getDay(); // 0=Sun

  function matches(field: string, value: number, max: number): boolean {
    if (field === "*") return true;
    return field.split(",").some((part) => {
      if (part.includes("/")) {
        const [range, stepStr] = part.split("/");
        const step = parseInt(stepStr, 10);
        const start = range === "*" ? 0 : parseInt(range, 10);
        for (let i = start; i <= max; i += step) {
          if (i === value) return true;
        }
        return false;
      }
      if (part.includes("-")) {
        const [lo, hi] = part.split("-").map(Number);
        return value >= lo && value <= hi;
      }
      return parseInt(part, 10) === value;
    });
  }

  return (
    matches(minP, minute, 59) &&
    matches(hourP, hour, 23) &&
    matches(domP, dom, 31) &&
    matches(monP, month, 12) &&
    matches(dowP, dow, 6)
  );
}

// ── Get current time in a timezone ───────────────────────────────────────────
function nowInTimezone(tz: string): Date {
  const str = new Date().toLocaleString("en-US", { timeZone: tz });
  return new Date(str);
}

// ── Execute query via backend API ────────────────────────────────────────────
async function executeQuery(
  websiteId: string,
  sql: string,
  userAccessToken: string
): Promise<{ columns: string[]; rows: (string | number | null)[][] }> {
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userAccessToken}`,
    },
    body: JSON.stringify({ website_id: websiteId, sql }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Query execution failed: ${err}`);
  }
  return res.json();
}

// ── Generate AI insights ─────────────────────────────────────────────────────
async function generateInsights(
  queryName: string,
  columns: string[],
  rows: (string | number | null)[][]
): Promise<string> {
  if (!LOVABLE_API_KEY) return "";

  // Truncate data for the AI prompt
  const maxRows = 30;
  const dataPreview = rows.slice(0, maxRows);
  const csvHeader = columns.join(",");
  const csvRows = dataPreview.map((r) => r.map((c) => String(c ?? "")).join(",")).join("\n");
  const truncatedNote = rows.length > maxRows ? `\n(Showing ${maxRows} of ${rows.length} rows)` : "";

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a data analyst. Summarize the following analytics query results in 3-4 concise bullet points. Highlight trends, anomalies, and actionable insights. Use plain text, no markdown headers. Each bullet should start with • ",
          },
          {
            role: "user",
            content: `Query: "${queryName}"\n\nData:\n${csvHeader}\n${csvRows}${truncatedNote}`,
          },
        ],
        stream: false,
      }),
    });

    if (!res.ok) {
      console.error("AI gateway error:", res.status, await res.text());
      return "";
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  } catch (err) {
    console.error("AI insights error:", err);
    return "";
  }
}

// ── Build HTML email ─────────────────────────────────────────────────────────
function buildEmailHtml(
  queryName: string,
  insights: string,
  columns: string[],
  rows: (string | number | null)[][],
  scheduledBy: string
): string {
  const maxRows = 50;
  const displayRows = rows.slice(0, maxRows);
  const truncated = rows.length > maxRows;

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const insightsHtml = insights
    ? `<div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-weight:600;color:#9a3412;font-size:14px;">✦ AI Insights</p>
        <p style="margin:0;color:#431407;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(insights)}</p>
      </div>`
    : "";

  const tableRows = displayRows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;font-family:monospace;color:#1f2937;">${escapeHtml(String(cell ?? "—"))}</td>`).join("")}</tr>`
    )
    .join("");

  const tableHeaders = columns
    .map(
      (col) =>
        `<th style="padding:8px 12px;border-bottom:2px solid #d1d5db;font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;text-align:left;background:#f9fafb;">${escapeHtml(col)}</th>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:680px;margin:0 auto;padding:32px 24px;">
    <!-- Header -->
    <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #111827;">
      <span style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#111827;">✦ AudienceScan</span>
      <span style="font-size:11px;color:#9ca3af;margin-left:12px;">Scheduled Report</span>
    </div>

    <!-- Query name -->
    <h1 style="margin:0 0 20px;font-size:18px;font-weight:700;color:#111827;">${escapeHtml(queryName)}</h1>

    <!-- AI Insights -->
    ${insightsHtml}

    <!-- Data table -->
    <div style="overflow-x:auto;">
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;">
        <thead><tr>${tableHeaders}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    ${truncated ? `<p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">Showing first 50 of ${rows.length} rows.</p>` : ""}

    <!-- Footer -->
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        This report was scheduled by ${escapeHtml(scheduledBy)}. Manage your schedules in <a href="https://iaudiencescan.lovable.app/queries" style="color:#f97316;text-decoration:none;">AudienceScan</a>.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ── Send email via Resend ────────────────────────────────────────────────────
async function sendEmail(to: string[], subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AudienceScan Reports <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const isTest = url.searchParams.get("test") === "true";
    const testReportId = url.searchParams.get("report_id");

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── Test mode: validate JWT and run a specific report ──
    if (isTest && testReportId) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const supabaseUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user }, error: userErr } = await supabaseUser.auth.getUser(token);
      if (userErr || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const userId = user.id;

      // Fetch the report (must belong to user)
      const { data: report, error: reportErr } = await supabaseAdmin
        .from("scheduled_reports")
        .select("*")
        .eq("id", testReportId)
        .eq("user_id", userId)
        .single();

      if (reportErr || !report) {
        return new Response(JSON.stringify({ error: "Report not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch the query
      const { data: query } = await supabaseAdmin
        .from("queries")
        .select("name, sql")
        .eq("id", report.query_id)
        .single();

      if (!query?.sql) {
        return new Response(JSON.stringify({ error: "Query has no SQL" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Execute using the user's token
      const results = await executeQuery(report.website_id, query.sql, token);
      const insights = await generateInsights(query.name, results.columns, results.rows);

      // Get user email for footer
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      const userEmail = userData?.user?.email ?? "unknown";

      const html = buildEmailHtml(query.name, insights, results.columns, results.rows, userEmail);
      await sendEmail(report.recipients, `[Test] ${query.name} — AudienceScan Report`, html);

      return new Response(
        JSON.stringify({ success: true, recipients: report.recipients }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Cron mode: find and process all due reports ──
    const { data: reports, error: reportsErr } = await supabaseAdmin
      .from("scheduled_reports")
      .select("*")
      .eq("enabled", true);

    if (reportsErr) {
      console.error("Failed to fetch reports:", reportsErr);
      return new Response(JSON.stringify({ error: "DB error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    let errors = 0;

    for (const report of reports ?? []) {
      try {
        // Check expiry
        if (report.ends_at && new Date(report.ends_at) < new Date()) {
          await supabaseAdmin
            .from("scheduled_reports")
            .update({ enabled: false })
            .eq("id", report.id);
          continue;
        }

        // Check if cron matches current time in report's timezone
        const localNow = nowInTimezone(report.timezone || "UTC");
        if (!cronMatchesNow(report.cron_expression, localNow)) continue;

        // Prevent double-send within the same minute
        if (report.last_sent_at) {
          const lastSent = new Date(report.last_sent_at);
          const diffMs = Date.now() - lastSent.getTime();
          if (diffMs < 55000) continue; // less than 55 seconds ago
        }

        // Fetch the query SQL
        const { data: query } = await supabaseAdmin
          .from("queries")
          .select("name, sql, user_id")
          .eq("id", report.query_id)
          .single();

        if (!query?.sql) continue;

        // We need an access token. Use service key to impersonate via admin API.
        // Generate a short-lived token for the user.
        // Fallback: use the API_PROXY_SERVICE_KEY directly with user context headers.
        const results = await executeQueryAsService(report.website_id, query.sql);
        const insights = await generateInsights(query.name, results.columns, results.rows);

        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(report.user_id);
        const userEmail = userData?.user?.email ?? "unknown";

        const html = buildEmailHtml(query.name, insights, results.columns, results.rows, userEmail);
        await sendEmail(report.recipients, `${query.name} — AudienceScan Report`, html);

        // Update last_sent_at
        await supabaseAdmin
          .from("scheduled_reports")
          .update({ last_sent_at: new Date().toISOString() })
          .eq("id", report.id);

        processed++;
      } catch (err) {
        console.error(`Error processing report ${report.id}:`, err);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ processed, errors, total: reports?.length ?? 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Handler error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ── Execute query using service key (for cron mode) ──────────────────────────
async function executeQueryAsService(
  websiteId: string,
  sql: string
): Promise<{ columns: string[]; rows: (string | number | null)[][] }> {
  // Use the API proxy service key to execute queries without a user JWT
  const serviceKey = API_PROXY_SERVICE_KEY;
  if (!serviceKey) throw new Error("API_PROXY_SERVICE_KEY not configured");

  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Service-Key": serviceKey,
      "X-Website-Id": websiteId,
    },
    body: JSON.stringify({ website_id: websiteId, sql }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Query execution failed (service): ${err}`);
  }
  return res.json();
}
