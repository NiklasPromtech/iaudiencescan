import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const log = (step: string, details?: unknown) => {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? " - " + JSON.stringify(details) : ""}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
    apiVersion: "2025-08-27.basil",
  });
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig ?? "", webhookSecret);
  } catch (err) {
    log("Signature verification failed", (err as Error).message);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const upsertFromSubscription = async (sub: Stripe.Subscription) => {
    const website_id = sub.metadata?.website_id;
    if (!website_id) {
      log("Subscription missing website_id metadata", { sub_id: sub.id });
      return;
    }
    const owner_user_id = sub.metadata?.owner_user_id || null;
    const item = sub.items.data[0];
    const row = {
      website_id,
      owner_user_id,
      stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      stripe_subscription_id: sub.id,
      stripe_price_id: item?.price.id ?? null,
      status: sub.status,
      trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
      current_period_start: (sub as any).current_period_start
        ? new Date((sub as any).current_period_start * 1000).toISOString()
        : null,
      current_period_end: (sub as any).current_period_end
        ? new Date((sub as any).current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("subscriptions")
      .upsert(row, { onConflict: "website_id" });
    if (error) log("Upsert error", error.message);
    else log("Upserted subscription", { website_id, status: sub.status });
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          // ensure metadata copied through
          if (!sub.metadata?.website_id && session.metadata?.website_id) {
            await stripe.subscriptions.update(sub.id, {
              metadata: {
                website_id: session.metadata.website_id,
                owner_user_id: session.metadata.owner_user_id ?? "",
              },
            });
            const refreshed = await stripe.subscriptions.retrieve(sub.id);
            await upsertFromSubscription(refreshed);
          } else {
            await upsertFromSubscription(sub);
          }
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.trial_will_end": {
        await upsertFromSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        log("Unhandled event", event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    log("Handler error", (e as Error).message);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
});
