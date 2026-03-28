-- Winston Fit — Push Subscriptions Table
-- Run this in the Supabase SQL editor before deploying notifications

create table if not exists public.winstonfit_push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  endpoint    text not null,
  p256dh      text not null,
  auth        text not null,
  notif_time  text not null default '07:00',   -- HH:MM in user's local time
  user_tz     text not null default 'UTC',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  -- One subscription per endpoint per user (handles multiple devices)
  unique (user_id, endpoint)
);

alter table public.winstonfit_push_subscriptions enable row level security;

create policy "push_select_own"
  on public.winstonfit_push_subscriptions for select
  using (auth.uid() = user_id);

create policy "push_insert_own"
  on public.winstonfit_push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "push_update_own"
  on public.winstonfit_push_subscriptions for update
  using (auth.uid() = user_id);

create policy "push_delete_own"
  on public.winstonfit_push_subscriptions for delete
  using (auth.uid() = user_id);

-- Edge function needs service-role to read all subscriptions for sending
-- (RLS bypassed when using service_role key in Edge Function)
