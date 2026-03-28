# Step 3 & 4 — email templates + connect live app for multiple testers

## Step 3 — Email templates (Supabase)

HimFit sends two types of email: **Confirm signup** (when email confirmation is on) and **Reset password**.

### Confirm signup template

1. Open **`docs/email-magic-link-subject.txt`** in this repo — copy the one line.
2. Supabase → **Authentication** → **Email templates** → **Confirm signup**.
3. Paste that line into the **Subject** field.
4. Open **`docs/email-magic-link-body.html`** — select all (Cmd+A), copy.
5. In Supabase, paste into the **Confirm signup** template body (use **Source / raw HTML mode**).
6. **Do not change** `{{ .ConfirmationURL }}` on the button — this is the confirmation link.
7. **Save**.

### Reset password template

Repeat steps 1–7 for **Reset Password** template. Use a subject like `Winston Fit — reset your password`.

**Preview note:** Supabase's preview is often narrow; real inboxes (Gmail, etc.) usually look closer to a full-width layout.

---

## Step 4 — Connect the live app (multiple testers)

### 4a — URLs (if not done yet)

**Authentication** → **URL configuration**

- **Site URL:** `https://winstonac.github.io/HimFit/` (adjust if your URL differs).
- **Redirect URLs:** add the same URL (+ `http://localhost:8081/` for local tests if you want).

### 4b — Keys into `winston-fit-config.js`

1. Supabase → **Project Settings** → **API**.
2. Copy **Project URL** and **anon public** key (long string starting with `eyJ` — **not** `service_role`).

3. In the HimFit repo, edit **`winston-fit-config.js`** at the project root:

```javascript
window.WINSTONFIT_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
window.WINSTONFIT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...paste-rest-here';
window.WINSTONFIT_AUTH_REDIRECT_URL = 'https://winstonac.github.io/HimFit/';
```

4. Save, **commit**, **push to `main`**, wait ~1–3 minutes for GitHub Pages.

### 4c — Verify

1. Open your **live** HimFit URL in an incognito window.
2. You should see the **Sign in** gate (email + password fields).
3. Tap **Create Account**, enter email + password → tap **Create Account**.
4. If email confirmation is on: check inbox → click the confirmation link → return and **Sign In**.
5. The app opens and the **profile intake form** appears automatically.
6. Fill in the profile → tap **Save profile**.
7. **Overview** tab should show your personalised stats and the correct weekly split.

**Multiple testers:** each person creates their own account; each gets their own auth user and (via RLS) their own `winstonfit_profiles` row. No extra code — same deployed app for everyone.
