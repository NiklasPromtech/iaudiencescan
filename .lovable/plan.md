

## Scheduled Reports: "Keep Me in the Loop"

### Overview

Add a scheduling feature to saved queries so users can say "send me this data every Monday at 7am" and receive an email with the query results plus AI-generated insights. Includes a "Test Now" button so users can preview the email before committing.

### Architecture

```text
┌─────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Query Editor│────▶│  scheduled_reports    │     │  pg_cron (1min) │
│  Schedule UI │     │  table (Supabase)     │◀────│  ───────────────│
└─────────────┘     └──────────┬───────────┘     │  calls edge fn  │
                               │                  └─────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │  send-scheduled-     │
                    │  report edge fn      │
                    │  ─────────────────── │
                    │  1. Find due reports │
                    │  2. Execute query    │
                    │  3. AI summarize     │
                    │  4. Send via Resend  │
                    └──────────────────────┘
```

### Database: `scheduled_reports` table

Create via migration:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| query_id | uuid FK → queries.id | Which saved query to run |
| user_id | uuid FK → auth.users | Owner |
| website_id | uuid | For query execution context |
| recipients | text[] | Email addresses |
| cron_expression | text | e.g. `0 7 * * 1` (Mon 7am) |
| timezone | text | e.g. `Europe/London` |
| enabled | boolean | Pause/resume |
| ends_at | timestamptz | Optional expiry (e.g. "next 5 days") |
| last_sent_at | timestamptz | Prevents double-sends |
| created_at / updated_at | timestamptz | Standard |

RLS: users can only CRUD their own rows.

### Edge Function: `send-scheduled-report`

New function at `supabase/functions/send-scheduled-report/index.ts`:

1. **Find due reports** — query `scheduled_reports` where `enabled = true`, `ends_at` is null or in the future, and the cron expression matches the current time (with timezone offset). Compare against `last_sent_at` to avoid duplicates.
2. **Execute query** — for each due report, call the existing `/query` backend endpoint (same as `executeQuery` in `src/lib/api/queries.ts`) using the service key + user context headers.
3. **AI insights** — send the query results to Lovable AI Gateway (`google/gemini-3-flash-preview`) with a prompt like: "Summarize this analytics data in 3-4 bullet points. Highlight trends, anomalies, and actionable insights." Non-streaming call.
4. **Send email** — use Resend (already configured with `RESEND_API_KEY`) to send a branded HTML email containing the AI summary + a styled data table.
5. **Update** `last_sent_at`.

Supports a `?test=true&report_id=xxx` query param that skips the cron matching and immediately runs a specific report — this powers the "Test Now" button.

Set `verify_jwt = false` in config.toml (called by pg_cron). For test mode, validate the user's JWT from the Authorization header.

### pg_cron Setup

Run via Supabase SQL Editor (not migration — contains project-specific URL/key):

```sql
select cron.schedule(
  'send-scheduled-reports',
  '* * * * *',
  $$
  select net.http_post(
    url:='https://wksyyydmgpcaxdijalqf.supabase.co/functions/v1/send-scheduled-report',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer <anon_key>"}'::jsonb,
    body:='{"source":"cron"}'::jsonb
  ) as request_id;
  $$
);
```

### UI: Schedule Dialog in Query Editor

Add a **Clock** icon button next to the existing action buttons in `QueryEditor.tsx`. Opens a dialog with:

- **Recipients** — tag-style email input (add multiple)
- **Frequency** — radio group: Daily / Weekly / Custom
  - Daily: time picker
  - Weekly: day-of-week selector + time picker
  - Custom: cron expression input (advanced)
- **Timezone** — select from common timezones (default to browser tz)
- **Expires** — optional date picker ("run until")
- **Test Now** button — calls the edge function with `?test=true&report_id=xxx`, shows a toast "Test email sent to [recipients]"
- **Save Schedule** button — upserts to `scheduled_reports` table

If a schedule already exists for this query, the dialog loads it for editing with a **Pause** toggle and **Delete** option.

### Files to create/modify

| File | Action |
|------|--------|
| `supabase/migrations/xxx_create_scheduled_reports.sql` | Create table + RLS |
| `supabase/functions/send-scheduled-report/index.ts` | New edge function |
| `supabase/config.toml` | Add function entry |
| `src/pages/QueryEditor.tsx` | Add schedule button + dialog |
| `src/hooks/use-scheduled-reports.ts` | CRUD hook for scheduled_reports |
| `src/integrations/supabase/types.ts` | Will need regeneration after migration |

### Email Template

Branded HTML email with:
- AudienceScan header with logo
- AI-generated insight summary (3-4 bullets)
- Data table with the query results (max 50 rows, with a note if truncated)
- Footer: "This report was scheduled by [user]. Manage your schedules in AudienceScan."
- White background per email standards

