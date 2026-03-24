# AudienceScan Design System

## Aesthetic Direction

**Dune-inspired, aggressively flat, shadow-free.** The platform has a warm, desert-toned palette with sharp geometric precision. No rounded corners, no drop shadows, no soft gradients on UI chrome.

---

## Colors

All colors are defined as HSL CSS variables in `src/index.css` and mapped in `tailwind.config.ts`. **Never use raw color values in components** — always reference semantic tokens.

| Token | HSL | Usage |
|---|---|---|
| `--primary` | `28 100% 54%` | Orange — primary actions, human-related data |
| `--primary-glow` | `36 100% 62%` | Warm gold — gradients, hover states |
| `--secondary` | `36 100% 50%` | Secondary actions |
| `--background` | `0 0% 100%` | Page background |
| `--foreground` | `222.2 84% 4.9%` | Body text |
| `--muted` | `40 20% 96%` | Subtle backgrounds, table headers |
| `--muted-foreground` | `220 8.9% 46.1%` | Secondary text, labels |
| `--accent` | `40 60% 97%` | Hover/active backgrounds |
| `--border` | `40 10% 90%` | All borders |
| `--destructive` | `0 84.2% 60.2%` | Errors, bot-related data (Red) |

### Data Palette

| Role | Color | Token |
|---|---|---|
| Humans | Orange `#f97316` | `--primary` |
| Bots | Red | `--destructive` |
| Unknown / Secondary | Teal `#2db19b` | `--chart-2` |

### Chart Colors

`--chart-1` through `--chart-6` provide a vibrant multi-color palette for visualizations.

---

## Typography

Two fonts only. **No serif fonts anywhere.**

| Font | Usage | Tailwind Class |
|---|---|---|
| **Bai Jamjuree** | All headings, body text, UI labels, buttons | `font-bai` (default) |
| **Space Mono** | Data: table headers, numbers, stats, axis labels, tooltips, nav items | `font-mono` |

### Type Scale (defined in `tailwind.config.ts`)

| Name | Size | Weight | Usage |
|---|---|---|---|
| `text-h1` | 50px / 1.2 | 700 | Page heroes |
| `text-h2` | 35px / 1.3 | 600 | Section headings |
| `text-h3` | 22px / 1.4 | 600 | Card titles |
| `text-tag` | 16px / 1.5 | 500 | Tags, labels |
| `text-p1` | 18px / 1.6 | 400 | Lead paragraphs |
| `text-p2` | 16px / 1.6 | 400 | Body text |
| `text-p3` | 14px / 1.6 | 400 | Small body |
| `text-p4` | 12px / 1.6 | 400 | Captions |

### Data Typography Pattern

Table headers: `font-mono text-[10px] uppercase tracking-widest`
Numbers: `font-mono tabular-nums`
Stat labels: `font-mono text-xs uppercase tracking-wider`
Nav items: `font-mono text-xs uppercase tracking-wider`

---

## Shape & Elevation

- **All UI elements**: `rounded-none` — Cards, Buttons, Inputs, Dialogs, Tables, Badges
- **Only exception**: `rounded-full` for avatars and status indicator dots
- **No box shadows** on UI chrome (cards, dialogs, inputs)
- **No border-radius** on any interactive element

---

## Components (shadcn/ui)

Built on shadcn/ui with heavy customization:

- All components stripped of default border-radius
- Buttons: flat, no shadow, `rounded-none`
- Cards: `border border-border`, no shadow, no radius
- Inputs: flat border, no radius
- Dialogs: sharp corners, flat overlay
- Tables: `bg-muted` header rows, mono-spaced headers

---

## Charts & Visualizations

All charts use `recharts` with `ChartContainer` and `ChartTooltip` wrappers.

- **Bar charts**: `radius={[3, 3, 0, 0]}` (slight top rounding only)
- **Area charts**: Monotone curves, gradient fills (30% → 0% opacity), `strokeWidth={2}`, no dots
- **Donut charts**: SVG-based, single horizontal layout
- **Axes & tooltips**: Space Mono font
- **Watermark**: "AudienceScan" branding on chart tiles
- **Tile height**: Scales dynamically based on row span

### Color Assignment

- Primary metric → Orange (`--primary`)
- Secondary metric → Teal (`--chart-2`)
- Negative/bot data → Red (`--destructive`)

---

## Layout Patterns

### Dashboard

- Sidebar: collapsible icon rail, `font-mono` nav labels
- Sticky header: `z-20`, backdrop blur
- Content area: `min-w-0 overflow-hidden` to prevent stretching

### Data Tables

- Sticky header columns: opaque `bg-muted` background (prevents text bleed)
- Wide result containers: `min-w-0 overflow-hidden`
- Action buttons anchored, never pushed off-screen

### Landing Page

- Bento-grid layout with alternating sell/proof rhythm
- Data sections: top 3 items per card maximum
- "Trusted by" marquee: tripled content, `translateX(-33.333%)`, dark silhouette logos
- Testimonials include subtle "Book a Demo" text links

---

## Gradients (sparingly used)

| Token | Value | Usage |
|---|---|---|
| `--gradient-primary` | `135deg, primary → primary-glow` | CTA buttons, hero accents |
| `--gradient-hero` | `135deg, warm tones` | Landing hero background |
| `--gradient-subtle` | `180deg, background → accent` | Section transitions |

---

## Motion

- Minimal, purposeful animations via `framer-motion`
- `float`: gentle 3s vertical bob for decorative elements
- `pulse-glow`: 2s box-shadow pulse on primary elements
- `marquee`: 30s linear infinite scroll for logo strips
- Transitions: `cubic-bezier(0.4, 0, 0.2, 1)` easing

---

## Anti-Patterns (DO NOT)

- ❌ Use `rounded-lg`, `rounded-md`, `rounded-sm` on any component
- ❌ Use `shadow-sm`, `shadow-md`, `shadow-lg` on UI chrome
- ❌ Use serif fonts (DM Serif Display or any other)
- ❌ Use Inter, Poppins, or generic AI-aesthetic fonts
- ❌ Use purple gradients
- ❌ Use raw hex/rgb colors in components — always use CSS variable tokens
- ❌ Use `text-white`, `bg-black` directly — use `text-primary-foreground`, `bg-foreground`
- ❌ Add border-radius to buttons, cards, inputs, or dialogs
