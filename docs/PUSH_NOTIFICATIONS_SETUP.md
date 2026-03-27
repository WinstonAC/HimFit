# Push Notifications Setup

## Overview
Winston Fit uses the Web Push API (no APNs/FCM needed). The flow is:
1. User enables reminders → browser asks permission → subscription saved to Supabase
2. Supabase Edge Function runs hourly → checks who should be notified → sends push

---

## Step 1 — Run the SQL migration

In your Supabase dashboard → SQL Editor, run:

```
sql/push_subscriptions.sql
```

---

## Step 2 — Deploy the Edge Function

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Link to your project
supabase login
supabase link --project-ref jqomeiarmdrraausoecd

# Set secrets (VAPID keys are already generated in the codebase)
supabase secrets set \
  VAPID_PUBLIC=BGUku2wLqQyIenhuCodt4vP7GfWj30MsBqnLB1bNjTA087X65pR5Wm0F-21uj6xL7HzI9v3IG4RwGAPGjk4T97c \
  VAPID_PRIVATE=L6QlLugBVo_r3kzCBysec5vywox-8MLf0fO5kBPLAm8 \
  VAPID_SUBJECT=mailto:admin@winstonfit.com

# Deploy
supabase functions deploy send-daily-push
```

---

## Step 3 — Set up hourly cron trigger

In Supabase dashboard → Edge Functions → send-daily-push → Schedule:

```
0 * * * *
```
(runs every hour on the hour)

Or via pg_cron if you prefer SQL:
```sql
select cron.schedule(
  'send-daily-push',
  '0 * * * *',
  $$select net.http_post(
    url := 'https://jqomeiarmdrraausoecd.supabase.co/functions/v1/send-daily-push',
    headers := '{"Authorization":"Bearer <SERVICE_ROLE_KEY>"}'
  )$$
);
```

---

## Step 4 — Ensure sw.js is served from root

`sw.js` must be served from `https://winstonac.github.io/HimFit/sw.js` (same origin as the app).

GitHub Pages will serve it automatically since it's in the repo root. ✓

---

## iPhone notes

- iOS 16.4+ supports web push **only** when the app is added to Home Screen
- The app shows a hint to users on iOS automatically
- Safari on iOS 16.3 and earlier does not support web push at all

---

## VAPID keys (already embedded in code)

```
PUBLIC:  BGUku2wLqQyIenhuCodt4vP7GfWj30MsBqnLB1bNjTA087X65pR5Wm0F-21uj6xL7HzI9v3IG4RwGAPGjk4T97c
PRIVATE: L6QlLugBVo_r3kzCBysec5vywox-8MLf0fO5kBPLAm8   ← keep this secret, only in Supabase secrets
```

> **Important:** The private key is NOT in index.html — only the public key is. The private key is only
> used server-side in the Edge Function via `supabase secrets`.
