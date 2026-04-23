import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const EXTERNAL_API_BASE = "https://api-wldojy4riq-uc.a.run.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const url = new URL(req.url);
    const websiteId = url.searchParams.get("website_id");
    if (!websiteId) return json({ error: "website_id required" }, 400);

    // Verify access to this website via external API (covers owner + shared)
    const accessResp = await fetch(`${EXTERNAL_API_BASE}/websites/accessible`, {
      headers: { Authorization: authHeader, "Content-Type": "application/json" },
    });
    if (!accessResp.ok) return json({ error: "Failed to verify website access" }, 502);
    const accessJson = await accessResp.json();
    const accessibleWebsites = accessJson.websites || [];
    const website = accessibleWebsites.find((w: any) => w.id === websiteId);
    if (!website) return json({ error: "No access to website" }, 403);

    const isOwner = website.owner_id === claimsData.claims.sub || website.user_id === claimsData.claims.sub;

    // Look up subscription with service role
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: sub } = await admin
      .from("subscriptions")
      .select("*")
      .eq("website_id", websiteId)
      .maybeSingle();

    const status = sub?.status ?? null;
    const hasAccess = status === "trialing" || status === "active";

    return json({
      subscription: sub,
      status,
      hasAccess,
      isOwner,
      website: { id: website.id, name: website.name, status: website.status },
    });
  } catch (e: any) {
    console.error("billing-status error:", e);
    return json({ error: e.message ?? "Internal error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
