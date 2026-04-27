# Landing Page: /compare (Competitor Conquest)

A second Google Ads landing page, this time targeting "Plausible / Fathom / Simple Analytics / Matomo / Umami / Cookie3 / Spindl / Absolute Labs / Addressable / Dune alternative" searches. Same playbook as `/ga-alternative` — pure frontend, no backend touched, no database risk.

## Strategy: one page, many competitors

Google Ads keyword list spans ~12 different competitors. Building 12 pages is overkill and dilutes SEO. Instead:

- **One canonical page** at `/compare` that ranks for "Web3 analytics comparison" / "Plausible alternative" / etc.
- A **competitor switcher** at the top — pills like `Plausible · Fathom · Simple Analytics · Matomo · Umami · Cookie3 · Spindl · Absolute Labs · Dune`
- Clicking a pill swaps the comparison column + headline copy in place (no route change, instant).
- Deep-link via query string: `/compare?vs=plausible` lands directly on the Plausible view. The ad's Final URL stays `/compare` but we can later point ad groups to `/compare?vs=plausible` for tighter Quality Score.

This gives us SEO concentration on one URL while still feeling tailored per competitor.

## Page structure

```text
┌──────────────────────────────────────────────┐
│  Slim header (logo + Sign in + Start Free)   │
├──────────────────────────────────────────────┤
│  HERO                                         │
│   Eyebrow: "Looking at Plausible?"           │
│   H1: Compare Web3 Analytics                 │
│   Sub: Wallet-aware. Cookieless.             │
│        Free under 20K monthly pageviews.     │
│   [Start Free — No Credit Card]  [See Demo]  │
├──────────────────────────────────────────────┤
│  COMPETITOR SWITCHER (pills)                  │
│   Plausible · Fathom · Simple Analytics ·    │
│   Matomo · Umami · Cookie3 · Spindl ·        │
│   Absolute Labs · Addressable · Dune · GA4   │
├──────────────────────────────────────────────┤
│  COMPARISON TABLE (3 cols: Feature | <Comp> | AudienceScan)
│   Wallet connects tracked                     │
│   Cookieless                                  │
│   No cookie banner                            │
│   GDPR out of the box                         │
│   Bot filtering                               │
│   Click-text tracking                         │
│   On-chain holder data                        │
│   Free tier                                   │
│   Setup time                                  │
├──────────────────────────────────────────────┤
│  WHY WEB3 TEAMS SWITCH (3 cards)              │
│   Wallet visibility · Privacy by default ·   │
│   One snippet, full insights                  │
├──────────────────────────────────────────────┤
│  HOW IT WORKS (3 steps, reused pattern)       │
├──────────────────────────────────────────────┤
│  FAQ                                          │
│   - Can I migrate from <competitor>?         │
│   - Is it really free?                        │
│   - Do I need a cookie banner?                │
│   - How is this different from a generic      │
│     privacy analytics tool?                   │
├──────────────────────────────────────────────┤
│  FINAL CTA banner                             │
├──────────────────────────────────────────────┤
│  Slim footer                                  │
└──────────────────────────────────────────────┘
```

## Per-competitor data (driving the switcher)

A single TypeScript map keyed by slug, each entry contains:

- `name` — display name
- `eyebrow` — e.g. "Looking at Plausible?", "Coming from Fathom?"
- `tagline` — one-liner positioning ("Privacy-first generic analytics, no Web3 layer")
- `rows` — values for each comparison row (✓ / ✗ / short text)
- `migrationNote` — one sentence shown in FAQ ("Migrating from Plausible takes ~5 minutes — drop in one script.")

Competitors covered: `plausible`, `fathom`, `simple-analytics`, `matomo`, `umami`, `cookie3`, `spindl`, `absolute-labs`, `addressable`, `dune`, `ga4`.

The factual rows for each will be conservative and accurate — the wedge is consistent across all of them: **none of them combine privacy-first web analytics with wallet/on-chain context in one drop-in script**. We will NOT make pricing claims about competitors (those change), only feature presence.

## SEO & ad targeting

- Route: `/compare` (matches Final URL).
- `<title>`: "Web3 Analytics Comparison — AudienceScan vs Plausible, Fathom, GA4 & more"
- Meta description: from ad description #1.
- H1: "Compare Web3 Analytics" (exact ad H1 #2).
- Body naturally contains every keyword from the list (each competitor name + "alternative").
- Add `/compare` to `public/sitemap.xml`.
- Footer link added for crawlability ("Compare").
- Selecting a competitor pill updates the URL query (`?vs=plausible`) via `history.replaceState` so each variant is shareable but doesn't trigger a route change.

## Reuse vs new

**Reuse:**
- `SlimHeader` (already built for `/ga-alternative`)
- `Footer`
- Existing design tokens, fonts, button styles

**New components (`src/components/compare/`):**
- `CompareHero.tsx`
- `CompetitorSwitcher.tsx`
- `CompareTable.tsx`
- `WhyWeb3Switch.tsx` (3 cards)
- `CompareHowItWorks.tsx`
- `CompareFAQ.tsx`
- `CompareCTA.tsx`
- `competitors.ts` (data map)

**New page:** `src/pages/Compare.tsx`

**Edited:**
- `src/App.tsx` — lazy route for `/compare`
- `public/sitemap.xml` — add `/compare`
- `src/components/Footer.tsx` — add "Compare" link next to "GA Alternative"

## What I will NOT build now

- Per-competitor static routes (`/compare/plausible` etc.) — query string is enough until we see ad performance.
- Conversion tracking events — separate task.
- Pricing detail per competitor — too volatile, not worth maintaining.

## Open question

Same as before: primary CTA → `/auth` (signup) by default. Tell me if you want `/install` instead.
