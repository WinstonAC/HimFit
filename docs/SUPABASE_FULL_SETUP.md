# HimFit × Supabase — complete setup (order of operations)

Do these **in order**. Your live app URL in examples: `https://winstonac.github.io/HimFit/` (change if yours differs).

---

## Part A — Supabase project & database

### Step 1 — Create project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Choose region, set a database password (save it somewhere safe).
3. Wait until the project is **healthy / ready**.

### Step 2 — Create `himfit_profiles` + RLS

1. Supabase → **SQL Editor** → **New query**.
2. Open the repo file **`sql/supabase_himfit_profiles.sql`**, copy **all** of it (SQL only — no backticks), paste into the editor, **Run**.

   That file is plain text so nothing from Markdown breaks the query.

3. **Run** → you should see **Success** (no red error).

### Step 3 — (Optional) Confirm table exists

**Table Editor** → you should see **`himfit_profiles`** (may be empty).

---

## Part B — Authentication (magic link)

### Step 4 — Enable Email provider

1. **Authentication** → **Providers** → **Email**.
2. Enable **Email provider**.
3. For a smooth HimFit flow, typical choices:
   - **Confirm email**: can stay **on** (user must click link from inbox — you’re already doing that with magic link).
   - **Secure email change** / **Secure password change**: optional for magic-link-only.
4. Save.

### Step 5 — Site URL & redirect URLs (critical)

1. **Authentication** → **URL configuration**.
2. **Site URL** (exactly — use your real GitHub Pages URL):

   `https://winstonac.github.io/HimFit/`

   If this is still **`http://localhost:…`**, Supabase will put **localhost** in emails and Safari will fail on your phone. Change it to your **live** URL.

3. **Redirect URLs** — add **each** of these (one per line):

   - `https://winstonac.github.io/HimFit/`
   - `https://winstonac.github.io/HimFit/**` (if Supabase allows wildcards in your dashboard)
   - For local testing: `http://localhost:8081/` (or whatever port you use)

4. In **`himfit-config.js`**, set **`HIMFIT_AUTH_REDIRECT_URL`** to that **same** live URL (see `himfit-config.example.js`). HimFit sends this to Supabase as `emailRedirectTo`. If you only relied on “current page” and once clicked **Send link** from **localhost**, the email would open **localhost** on your phone — the fixed URL prevents that.

> The link in the email must match an allowed redirect, or sign-in will fail after the user taps it.

---

## Part C — Branded HimFit emails (templates)

Supabase sends **different** emails from **different** templates. If your inbox shows **“Confirm your signup”** with the default gray Supabase look, that is **not** the Magic Link template — you must style **that** template too.

**Copy-paste files (avoids broken preview / markdown):**

| What | File in repo |
|------|----------------|
| Magic link **subject** (one line) | **`docs/email-magic-link-subject.txt`** |
| Magic link **HTML body** | **`docs/email-magic-link-body.html`** |

1. **Authentication** → **Email Templates** → **Magic link**.
2. Paste **subject** from `email-magic-link-subject.txt`.
3. Open `email-magic-link-body.html` → select all → copy → paste into the template body (use **Source** / HTML mode if available).
4. **Save**.

5. **Same dashboard** → **Confirm signup** (or **Confirm your email**): paste the **same** HTML body and a matching subject (e.g. `HimFit — confirm your email`). **Do not remove** `{{ .ConfirmationURL }}` on the button.

**Do not remove** `{{ .ConfirmationURL }}` or `{{ .Email }}` in any template that uses them. Support line uses plain `info@williamacampbell.com` — edit that file if you want a different address.

Full walkthrough for Step 3 + Step 4 together: **`docs/STEP_3_AND_4.md`**.

---

## Part D — “Full” branded **From** address (optional but luxe)

Supabase’s default “from” address looks generic. For **`training@yourdomain.com`** (or similar):

1. Use a transactional email provider (**Resend**, **SendGrid**, **Postmark**, etc.) and verify your domain.
2. Supabase → **Project Settings** → **Authentication** → **SMTP Settings**.
3. Enter host, port, user, password, and **Sender email** + **Sender name** (e.g. `HimFit`).

Until SMTP is set, branded **design** still works in the inbox; only the **from** line stays Supabase-branded.

---

## Part E — Frontend (GitHub Pages)

### Why the browser needs URL + `anon` key (read this if Step 4 felt scary)

- Supabase **already stores** your project URL and keys in the dashboard. You are **copying** the pieces the **website** needs to call Auth + your database over HTTPS.
- The **`anon` `public` key** is **designed to ship in front-end apps**. It is **not** a private password. Access is limited by **RLS** (your policies): users can only read/write **their own** `himfit_profiles` row.
- **Never** paste the **`service_role`** key into `himfit-config.js`, `index.html`, or GitHub — that key **bypasses RLS** and must stay server-side only.

There is **no** magic way for a static GitHub Pages app to sign people in **without** the `anon` key being present in the JavaScript the browser downloads. If the repo is public and that bothers you, use a **private repo** or accept that the anon key is public by design (same as most Supabase + SPA tutorials).

### Step 6 — API keys (copy from dashboard)

1. Supabase → **Project Settings** → **API**.
2. Copy:
   - **Project URL**
   - **anon public** key (NOT `service_role`)

### Step 7 — `himfit-config.js` in the repo

Edit **`himfit-config.js`** at the repo root:

```javascript
window.HIMFIT_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
window.HIMFIT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
window.HIMFIT_AUTH_REDIRECT_URL = 'https://winstonac.github.io/HimFit/';
// After you sign in once: Dashboard → Authentication → Users → copy your UUID:
window.HIMFIT_STRAVA_OWNER_USER_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

3. **Commit** and **push** to **`main`**.
4. Wait 1–3 minutes for **GitHub Pages** to refresh.

### Step 8 — Smoke test

1. Open the live HimFit URL (or a local static server with the same redirect URL allowlisted in Supabase).
2. You should see the full-screen **Sign in** gate (when URL + anon key are set). Enter your email → **Send link**.
3. Open the **HimFit**-styled email → **Enter HimFit**.
4. You should land on the app **signed in** (session in browser). Complete or skip **profile** as usual.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Email never arrives | Spam folder; Supabase **Auth** logs; rate limits |
| Link opens app but not signed in | **Redirect URLs** and **Site URL** must match your real URL (including trailing slash) |
| Email link opens **localhost** on phone | **Site URL** must be your live HTTPS URL, not localhost. Set **`HIMFIT_AUTH_REDIRECT_URL`** in `himfit-config.js` to that live URL, push, request a **new** magic link |
| Wrong / ugly **confirm signup** email | Supabase uses a **separate** template — copy your HimFit HTML into **Confirm signup** as well as **Magic link** (Part C) |
| “Invalid API key” | You pasted `service_role` instead of **anon** — fix `himfit-config.js` |
| Table errors on save | RLS policies + table name **`himfit_profiles`** exactly |

---

## Files in this repo

| File | Role |
|------|------|
| `himfit-config.js` | URL, anon key, **`HIMFIT_AUTH_REDIRECT_URL`** (live magic-link target); optional Strava owner UUID |
| `himfit-config.example.js` | Copy starter |
| `index.html` | Supabase client + **Sign in** UX |
| `docs/ACCOUNTS_AND_SYNC.md` | Architecture notes |
