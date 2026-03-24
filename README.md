# HimFit

**12-week** half-marathon build **plus** strength training. Mobile-first, **PWA-ready**, static web app (single `index.html` + assets).

**Live site (GitHub Pages):** [https://winstonac.github.io/HimFit/](https://winstonac.github.io/HimFit/)

**Repository:** [https://github.com/WinstonAC/HimFit](https://github.com/WinstonAC/HimFit)

---

## What you get (user-facing)

| Area | Details |
|------|---------|
| **Overview** | Phases, weekly split, protocols, **Settings** (Strava toggle, profile edit, optional **cloud account**) |
| **Today** | Full day: lifts, runs, KB, sauna notes; **reps, rest text, Zone 2 duration, and run tips** adjust from your **goals** |
| **Plan** | 12-week grid; banner when **goals** are active (not only “general”) |
| **Runs** | Optional Strava embed + **manual run log** + history |
| **Fuel** | Meals by **eating style** (omnivore / pescatarian / vegetarian / vegan), **week rotation** across **3 meal sets**, optional **salad-forward** tips + shopping list |
| **Shop** | List built from Fuel ingredients |

### Profile & intake

- First visit opens a **profile** form (skip with **Continue with defaults**).
- **Units:** **kg/cm** or **lb / ft·in** (stored internally as kg + cm; display follows your choice).
- **Goals:** up to **three** checkboxes (e.g. lose fat + endurance). Drives workout bias (reps, rests, Thursday easy run length, run notes). **Fertility** option appears only if **sex is female**.
- **Eating style** + **meal preference** (balanced vs salad-forward) affect Fuel.
- **Running comfort** scales Tuesday quality runs and Saturday long run blocks.
- **Edit profile:** **Overview → Settings → Profile → Edit** (profile strip at top is read-only).

### Data: device vs cloud

- **Default:** everything lives in the browser **`localStorage`** key `hf4` (this device only). Different phones = different people; nothing is mixed automatically.
- **Optional:** if the maintainer configures **Supabase** (see [`docs/ACCOUNTS_AND_SYNC.md`](docs/ACCOUNTS_AND_SYNC.md)), testers can **sign in with email (magic link)** and **sync** progress to their own row. Still **no cross-user analytics** in the app itself unless you add them in Supabase later.

---

## Run locally

```bash
cd /path/to/HimFit
python3 -m http.server 8081
```

Open **http://localhost:8081** (use another port if busy).

Use a **private/incognito** window for a clean first-run intake test; a normal window keeps existing saved data.

---

## Deploy: GitHub Pages (current)

Pages serves **static files** from this repo—**no Vercel required** for the app to work or for optional Supabase login (the browser talks to Supabase directly).

1. Repo → **Settings → Pages** → source: **`main`**, folder **`/` (root)**.
2. Site URL: **https://winstonac.github.io/HimFit/**

Merge to **`main`** when you want the live site updated.

### Vercel / Netlify (optional)

Any **static host** works the same way: connect the repo, no build step, publish the root. Use Vercel **only if you want** their dashboard, previews, or **serverless functions** (e.g. Strava OAuth with a **secret**—not solvable with Pages alone). **Moving to Vercel does not by itself add multi-user accounts**; accounts need **auth + database** (e.g. Supabase), documented separately.

---

## Optional cloud sign-in (maintainers)

1. Create a Supabase project and run the SQL in **[`docs/ACCOUNTS_AND_SYNC.md`](docs/ACCOUNTS_AND_SYNC.md)**.
2. Copy **`himfit-config.example.js`** to **`himfit-config.js`** and add your **project URL** and **anon key** (safe to expose with RLS; never put the **service role** key in the frontend).
3. Enable **Email** auth (magic link) and add your exact **redirect URL** (e.g. `https://winstonac.github.io/HimFit/`).
4. Deploy **`himfit-config.js`** with the site (or use a private fork for pilot keys).

If `himfit-config.js` is missing or keys are empty, the app behaves **offline-first** only.

---

## Strava

- The **iframe** is **off by default** so visitors don’t see a fixed athlete embed.
- **Overview → Settings → Strava embed** toggles it (saved locally).
- **Manual run log** ≠ Strava API. Per-user Strava needs **OAuth + backend** (e.g. Vercel function)—see roadmap in `docs/ACCOUNTS_AND_SYNC.md`.

---

## PWA

- `manifest.json` + `icon-512.png` support **Add to Home Screen**.

---

## Developer notes

| Topic | Location |
|-------|----------|
| **Accounts, sync, roadmap (Strava, analytics)** | [`docs/ACCOUNTS_AND_SYNC.md`](docs/ACCOUNTS_AND_SYNC.md) |
| **Supabase config template** | `himfit-config.example.js` → `himfit-config.js` |

### `localStorage` (`hf4`)

Rough shape: `week`, `day`, `done`, `runs`, `shopList`, `stravaConnected`, `intakeComplete`, `planKey`, `intake` (includes `goals`, `diet`, `unitPref`, `mealStyle`, …).

### Upgrades from older saves

- Missing **`intakeComplete`** but existing runs/completions → treated as onboarded.
- Missing **`stravaConnected`** → defaults to `false`.
- Legacy single **`goal`** → migrated to **`goals`** array on load.

---

## Related

- **HerFit** (Melody’s program) is a **separate repo**; this repo is **HimFit** only.
