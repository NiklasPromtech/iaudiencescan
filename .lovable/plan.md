

## Send Invite Email on Website Share

### What we're building

When you share a website with someone who doesn't have an account yet (`has_account: false`), we'll automatically send them a branded invite email via a new Supabase edge function using Resend.

---

### Secret: RESEND_API_KEY

The `RESEND_API_KEY` is not currently in the project's secrets. We'll need to add it so the edge function can use it. You'll be prompted to provide it.

---

### Changes

**New file: `supabase/functions/send-invite-email/index.ts`**
- Accepts `{ email, websiteName, inviterName }` via POST
- Uses Resend API to send a branded HTML email
- Email design: orange/white card layout matching the confirmation email template
  - Badge: "AudienceScan"
  - Headline: "You've been invited"
  - Body: "{inviterName} has shared analytics access for {websiteName} with you"
  - CTA: "Create your account" linking to the published site's `/auth` page
- Input validation with Zod
- CORS headers included
- Rate limiting (same pattern as existing `send-notification-email`)

**File: `supabase/config.toml`**
- Add `[functions.send-invite-email]` with `verify_jwt = false`

**File: `src/lib/api.ts`**
- Add `sendInviteEmail(email, websiteName, inviterName)` function that calls the edge function via `supabase.functions.invoke("send-invite-email", ...)`

**File: `src/components/websites/WebsiteShareDialog.tsx`**
- After a successful share where `response.has_account === false`, call `sendInviteEmail()` in the background
- Get the current user's email/name via `supabase.auth.getUser()` to pass as `inviterName`
- No UX changes needed -- the existing toast "Invite sent to..." already communicates this

