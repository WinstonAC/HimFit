# Next steps: testers + magic link (~20 min)

## What testers see now

1. Open **https://winstonac.github.io/HimFit/** (or your URL).
2. **Overview** has a **Tester sign-in** button → scrolls to **Settings → Tester sign-in**.
3. **Magic link email** does **not** open a separate “login page.” It opens the **same app URL**; Supabase completes sign-in in the background. Then the **profile / intake** overlay still appears if they have not finished intake on that device.

## You (host) — do this once

1. **Supabase** → new project → **SQL Editor** → run the script in `docs/ACCOUNTS_AND_SYNC.md`.
2. **Authentication** → **Providers** → **Email** → enable; use magic link / OTP as you prefer.
3. **Authentication** → **URL configuration**  
   - **Site URL:** `https://winstonac.github.io/HimFit/`  
   - **Redirect URLs:** add the same (trailing slash must match what you use).
4. **Authentication** → **Email templates** → edit **Magic Link** (subject + body). Say it’s HimFit; the `{{ .ConfirmationURL }}` link must stay.
5. **Project Settings** → **API** → copy **URL** + **anon public** key into **`himfit-config.js`** → commit → push **`main`** → wait for GitHub Pages.

## Optional: branded “from” address

**Project Settings** → **Auth** → **SMTP** (SendGrid, Resend, etc.) so mail comes from your domain instead of Supabase default.

## Icon

`icon-512.png` is the home-screen icon (burgundy + gold shoe + weight motif). Clear site data / reinstall PWA to refresh cached icon on a phone.
