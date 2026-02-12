

## Update Sidebar Menu Fonts to Match Dashboard Typography

### Problem
The sidebar navigation text (menu items like "Overview", "Wallet Data", group labels like "INSIGHTS", "ENRICHMENT") still uses the default Bai Jamjuree font. Every other data-oriented element in the dashboard now uses Space Mono, creating an inconsistency.

### Changes

**File: `src/components/dashboard/DashboardSidebar.tsx`**

1. **Nav item labels** (line 136: `<span>{item.title}</span>`): Add `font-mono text-xs uppercase tracking-wider` to match the landing page nav style.

2. **Group labels** (the `SidebarGroupLabel` in `NavGroup`, ~line 165): Already has `text-xs uppercase tracking-wider` but needs `font-mono` added.

3. **"Trusted by" label** (~line 237): Already has `text-[10px] uppercase tracking-wider` but needs `font-mono` added.

These are small className additions -- no layout or logic changes.
