

## Rewrite HowItWorks and Resources for LandingPageV3

Both components are outdated and not currently used on V3. They'll be fully rewritten to match the V3 visual style (font-mono labels, border cards, dark aesthetic) and inserted into LandingPageV3 between the Ned testimonial and the Final CTA.

---

### New HowItWorks -- "How It Works"

Framed around the meeting notes structure: Problem, Solution, Steps, What You Get, Benefits.

**Opening context line** (replaces old generic heading):
"AudienceScan is like Google Analytics for crypto. Place a tag, enrich with wallet data, get actionable insights."

**3 steps, each with icon, title, description, and a concrete proof stat:**

| Step | Title | Description | Stat |
|------|-------|-------------|------|
| 1 -- Code2 icon | Place the tag | Drop a lightweight script tag on your site or app. Works with any CMS or custom build. Takes under 5 minutes. | Avg install time: 2 min |
| 2 -- Eye icon | Data starts flowing | Wallet extensions, geographic distribution, referrer sources, bot signals, and trading behavior -- all linked and analyzed automatically. | First data within 1 hour |
| 3 -- BarChart3 icon | Insights + recommendations | Your dashboard surfaces actionable audience segments, change detection (shifts in holders, new wallet patterns, geographic hot spots), and ready-to-use targeting lists. | Avg 12 communities per scan |

**"What You Get" sub-section** below the 3 steps -- a compact 2-column list:
- Actionable audience segments (frequent traders, top regions)
- Bot detection across 12+ signals
- Real CPA per wallet connected
- Community overlap (X, Telegram, Reddit, Discord)
- Change detection (trading behaviors, holder shifts)
- Geographic hot spots and wallet tier breakdowns

**Benefits footer** -- 3 inline stats:
- "Improved ROI by cutting bot spend"
- "Data-first strategy investors trust"
- "Insights visible within hours, not weeks"

Visual style: matches V3 -- `font-mono text-[10px] uppercase tracking-widest` labels, `border border-border bg-card` cards, no rounded corners (matches existing `rounded-none` on Cards but the landing page uses `rounded-lg` so we'll match that).

---

### New Resources -- "Get Started"

Rewritten to match the meeting notes structure: Onboarding, Dashboards, Case Studies, FAQ, Support.

**4 cards in a 2x2 grid:**

| Card | Icon | Title | Description | Link |
|------|------|-------|-------------|------|
| 1 | Zap | Install Guide | Place the tag and see data in under 5 minutes. Step-by-step with video. | /blog/tracking |
| 2 | BarChart3 | Understanding Your Dashboard | What every metric means and what to do about it. | /blog/what-am-i-looking-at |
| 3 | Target | Run Your First Scan | Turn wallet data into X, Telegram, and Reddit targeting lists. | /blog/tutorials |
| 4 | BookOpen | Case Studies | Real campaigns: 84% lower CPA on DV360, 66% on Telegram, 3x conversions on X. | /case-studies |

**FAQ callout** below the grid:
"Have questions about data security, privacy compliance, or whether the tool works without paid ads? Check our FAQ." -- links to the FAQ section on the landing page (anchor or /pricing which has FAQ).

**Support line**: "Need help? Reach us at support@audiencescan.io or book a call."

---

### LandingPageV3 Integration

Insert both components after the Ned testimonial (line 395) and before the Final CTA (line 397):

```
... Ned testimonial ...
<HowItWorks />
<Resources />
... Final CTA ...
```

Import both at the top of LandingPageV3.tsx.

---

### Files Modified

1. **`src/components/HowItWorks.tsx`** -- Full rewrite with the 3-step flow, "What You Get" list, and benefits footer. Uses lucide-react icons (Code2, Eye, BarChart3). Styled to match V3 aesthetic.

2. **`src/components/Resources.tsx`** -- Full rewrite with 4-card grid, FAQ callout, and support line. Uses lucide-react icons (Zap, BarChart3, Target, BookOpen) and react-router-dom Links.

3. **`src/pages/LandingPageV3.tsx`** -- Import and insert both components between Ned testimonial and Final CTA sections.

