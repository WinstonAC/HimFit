# HimFit: accounts, sync, and roadmap

This doc ties together **multi-tester** setups, **optional login**, and how that relates to **GitHub Pages vs Vercel**.

---

## 1. Two models (recap)

| Model | Who it’s for | Accounts? | Data |
|--------|----------------|------------|------|
| **A — Device-only (default)** | Quick sharing; maximum privacy; no backend | No | `localStorage` per browser/device |
| **B — Optional Supabase** | Same person on multiple devices, or you want a **backup** and **per-user rows** to inspect later | Email magic link | Browser + row in `himfit_profiles` |

**Important:** GitHub Pages and Vercel are **hosting**. Neither replaces a **database** for real accounts. **Supabase** (or similar) provides **Auth + Postgres**; the static app calls Supabase from the browser using the **anon** key and **Row Level Security (RLS)**.

**You do not need Vercel** to use Supabase with HimFit on **GitHub Pages**.

---

## 2. Supabase setup (optional)

### 2.1 SQL — run in Supabase SQL editor

```sql
-- Profile row per auth user; stores full app state JSON
create table if not exists public.himfit_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.himfit_profiles enable row level security;

create policy "himfit_select_own"
  on public.himfit_profiles for select
  using (auth.uid() = id);

create policy "himfit_insert_own"
  on public.himfit_profiles for insert
  with check (auth.uid() = id);

create policy "himfit_update_own"
  on public.himfit_profiles for update
  using (auth.uid() = id);
```

### 2.2 Auth settings

- Enable **Email** provider (magic link).
- **Site URL:** your live app root, e.g. `https://winstonac.github.io/HimFit/`
- **Redirect URLs:** include the same URL (and `http://localhost:8081/` for local testing if needed).

### 2.3 Frontend config

1. Copy `himfit-config.example.js` → `himfit-config.js`.
2. Set `HIMFIT_SUPABASE_URL` and `HIMFIT_SUPABASE_ANON_KEY` from **Project Settings → API**.
3. Deploy `himfit-config.js` with the site.

If keys are empty, **Settings → Sign in** still appears with copy explaining that Supabase is not configured yet; the app remains device-only until you add keys.

---

## 3. How sync behaves in the app

- After **sign-in**, the app **loads** `himfit_profiles.state` for that user (if present) and **merges** into in-memory state, then writes **`localStorage`**.
- On **save** (completions, profile, etc.), the app still updates **`localStorage`** and **debounces** an **upsert** to `himfit_profiles` when signed in.
- **Sign out** clears the Supabase session; data remains on the device until cleared.

This is **not** real-time multi-device merge conflict resolution—last write wins per session. Good enough for testers and personal backup.

---

## 4. “How people use it” (learning without training a model)

- **Today:** you can **manually** inspect rows in Supabase Table Editor (goals, progress, etc. inside `state`).
- **Later:** optional **anonymous** event table (e.g. `himfit_events` with `user_id`, `event`, `payload`, `created_at`) and RLS so users only insert their own rows—or use **Supabase Logs / Edge Functions** if you outgrow SQL queries.

The app **does not** send data to a custom “model training” pipeline unless you add one.

---

## 5. Strava OAuth (future)

- Needs a **server** (or serverless) to hold the **client secret** and exchange codes.
- **Vercel** (or Cloudflare Workers, etc.) is a common host for **one** small function—not because of multi-user, but because **secrets cannot live** in public static HTML.

Callback / redirect domains must match where that OAuth **redirect** URL is hosted (see Strava app settings).

---

## 6. Earlier plan notes (context)

- **Per-device testers** without login: already satisfied by **`localStorage`** isolation.
- **Login + cloud row**: this doc + `himfit-config.js` + Settings UI.
- **Vercel + Anthropic proxy** (separate experiment): only needed if you add **AI** endpoints that must hide API keys; unrelated to “more users on static hosting.”
