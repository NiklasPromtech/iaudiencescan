

## Redesign Auth Page: Dune-Inspired Split Layout with Inspirational Panel

### Design

Transform the current single-column auth page into a **split-panel layout** inspired by Dune's sign-up page:

- **Left panel**: The existing login/signup form with AudienceScan logo
- **Right panel**: A visually striking inspirational section with a minimalist geometric animation and a compelling tagline

The right panel will feature:
1. A **minimalist network/constellation animation** -- dots connected by lines radiating outward, matching AudienceScan's on-chain data theme (nodes = wallets, lines = transactions). Built with pure CSS animations, no libraries needed.
2. A **bold tagline** that rotates between sign-in and sign-up contexts:
   - Sign up: *"Your on-chain audience, decoded."* with sub-text *"From raw wallets to real communities -- in minutes, not months."*
   - Sign in: *"Your data is waiting."* with sub-text *"Actionable insights from every wallet, every transaction, every community."*

### Layout

```text
+------------------------------+------------------------------+
|                              |                              |
|  [Logo]                      |        [Network Visual]      |
|                              |         o---o                |
|  Sign In / Sign Up           |        /     \               |
|                              |   o---o       o---o          |
|  [Form fields]               |        \     /               |
|                              |         o---o                |
|  [Submit button]             |                              |
|                              |  "Your on-chain audience,    |
|  [Toggle link]               |         decoded."            |
|                              |                              |
+------------------------------+------------------------------+
```

On mobile (below `lg` breakpoint), the right panel hides completely -- form only.

### Technical Changes

**1 file modified: `src/pages/Auth.tsx`**

- Wrap the page in a two-column `flex` layout (`lg:grid lg:grid-cols-2`)
- Left side: existing form, largely unchanged, with logo added at top
- Right side: new inspirational panel component (inline, no separate file needed)
  - CSS-only constellation/network animation using `absolute`-positioned dots with connecting lines via pseudo-elements and `@keyframes` for gentle pulsing/floating
  - Bold headline in Space Mono (data font per style guide), large body text in Bai Jamjuree
  - Background: subtle `bg-muted` to contrast with the white form side
- All styling follows the Dune aesthetic: `rounded-none`, flat, shadow-free
- The animation uses small dots (`w-2 h-2 rounded-full bg-primary`) connected by thin lines (`border-primary/30`), gently pulsing with CSS `animate-pulse` and custom float keyframes

### Copy

**Sign Up state:**
- Headline: "Your on-chain audience, decoded."
- Sub: "From raw wallets to real communities -- in minutes, not months."

**Sign In state:**
- Headline: "Your data is waiting."  
- Sub: "Actionable insights from every wallet, every transaction, every community."

