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
2. **Site URL** (exactly):

   `https://winstonac.github.io/HimFit/`

3. **Redirect URLs** — add **each** of these (one per line):

   - `https://winstonac.github.io/HimFit/`
   - `https://winstonac.github.io/HimFit/**` (if Supabase allows wildcards in your dashboard)
   - For local testing: `http://localhost:8081/` (or whatever port you use)

> The link in the email must match an allowed redirect, or sign-in will fail after the user taps it.

---

## Part C — Branded HimFit emails (templates)

1. **Authentication** → **Email Templates**.
2. Use the **subject lines** and **HTML bodies** below. **Do not remove** the Supabase variables (e.g. `{{ .ConfirmationURL }}`) or the link will break.

### Magic Link — **Subject**

```
HimFit — your private entrance
```

### Magic Link — **Body** (HTML)

Paste this entire block into the **Magic link** template in the dashboard:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HimFit</title>
</head>
<body style="margin:0;padding:0;background-color:#14080c;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#14080c;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:linear-gradient(165deg,#2d1520 0%,#1a0a0f 45%,#141418 100%);border:1px solid rgba(201,152,74,0.25);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:40px 36px 28px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:#9a9590;">HimFit</p>
              <h1 style="margin:0;font-size:36px;line-height:1;font-weight:400;color:#f0eeeb;letter-spacing:0.02em;">Your journey<br><span style="color:#c9984a;">awaits</span></h1>
              <p style="margin:22px 0 0;font-size:15px;line-height:1.65;color:#c4bfb8;font-weight:300;">A single, discreet link — no password. Tap below to return to your program, signed in.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 32px;text-align:center;">
              <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:16px 36px;background:linear-gradient(165deg,rgba(201,152,74,0.2) 0%,rgba(139,38,53,0.25) 100%);border:1px solid rgba(201,152,74,0.45);border-radius:10px;color:#f0eeeb;text-decoration:none;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;font-family:Arial,sans-serif;">Enter HimFit</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 36px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#6a6560;">If you didn’t request this, you may ignore this note.</p>
              <p style="margin:16px 0 0;font-size:11px;line-height:1.5;color:#5a5550;">{{ .Email }}</p>
            </td>
          </tr>
        </table>
        <p style="margin:28px 0 0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#4a4540;">Twelve weeks · strength · half marathon build</p>
      </td>
    </tr>
  </table>
</body>
</html>
```

> **Variable check:** Supabase must still inject `{{ .ConfirmationURL }}` into the **href** of the button. If your dashboard shows a different variable name for magic links, replace only that token — see [Auth email templates](https://supabase.com/docs/guides/auth/auth-email-templates).

### Optional — **Confirm signup** (if you use “confirm email” + signup flow)

**Subject:** `HimFit — confirm your email`

Use the same layout as above but replace the button **href** with `{{ .ConfirmationURL }}` (confirm template uses the same variable in most Supabase versions).

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
```

3. **Commit** and **push** to **`main`**.
4. Wait 1–3 minutes for **GitHub Pages** to refresh.

### Step 8 — Smoke test

1. Open the live HimFit URL.
2. **Overview** → **Sign in** (hero) or scroll to **Settings → Sign in**.
3. Enter your email → **Send link**.
4. Open the **HimFit**-styled email → **Enter HimFit**.
5. You should land on the app **signed in** (session in browser). Complete or skip **profile** as usual.

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Email never arrives | Spam folder; Supabase **Auth** logs; rate limits |
| Link opens app but not signed in | **Redirect URLs** and **Site URL** must match your real URL (including trailing slash) |
| “Invalid API key” | You pasted `service_role` instead of **anon** — fix `himfit-config.js` |
| Table errors on save | RLS policies + table name **`himfit_profiles`** exactly |

---

## Files in this repo

| File | Role |
|------|------|
| `himfit-config.js` | URL + anon key (empty = sign-in UI explains setup) |
| `himfit-config.example.js` | Copy starter |
| `index.html` | Supabase client + **Sign in** UX |
| `docs/ACCOUNTS_AND_SYNC.md` | Architecture notes |
