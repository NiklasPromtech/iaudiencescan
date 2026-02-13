

## Migrate /change to Report V2 API

This is a significant update to the Measure Change page. The new v2 API has a simpler request (just dates + baseline strategy) but a richer response with new sections like guardrails, wallet distribution, behavior changes, and anomaly detection.

### What Changes

**Both Basic and Advanced modes** will call the new API at `https://api.audiencescan.xyz/analytics/report/v2` instead of the old incrementality endpoint.

**The configuration UI simplifies** because the v2 API no longer accepts breakdowns, look_window, include/exclude filters, or UTM-free toggles. It only needs:
- `website_id` (from selectedWebsite.id)
- `event_start` / `event_end` (YYYY-MM-DD)
- `baseline_strategy` (rolling_14_day or same-length)
- `exclude_bots` (boolean)

**A new results view** replaces the old `IncrementalityResultsView` with sections for:
- Guardrails banner (data quality checks)
- KPI Overview cards (sessions, visitors, bounce rate, wallet rates, conversion rate, session duration)
- Wallet Distribution Shift (percentile shifts + bucket chart)
- Behavior Changes table
- Dimension Performance tables (utm_campaign, utm_source, country, referrer_domain, page_path)
- Contribution to Change (which dimensions drove the most change)
- Anomaly Candidates (outlier detection)

---

### Technical Plan

#### 1. New TypeScript types (`src/types/report-v2.ts`)

Define interfaces matching the v2 response:
- `ReportV2Response` - top-level with `success`, `website_id`, `windows`, `guardrails`, `kpi_overview`, `wallet_distribution_shift`, `behavior_changes`, `dimension_performance`, `contribution_to_change`, `anomaly_candidates`, `errors`
- Sub-interfaces for each section: `GuardrailCheck`, `KpiMetric`, `WalletBucket`, `BehaviorItem`, `DimensionRow`, `ContributionItem`, `AnomalyCandidate`

#### 2. New results component (`src/components/change/ReportV2ResultsView.tsx`)

A clean dashboard-style results view with these sections:

- **Guardrails Alert**: If any guardrail is not met, show a warning banner listing which thresholds failed
- **Windows Info**: Compact display of baseline vs event period dates
- **KPI Overview**: 7 metric cards in a responsive grid showing baseline, event value, delta, and delta_percent with color-coded arrows. Low-confidence items get a subtle warning indicator
- **Wallet Distribution Shift**: Percentile stats (median, p75, p90, max, whale count) plus a horizontal bar chart comparing baseline vs event bucket percentages
- **Behavior Changes**: Sorted table of behaviors with baseline_rate, event_rate, delta, delta_percent
- **Dimension Performance**: Collapsible sections per dimension (utm_campaign, utm_source, country, etc.) with sub-metrics
- **Contribution to Change**: Table showing which dimension values contributed most to metric changes
- **Anomaly Candidates**: Highlighted cards for statistical outliers

Includes copy-to-clipboard and print-to-PDF (using the existing `window.print()` approach).

#### 3. Update `src/pages/Change.tsx`

**Basic mode changes:**
- The timeline slider still selects `event_start` and `event_end` from `daily_breakdown`
- The baseline is now auto-calculated by the API (default `rolling_14_day_preceding`), so remove `baseline_days` slider
- Keep exclude-bots checkbox
- Call `POST https://api.audiencescan.xyz/analytics/report/v2` with `{ website_id: selectedWebsite.id, event_start, event_end, exclude_bots }`

**Advanced mode simplification:**
- Remove: breakdowns card, include/exclude filter chips, UTM-free checkbox, look window selector, baseline days slider
- Keep: event start date picker, end date picker, analysis name (for display only)
- Add: baseline strategy dropdown (`rolling_14_day_preceding` or `immediate_previous_same_length`)
- Add: exclude bots checkbox
- Call same v2 endpoint

**Results rendering:**
- Replace `IncrementalityResultsView` usage with the new `ReportV2ResultsView`
- Remove the old `IncrementalityResult` type import and all related state
- Keep the toolbar (Copy Text, Export PDF, New Analysis) wired to the new component's imperative handle

**Remove unused code:**
- `MultiSelectFilter` component (no longer needed in Change.tsx)
- All filter-related state (`includeFilters`, `excludeFilters`, `utmFree`, `filterOptions`, etc.)
- `BREAKDOWN_OPTIONS`, `LOOK_WINDOW_OPTIONS`, `INCLUDE_FILTER_SECTIONS`, `EXCLUDE_FILTER_SECTIONS` constants
- `fetchFilterOptions` import (if no longer used elsewhere)

#### 4. Files affected

| File | Action |
|------|--------|
| `src/types/report-v2.ts` | Create - v2 response types |
| `src/components/change/ReportV2ResultsView.tsx` | Create - new results dashboard |
| `src/pages/Change.tsx` | Rewrite - simplified config UI + v2 API call + new results view |

The old `IncrementalityResultsView` is NOT deleted since it's still used by the Touchpoints incrementality dialog.

