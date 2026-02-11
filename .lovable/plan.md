

## Dune-Style Rounding & Flatness Purge -- Phase 2

### Problem

The Overview page and other platform pages still feel "rounded" and "card-heavy" compared to the Dune reference. Specifically:

1. **ScorecardChips** (Overview): Every metric is wrapped in a `rounded-lg` bordered pill with a `rounded-full` icon circle inside. That is 6-20 rounded rectangles each containing a rounded circle -- visually noisy.
2. **Cohort suggestion cards** (Overview): Each has `rounded-lg border` wrapper.
3. **"More" toggle button**: `rounded-lg border border-dashed` -- another rounded element.
4. **Small metric pills** (expanded section): `rounded-lg border` on every small metric.
5. **Star buttons**: `rounded-full shadow-sm` floating badges.
6. **22 page files** still have 618 instances of `rounded-xl`, `rounded-2xl`, or `rounded-3xl`.
7. **Landing components** (Features, Resources, Partnerships, MoneyBackGuarantee, etc.) still use `rounded-xl` on icon containers.

### Solution

**A. Flatten ScorecardChips (highest visual impact on /overview)**

Replace the grid of bordered pill cards with a Dune-style flat stat row:
- Remove `rounded-lg border` wrappers from each metric
- Remove `rounded-full` icon circles
- Display metrics as simple inline text: label above, value below
- Separate metrics with thin vertical dividers (`border-r border-border`) instead of card borders
- Keep the star toggle but remove `shadow-sm` and `rounded-full`, use a subtle inline icon instead
- Realtime indicator becomes a simple inline stat with a pulsing dot, no card wrapper

**B. Flatten Cohort Suggestions (Overview)**

- Remove `rounded-lg border` card wrappers
- Use `border-b border-border` rows instead
- Remove icon background circles

**C. Global rounded-xl/2xl/3xl purge across all 22 page files**

Replace every `rounded-xl` with `rounded-lg`, every `rounded-2xl` with `rounded-lg`, every `rounded-3xl` with `rounded-lg` across:
- LandingPageV2.tsx, LandingPageV3.tsx, XAdsAgency.tsx, XData.tsx
- Video1.tsx, ManagedService.tsx, CaseStudies.tsx
- SalesPitch.tsx, StrategyPlaybook.tsx, Pricing.tsx
- DMAssistant.tsx, Creation.tsx, NoNiche.tsx, NoNicheV2.tsx, NoNicheV3.tsx
- NetworkAgency.tsx, Merge.tsx, Blog.tsx
- Install.tsx, Artifact.tsx, ScanDetail.tsx, WizardV2.tsx

**D. Landing components rounded-xl purge**

Replace `rounded-xl` with `rounded-lg` in:
- Features.tsx, Resources.tsx, Partnerships.tsx, MoneyBackGuarantee.tsx
- ConfidenceAnimation.tsx, AgencyHowPanel.tsx, PlaybookFloatingCTA.tsx
- MockPlatformCards.tsx, MockNewsFeed.tsx

**E. Remove remaining shadows from overview**

- Remove `shadow-sm` from star toggle buttons in ScorecardChips
- Keep `shadow-xl` on chart tooltips (those are functional)

### Technical Details -- Files Modified

| File | Change |
|------|--------|
| `src/components/overview/ScorecardChips.tsx` | Full rewrite of MetricPill and MetricPillSmall to flat inline stats with vertical dividers, remove icon circles and card borders |
| `src/pages/Overview.tsx` | Flatten cohort suggestion cards to border-b rows |
| `src/components/touchpoints/IncrementalityResultsView.tsx` | rounded-xl to rounded-lg |
| `src/components/Features.tsx` | rounded-xl to rounded-lg |
| `src/components/Resources.tsx` | rounded-xl to rounded-lg |
| `src/components/Partnerships.tsx` | rounded-xl to rounded-lg |
| `src/components/MoneyBackGuarantee.tsx` | rounded-xl to rounded-lg |
| `src/components/ConfidenceAnimation.tsx` | rounded-xl to rounded-lg |
| `src/components/AgencyHowPanel.tsx` | rounded-xl to rounded-lg |
| `src/components/PlaybookFloatingCTA.tsx` | md:rounded-xl to rounded-lg |
| `src/components/landing/MockPlatformCards.tsx` | rounded-xl to rounded-lg |
| `src/components/landing/MockNewsFeed.tsx` | rounded-xl to rounded-lg |
| 22 page files listed above | Replace all rounded-xl/2xl/3xl with rounded-lg |

### Execution Order

1. ScorecardChips flat rewrite (biggest visual impact)
2. Overview cohort cards flattened
3. All component rounded-xl fixes (parallel)
4. All page file rounded-xl/2xl/3xl fixes (parallel batches)

