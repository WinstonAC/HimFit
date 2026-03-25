-- Winston Fit: run this entire file in Supabase → SQL Editor → New query → Run
-- (Copy only the SQL below; do not include markdown backticks.)

create table if not exists public.winstonfit_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.winstonfit_profiles enable row level security;

drop policy if exists "winstonfit_select_own" on public.winstonfit_profiles;
drop policy if exists "winstonfit_insert_own" on public.winstonfit_profiles;
drop policy if exists "winstonfit_update_own" on public.winstonfit_profiles;

create policy "winstonfit_select_own"
  on public.winstonfit_profiles for select
  using (auth.uid() = id);

create policy "winstonfit_insert_own"
  on public.winstonfit_profiles for insert
  with check (auth.uid() = id);

create policy "winstonfit_update_own"
  on public.winstonfit_profiles for update
  using (auth.uid() = id);
