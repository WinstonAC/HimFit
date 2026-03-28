# Winston Fit × Supabase — complete setup (order of operations)

Do these **in order**. Your live app URL in examples: `https://winstonac.github.io/HimFit/` (change if yours differs).

---

## Part A — Supabase project & database

### Step 1 — Create project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Choose region, set a database password (save it somewhere safe).
3. Wait until the project is **healthy / ready**.

### Step 2 — Create `winstonfit_profiles` + RLS

1. Supabase → **SQL Editor** → **New query**.
2. Open the repo file **`sql/supabase_himfit_profiles.sql`**, copy all of it, paste into the editor, **Run**.
3. **Run** → you should see **Success** (no red error).

### Step 3 — (Optional) Confirm table exists

**Table Editor** → you should see **`winstonfit_profiles`** (may be empty).

---

## Part B — Authentication (email + password)

HimFit uses **email + password** sign-in. Users create an account directly from the sign-in screen — no magic link required.

### Step 4 — Enable Email provider

1. **Authentication** → **Providers** → **Email**.
2. Enable **Email provider**.
3. Recommended settings for testers:
   - **Confirm email**: leave **on** — users confirm via email before they can sign in (safer).
     Turn **off** only if you want instant sign-in during testing (no confirmation email).
   - **Secure email change** / **Secure password change**: leave at defaults.
4. Save.

### Step 5 — Site URL & redirect URLs (critical)

1. **Authentication** → **URL configuration**.
2. **Site URL** (exactly — use your real GitHub Pages URL):

   `https://winstonac.github.io/HimFit/`

   If this is still **`http://localhost:…`**, confirmation emails will contain localhost links and fail on phones. Change it to your **live** URL.

3. **Redirect URLs** — add each of these:

   - `https://winstonac.github.io/HimFit/`
   - `https://winstonac.github.io/HimFit/**` (if Supabase allows wildcards)
   - For local testing: `http://localhost:8081/`

4. In **`winston-fit-config.js`**, set **`WINSTONFIT_AUTH_REDIRECT_URL`** to that same live URL. This is used for password-reset emails so the link always opens the deployed app.

---

## Part C — Email templates (confirmation + password reset)

Supabase sends emails for **Confirm signup** and **Reset password**. The branded HimFit templates are in the repo.

**Copy-paste files:**

| What | File in repo |
|------|----------------|
| Magic link / confirmation **subject** | **`docs/email-magic-link-subject.txt`** |
| Magic link / confirmation **HTML body** | **`docs/email-magic-link-body.html`** |

1. **Authentication** → **Email Templates** → **Confirm signup**.
2. Paste subject from `email-magic-link-subject.txt` (or write your own: `Winston Fit — confirm your email`).
3. Open `email-magic-link-body.html` → select all → copy → paste into the template body (use **Source/HTML mode**).
4. **Do not remove** `{{ .ConfirmationURL }}` on the button — that is the confirmation link.
5. **Save**.

6. Repeat for **Reset Password** template (use same HTML, update subject to `Winston Fit — reset your password`).

**Phone vs desktop:** This repo's HTML uses tables + inline styles + 16px body for best mobile rendering. After pulling updates, re-paste into Supabase — the dashboard does not auto-sync from GitHub.

Full walkthrough for Step 3 + 4 together: **`docs/STEP_3_AND_4.md`**.

---

## Part D — Branded "From" address (optional)

Supabase's default from address looks generic. For `training@yourdomain.com`:

1. Use a transactional email provider (Resend, SendGrid, Postmark) and verify your domain.
2. Supabase → **Project Settings** → **Authentication** → **SMTP Settings**.
3. Enter host, port, user, password, and **Sender email** + **Sender name** (e.g. `Winston Fit`).

---

## Part E — Frontend (GitHub Pages)

### Why the browser needs URL + `anon` key

- The **`anon` `public` key** is **designed to ship in front-end apps**. It is not a private password. Access is controlled by **RLS** (your policies): users can only read/write **their own** `winstonfit_profiles` row.
- **Never** paste the **`service_role`** key into `winston-fit-config.js`, `index.html`, or GitHub — that key bypasses RLS.

### Step 6 — API keys (copy from dashboard)

1. Supabase → **Project Settings** → **API**.
2. Copy:
   - **Project URL**
   - **anon public** key (NOT `service_role`)

### Step 7 — `winston-fit-config.js` in the repo

Edit **`winston-fit-config.js`** at the repo root:

```javascript
window.WINSTONFIT_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
window.WINSTONFIT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
window.WINSTONFIT_AUTH_REDIRECT_URL = 'https://winstonac.github.io/HimFit/';
// After you sign in once: Dashboard → Authentication → Users → copy your UUID:
window.WINSTONFIT_STRAVA_OWNER_USER_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

3. **Commit** and **push** to **`main`**.
4. Wait 1–3 minutes for **GitHub Pages** to refresh.

### Step 8 — Smoke test

1. Open the live HimFit URL in an incognito window.
2. You should see the full-screen **Sign in** gate.
3. Tap **Create Account**, enter an email and password, tap **Create Account**.
4. If email confirmation is on: check inbox → click the confirmation link → return to app and **Sign In** with the same email + password.
5. If email confirmation is off: you are signed in immediately.
6. The app opens and the **profile intake form** appears — fill it in.
7. On the **Overview** tab you should see your name, days/week, and goal stats populated.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Confirmation email never arrives | Spam folder; Supabase **Auth** logs; rate limits |
| "That email and password don't match" after sign-up | Email confirmation is on — confirm your email first |
| "Please confirm your email" error | Check inbox (and spam) for the confirmation link |
| Confirmation link opens app but user not signed in | **Redirect URLs** and **Site URL** in Supabase must match your real URL (including trailing slash) |
| Confirmation link opens **localhost** | **Supabase → Authentication → URL configuration → Site URL** must be your live app URL, not localhost. Also set `WINSTONFIT_AUTH_REDIRECT_URL` in `winston-fit-config.js` to the live URL. Request a new confirmation email after fixing. |
| Wrong / missing **Confirm signup** email styling | Paste HimFit HTML into the **Confirm signup** template (Part C above) |
| "Invalid API key" | You pasted `service_role` instead of **anon** — fix `winston-fit-config.js` |
| Table errors on save | Check RLS policies; table name must be `winstonfit_profiles` exactly |
| Profile/intake form doesn't open after first sign-in | Check browser console for JS errors; ensure you are on the latest `main` |

---

## Files in this repo

| File | Role |
|------|------|
| `winston-fit-config.js` | URL, anon key, `WINSTONFIT_AUTH_REDIRECT_URL` (password-reset redirect target); optional Strava owner UUID |
| `winston-fit-config.example.js` | Copy starter |
| `index.html` | Supabase client + sign-in UX (email + password) |
| `sql/supabase_himfit_profiles.sql` | Profiles table + RLS |
| `sql/push_subscriptions.sql` | Push notification subscriptions table + RLS |
| `docs/ACCOUNTS_AND_SYNC.md` | Architecture notes |
| `docs/PUSH_NOTIFICATIONS_SETUP.md` | Push notification Edge Function setup |
