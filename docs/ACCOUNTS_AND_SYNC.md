# HimFit: accounts, sync, and roadmap

This doc ties together **multi-tester** setups, **optional login**, and how that relates to **GitHub Pages vs Vercel**.

---

## 1. Two models (recap)

| Model | Who it's for | Accounts? | Data |
|--------|----------------|------------|------|
| **A — Device-only (default)** | Quick sharing; maximum privacy; no backend | No | `localStorage` per browser/device |
| **B — Optional Supabase** | Same person on multiple devices, or you want a **backup** and **per-user rows** to inspect | Email + password | Browser + row in `winstonfit_profiles` |

**Important:** GitHub Pages and Vercel are **hosting**. Neither replaces a **database** for real accounts. **Supabase** (or similar) provides **Auth + Postgres**; the static app calls Supabase from the browser using the **anon** key and **Row Level Security (RLS)**.

**You do not need Vercel** to use Supabase with HimFit on **GitHub Pages**.

---

## 2. Supabase setup (optional)

### 2.1 SQL — run in Supabase SQL editor

```sql
-- Profile row per auth user; stores full app state JSON
create table if not exists public.winstonfit_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.winstonfit_profiles enable row level security;

create policy "winstonfit_select_own"
  on public.winstonfit_profiles for select
  using (auth.uid() = id);

create policy "winstonfit_insert_own"
  on public.winstonfit_profiles for insert
  with check (auth.uid() = id);

create policy "winstonfit_update_own"
  on public.winstonfit_profiles for update
  using (auth.uid() = id);
```

(Or run the ready-made file: `sql/supabase_himfit_profiles.sql`)

### 2.2 Auth settings

- Enable **Email** provider with **email + password** sign-in.
- **Confirm email:** recommended on for production; can turn off for quick tester access.
- **Site URL:** your live app root, e.g. `https://winstonac.github.io/HimFit/`
- **Redirect URLs:** include the same URL (and `http://localhost:8081/` for local testing if needed).

### 2.3 Frontend config

1. Copy `winston-fit-config.example.js` → `winston-fit-config.js`.
2. Set `WINSTONFIT_SUPABASE_URL` and `WINSTONFIT_SUPABASE_ANON_KEY` from **Project Settings → API**.
3. Set `WINSTONFIT_AUTH_REDIRECT_URL` to your live app URL.
4. Deploy `winston-fit-config.js` with the site.

If keys are empty, the sign-in gate does not appear and the app runs device-only.

---

## 3. Session lifetime & "why am I logged out?"

Supabase issues a **JWT (1 hour)** + a **refresh token (~1 week)**. The JS client silently refreshes the JWT while the app is open or whenever it's reopened within the week.

| Scenario | Result |
|---|---|
| App closed < 1 hr | Session restored instantly from `localStorage` |
| App closed 1 hr – ~1 week | SDK auto-refreshes JWT on next open (silent) |
| App not opened for > ~1 week | Refresh token expires → must sign in again |
| iOS clears `localStorage` (low storage) | Must sign in again regardless of token age |

**Tip:** keep the app pinned to the Home Screen (PWA) so iOS treats it more like a native app and is less aggressive about clearing storage.

---

## 4. How sync behaves in the app

- After **sign-in**, the app **loads** `winstonfit_profiles.state` for that user (if present) and **merges** into in-memory state, then writes **`localStorage`**.
- New users (no cloud state) are immediately shown the **intake/profile form** so they can set up their plan.
- On **save** (completions, profile, etc.), the app updates **`localStorage`** and **debounces** an **upsert** to `winstonfit_profiles` (1.1 s delay).
- **Sign out** clears the Supabase session; data remains on the device until cleared.

This is **not** real-time multi-device merge conflict resolution — last write wins per session. Good enough for testers and personal backup.

---

## 5. Inspecting tester data

- **Today:** manually inspect rows in Supabase Table Editor (`winstonfit_profiles.state` contains goals, progress, intake, etc.).
- **Later:** optional `winstonfit_events` table (user_id, event, payload, created_at) with RLS for lightweight analytics.

The app **does not** send data to any external pipeline unless you add one.

---

## 6. Strava OAuth (future)

- Needs a **server** (or serverless) to hold the **client secret** and exchange codes.
- **Vercel** (or Cloudflare Workers, etc.) is a common host for one small function — not because of multi-user, but because **secrets cannot live** in public static HTML.

---

## 7. Earlier plan notes (context)

- **Per-device testers** without login: already satisfied by **`localStorage`** isolation.
- **Login + cloud row**: this doc + `winston-fit-config.js` + Settings UI.
- **Vercel + Anthropic proxy** (separate experiment): only needed if you add **AI** endpoints that must hide API keys; unrelated to "more users on static hosting."
