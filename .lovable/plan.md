

# Conversion & Wallet Tracking Setup UX

## Overview
When `wallet_users` or `converted_users` is `null` (meaning no data has been tracked yet), we need to surface clear setup prompts that guide users to implement tracking without being overwhelming or confusing.

## UX Approach: Progressive Disclosure with Contextual Prompts

Rather than cluttering the main dashboard, we'll use **contextual empty states** - showing setup prompts exactly where the data would appear, making it crystal clear what's missing and how to fix it.

### Design Principles
1. **Show prompts where data would be** - Users immediately understand what they're missing
2. **One action per prompt** - No confusion about what to click
3. **Copy-paste ready** - The setup code is immediately visible
4. **Dismissible once understood** - Won't nag forever

---

## Implementation: Setup Prompt Cards

### Location 1: Wallets Connected Stat Card
When `wallet_users === null`, replace the stat card value with a setup prompt:

```text
+------------------------------------------+
|  [Wallet icon]                           |
|                                          |
|  Track wallet connections                |
|  See which visitors connect wallets      |
|                                          |
|  [Set up tracking →]                     |
+------------------------------------------+
```

Clicking opens a dialog/sheet with the code snippet.

### Location 2: New "Conversions" Stat Card (4th card)
Add a 4th stat card for conversions. When `converted_users === null`:

```text
+------------------------------------------+
|  [Target icon]                           |
|                                          |
|  Track conversions                       |
|  Measure signups, purchases & more       |
|                                          |
|  [Set up tracking →]                     |
+------------------------------------------+
```

When data exists, shows: "X Conversions" with the count.

---

## Setup Dialog/Sheet Content

### Wallet Tracking Dialog
```text
┌─────────────────────────────────────────────────┐
│  Track Wallet Connections                    [X]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Call this when a user connects their wallet:   │
│                                                 │
│  ┌─────────────────────────────────────┐ [Copy] │
│  │ AudienceScan.trackWallet(           │        │
│  │   '0x1234...',  // wallet address   │        │
│  │   'connected'   // event type       │        │
│  │ );                                  │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  Other event types you can use:                 │
│  • 'staked' - User staked tokens                │
│  • 'purchased' - User made a purchase           │
│  • 'signed' - User signed a transaction         │
│                                                 │
│  ───────────────────────────────────────────    │
│                                                 │
│  Need help? support@audiencescan.io             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Conversion Events Dialog
```text
┌─────────────────────────────────────────────────┐
│  Track Conversion Events                     [X]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Call this when a conversion happens:           │
│                                                 │
│  ┌─────────────────────────────────────┐ [Copy] │
│  │ AudienceScan.trackEvent(            │        │
│  │   'Signed up',        // event name │        │
│  │   'user@email.com'    // details    │        │
│  │ );                                  │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  Example: Track a purchase                      │
│  ┌─────────────────────────────────────┐ [Copy] │
│  │ AudienceScan.trackEvent('Purchase', │        │
│  │   { amount: 99.99, currency: 'USD' }│        │
│  │ );                                  │        │
│  └─────────────────────────────────────┘        │
│                                                 │
│  ───────────────────────────────────────────    │
│                                                 │
│  Need help? support@audiencescan.io             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Visual States Summary

| Scenario | What User Sees |
|----------|----------------|
| `wallet_users === null` | Setup prompt card with "Set up tracking" button |
| `wallet_users === 0` | Normal stat card showing "0" (tracking works, just no data) |
| `wallet_users > 0` | Normal stat card showing count |
| `converted_users === null` | Setup prompt card with "Set up tracking" button |
| `converted_users === 0` | Normal stat card showing "0" |
| `converted_users > 0` | Normal stat card showing count |

The key distinction: `null` means "not configured", `0` means "configured but no events yet".

---

## Technical Details

### File Changes

| File | Change |
|------|--------|
| `src/pages/Overview.tsx` | Update stats grid to 4 cards, add conditional rendering for setup prompts, add dialog states |
| `src/components/overview/TrackingSetupDialog.tsx` | New component - reusable dialog for wallet/conversion setup with code snippets |

### New Component: TrackingSetupDialog

```tsx
interface TrackingSetupDialogProps {
  type: 'wallet' | 'conversion';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

### Updated StatCard Component

Extend to support an "empty/setup" state:

```tsx
interface StatCardProps {
  label: string;
  value: string | null;
  sublabel: string;
  icon: React.ReactNode;
  loading?: boolean;
  // New props for setup state
  showSetup?: boolean;
  setupTitle?: string;
  setupDescription?: string;
  onSetupClick?: () => void;
}
```

### Overview.tsx State Additions

```tsx
const [walletSetupOpen, setWalletSetupOpen] = useState(false);
const [conversionSetupOpen, setConversionSetupOpen] = useState(false);

// Determine if we should show setup prompts
const showWalletSetup = !loading && data?.wallet_users === null;
const showConversionSetup = !loading && data?.converted_users === null;
```

### Stats Grid Update

Change from 3 columns to 4:

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <StatCard label="Unique Visitors" ... />
  <StatCard label="Page Views" ... />
  <StatCard 
    label="Wallets Connected"
    showSetup={showWalletSetup}
    setupTitle="Track wallets"
    setupDescription="See wallet connections"
    onSetupClick={() => setWalletSetupOpen(true)}
    ...
  />
  <StatCard 
    label="Conversions"
    showSetup={showConversionSetup}
    setupTitle="Track conversions"
    setupDescription="Measure signups & more"
    onSetupClick={() => setConversionSetupOpen(true)}
    ...
  />
</div>
```

---

## Summary

This approach is clear because:
1. **No hunting** - Setup prompts appear exactly where the data would be
2. **No guessing** - One button, one action, one outcome
3. **No confusion** - `null` vs `0` distinction prevents "is it broken?" questions
4. **Copy-paste ready** - Users get working code immediately
5. **Non-intrusive** - Once tracking is set up, prompts disappear automatically

