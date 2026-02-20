// sql-generate v3 — AI-powered SQL generation via Lovable AI Gateway
// deploy-trigger: 2026-02-20T-v3
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase env vars not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { prompt, schema } = await req.json();
    if (!prompt?.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build schema context for the AI
    const schemaContext = Array.isArray(schema) && schema.length > 0
      ? schema
          .map((table: { name: string; description?: string; columns: { name: string; type: string; description?: string }[] }) => {
            const cols = table.columns
              .map((c) => `  ${c.name} ${c.type}${c.description ? ` -- ${c.description}` : ""}`)
              .join("\n");
            return `TABLE ${table.name}${table.description ? ` -- ${table.description}` : ""}:\n${cols}`;
          })
          .join("\n\n")
      : "No schema available — generate a reasonable query based on the prompt.";

    const systemPrompt = `You are a SQL query generator for the AudienceScan analytics platform.
You receive a natural language request and a database schema, and you return ONLY valid SQL — no explanation, no markdown fences, no preamble, no backticks.
The SQL must be compatible with BigQuery syntax.
Only reference tables and columns that exist in the provided schema.
If the request cannot be answered from the schema, return a SQL comment explaining why (e.g. -- The requested data is not available in the current schema).

Database schema:
${schemaContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached — please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted — please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error (${response.status})`);
    }

    const aiData = await response.json();
    const sql = aiData.choices?.[0]?.message?.content?.trim() ?? "";

    // Strip accidental markdown fences if the model adds them anyway
    const cleaned = sql
      .replace(/^```(?:sql)?\n?/i, "")
      .replace(/\n?```$/, "")
      .trim();

    return new Response(
      JSON.stringify({ sql: cleaned }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("sql-generate error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
