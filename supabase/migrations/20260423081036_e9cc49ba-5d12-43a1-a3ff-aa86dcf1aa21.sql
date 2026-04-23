create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  website_id text not null unique,
  owner_user_id uuid references auth.users(id) on delete set null,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text,
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_website_id_idx on public.subscriptions (website_id);
create index if not exists subscriptions_owner_user_id_idx on public.subscriptions (owner_user_id);
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);

alter table public.subscriptions enable row level security;

create policy "subscriptions: no direct select"
  on public.subscriptions for select
  using (false);

create policy "subscriptions: no direct insert"
  on public.subscriptions for insert
  with check (false);

create policy "subscriptions: no direct update"
  on public.subscriptions for update
  using (false);

create policy "subscriptions: no direct delete"
  on public.subscriptions for delete
  using (false);

create or replace function public.subscriptions_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.subscriptions_set_updated_at();