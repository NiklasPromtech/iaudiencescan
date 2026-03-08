

## Scheduled Reports: "Keep Me in the Loop" — IMPLEMENTED

### What was built

1. **Edge Function** (`supabase/functions/send-scheduled-report/index.ts`) — Finds due reports via cron matching, executes queries, generates AI insights via Lovable AI Gateway, and sends branded HTML emails via Resend. Supports `?test=true&report_id=xxx` for test mode with JWT validation.

2. **CRUD Hook** (`src/hooks/use-scheduled-reports.ts`) — Supabase CRUD for `scheduled_reports` table with `fetchForQuery`, `createReport`, `updateReport`, `deleteReport`, and `testReport`.

3. **Schedule Dialog** (`src/components/schedule/ScheduleDialog.tsx`) — Full UI with recipients (tag-style), frequency (Daily/Weekly/Custom), day-of-week picker, time picker, timezone select, expiry date, enabled toggle, Test Now button, and delete confirmation.

4. **QueryEditor integration** — Clock icon button in the top bar opens the ScheduleDialog.

5. **Config** (`supabase/config.toml`) — Added `send-scheduled-report` with `verify_jwt = false`.

### Still needed (manual steps)

**Run this SQL in the Supabase SQL Editor to create the table:**

```sql
create table public.scheduled_reports (
  id uuid primary key default gen_random_uuid(),
  query_id uuid not null references public.queries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  website_id uuid not null,
  recipients text[] not null default '{}',
  cron_expression text not null default '0 7 * * 1',
  timezone text not null default 'Europe/London',
  enabled boolean not null default true,
  ends_at timestamptz,
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.scheduled_reports enable row level security;

create policy "Users can view own scheduled reports"
  on public.scheduled_reports for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own scheduled reports"
  on public.scheduled_reports for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own scheduled reports"
  on public.scheduled_reports for update to authenticated
  using (user_id = auth.uid());

create policy "Users can delete own scheduled reports"
  on public.scheduled_reports for delete to authenticated
  using (user_id = auth.uid());

create policy "Service role full access"
  on public.scheduled_reports for all to service_role
  using (true) with check (true);
```

**Then set up pg_cron:**

```sql
select cron.schedule(
  'send-scheduled-reports',
  '* * * * *',
  $$
  select net.http_post(
    url:='https://wksyyydmgpcaxdijalqf.supabase.co/functions/v1/send-scheduled-report',
    headers:='{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrc3l5eWRtZ3BjYXhkaWphbHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzcwMzAsImV4cCI6MjA2OTAxMzAzMH0.Rh37M5IDPo8uGBucIwWdZk79o8rpxhs8SQ9ACohDUQ8"}'::jsonb,
    body:='{"source":"cron"}'::jsonb
  ) as request_id;
  $$
);
```
