import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

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
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);
    const userId = claimsData.claims.sub as string;
    const userEmail = (claimsData.claims as any).email as string | undefined;

    const body = await req.json().catch(() => ({}));
    const websiteId = body.website_id as string | undefined;
    const successUrl = (body.success_url as string | undefined) ?? `${req.headers.get("origin") ?? ""}/billing/success?website_id=${websiteId}`;
    const cancelUrl = (body.cancel_url as string | undefined) ?? `${req.headers.get("origin") ?? ""}/overview`;
    if (!websiteId) return json({ error: "website_id required" }, 400);

    // Verify access via external API
    const accessResp = await fetch(`${EXTERNAL_API_BASE}/websites/accessible`, {
      headers: { Authorization: authHeader, "Content-Type": "application/json" },
    });
    if (!accessResp.ok) return json({ error: "Failed to verify website access" }, 502);
    const { websites } = await accessResp.json();
    const website = (websites || []).find((w: any) => w.id === websiteId);
    if (!website) return json({ error: "No access to website" }, 403);

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const priceId = Deno.env.get("STRIPE_PRICE_ID");
    if (!stripeSecret) return json({ error: "STRIPE_SECRET_KEY missing" }, 500);
    if (!priceId) return json({ error: "STRIPE_PRICE_ID missing" }, 500);

    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Find or create stripe customer for this website
    const { data: existingSub } = await admin
      .from("subscriptions")
      .select("*")
      .eq("website_id", websiteId)
      .maybeSingle();

    let customerId = existingSub?.stripe_customer_id as string | undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: website.name,
        metadata: { website_id: websiteId, owner_user_id: userId },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId }],
      subscription_data: {
        trial_period_days: 30,
        metadata: { website_id: websiteId, owner_user_id: userId },
      },
      metadata: { website_id: websiteId, owner_user_id: userId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Pre-create row so we can poll it
    await admin.from("subscriptions").upsert({
      website_id: websiteId,
      owner_user_id: userId,
      stripe_customer_id: customerId,
      status: existingSub?.status ?? "incomplete",
    }, { onConflict: "website_id" });

    return json({ url: session.url, session_id: session.id });
  } catch (e: any) {
    console.error("billing-create-checkout error:", e);
    return json({ error: e.message ?? "Internal error" }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
