

# AudienceScan — Tag-Level Paywall (Phase 1)

Scope is intentionally narrow: **gate access to a verified tag's data behind a Stripe subscription tied to that tag**. No free tier logic, no usage metering, no trial-vs-free decisions yet — just "verified tag + no subscription = paywall".

---

## How it works

```
User opens /overview (or any data page) for selected website
        │
        ▼
Is the tag verified?
   ├─ NO  → existing flow: redirect to /install
   └─ YES → Does the website have an active subscription?
              ├─ YES (trialing | active) → show data
              └─ NO → show <PaywallScreen> with "Start free trial" CTA
```

The subscription is keyed on **`website_id`**, so any user with shared access to the tag inherits the same paid status.

---

## What I'll build

### Backend (Lovable Cloud)

1. **`subscriptions` table**
   - `id`, `website_id` (unique, fk), `owner_user_id`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `status`, `trial_ends_at`, `current_period_end`, `cancel_at_period_end`, timestamps
   - **RLS:** SELECT allowed for anyone with access to the website (owner or shared user, via existing sharing table). INSERT/UPDATE only via edge functions (service role).

2. **3 edge functions** (BYOK Stripe, using your existing connection)
   - `billing-create-checkout` — takes `website_id`, verifies caller owns it, creates Stripe Checkout session with `metadata.website_id`, 30-day trial
   - `billing-portal` — opens Stripe Customer Portal for owner to manage/cancel
   - `stripe-webhook` — listens for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`; upserts the `subscriptions` row by `website_id` from metadata
   - `verify_jwt = false` for `stripe-webhook` in `supabase/config.toml`

3. **Helper hook** `useWebsiteSubscription(websiteId)` — returns `{ status, isPaywalled, isOwner, loading }`

### Frontend

4. **`<PaywallScreen>` component** — shown in place of data pages when `isPaywalled === true`
   - Headline: "Unlock {website.domain}"
   - Subhead: "Start your 30-day free trial to access analytics for this tag"
   - Primary CTA: "Start free trial" → calls `billing-create-checkout` → redirects to Stripe
   - Secondary: "Manage other websites" → `/settings`
   - If caller is **not** the website owner: shows "Ask {owner email} to start a subscription" instead of CTA

5. **Gate the data pages**
   Wrap these routes' content with the paywall check (only when tag is verified):
   - `/overview`, `/change`, `/events`, `/audiences`, `/wallets`, `/bots`, `/queries`, `/query-dashboard`, `/data-explorer`
   - `/install`, `/settings`, `/settings/integrations` stay **open** (you need them to set up / pay)
   - Labs pages (`/scans`, `/costs`, `/touchpoints`, `/contracts`) — TBD, default to gated

6. **`/billing/success` page** — landing after Stripe Checkout, polls `subscriptions` row, redirects to `/overview` once `status = trialing`

7. **Subscription card in `/settings`** — shows current website's plan, [Manage subscription] button (owner only), opens Stripe Portal

---

## What I need from you

### Now
- **"Go"** to switch to default mode and build everything above
- Confirm: **don't gate `/install` or `/settings`** (sounds obvious but want to be explicit)

### After deployment (I'll prompt securely — don't paste in chat)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (rotate first, then paste the new one)
- `STRIPE_PRICE_ID` (your Volume-tiered price from Stripe Step 0)

### Stripe Step 0 (you, in Stripe dashboard — can do in parallel)
- Create the Meter (`pageview`), Product, and Volume-tiered Price
- Finish the webhook config screen with endpoint URL: `https://wksyyydmgpcaxdijalqf.supabase.co/functions/v1/stripe-webhook`

---

## Out of scope (Phase 2, later)

- Usage metering / reporting pageviews to Stripe
- Free tier (20k pageviews)
- Daily cron
- Trial-end-early-on-overage logic
- Past-due / dunning UI

We'll layer those on once Phase 1 is live and you can actually subscribe a tag.

