-- HimFit: run this entire file in Supabase → SQL Editor → New query → Run
-- (Copy only the SQL below; do not include markdown backticks.)

create table if not exists public.himfit_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.himfit_profiles enable row level security;

drop policy if exists "himfit_select_own" on public.himfit_profiles;
drop policy if exists "himfit_insert_own" on public.himfit_profiles;
drop policy if exists "himfit_update_own" on public.himfit_profiles;

create policy "himfit_select_own"
  on public.himfit_profiles for select
  using (auth.uid() = id);

create policy "himfit_insert_own"
  on public.himfit_profiles for insert
  with check (auth.uid() = id);

create policy "himfit_update_own"
  on public.himfit_profiles for update
  using (auth.uid() = id);
