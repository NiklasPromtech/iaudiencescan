import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

// No CORS — Stripe-to-server only
Deno.serve(async (req) => {
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeSecret || !webhookSecret) {
    return new Response("Stripe env missing", { status: 500 });
  }
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-11-20.acacia" });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const websiteId = session.metadata?.website_id;
        const ownerUserId = session.metadata?.owner_user_id;
        if (!websiteId) break;

        const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

        let payload: any = {
          website_id: websiteId,
          owner_user_id: ownerUserId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subId,
        };

        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          payload = { ...payload, ...subscriptionFields(sub) };
        }

        await admin.from("subscriptions").upsert(payload, { onConflict: "website_id" });
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const websiteId = sub.metadata?.website_id;
        if (!websiteId) break;
        const fields = subscriptionFields(sub);
        await admin.from("subscriptions").upsert({
          website_id: websiteId,
          owner_user_id: sub.metadata?.owner_user_id,
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          stripe_subscription_id: sub.id,
          ...fields,
        }, { onConflict: "website_id" });
        break;
      }
      default:
        break;
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("webhook handler error:", e);
    return new Response(`Handler error: ${e.message}`, { status: 500 });
  }
});

function subscriptionFields(sub: Stripe.Subscription) {
  const item = sub.items?.data?.[0];
  return {
    status: sub.status,
    stripe_price_id: item?.price?.id ?? null,
    trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_start: (sub as any).current_period_start
      ? new Date((sub as any).current_period_start * 1000).toISOString()
      : null,
    current_period_end: (sub as any).current_period_end
      ? new Date((sub as any).current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: !!sub.cancel_at_period_end,
  };
}
