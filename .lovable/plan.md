

## LinkedIn Test Ads Page at `/ads`

Create a new page at `/ads` that displays 10 LinkedIn ad mockups — each styled as a realistic LinkedIn sponsored post card. This is an internal creative reference page (like `/sales-pitch` or `/sample1`).

### The 10 Ads

Each ad targets a different pain point / hook based on the repositioned product messaging:

1. **"23% of your Web3 traffic is bots"** — Lead with the stat. Visual: the MockBotSummary donut chart showing human vs bot split. CTA: "Find out your bot rate — free"

2. **"We helped a client claim $25,000 back from a publisher"** — Social proof / legal angle. Visual: quote card with the testimonial. CTA: "See how bot detection works"

3. **"What if your CPA was based on real wallets — not bot clicks?"** — Attribution angle. Visual: side-by-side showing inflated CPA vs real CPA. CTA: "Get your real CPA"

4. **"Your token holders also follow these 18 X accounts"** — Scan result hook. Visual: mock list of X handles with follower counts. CTA: "Run your first scan free"

5. **"It's like Google Analytics — but it actually works for Web3"** — GA replacement. Visual: feature comparison (3 bullet points, not a table). CTA: "Free to start. No credit card."

6. **"Stop optimizing for clicks. Start optimizing for wallets."** — Philosophy ad. Visual: simple text-on-brand-gradient. CTA: "See wallet-level analytics"

7. **"We found 6 Telegram groups where your next buyers already hang out"** — Telegram targeting. Visual: mock Telegram group cards with member counts. CTA: "Find your communities"

8. **"Free Web3 analytics with bot detection. No, really."** — Free angle. Visual: pricing-style card showing $0 with feature list. CTA: "Start free today"

9. **"Your $2,000/mo ad budget? $460 of it goes to bots."** — Dollar waste. Visual: stacked bar showing wasted vs effective spend. CTA: "Find out how much you're wasting"

10. **"Query your own data. Export to CSV. No SQL experience needed."** — Power user / data analyst angle. Visual: styled SQL code snippet. CTA: "Try the query workspace"

### Page Design

- Dark background (matching the product's Dune aesthetic)
- 2-column grid of ad cards on desktop, single column on mobile
- Each card is styled as a LinkedIn sponsored post: company logo + name at top, body copy, visual/image area, CTA button at bottom
- Each card has a small label: "Ad 1/10", "Ad 2/10" etc.
- Header at top: "LinkedIn Ad Test Concepts" with a back button
- No Header/Footer components (it's an internal tool page)

### Technical Details

**New file: `src/pages/LinkedInAds.tsx`**
- Single self-contained page component
- Each ad is a card with: headline, body text (2-3 sentences max — LinkedIn character limits), a visual area (either a simple styled div with stats/text or reusing existing mock components where appropriate), and a CTA button
- Uses existing Tailwind classes and the project's color system (primary orange, muted backgrounds)
- No new dependencies needed

**Modified file: `src/App.tsx`**
- Add route: `<Route path="/ads" element={<LinkedInAds />} />`
- Add lazy import for the new page

