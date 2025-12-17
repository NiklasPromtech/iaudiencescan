import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { messages, scanContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
          ...messages,
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
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
