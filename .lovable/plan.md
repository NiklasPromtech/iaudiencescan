

# Comparison Mode for Dimension Table + Filter Reset

## What this does
Two changes:
1. When comparison mode is active and the user changes the "Breakdown by" dropdown, we fire **two** `fetchTableData` calls (current + previous period) so the delta column stays populated.
2. When a filter is applied at the top, the dimension table resets back to `referrer_domain` (the default).

## Technical details

### `src/pages/Overview.tsx`

**1. Reset dimension on filter change**
In `handleFiltersChange`, also reset `tableDimension` to `"referrer_domain"`:
```typescript
const handleFiltersChange = (newFilters: ActiveFilters) => {
  setActiveFilters(newFilters);
  setTableDimension("referrer_domain"); // reset to default
  handleExitComparison();
  loadAllData(newFilters, "referrer_domain", getRangeConfig());
};
```

**2. Comparison-aware dimension change**
Update `handleDimensionChange` to also fetch comparison table data when in comparison mode:
```typescript
const handleDimensionChange = (newDimension: TableDimension) => {
  setTableDimension(newDimension);
  setSelectedCostSourceId(null);
  loadTableData(newDimension, activeFilters, getRangeConfig(), null);

  // If comparison is active, also fetch the previous period for this dimension
  if (comparisonMode === "active" && comparisonData) {
    const { range: prevRange } = getPreviousRangeConfig();
    fetchComparisonTableData(newDimension, prevRange);
  }
};
```

**3. New helper: `fetchComparisonTableData`**
A small function that calls `fetchTableData` with the previous range and updates just the comparison table rows inside `comparisonData`:
```typescript
const fetchComparisonTableData = async (
  dimension: TableDimension, 
  prevRange: RangeConfig
) => {
  if (!selectedWebsite) return;
  const { conversion_events: convEvents, ...restFilters } = activeFilters;
  try {
    const data = await fetchTableData({
      tag_id: selectedWebsite.id,
      dimension,
      range: prevRange,
      filters: getFiltersParam(restFilters),
      conversion_events: convEvents?.length ? convEvents : undefined,
      cost: { mode: "none" },
      pagination: { limit: 50 },
    });
    // Update the comparison data's table rows
    setComparisonData(prev => prev ? {
      ...prev,
      table_referrer_domain: { success: true, data: data }
    } : null);
  } catch (err) {
    console.error("Comparison table fetch failed:", err);
  }
};
```

**4. Pass comparison rows correctly**
The `comparisonRows` prop passed to `DimensionTable` currently reads from `comparisonData?.table_referrer_domain` -- this will naturally update when `setComparisonData` is called with the new dimension's data, so no change needed there.

### No changes to `DimensionTable.tsx`
The component already accepts and renders `comparisonRows` -- it just needs the parent to supply updated data when the dimension changes, which is handled above.

