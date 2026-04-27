# Landing Page: /ga-alternative

A dedicated landing page optimized for the Google Ads campaign targeting "Google Analytics alternative" keywords. Pure frontend — no backend changes needed, so this is unblocked by the database situation.

## Why a dedicated landing page (not just /)

Google Ads quality score (and conversion rate) goes up when the landing page **mirrors the ad's promise**. Sending "GA Alternative for Web3" traffic to the generic homepage wastes budget. This page will:

- Match the ad headlines word-for-word (Quality Score boost → cheaper clicks)
- Lead with the offer ("Free until 20K pageviews")
- Have a single goal: signup. No nav distractions.
- Be indexable for organic traffic on the same keywords later

## Page structure

```text
┌──────────────────────────────────────────────┐
│  Slim header (logo + Sign in only, no nav)   │
├──────────────────────────────────────────────┤
│  HERO                                         │
│   H1: GA Alternative for Web3                 │
│   Sub: Cookieless. Privacy-first.             │
│        Free until 20K monthly pageviews.      │
│   [Start Free — No Credit Card]  [See Demo]  │
│   Trust line: "Set up in under 5 minutes •   │
│   GDPR-ready • No cookie banner needed"      │
├──────────────────────────────────────────────┤
│  LOGO MARQUEE (reused from homepage)          │
│  "Trusted by 50+ Web3 teams"                  │
├──────────────────────────────────────────────┤
│  GA vs AudienceScan COMPARISON TABLE          │
│   Feature           | GA4      | AudienceScan │
│   Cookieless        | ✗        | ✓            │
│   Cookie banner     | Required | Not needed   │
│   Bot filtering     | Weak     | Built-in     │
│   Wallet tracking   | ✗        | ✓            │
│   Click-text track  | ✗        | ✓            │
│   GDPR out of box   | ✗        | ✓            │
│   Free tier         | 10M evts | 20K pv/mo    │
│   Setup time        | Hours    | <5 min       │
├──────────────────────────────────────────────┤
│  THREE PILLARS (reused: Bot / Wallet / Click) │
│  "What we track that GA can't"                │
├──────────────────────────────────────────────┤
│  HOW IT WORKS — 3 steps                       │
│   1. Drop one snippet  2. See real users      │
│   3. Stay free until 20K pv/mo                │
├──────────────────────────────────────────────┤
│  FAQ (4-5 ad-relevant questions)              │
│   - Is it really free?                        │
│   - Do I need a cookie banner?                │
│   - Is it GDPR compliant?                     │
│   - How long to migrate from GA4?             │
│   - Will I lose my historical GA data?        │
├──────────────────────────────────────────────┤
│  FINAL CTA banner                             │
│   "Replace Google Analytics in 5 minutes"     │
│   [Start Free]                                │
├──────────────────────────────────────────────┤
│  Slim footer (legal links only)               │
└──────────────────────────────────────────────┘
```

## Design

- Reuse existing design tokens — Space Mono headings, Bai Jamjuree body, flat borders, primary accent. Matches the rest of the site, no new visual language.
- Reuse existing components where possible: `PillarsRow`, `GAComparison`, logo marquee block, `Footer`.
- New components built fresh: `GAAltHero`, `GAvsTable`, `GAAltHowItWorks`, `GAAltFAQ`, `GAAltCTA`.
- **Slim header**: a stripped-down version of `Header` — just logo + "Sign in" + "Start Free" button. No links to /blog, /resources, /how-it-works (those leak conversions away from the ad goal).

## SEO & ad-targeting details

- Route: `/ga-alternative` (matches the ad Final URL).
- `<title>`: "Google Analytics Alternative for Web3 — Free Until 20K Pageviews | AudienceScan"
- Meta description: pulled from ad description #1.
- Use `react-helmet-async` if already installed, otherwise set via a small inline `<head>` effect. (I'll check on implementation.)
- H1 = "GA Alternative for Web3" (exact ad H1 #1).
- Body copy naturally includes target keywords: "Google Analytics alternative", "GA4 alternative", "replace Google Analytics", "lightweight web analytics", "simple website analytics", "free Google Analytics alternative".
- Internal link from homepage footer → "/ga-alternative" so it's crawlable.
- Add to `public/sitemap.xml`.

## What I will NOT build now

- A/B variants of the page (ship one, iterate after we see ad performance).
- Conversion tracking / GTM events (separate task; needs decisions on what events).
- Pricing page link from this page (don't show price ladders — the offer is "free", let them sign up first).

## Open question before building

One thing to confirm — want me to proceed with the assumption above, or:

- Should the primary CTA button go to `/auth` (signup form) or to `/install` (the install guide)?

I'll default to `/auth` (signup) since that's the conversion event the campaign optimizes for, but tell me if you'd prefer otherwise.

## Files

**New**
- `src/pages/GAAlternative.tsx`
- `src/components/ga-alt/GAAltHero.tsx`
- `src/components/ga-alt/GAvsTable.tsx`
- `src/components/ga-alt/GAAltHowItWorks.tsx`
- `src/components/ga-alt/GAAltFAQ.tsx`
- `src/components/ga-alt/GAAltCTA.tsx`
- `src/components/ga-alt/SlimHeader.tsx`

**Edited**
- `src/App.tsx` — add lazy route for `/ga-alternative`
- `public/sitemap.xml` — add the new URL
- `src/components/Footer.tsx` — add a discreet link (for crawlability)
