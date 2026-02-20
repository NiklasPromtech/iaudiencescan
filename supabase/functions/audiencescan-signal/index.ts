import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "AudienceScan Signal", an on-chain strategy assistant for Web3 marketing teams.

Your job is to help users turn AudienceScan scan outputs into a concrete marketing plan using the AudienceScan Strategy Playbook.

What you can do:
- Interpret the provided ScanContext data (chains, socials, categories, token shortlist, confidence metrics).
- Recommend which playbook steps to run next (from the 10-step playbook).
- Explain recommendations using explicit data signals (confidence components, social presence, category concentration, chain concentration, wallet activity proxies).
- Suggest what to skip when signals are weak or confidence is low.

Hard rules:
- Do not invent handles, communities, token facts, partnerships, budgets, results, or platform capabilities.
- If information is not in ScanContext, say "Not enough data in this scan to confirm."
- Do not output long essays. Prefer short, actionable recommendations.
- Do not recommend steps that require data not present (e.g., if no Telegram-heavy signal, don't push Telegram ads as primary).
- Always prioritize high-confidence signals over low-confidence noise.
- Treat "Confidence" as "Signal reliability", not popularity.
- Use markdown formatting for clarity (bold, lists, tables when appropriate).

The 10-step AudienceScan Strategy Playbook:
1. Creating scans
2. X advertising setup
3. Telegram campaigns
4. Reddit campaigns
5. Google/DV360 campaigns
6. X DM campaigns
7. Telegram DM campaigns
8. X KOL outreach
9. Reddit comment campaigns
10. Micro-Universe campaigns`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !data?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, messages, scanContext, prompt, schema } = body ?? {};
    const safeMessages = Array.isArray(messages) ? messages : [];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // ── SQL generation action ────────────────────────────────────────────────
    if (action === "sql-generate") {
      if (!prompt?.trim()) {
        return new Response(JSON.stringify({ error: "Prompt is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

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

      const sqlSystemPrompt = `You are a SQL query generator for the AudienceScan analytics platform.
You receive a natural language request and a database schema, and you return ONLY valid SQL — no explanation, no markdown fences, no preamble, no backticks.
The SQL must be compatible with BigQuery syntax.
Only reference tables and columns that exist in the provided schema.
If the request cannot be answered from the schema, return a SQL comment explaining why (e.g. -- The requested data is not available in the current schema).

Database schema:
${schemaContext}`;

      const sqlResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-flash-1.5",
          messages: [
            { role: "system", content: sqlSystemPrompt },
            { role: "user", content: prompt },
          ],
          stream: false,
        }),
      });

      if (!sqlResponse.ok) {
        if (sqlResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit reached — please wait a moment and try again." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (sqlResponse.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted — please add credits to your workspace." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errText = await sqlResponse.text();
        console.error("AI gateway error:", sqlResponse.status, errText);
        throw new Error(`AI gateway error (${sqlResponse.status}): ${errText}`);
      }

      const aiData = await sqlResponse.json();
      const rawSql = aiData.choices?.[0]?.message?.content?.trim() ?? "";
      const cleanedSql = rawSql
        .replace(/^```(?:sql)?\n?/i, "")
        .replace(/\n?```$/, "")
        .trim();

      return new Response(JSON.stringify({ sql: cleanedSql }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Chat / signal action (default) ───────────────────────────────────────
    // Build the system message with scan context
    const systemMessage = scanContext 
      ? `${SYSTEM_PROMPT}\n\nCurrent ScanContext:\n${JSON.stringify(scanContext, null, 2)}`
      : SYSTEM_PROMPT;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemMessage },
            ...safeMessages,
          ],
          stream: true,
        }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("audiencescan-signal error:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
