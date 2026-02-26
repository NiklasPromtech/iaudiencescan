

## Update the Footer

The footer has several dead links from the purge (DM Assistant, Strategy Playbook) and placeholder `#` links. Here's the updated content:

### Updated Sections

**Product**
- Get Started → `/auth`
- Blog → `/blog`
- Book a Demo → `https://calendly.com/niklas-audiencescan/audiencescan-demo` (matches header's demo link)

**Resources**
- How It Works → `/how-it-works`
- FAQ → `/faq`
- Case Studies → `/case-studies`

**Company**
- Privacy → `#` (kept as placeholder for now)
- Terms → `#` (kept as placeholder for now)
- Support → `mailto:hello@audiencescan.io`

Also update the tagline to reflect the analytics-first positioning:
> "Web3 analytics that connects website visitors to wallet intelligence. Built by marketers who've scaled crypto projects."

### Technical Details

**Modified: `src/components/Footer.tsx`**
- Update the `sections` array (lines 5-29) with the new links above
- Update the brand description (lines 47-50) to the new tagline
- Update copyright year to 2025-2026 or just 2026

