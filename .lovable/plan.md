

## Landing Page V3 — Simplified "3 Pillars" Refresh

Drop the "Stop rebuilding…" framing. Lead with the three things AudienceScan does, follow with what GA can't do, keep the proof, and move the playful "boom boom boom" AI SQL demo to a dedicated How It Works page. Extension download lives behind login on the Integrations page.

### New page flow (LandingPageV3)

```text
1.  Hero (rewritten, simpler)        → Soft value line + CTA
2.  Three pillars row (NEW flagship) → 3 large cards with screenshots
3.  Beyond Google Analytics (NEW)    → Bot detection + Wallet enrichment
4.  $25K testimonial (kept)
5.  Logo marquee (kept)
6.  Three problems / one install (kept)
7.  Overview preview (kept, eyebrow renamed)
8.  Period comparison (kept)
9.  Wallet value (kept)
10. Audience scanning (kept)
11. "GA wrapped in Dune" testimonial (kept)
12. Final CTA (kept)
```

### Section 1 — Hero (rewritten, gentler)

- H1: **"Web3 analytics that respects your time."**
- Subhead: *"Build your view once. Reuse it forever. We cut the number of times you have to dig for the same numbers."*
- CTA + trust strip unchanged.
- Remove the rotating "Stop paying for bot traffic…" tail.

### Section 2 — Three pillars row (NEW flagship)

Three large vertical cards in a 1×3 grid (stacks on mobile). Each card: eyebrow, H3, one-line body, screenshot/mock visual, secondary "See how →" link.

- **Card A — Build your own dashboard**
  - Body: *"Pin queries as tiles. They update themselves."*
  - Visual: `MockQueryDashboard` mini (4-tile grid)
  - Link: "See how →" → `/how-it-works#dashboard`
- **Card B — See where people click**
  - Body: *"Browser extension overlays real click counts on every button."*
  - Visual: `MockClickHeatmap` mini (browser frame + orange % badges, mirrors the user's screenshot)
  - Link: "See how →" → `/how-it-works#extension`
- **Card C — Ask in Telegram**
  - Body: *"DM the bot or invite it to a group. /ask and get the number."*
  - Visual: `MockTelegramChat` mini (placeholder, swap-ready for real screenshots)
  - Link: "See how →" → `/how-it-works#telegram`

### Section 3 — Beyond Google Analytics (NEW)

Eyebrow: `BEYOND GOOGLE ANALYTICS`. H2: **"What we do that GA can't."** Two side-by-side cards:
- **Bot detection** — *"Google Analytics counts bot clicks as real visitors. We flag them — so you stop paying to advertise to scrapers."*
- **Wallet enrichment** — *"When an EVM wallet connects, we capture the address and enrich it with token holdings + USD value. GA shows you a session — we show you a buyer."*

### Section 12 — Remove

Delete the existing "Query your data like a data analyst" SQL teaser (lines ~414–456 of `LandingPageV3.tsx`) — its narrative moves to the How It Works page.

### How It Works page — playful "boom boom boom" SQL demo

Repurpose the existing `/how-it-works` route (currently just renders the `HowItWorks` component) into a richer page with three anchored sections matching the pillars. The flagship is an animated AI SQL storyboard.

**New page: `src/pages/HowItWorksPage.tsx` (rewrite)**

```text
#dashboard  → Query Dashboard walkthrough (4-tile mock + copy)
#sql        → AI SQL animated demo ("boom boom boom")
#extension  → Click overlay walkthrough + "Download in Settings →"
#telegram   → Telegram bot walkthrough (chat mock placeholder)
```

**The "boom boom boom" demo (`MockAISQLDemo`)**

Single bordered panel with prompt input styled like the real `Generate with a prompt` field (orange spark icon, mono placeholder). Animated transcript that auto-plays on scroll-in, loops with a 2s pause:

```text
1. Types: "Show me new users on the deposit page over the last 14 days"
2. Loading dots → SQL block fades in (syntax-highlighted)
3. Run button pulses → bar chart fades in (boom)
4. Follow-up types: "How many connected a wallet, and the median balance?"
5. Loading → second SQL block
6. Run → result table appears (boom)
Pause 2s → loop
```

Built with `framer-motion` + `IntersectionObserver`. Reduced-motion users see the final state immediately.

### Integrations page (`src/pages/Integrations.tsx`)

Replace the Browser Extension card's "coming soon" expanded content with:
1. **Download button** — fetch+blob from `https://storage.googleapis.com/audiencescan-downloads/extension/audiencescan-extension.zip`
2. Numbered install steps: unzip & keep folder stable → open `chrome://extensions` → enable Developer mode → Load unpacked → pin extension, paste API key + Tag ID
3. Muted note: *"Works in all Chromium browsers. One-click Chrome Web Store install coming soon."*
4. Add `id="extension"` anchor for deep links from landing/how-it-works.

Download is behind login (Integrations sits inside `DashboardLayout`, which is already gated by `RequireAuth`).

### Implementation

**Files to edit**
- `src/pages/LandingPageV3.tsx` — rewrite hero, replace top sections with `PillarsRow`, insert `GAComparison`, remove old SQL teaser, tweak existing eyebrows.
- `src/pages/HowItWorksPage.tsx` — rewrite into a 4-section anchored walkthrough page hosting the AI SQL animated demo and the dashboard/extension/telegram walkthroughs.
- `src/pages/Integrations.tsx` — replace Browser Extension card content with download + instructions, add `#extension` anchor.

**Files to create**
- `src/components/landing/PillarsRow.tsx` — three large pillar cards with embedded mini mocks + "See how →" links.
- `src/components/landing/MockQueryDashboard.tsx` — 4-tile grid (recharts mini charts).
- `src/components/landing/MockClickHeatmap.tsx` — browser frame + orange percentage badges (mirrors uploaded screenshot).
- `src/components/landing/MockTelegramChat.tsx` — chat-bubble placeholder, designed so real screenshots can drop in later.
- `src/components/landing/MockAISQLDemo.tsx` — scripted animated "boom boom boom" storyboard for the How It Works page.
- `src/components/landing/GAComparison.tsx` — two-card "Beyond GA" section.
- `src/lib/download-extension.ts` — `EXTENSION_DOWNLOAD_URL` constant + `downloadExtension()` helper (fetch+blob).

**Style** (per `mem://style/dune-aesthetic`)
- `rounded-none`, no shadows except outer hero/dashboard frames, Space Mono for data/code/numerals, Bai Jamjuree for body, color tokens only (no hex), borders via `border-border`.
- Click badges: orange `bg-primary` rectangles with white Space Mono percentages.
- AI SQL prompt input mirrors the in-app `Generate with a prompt` styling.

**Out of scope**
Header, Footer, other pages, backend changes, real Telegram/extension screenshots (slots reserved), Chrome Web Store publishing, real AI calls from the demo (fully scripted).

