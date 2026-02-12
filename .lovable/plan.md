

## Remove "Trusted By" from Sidebar + Replace Client Logos

### 1. Remove "Trusted By" from the platform sidebar

**File: `src/components/dashboard/DashboardSidebar.tsx`**

Delete the entire "Trusted By" section in the `SidebarFooter` (the `div` with `mt-4 pt-4 border-t`, the "Trusted by" paragraph, and the logo grid). Also remove the 10 client-logo imports at the top of the file and the `clientLogos` array, since they'll no longer be needed here.

### 2. Replace client logo files

Replace the current logo image files in `src/assets/client-logos/` with the new uploaded versions. The new set of 10 logos:

| Old file | New file (from upload) |
|----------|----------------------|
| `bitmex.png` | `fix_BitMEX.png` |
| `flare.png` | `fix_flare.png` |
| `luxy.png` | `fix_Luxy.png` |
| `mintlayer.png` | `fix_MintLayer.png` |
| `okx.png` | `fix_okx.png` |
| `soma.png` | `fix_Soma.png` |
| `synesis.png` | `fix_Synesis_One.png` |
| `syscoin.png` | `fix_sys.png` |
| `mantra.png` | **remove** (replaced by `fix_Axion.png` as `axion.png`) |
| `vent.png` | **remove** (replaced by `fix_NFTrade.png` as `nftrade.png`) |

This means two new logo files are added (`axion.png`, `nftrade.png`) and two old ones are removed (`mantra.png`, `vent.png`).

### 3. Update landing page logo references

The following files import from `src/assets/client-logos/` and reference `mantra` and `vent`:

- **`src/pages/LandingPageV2.tsx`** -- replace mantra/vent imports with axion/nftrade, update the `clientLogos` array entries and alt text
- **`src/pages/LandingPageV3.tsx`** -- same treatment
- **`src/pages/WizardV2.tsx`** -- same treatment (imports mantra/vent logos)

### Summary

- Sidebar loses the "Trusted By" section entirely (landing page only)
- All 10 client logos are refreshed with the new uploaded versions
- Two logos swapped: Mantra -> Axion, Vent -> NFTrade
- Landing pages updated to reference the new files and alt text

