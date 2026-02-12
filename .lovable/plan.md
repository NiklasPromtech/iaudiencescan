

# Landing Page V3 Updates

## 1. Add Ned's Testimonial with Book Demo Link

Add a third testimonial card below the existing two quotes:

> "He got some really good ideas on how to maximize value from your visitor data — it's worth grabbing 30 minutes with him."
> — Ned, Token Project

Below the quote, add a subtle "Book a Demo" text link (muted style, not a loud button) that links to a Calendly or contact page. Will use a simple `text-muted-foreground hover:text-foreground` link with an arrow icon.

## 2. Fix Logo Marquee to Loop Infinitely

The current marquee already duplicates the logos array (`[...clientLogos, ...clientLogos]`), but the animation may be stopping or glitching. The fix:

- Ensure the track has the logos duplicated (already done)
- Verify the CSS animation uses `translateX(-50%)` so the second copy seamlessly replaces the first (already in place)
- The issue is likely that `overflow-hidden` needs to be on a proper wrapper. Will clean up the container structure to guarantee seamless infinite looping.

## 3. Simplify "Find More of Your Best Users" Section

Currently showing all 4 platform cards (X, Telegram, Discord, Reddit) with full token lists plus a full news feed. Will simplify to:

- Show only the **top 3 platform cards** (X, Telegram, Reddit) — dropping Discord
- Limit each card to show only **3 tokens** instead of all 5-8
- Replace the bottom italic text with a compelling CTA line like: *"Install our tag. We'll find the communities your users already belong to."*
- **Remove the full MockNewsFeed** from this section — it's too much data for a landing page sell section

## Technical Details

**Files to modify:**

1. **`src/pages/LandingPageV3.tsx`**
   - Add third testimonial block after the "Head of Growth" quote with Ned's quote and a "Book a Demo" link
   - Clean up marquee wrapper structure if needed
   - Replace `<MockPlatformCards />` with a trimmed inline version showing only 3 platforms with 3 tokens each
   - Remove `<MockNewsFeed />` from the audience intelligence section
   - Update the italic tagline text

2. **`src/components/landing/MockPlatformCards.tsx`**
   - Add a `limit` prop to cap tokens shown per platform, or handle the trimming in LandingPageV3 directly

3. **`src/components/landing/mock-data.ts`**
   - No changes needed — we'll just slice the data in the component
