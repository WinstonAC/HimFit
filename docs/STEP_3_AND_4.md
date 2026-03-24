# Step 3 & 4 — exact copy + finish for multiple users

## Step 3 — Magic link email (Supabase)

1. Open **`docs/email-magic-link-subject.txt`** in this repo — copy the **one line** (no extra spaces).
2. Supabase → **Authentication** → **Email templates** → **Magic link**.
3. Paste that line into the **Subject** field.
4. Open **`docs/email-magic-link-body.html`** — select **all** (Cmd+A), copy.
5. In Supabase, paste into the **Magic link** template body (use **Source** / raw HTML mode if the editor offers it).
6. **Save**.

**Do not change** `{{ .ConfirmationURL }}` on the sign-in button.  
To use a different support address, edit the `mailto:` and visible email in `email-magic-link-body.html` only (plain text / `href`, not `{{ }}`).

**Preview note:** Supabase’s preview is often narrow; real inboxes (Gmail, etc.) usually look closer to a full-width layout.

---

## Step 4 — Connect the live app (multiple users)

### 4a — URLs (if not done yet)

**Authentication** → **URL configuration**

- **Site URL:** `https://winstonac.github.io/HimFit/` (adjust if your URL differs; match how you open the site).
- **Redirect URLs:** add the same URL (+ `http://localhost:8081/` for local tests if you want).

### 4b — Keys into `himfit-config.js`

1. Supabase → **Project Settings** → **API**.
2. Copy **Project URL** and **anon public** key (long string starting with `eyJ` — **not** `service_role`).

3. In the HimFit repo, edit **`himfit-config.js`** at the project root to look exactly like this (replace the two quoted values):

```javascript
window.HIMFIT_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
window.HIMFIT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...paste-rest-here';
```

4. Save, **commit**, **push to `main`**, wait ~1–3 minutes for GitHub Pages.

### 4c — Verify

1. Open your **live** HimFit URL in a browser (or incognito).
2. **Overview** → **Sign in** (or scroll to **Settings → Sign in**).
3. Enter an email → **Send link** → use the email → **Enter HimFit** → you should be signed in.

**Multiple users:** each person uses their own email; each gets their own auth user and (via RLS) their own `himfit_profiles` row. No extra code — same deployed app for everyone.
