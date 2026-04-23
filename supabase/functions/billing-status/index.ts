import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData } = await supabaseAuth.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!userData.user) throw new Error("Not authenticated");

    const { website_id } = await req.json();
    if (!website_id) throw new Error("website_id required");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("status, trial_ends_at, current_period_end, cancel_at_period_end, stripe_subscription_id")
      .eq("website_id", website_id)
      .maybeSingle();

    const activeStatuses = ["trialing", "active", "past_due"];
    const has_access = !!(sub && activeStatuses.includes(sub.status ?? ""));

    return new Response(
      JSON.stringify({
        has_access,
        status: sub?.status ?? null,
        trial_ends_at: sub?.trial_ends_at ?? null,
        current_period_end: sub?.current_period_end ?? null,
        cancel_at_period_end: sub?.cancel_at_period_end ?? false,
        has_subscription: !!sub?.stripe_subscription_id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message, has_access: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
